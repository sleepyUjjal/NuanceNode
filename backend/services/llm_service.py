import json
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun

# Initialize Search Tool
search_tool = DuckDuckGoSearchRun()

# Faster + optimized Ollama model
llm = ChatOllama(
    model="mistral:7b",
    temperature=0.1,
    num_ctx=2048
)

def analyze_claim_with_context_tree(claim: str) -> dict:
    """
    Analyze a claim using a 4-node context tree with faster performance.
    """

    # Get search results
    try:
        search_results = search_tool.invoke(claim)[:1000]
    except Exception:
        search_results = "Search unavailable. Analyze using general knowledge."


    prompt_template = """
You are a strict, skeptical fact-checker.

Claim: "{claim}"
Context: "{search_results}"

Rules:
- Do NOT assume claim is true
- Cross-check consistency in context
- Prefer scientific consensus over isolated claims
- If evidence is weak, say "Unverified" or "Likely False"
- Blogs/social media ≠ strong evidence

Analyze:

1. facts → Only widely supported, verifiable facts  
2. sources → Classify: trusted (research, govt, major news) vs weak (blogs, opinion)  
3. logic_analysis → Detect exaggeration, fear-mongering, pseudo-science  
4. anatomy_of_belief → Why people believe this (fear, confusion, etc.)

Decision rules:
- Strong scientific consensus against → Likely False  
- Mixed/unclear evidence → Unverified  
- Only weak sources supporting → Likely False  

Output STRICT JSON:

{{
  "verdict": "",
  "confidence_score": 0,
  "facts": "",
  "sources": "",
  "logic_analysis": "",
  "anatomy_of_belief": "",
  "context_tree": {{
    "why_it_may_be_true": [
      {{
        "reason": "",
        "weight": "Weak",
        "evidence": ""
      }}
    ],
    "why_it_may_be_false": [
      {{
        "reason": "",
        "weight": "Strong",
        "evidence": ""
      }}
    ]
  }}
}}
    """

    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["claim", "search_results"]
    )

    chain = prompt | llm

    try:
        response = chain.invoke({
            "claim": claim,
            "search_results": search_results
        })

        # Try parsing response
        content = response.content.strip()

        # Fix common JSON issues
        if content.startswith("```"):
            content = content.split("```")[1]

        result_dict = json.loads(content)
        return result_dict

    except json.JSONDecodeError:
        print("JSON parse failed. Raw:", response.content)

        return {
            "verdict": "Parsing Error",
            "confidence_score": 0,
            "facts": "Model output invalid JSON.",
            "sources": "N/A",
            "logic_analysis": "N/A",
            "anatomy_of_belief": "N/A",
            "context_tree": {
                "why_it_may_be_true": [],
                "why_it_may_be_false": []
            }
        }

    except Exception as e:
        print(f"Ollama Error: {e}")
        return {
            "error": "Ensure Ollama is running and model is pulled."
        }