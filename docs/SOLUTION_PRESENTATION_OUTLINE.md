# Gujarat Police Innovation Challenge 2026: Solution Presentation Outline

Use this outline to generate your official submission presentation (PPT / PDF) for the screening committee.

---

### Slide 1: Title & Introduction
- **Project Title:** SENTINEL — Unified Video Management, Edge Intelligence & Real-Time Crime Analytics
- **Event:** Gujarat Police Innovation Challenge 2026 (Project Sentinel)
- **Organizers:** Government of Gujarat (Home Department & SCRB) and i-Hub Gujarat
- **Proposed Architecture:** Hybrid Model (Model 1: Centralized GIS Registry + Model 2: Unified Feed Aggregator + Model 3: VMS Federation)

---

### Slide 2: Problem Statement & Existing Departmental Challenges
- **26 Independent Departments:** Police, RTO, Civil Supplies, Municipal Corporations operating isolated CCTV islands.
- **Heterogeneous Landscape:** Diverse camera vendors (Hikvision, Dahua, CP Plus), mixed codecs (H.264 / H.265), and varying retention spans (7–30 days).
- **Network Bandwidth Crisis:** Ingesting 80,000 raw video streams centrally would require >160 Gbps of dedicated bandwidth.
- **Lack of Database Cross-Referencing:** No automated correlation with VAHAN, SARTHI, eGujCop (CCTNS), and AFIS/NAFIS.

---

### Slide 3: Proposed Hybrid Architecture & Strategic Innovation
- **Layer 1 - Ingestion & Edge Adapter:** Connects to any VMS/NVR via RTSP over TCP with monotonic presentation timestamp (PTS) tracking.
- **Layer 2 - Edge AI Metadata Extraction:** Runs local ANPR and vehicle classification; only lightweight metadata (15 Kbps) is continuously streamed to the central cluster.
- **Layer 3 - Central Event Correlator & Message Bus:** High-throughput Kafka broker cross-references detections with watchlists in sub-100ms.
- **Layer 4 - Command & Control Center:** GIS-based asset inventory, multi-camera live video walls, and instant real-time audio-visual alerting.

---

### Slide 4: AI Video Analytics & Watchlist Integration
- **Vehicle Classification:** Real-time identification of cars, SUVs, motorcycles, auto-rickshaws, buses, and commercial trucks.
- **ANPR Engine:** Fine-tuned optical recognition with Indian number plate syntax validation (`GJ01AB1234`).
- **Watchlist Cross-Referencing:** Direct integration with:
  - *eGujCop:* Stolen vehicles, FIR records, wanted criminal suspects.
  - *VAHAN / SARTHI:* Blacklisted registrations, tax evasion, permit violations.
  - *NAFIS / AFIS:* Biometric suspect records.
- **Push Notification Engine:** Real-time WebSocket alerts dispatched to Police Control Rooms and PCR field units.

---

### Slide 5: Core Evaluator Demonstration: Vehicle Route Reconstruction
- **Instant Search:** Enter any registration plate (e.g. `GJ01AB1234`).
- **Sequential Breadcrumb Trajectory:** Dynamic GIS polyline mapping movement across Gandhinagar and Ahmedabad checkpoints.
- **Forensic Telemetry:**
  - First Seen vs. Last Seen timestamps
  - Total distance traversed (km) via Haversine calculation
  - Inter-hop speed estimation (km/h) between camera nodes
  - High-resolution photographic evidence snapshots with plate crops

---

### Slide 6: Statewide Scalability Strategy (~80,000 Cameras)
- **Bandwidth Reduction:** 98% savings (from 160 Gbps down to 1.2 Gbps) via Edge-First metadata architecture.
- **Tiered Storage Lifecycle:**
  - *Tier 1 (Hot - 7 Days):* Fast NVMe / Ceph block storage for active investigations.
  - *Tier 2 (Warm - 23 Days):* Distributed S3 object storage.
  - *Tier 3 (Cold - 60 Days+):* Compressed deep tape archive for judicial evidence.
- **Compute Sizing:** NVIDIA L4 / Jetson Orin edge deployments orchestrated by Kubernetes.

---

### Slide 7: Security, Compliance & Deployment Roadmap
- **Cybersecurity Controls:** TLS 1.3 encryption, AES-256 data at rest, Role-Based Access Control (RBAC), and SHA-256 audit logging.
- **Zero Vendor Lock-in:** Open API standards compatible with any future VMS or camera vendor.
- **Phase-Wise Rollout:**
  - *Phase 1:* 5,000 critical junction cameras (Police & RTO).
  - *Phase 2:* 25,000 municipal and district cameras.
  - *Phase 3:* Statewide rollout to all 80,000 government and commercial cameras.
