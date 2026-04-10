"""
Security Headers Middleware.

Injects a set of hardened HTTP response headers on every response to protect
against common web vulnerabilities (clickjacking, MIME sniffing, XSS, etc.).

These headers are a baseline — adjust values as your frontend CSP needs evolve.
"""

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

# Header name → value
_SECURITY_HEADERS: dict[str, str] = {
    # Force HTTPS for 2 years, including subdomains
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    # Prevent MIME-type sniffing
    "X-Content-Type-Options": "nosniff",
    # Prevent clickjacking — DENY is safest for API backends
    "X-Frame-Options": "DENY",
    # Limit referrer leakage
    "Referrer-Policy": "strict-origin-when-cross-origin",
    # Disable unused browser APIs
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    # Legacy XSS filter hint (still respected by some browsers)
    "X-XSS-Protection": "1; mode=block",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response: Response = await call_next(request)
        for header, value in _SECURITY_HEADERS.items():
            response.headers.setdefault(header, value)
        return response
