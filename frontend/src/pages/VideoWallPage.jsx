import React, { useState } from 'react';
import { 
  Tv, 
  Grid2X2, 
  Grid3X3, 
  Square, 
  Maximize2, 
  Radio, 
  ShieldAlert, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';

export default function VideoWallPage({ 
  cameras = [], 
  onTriggerDetection, 
  activePlate = 'GJ01AB1234' 
}) {
  const [layout, setLayout] = useState('2x2'); // '1x1', '2x2', '3x3'
  const [activeCamIds, setActiveCamIds] = useState([
    'CAM-GN-01',
    'CAM-AHM-01',
    'CAM-AHM-04',
    'CAM-SUR-05',
    'CAM-GN-03',
    'CAM-VAD-02',
    'CAM-RJK-01',
    'CAM-AHM-02',
    'CAM-SUR-01'
  ]);
  const [nightVision, setNightVision] = useState(false);
  const [selectedCamIndex, setSelectedCamIndex] = useState(0);

  const handleCameraChange = (tileIndex, newCamId) => {
    const next = [...activeCamIds];
    next[tileIndex] = newCamId;
    setActiveCamIds(next);
  };

  const getTileCount = () => {
    if (layout === '1x1') return 1;
    if (layout === '2x2') return 4;
    return 9; // 3x3
  };

  const visibleCamIds = activeCamIds.slice(0, getTileCount());

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Tactical Video Wall Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Statewide Tactical Video Wall (VMS)
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                9-FEED MESH READY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-department RTSP ingestion via TCP monotonic clock • 25 FPS hardware decoded
            </p>
          </div>
        </div>

        {/* Matrix Controls & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Night Vision / IR Toggle */}
          <button
            onClick={() => setNightVision(!nightVision)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition ${
              nightVision 
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' 
                : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {nightVision ? <Moon className="w-3.5 h-3.5 text-emerald-400" /> : <Sun className="w-3.5 h-3.5" />}
            <span>IR ENHANCE: {nightVision ? 'ON' : 'OFF'}</span>
          </button>

          {/* Layout Buttons */}
          <div className="bg-slate-950/80 p-1 rounded-xl flex items-center gap-1 border border-slate-800">
            <button
              onClick={() => setLayout('1x1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                layout === '1x1' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" /> 1x1
            </button>
            <button
              onClick={() => setLayout('2x2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                layout === '2x2' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" /> 2x2
            </button>
            <button
              onClick={() => setLayout('3x3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                layout === '3x3' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" /> 3x3
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Wall Grid & Tactical PTZ Console Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left / Center Grid (9 or 10 cols) */}
        <div className="xl:col-span-9 space-y-4">
          <div className={`grid gap-4 ${
            layout === '1x1' 
              ? 'grid-cols-1' 
              : layout === '2x2' 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {visibleCamIds.map((camId, idx) => {
              const cam = cameras.find(c => c.camera_id === camId || c.id === camId) || {
                camera_id: camId,
                camera_name: `Surveillance Feed ${idx + 1}`,
                location_name: 'Gujarat Police State Network',
                department: 'Traffic'
              };

              return (
                <div 
                  key={camId + idx} 
                  className={`relative rounded-xl overflow-hidden border bg-black shadow-xl group transition-all duration-200 ${
                    selectedCamIndex === idx 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedCamIndex(idx)}
                >
                  {/* Top Feed Bar with Camera Selector */}
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-2.5 flex items-center justify-between z-10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <select
                        value={cam.camera_id || cam.id}
                        onChange={(e) => handleCameraChange(idx, e.target.value)}
                        className="bg-slate-900/90 text-emerald-400 font-mono font-bold text-xs border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {cameras.map(c => (
                          <option key={c.camera_id || c.id} value={c.camera_id || c.id}>
                            {c.camera_id || c.id} - {c.camera_name || c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-300">
                        {cam.codec || 'H.264'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                        TCP
                      </span>
                    </div>
                  </div>

                  {/* Video Stream Element */}
                  <div className={`w-full aspect-video bg-slate-950 relative overflow-hidden flex items-center justify-center ${
                    nightVision ? 'filter invert brightness-125 contrast-150 hue-rotate-90' : ''
                  }`}>
                    <img
                      src={`/api/stream/${cam.camera_id || cam.id}?target_plate=${activePlate}`}
                      alt={cam.camera_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>

                  {/* Bottom Telemetry & Test Action Bar */}
                  <div className="bg-slate-900/95 border-t border-slate-800 px-3 py-2 flex items-center justify-between text-xs">
                    <div className="text-slate-300 text-[11px] truncate max-w-[200px] font-sans">
                      {cam.location_name}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerDetection && onTriggerDetection(cam.camera_id || cam.id, activePlate);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-semibold text-[11px] transition active:scale-95 shadow"
                      title="Trigger Simulated Watchlist ANPR Sighting"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>TEST SIGHTING</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Tactical PTZ & Stream Telemetry Console (3 cols) */}
        <div className="xl:col-span-3 space-y-4">
          {/* PTZ Directional Joystick Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                PTZ Directional Control
              </h3>
            </div>

            <div className="text-xs text-slate-400">
              Active Focus: <span className="text-emerald-400 font-mono font-bold">{visibleCamIds[selectedCamIndex] || 'CAM-01'}</span>
            </div>

            {/* Virtual D-Pad */}
            <div className="flex flex-col items-center justify-center py-2">
              <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition">
                <ChevronUp className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4 my-2">
                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-slate-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                  PTZ
                </div>
                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 active:scale-95 transition">
                <ZoomIn className="w-3.5 h-3.5 text-emerald-400" /> ZOOM IN
              </button>
              <button className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 active:scale-95 transition">
                <ZoomOut className="w-3.5 h-3.5 text-emerald-400" /> ZOOM OUT
              </button>
            </div>
          </div>

          {/* Ingest Protocol Compliance Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs font-mono">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-sans">
              Stream Telemetry Specs
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500">TRANSPORT:</span>
                <span className="text-emerald-400 font-bold">TCP Forced (Section 2)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500">CLOCK SYNC:</span>
                <span className="text-cyan-400 font-bold">Monotonic PTS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500">RE-SYNC BACKOFF:</span>
                <span className="text-purple-400 font-bold">Exponential (30s max)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500">FRAME CODEC:</span>
                <span className="text-amber-400 font-bold">H.264 High Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
