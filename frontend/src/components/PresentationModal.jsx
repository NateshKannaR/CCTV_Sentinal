import React, { useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight, Shield, Award, Layers, Cpu, Network, Database, CheckCircle2 } from 'lucide-react';

export default function PresentationModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "PROJECT SENTINEL — Unified CCTV & AI Platform",
      subtitle: "Gujarat Police Innovation Challenge 2026",
      tag: "Solution Overview",
      content: (
        <div className="flex flex-col items-center text-center justify-center py-6 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            SENTINEL: Integrated Video Management & Predictive Crime Analytics
          </h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            A state-wide, vendor-neutral intelligence platform unifying <b>26 independent government departments</b> and scaling to <b>80,000 cameras</b> with real-time ANPR, vehicle tracking, and automated eGujCop/VAHAN watchlist cross-referencing.
          </p>
          <div className="flex gap-2 text-xs text-slate-400 mt-2 font-mono">
            <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700">Home Department (SCRB)</span>
            <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700">i-Hub Gujarat</span>
            <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded border border-blue-700">Hybrid Model 1 + 2/3</span>
          </div>
        </div>
      )
    },
    {
      title: "Problem Landscape: 26 Siloed Government Departments",
      subtitle: "The Challenge of Fragmentation",
      tag: "Problem Analysis",
      content: (
        <div className="grid grid-cols-2 gap-4 text-xs py-2">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
            <div className="font-bold text-red-400 flex items-center gap-1.5 text-sm">
              Current Pain Points
            </div>
            <ul className="space-y-2 text-slate-300 list-disc list-inside leading-relaxed">
              <li><b>Isolated Islands:</b> Police, RTO, Civil Supplies, and Municipal bodies operate standalone NVRs with no cross-sharing.</li>
              <li><b>Heterogeneous Formats:</b> Legacy analog + IP cameras, mixed H.264/H.265 codecs, incompatible VMS vendors (Hikvision, CP Plus, Dahua).</li>
              <li><b>Bandwidth Constraints:</b> Streaming 80,000 raw video feeds centrally would overwhelm state networks (&gt;160 Gbps required).</li>
              <li><b>Manual Surveillance:</b> Crime monitoring relies on human operators scanning dozens of separate video walls manually.</li>
            </ul>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
              The Sentinel Solution
            </div>
            <ul className="space-y-2 text-slate-300 list-disc list-inside leading-relaxed">
              <li><b>Centralized GIS Registry (Model 1):</b> Systematic mapping of every camera asset with health monitoring and gap analysis.</li>
              <li><b>Unified Stream Viewer (Model 2):</b> Direct RTSP-over-TCP feed ingestion into a single command center.</li>
              <li><b>Edge-First AI Architecture:</b> Local ANPR metadata extraction saves <b>98% network bandwidth</b>.</li>
              <li><b>Automated Watchlist Matching:</b> Instant correlation with VAHAN, SARTHI, eGujCop (CCTNS), and NAFIS criminal databases.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Proposed Hybrid System Architecture",
      subtitle: "Open, Modular, Scalable & Vendor-Neutral",
      tag: "Architecture",
      content: (
        <div className="flex flex-col gap-3 text-xs py-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-blue-500/30">
              <div className="font-bold text-blue-400 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> 1. Ingestion Layer
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                RTSP-over-TCP connection pool tolerating H.264/H.265, stream restart backoffs, and monotonic PTS timestamps.
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/30">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> 2. AI Video Analytics
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                YOLO vehicle detector + OCR plate normalizer with Indian syntax regex parsing at 25 FPS.
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-purple-500/30">
              <div className="font-bold text-purple-400 mb-1 flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> 3. Event & Watchlist Bus
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Sub-100ms cross-referencing with eGujCop FIR records, pushing real-time WebSocket alerts to PCR vans.
              </p>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
            <b>Statewide GIS Visibility:</b> PostGIS/Leaflet interface renders real-time vehicle breadcrumb trajectories, checkpoint speed estimates, and camera health overlays across all 33 Gujarat districts.
          </div>
        </div>
      )
    },
    {
      title: "Scaling Toward ~80,000 Cameras",
      subtitle: "Bandwidth, Storage & Compute Blueprint",
      tag: "Scalability Strategy",
      content: (
        <div className="grid grid-cols-3 gap-3 text-xs py-2">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="font-bold text-emerald-400 mb-1">Bandwidth: 98% Savings</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Instead of streaming 160 Gbps of raw video, edge nodes extract license plate text and timestamps. Continuous central bandwidth is reduced to only <b>1.2 Gbps</b> for the entire state.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="font-bold text-amber-400 mb-1">Tiered Storage Lifecycle</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <b>Hot (7d):</b> Fast NVMe/Ceph for active investigations.<br/>
              <b>Warm (23d):</b> Distributed S3 Object Store.<br/>
              <b>Cold (60d+):</b> Compressed tape/archive for court evidence.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">GPU Compute Density</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Using NVIDIA L4 GPUs processing 45 concurrent streams at 3 FPS inference subsampling. Orchestrated via Kubernetes & Kafka event partitioning.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Passage of the Hackathon Test Scenario",
      subtitle: "Demonstrated Live Capabilities",
      tag: "Test Case Verification",
      content: (
        <div className="space-y-2.5 text-xs py-2">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <div className="font-bold text-white">1. Designated Vehicle Route Reconstruction</div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Evaluator enters <b>GJ01AB1234</b> $\rightarrow$ Platform plots animated polyline trajectory from Gandhinagar Police Bhavan across Ahmedabad with timestamps, speed estimates, and snapshot crops.
              </div>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <div className="font-bold text-white">2. Real-Time Watchlist Cross-Referencing</div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Integrated representative watchlist (eGujCop, VAHAN, SARTHI). Detects stolen/wanted vehicles with instant audio-visual alerts and PCR dispatch actions.
              </div>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <div className="font-bold text-white">3. Sentinel Sandbox Compliance</div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Complies with official Integrator's Guide: dynamic <code>/api/ingest</code> discovery, <code>rtsp_transport=tcp</code>, monotonic PTS tracking, and exponential backoff reconnection.
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold text-slate-300 font-mono">
              SLIDE {currentSlide + 1} OF {slides.length}
            </span>
            <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">
              {slides[currentSlide].tag}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold">
            ✕ Close
          </button>
        </div>

        {/* Slide Content */}
        <div className="min-h-[320px] flex flex-col justify-center">
          <div className="border-b border-slate-800/80 pb-2 mb-3">
            <h2 className="text-xl font-black text-white">{slides[currentSlide].title}</h2>
            <p className="text-xs text-blue-400 font-semibold">{slides[currentSlide].subtitle}</p>
          </div>
          {slides[currentSlide].content}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <button
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(c => c - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === i ? 'bg-blue-500 w-6' : 'bg-slate-700'}`}
              />
            ))}
          </div>

          <button
            disabled={currentSlide === slides.length - 1}
            onClick={() => setCurrentSlide(c => c + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded font-semibold transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
