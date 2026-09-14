# Technical Proposal: High-Level Design (HLD)
## Project Sentinel — Integrated Video Management & Predictive Analytics
### Gujarat Police Innovation Challenge 2026

**Author:** Sentinel Architecture & AI Engineering Team  
**Target Organization:** Government of Gujarat — Home Department & State Crime Record Bureau (SCRB), Gandhinagar  
**Evaluation Model:** Hybrid Architecture (Model 1: GIS Registry + Model 2: Stream Ingestion + Model 3: VMS Middleware)  

---

### 1. Executive Summary & Problem Understanding
The Government of Gujarat operates approximately 80,000 CCTV cameras deployed across 26 independent government departments (Home/Police, RTO, Food & Civil Supplies, Municipal Corporations, Port Authorities, etc.). Currently, these systems function as isolated data silos characterized by:
- Heterogeneous hardware: Multi-vendor cameras (CP Plus, Hikvision, Dahua, Axis) and NVRs with mixed codecs (H.264 / H.265) and varying storage retention periods (7 to 30 days).
- Geographical dispersion: Stretching over 1,000 km from interstate borders (Valsad, Dahod) to coastal outposts (Dwarka, Somnath, Kutch).
- Manual monitoring bottlenecks: Lack of automated cross-referencing with law enforcement databases (VAHAN, SARTHI, eGujCop CCTNS, AFIS, NAFIS).

**Sentinel** delivers an open, modular, vendor-neutral, and cyber-resilient integration ecosystem that bridges these fragmented departments into a unified command and control fabric.

---

