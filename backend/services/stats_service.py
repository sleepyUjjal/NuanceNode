import json
import logging

logger = logging.getLogger(__name__)

# Verdict keywords
_FALSE_KEYWORDS = ("false", "fake", "misleading", "fabricated", "debunked")
_TRUE_KEYWORDS = ("true", "verified", "confirmed", "accurate", "likely true")


def compute_user_stats(chats) -> dict:
    """Compute personal analytics from a user's chat history."""
    total = 0
    falsehoods = 0
    verified_true = 0
    confidence_sum = 0
    scored_count = 0

    for chat in chats:
        total += 1
        try:
            report = json.loads(chat.analysis_report) if chat.analysis_report else {}
        except Exception:
            continue

        verdict = (report.get("verdict") or "").lower()
        if any(kw in verdict for kw in _FALSE_KEYWORDS):
            falsehoods += 1
        elif any(kw in verdict for kw in _TRUE_KEYWORDS):
            verified_true += 1

        score = report.get("confidence_score")
        if score is not None:
            try:
                confidence_sum += float(score)
                scored_count += 1
            except (ValueError, TypeError):
                pass

    return {
        "total_claims": total,
        "falsehoods_detected": falsehoods,
        "verified_true": verified_true,
        "avg_confidence": round(confidence_sum / scored_count, 1) if scored_count > 0 else 0,
    }
