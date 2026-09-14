import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

SNAPSHOTS_DIR = DATA_DIR / "snapshots"
SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "sentinel.db"

# Sentinel Sandbox Settings
SENTINEL_SANDBOX_HOST = os.getenv("SENTINEL_SANDBOX_HOST", "https://sentinel.gujarat.gov.in")
SENTINEL_INGEST_API = f"{SENTINEL_SANDBOX_HOST}/api/ingest"
RTSP_TRANSPORT = "tcp"

# Server Host & Port
API_HOST = os.getenv("HOST", "0.0.0.0")
API_PORT = int(os.getenv("PORT", "8080"))

# MongoDB Atlas Connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://Natesh:Natesh@cluster0.wwp3oig.mongodb.net/?retryWrites=true&w=majority")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "sentinel_cctv")

# Indian Number Plate Regex Pattern
PLATE_REGEX = r"^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$"

