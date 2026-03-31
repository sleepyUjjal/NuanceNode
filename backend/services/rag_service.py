import json
from typing import Any, Dict, List

from sqlalchemy.orm import Session

try:
    from .. import models
except ImportError:
    import models


def _safe_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    try:
        return json.dumps(value, ensure_ascii=False)
    except Exception:
        return str(value).strip()


def _normalize_whitespace(value: str) -> str:
    return " ".join((value or "").split()).strip()


def _truncate(value: str, limit: int = 400) -> str:
    value = _normalize_whitespace(value)
    if len(value) <= limit:
        return value
    return value[: limit - 3].rstrip() + "..."


def _extract_report_summary(report_data: Any) -> str:
    if isinstance(report_data, dict):
        parts: List[str] = []

        verdict = _safe_text(report_data.get("verdict"))
        confidence = report_data.get("confidence_score")
        if verdict:
            if confidence not in (None, ""):
                parts.append(f"Verdict: {verdict} (confidence: {confidence})")
            else:
                parts.append(f"Verdict: {verdict}")

        for key in ("facts", "sources", "logic_analysis", "anatomy_of_belief"):
            value = report_data.get(key)
            text = _safe_text(value)
            if text:
                parts.append(f"{key.replace('_', ' ').title()}: {text}")

        context_tree = report_data.get("context_tree")
        if context_tree:
            parts.append(f"Context Tree: {_safe_text(context_tree)}")

        return _truncate(" | ".join(part for part in parts if part), 700)

    return _truncate(_safe_text(report_data), 700)


def _score_chat_match(claim: str, chat: models.Chat) -> int:
    claim_terms = {term for term in claim.lower().split() if len(term) > 3}
    combined_text = f"{chat.claim or ''} {chat.analysis_report or ''}".lower()
    overlap = sum(1 for term in claim_terms if term in combined_text)
    recency_bonus = int(getattr(chat, "id", 0) or 0)
    return overlap * 1000 + recency_bonus


def build_claim_rag_context(claim: str, db: Session, user_id: int | None = None) -> Dict[str, Any]:
    fallback = {
        "retrieved_items": [],
        "retrieval_summary": "No prior chat context available.",
        "retrieval_count": 0,
        "retrieval_strategy": "none",
    }

    if db is None:
        fallback["retrieval_summary"] = "Database session unavailable for prior chat retrieval."
        return fallback
    if user_id is None:
        fallback["retrieval_summary"] = "User scope unavailable for prior chat retrieval."
        fallback["retrieval_strategy"] = "missing_user_scope"
        return fallback

    try:
        chats = (
            db.query(models.Chat)
            .filter(models.Chat.user_id == user_id)
            .order_by(models.Chat.created_at.desc())
            .limit(25)
            .all()
        )
    except Exception:
        fallback["retrieval_summary"] = "Failed to retrieve prior chats from database."
        fallback["retrieval_strategy"] = "db_error"
        return fallback

    if not chats:
        return fallback

    ranked_chats = sorted(chats, key=lambda chat: _score_chat_match(claim, chat), reverse=True)
    selected = ranked_chats[:3]

    retrieved_items: List[Dict[str, Any]] = []
    summary_lines: List[str] = []

    for chat in selected:
        parsed_report: Any
        try:
            parsed_report = json.loads(chat.analysis_report) if chat.analysis_report else {}
        except Exception:
            parsed_report = chat.analysis_report or ""

        item = {
            "chat_id": getattr(chat, "id", None),
            "claim": _truncate(_safe_text(getattr(chat, "claim", "")), 220),
            "report_summary": _extract_report_summary(parsed_report),
            "created_at": _safe_text(getattr(chat, "created_at", "")),
        }
        retrieved_items.append(item)
        summary_lines.append(
            f"- Prior claim: {item['claim']} | Summary: {item['report_summary']}"
        )

    retrieval_summary = "Relevant prior analyses:\n" + "\n".join(summary_lines) if summary_lines else fallback["retrieval_summary"]

    return {
        "retrieved_items": retrieved_items,
        "retrieval_summary": retrieval_summary,
        "retrieval_count": len(retrieved_items),
        "retrieval_strategy": "chat_history_keyword_overlap_recency",
    }
