import sqlite3
import json
from datetime import datetime, timedelta
from backend.app.config import DB_PATH

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Cameras Table (Model 1 - Registry)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cameras (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        location_name TEXT NOT NULL,
        district TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        rtsp_url TEXT NOT NULL,
        hls_url TEXT,
        codec TEXT DEFAULT 'H.264',
        resolution TEXT DEFAULT '1080p',
        status TEXT DEFAULT 'online',
        storage_retention_days INTEGER DEFAULT 15,
        vendor TEXT DEFAULT 'Hikvision',
        last_ping TEXT,
        coverage_radius_meters INTEGER DEFAULT 150
    )
    """)

    # 2. Watchlist Table (VAHAN, SARTHI, eGujCop, AFIS, NAFIS)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS watchlist (
        id TEXT PRIMARY KEY,
        plate_number TEXT UNIQUE NOT NULL,
        owner_name TEXT NOT NULL,
        vehicle_model TEXT NOT NULL,
        offence_type TEXT NOT NULL,
        fir_number TEXT,
        police_station TEXT NOT NULL,
        priority TEXT DEFAULT 'CRITICAL',
        source_db TEXT DEFAULT 'eGujCop',
        notes TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # 3. Detections Table (ANPR & Vehicle Tracking)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS detections (
        id TEXT PRIMARY KEY,
        camera_id TEXT NOT NULL,
        plate_number TEXT NOT NULL,
        vehicle_type TEXT DEFAULT 'Car',
        confidence REAL DEFAULT 0.95,
        timestamp TEXT NOT NULL,
        pts_ms INTEGER DEFAULT 0,
        snapshot_url TEXT,
        speed_kmh REAL,
        is_watchlist_match INTEGER DEFAULT 0,
        FOREIGN KEY (camera_id) REFERENCES cameras (id)
    )
    """)

    # 4. Alerts Log Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        detection_id TEXT,
        plate_number TEXT NOT NULL,
        camera_id TEXT NOT NULL,
        camera_name TEXT NOT NULL,
        location_name TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        offence_type TEXT NOT NULL,
        priority TEXT DEFAULT 'CRITICAL',
        snapshot_url TEXT,
        status TEXT DEFAULT 'NEW',
        acknowledged_by TEXT
    )
    """)

    conn.commit()

    # Seed data if empty
    cursor.execute("SELECT COUNT(*) FROM cameras")
    if cursor.fetchone()[0] == 0:
        seed_cameras(cursor)
    
    cursor.execute("SELECT COUNT(*) FROM watchlist")
    if cursor.fetchone()[0] == 0:
        seed_watchlist(cursor)

    cursor.execute("SELECT COUNT(*) FROM detections")
    if cursor.fetchone()[0] == 0:
        seed_detections(cursor)

    conn.commit()
    conn.close()

def seed_cameras(cursor):
    cameras = [
        # Gandhinagar & Police Headquarters Corridor
        ("CAM-GN-01", "Police Bhavan Gate 1", "Home Department (Police)", "Sector 18, Gandhinagar", "Gandhinagar", 23.2156, 72.6369, "rtsp://localhost:8554/stream/1", "/stream/1", "H.264", "1080p", "online", 30, "CP Plus", 200),
        ("CAM-GN-02", "Mahatma Mandir Crossroad", "Home Department (Police)", "GH Road, Sector 13, Gandhinagar", "Gandhinagar", 23.2300, 72.6450, "rtsp://localhost:8554/stream/2", "/stream/2", "H.265", "1080p", "online", 30, "Hikvision", 250),
        ("CAM-GN-03", "Infocity Circle North", "Home Department (Police)", "Infocity, Gandhinagar", "Gandhinagar", 23.1903, 72.6288, "rtsp://localhost:8554/stream/3", "/stream/3", "H.264", "4K", "online", 30, "Dahua", 200),
        ("CAM-GN-04", "RTO Gandhinagar Testing Track", "RTO Gujarat", "Sector 28, Gandhinagar", "Gandhinagar", 23.2450, 72.6520, "rtsp://localhost:8554/stream/4", "/stream/4", "H.264", "1080p", "online", 15, "CP Plus", 150),
        ("CAM-GN-05", "Civil Supplies Godown Sector 25", "Food & Civil Supplies", "GIDC Sector 25, Gandhinagar", "Gandhinagar", 23.2510, 72.6610, "rtsp://localhost:8554/stream/5", "/stream/5", "H.264", "720p", "online", 15, "Hikvision", 120),

        # Ahmedabad Strategic Ring & SG Highway Corridor
        ("CAM-AHM-01", "Vaishno Devi Circle Northbound", "Home Department (Police)", "SG Highway, Ahmedabad", "Ahmedabad", 23.1368, 72.5441, "rtsp://localhost:8554/stream/6", "/stream/6", "H.265", "4K", "online", 30, "Hikvision", 300),
        ("CAM-AHM-02", "Gota Flyover Checkpoint", "Home Department (Police)", "SG Highway, Gota, Ahmedabad", "Ahmedabad", 23.1090, 72.5360, "rtsp://localhost:8554/stream/7", "/stream/7", "H.264", "1080p", "online", 30, "CP Plus", 250),
        ("CAM-AHM-03", "Thaltej Cross Road CCTV", "AMC (Municipal Corp)", "Thaltej, SG Highway, Ahmedabad", "Ahmedabad", 23.0515, 72.5098, "rtsp://localhost:8554/stream/8", "/stream/8", "H.264", "1080p", "online", 15, "Dahua", 200),
        ("CAM-AHM-04", "ISKCON Cross Road Flyover", "Home Department (Police)", "SG Highway, ISKCON, Ahmedabad", "Ahmedabad", 23.0278, 72.5065, "rtsp://localhost:8554/stream/9", "/stream/9", "H.265", "4K", "online", 30, "Hikvision", 250),
        ("CAM-AHM-05", "Pakwan Cross Road East", "AMC (Municipal Corp)", "Bodakdev, Ahmedabad", "Ahmedabad", 23.0370, 72.5150, "rtsp://localhost:8554/stream/10", "/stream/10", "H.264", "1080p", "online", 15, "CP Plus", 200),
        ("CAM-AHM-06", "Shivranjani Cross Roads", "Home Department (Police)", "Satellite, Ahmedabad", "Ahmedabad", 23.0234, 72.5298, "rtsp://localhost:8554/stream/11", "/stream/11", "H.264", "1080p", "online", 30, "Hikvision", 200),
        ("CAM-AHM-07", "Nehrunagar Circle Traffic Post", "Home Department (Police)", "Nehrunagar, Ambawadi, Ahmedabad", "Ahmedabad", 23.0189, 72.5442, "rtsp://localhost:8554/stream/12", "/stream/12", "H.264", "1080p", "online", 30, "CP Plus", 200),
        ("CAM-AHM-08", "Paldi Cross Road Bridge", "AMC (Municipal Corp)", "Paldi, Ahmedabad", "Ahmedabad", 23.0125, 72.5650, "rtsp://localhost:8554/stream/13", "/stream/13", "H.264", "1080p", "online", 15, "Dahua", 200),
        ("CAM-AHM-09", "Geeta Mandir ST Bus Station", "Home Department (Police)", "Geeta Mandir, Ahmedabad", "Ahmedabad", 23.0118, 72.5892, "rtsp://localhost:8554/stream/14", "/stream/14", "H.264", "1080p", "online", 30, "Hikvision", 250),
        ("CAM-AHM-10", "Narol Circle Toll Junction", "Home Department (Police)", "Narol-Sarkhej Highway, Ahmedabad", "Ahmedabad", 22.9734, 72.5925, "rtsp://localhost:8554/stream/15", "/stream/15", "H.265", "4K", "online", 30, "Hikvision", 300),
        ("CAM-AHM-11", "RTO Ahmedabad Subhash Bridge", "RTO Gujarat", "Subhash Bridge, Ahmedabad", "Ahmedabad", 23.0645, 72.5802, "rtsp://localhost:8554/stream/16", "/stream/16", "H.264", "1080p", "online", 15, "CP Plus", 180),
        ("CAM-AHM-12", "APMC Grain Market Godown", "Food & Civil Supplies", "Vasna, Ahmedabad", "Ahmedabad", 22.9980, 72.5510, "rtsp://localhost:8554/stream/17", "/stream/17", "H.264", "720p", "degraded", 7, "CP Plus", 100),
        ("CAM-AHM-13", "Alpha One Mall Perimeter Gate 2", "Private/Commercial", "Vastrapur, Ahmedabad", "Ahmedabad", 23.0401, 72.5312, "rtsp://localhost:8554/stream/18", "/stream/18", "H.264", "1080p", "online", 15, "Hikvision", 120),
        ("CAM-AHM-14", "Sabarmati Riverfront North", "AMC (Municipal Corp)", "Riverfront West, Ahmedabad", "Ahmedabad", 23.0478, 72.5712, "rtsp://localhost:8554/stream/19", "/stream/19", "H.264", "1080p", "online", 15, "Dahua", 250),
        ("CAM-AHM-15", "Kalupur Railway Station Plaza", "Home Department (Police)", "Kalupur, Ahmedabad", "Ahmedabad", 23.0280, 72.6015, "rtsp://localhost:8554/stream/20", "/stream/20", "H.265", "4K", "online", 30, "Hikvision", 300),

        # Vadodara
        ("CAM-VAD-01", "Alkapuri Railway Underpass", "Home Department (Police)", "Alkapuri, Vadodara", "Vadodara", 22.3106, 73.1812, "rtsp://localhost:8554/stream/21", "/stream/21", "H.264", "1080p", "online", 30, "Hikvision", 200),
        ("CAM-VAD-02", "Genda Circle North", "VMC (Municipal Corp)", "Sayajiganj, Vadodara", "Vadodara", 22.3200, 73.1750, "rtsp://localhost:8554/stream/22", "/stream/22", "H.264", "1080p", "online", 15, "Dahua", 200),
        ("CAM-VAD-03", "RTO Vadodara Golden Cross", "RTO Gujarat", "NH-48 Golden Chowkdi, Vadodara", "Vadodara", 22.3480, 73.2350, "rtsp://localhost:8554/stream/23", "/stream/23", "H.265", "1080p", "online", 15, "CP Plus", 250),
        ("CAM-VAD-04", "Civil Supplies Central Depot", "Food & Civil Supplies", "Makarpura GIDC, Vadodara", "Vadodara", 22.2510, 73.1950, "rtsp://localhost:8554/stream/24", "/stream/24", "H.264", "720p", "online", 15, "Hikvision", 150),
        ("CAM-VAD-05", "Nyay Mandir Police Chowki", "Home Department (Police)", "Old City, Vadodara", "Vadodara", 22.3015, 73.2085, "rtsp://localhost:8554/stream/25", "/stream/25", "H.264", "1080p", "online", 30, "CP Plus", 180),

        # Surat
        ("CAM-SUR-01", "Athwa Gate Junction", "Home Department (Police)", "Athwa Lines, Surat", "Surat", 21.1835, 72.8124, "rtsp://localhost:8554/stream/26", "/stream/26", "H.265", "4K", "online", 30, "Hikvision", 250),
        ("CAM-SUR-02", "Majura Gate Intersection", "SMC (Municipal Corp)", "Ring Road, Surat", "Surat", 21.1765, 72.8220, "rtsp://localhost:8554/stream/27", "/stream/27", "H.264", "1080p", "online", 15, "Dahua", 200),
        ("CAM-SUR-03", "Surat Diamond Bourse Main Gate", "Private/Commercial", "DREAM City, Khajod, Surat", "Surat", 21.1180, 72.7650, "rtsp://localhost:8554/stream/28", "/stream/28", "H.265", "4K", "online", 30, "Hikvision", 250),
        ("CAM-SUR-04", "RTO Surat Pal", "RTO Gujarat", "Pal-Adajan, Surat", "Surat", 21.1980, 72.7750, "rtsp://localhost:8554/stream/29", "/stream/29", "H.264", "1080p", "online", 15, "CP Plus", 180),
        ("CAM-SUR-05", "Kamrej Toll Plaza Entry", "Home Department (Police)", "NH-48 Kamrej, Surat", "Surat", 21.2720, 72.9650, "rtsp://localhost:8554/stream/30", "/stream/30", "H.265", "4K", "online", 30, "Hikvision", 350),

        # Rajkot
        ("CAM-RAJ-01", "Trikon Baug Traffic Post", "Home Department (Police)", "Civil Hospital Road, Rajkot", "Rajkot", 22.3025, 70.8015, "rtsp://localhost:8554/stream/31", "/stream/31", "H.264", "1080p", "online", 30, "CP Plus", 200),
        ("CAM-RAJ-02", "Madhapar Chowkdi Ring Road", "RMC (Municipal Corp)", "150 Feet Ring Road, Rajkot", "Rajkot", 22.3350, 70.7720, "rtsp://localhost:8554/stream/32", "/stream/32", "H.265", "1080p", "online", 15, "Hikvision", 250),
        ("CAM-RAJ-03", "Civil Supplies Grain Terminal", "Food & Civil Supplies", "Aji GIDC, Rajkot", "Rajkot", 22.2750, 70.8350, "rtsp://localhost:8554/stream/33", "/stream/33", "H.264", "720p", "offline", 15, "CP Plus", 150),
        ("CAM-RAJ-04", "Gondal Road Overbridge", "Home Department (Police)", "Gondal Road, Rajkot", "Rajkot", 22.2680, 70.7950, "rtsp://localhost:8554/stream/34", "/stream/34", "H.264", "1080p", "online", 30, "Dahua", 200),

        # Jamnagar
        ("CAM-JAM-01", "Digjam Circle Checkpost", "Home Department (Police)", "Jamnagar Bypass", "Jamnagar", 22.4580, 70.0450, "rtsp://localhost:8554/stream/35", "/stream/35", "H.264", "1080p", "online", 30, "Hikvision", 200),
        ("CAM-JAM-02", "Reliance Complex Highway Entry", "Private/Commercial", "Moti Khavdi, Jamnagar", "Jamnagar", 22.3850, 69.8520, "rtsp://localhost:8554/stream/36", "/stream/36", "H.265", "4K", "online", 30, "Hikvision", 300),

        # Dwarka & Somnath Coastal Border Checkpoints
        ("CAM-DWK-01", "Dwarkadhish Temple North Gate", "Home Department (Police)", "Dwarka City", "Devbhumi Dwarka", 22.2395, 68.9678, "rtsp://localhost:8554/stream/37", "/stream/37", "H.264", "1080p", "online", 30, "Hikvision", 250),
        ("CAM-DWK-02", "Okha Port Coastal Security Post", "Home Department (Police)", "Okha Port", "Devbhumi Dwarka", 22.4680, 69.0720, "rtsp://localhost:8554/stream/38", "/stream/38", "H.265", "4K", "online", 30, "CP Plus", 350),
        ("CAM-SOM-01", "Somnath Temple Plaza Entry", "Home Department (Police)", "Prabhas Patan, Somnath", "Gir Somnath", 20.8880, 70.4012, "rtsp://localhost:8554/stream/39", "/stream/39", "H.265", "4K", "online", 30, "Hikvision", 300),
        ("CAM-SOM-02", "Veraval Coastal Highway Checkpoint", "Home Department (Police)", "Veraval Bypass", "Gir Somnath", 20.9120, 70.3650, "rtsp://localhost:8554/stream/40", "/stream/40", "H.264", "1080p", "online", 30, "Dahua", 250),

        # Dahod (Eastern Interstate Border)
        ("CAM-DAH-01", "Dahod MP Border RTO Checkpost", "RTO Gujarat", "Jhabua-Dahod Highway", "Dahod", 22.8350, 74.3120, "rtsp://localhost:8554/stream/41", "/stream/41", "H.265", "4K", "online", 30, "Hikvision", 350),
        ("CAM-DAH-02", "Dahod Civil Supplies Warehouse", "Food & Civil Supplies", "Station Road, Dahod", "Dahod", 22.8390, 74.2580, "rtsp://localhost:8554/stream/42", "/stream/42", "H.264", "720p", "online", 15, "CP Plus", 120),
        ("CAM-DAH-03", "Dahod Smart City Command Circle", "Home Department (Police)", "Tower Chowk, Dahod", "Dahod", 22.8375, 74.2560, "rtsp://localhost:8554/stream/43", "/stream/43", "H.264", "1080p", "online", 30, "Dahua", 200),

        # Valsad (Southern Maharashtra Border)
        ("CAM-VAL-01", "Bhilad Interstate Checkpost", "Home Department (Police)", "NH-48 Bhilad, Valsad", "Valsad", 20.2850, 72.9150, "rtsp://localhost:8554/stream/44", "/stream/44", "H.265", "4K", "online", 30, "Hikvision", 350),
        ("CAM-VAL-02", "Valsad Tithal Beach Security Post", "Home Department (Police)", "Tithal Beach, Valsad", "Valsad", 20.5980, 72.9020, "rtsp://localhost:8554/stream/45", "/stream/45", "H.264", "1080p", "online", 30, "CP Plus", 200),

        # Kutch Border & Mundra Port
        ("CAM-KUT-01", "Samakhiali Toll Plaza (Kutch Entry)", "Home Department (Police)", "NH-41 Samakhiali, Kutch", "Kutch", 23.3150, 70.5280, "rtsp://localhost:8554/stream/46", "/stream/46", "H.265", "4K", "online", 30, "Hikvision", 350),
        ("CAM-KUT-02", "Mundra Port Logistics Corridor", "Private/Commercial", "Adani Port Road, Mundra", "Kutch", 22.8350, 69.7150, "rtsp://localhost:8554/stream/47", "/stream/47", "H.264", "1080p", "online", 15, "Dahua", 250),
        ("CAM-KUT-03", "Bhuj Jubilee Ground Circle", "Home Department (Police)", "Bhuj City", "Kutch", 23.2510, 69.6680, "rtsp://localhost:8554/stream/48", "/stream/48", "H.264", "1080p", "online", 30, "CP Plus", 200),
        ("CAM-BHV-01", "Bhavnagar Ship Breaking Yard Entry", "Home Department (Police)", "Alang, Bhavnagar", "Bhavnagar", 21.4120, 72.1950, "rtsp://localhost:8554/stream/49", "/stream/49", "H.264", "1080p", "online", 30, "Hikvision", 250),
        ("CAM-BHV-02", "Ghogha Ro-Pax Ferry Terminal", "Home Department (Police)", "Ghogha Port, Bhavnagar", "Bhavnagar", 21.6850, 72.2820, "rtsp://localhost:8554/stream/50", "/stream/50", "H.265", "4K", "online", 30, "CP Plus", 300),
    ]

    now_str = datetime.now().isoformat()
    for c in cameras:
        cursor.execute("""
        INSERT INTO cameras (id, name, department, location_name, district, latitude, longitude, rtsp_url, hls_url, codec, resolution, status, storage_retention_days, vendor, last_ping, coverage_radius_meters)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[12], c[13], now_str, c[14]))

