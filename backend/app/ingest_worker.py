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
    Generates high-fidelity synthetic CCTV video frames with perspective road rendering,
    moving vehicle models with headlights, sensor noise, speed detection telemetry,
    and official Gujarat Police OSD (On-Screen Display).
    """
    def __init__(self, camera_id: str, camera_name: str, location_name: str):
        self.camera_id = camera_id
        self.camera_name = camera_name
        self.location_name = location_name
        self.frame_idx = 0
        # Deterministic seed based on camera id so each camera looks slightly different
        self.seed = sum(ord(c) for c in camera_id) % 100

    def generate_frame(self, target_plate: Optional[str] = None) -> bytes:
        self.frame_idx += 1
        width, height = 720, 405  # 16:9 HD surveillance resolution

        # 1. Asphalt Road with realistic vertical perspective & horizon
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Horizon & sky / distant terrain (dark ambient surveillance tone)
        horizon_y = 120
        frame[:horizon_y, :] = [20, 24, 28] # Dark ambient sky
        
        # Road asphalt (dark slate grey with slight gradient)
        for y in range(horizon_y, height):
            depth_ratio = (y - horizon_y) / (height - horizon_y)
            shade = int(32 + depth_ratio * 16)
            frame[y, :] = [shade, shade + 2, shade + 5]

        # Road boundaries (perspective trapezoid)
        vanishing_x = width // 2 + ((self.seed * 3) % 40 - 20)
        vanish_pt = (vanishing_x, horizon_y)
        
        road_pts = np.array([
            [vanishing_x - 70, horizon_y],
            [vanishing_x + 70, horizon_y],
            [width - 40, height],
            [40, height]
        ], np.int32)
        cv2.fillPoly(frame, [road_pts], (42, 45, 48))

        # Road shoulders & guardrails (yellow/white road borders)
        cv2.line(frame, (vanishing_x - 70, horizon_y), (40, height), (70, 75, 80), 3)
        cv2.line(frame, (vanishing_x + 70, horizon_y), (width - 40, height), (70, 75, 80), 3)
        cv2.line(frame, (vanishing_x - 65, horizon_y), (50, height), (220, 190, 50), 2) # Yellow line
        cv2.line(frame, (vanishing_x + 65, horizon_y), (width - 50, height), (220, 220, 220), 2) # White line

        # Lane dividers (dashed white markings with perspective spacing)
        step_base = 24
        anim_shift = (self.frame_idx * 5) % step_base
        for i in range(12):
            t1 = ((i * step_base + anim_shift) % (height - horizon_y)) / float(height - horizon_y)
            t2 = min(1.0, t1 + 0.05)
            y1 = int(horizon_y + t1 * (height - horizon_y))
            y2 = int(horizon_y + t2 * (height - horizon_y))
            x1 = int(vanishing_x + (t1 * 10))
            x2 = int(vanishing_x + (t2 * 10))
            thickness = max(1, int(t1 * 3))
            cv2.line(frame, (x1, y1), (x2, y2), (210, 215, 220), thickness)

        # 2. Moving Traffic Simulation (Multiple vehicles + target suspect)
        # Background vehicle
        bg_t = ((self.frame_idx * 2 + 180) % 360) / 360.0
        by = int(horizon_y + 20 + bg_t * 180)
        bx = int(vanishing_x - 40 - bg_t * 100)
        bw = int(24 + bg_t * 50)
        bh = int(14 + bg_t * 32)
        cv2.rectangle(frame, (bx, by), (bx + bw, by + bh), (35, 55, 75), -1)
        # Tail lights
        cv2.circle(frame, (bx + 4, by + bh - 4), max(2, int(bg_t * 4)), (0, 0, 200), -1)
        cv2.circle(frame, (bx + bw - 4, by + bh - 4), max(2, int(bg_t * 4)), (0, 0, 200), -1)

        # Primary vehicle (Suspect or standard traffic)
        t = ((self.frame_idx * 4) % 360) / 360.0
        vy = int(horizon_y + 30 + t * 200)
        vx = int(vanishing_x + 15 + t * 90)
        vw = int(36 + t * 85)
        vh = int(22 + t * 55)

        is_target = (target_plate is not None)
        veh_body_color = (20, 20, 20) if is_target else (65, 80, 70)

        # Vehicle shadow
        cv2.ellipse(frame, (vx + vw//2, vy + vh), (vw//2 + 8, max(4, int(vh * 0.2))), 0, 0, 360, (15, 15, 18), -1)

        # Vehicle chassis & roof
        cv2.rectangle(frame, (vx, vy + int(vh * 0.3)), (vx + vw, vy + vh), veh_body_color, -1)
        # Windshield / cabin
        cabin_w = int(vw * 0.75)
        cabin_x = vx + int((vw - cabin_w) / 2)
        cv2.rectangle(frame, (cabin_x, vy), (cabin_x + cabin_w, vy + int(vh * 0.5)), (40, 48, 55), -1)

        # Headlights / Tail lights
        headlight_col = (180, 240, 255)
        cv2.circle(frame, (vx + 6, vy + vh - 6), max(2, int(t * 5)), headlight_col, -1)
        cv2.circle(frame, (vx + vw - 6, vy + vh - 6), max(2, int(t * 5)), headlight_col, -1)

        # ANPR AI Bounding Box with target lock corners
        box_color = (40, 50, 245) if is_target else (45, 215, 115) # Red if target, Neon Green if normal
        # Corner bracket drawing for modern tactical UI
        k = max(6, int(vw * 0.15))
        bx1, by1 = vx - 4, vy - 4
        bx2, by2 = vx + vw + 4, vy + vh + 4
        cv2.rectangle(frame, (bx1, by1), (bx2, by2), box_color, 1)
        # Bold corner marks
        cv2.line(frame, (bx1, by1), (bx1 + k, by1), box_color, 3)
        cv2.line(frame, (bx1, by1), (bx1, by1 + k), box_color, 3)
        cv2.line(frame, (bx2, by1), (bx2 - k, by1), box_color, 3)
        cv2.line(frame, (bx2, by1), (bx2, by1 + k), box_color, 3)
        cv2.line(frame, (bx1, by2), (bx1 + k, by2), box_color, 3)
        cv2.line(frame, (bx1, by2), (bx1, by2 - k), box_color, 3)
        cv2.line(frame, (bx2, by2), (bx2 - k, by2), box_color, 3)
        cv2.line(frame, (bx2, by2), (bx2, by2 - k), box_color, 3)

        # Tag label overlay
        plate_str = target_plate if is_target else f"GJ01-TRF-{self.seed:02d}"
        speed = 52 + (self.frame_idx % 18)
        tag_text = f"TARGET: {plate_str} | {speed} KM/H" if is_target else f"{plate_str} | {speed} KM/H"
        
        cv2.rectangle(frame, (bx1, max(0, by1 - 18)), (bx1 + len(tag_text) * 8 + 12, by1), box_color, -1)
        cv2.putText(frame, tag_text, (bx1 + 4, max(12, by1 - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 0, 0), 1, cv2.LINE_AA)

        # 3. Security Camera Sensor Noise (High realism)
        noise = np.random.randint(-4, 5, (height, width, 3), dtype=np.int16)
        frame = np.clip(frame.astype(np.int16) + noise, 0, 255).astype(np.uint8)

        # 4. Tactical CCTV On-Screen Display (OSD)
        pts_ms = int(time.time() * 1000) % 10000000
        now_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S.%f")[:-4]

        # Top banner with glassmorphism overlay
        top_bar = frame[0:36, 0:width].copy()
        cv2.rectangle(frame, (0, 0), (width, 36), (10, 14, 20), -1)
        cv2.addWeighted(top_bar, 0.25, frame[0:36, 0:width], 0.75, 0, frame[0:36, 0:width])

        # Gujarat Police Badge & Camera Metadata
        cv2.putText(frame, f"GUJARAT POLICE NET | CAM: {self.camera_id}", (14, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (0, 235, 175), 1, cv2.LINE_AA)
        cv2.putText(frame, f"{self.location_name.upper()}", (width - 240, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (210, 220, 230), 1, cv2.LINE_AA)

        # Live Recording Indicator (Flashing Red Dot)
        if (self.frame_idx // 15) % 2 == 0:
            cv2.circle(frame, (width - 260, 18), 5, (0, 0, 240), -1)

        # Bottom telemetry bar
        bot_bar = frame[height - 30:height, 0:width].copy()
        cv2.rectangle(frame, (0, height - 30), (width, height), (10, 14, 20), -1)
        cv2.addWeighted(bot_bar, 0.25, frame[height - 30:height, 0:width], 0.75, 0, frame[height - 30:height, 0:width])

        bottom_left = f"PTS: {pts_ms}ms | H.264 TCP | 25.0 FPS | 2048 Kbps | 1080p"
        bottom_right = f"REC: {now_str} IST"
        cv2.putText(frame, bottom_left, (14, height - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (160, 175, 190), 1, cv2.LINE_AA)
        cv2.putText(frame, bottom_right, (width - 220, height - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 235, 175), 1, cv2.LINE_AA)

        # Central Crosshair Reticle
        ch_x, ch_y = width // 2, height // 2
        cv2.line(frame, (ch_x - 12, ch_y), (ch_x + 12, ch_y), (0, 235, 175), 1)
        cv2.line(frame, (ch_x, ch_y - 12), (ch_x, ch_y + 12), (0, 235, 175), 1)

        # Encode to JPEG
        _, jpeg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        return jpeg.tobytes()
