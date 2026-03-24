import os

# Set base URL (env variable or default)
BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")

def get_pdf_download_link(chat_id: int) -> str:
    """Return the direct PDF download URL."""
    return f"{BASE_URL}/report/{chat_id}/download"

def get_shareable_web_link(chat_id: int, frontend_url: str = "http://localhost:5173") -> str:
    """Return the frontend URL for sharing the report."""
    return f"{frontend_url}/shared-report/{chat_id}"