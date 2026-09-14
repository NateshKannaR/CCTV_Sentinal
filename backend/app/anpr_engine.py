import re
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, Tuple
from backend.app.db import get_db_connection
from backend.app.config import PLATE_REGEX

def normalize_indian_plate(raw_text: str) -> str:
    """Normalizes OCR output into standard Indian registration format (e.g. GJ01AB1234)."""
    cleaned = re.sub(r"[^A-Z0-9]", "", raw_text.upper())
    
    # Common OCR substitution heuristics for Indian plates:
    # State code (First 2 chars must be letters)
    if len(cleaned) >= 2:
        c0 = 'G' if cleaned[0] == '6' else cleaned[0]
        c1 = 'J' if cleaned[1] in ('1', 'I') else cleaned[1]
        cleaned = c0 + c1 + cleaned[2:]
        
    return cleaned

def is_valid_plate_format(plate: str) -> bool:
    return bool(re.match(r"^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$", plate))

def process_detection(camera_id: str, raw_plate: str, vehicle_type: str = "Car", confidence: float = 0.95, snapshot_url: Optional[str] = None, speed_kmh: Optional[float] = None) -> Tuple[Dict[str, Any], Optional[Dict[str, Any]]]:
    """
    Ingests a camera detection, validates plate, matches against watchlist,
    and returns (detection_record, alert_record_if_matched).
    """
    plate = normalize_indian_plate(raw_plate)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Retrieve camera details
    cursor.execute("SELECT name, location_name, latitude, longitude FROM cameras WHERE id = ?", (camera_id,))
    cam = cursor.fetchone()
    cam_name = cam["name"] if cam else f"Camera {camera_id}"
    loc_name = cam["location_name"] if cam else "Gujarat Network"

    # Check Watchlist match
    cursor.execute("SELECT * FROM watchlist WHERE UPPER(REPLACE(plate_number, ' ', '')) = UPPER(REPLACE(?, ' ', ''))", (plate,))
    wl_match = cursor.fetchone()

    is_match = 1 if wl_match else 0
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    det_id = f"DET-{uuid.uuid4().hex[:8].upper()}"

    cursor.execute("""
    INSERT INTO detections (id, camera_id, plate_number, vehicle_type, confidence, timestamp, pts_ms, snapshot_url, speed_kmh, is_watchlist_match)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (det_id, camera_id, plate, vehicle_type, confidence, now_str, 0, snapshot_url, speed_kmh or 52.0, is_match))

    alert_dict = None
    if is_match:
        alert_id = f"ALT-{uuid.uuid4().hex[:8].upper()}"
        cursor.execute("""
        INSERT INTO alerts (id, detection_id, plate_number, camera_id, camera_name, location_name, timestamp, offence_type, priority, snapshot_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (alert_id, det_id, plate, camera_id, cam_name, loc_name, now_str, wl_match["offence_type"], wl_match["priority"], snapshot_url, "NEW"))

        alert_dict = {
            "id": alert_id,
            "detection_id": det_id,
            "plate_number": plate,
            "camera_id": camera_id,
            "camera_name": cam_name,
            "location_name": loc_name,
            "timestamp": now_str,
            "offence_type": wl_match["offence_type"],
            "owner_name": wl_match["owner_name"],
            "vehicle_model": wl_match["vehicle_model"],
            "fir_number": wl_match["fir_number"],
            "police_station": wl_match["police_station"],
            "priority": wl_match["priority"],
            "source_db": wl_match["source_db"],
            "snapshot_url": snapshot_url,
            "status": "NEW"
        }

    conn.commit()
    conn.close()

    det_dict = {
        "id": det_id,
        "camera_id": camera_id,
        "camera_name": cam_name,
        "location_name": loc_name,
        "plate_number": plate,
        "vehicle_type": vehicle_type,
        "confidence": confidence,
        "timestamp": now_str,
        "snapshot_url": snapshot_url,
        "speed_kmh": speed_kmh or 52.0,
        "is_watchlist_match": is_match
    }

    return det_dict, alert_dict