### 2. High-Level System Architecture

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                 DEPARTMENTAL CCTV INFRASTRUCTURE (26 DEPTS)                 │
  │   [Police Surveillance]  [RTO Checkposts]  [Civil Supplies]  [Municipal]    │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ RTSP / ONVIF / APIs (TCP Forced)
  ┌──────────────────────────────────────▼──────────────────────────────────────┐
  │                   SENTINEL EDGE INGESTION & ADAPTER LAYER                   │
  │  - Protocol Normalizer (RTSP-over-TCP, HLS, Vendor SDKs)                    │
  │  - Codec & Stream Transcoder (H.264 / H.265 Hardware Decoders)              │
  │  - Resilience Manager (PTS-based monotonic clock, auto-reconnect backoff)   │
  │  - Edge ANPR & Vehicle Classifier (YOLOv11 + OCR regex validator)           │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ Low-Bandwidth Metadata Stream (JSON/Proto)
  ┌──────────────────────────────────────▼──────────────────────────────────────┐
  │                   CENTRAL MESSAGE BROKER & EVENT CORRELATOR                 │
  │  - Apache Kafka Distributed Message Bus (Partitioned by District/District)  │
  │  - Watchlist Correlation Engine (Sub-100ms fuzzy & exact plate lookup)      │
  │  - State Databases: VAHAN (Vehicles), eGujCop (FIRs), SARTHI, AFIS/NAFIS     │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
  ┌──────────────────────────────────────▼──────────────────────────────────────┐
  │                    STATE-WIDE COMMAND & CONTROL PLATFORM                    │
  │  - Model 1: GIS Asset Registry & Gap Analysis Heatmap (PostGIS / Leaflet)   │
  │  - Model 2: Unified Multi-Feed Video Wall with Live ANPR Reticles           │
  │  - Evaluator Feature 1: Designated Vehicle Route Reconstruction & Speed     │
  │  - Evaluator Feature 2: Real-Time Watchlist Push Alerting to Police Control │
  │  - Tiered Storage Lifecycle (Hot NVMe 7d -> Warm S3 23d -> Cold Archive 60d)│
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Ingestion & Protocol Resilience (Integrator's Guide Compliance)
In strict accordance with the official Gujarat Police Sentinel Integrator's Guide:
1. **Dynamic Catalog Discovery:** Feeds are never hardcoded; the system queries `/api/ingest` to discover camera IDs, location coordinates, codecs, and stream URLs.
2. **Forced RTSP-over-TCP:** All client connections enforce `rtsp_transport=tcp` (`OPENCV_FFMPEG_CAPTURE_OPTIONS="rtsp_transport;tcp"`). UDP is rejected to eliminate firewall packet drops and partial frame corruption.
3. **Monotonic Presentation Timestamps (PTS):** System relies strictly on hardware PTS (`cap.get(cv2.CAP_PROP_POS_MSEC)`) instead of unreliable `CAP_PROP_FPS` or wall-clock arrival times.
4. **Discontinuity & Reconnection Tolerance:** Stream looping cuts and camera restarts trigger an exponential backoff reconnection engine (2s initial, capped at 30s) without crash or buffer overflow.

---

### 4. AI Video Analytics & Watchlist Correlation Pipeline
- **Vehicle Detection:** Subsampled frame ingestion (2–3 FPS per stream) feeding lightweight YOLO models (`classes=[car, motorcycle, bus, truck]`).
- **Indian Number Plate Normalization:** Automated regex verification:
  $$\text{Regex: } \wedge[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}\$$
  Applies optical character substitution heuristics for common confusions (e.g. `6J` $\rightarrow$ `GJ`, `0` $\rightarrow$ `O`).
- **Real-Time Watchlist Matching:** Incoming detections are evaluated against local in-memory Bloom filters and Redis key-value lookups backed by eGujCop FIR records.
- **Alert Dispatch:** Matches trigger instantaneous WebSocket push alerts containing:
  - Exact UTC & IST timestamps
  - Camera ID and geolocated GPS coordinates
  - Offence classification and FIR record
  - Annotated evidence snapshot with bounding boxes

---

### 5. Trajectory Reconstruction & Route Graph Analysis
When investigators search for a vehicle registration number (e.g., `GJ01AB1234`):
1. The database queries all timestamped detection events across Gujarat nodes.
2. Geodesic distance (Haversine formula) and inter-hop transit duration are calculated between successive sightings:
   $$v_{hop} = \frac{\Delta d}{\Delta t}$$
3. Checks are performed against maximum road velocity bounds to detect plate spoofing or clone vehicles.
4. An interactive GeoJSON polyline is drawn across Leaflet GIS with numbered chronological checkpoints and evidence snapshot cards.

---

### 6. Scalability Strategy Toward ~80,000 Cameras

| Metric | Naive Centralized Architecture | Sentinel Edge-Federated Architecture | Improvement |
| :--- | :--- | :--- | :--- |
| **Network Bandwidth** | 160.0 Gbps (Streaming all video centrally) | **1.2 Gbps** (Streaming metadata + 5% on-demand video) | **98.2% Reduction** |
| **Central GPU Requirements** | 1,778 Enterprise GPUs | **350 Central + Edge GPU Nodes** | **80% Cost Reduction** |
| **Bandwidth Resilience** | Fails on remote rural GSWAN links | 100% functional even on low-speed 4G links | Mission Critical |
| **Storage Model** | Monolithic storage array | 3-Tier Lifecycle: Hot (7d NVMe) $\rightarrow$ Warm (23d S3) $\rightarrow$ Cold (60d Tape) | Optimized TCO |

---

### 7. Cybersecurity & Role-Based Access Control (RBAC)
- **Zero Trust Network Architecture (ZTNA):** Segregated VLANs for camera network, AI processing cluster, and administrative dashboards.
- **Data Encryption:** TLS 1.3 for streaming data in transit and AES-256 for video snapshots and metadata at rest.
- **Departmental Multi-Tenancy:** Role-based access ensures Food & Civil Supplies personnel only access godown cameras, while Police Command Centers access public domain law-and-order feeds.
- **Tamper-Evident Audit Trails:** Cryptographic SHA-256 hashing on all evidence exports submitted for court prosecution.
