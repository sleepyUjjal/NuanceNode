import json
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun

# Initialize the Search Tool
search_tool = DuckDuckGoSearchRun()

# Initialize Ollama Model with Qwen 3.5 (4B)
llm = ChatOllama(
    model="qwen3.5:4b", 
    temperature=0.1,    
    format="json"       
)

def analyze_claim_with_context_tree(claim: str) -> dict:
    """
    Takes a news claim, searches the web, and runs it through the 4-Node Context Tree
    via local Qwen model.
    """

    try:
        search_results = search_tool.invoke(claim)
    except Exception as e:
        search_results = "Live search failed. Analyze purely based on language, logic, and general knowledge."

    # Note: Double curly braces {{ }} for LangChain

    prompt_template = """
    You are 'NuanceNode', an advanced investigative AI fact-checker.
    Your job is to analyze the following claim using a 4-Node Context Tree approach.

    User Claim: "{claim}"
    Live Web Search Context: "{search_results}"

    Analyze the claim across these 4 nodes:
    1. Facts Node: What raw data, official records, or verifiable events exist based on the search context?
    2. Sources Node: Are reputable news organizations reporting this? Is there a consensus, or is it isolated?
    3. Logic & Fallacies Node: Analyze the language. Is it emotionally charged? Does it use logical fallacies (e.g., ad hominem, strawman, urgency)?
    4. Anatomy of Belief Node: Empathize with the target audience. Why might a rational person believe this? What underlying fear or hope does this exploit?

    Additionally, build a "Context Tree" — a structured breakdown of the strongest reasons this claim could be TRUE and the strongest reasons it could be FALSE. Each reason must be a concise, evidence-based point (not speculation). Rate each branch's weight as "Strong", "Moderate", or "Weak".

    You MUST output ONLY a valid JSON object. Do not include markdown formatting like ```json.
    The JSON structure must exactly match this:
    {{
        "verdict": "Provide a short verdict (e.g., 'Verifiably Fake', 'Lacks Context', 'Likely True')",
        "confidence_score": 85,
        "facts": "Your analysis for node 1...",
        "sources": "Your analysis for node 2...",
        "logic_analysis": "Your analysis for node 3...",
        "anatomy_of_belief": "Your analysis for node 4...",
        "context_tree": {{
            "why_it_may_be_true": [
                {{
                    "reason": "Concise reason supporting the claim...",
                    "weight": "Strong | Moderate | Weak",
                    "evidence": "Specific supporting evidence or source from search context..."
                }}
            ],
            "why_it_may_be_false": [
                {{
                    "reason": "Concise reason contradicting the claim...",
                    "weight": "Strong | Moderate | Weak",
                    "evidence": "Specific contradicting evidence or source from search context..."
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
        response = chain.invoke({"claim": claim, "search_results": search_results})
        
        # Parse the JSON string from Ollama
        result_dict = json.loads(response.content)
        return result_dict
        
    except json.JSONDecodeError:
        print("Failed to parse JSON. Raw output:", response.content)

        # Fallback schema matching the exact structure to prevent frontend crashes
        return {
            "verdict": "Error processing claim",
            "confidence_score": 0,
            "facts": "Local AI failed to return valid JSON.",
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
        return {"error": "Make sure Ollama app is running and qwen3.5:4b is pulled."}