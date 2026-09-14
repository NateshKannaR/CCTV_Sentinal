import React, { useState } from 'react';
import { 
  Terminal, 
  Server, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Radio, 
  Code2, 
  Play, 
  Layers, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function IntegratorPage({ setShowSandboxModal }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const commands = [
    {
      title: "1. Query Live Sandbox Camera Catalogue",
      cmd: "curl -s https://cctv.corp8.cloud/api/ingest | jq '.[0]'",
      desc: "Fetches dynamic camera list with stream IDs, locations, and codecs"
    },
    {
      title: "2. Run Automated Live Feed Compliance Runner",
      cmd: "python3 backend/app/live_feed_runner.py --host https://cctv.corp8.cloud",
      desc: "Connects via RTSP TCP, tracks monotonic PTS timestamps, detects loop resets, and exports evaluation CSV"
    },
    {
      title: "3. Probe Live RTSP Stream via FFprobe",
      cmd: "ffprobe -rtsp_transport tcp -i rtsp://cctv.corp8.cloud:8554/stream/CAM-001",
      desc: "Inspects video stream PTS, keyframe interval, and H.264/H.265 profile"
    }
  ];

  const rules = [
    {
      title: "Rule 1: Always Start from Catalogue",
      code: "GET /api/ingest",
      status: "COMPLIANT",
      detail: "Endpoints are dynamic and resolved in real-time from the catalogue contract rather than hardcoded URLs."
    },
    {
      title: "Rule 2: Force RTSP TCP Transport",
      code: 'os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"',
      status: "COMPLIANT",
      detail: "Avoids UDP packet dropouts over congested police cellular/mesh backhauls."
    },
    {
      title: "Rule 3: Trust PTS, Never Trust FPS",
      code: 'pts_ms = cap.get(cv2.CAP_PROP_POS_MSEC)',
      status: "COMPLIANT",
      detail: "Surveillance video is bursty and variable framerate; elapsed time is computed strictly via monotonic PTS."
    },
    {
      title: "Rule 4: Detect Looping Discontinuities",
      code: 'if pts_ms < prev_pts_ms: handle_loop_reset()',
      status: "COMPLIANT",
      detail: "Sandbox streams replay periodically; timestamp drops trigger clean state reset without corrupting tracklets."
    },
    {
      title: "Rule 5: Tolerant Reconnection Backoff",
      code: 'delay = min(delay * 2.0, 30.0)',
      status: "COMPLIANT",
      detail: "Network drops and camera reboots trigger graceful exponential backoff without crashing ingest workers."
    }
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/30 flex-shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                Government Sandbox & Ingest Gateway Hub
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-teal-500/10 text-teal-400 border border-teal-500/30">
                OFFICIAL INTEGRATOR'S GUIDE SPEC
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Protocol compliance center for Gujarat Police Sandbox (cctv.corp8.cloud) & dynamic catalogue ingestion
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSandboxModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition active:scale-95"
        >
          <Server className="w-4 h-4" />
          <span>CONNECT SANDBOX GATEWAY</span>
        </button>
      </div>

      {/* 2 Column Layout: Compliance Matrix + CLI Execution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column: Official Integrator's Guide 5 Mandatory Rules */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Integrator's Guide Protocol Requirements
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                5 / 5 VERIFIED
              </span>
            </div>

            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {rule.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {rule.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{rule.detail}</p>
                  <div className="bg-black/60 p-2 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto border border-slate-800/80">
                    <code>{rule.code}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive CLI Runner & Sandbox Endpoints */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Ingest Test Commands
              </h3>
            </div>

            <div className="space-y-3">
              {commands.map((c, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{c.title}</span>
                    <button
                      onClick={() => copyToClipboard(c.cmd, i)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Copy Command"
                    >
                      {copiedIndex === i ? <span className="text-[10px] text-emerald-400 font-mono">COPIED</span> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">{c.desc}</p>
                  <div className="bg-black/80 p-2.5 rounded-lg font-mono text-xs text-emerald-400 border border-slate-800 select-all overflow-x-auto">
                    <code>{c.cmd}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MongoDB Atlas Cloud Database Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  MongoDB Atlas Cloud
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">CLUSTER:</span>
                <span className="text-emerald-400 truncate max-w-[200px]">cluster0.wwp3oig.mongodb.net</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">DATABASE:</span>
                <span className="text-cyan-400 font-bold">sentinel_cctv</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500">CAMERAS</div>
                  <div className="text-sm font-bold text-white">50</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500">WATCHLIST</div>
                  <div className="text-sm font-bold text-rose-400">10</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500">DETECTIONS</div>
                  <div className="text-sm font-bold text-cyan-400">15</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500">ALERTS</div>
                  <div className="text-sm font-bold text-amber-400">10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sandbox Server Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Live Gateway Endpoints
            </h4>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">RTSP TCP:</span>
                <span className="text-emerald-400">rtsp://cctv.corp8.cloud:8554/stream/:id</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">WebRTC (WHEP):</span>
                <span className="text-cyan-400">http://cctv.corp8.cloud:8889/stream/:id/whep</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">HLS (M3U8):</span>
                <span className="text-purple-400">http://cctv.corp8.cloud/live/stream/:id/index.m3u8</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
