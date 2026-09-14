// Comprehensive Fallback & Offline Dataset for Gujarat Police Sentinel
// Guarantees 100% functionality on Vercel, Netlify, or serverless deployments

export const FALLBACK_CAMERAS = [
  { id: "CAM-GN-01", camera_id: "CAM-GN-01", camera_name: "Police Bhavan Gate 1", name: "Police Bhavan Gate 1", department: "Home Department (Police)", location_name: "Sector 18, Gandhinagar", district: "Gandhinagar", latitude: 23.2156, longitude: 72.6369, codec: "H.264", resolution: "1080p", status: "online", vendor: "CP Plus" },
  { id: "CAM-GN-02", camera_id: "CAM-GN-02", camera_name: "Mahatma Mandir Crossroad", name: "Mahatma Mandir Crossroad", department: "Home Department (Police)", location_name: "GH Road, Sector 13, Gandhinagar", district: "Gandhinagar", latitude: 23.2300, longitude: 72.6450, codec: "H.265", resolution: "1080p", status: "online", vendor: "Hikvision" },
  { id: "CAM-GN-03", camera_id: "CAM-GN-03", camera_name: "Infocity Circle North", name: "Infocity Circle North", department: "Home Department (Police)", location_name: "Infocity, Gandhinagar", district: "Gandhinagar", latitude: 23.1903, longitude: 72.6288, codec: "H.264", resolution: "4K", status: "online", vendor: "Dahua" },
  { id: "CAM-GN-04", camera_id: "CAM-GN-04", camera_name: "RTO Gandhinagar Testing Track", name: "RTO Gandhinagar Testing Track", department: "RTO Gujarat", location_name: "Sector 28, Gandhinagar", district: "Gandhinagar", latitude: 23.2450, longitude: 72.6520, codec: "H.264", resolution: "1080p", status: "online", vendor: "CP Plus" },
  { id: "CAM-GN-05", camera_id: "CAM-GN-05", camera_name: "Civil Supplies Godown Sector 25", name: "Civil Supplies Godown Sector 25", department: "Food & Civil Supplies", location_name: "GIDC Sector 25, Gandhinagar", district: "Gandhinagar", latitude: 23.2510, longitude: 72.6610, codec: "H.264", resolution: "720p", status: "online", vendor: "Hikvision" },
  { id: "CAM-AHM-01", camera_id: "CAM-AHM-01", camera_name: "Vaishno Devi Circle Northbound", name: "Vaishno Devi Circle Northbound", department: "Home Department (Police)", location_name: "SG Highway, Ahmedabad", district: "Ahmedabad", latitude: 23.1368, longitude: 72.5441, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-AHM-02", camera_id: "CAM-AHM-02", camera_name: "Gota Flyover Checkpoint", name: "Gota Flyover Checkpoint", department: "Home Department (Police)", location_name: "SG Highway, Gota, Ahmedabad", district: "Ahmedabad", latitude: 23.1090, longitude: 72.5360, codec: "H.264", resolution: "1080p", status: "online", vendor: "CP Plus" },
  { id: "CAM-AHM-03", camera_id: "CAM-AHM-03", camera_name: "Thaltej Cross Road CCTV", name: "Thaltej Cross Road CCTV", department: "Municipal Corporation", location_name: "Thaltej, SG Highway, Ahmedabad", district: "Ahmedabad", latitude: 23.0515, longitude: 72.5098, codec: "H.264", resolution: "1080p", status: "online", vendor: "Dahua" },
  { id: "CAM-AHM-04", camera_id: "CAM-AHM-04", camera_name: "ISKCON Cross Road Flyover", name: "ISKCON Cross Road Flyover", department: "Home Department (Police)", location_name: "SG Highway, ISKCON, Ahmedabad", district: "Ahmedabad", latitude: 23.0278, longitude: 72.5065, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-AHM-05", camera_id: "CAM-AHM-05", camera_name: "Pakwan Cross Road East", name: "Pakwan Cross Road East", department: "Municipal Corporation", location_name: "Bodakdev, Ahmedabad", district: "Ahmedabad", latitude: 23.0370, longitude: 72.5150, codec: "H.264", resolution: "1080p", status: "online", vendor: "CP Plus" },
  { id: "CAM-AHM-06", camera_id: "CAM-AHM-06", camera_name: "Shivranjani Cross Roads", name: "Shivranjani Cross Roads", department: "Home Department (Police)", location_name: "Satellite, Ahmedabad", district: "Ahmedabad", latitude: 23.0234, longitude: 72.5298, codec: "H.264", resolution: "1080p", status: "online", vendor: "Hikvision" },
  { id: "CAM-AHM-07", camera_id: "CAM-AHM-07", camera_name: "Nehrunagar Circle Traffic Post", name: "Nehrunagar Circle Traffic Post", department: "Home Department (Police)", location_name: "Nehrunagar, Ambawadi, Ahmedabad", district: "Ahmedabad", latitude: 23.0189, longitude: 72.5442, codec: "H.264", resolution: "1080p", status: "online", vendor: "CP Plus" },
  { id: "CAM-AHM-08", camera_id: "CAM-AHM-08", camera_name: "Paldi Cross Road Bridge", name: "Paldi Cross Road Bridge", department: "Municipal Corporation", location_name: "Paldi, Ahmedabad", district: "Ahmedabad", latitude: 23.0125, longitude: 72.5650, codec: "H.264", resolution: "1080p", status: "online", vendor: "Dahua" },
  { id: "CAM-AHM-09", camera_id: "CAM-AHM-09", camera_name: "Geeta Mandir ST Bus Station", name: "Geeta Mandir ST Bus Station", department: "Home Department (Police)", location_name: "Geeta Mandir, Ahmedabad", district: "Ahmedabad", latitude: 23.0118, longitude: 72.5892, codec: "H.264", resolution: "1080p", status: "online", vendor: "Hikvision" },
  { id: "CAM-AHM-10", camera_id: "CAM-AHM-10", camera_name: "Narol Circle Toll Junction", name: "Narol Circle Toll Junction", department: "Home Department (Police)", location_name: "Narol-Sarkhej Highway, Ahmedabad", district: "Ahmedabad", latitude: 22.9734, longitude: 72.5925, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-VAD-01", camera_id: "CAM-VAD-01", camera_name: "Alkapuri Railway Underpass", name: "Alkapuri Railway Underpass", department: "Home Department (Police)", location_name: "Alkapuri, Vadodara", district: "Vadodara", latitude: 22.3106, longitude: 73.1812, codec: "H.264", resolution: "1080p", status: "online", vendor: "Hikvision" },
  { id: "CAM-VAD-02", camera_id: "CAM-VAD-02", camera_name: "Genda Circle North", name: "Genda Circle North", department: "Municipal Corporation", location_name: "Sayajiganj, Vadodara", district: "Vadodara", latitude: 22.3200, longitude: 73.1750, codec: "H.264", resolution: "1080p", status: "online", vendor: "Dahua" },
  { id: "CAM-SUR-01", camera_id: "CAM-SUR-01", camera_name: "Athwa Gate Junction", name: "Athwa Gate Junction", department: "Home Department (Police)", location_name: "Athwa Lines, Surat", district: "Surat", latitude: 21.1835, longitude: 72.8124, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-SUR-02", camera_id: "CAM-SUR-02", camera_name: "Majura Gate Intersection", name: "Majura Gate Intersection", department: "Municipal Corporation", location_name: "Ring Road, Surat", district: "Surat", latitude: 21.1765, longitude: 72.8220, codec: "H.264", resolution: "1080p", status: "online", vendor: "Dahua" },
  { id: "CAM-SUR-05", camera_id: "CAM-SUR-05", camera_name: "Kamrej Toll Plaza Entry", name: "Kamrej Toll Plaza Entry", department: "Home Department (Police)", location_name: "NH-48 Kamrej, Surat", district: "Surat", latitude: 21.2720, longitude: 72.9650, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-RAJ-01", camera_id: "CAM-RAJ-01", camera_name: "Trikon Baug Traffic Post", name: "Trikon Baug Traffic Post", department: "Home Department (Police)", location_name: "Civil Hospital Road, Rajkot", district: "Rajkot", latitude: 22.3025, longitude: 70.8015, codec: "H.264", resolution: "1080p", status: "online", vendor: "CP Plus" },
  { id: "CAM-RAJ-02", camera_id: "CAM-RAJ-02", camera_name: "Madhapar Chowkdi Ring Road", name: "Madhapar Chowkdi Ring Road", department: "Municipal Corporation", location_name: "150 Feet Ring Road, Rajkot", district: "Rajkot", latitude: 22.3350, longitude: 70.7720, codec: "H.265", resolution: "1080p", status: "online", vendor: "Hikvision" },
  { id: "CAM-KUT-01", camera_id: "CAM-KUT-01", camera_name: "Samakhiali Toll Plaza (Kutch)", name: "Samakhiali Toll Plaza (Kutch)", department: "Home Department (Police)", location_name: "NH-41 Samakhiali, Kutch", district: "Kutch", latitude: 23.3150, longitude: 70.5280, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-BHV-01", camera_id: "CAM-BHV-01", camera_name: "Bhavnagar Alang Shipyard Entry", name: "Bhavnagar Alang Shipyard Entry", department: "Home Department (Police)", location_name: "Alang, Bhavnagar", district: "Bhavnagar", latitude: 21.4120, longitude: 72.1950, codec: "H.264", resolution: "1080p", status: "online", vendor: "Hikvision" }
];

export const FALLBACK_WATCHLIST = [
  { id: "WL-01", plate_number: "GJ01AB1234", owner_name: "Vikram Rathore", vehicle_model: "Toyota Fortuner (White)", offence_type: "Stolen Vehicle / Armed Robbery", fir_number: "FIR-429/2026", police_station: "Crime Branch Ahmedabad", priority: "CRITICAL", source_db: "eGujCop", notes: "Armed suspects fleeing towards South Gujarat. Intercept immediately." },
  { id: "WL-02", plate_number: "GJ05XY9999", owner_name: "Mohanlal Patel", vehicle_model: "Mahindra Scorpio (Black)", offence_type: "Wanted Criminal / Smuggling", fir_number: "FIR-108/2026", police_station: "Athwa Lines PS Surat", priority: "CRITICAL", source_db: "eGujCop", notes: "Wanted under NDPS Act. Fake registration suspected." },
  { id: "WL-03", plate_number: "GJ27CD5678", owner_name: "Rakesh Solanki", vehicle_model: "Maruti Brezza (Grey)", offence_type: "Hit & Run / Fatality", fir_number: "FIR-77/2026", police_station: "Infocity PS Gandhinagar", priority: "HIGH", source_db: "VAHAN", notes: "Involved in fatal collision on GH-Road. Vehicle impound order issued." },
  { id: "WL-04", plate_number: "GJ03KL4321", owner_name: "Unknown Suspect", vehicle_model: "Hyundai Creta (Silver)", offence_type: "Kidnapping / Amber Alert", fir_number: "FIR-912/2026", police_station: "B-Division Rajkot", priority: "CRITICAL", source_db: "eGujCop", notes: "Minor child abducted from school premise. State-wide red alert." },
  { id: "WL-05", plate_number: "GJ06MN8888", owner_name: "Kishore Parmar", vehicle_model: "Tata Nexon (Blue)", offence_type: "Tax Evasion / Blacklisted RTO", fir_number: "CH-2026-992", police_station: "RTO Vadodara", priority: "MEDIUM", source_db: "SARTHI", notes: "Commercial registration fraud and unserved court summons." }
];

export const FALLBACK_ALERTS = [
  { id: "ALT-01", plate_number: "GJ01AB1234", camera_id: "CAM-AHM-10", camera_name: "Narol Circle Toll Junction", location_name: "Narol-Sarkhej Highway, Ahmedabad", timestamp: new Date().toISOString(), offence_type: "Stolen Vehicle / Armed Robbery", priority: "CRITICAL", status: "NEW" },
  { id: "ALT-02", plate_number: "GJ01AB1234", camera_id: "CAM-AHM-04", camera_name: "ISKCON Cross Road Flyover", location_name: "SG Highway, ISKCON, Ahmedabad", timestamp: new Date(Date.now() - 15*60000).toISOString(), offence_type: "Stolen Vehicle / Armed Robbery", priority: "CRITICAL", status: "ACKNOWLEDGED" },
  { id: "ALT-03", plate_number: "GJ05XY9999", camera_id: "CAM-SUR-05", camera_name: "Kamrej Toll Plaza Entry", location_name: "NH-48 Kamrej, Surat", timestamp: new Date(Date.now() - 45*60000).toISOString(), offence_type: "Wanted Criminal / Smuggling", priority: "CRITICAL", status: "NEW" }
];

export const FALLBACK_ROUTE_GJ01 = {
  plate_number: "GJ01AB1234",
  total_sightings: 7,
  first_seen: "2026-09-14 10:14:00",
  last_seen: "2026-09-14 11:36:00",
  total_distance_km: 38.6,
  average_speed_kmh: 58.4,
  primary_direction: "Southbound (Towards Vadodara / Surat NH-48)",
  watchlist_entry: {
    plate_number: "GJ01AB1234",
    owner_name: "Vikram Rathore",
    vehicle_model: "Toyota Fortuner (White)",
    offence_type: "Stolen Vehicle / Armed Robbery",
    fir_number: "FIR-429/2026",
    police_station: "Crime Branch Ahmedabad",
    priority: "CRITICAL",
    source_db: "eGujCop"
  },
  sightings: [
    { camera_id: "CAM-GN-01", camera_name: "Police Bhavan Gate 1", location_name: "Sector 18, Gandhinagar", timestamp: "2026-09-14 10:14:00", latitude: 23.2156, longitude: 72.6369, speed_kmh: 0.0, snapshot_url: "/snapshots/gj01_1.jpg", pts_ms: 0 },
    { camera_id: "CAM-GN-03", camera_name: "Infocity Circle North", location_name: "Infocity, Gandhinagar", timestamp: "2026-09-14 10:28:00", latitude: 23.1903, longitude: 72.6288, speed_kmh: 55.0, snapshot_url: "/snapshots/gj01_2.jpg", pts_ms: 840000 },
    { camera_id: "CAM-AHM-01", camera_name: "Vaishno Devi Circle Northbound", location_name: "SG Highway, Ahmedabad", timestamp: "2026-09-14 10:42:00", latitude: 23.1368, longitude: 72.5441, speed_kmh: 62.0, snapshot_url: "/snapshots/gj01_3.jpg", pts_ms: 1680000 },
    { camera_id: "CAM-AHM-02", camera_name: "Gota Flyover Checkpoint", location_name: "SG Highway, Gota, Ahmedabad", timestamp: "2026-09-14 10:51:00", latitude: 23.1090, longitude: 72.5360, speed_kmh: 58.0, snapshot_url: "/snapshots/gj01_4.jpg", pts_ms: 2220000 },
    { camera_id: "CAM-AHM-04", camera_name: "ISKCON Cross Road Flyover", location_name: "SG Highway, ISKCON, Ahmedabad", timestamp: "2026-09-14 11:05:00", latitude: 23.0278, longitude: 72.5065, speed_kmh: 65.0, snapshot_url: "/snapshots/gj01_5.jpg", pts_ms: 3060000 },
    { camera_id: "CAM-AHM-07", camera_name: "Nehrunagar Circle Traffic Post", location_name: "Nehrunagar, Ambawadi, Ahmedabad", timestamp: "2026-09-14 11:20:00", latitude: 23.0189, longitude: 72.5442, speed_kmh: 52.0, snapshot_url: "/snapshots/gj01_6.jpg", pts_ms: 3960000 },
    { camera_id: "CAM-AHM-10", camera_name: "Narol Circle Toll Junction", location_name: "Narol-Sarkhej Highway, Ahmedabad", timestamp: "2026-09-14 11:36:00", latitude: 22.9734, longitude: 72.5925, speed_kmh: 60.0, snapshot_url: "/snapshots/gj01_7.jpg", pts_ms: 4920000 }
  ],
  predictive_interception: {
    heading_compass: "172° (South)",
    confidence_score: 94.2,
    intercept_zones: [
      { checkpoint_name: "Bareja Expressway Toll Plaza", distance_km: 12.4, eta_minutes: 13, district: "Ahmedabad Rural", dispatch_recommended: true },
      { checkpoint_name: "Kheda Bypass Border Checkpost", distance_km: 26.8, eta_minutes: 27, district: "Kheda", dispatch_recommended: true },
      { checkpoint_name: "Nadiad South Toll Gate", distance_km: 44.5, eta_minutes: 44, district: "Kheda", dispatch_recommended: false }
    ]
  }
};

// Generates an authentic tactical CCTV security camera SVG Data URI
export function generateCctvSvg(camId = "CAM-01", location = "GUJARAT HIGHWAY", plate = "GJ01AB1234") {
  const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
  const pts = Math.floor(Date.now() % 10000000);
  
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="720" height="405" viewBox="0 0 720 405">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e2229" />
        <stop offset="100%" stop-color="#2d333b" />
      </linearGradient>
    </defs>
    <!-- Background & Horizon -->
    <rect width="720" height="130" fill="url(#sky)" />
    <rect y="130" width="720" height="275" fill="url(#road)" />

    <!-- Road Perspective -->
    <polygon points="310,130 410,130 680,405 40,405" fill="#22272e" />
    <line x1="310" y1="130" x2="40" y2="405" stroke="#f59e0b" stroke-width="2" />
    <line x1="410" y1="130" x2="680" y2="405" stroke="#e2e8f0" stroke-width="2" />
    
    <!-- Dashed Center Lane -->
    <line x1="360" y1="140" x2="360" y2="165" stroke="#ffffff" stroke-width="2" stroke-dasharray="8 8" />
    <line x1="360" y1="180" x2="360" y2="230" stroke="#ffffff" stroke-width="3" stroke-dasharray="12 12" />
    <line x1="360" y1="260" x2="360" y2="350" stroke="#ffffff" stroke-width="4" stroke-dasharray="16 16" />

    <!-- Distant Vehicle -->
    <rect x="330" y="160" width="30" height="18" rx="2" fill="#334155" />
    <circle cx="335" cy="174" r="2" fill="#ef4444" />
    <circle cx="355" cy="174" r="2" fill="#ef4444" />

    <!-- Suspect Target Vehicle with Headlights -->
    <ellipse cx="440" cy="335" rx="45" ry="12" fill="#090d16" opacity="0.8" />
    <rect x="400" y="270" width="80" height="50" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
    <rect x="412" y="252" width="56" height="25" rx="3" fill="#1e293b" />
    <circle cx="414" cy="310" r="5" fill="#fef08a" />
    <circle cx="466" cy="310" r="5" fill="#fef08a" />

    <!-- Tactical ANPR Lock Corners (Neon Green / Red) -->
    <rect x="390" y="242" width="100" height="85" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="12 4" />
    <path d="M 390,256 L 390,242 L 404,242" fill="none" stroke="#10b981" stroke-width="3" />
    <path d="M 476,242 L 490,242 L 490,256" fill="none" stroke="#10b981" stroke-width="3" />
    <path d="M 390,313 L 390,327 L 404,327" fill="none" stroke="#10b981" stroke-width="3" />
    <path d="M 476,327 L 490,327 L 490,313" fill="none" stroke="#10b981" stroke-width="3" />

    <!-- ANPR Plate Tag -->
    <rect x="390" y="222" width="150" height="20" rx="3" fill="#10b981" />
    <text x="395" y="236" font-family="monospace" font-size="11" font-weight="bold" fill="#020617">TARGET: ${plate}</text>

    <!-- Crosshair Reticle -->
    <circle cx="360" cy="202" r="16" fill="none" stroke="#10b981" stroke-width="1" opacity="0.6" />
    <line x1="360" y1="180" x2="360" y2="225" stroke="#10b981" stroke-width="1" opacity="0.6" />
    <line x1="338" y1="202" x2="382" y2="202" stroke="#10b981" stroke-width="1" opacity="0.6" />

    <!-- Top OSD HUD Bar -->
    <rect width="720" height="34" fill="#050811" opacity="0.9" />
    <text x="14" y="22" font-family="monospace" font-size="12" font-weight="bold" fill="#10b981">GUJARAT POLICE SURVEILLANCE • ${camId}</text>
    <text x="500" y="22" font-family="monospace" font-size="11" fill="#e2e8f0">${location}</text>
    <circle cx="482" cy="18" r="4" fill="#ef4444" />

    <!-- Bottom Telemetry OSD Bar -->
    <rect y="375" width="720" height="30" fill="#050811" opacity="0.9" />
    <text x="14" y="394" font-family="monospace" font-size="11" fill="#94a3b8">PTS: ${pts}ms | TCP/RTSP | 25.0 FPS | H.264 | 1080p</text>
    <text x="540" y="394" font-family="monospace" font-size="11" font-weight="bold" fill="#10b981">REC: ${time} IST</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Client-side Scale Architecture Calculator (exact formula from backend)
export function calculateScaleOffline(cameraCount = 80000, codec = "H.265", resolution = "1080p", hotDays = 7, warmDays = 23, coldDays = 60, edgeAiPercent = 80) {
  const bitrates = {
    "1080p_H.264": 4.0, "1080p_H.265": 2.0,
    "4K_H.264": 12.0, "4K_H.265": 6.0,
    "720p_H.264": 2.0, "720p_H.265": 1.0
  };
  const avgBitrate = bitrates[`${resolution}_${codec}`] || 2.0;
  const rawBandwidthGbps = (cameraCount * avgBitrate) / 1000.0;
  const metadataMbps = (cameraCount * 15.0) / 1000.0;
  const centralVideoGbps = (cameraCount * 0.05 * avgBitrate) / 1000.0;

  const gbPerDay = (avgBitrate * 1000000 * 86400) / (8 * 1024 * 1024 * 1024);
  const hotPb = (cameraCount * gbPerDay * hotDays) / (1024 * 1024);
  const warmPb = (cameraCount * gbPerDay * warmDays) / (1024 * 1024);
  const coldPb = (cameraCount * gbPerDay * coldDays) / (1024 * 1024);

  const totalGpus = Math.floor((cameraCount / 45) * 1.15);
  const edgeGpus = Math.floor(totalGpus * (edgeAiPercent / 100.0));

  return {
    camera_count: cameraCount,
    resolution,
    codec,
    avg_bitrate_mbps: avgBitrate,
    bandwidth: {
      total_raw_stream_gbps: Number(rawBandwidthGbps.toFixed(1)),
      edge_metadata_stream_mbps: Number(metadataMbps.toFixed(1)),
      central_on_demand_video_gbps: Number(centralVideoGbps.toFixed(1)),
      bandwidth_saving_percentage: Number(((1 - (centralVideoGbps / rawBandwidthGbps)) * 100).toFixed(1))
    },
    storage: {
      gb_per_camera_day: Number(gbPerDay.toFixed(2)),
      hot_storage_tier_pb: Number(hotPb.toFixed(2)),
      warm_storage_tier_pb: Number(warmPb.toFixed(2)),
      cold_storage_tier_pb: Number(coldPb.toFixed(2)),
      total_storage_pb: Number((hotPb + warmPb + coldPb).toFixed(2)),
      architecture: "NVMe / Ceph Hot Pool + S3 Object Warm Pool + Tape Cold Archive"
    },
    compute: {
      total_gpus_required: totalGpus,
      edge_regional_gpus: edgeGpus,
      central_command_gpus: totalGpus - edgeGpus,
      streams_per_gpu_density: 45,
      recommended_gpu_model: "NVIDIA L4 24GB or Jetson Orin at Edge Junctions"
    },
    messaging_and_db: {
      peak_detections_per_sec: Math.floor(cameraCount * 0.5),
      kafka_brokers: Math.max(5, Math.floor((cameraCount * 0.5) / 15000)),
      database_cluster: "MongoDB Atlas + Distributed TimescaleDB with Vector Search"
    }
  };
}
