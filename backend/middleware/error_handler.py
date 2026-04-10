"""
Error Handler Middleware.

Catches any unhandled exception that would otherwise result in a raw 500 response
with a stack trace. Returns a sanitised JSON response with a reference request ID
so the user can report the issue, while the full traceback is logged server-side.

"""

import logging

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

logger = logging.getLogger(__name__)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        try:
            return await call_next(request)
        except Exception:
            request_id = getattr(request.state, "request_id", "unknown")
            logger.exception(
                "Unhandled exception on %s %s [request_id=%s]",
                request.method,
                request.url.path,
                request_id,
            )
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal server error. Please try again later.",
                    "request_id": request_id,
                },
            )
