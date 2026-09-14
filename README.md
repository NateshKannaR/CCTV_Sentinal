# Project Sentinel: Gujarat Police Innovation Challenge 2026 Prototype

An integrated Video Management, Edge AI & Real-Time Crime Analytics platform developed for the **Gujarat Police Innovation Challenge 2026 ("Sentinel")**, organized by the **Home Department, State Crime Record Bureau (SCRB), Government of Gujarat**, and **i-Hub Gujarat**.

---

## Key Features & Evaluation Alignment

1. **Model 1: Centralized CCTV Asset Registry & GIS Foundation (Mandatory)**
   - Pre-loaded with 50 representative camera deployments across Gujarat districts (Ahmedabad, Gandhinagar, Surat, Vadodara, Rajkot, Dwarka, Somnath, Dahod, Kutch).
   - Departmental asset management (Home/Police, RTO, Food & Civil Supplies, Municipal Corporations, Commercial).
   - Real-time health monitoring (Online/Offline/Degraded), storage retention tracking (7–30 days), and coverage radii.
   - Built-in **Gap Analysis Engine** identifying surveillance blind spots and aging infrastructure.

2. **Model 2: Unified Video Management & Stream Ingestion**
   - Strictly enforces **RTSP over TCP** (`OPENCV_FFMPEG_CAPTURE_OPTIONS="rtsp_transport;tcp"`) as mandated in the official Integrator's Guide.
   - Dynamic catalogue discovery via `/api/ingest`.
   - Monotonic presentation timestamp (PTS) tracking tolerating loop resets and frame gaps.
   - Multi-camera video wall with live ANPR tracking reticles and 1-click test sighting triggers.

3. **Core Evaluation Test Case 1: Designated Vehicle Route Reconstruction**
   - Search by Vehicle Registration Number (e.g. `GJ01AB1234`).
   - Chronological trajectory mapping with animated GeoJSON polyline connecting camera nodes from Gandhinagar through Ahmedabad.
   - Summary telemetry: total distance traversed (km), inter-hop speed analysis (km/h), and journey duration.
   - High-resolution evidence snapshots with vehicle bounding box and license plate banners.

4. **Core Evaluation Test Case 2: Real-Time Watchlist Cross-Referencing**
   - Continuous sub-100ms cross-referencing against simulated state police databases (**eGujCop CCTNS, VAHAN, SARTHI, NAFIS**).
   - Instant real-time push alerts over WebSockets with Web Audio synthesized alarm chimes.
   - Dynamic "Add Target Vehicle" modal allowing judges to test any registration number live during evaluation.

5. **Statewide Scalability Engine (~80,000 Cameras)**
   - Interactive infrastructure sizing calculator for compute, bandwidth, and storage.
   - Edge-First metadata architecture delivering **98% network bandwidth reduction** (160 Gbps $\rightarrow$ 1.2 Gbps).
   - 3-tier storage lifecycle: Hot (NVMe 7d) $\rightarrow$ Warm (S3 23d) $\rightarrow$ Cold (Tape/Archive 60d+).

6. **Built-in Presentation Deck (Pitch Mode)**
   - 5-slide interactive pitch deck accessible directly in the UI header.

---

## Quick Start Guide

### Prerequisites
- Python 3.11+ (or `uv`)
- Node.js 18+ and `npm`

### 1. Launch the Platform
From the repository root:

```bash
chmod +x start.sh
./start.sh
```

This single command will:
1. Initialize the SQLite database with 50 cameras, 10 watchlist records, and route logs.
2. Generate realistic evidence snapshots with CCTV HUD overlays.
3. Start the unified FastAPI + Vite server on **http://localhost:8000**.

### 2. Access the Command Center
Open your browser and navigate to:
```
http://localhost:8000
```

### 3. Development Mode (Optional)
To run with live hot-reloading:
```bash
./start.sh dev
```

---

## Testing the Evaluation Test Scenarios

### Test 1: Designated Vehicle Route Reconstruction
1. Click on **Tab 3: Vehicle Tracing & Route**.
2. Notice `GJ01AB1234` is pre-entered. Click **Trace Vehicle**.
3. Inspect the Critical Watchlist Hit banner, the 7 sequential checkpoints, speed telemetry, and the animated red breadcrumb trajectory on the GIS map.
4. Click on any snapshot thumbnail to open the CCTV photographic evidence modal.

### Test 2: Real-Time Watchlist Sighting
1. Go to **Tab 2: Video Wall**.
2. Click the red **Test Sighting** button on any camera feed (e.g. `CAM-AHM-04`).
3. Observe the audio chime, the confetti trigger, and the red floating alert toast popping up in real time via WebSockets.
4. Click **Trace Route on Map →** on the toast to jump directly into forensic trajectory tracking.

### Test 3: Scalability Model
1. Click on **Tab 5: ~80,000 Scale Engine**.
2. Adjust the fleet slider to **80,000 cameras** and toggle between H.264 and H.265 to inspect bandwidth, GPU density, and storage PB calculations.

---

## Submission Artifacts Included in this Repository

- **High-Level Design (HLD):** [`docs/HIGH_LEVEL_DESIGN.md`](docs/HIGH_LEVEL_DESIGN.md)
- **Solution Presentation (PPT Outline):** [`docs/SOLUTION_PRESENTATION_OUTLINE.md`](docs/SOLUTION_PRESENTATION_OUTLINE.md)
- **Evaluator Demo Walkthrough Script:** [`docs/EVALUATION_DEMO_SCRIPT.md`](docs/EVALUATION_DEMO_SCRIPT.md)
