import React, { useState } from 'react';
import { Camera, Maximize2, ShieldAlert, RefreshCw, Radio, Layers } from 'lucide-react';

export default function VideoWall({ cameras, onTriggerDetection, activePlate }) {
  const [layout, setLayout] = useState('2x2'); // '2x2', '1x1', '3x3'
  const [selectedFeedIndex, setSelectedFeedIndex] = useState(0);
  const [activeCamIds, setActiveCamIds] = useState([
    'CAM-GN-01',
    'CAM-AHM-01',
    'CAM-AHM-04',
    'CAM-SUR-05'
  ]);

  const displayedCameras = cameras.filter(c => activeCamIds.includes(c.id));

  const handleCameraChange = (index, newCamId) => {
    const updated = [...activeCamIds];
    updated[index] = newCamId;
    setActiveCamIds(updated);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col gap-4">
      {/* Video Wall Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Unified Video Management System (Model 2)
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                RTSP / TCP ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live multi-department stream ingestion with real-time ANPR reticle & PTS monotonic tracking
            </p>
          </div>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-1 rounded-lg flex gap-1 border border-slate-700">
            <button
              onClick={() => setLayout('1x1')}
              className={`px-3 py-1 text-xs font-semibold rounded ${layout === '1x1' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              1x1 Focus
            </button>
            <button
              onClick={() => setLayout('2x2')}
              className={`px-3 py-1 text-xs font-semibold rounded ${layout === '2x2' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              2x2 Grid
            </button>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className={`grid gap-4 ${layout === '1x1' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {(layout === '1x1' ? [activeCamIds[selectedFeedIndex]] : activeCamIds).map((camId, idx) => {
          const cam = cameras.find(c => c.id === camId) || cameras[idx] || { id: camId, name: 'Surveillance Node', location_name: 'Gujarat', department: 'Police' };

          return (
            <div key={camId + idx} className="relative bg-black rounded-lg overflow-hidden border border-slate-700/80 shadow-md group">
              {/* Camera Header Bar */}
              <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-2.5 flex items-center justify-between z-10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <select
                    value={camId}
                    onChange={(e) => handleCameraChange(idx, e.target.value)}
                    className="bg-slate-900/90 text-white text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-blue-500"
                  >
                    {cameras.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.id} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700">
                    {cam.codec}
                  </span>
                  <span className="bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">
                    {cam.department?.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Live Video Stream Feed */}
              <div className="w-full aspect-video bg-slate-950 flex items-center justify-center relative overflow-hidden">
                <img
                  src={`/api/stream/${cam.id}${activePlate ? `?target_plate=${activePlate}` : ''}`}
                  alt={cam.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Telemetry & Evaluation Action Bar */}
              <div className="bg-slate-900/95 border-t border-slate-800 px-3 py-2 flex items-center justify-between text-xs">
                <div className="text-slate-400 text-[11px] truncate max-w-[220px]">
                  📍 {cam.location_name}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTriggerDetection(cam.id, activePlate || 'GJ01AB1234')}
                    className="flex items-center gap-1 bg-red-600/90 hover:bg-red-500 text-white font-semibold px-2.5 py-1 rounded text-[11px] shadow transition-colors"
                    title="Simulate ANPR Sighting to test Watchlist Alerting"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Test Sighting
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
