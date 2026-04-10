"""
Middleware registration for the NuanceNode backend.

All middleware classes are registered here in a single function.
Order matters: last added = outermost in the Starlette middleware stack.

To add new middleware:
  1. Create backend/middleware/your_middleware.py
  2. Add app.add_middleware(YourMiddleware) in register_all_middleware() below.
"""

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .error_handler import ErrorHandlerMiddleware
from .logging_middleware import RequestLoggingMiddleware
from .rate_limiter import limiter
from .request_id import RequestIDMiddleware
from .security_headers import SecurityHeadersMiddleware

logger = logging.getLogger(__name__)


def register_all_middleware(app: FastAPI) -> None:
    """
    Attach all middleware to the FastAPI application.

    Starlette processes middleware in reverse registration order (last registered
    middleware is the outermost layer), so register innermost middleware FIRST.

    Request flow after registration:
        GZip → TrustedHost → SecurityHeaders → RequestID → ErrorHandler → Logging → [Route]
    """

    # --- SlowApi rate limiter state + exception handler ---
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # --- Inner middleware (closest to route handlers) ---

    # 1. Logging — logs after everything else has processed
    app.add_middleware(RequestLoggingMiddleware)

    # 2. Error handler — catches unhandled exceptions before they reach logging
    app.add_middleware(ErrorHandlerMiddleware)

    # 3. Request ID — must be available for error handler and logging
    app.add_middleware(RequestIDMiddleware)

    # 4. Security headers — applied to every response
    app.add_middleware(SecurityHeadersMiddleware)

    # --- Outer middleware ---

    # 5. Trusted Host — reject spoofed Host headers
    allowed_hosts_raw = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1")
    allowed_hosts = [h.strip() for h in allowed_hosts_raw.split(",") if h.strip()]
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

    # 6. GZip compression — outermost, compresses final response bytes
    app.add_middleware(GZipMiddleware, minimum_size=500)

    logger.info(
        "Middleware registered: GZip, TrustedHost(%s), SecurityHeaders, RequestID, ErrorHandler, Logging, RateLimiter",
        allowed_hosts,
    )
