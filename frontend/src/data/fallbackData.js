// Comprehensive Fallback & Offline Dataset for Gujarat Police Sentinel
// Guarantees 100% functionality on Vercel, Netlify, or serverless deployments

export const FALLBACK_CAMERAS = [
  // Real Sentinel Live Camera Grid (cam01 to cam30)
  { id: "cam01", camera_id: "cam01", camera_name: "01 Chiman bhai Bridge", name: "01 Chiman bhai Bridge", department: "Home Department (Police)", location_name: "Chimanbhai Bridge, Ahmedabad", district: "Ahmedabad", latitude: 23.0645, longitude: 72.5810, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam02", camera_id: "cam02", camera_name: "02 Janpath", name: "02 Janpath", department: "Municipal Corporation", location_name: "Janpath Road, Ahmedabad", district: "Ahmedabad", latitude: 23.0305, longitude: 72.5650, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam03", camera_id: "cam03", camera_name: "03 O.N.G.C. Office", name: "03 O.N.G.C. Office", department: "Home Department (Police)", location_name: "ONGC Complex, Ahmedabad", district: "Ahmedabad", latitude: 23.0920, longitude: 72.5930, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam04", camera_id: "cam04", camera_name: "04 Paldi Circle", name: "04 Paldi Circle", department: "Home Department (Police)", location_name: "Paldi Cross Roads, Ahmedabad", district: "Ahmedabad", latitude: 23.0124, longitude: 72.5625, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam05", camera_id: "cam05", camera_name: "05 Visat teen Rasta", name: "05 Visat teen Rasta", department: "RTO Checkpost", location_name: "Visat Three Roads, Sabarmati, Ahmedabad", district: "Ahmedabad", latitude: 23.1020, longitude: 72.5910, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam06", camera_id: "cam06", camera_name: "06 Timbavadi gate-Junagadh", name: "06 Timbavadi gate-Junagadh", department: "Home Department (Police)", location_name: "Timbavadi Gate, Junagadh", district: "Junagadh", latitude: 21.5120, longitude: 70.4680, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam07", camera_id: "cam07", camera_name: "07 hero-showroom-gir-somnath", name: "07 hero-showroom-gir-somnath", department: "Home Department (Police)", location_name: "Veraval Highway, Gir Somnath", district: "Gir Somnath", latitude: 20.9020, longitude: 70.3710, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam08", camera_id: "cam08", camera_name: "08 majewadi-gate-junagadh", name: "08 majewadi-gate-junagadh", department: "Municipal Corporation", location_name: "Majewadi Gate, Junagadh", district: "Junagadh", latitude: 21.5280, longitude: 70.4590, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam09", camera_id: "cam09", camera_name: "09 new-bypass-near-by-circle-junagadh-2", name: "09 new-bypass-near-by-circle-junagadh-2", department: "RTO Checkpost", location_name: "New Bypass Circle, Junagadh", district: "Junagadh", latitude: 21.5410, longitude: 70.4720, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam10", camera_id: "cam10", camera_name: "10 char-chowk-road-2-junagadh", name: "10 char-chowk-road-2-junagadh", department: "Smart City VMS", location_name: "Char Chowk Road, Junagadh", district: "Junagadh", latitude: 21.5190, longitude: 70.4610, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam11", camera_id: "cam11", camera_name: "11 dolatpara-junagadh", name: "11 dolatpara-junagadh", department: "Home Department (Police)", location_name: "Dolatpara, Junagadh", district: "Junagadh", latitude: 21.5510, longitude: 70.4690, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam12", camera_id: "cam12", camera_name: "12 Tri Mandir Adalaj Tollnaka", name: "12 Tri Mandir Adalaj Tollnaka", department: "RTO Checkpost", location_name: "Adalaj Tollnaka, Gandhinagar", district: "Gandhinagar", latitude: 23.1680, longitude: 72.5810, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam13", camera_id: "cam13", camera_name: "13 CN Vidhyalaya", name: "13 CN Vidhyalaya", department: "Municipal Corporation", location_name: "CN Vidhyalaya Road, Ahmedabad", district: "Ahmedabad", latitude: 23.0280, longitude: 72.5480, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam14", camera_id: "cam14", camera_name: "14 Delight RLVD", name: "14 Delight RLVD", department: "Home Department (Police)", location_name: "Delight RLVD Crossroad, Ahmedabad", district: "Ahmedabad", latitude: 23.0380, longitude: 72.5520, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam15", camera_id: "cam15", camera_name: "15 Suvidha park", name: "15 Suvidha park", department: "Smart City VMS", location_name: "Suvidha Park, Ahmedabad", district: "Ahmedabad", latitude: 23.0190, longitude: 72.5390, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam16", camera_id: "cam16", camera_name: "16 Visat P2", name: "16 Visat P2", department: "Home Department (Police)", location_name: "Visat Perimeter 2, Ahmedabad", district: "Ahmedabad", latitude: 23.1040, longitude: 72.5925, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam17", camera_id: "cam17", camera_name: "17 Rajkot Bus Port CCTV", name: "17 Rajkot Bus Port CCTV", department: "Transport Dept", location_name: "Rajkot Central Bus Port", district: "Rajkot", latitude: 22.3010, longitude: 70.8010, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam18", camera_id: "cam18", camera_name: "18 Rajkot CCTV", name: "18 Rajkot CCTV", department: "Home Department (Police)", location_name: "Kasturba Road, Rajkot", district: "Rajkot", latitude: 22.3050, longitude: 70.7980, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam19", camera_id: "cam19", camera_name: "19 Khaparia Gram Panchayat", name: "19 Khaparia Gram Panchayat", department: "Home Department (Police)", location_name: "Gandevi, Navsari", district: "Navsari", latitude: 20.8410, longitude: 72.9810, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam20", camera_id: "cam20", camera_name: "20 Mohanpura", name: "20 Mohanpura", department: "Smart City VMS", location_name: "Mohanpura, Gandhinagar", district: "Gandhinagar", latitude: 23.2380, longitude: 72.6450, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam21", camera_id: "cam21", camera_name: "23 Patan Dethali Char Rasta", name: "23 Patan Dethali Char Rasta", department: "RTO Checkpost", location_name: "Dethali Cross Roads, Patan", district: "Patan", latitude: 23.8510, longitude: 72.1280, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam22", camera_id: "cam22", camera_name: "28 BK Mervada tran Rasta", name: "28 BK Mervada tran Rasta", department: "Home Department (Police)", location_name: "Mervada Three Roads, Banaskantha", district: "Banaskantha", latitude: 24.1720, longitude: 72.4380, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam23", camera_id: "cam23", camera_name: "30 kheram", name: "30 kheram", department: "Home Department (Police)", location_name: "Kheram Highway, Gujarat Corridor", district: "Gujarat Corridor", latitude: 22.4510, longitude: 71.8210, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam24", camera_id: "cam24", camera_name: "33 dehgam", name: "33 dehgam", department: "Municipal Corporation", location_name: "Dehgam Circle, Gandhinagar", district: "Gandhinagar", latitude: 23.1680, longitude: 72.8120, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam25", camera_id: "cam25", camera_name: "34 dhanori", name: "34 dhanori", department: "RTO Checkpost", location_name: "Dhanori Border Post, Navsari", district: "Navsari", latitude: 20.8910, longitude: 72.9510, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam26", camera_id: "cam26", camera_name: "35 TANKAL", name: "35 TANKAL", department: "Home Department (Police)", location_name: "Tankal Checkpoint, Navsari", district: "Navsari", latitude: 20.7810, longitude: 73.0120, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam27", camera_id: "cam27", camera_name: "36 bilimora", name: "36 bilimora", department: "Municipal Corporation", location_name: "Station Road, Bilimora, Navsari", district: "Navsari", latitude: 20.7610, longitude: 72.9680, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam28", camera_id: "cam28", camera_name: "37 bilimora", name: "37 bilimora", department: "Smart City VMS", location_name: "Main Bazar, Bilimora, Navsari", district: "Navsari", latitude: 20.7640, longitude: 72.9710, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam29", camera_id: "cam29", camera_name: "38 bilimora", name: "38 bilimora", department: "Home Department (Police)", location_name: "Coastal Highway, Bilimora, Navsari", district: "Navsari", latitude: 20.7680, longitude: 72.9750, codec: "H.264", resolution: "1080p", status: "online", vendor: "Sentinel Edge" },
  { id: "cam30", camera_id: "cam30", camera_name: "Gandhidham Rambaugh p2", name: "Gandhidham Rambaugh p2", department: "Home Department (Police)", location_name: "Rambaugh Road, Gandhidham, Kutch", district: "Kutch", latitude: 23.0780, longitude: 70.1340, codec: "H.265", resolution: "4K", status: "online", vendor: "Sentinel Edge" },

  // Statewide Regional Clusters
  { id: "CAM-GN-01", camera_id: "CAM-GN-01", camera_name: "Police Bhavan Gate 1", name: "Police Bhavan Gate 1", department: "Home Department (Police)", location_name: "Sector 18, Gandhinagar", district: "Gandhinagar", latitude: 23.2156, longitude: 72.6369, codec: "H.264", resolution: "1080p", status: "online", vendor: "CP Plus" },
  { id: "CAM-GN-02", camera_id: "CAM-GN-02", camera_name: "Mahatma Mandir Crossroad", name: "Mahatma Mandir Crossroad", department: "Home Department (Police)", location_name: "GH Road, Sector 13, Gandhinagar", district: "Gandhinagar", latitude: 23.2300, longitude: 72.6450, codec: "H.265", resolution: "1080p", status: "online", vendor: "Hikvision" },
  { id: "CAM-GN-03", camera_id: "CAM-GN-03", camera_name: "Infocity Circle North", name: "Infocity Circle North", department: "Home Department (Police)", location_name: "Infocity, Gandhinagar", district: "Gandhinagar", latitude: 23.1903, longitude: 72.6288, codec: "H.264", resolution: "4K", status: "online", vendor: "Dahua" },
  { id: "CAM-AHM-01", camera_id: "CAM-AHM-01", camera_name: "Vaishno Devi Circle Northbound", name: "Vaishno Devi Circle Northbound", department: "Home Department (Police)", location_name: "SG Highway, Ahmedabad", district: "Ahmedabad", latitude: 23.1368, longitude: 72.5441, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-AHM-04", camera_id: "CAM-AHM-04", camera_name: "ISKCON Cross Road Flyover", name: "ISKCON Cross Road Flyover", department: "Home Department (Police)", location_name: "SG Highway, ISKCON, Ahmedabad", district: "Ahmedabad", latitude: 23.0278, longitude: 72.5065, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-AHM-10", camera_id: "CAM-AHM-10", camera_name: "Narol Circle Toll Junction", name: "Narol Circle Toll Junction", department: "Home Department (Police)", location_name: "Narol-Sarkhej Highway, Ahmedabad", district: "Ahmedabad", latitude: 22.9734, longitude: 72.5925, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" },
  { id: "CAM-SUR-05", camera_id: "CAM-SUR-05", camera_name: "Kamrej Toll Plaza Entry", name: "Kamrej Toll Plaza Entry", department: "Home Department (Police)", location_name: "NH-48 Kamrej, Surat", district: "Surat", latitude: 21.2720, longitude: 72.9650, codec: "H.265", resolution: "4K", status: "online", vendor: "Hikvision" }
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

export const FALLBACK_CERTIFICATES = [
  {
    certificate_id: "CERT-BSA2023-001",
    detection_id: "DET-GJ01-5",
    license_plate: "GJ01AB1234",
    camera_id: "cam14",
    violation_type: "WATCHLIST_CRITICAL_INTERCEPT",
    speed_recorded_kmh: 65.0,
    speed_limit_kmh: 80.0,
    fine_amount_inr: 5000,
    sha256_hash: "a4f899e03d4411fbce284820cbb105e492cb71a3962d80d19d690a2be28ff2c1",
    bsa_admissibility_code: "BSA-2023-SEC63-CERTIFIED",
    issued_at: new Date(Date.now() - 18 * 60000).toISOString(),
    status: "ISSUED"
  },
  {
    certificate_id: "CERT-BSA2023-002",
    detection_id: "DET-GJ01-7",
    license_plate: "GJ01AB1234",
    camera_id: "cam01",
    violation_type: "INTER_CAMERA_SPEED_VIOLATION",
    speed_recorded_kmh: 92.5,
    speed_limit_kmh: 80.0,
    fine_amount_inr: 2000,
    sha256_hash: "7f4c9c1b96d9cf88ef492d3fbe2e921d33458db4f895c479426f499694e9f3b1",
    bsa_admissibility_code: "BSA-2023-SEC63-CERTIFIED",
    issued_at: new Date(Date.now() - 40 * 60000).toISOString(),
    status: "ISSUED"
  },
  {
    certificate_id: "CERT-BSA2023-003",
    detection_id: "DET-BG-6",
    license_plate: "GJ05XY9999",
    camera_id: "cam06",
    violation_type: "WATCHLIST_CRITICAL_INTERCEPT",
    speed_recorded_kmh: 68.0,
    speed_limit_kmh: 80.0,
    fine_amount_inr: 5000,
    sha256_hash: "3d9142c2d43fccd04ea89255a62bb1e2c9447d283627ba7592cf6d82260ff288",
    bsa_admissibility_code: "BSA-2023-SEC63-CERTIFIED",
    issued_at: new Date(Date.now() - 75 * 60000).toISOString(),
    status: "ISSUED"
  },
  {
    certificate_id: "CERT-BSA2023-004",
    detection_id: "DET-GEN-1",
    license_plate: "GJ01HY5842",
    camera_id: "cam04",
    violation_type: "SPEED_VIOLATION",
    speed_recorded_kmh: 89.2,
    speed_limit_kmh: 80.0,
    fine_amount_inr: 2000,
    sha256_hash: "982ef37b4200ea8b7194605938bf8c83a812df934f828a504312674fae7b99c0",
    bsa_admissibility_code: "BSA-2023-SEC63-CERTIFIED",
    issued_at: new Date(Date.now() - 110 * 60000).toISOString(),
    status: "ISSUED"
  }
];

export const FALLBACK_ROUTE_GJ01 = {
  plate_number: "GJ01AB1234",
  total_detections: 7,
  first_seen: "2026-09-14 10:14:00",
  last_seen: "2026-09-14 11:36:00",
  total_distance_km: 38.6,
  average_speed_kmh: 58.4,
  status: "Target locked across 7 state surveillance checkpoints",
  watchlist_info: {
    plate_number: "GJ01AB1234",
    owner_name: "Vikram Rathore",
    vehicle_model: "Toyota Fortuner (White)",
    offence_type: "Stolen Vehicle / Armed Robbery",
    fir_number: "FIR-429/2026",
    police_station: "Crime Branch Ahmedabad",
    priority: "CRITICAL",
    source_db: "eGujCop"
  },
  hops: [
    { sequence: 1, camera_id: "CAM-GN-01", camera_name: "Police Bhavan Gate 1", location_name: "Sector 18, Gandhinagar", timestamp: "2026-09-14 10:14:00", latitude: 23.2156, longitude: 72.6369, speed_kmh: 0.0, distance_km: 0.0, snapshot_url: "/snapshots/gj01_1.jpg", pts_ms: 0 },
    { sequence: 2, camera_id: "CAM-GN-03", camera_name: "Infocity Circle North", location_name: "Infocity, Gandhinagar", timestamp: "2026-09-14 10:28:00", latitude: 23.1903, longitude: 72.6288, speed_kmh: 55.0, distance_km: 4.2, snapshot_url: "/snapshots/gj01_2.jpg", pts_ms: 840000 },
    { sequence: 3, camera_id: "CAM-AHM-01", camera_name: "Vaishno Devi Circle Northbound", location_name: "SG Highway, Ahmedabad", timestamp: "2026-09-14 10:42:00", latitude: 23.1368, longitude: 72.5441, speed_kmh: 62.0, distance_km: 9.8, snapshot_url: "/snapshots/gj01_3.jpg", pts_ms: 1680000 },
    { sequence: 4, camera_id: "CAM-AHM-02", camera_name: "Gota Flyover Checkpoint", location_name: "SG Highway, Gota, Ahmedabad", timestamp: "2026-09-14 10:51:00", latitude: 23.1090, longitude: 72.5360, speed_kmh: 58.0, distance_km: 4.1, snapshot_url: "/snapshots/gj01_4.jpg", pts_ms: 2220000 },
    { sequence: 5, camera_id: "CAM-AHM-04", camera_name: "ISKCON Cross Road Flyover", location_name: "SG Highway, ISKCON, Ahmedabad", timestamp: "2026-09-14 11:05:00", latitude: 23.0278, longitude: 72.5065, speed_kmh: 65.0, distance_km: 8.5, snapshot_url: "/snapshots/gj01_5.jpg", pts_ms: 3060000 },
    { sequence: 6, camera_id: "CAM-AHM-07", camera_name: "Nehrunagar Circle Traffic Post", location_name: "Nehrunagar, Ambawadi, Ahmedabad", timestamp: "2026-09-14 11:20:00", latitude: 23.0189, longitude: 72.5442, speed_kmh: 52.0, distance_km: 4.8, snapshot_url: "/snapshots/gj01_6.jpg", pts_ms: 3960000 },
    { sequence: 7, camera_id: "CAM-AHM-10", camera_name: "Narol Circle Toll Junction", location_name: "Narol-Sarkhej Highway, Ahmedabad", timestamp: "2026-09-14 11:36:00", latitude: 22.9734, longitude: 72.5925, speed_kmh: 60.0, distance_km: 7.2, snapshot_url: "/snapshots/gj01_7.jpg", pts_ms: 4920000 }
  ],
  predicted_interception: [
    {
      checkpoint: "Aslali Circle Toll Plaza (NH-48)",
      district: "Ahmedabad Rural",
      distance_km: 6.4,
      eta_minutes: 6,
      tactical_action: "Close Boom Barriers #3 & #4; Standby PCR-14 with Tire Deflation Spikes",
      probability_percent: 94
    },
    {
      checkpoint: "Bareja Police Checkpost",
      district: "Ahmedabad Rural",
      distance_km: 14.8,
      eta_minutes: 15,
      tactical_action: "Deploy Barricades; Divert Civilian Traffic to Service Road",
      probability_percent: 86
    },
    {
      checkpoint: "NE-1 Ahmedabad-Vadodara Expressway Entry",
      district: "Kheda",
      distance_km: 28.5,
      eta_minutes: 29,
      tactical_action: "Alert Expressway Patrol Team Delta; Set up Spikes at Toll Lanes",
      probability_percent: 78
    }
  ]
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
