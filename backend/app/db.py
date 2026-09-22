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

    # 5. Evidence Certificates Table (BSA 2023 Sec 63 & Sec 65B Admissibility)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence_certificates (
        certificate_id TEXT PRIMARY KEY,
        detection_id TEXT NOT NULL,
        license_plate TEXT NOT NULL,
        camera_id TEXT NOT NULL,
        violation_type TEXT NOT NULL,
        speed_recorded_kmh REAL,
        speed_limit_kmh REAL DEFAULT 80.0,
        fine_amount_inr INTEGER DEFAULT 1000,
        sha256_hash TEXT NOT NULL,
        digital_signature TEXT NOT NULL,
        bsa_admissibility_code TEXT DEFAULT 'BSA-2023-SEC63-CERTIFIED',
        issued_at TEXT NOT NULL,
        status TEXT DEFAULT 'ISSUED'
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

    cursor.execute("SELECT COUNT(*) FROM evidence_certificates")
    if cursor.fetchone()[0] == 0:
        seed_evidence_certificates(cursor)

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
        # Real Sentinel Live Camera Grid (cam01 to cam30 from cctv.corp8.cloud)
        ("cam01", "01 Chiman bhai Bridge", "Home Department (Police)", "Chimanbhai Bridge, Ahmedabad", "Ahmedabad", 23.0645, 72.5810, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam01", "https://cctv.corp8.cloud/cam01/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 250),
        ("cam02", "02 Janpath", "Municipal Corporation", "Janpath Road, Ahmedabad", "Ahmedabad", 23.0305, 72.5650, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam02", "https://cctv.corp8.cloud/cam02/index.m3u8", "H.264", "1080p", "online", 15, "Sentinel Edge", 200),
        ("cam03", "03 O.N.G.C. Office", "Home Department (Police)", "ONGC Complex, Ahmedabad", "Ahmedabad", 23.0920, 72.5930, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam03", "https://cctv.corp8.cloud/cam03/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 220),
        ("cam04", "04 Paldi Circle", "Home Department (Police)", "Paldi Cross Roads, Ahmedabad", "Ahmedabad", 23.0124, 72.5625, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam04", "https://cctv.corp8.cloud/cam04/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 250),
        ("cam05", "05 Visat teen Rasta", "RTO Checkpost", "Visat Three Roads, Sabarmati, Ahmedabad", "Ahmedabad", 23.1020, 72.5910, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam05", "https://cctv.corp8.cloud/cam05/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 200),
        ("cam06", "06 Timbavadi gate-Junagadh", "Home Department (Police)", "Timbavadi Gate, Junagadh", "Junagadh", 21.5120, 70.4680, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam06", "https://cctv.corp8.cloud/cam06/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 200),
        ("cam07", "07 hero-showroom-gir-somnath", "Home Department (Police)", "Veraval Highway, Gir Somnath", "Gir Somnath", 20.9020, 70.3710, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam07", "https://cctv.corp8.cloud/cam07/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 180),
        ("cam08", "08 majewadi-gate-junagadh", "Municipal Corporation", "Majewadi Gate, Junagadh", "Junagadh", 21.5280, 70.4590, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam08", "https://cctv.corp8.cloud/cam08/index.m3u8", "H.264", "1080p", "online", 15, "Sentinel Edge", 190),
        ("cam09", "09 new-bypass-near-by-circle-junagadh-2", "RTO Checkpost", "New Bypass Circle, Junagadh", "Junagadh", 21.5410, 70.4720, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam09", "https://cctv.corp8.cloud/cam09/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 220),
        ("cam10", "10 char-chowk-road-2-junagadh", "Smart City VMS", "Char Chowk Road, Junagadh", "Junagadh", 21.5190, 70.4610, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam10", "https://cctv.corp8.cloud/cam10/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 200),
        ("cam11", "11 dolatpara-junagadh", "Home Department (Police)", "Dolatpara, Junagadh", "Junagadh", 21.5510, 70.4690, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam11", "https://cctv.corp8.cloud/cam11/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 200),
        ("cam12", "12 Tri Mandir Adalaj Tollnaka", "RTO Checkpost", "Adalaj Tollnaka, Gandhinagar", "Gandhinagar", 23.1680, 72.5810, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam12", "https://cctv.corp8.cloud/cam12/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 300),
        ("cam13", "13 CN Vidhyalaya", "Municipal Corporation", "CN Vidhyalaya Road, Ahmedabad", "Ahmedabad", 23.0280, 72.5480, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam13", "https://cctv.corp8.cloud/cam13/index.m3u8", "H.264", "1080p", "online", 15, "Sentinel Edge", 180),
        ("cam14", "14 Delight RLVD", "Home Department (Police)", "Delight RLVD Crossroad, Ahmedabad", "Ahmedabad", 23.0380, 72.5520, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam14", "https://cctv.corp8.cloud/cam14/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 250),
        ("cam15", "15 Suvidha park", "Smart City VMS", "Suvidha Park, Ahmedabad", "Ahmedabad", 23.0190, 72.5390, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam15", "https://cctv.corp8.cloud/cam15/index.m3u8", "H.264", "1080p", "online", 15, "Sentinel Edge", 150),
        ("cam16", "16 Visat P2", "Home Department (Police)", "Visat Perimeter 2, Ahmedabad", "Ahmedabad", 23.1040, 72.5925, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam16", "https://cctv.corp8.cloud/cam16/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 210),
        ("cam17", "17 Rajkot Bus Port CCTV", "Transport Dept", "Rajkot Central Bus Port", "Rajkot", 22.3010, 70.8010, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam17", "https://cctv.corp8.cloud/cam17/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 250),
        ("cam18", "18 Rajkot CCTV", "Home Department (Police)", "Kasturba Road, Rajkot", "Rajkot", 22.3050, 70.7980, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam18", "https://cctv.corp8.cloud/cam18/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 220),
        ("cam19", "19 Khaparia Gram Panchayat", "Home Department (Police)", "Gandevi, Navsari", "Navsari", 20.8410, 72.9810, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam19", "https://cctv.corp8.cloud/cam19/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 180),
        ("cam20", "20 Mohanpura", "Smart City VMS", "Mohanpura, Gandhinagar", "Gandhinagar", 23.2380, 72.6450, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam20", "https://cctv.corp8.cloud/cam20/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 200),
        ("cam21", "23 Patan Dethali Char Rasta", "RTO Checkpost", "Dethali Cross Roads, Patan", "Patan", 23.8510, 72.1280, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam21", "https://cctv.corp8.cloud/cam21/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 240),
        ("cam22", "28 BK Mervada tran Rasta", "Home Department (Police)", "Mervada Three Roads, Banaskantha", "Banaskantha", 24.1720, 72.4380, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam22", "https://cctv.corp8.cloud/cam22/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 200),
        ("cam23", "30 kheram", "Home Department (Police)", "Kheram Highway, Gujarat Corridor", "Gujarat Corridor", 22.4510, 71.8210, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam23", "https://cctv.corp8.cloud/cam23/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 250),
        ("cam24", "33 dehgam", "Municipal Corporation", "Dehgam Circle, Gandhinagar", "Gandhinagar", 23.1680, 72.8120, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam24", "https://cctv.corp8.cloud/cam24/index.m3u8", "H.264", "1080p", "online", 15, "Sentinel Edge", 200),
        ("cam25", "34 dhanori", "RTO Checkpost", "Dhanori Border Post, Navsari", "Navsari", 20.8910, 72.9510, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam25", "https://cctv.corp8.cloud/cam25/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 220),
        ("cam26", "35 TANKAL", "Home Department (Police)", "Tankal Checkpoint, Navsari", "Navsari", 20.7810, 73.0120, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam26", "https://cctv.corp8.cloud/cam26/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 200),
        ("cam27", "36 bilimora", "Municipal Corporation", "Station Road, Bilimora, Navsari", "Navsari", 20.7610, 72.9680, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam27", "https://cctv.corp8.cloud/cam27/index.m3u8", "H.264", "1080p", "online", 15, "Sentinel Edge", 180),
        ("cam28", "37 bilimora", "Smart City VMS", "Main Bazar, Bilimora, Navsari", "Navsari", 20.7640, 72.9710, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam28", "https://cctv.corp8.cloud/cam28/index.m3u8", "H.264", "1080p", "online", 15, "Sentinel Edge", 180),
        ("cam29", "38 bilimora", "Home Department (Police)", "Coastal Highway, Bilimora, Navsari", "Navsari", 20.7680, 72.9750, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam29", "https://cctv.corp8.cloud/cam29/index.m3u8", "H.264", "1080p", "online", 30, "Sentinel Edge", 200),
        ("cam30", "Gandhidham Rambaugh p2", "Home Department (Police)", "Rambaugh Road, Gandhidham, Kutch", "Kutch", 23.0780, 70.1340, "rtsp://nateshnkraja%40gmail.com:NYYR-SQ5F-TQ7N@103.250.160.189:8554/stream/cam30", "https://cctv.corp8.cloud/cam30/index.m3u8", "H.265", "4K", "online", 30, "Sentinel Edge", 300),
    ]

    now_str = datetime.now().isoformat()
    for c in cameras:
        cursor.execute("""
        INSERT OR REPLACE INTO cameras (id, name, department, location_name, district, latitude, longitude, rtsp_url, hls_url, codec, resolution, status, storage_retention_days, vendor, last_ping, coverage_radius_meters)
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

def seed_evidence_certificates(cursor):
    import hashlib
    now = datetime.now()

    certs = [
        ("CERT-BSA2023-001", "DET-GJ01-5", "GJ01AB1234", "CAM-AHM-04", "WATCHLIST_CRITICAL_INTERCEPT", 65.0, 80.0, 5000, "2026-09-14T11:05:00Z"),
        ("CERT-BSA2023-002", "DET-GJ01-7", "GJ01AB1234", "CAM-AHM-10", "INTER_CAMERA_SPEED_VIOLATION", 92.5, 80.0, 2000, "2026-09-14T11:36:00Z"),
        ("CERT-BSA2023-003", "DET-BG-6", "GJ05XY9999", "CAM-SUR-05", "WATCHLIST_CRITICAL_INTERCEPT", 68.0, 80.0, 5000, (now - timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M:%SZ")),
        ("CERT-BSA2023-004", "DET-GEN-1", "GJ01HY5842", "cam14", "SPEED_VIOLATION", 89.2, 80.0, 2000, (now - timedelta(minutes=35)).strftime("%Y-%m-%dT%H:%M:%SZ")),
        ("CERT-BSA2023-005", "DET-GEN-2", "GJ18BF4092", "cam06", "WATCHLIST_HIGH_THREAT", 72.0, 80.0, 3000, (now - timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M:%SZ")),
    ]

    for cert_id, det_id, plate, cam_id, vtype, speed, limit, fine, issued_at in certs:
        p_load = f"{cert_id}|{plate}|{cam_id}|{vtype}|{speed}|{issued_at}|SEC63-BSA2023"
        e_hash = hashlib.sha256(p_load.encode("utf-8")).hexdigest()
        sig = hashlib.sha512(f"SCRB-{e_hash}".encode("utf-8")).hexdigest()

        cursor.execute("""
        INSERT INTO evidence_certificates (
            certificate_id, detection_id, license_plate, camera_id, violation_type,
            speed_recorded_kmh, speed_limit_kmh, fine_amount_inr, sha256_hash,
            digital_signature, bsa_admissibility_code, issued_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            cert_id, det_id, plate, cam_id, vtype, speed, limit, fine, e_hash,
            sig, "BSA-2023-SEC63-CERTIFIED", issued_at, "ISSUED"
        ))
