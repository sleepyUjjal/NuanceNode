import os
from pathlib import Path

from dotenv import load_dotenv

try:
    from supabase import create_client
except Exception:  # pragma: no cover - optional dependency before install
    create_client = None


load_dotenv(Path(__file__).resolve().parents[1] / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "reports")


def is_storage_enabled() -> bool:
    return bool(SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and create_client)


def _get_bucket():
    if not is_storage_enabled():
        raise RuntimeError("Supabase Storage is not configured.")
    client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return client.storage.from_(SUPABASE_STORAGE_BUCKET)


def build_report_storage_path(user_id: str, chat_id: str) -> str:
    return f"reports/{str(user_id).strip()}/{str(chat_id).strip()}.pdf"


def upload_report_pdf(storage_path: str, pdf_bytes: bytes) -> str:
    bucket = _get_bucket()
    bucket.upload(
        storage_path,
        pdf_bytes,
        file_options={
            "content-type": "application/pdf",
            "upsert": "true",
        },
    )
    return storage_path


def download_report_pdf(storage_path: str) -> bytes:
    bucket = _get_bucket()
    return bucket.download(storage_path)


def remove_report_pdf(storage_path: str) -> None:
    bucket = _get_bucket()
    bucket.remove([storage_path])
