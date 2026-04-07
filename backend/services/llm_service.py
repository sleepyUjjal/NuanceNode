import json
import os
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict

from langchain_ollama import ChatOllama

from .context_tree_service import merge_node_outputs
from .prompt_service import (
    build_anatomy_prompt,
    build_facts_prompt,
    build_logic_prompt,
    build_sources_prompt,
    build_verdict_prompt,
    parse_json_response,
)
from .rag_service import build_claim_rag_context
from .search_service import fetch_claim_search_context


DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "mistral:7b")
DEFAULT_TEMPERATURE = float(os.getenv("OLLAMA_TEMPERATURE", "0.1"))
DEFAULT_NUM_CTX = int(os.getenv("OLLAMA_NUM_CTX", "4096"))


def _get_llm() -> ChatOllama:
    return ChatOllama(
        model=DEFAULT_MODEL,
        temperature=DEFAULT_TEMPERATURE,
        num_ctx=DEFAULT_NUM_CTX,
    )


def _safe_json_node(summary: str, default_key: str, extra: Dict[str, Any] | None = None) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
        "summary": summary,
        "items": [],
    }
    if extra:
        payload.update(extra)
    if default_key not in payload:
        payload[default_key] = payload["items"]
    return payload


def _default_facts_node(rag_context: Dict[str, Any] | None = None) -> Dict[str, Any]:
    rag_context = rag_context or {}
    return {
        "summary": "No reliable prior-chat facts were retrieved; using fallback analysis.",
        "key_points": [],
        "supporting_evidence": [],
        "contradictions": [],
        "open_questions": [],
        "retrieved_items": rag_context.get("retrieved_items", []),
        "retrieval_summary": rag_context.get("retrieval_summary", ""),
    }


def _default_sources_node(search_context: Dict[str, Any] | None = None) -> Dict[str, Any]:
    search_context = search_context or {}
    return {
        "summary": "Live source search was unavailable or inconclusive.",
        "trusted_sources": [],
        "weak_sources": [],
        "coverage_gaps": [],
        "source_quality": "Unknown",
        "raw_results": search_context.get("raw_results", ""),
        "search_summary": search_context.get("summarized_results", ""),
    }


def _default_logic_node() -> Dict[str, Any]:
    return {
        "summary": "Logic review fallback: insufficient structured evidence for a deeper logic critique.",
        "strengths": [],
        "weaknesses": [],
        "assumptions": [],
        "fallacies": [],
        "consistency_check": "Evidence review was incomplete, so logical consistency remains uncertain.",
    }


def _default_anatomy_node() -> Dict[str, Any]:
    return {
        "summary": "Belief-anatomy fallback: people may accept the claim due to uncertainty, repetition, or partial evidence.",
        "why_people_believe_it": [],
        "spread_factors": [],
        "emotional_drivers": [],
        "cognitive_biases": [],
        "resilience_factors": [],
    }


def _default_verdict(claim: str) -> Dict[str, Any]:
    return {
        "verdict": "Unverified",
        "confidence_score": 35,
        "facts": {
            "summary": f"Unable to fully verify the claim: {claim}",
            "key_points": [],
            "supporting_evidence": [],
            "contradictions": [],
            "open_questions": [],
        },
        "sources": {
            "summary": "Source review incomplete.",
            "trusted_sources": [],
            "weak_sources": [],
            "coverage_gaps": [],
            "source_quality": "Unknown",
        },
        "logic_analysis": _default_logic_node(),
        "anatomy_of_belief": _default_anatomy_node(),
        "context_tree": {
            "why_it_may_be_true": [],
            "why_it_may_be_false": [],
        },
        "meta": {
            "model": DEFAULT_MODEL,
            "rag_used": False,
            "search_used": False,
        },
    }


def _normalize_confidence(value: Any) -> int:
    if isinstance(value, float) and value <= 1:
        return max(0, min(100, int(value * 100)))
    if isinstance(value, int):
        return max(0, min(100, value))
    try:
        parsed = float(value)
        if parsed <= 1:
            parsed *= 100
        return max(0, min(100, int(parsed)))
    except Exception:
        return 0


