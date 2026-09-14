import os
import time
import json
import logging
import asyncio
import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime

# Set protocol requirement from Sentinel Integrator's Guide Section 2
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"

import cv2
import numpy as np

logger = logging.getLogger("sentinel.ingest")

class SentinelIngestClient:
    """
    Client for consuming the Sentinel Camera Grid according to the official
    Gujarat Police Integrator's Guide.
    """
    def __init__(self, host_url: str = "https://sentinel.gujarat.gov.in"):
        self.host_url = host_url
        self.ingest_endpoint = f"{host_url.rstrip('/')}/api/ingest"
        self.cameras: List[Dict[str, Any]] = []

    async def fetch_catalogue(self) -> List[Dict[str, Any]]:
        """
        Queries /api/ingest to retrieve live camera catalogue.
        Falls back gracefully if sandbox host is unreachable or requires auth.
        """
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(self.ingest_endpoint)
                if res.status_code == 200:
                    data = res.json()
                    self.cameras = data if isinstance(data, list) else data.get("cameras", [])
                    logger.info(f"Successfully fetched {len(self.cameras)} cameras from Sentinel sandbox")
                    return self.cameras
        except Exception as e:
            logger.warning(f"Could not reach {self.ingest_endpoint} ({e}). Using internal state registry.")
        return []

    def connect_stream(self, rtsp_url: str, max_retries: int = 5):
        """
        Connects to RTSP stream strictly forcing TCP, tolerating H.264/H.265
        initial sync warnings and looping discontinuities.
        """
        retry_count = 0
        backoff_sec = 2.0

        while retry_count < max_retries:
            try:
                cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
                if cap.isOpened():
                    return cap
            except Exception as e:
                logger.warning(f"Connection attempt failed on {rtsp_url}: {e}")

            retry_count += 1
            time.sleep(backoff_sec)
            backoff_sec = min(backoff_sec * 2.0, 30.0)

        return None

class MockStreamGenerator:
    """
    Generates synthetic CCTV video frames with animated traffic, moving vehicles,
    and timestamps for offline evaluation or sandbox demonstration.
    """
    def __init__(self, camera_id: str, camera_name: str, location_name: str):
        self.camera_id = camera_id
        self.camera_name = camera_name
        self.location_name = location_name
        self.frame_idx = 0

    def generate_frame(self, target_plate: Optional[str] = None) -> bytes:
        self.frame_idx += 1
        width, height = 640, 360
        
        # Dark asphalt background
        frame = np.full((height, width, 3), (35, 38, 42), dtype=np.uint8)

        # Draw road lanes
        cv2.line(frame, (100, 360), (260, 100), (80, 80, 80), 3)
        cv2.line(frame, (540, 360), (380, 100), (80, 80, 80), 3)
        
        # Center dashed line
        offset = (self.frame_idx * 6) % 60
        for y in range(120 + offset, 360, 60):
            cv2.line(frame, (320, y), (320, min(y + 30, 360)), (255, 255, 255), 2)

        # Animated vehicle position
        veh_progress = (self.frame_idx * 4) % 400
        vy = int(100 + (veh_progress / 400.0) * 220)
        vx = int(240 + (veh_progress / 400.0) * 80)
        vw = int(40 + (veh_progress / 400.0) * 60)
        vh = int(25 + (veh_progress / 400.0) * 45)

        # Draw Vehicle bounding box
        is_target = (target_plate is not None)
        color = (50, 50, 230) if is_target else (60, 180, 60) # Red if target
        cv2.rectangle(frame, (vx, vy), (vx + vw, vy + vh), color, 2)

        # Vehicle label
        label = target_plate if is_target else "GJ01-TRAFFIC"
        cv2.putText(frame, label, (vx, max(vy - 8, 20)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)

        # Gujarat Police CCTV HUD
        pts_ms = int(time.time() * 1000) % 10000000
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        
        # Header bar
        cv2.rectangle(frame, (0, 0), (width, 32), (15, 23, 42), -1)
        cv2.putText(frame, f"GP-SENTINEL: {self.camera_id} | {self.camera_name}", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 255, 200), 1)

        # Footer bar
        cv2.rectangle(frame, (0, height - 28), (width, height), (15, 23, 42), -1)
        cv2.putText(frame, f"TIME: {now_str} | PTS: {pts_ms}ms | TCP/H.264", (10, height - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1)

        # Reticle
        cv2.drawMarker(frame, (width // 2, height // 2), (0, 255, 200), cv2.MARKER_CROSS, 20, 1)

        # Encode to JPEG
        _, jpeg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        return jpeg.tobytes()
