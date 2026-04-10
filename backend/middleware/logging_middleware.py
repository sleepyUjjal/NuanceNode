"""
Structured Request Logging Middleware.

Logs every HTTP request/response cycle with method, path, status code,
duration, client IP, and request ID. Output is structured for easy ingestion
by CloudWatch, Datadog, or any JSON-aware log aggregator.

Health-check and documentation paths are skipped to reduce noise.
"""

import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("nuancenode.access")

# Paths that generate high-frequency, low-value log lines
_SKIP_PATHS: set[str] = {"/health", "/docs", "/redoc", "/openapi.json", "/favicon.ico"}


class RequestLoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.url.path in _SKIP_PATHS:
            return await call_next(request)

        start = time.perf_counter()
        response: Response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 2)

        request_id = getattr(request.state, "request_id", "-")
        client_ip = _get_client_ip(request)

        logger.info(
            "method=%s path=%s status=%s duration_ms=%s ip=%s request_id=%s",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
            client_ip,
            request_id,
        )

        return response


def _get_client_ip(request: Request) -> str:
    """Extract the real client IP, respecting X-Forwarded-For from Nginx/ALB."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # X-Forwarded-For: client, proxy1, proxy2 → take the first (client)
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
