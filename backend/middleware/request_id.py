"""
Request ID Middleware.

Assigns a unique identifier to every request for distributed tracing.
If the incoming request already carries an X-Request-ID header (e.g. forwarded
by an ALB or Nginx), that value is reused; otherwise a new UUID4 is generated.

The ID is stored on ``request.state.request_id`` and echoed back in the
``X-Request-ID`` response header so clients can reference it in support tickets.
"""

import uuid

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


class RequestIDMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Reuse upstream request ID (ALB / Nginx) or generate a new one
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        request.state.request_id = request_id

        response: Response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
