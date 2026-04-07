import os

# Set base URL (env variable or default)
BASE_URL = os.getenv("API_BASE_URL", "").rstrip("/")
FRONTEND_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")

def get_pdf_download_link(chat_id: str) -> str:
    """Return the PDF download path or absolute URL, depending on configuration."""
    suffix = f"/report/{chat_id}/download"
    return f"{BASE_URL}{suffix}" if BASE_URL else suffix

def get_shareable_web_link(chat_id: str, frontend_url: str | None = None) -> str:
    """Return the frontend URL for sharing the report."""
    resolved_frontend_url = (frontend_url or FRONTEND_URL).rstrip("/")
    return f"{resolved_frontend_url}/shared-report/{chat_id}"