def _invoke_json_prompt(prompt_text: str, fallback: Dict[str, Any]) -> Dict[str, Any]:
    try:
        llm = _get_llm()
        response = llm.invoke(prompt_text)
        content = getattr(response, "content", "") or ""
        return parse_json_response(content, fallback)
    except Exception:
        return fallback


def _build_evidence_summary(facts_node: Dict[str, Any], sources_node: Dict[str, Any]) -> str:
    facts_summary = facts_node.get("summary", "")
    sources_summary = sources_node.get("summary", "")
    trusted_sources = sources_node.get("trusted_sources", [])
    weak_sources = sources_node.get("weak_sources", [])
    return (
        f"Facts summary: {facts_summary}\n"
        f"Sources summary: {sources_summary}\n"
        f"Trusted sources: {trusted_sources}\n"
        f"Weak sources: {weak_sources}"
    )


def _build_node_summaries(
    facts_node: Dict[str, Any],
    sources_node: Dict[str, Any],
    logic_node: Dict[str, Any],
) -> str:
    return (
        f"Facts node: {json.dumps(facts_node, ensure_ascii=False)}\n"
        f"Sources node: {json.dumps(sources_node, ensure_ascii=False)}\n"
        f"Logic node: {json.dumps(logic_node, ensure_ascii=False)}"
    )


def _run_facts_node(claim: str, rag_context: Dict[str, Any] | None = None) -> Dict[str, Any]:
    rag_context = rag_context or {}
    fallback = _default_facts_node(rag_context)
    prompt_text = build_facts_prompt(claim, rag_context.get("retrieval_summary", ""))
    facts_node = _invoke_json_prompt(prompt_text, fallback)
    if "summary" not in facts_node:
        facts_node["summary"] = fallback["summary"]
    facts_node.setdefault("key_points", [])
    facts_node.setdefault("supporting_evidence", [])
    facts_node.setdefault("contradictions", [])
    facts_node.setdefault("open_questions", [])
    facts_node.setdefault("retrieved_items", rag_context.get("retrieved_items", []))
    facts_node.setdefault("retrieval_summary", rag_context.get("retrieval_summary", ""))
    return facts_node


def _run_sources_node(claim: str) -> tuple[Dict[str, Any], Dict[str, Any]]:
    search_context = fetch_claim_search_context(claim)
    fallback = _default_sources_node(search_context)
    prompt_text = build_sources_prompt(claim, search_context.get("summarized_results", ""))
    sources_node = _invoke_json_prompt(prompt_text, fallback)
    if "summary" not in sources_node:
        sources_node["summary"] = fallback["summary"]
    sources_node.setdefault("trusted_sources", [])
    sources_node.setdefault("weak_sources", [])
    sources_node.setdefault("coverage_gaps", [])
    sources_node.setdefault("source_quality", fallback["source_quality"])
    sources_node.setdefault("raw_results", search_context.get("raw_results", ""))
    sources_node.setdefault("search_summary", search_context.get("summarized_results", ""))
    return sources_node, search_context


def _run_logic_node(claim: str, evidence_summary: str = "") -> Dict[str, Any]:
    fallback = _default_logic_node()
    prompt_text = build_logic_prompt(claim, evidence_summary)
    logic_node = _invoke_json_prompt(prompt_text, fallback)
    if "summary" not in logic_node:
        logic_node["summary"] = fallback["summary"]
    logic_node.setdefault("strengths", [])
    logic_node.setdefault("weaknesses", [])
    logic_node.setdefault("assumptions", [])
    logic_node.setdefault("fallacies", [])
    logic_node.setdefault("consistency_check", fallback["consistency_check"])
    return logic_node


def _run_anatomy_node(claim: str, node_summaries: str) -> Dict[str, Any]:
    fallback = _default_anatomy_node()
    prompt_text = build_anatomy_prompt(claim, node_summaries)
    anatomy_node = _invoke_json_prompt(prompt_text, fallback)
    if "summary" not in anatomy_node:
        anatomy_node["summary"] = fallback["summary"]
    anatomy_node.setdefault("why_people_believe_it", [])
    anatomy_node.setdefault("spread_factors", [])
    anatomy_node.setdefault("emotional_drivers", [])
    anatomy_node.setdefault("cognitive_biases", [])
    anatomy_node.setdefault("resilience_factors", [])
    return anatomy_node


