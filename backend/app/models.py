from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class CameraModel(BaseModel):
    id: str
    name: str
    department: str  # Home/Police, RTO, Food & Civil Supplies, AMC/Municipal, Private/Societies
    location_name: str
    district: str
    latitude: float
    longitude: float
    rtsp_url: str
    hls_url: Optional[str] = None
    codec: str = "H.264"
    resolution: str = "1080p"
    status: str = "online"  # online, offline, degraded
    storage_retention_days: int = 15
    vendor: str = "Hikvision"
    last_ping: Optional[str] = None
    coverage_radius_meters: int = 150

class DetectionModel(BaseModel):
    id: Optional[str] = None
    camera_id: str
    plate_number: str
    vehicle_type: str = "Car"  # Car, Motorcycle, Bus, Truck, Auto-Rickshaw
    confidence: float = 0.95
    timestamp: str
    pts_ms: int = 0
    snapshot_url: Optional[str] = None
    speed_kmh: Optional[float] = None

class WatchlistModel(BaseModel):
    id: Optional[str] = None
    plate_number: str
    owner_name: str
    vehicle_model: str
    offence_type: str  # Stolen Vehicle, Wanted Criminal, Kidnapping / Amber Alert, Blacklisted, Missing Person
    fir_number: Optional[str] = None
    police_station: str
    priority: str = "CRITICAL"  # CRITICAL, HIGH, MEDIUM
    source_db: str = "eGujCop"  # VAHAN, SARTHI, eGujCop, AFIS, NAFIS
    notes: Optional[str] = None

class RouteHop(BaseModel):
    sequence: int
    camera_id: str
    camera_name: str
    location_name: str
    latitude: float
    longitude: float
    timestamp: str
    speed_kmh: float
    distance_km: float
    snapshot_url: Optional[str] = None

class RouteReconstructionResponse(BaseModel):
    plate_number: str
    total_detections: int
    first_seen: str
    last_seen: str
    total_distance_km: float
    average_speed_kmh: float
    status: str
    hops: List[RouteHop]
    watchlist_info: Optional[Dict[str, Any]] = None
    predicted_interception: Optional[List[Dict[str, Any]]] = None
    route_geojson: Dict[str, Any]

class GapAnalysisResponse(BaseModel):
    total_cameras: int
    online_cameras: int
    offline_cameras: int
    degraded_cameras: int
    departments_count: Dict[str, int]
    coverage_gaps: List[Dict[str, Any]]
    storage_retention_distribution: Dict[str, int]
