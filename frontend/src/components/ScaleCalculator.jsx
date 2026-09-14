import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Wifi, Server, Sliders, CheckCircle2, TrendingDown, Layers } from 'lucide-react';

export default function ScaleCalculator() {
  const [cameraCount, setCameraCount] = useState(80000);
  const [codec, setCodec] = useState('H.265');
  const [resolution, setResolution] = useState('1080p');
  const [hotDays, setHotDays] = useState(7);
  const [warmDays, setWarmDays] = useState(23);
  const [coldDays, setColdDays] = useState(60);
  const [edgeAiPercent, setEdgeAiPercent] = useState(80);
  const [scaleData, setScaleData] = useState(null);

  useEffect(() => {
    fetch(`/api/scale-sizing?camera_count=${cameraCount}&codec=${codec}&resolution=${resolution}&hot_days=${hotDays}&warm_days=${warmDays}&cold_days=${coldDays}&edge_ai_percent=${edgeAiPercent}`)
      .then(res => res.json())
      .then(data => setScaleData(data))
      .catch(err => console.error(err));
  }, [cameraCount, codec, resolution, hotDays, warmDays, coldDays, edgeAiPercent]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          Statewide Scalability & Infrastructure Sizing Engine (~80,000 Cameras)
        </h2>
        <p className="text-xs text-slate-400">
          Hardware sizing, GPU cluster allocation, low-bandwidth edge architecture, and tiered storage model for Gujarat State
        </p>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
        {/* Camera Count Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-semibold text-slate-300">
            <span>Camera Fleet</span>
            <span className="text-indigo-400 font-mono font-bold">{cameraCount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={cameraCount}
            onChange={(e) => setCameraCount(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>1,000</span>
            <span>80,000 (Target)</span>
            <span>100k</span>
          </div>
        </div>

        {/* Codec Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-300">Video Compression Codec</label>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setCodec('H.265')}
              className={`py-1.5 rounded font-bold transition-all ${codec === 'H.265' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400'}`}
            >
              H.265 (HEVC - 50% BW)
            </button>
            <button
              onClick={() => setCodec('H.264')}
              className={`py-1.5 rounded font-bold transition-all ${codec === 'H.264' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400'}`}
            >
              H.264 (Legacy)
            </button>
          </div>
        </div>

        {/* Edge AI Offload Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-semibold text-slate-300">
            <span>Edge / Regional Inference</span>
            <span className="text-emerald-400 font-mono font-bold">{edgeAiPercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={edgeAiPercent}
            onChange={(e) => setEdgeAiPercent(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer"
          />
          <div className="text-[10px] text-slate-500">
            Offloads ANPR to edge, streaming only metadata centrally
          </div>
        </div>

        {/* Storage Retention Model */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-semibold text-slate-300">
            <span>Retention Period</span>
            <span className="text-amber-400 font-mono font-bold">{hotDays + warmDays + coldDays} Days</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex gap-2">
            <span>Hot: <b>{hotDays}d</b></span>
            <span>Warm: <b>{warmDays}d</b></span>
            <span>Cold: <b>{coldDays}d</b></span>
          </div>
        </div>
      </div>

      {/* Sizing Calculations Dashboard */}
      {scaleData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bandwidth Savings Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-emerald-400" />
                Network Bandwidth Strategy
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                {scaleData.bandwidth.bandwidth_saving_percentage}% SAVINGS
              </span>
            </div>

            <div className="space-y-2 mt-1 text-xs">
              <div className="flex justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Raw Central Ingestion (Naive):</span>
                <span className="font-mono text-red-400 font-bold">{scaleData.bandwidth.total_raw_stream_gbps} Gbps</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Edge Metadata Bus (Continuous):</span>
                <span className="font-mono text-emerald-400 font-bold">{scaleData.bandwidth.edge_metadata_stream_mbps} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Central On-Demand Video Wall (5%):</span>
                <span className="font-mono text-blue-400 font-bold">{scaleData.bandwidth.central_on_demand_video_gbps} Gbps</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg mt-1">
              💡 <b>Innovation:</b> Edge cameras run local ANPR; only vector hashes & metadata are streamed continuously over GSWAN / 4G. Full video is pulled strictly on-demand.
            </div>
          </div>

          {/* Tiered Storage Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-amber-400" />
                Tiered Storage Architecture
              </span>
              <span className="font-mono text-amber-400 font-bold text-sm">
                {scaleData.storage.total_storage_pb} PB
              </span>
            </div>

            <div className="space-y-2 mt-1 text-xs">
              <div className="flex justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Tier 1 - Hot (Ceph / NVMe Fast):</span>
                <span className="font-mono text-white font-bold">{scaleData.storage.hot_storage_tier_pb} PB</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Tier 2 - Warm (S3 Distributed Object):</span>
                <span className="font-mono text-white font-bold">{scaleData.storage.warm_storage_tier_pb} PB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tier 3 - Cold (Tape / Deep Archive):</span>
                <span className="font-mono text-white font-bold">{scaleData.storage.cold_storage_tier_pb} PB</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg mt-1">
              📦 <b>Lifecycle Policy:</b> Video drops from NVMe to Ceph Object Storage on Day 8, and migrates to compressed Cold Tier on Day 31 automatically.
            </div>
          </div>

          {/* GPU Compute & Event Broker Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                AI Inference Cluster
              </span>
              <span className="font-mono text-indigo-400 font-bold text-sm">
                {scaleData.compute.total_gpus_required} Enterprise GPUs
              </span>
            </div>

            <div className="space-y-2 mt-1 text-xs">
              <div className="flex justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Regional Edge Ingestion GPUs:</span>
                <span className="font-mono text-white font-bold">{scaleData.compute.edge_regional_gpus} GPUs</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Central Gandhinagar AI Cluster:</span>
                <span className="font-mono text-white font-bold">{scaleData.compute.central_command_gpus} GPUs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Event Throughput:</span>
                <span className="font-mono text-indigo-300 font-bold">{scaleData.messaging_and_db.peak_detections_per_sec.toLocaleString()} det/sec</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-indigo-950/20 border border-indigo-500/20 p-2.5 rounded-lg mt-1">
              ⚡ <b>Hardware Spec:</b> NVIDIA L4 / T4 cluster orchestrated via Kubernetes with KEDA auto-scaling based on Kafka queue lag.
            </div>
          </div>
        </div>
      )}

      {/* Gujarat Police Strategic Architecture Summary */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Recommended Hybrid Deployment Architecture (Why This Wins)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
          <div>
            <div className="font-semibold text-blue-400 mb-1">1. Zero Vendor Lock-in</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Standardized RTSP-over-TCP and ONVIF adapter layer ingests existing CP Plus, Hikvision, Dahua, and Milestone NVRs across all 26 departments without rip-and-replace.
            </p>
          </div>
          <div>
            <div className="font-semibold text-emerald-400 mb-1">2. Bandwidth Resilience</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Even in remote districts like Dahod, Dwarka, or Kutch with limited GSWAN bandwidth, the edge-first metadata broker ensures uninterrupted ANPR and watchlist matching.
            </p>
          </div>
          <div>
            <div className="font-semibold text-indigo-400 mb-1">3. Native eGujCop & VAHAN Link</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Unified event bus streams detection hits directly into Gujarat Police CCTNS (eGujCop) and VAHAN, generating automated alert dispatches in sub-100ms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
