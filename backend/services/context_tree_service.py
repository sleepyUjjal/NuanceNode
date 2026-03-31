from typing import Any, Dict, List


def _safe_list(value: Any) -> List[Any]:
    if isinstance(value, list):
        return value
    if value in (None, ""):
        return []
    return [value]


def _safe_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _listify_strings(value: Any) -> List[str]:
    items = _safe_list(value)
    result: List[str] = []
    for item in items:
        text = _safe_text(item)
        if text:
            result.append(text)
    return result


def _extract_summary(node: Dict[str, Any]) -> str:
    if not isinstance(node, dict):
        return ""
    return _safe_text(node.get("summary"))


def _build_reason_objects(items: List[str], default_weight: str, evidence: str) -> List[Dict[str, str]]:
    reason_objects: List[Dict[str, str]] = []
    for item in items:
        explanation = item
        reason = item.split(":", 1)[0][:120].strip() if ":" in item else item[:120].strip()
        if not reason:
            continue
        reason_objects.append(
            {
                "reason": reason,
                "explanation": explanation,
                "weight": default_weight,
                "evidence": evidence,
            }
        )
    return reason_objects


def build_context_tree(facts_node: dict, sources_node: dict, logic_node: dict, anatomy_node: dict) -> dict:
    facts_node = facts_node or {}
    sources_node = sources_node or {}
    logic_node = logic_node or {}
    anatomy_node = anatomy_node or {}

    true_items = []
    true_items.extend(_listify_strings(facts_node.get("supporting_evidence")))
    true_items.extend(_listify_strings(logic_node.get("strengths")))
    true_items.extend(_listify_strings(sources_node.get("trusted_sources")))

    false_items = []
    false_items.extend(_listify_strings(facts_node.get("contradictions")))
    false_items.extend(_listify_strings(logic_node.get("weaknesses")))
    false_items.extend(_listify_strings(logic_node.get("fallacies")))
    false_items.extend(_listify_strings(sources_node.get("weak_sources")))

    if not true_items:
        true_items.append("Available evidence does not strongly confirm the claim.")
    if not false_items:
        false_items.append("Available evidence does not strongly refute the claim.")

    return {
        "why_it_may_be_true": _build_reason_objects(
            true_items[:5],
            default_weight="Medium",
            evidence=_extract_summary(facts_node) or _extract_summary(sources_node) or "Limited corroborating evidence.",
        ),
        "why_it_may_be_false": _build_reason_objects(
            false_items[:5],
            default_weight="Medium",
            evidence=_extract_summary(logic_node) or _extract_summary(sources_node) or "Limited counter-evidence summary.",
        ),
        "belief_drivers": {
            "summary": _extract_summary(anatomy_node),
            "why_people_believe_it": _listify_strings(anatomy_node.get("why_people_believe_it")),
            "spread_factors": _listify_strings(anatomy_node.get("spread_factors")),
        },
    }


def merge_node_outputs(
    claim: str,
    facts_node: dict,
    sources_node: dict,
    logic_node: dict,
    anatomy_node: dict,
    rag_meta: dict,
    search_meta: dict,
) -> dict:
    facts_node = facts_node or {}
    sources_node = sources_node or {}
    logic_node = logic_node or {}
    anatomy_node = anatomy_node or {}
    rag_meta = rag_meta or {}
    search_meta = search_meta or {}

    context_tree = build_context_tree(facts_node, sources_node, logic_node, anatomy_node)

    meta = {
        "model": "ollama",
        "rag_used": bool(rag_meta.get("retrieval_count", 0)),
        "search_used": bool(search_meta.get("search_available", False)),
        "retrieval_count": rag_meta.get("retrieval_count", 0),
        "retrieval_strategy": rag_meta.get("retrieval_strategy", "none"),
        "search_provider": search_meta.get("search_provider", "duckduckgo"),
    }

    return {
        "verdict": "Unverified",
        "confidence_score": 35,
        "facts": {
            "summary": _extract_summary(facts_node) or "Limited factual synthesis available.",
            "key_points": _listify_strings(facts_node.get("key_points")),
            "supporting_evidence": _listify_strings(facts_node.get("supporting_evidence")),
            "contradictions": _listify_strings(facts_node.get("contradictions")),
            "open_questions": _listify_strings(facts_node.get("open_questions")),
        },
        "sources": {
            "summary": _extract_summary(sources_node) or "Limited source synthesis available.",
            "trusted_sources": _listify_strings(sources_node.get("trusted_sources")),
            "weak_sources": _listify_strings(sources_node.get("weak_sources")),
            "coverage_gaps": _listify_strings(sources_node.get("coverage_gaps")),
            "source_quality": _safe_text(sources_node.get("source_quality")) or "Unknown",
        },
        "logic_analysis": {
            "summary": _extract_summary(logic_node) or "Limited logic synthesis available.",
            "strengths": _listify_strings(logic_node.get("strengths")),
            "weaknesses": _listify_strings(logic_node.get("weaknesses")),
            "assumptions": _listify_strings(logic_node.get("assumptions")),
            "fallacies": _listify_strings(logic_node.get("fallacies")),
            "consistency_check": _safe_text(logic_node.get("consistency_check")),
        },
        "anatomy_of_belief": {
            "summary": _extract_summary(anatomy_node) or "Limited belief-dynamics synthesis available.",
            "why_people_believe_it": _listify_strings(anatomy_node.get("why_people_believe_it")),
            "spread_factors": _listify_strings(anatomy_node.get("spread_factors")),
            "emotional_drivers": _listify_strings(anatomy_node.get("emotional_drivers")),
            "cognitive_biases": _listify_strings(anatomy_node.get("cognitive_biases")),
            "resilience_factors": _listify_strings(anatomy_node.get("resilience_factors")),
        },
        "context_tree": context_tree,
        "meta": meta,
        "claim": claim,
    }