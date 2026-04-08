import json
from typing import Any, Dict

import yaml
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.responses import Response

OPENAPI_TAGS = [
    {
        "name": "Authentication",
        "description": "User registration and login endpoints for obtaining bearer tokens.",
    },
    {
        "name": "Analysis",
        "description": "Claim analysis workflow powered by retrieval, live search, and multi-node reasoning.",
    },
    {
        "name": "History",
        "description": "Endpoints for reading and deleting previously analyzed claims.",
    },
    {
        "name": "Reports",
        "description": "Download generated PDF reports for completed analyses.",
    },
    {
        "name": "Documentation",
        "description": "Machine-readable OpenAPI schema export endpoints.",
    },
]


def get_app_docs_config() -> Dict[str, Any]:
    return {
        "title": "NuanceNode API",
        "description": (
            "NuanceNode analyzes claims using retrieval-augmented context, live source lookup, "
            "logic review, and belief-dynamics modeling.\n\n"
            "Use the Swagger UI to explore and test endpoints. "
            "You can also download the OpenAPI schema in JSON or YAML format from the documentation routes."
        ),
        "version": "1.0.0",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "openapi_url": "/openapi.json",
        "openapi_tags": OPENAPI_TAGS,
        "swagger_ui_parameters": {
            "displayRequestDuration": True,
            "tryItOutEnabled": True,
            "defaultModelsExpandDepth": -1,
            "docExpansion": "list",
        },
    }


def custom_openapi(app: FastAPI) -> Dict[str, Any]:
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=OPENAPI_TAGS,
    )
    openapi_schema["info"]["contact"] = {
        "name": "Ujjaldeep",
        "email": "ujjaldeep.work@gmail.com",
    }
    openapi_schema["info"]["x-logo"] = {
        "url": "https://raw.githubusercontent.com/sleepyUjjal/NuanceNode/main/frontend/public/favicon.svg"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


def attach_custom_openapi(app: FastAPI) -> None:
    app.openapi = lambda: custom_openapi(app)


def build_openapi_json_response(app: FastAPI) -> Response:
    schema_json = json.dumps(app.openapi(), indent=2)
    return Response(
        content=schema_json,
        media_type="application/json",
        headers={"Content-Disposition": 'attachment; filename="nuancenode-openapi.json"'},
    )


def build_openapi_yaml_response(app: FastAPI) -> Response:
    schema_yaml = yaml.safe_dump(app.openapi(), sort_keys=False, allow_unicode=True)
    return Response(
        content=schema_yaml,
        media_type="application/yaml",
        headers={"Content-Disposition": 'attachment; filename="nuancenode-openapi.yaml"'},
    )