def _run_verdict_node(claim: str, merged_node_summary: str) -> Dict[str, Any]:
    fallback = {
        "verdict": "Unverified",
        "confidence_score": 35,
        "summary": "Fallback verdict due to model or parsing issues.",
    }
    prompt_text = build_verdict_prompt(claim, merged_node_summary)
    verdict_node = _invoke_json_prompt(prompt_text, fallback)
    verdict_node["confidence_score"] = _normalize_confidence(verdict_node.get("confidence_score", 35))
    verdict_node.setdefault("verdict", "Unverified")
    return verdict_node


def analyze_claim_with_context_tree(claim: str, db=None, user_id: int | None = None) -> dict:
    if not claim or not claim.strip():
        return _default_verdict(claim or "")

    facts_node: Dict[str, Any] = _default_facts_node()
    sources_node: Dict[str, Any] = _default_sources_node()
    logic_node: Dict[str, Any] = _default_logic_node()
    anatomy_node: Dict[str, Any] = _default_anatomy_node()
    rag_context: Dict[str, Any] = {
        "retrieved_items": [],
        "retrieval_summary": "",
        "retrieval_count": 0,
        "retrieval_strategy": "none",
    }
    search_context: Dict[str, Any] = {
        "raw_results": "",
        "summarized_results": "",
        "search_available": False,
        "search_provider": "unknown",
    }

    try:
        rag_context = build_claim_rag_context(claim, db, user_id=user_id)

        with ThreadPoolExecutor(max_workers=3) as executor:
            facts_future = executor.submit(_run_facts_node, claim, rag_context)
            sources_future = executor.submit(_run_sources_node, claim)
            logic_future = executor.submit(_run_logic_node, claim, "")

            facts_node = facts_future.result()
            sources_node, search_context = sources_future.result()
            evidence_summary = _build_evidence_summary(facts_node, sources_node)

            try:
                logic_node = logic_future.result()
                if not logic_node.get("summary") or logic_node.get("summary") == _default_logic_node()["summary"]:
                    logic_node = _run_logic_node(claim, evidence_summary)
            except Exception:
                logic_node = _run_logic_node(claim, evidence_summary)

        node_summaries = _build_node_summaries(facts_node, sources_node, logic_node)
        anatomy_node = _run_anatomy_node(claim, node_summaries)

        merged = merge_node_outputs(
            claim=claim,
            facts_node=facts_node,
            sources_node=sources_node,
            logic_node=logic_node,
            anatomy_node=anatomy_node,
            rag_meta=rag_context,
            search_meta=search_context,
        )

        merged_node_summary = json.dumps(
            {
                "facts": facts_node,
                "sources": sources_node,
                "logic_analysis": logic_node,
                "anatomy_of_belief": anatomy_node,
            },
            ensure_ascii=False,
        )
        verdict_node = _run_verdict_node(claim, merged_node_summary)

        merged["verdict"] = verdict_node.get("verdict", merged.get("verdict", "Unverified"))
        merged["confidence_score"] = _normalize_confidence(
            verdict_node.get("confidence_score", merged.get("confidence_score", 0))
        )

        meta = merged.setdefault("meta", {})
        meta["model"] = DEFAULT_MODEL
        meta["rag_used"] = bool(rag_context.get("retrieval_count", 0))
        meta["search_used"] = bool(search_context.get("search_available", False))
        meta.setdefault("retrieval_count", rag_context.get("retrieval_count", 0))
        meta.setdefault("retrieval_strategy", rag_context.get("retrieval_strategy", "unknown"))
        meta.setdefault("search_provider", search_context.get("search_provider", "unknown"))

        return merged

    except Exception:
        fallback = _default_verdict(claim)
        fallback["meta"]["model"] = DEFAULT_MODEL
        fallback["meta"]["rag_used"] = bool(rag_context.get("retrieval_count", 0))
        fallback["meta"]["search_used"] = bool(search_context.get("search_available", False))
        fallback["meta"]["retrieval_count"] = rag_context.get("retrieval_count", 0)
        fallback["meta"]["retrieval_strategy"] = rag_context.get("retrieval_strategy", "unknown")
        fallback["meta"]["search_provider"] = search_context.get("search_provider", "unknown")
        return fallback
