import json
import re
from typing import Any, Dict


_JSON_OBJECT_PATTERN = re.compile(r"\{.*\}", re.DOTALL)


def _json_instruction() -> str:
    return (
        'Return ONLY valid JSON. Do not use markdown fences. '
        'Use concise, evidence-aware language. '
        'If evidence is weak or missing, say so explicitly.'
    )


def build_facts_prompt(claim: str, rag_summary: str) -> str:
    return f"""
You are the Facts Node in a multi-step fact-checking system.

Claim:
"{claim}"

Prior chat retrieval context:
{rag_summary or "No prior retrieval context available."}

Task:
- Extract only the most relevant factual observations related to the claim.
- Use prior chat context as background, not as unquestioned truth.
- Separate established facts from uncertainty.
- Note contradictions or missing evidence when relevant.

{_json_instruction()}

JSON schema:
{{
  "summary": "Short evidence-grounded summary.",
  "key_points": ["Fact or observation 1", "Fact or observation 2"],
  "supporting_evidence": ["Evidence item"],
  "contradictions": ["Contradiction or limitation"],
  "open_questions": ["Unknown or unresolved point"]
}}
""".strip()


def build_sources_prompt(claim: str, search_summary: str) -> str:
    return f"""
You are the Sources Node in a multi-step fact-checking system.

Claim:
"{claim}"

Live search context:
{search_summary or "No live search results available."}

Task:
- Evaluate the quality and diversity of the available source signals.
- Distinguish stronger source types from weaker ones.
- Mention gaps, low-quality evidence, or missing corroboration.
- Do not invent URLs.

{_json_instruction()}

JSON schema:
{{
  "summary": "Short source-quality summary.",
  "trusted_sources": ["High-quality source signal"],
  "weak_sources": ["Weak, anecdotal, or low-confidence source signal"],
  "coverage_gaps": ["What is missing from the available source landscape"],
  "source_quality": "High / Medium / Low / Mixed"
}}
""".strip()


def build_logic_prompt(claim: str, evidence_summary: str) -> str:
    return f"""
You are the Logic Node in a multi-step fact-checking system.

Claim:
"{claim}"

Evidence summary:
{evidence_summary or "Limited evidence summary available."}

Task:
- Analyze the reasoning quality behind the claim.
- Identify strengths, weaknesses, assumptions, and possible fallacies.
- Explain whether the evidence actually supports the claim as stated.

{_json_instruction()}

JSON schema:
{{
  "summary": "Short reasoning summary.",
  "strengths": ["Reasoning strength"],
  "weaknesses": ["Reasoning weakness"],
  "assumptions": ["Underlying assumption"],
  "fallacies": ["Potential fallacy or manipulation pattern"],
  "consistency_check": "How well the claim aligns with the available evidence"
}}
""".strip()


def build_anatomy_prompt(claim: str, node_summaries: str) -> str:
    return f"""
You are the Anatomy Node in a multi-step fact-checking system.

Claim:
"{claim}"

Inputs from other nodes:
{node_summaries or "Node summaries unavailable."}

Task:
- Explain why people might believe or spread this claim.
- Identify emotional, social, cognitive, and media dynamics.
- Note what keeps the claim persuasive even if evidence is weak.
- Keep the analysis structured and non-judgmental.

{_json_instruction()}

JSON schema:
{{
  "summary": "Short summary of belief dynamics.",
  "why_people_believe_it": ["Belief driver"],
  "spread_factors": ["Factor that helps the claim spread"],
  "emotional_drivers": ["Emotion or instinct involved"],
  "cognitive_biases": ["Relevant bias or heuristic"],
  "resilience_factors": ["Why the claim persists despite challenges"]
}}
""".strip()


def build_verdict_prompt(claim: str, merged_node_summary: str) -> str:
    return f"""
You are the final Verdict Node in a multi-step fact-checking system.

Claim:
"{claim}"

Merged node summary:
{merged_node_summary or "Merged node summary unavailable."}

Task:
- Produce a final verdict using the combined evidence.
- Use one of: True, False, Misleading, Unverified, Likely True, Likely False.
- Confidence score must be an integer from 0 to 100.
- Be conservative when evidence is mixed or incomplete.

{_json_instruction()}

JSON schema:
{{
  "verdict": "Unverified",
  "confidence_score": 0,
  "summary": "Short final verdict rationale",
  "key_considerations": ["Most important factor 1", "Most important factor 2"]
}}
""".strip()


def parse_json_response(content: str, fallback: Dict[str, Any]) -> Dict[str, Any]:
    if not content:
        return dict(fallback)

    cleaned = str(content).strip()

    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

    candidates = [cleaned]
    match = _JSON_OBJECT_PATTERN.search(cleaned)
    if match:
        candidates.insert(0, match.group(0))

    for candidate in candidates:
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, dict):
                merged = dict(fallback)
                merged.update(parsed)
                return merged
        except Exception:
            continue

    return dict(fallback)