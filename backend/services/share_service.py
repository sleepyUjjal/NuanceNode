import json
import logging

logger = logging.getLogger(__name__)


def build_og_html(chat, request_url: str, frontend_origin: str) -> str:
    """Build an HTML page with Open Graph meta tags and a redirect to the frontend."""
    verdict_text = "Analysis Complete"
    try:
        if chat.analysis_report:
            report_data = json.loads(chat.analysis_report)
            verdict_text = report_data.get("verdict", "Unverified").upper()
    except Exception:
        pass

    # Escape HTML-sensitive characters in claim text
    safe_claim = chat.claim.replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')

    title = f"Verdict: {verdict_text}"
    description = f"NuanceNode Fact Review: '{safe_claim}'"
    redirect_url = f"{frontend_origin}/public/{chat.id}"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{request_url}">
    <meta property="og:site_name" content="NuanceNode">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{description}">
    <meta http-equiv="refresh" content="0; url={redirect_url}">
    <script>window.location.href = "{redirect_url}";</script>
</head>
<body style="background: #111; color: #eee; font-family: sans-serif; padding: 2rem;">
    <p>Loading NuanceNode Report...</p>
    <p><a href="{redirect_url}" style="color: #c9a84c;">Click here if you are not redirected automatically</a></p>
</body>
</html>"""


def build_public_report(chat) -> dict:
    """Build the unauthenticated JSON response for a public report."""
    try:
        report_data = json.loads(chat.analysis_report) if chat.analysis_report else {}
    except Exception:
        report_data = {}

    return {
        "id": chat.id,
        "claim": chat.claim,
        "report": report_data,
        "created_at": chat.created_at,
    }


def resolve_frontend_origin(allow_origins: list, request_base_url: str) -> str:
    """Determine the frontend origin for redirects.
    
    In production ALLOWED_ORIGINS contains the real frontend domain.
    In local dev (wildcard), swap backend port 8000 → Vite port 5173.
    """
    if allow_origins and allow_origins[0] != "*":
        return allow_origins[0].rstrip("/")

    base = str(request_base_url).rstrip("/")
    return base.replace(":8000", ":5173")
