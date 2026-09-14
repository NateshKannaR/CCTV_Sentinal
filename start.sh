#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "================================================================="
echo "  GUJARAT POLICE SENTINEL - INNOVATION CHALLENGE 2026 PROTOTYPE  "
echo "================================================================="

if [ ! -d ".venv" ]; then
    echo "[!] Virtual environment not found. Setting up with uv..."
    uv venv --python 3.11 .venv
    uv pip install --python .venv/bin/python fastapi uvicorn websockets pydantic httpx opencv-python-headless numpy pillow geopy reportlab
fi

# Build frontend if dist doesn't exist
if [ ! -d "frontend/dist" ]; then
    echo "[*] Building frontend assets..."
    cd frontend && npm run build && cd ..
fi

echo "[*] Initializing Database & Generating Evidence Snapshots..."
.venv/bin/python -c "from backend.app.db import init_db; from backend.app.generate_snapshots import generate_sample_snapshots; init_db(); generate_sample_snapshots()"

PORT=${PORT:-8080}

if [ "$1" == "dev" ]; then
    echo "[*] Starting in Development Mode (FastAPI + Vite Dev Server)..."
    .venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT --reload &
    BACKEND_PID=$!
    cd frontend && npm run dev &
    FRONTEND_PID=$!
    trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
    wait
else
    echo "[*] Starting Unified Production Server on http://localhost:$PORT..."
    echo "[*] Open your browser at http://localhost:$PORT"
    exec .venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
fi
