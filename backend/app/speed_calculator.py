import math
from datetime import datetime
from typing import Optional, Tuple, List, Dict, Any
from backend.app.db import get_db_connection

DEFAULT_SPEED_LIMIT_KMH = 80.0  # Standard urban/highway arterial limit in Gujarat

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates great-circle distance between two GPS coordinates using Haversine formula.
    Returns distance in kilometers.
    """
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

class SpeedCalculator:
    @staticmethod
    def calculate_inter_camera_speed(
        license_plate: str,
        current_camera_id: str,
        current_timestamp_str: str,
        speed_limit_kmh: float = DEFAULT_SPEED_LIMIT_KMH
    ) -> Tuple[Optional[float], bool, Optional[str]]:
        """
        Calculates average transit speed (v = delta_d / delta_t) between the current camera
        and the last detected camera for this vehicle.
        
        Returns:
            (speed_kmh, is_violation, details_message)
        """
        clean_plate = license_plate.replace("-", "").replace(" ", "").upper()
        
        conn = get_db_connection()
        cursor = conn.cursor()

        # Find most recent prior detection for this vehicle at a different camera
        cursor.execute("""
        SELECT camera_id, timestamp FROM detections 
        WHERE UPPER(REPLACE(plate_number, ' ', '')) = ? AND camera_id != ?
        ORDER BY timestamp DESC LIMIT 1
        """, (clean_plate, current_camera_id))
        prev_detection = cursor.fetchone()

        if not prev_detection:
            conn.close()
            return None, False, None

        prev_cam_id = prev_detection["camera_id"]
        prev_timestamp_str = prev_detection["timestamp"]

        # Fetch coordinates
        cursor.execute("SELECT name, latitude, longitude FROM cameras WHERE id = ?", (current_camera_id,))
        curr_cam = cursor.fetchone()

        cursor.execute("SELECT name, latitude, longitude FROM cameras WHERE id = ?", (prev_cam_id,))
        prev_cam = cursor.fetchone()
        conn.close()

        if not curr_cam or not prev_cam:
            return None, False, None

        distance_km = haversine_distance_km(
            prev_cam["latitude"], prev_cam["longitude"],
            curr_cam["latitude"], curr_cam["longitude"]
        )

        try:
            # Tolerates ISO or standard SQLite 'YYYY-MM-DD HH:MM:SS'
            t_curr = datetime.fromisoformat(current_timestamp_str.replace("Z", "+00:00").replace(" ", "T"))
            t_prev = datetime.fromisoformat(prev_timestamp_str.replace("Z", "+00:00").replace(" ", "T"))
            elapsed_seconds = abs((t_curr - t_prev).total_seconds())
        except Exception:
            return None, False, None

        if elapsed_seconds <= 1.0:
            return None, False, None

        elapsed_hours = elapsed_seconds / 3600.0
        calculated_speed = round(distance_km / elapsed_hours, 1)

        # Filter non-physical speeds (> 250 km/h or < 2 km/h)
        if calculated_speed > 250.0 or calculated_speed < 2.0:
            return None, False, None

        # 5% speedometer tolerance buffer
        enforced_threshold = round(speed_limit_kmh * 1.05, 1)
        is_violation = calculated_speed > enforced_threshold

        details = (
            f"Average Speed: {calculated_speed} km/h (Limit: {speed_limit_kmh} km/h) "
            f"over {distance_km:.2f} km between [{prev_cam['name']}] and [{curr_cam['name']}]."
        )

        return calculated_speed, is_violation, details

    @staticmethod
    def estimate_optical_velocity(bbox_history: list) -> float:
        """
        Estimates real vehicle velocity (km/h) from video bounding box centroid motion.
        bbox_history: list of tuples (timestamp_secs, x1, y1, x2, y2)
        """
        if not bbox_history or len(bbox_history) < 2:
            return 0.0

        t1, x1_a, y1_a, x2_a, y2_a = bbox_history[0]
        t2, x1_b, y1_b, x2_b, y2_b = bbox_history[-1]

        dt = abs(t2 - t1)
        if dt < 0.03:
            return 0.0

        cy_a = (y1_a + y2_a) / 2.0
        cy_b = (y1_b + y2_b) / 2.0
        pixel_disp = abs(cy_b - cy_a)

        h_box = max(abs(y2_b - y1_b), 1)
        # Empirical vehicle height ~ 1.5m
        meters_per_pixel = 1.5 / float(h_box)
        distance_meters = pixel_disp * meters_per_pixel
        speed_mps = distance_meters / dt
        speed_kmh = round(speed_mps * 3.6, 1)

        if speed_kmh < 5.0 or speed_kmh > 220.0:
            return 0.0

        return speed_kmh
