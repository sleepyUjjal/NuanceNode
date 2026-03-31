from typing import Any, Dict, List

from langchain_community.tools import DuckDuckGoSearchRun


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(str(value).split()).strip()


def _truncate(value: str, limit: int = 1800) -> str:
    value = _normalize_text(value)
    if len(value) <= limit:
        return value
    return value[: limit - 3].rstrip() + "..."


def _summarize_lines(raw_results: str, max_lines: int = 6) -> str:
    cleaned = _normalize_text(raw_results)
    if not cleaned:
        return "No live search results available."

    chunks: List[str] = []
    for separator in [". ", " | ", "\n"]:
        if separator in raw_results:
            chunks = [part.strip() for part in raw_results.split(separator) if part.strip()]
            break

    if not chunks:
        chunks = [cleaned]

    selected = chunks[:max_lines]
    summary_lines = [f"- {item}" for item in selected]
    return "\n".join(summary_lines)


def fetch_claim_search_context(claim: str) -> Dict[str, Any]:
    fallback = {
        "raw_results": "Search unavailable.",
        "summarized_results": "No live search results available.",
        "search_available": False,
        "search_provider": "duckduckgo",
    }

    try:
        search_tool = DuckDuckGoSearchRun()
        raw_results = search_tool.invoke(claim)
        raw_results = _truncate(raw_results)
        return {
            "raw_results": raw_results,
            "summarized_results": _summarize_lines(raw_results),
            "search_available": True,
            "search_provider": "duckduckgo",
        }
    except Exception as exc:
        fallback["raw_results"] = f"Search unavailable: {_normalize_text(exc)}"
        return fallback