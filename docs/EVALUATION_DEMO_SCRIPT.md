# Gujarat Police Sentinel: Evaluator Video Demo Walkthrough Script (3–5 Minutes)

Follow this structured walkthrough when recording your submission video to guarantee maximum marks in every evaluation category.

---

### Step 1: Introduction (0:00 - 0:45)
1. **Screen:** Show the home dashboard of **Gujarat Police Sentinel** at `http://localhost:8000`.
2. **Audio/Narration:**
   > "Welcome to Project Sentinel, our submission for the Gujarat Police Innovation Challenge 2026. We propose an open, vendor-neutral Hybrid Architecture combining Model 1 (Centralized CCTV Registry & GIS Foundation), Model 2 (Unified Video Management), and Model 3 (Federation Middleware) designed to scale to 80,000 cameras across 26 government departments."

---

### Step 2: Model 1 — CCTV Asset Registry & GIS Map (0:45 - 1:30)
1. **Action:**
   - Click on **Tab 1: GIS Registry Map**.
   - Toggle Department Filters: Filter by *Home Dept (Police)*, *RTO Gujarat*, *Food & Civil Supplies*, and *Municipal Corporations*.
   - Check the **Coverage Radii** toggle to show optical coverage cones.
   - Click on any camera pin (e.g. `CAM-GN-01` in Gandhinagar) to display the popup showing vendor, codec, resolution, and retention days.
   - Click on **Gap Analysis** button at the top: Show the fleet health (online/offline) and identified blind spots across Gujarat.
2. **Narration:**
   > "Here we demonstrate Model 1: a centralized PostGIS/Leaflet asset registry systematically mapping heterogeneous camera deployments across all Gujarat districts with automated gap analysis and health monitoring."

---

### Step 3: Model 2 — Unified Video Wall & Stream Ingestion (1:30 - 2:15)
1. **Action:**
   - Switch to **Tab 2: Video Wall**.
   - Show the 2x2 grid streaming live feeds.
   - Point out the stream badges: `RTSP / TCP ACTIVE`, `PTS Monotonic Timestamps`, `25 FPS`, and multi-vendor codecs (`H.264` and `H.265`).
   - Click the camera dropdown on one of the tiles to show dynamic switching between camera nodes.
2. **Narration:**
   > "In accordance with Section 1 and 2 of the official Sentinel Integrator's Guide, our ingestion pipeline forces RTSP over TCP, parses monotonic presentation timestamps, and tolerates stream looping discontinuities without dropped frames."

---

### Step 4: Core Test Case 1 — Designated Vehicle Route Reconstruction (2:15 - 3:30)
1. **Action:**
   - Switch to **Tab 3: Vehicle Tracing & Route**.
   - Type in the primary target vehicle registration: `GJ01AB1234` and click **Trace Vehicle**.
   - Point out the **Critical Watchlist Hit** banner showing FIR details (*Stolen Vehicle / Armed Robbery, Crime Branch Ahmedabad*).
   - Show the summary telemetry: *7 Hits, 37.15 km Traversed, 30.3 km/h Average Speed*.
   - Point to the right-side GIS map displaying the animated red breadcrumb polyline tracing the vehicle's escape route from Sector 18 Gandhinagar $\rightarrow$ SG Highway $\rightarrow$ Narol Circle.
   - Scroll through the chronological checkpoint cards and click on a snapshot thumbnail to inspect the full CCTV evidence modal with bounding box and plate banner.
2. **Narration:**
   > "This directly satisfies the primary evaluation test scenario: given a designated vehicle registration number, Sentinel identifies, traces, and presents the vehicle's complete sequential trajectory across the surveillance network with timestamps, inter-hop speeds, and photographic evidence."

---

### Step 5: Core Test Case 2 — Real-Time Watchlist Alerting (3:30 - 4:15)
1. **Action:**
   - Switch to **Tab 4: Watchlist & Alerts**.
   - Show the active database pre-synchronized with *eGujCop, VAHAN, SARTHI, and NAFIS*.
   - Click **Add Target Vehicle** and enter a custom test plate (e.g. `GJ05TEST01`, Offence: *Kidnapping Amber Alert*).
   - Go back to **Tab 2 (Video Wall)** and click **Test Sighting** on `CAM-AHM-04`.
   - Show the instantaneous audio alert chime and the red floating alert toast appearing in the bottom-right with real-time WebSocket dispatch.
   - Click **Acknowledge & Dispatch PCR**.
2. **Narration:**
   > "Sentinel provides continuous sub-100ms cross-referencing against police watchlists. Upon detection, real-time alerts with photographic proof are pushed instantly to command centers and field PCR vans."

---

### Step 6: 80,000 Scale Engine & Conclusion (4:15 - 5:00)
1. **Action:**
   - Switch to **Tab 5: ~80,000 Scale Engine**.
   - Drag the camera fleet slider from 1,000 to 80,000 cameras.
   - Highlight the **98% Bandwidth Savings** (reducing 160 Gbps of raw streaming to just 1.2 Gbps via Edge-First metadata extraction).
   - Show the Tiered Storage calculation (Hot NVMe 7d $\rightarrow$ Warm S3 23d $\rightarrow$ Cold Tape 60d).
   - Click the **Pitch Deck** button in the header to show the integrated presentation slides.
2. **Narration:**
   > "Our edge-first intelligence architecture solves the bandwidth bottleneck for 80,000 cameras while delivering zero vendor lock-in and native eGujCop interoperability. Thank you."
