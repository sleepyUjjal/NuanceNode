"""
Rate Limiter Configuration (SlowApi + Redis).

Provides a configured ``Limiter`` instance backed by Redis in production or
an in-memory store for local development.

Two key functions are exported for use in route decorators:
  - ``get_remote_address``  → rate-limit by client IP (for public routes like /login)
  - ``get_user_id_or_ip``   → rate-limit by authenticated user ID, falling back to IP

Usage in routes::

    from middleware.rate_limiter import limiter

    @app.post("/login")
    @limiter.limit("5/minute")
    def login(request: Request, ...):
        ...
"""

import logging
import os

from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Storage backend
# ---------------------------------------------------------------------------

REDIS_URL = os.getenv("REDIS_URL")
RATE_LIMIT_DEFAULT = os.getenv("RATE_LIMIT_DEFAULT", "60/minute")

if REDIS_URL:
    _storage_uri = REDIS_URL
    logger.info("Rate limiter using Redis: %s", REDIS_URL.split("@")[-1])  # hide password
else:
    _storage_uri = "memory://"
    logger.warning(
        "REDIS_URL not set — rate limiter using in-memory storage. "
        "Limits will NOT be shared across workers. Set REDIS_URL for production."
    )

# ---------------------------------------------------------------------------
# Key functions
# ---------------------------------------------------------------------------


def get_user_id_or_ip(request: Request) -> str:
    """
    Return authenticated user ID if available, otherwise fall back to client IP.
    This allows per-user rate limiting on authenticated routes while still
    protecting unauthenticated access by IP.
    """
    # Set by the get_current_user dependency after JWT verification
    if hasattr(request.state, "current_user_id"):
        return f"user:{request.state.current_user_id}"

    # Fallback: respect X-Forwarded-For from Nginx/ALB
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)


# ---------------------------------------------------------------------------
# Limiter instance
# ---------------------------------------------------------------------------

limiter = Limiter(
    key_func=get_user_id_or_ip,
    default_limits=[RATE_LIMIT_DEFAULT],
    storage_uri=_storage_uri,
    strategy="fixed-window",
)