def seed_watchlist(cursor):
    watchlist = [
        # Hackathon designated primary target vehicle
        ("WL-01", "GJ01AB1234", "Vikram Rathore", "Toyota Fortuner (White)", "Stolen Vehicle / Armed Robbery", "FIR-429/2026", "Crime Branch Ahmedabad", "CRITICAL", "eGujCop", "Armed suspects fleeing towards South Gujarat. Intercept immediately."),
        ("WL-02", "GJ05XY9999", "Mohanlal Patel", "Mahindra Scorpio (Black)", "Wanted Criminal / Smuggling", "FIR-108/2026", "Athwa Lines PS Surat", "CRITICAL", "eGujCop", "Wanted under NDPS Act. Fake registration suspected."),
        ("WL-03", "GJ27CD5678", "Rakesh Solanki", "Maruti Brezza (Grey)", "Hit & Run / Fatality", "FIR-77/2026", "Infocity PS Gandhinagar", "HIGH", "VAHAN", "Involved in fatal collision on GH-Road. Vehicle impound order issued."),
        ("WL-04", "GJ03KL4321", "Unknown Suspect", "Hyundai Creta (Silver)", "Kidnapping / Amber Alert", "FIR-912/2026", "B-Division Rajkot", "CRITICAL", "eGujCop", "Minor child abducted from school premise. State-wide red alert."),
        ("WL-05", "GJ06MN8888", "Kishore Parmar", "Tata Nexon (Blue)", "Tax Evasion / Blacklisted RTO", "CH-2026-992", "RTO Vadodara", "MEDIUM", "SARTHI", "Commercial registration fraud and unserved court summons."),
        ("WL-06", "GJ12BB0007", "Jabbar Khan", "Toyota Innova (Silver)", "Illegal Sand Mining / Border Evasion", "FIR-314/2026", "Dahod Town PS", "HIGH", "eGujCop", "Repeatedly evading MP-Gujarat interstate border checkpoint."),
        ("WL-07", "GJ02PQ6543", "Dharmesh Shah", "Honda City (White)", "Bank Fraud / Absconding Accused", "FIR-511/2026", "CID Crime Gujarat", "HIGH", "AFIS", "Lookout Circular (LOC) issued by Special Investigation Team."),
        ("WL-08", "GJ18ZZ1111", "Altaf Mansuri", "Eicher Canter (Yellow)", "PDS Grain Divergence / Black Marketing", "FIR-204/2026", "Civil Supplies Vigilance", "CRITICAL", "eGujCop", "Diverted government subsidised ration grains from Sector 25 godown."),
        ("WL-09", "GJ15TT9090", "Shailesh Desai", "Mahindra Bolero Pickup", "Liquor Smuggling (Prohibition Act)", "FIR-88/2026", "Bhilad Checkpost PS", "HIGH", "eGujCop", "Modus operandi: Interstate illicit liquor smuggling into Valsad."),
        ("WL-10", "GJ11AA4444", "Pravin Koli", "Bajaj Pulsar 220", "Chain Snatching Serial Offender", "FIR-167/2026", "Dwarka Coastal PS", "MEDIUM", "NAFIS", "Fingerprints matched with NAFIS national database. Active in temple area."),
    ]

    now_str = datetime.now().isoformat()
    for w in watchlist:
        cursor.execute("""
        INSERT INTO watchlist (id, plate_number, owner_name, vehicle_model, offence_type, fir_number, police_station, priority, source_db, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (w[0], w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], w[9], now_str))

def seed_detections(cursor):
    # Seed full realistic movement trace for primary target vehicle GJ01AB1234
    # Reconstructing route from Gandhinagar -> SG Highway Ahmedabad -> Narol Highway
    base_time = datetime.now() - timedelta(hours=2)

    gj01_hops = [
        ("CAM-GN-01", 0, 0.0, 0.0, "/snapshots/gj01_1.jpg"),     # Police Bhavan Gate 1
        ("CAM-GN-03", 14, 4.2, 55.0, "/snapshots/gj01_2.jpg"),    # Infocity Circle North
        ("CAM-AHM-01", 28, 9.8, 62.0, "/snapshots/gj01_3.jpg"),   # Vaishno Devi Circle
        ("CAM-AHM-02", 37, 4.1, 58.0, "/snapshots/gj01_4.jpg"),   # Gota Flyover Checkpoint
        ("CAM-AHM-04", 51, 8.5, 65.0, "/snapshots/gj01_5.jpg"),   # ISKCON Cross Road
        ("CAM-AHM-07", 66, 4.8, 52.0, "/snapshots/gj01_6.jpg"),   # Nehrunagar Circle
        ("CAM-AHM-10", 82, 7.2, 60.0, "/snapshots/gj01_7.jpg"),   # Narol Circle Toll Junction
    ]

    for idx, (cam_id, offset_mins, dist, speed, snap) in enumerate(gj01_hops):
        det_id = f"DET-GJ01-{idx+1}"
        det_time = (base_time + timedelta(minutes=offset_mins)).strftime("%Y-%m-%d %H:%M:%S")
        pts = int(offset_mins * 60 * 1000)

        cursor.execute("""
        INSERT INTO detections (id, camera_id, plate_number, vehicle_type, confidence, timestamp, pts_ms, snapshot_url, speed_kmh, is_watchlist_match)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (det_id, cam_id, "GJ01AB1234", "SUV", 0.98, det_time, pts, snap, speed, 1))

        # Also add corresponding alert in alerts log
        alert_id = f"ALT-GJ01-{idx+1}"
        cursor.execute("""
        INSERT INTO alerts (id, detection_id, plate_number, camera_id, camera_name, location_name, timestamp, offence_type, priority, snapshot_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (alert_id, det_id, "GJ01AB1234", cam_id, f"CCTV Node {cam_id}", "Gujarat Surveillance Grid", det_time, "Stolen Vehicle / Armed Robbery", "CRITICAL", snap, "NEW" if idx >= 5 else "RESOLVED"))

    # Seed random background benign traffic detections to show active multi-camera filtering
    other_plates = [
        ("GJ01DK5566", "CAM-AHM-03", "Car", 0.94, -30, 48.0),
        ("GJ27EA9081", "CAM-GN-02", "Motorcycle", 0.91, -25, 42.0),
        ("GJ05TR3344", "CAM-SUR-01", "Car", 0.96, -20, 52.0),
        ("GJ06KL1212", "CAM-VAD-01", "Bus", 0.93, -15, 38.0),
        ("GJ03HH8989", "CAM-RAJ-01", "Truck", 0.89, -10, 40.0),
        ("GJ05XY9999", "CAM-SUR-05", "SUV", 0.97, -5, 68.0),  # Match in Surat!
    ]

    for idx, (plate, cam_id, vtype, conf, offset_mins, speed) in enumerate(other_plates):
        det_id = f"DET-BG-{idx+1}"
        det_time = (datetime.now() + timedelta(minutes=offset_mins)).strftime("%Y-%m-%d %H:%M:%S")
        is_match = 1 if plate == "GJ05XY9999" else 0
        snap = f"/snapshots/bg_{idx+1}.jpg"

        cursor.execute("""
        INSERT INTO detections (id, camera_id, plate_number, vehicle_type, confidence, timestamp, pts_ms, snapshot_url, speed_kmh, is_watchlist_match)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (det_id, cam_id, plate, vtype, conf, det_time, 0, snap, speed, is_match))

        if is_match:
            cursor.execute("""
            INSERT INTO alerts (id, detection_id, plate_number, camera_id, camera_name, location_name, timestamp, offence_type, priority, snapshot_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (f"ALT-BG-{idx+1}", det_id, plate, cam_id, "Kamrej Toll Plaza Entry", "NH-48 Kamrej, Surat", det_time, "Wanted Criminal / Smuggling", "CRITICAL", snap, "NEW"))
