import React, { useState } from 'react';
import GisMap from '../components/GisMap';
import { 
  MapPin, 
  Search, 
  Filter, 
  Video, 
  Radio, 
  Server, 
  SlidersHorizontal, 
  ExternalLink, 
  X, 
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CamerasPage({ cameras = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [activeCamera, setActiveCamera] = useState(null);

  const departments = ['ALL', 'Gujarat Traffic Police', 'National Highway Authority', 'Municipal Corporation', 'Gujarat Maritime Board'];
  const districts = ['ALL', 'Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot'];

  // Filter cameras
  const filteredCameras = cameras.filter(cam => {
    const matchesSearch = cam.camera_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.camera_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.location_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || cam.department === selectedDept;
    const matchesDistrict = selectedDistrict === 'ALL' || (cam.location_name && cam.location_name.includes(selectedDistrict));
    return matchesSearch && matchesDept && matchesDistrict;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Camera Directory Sidebar (360px) */}
      <div className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">State GIS Registry</h2>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {filteredCameras.length} NODES
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search camera ID, landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* District Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {districts.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedDistrict === d
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Camera List Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredCameras.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No surveillance nodes match your filter criteria.
            </div>
          ) : (
            filteredCameras.map((cam) => {
              const isSelected = activeCamera?.camera_id === cam.camera_id;
              return (
                <div
                  key={cam.camera_id}
                  onClick={() => setActiveCamera(cam)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">{cam.camera_id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ONLINE
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1 truncate">{cam.camera_name}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{cam.location_name}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                    <span>{cam.department?.split(' ')[0] || 'State'}</span>
                    <span>{cam.latitude?.toFixed(4)}, {cam.longitude?.toFixed(4)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Center & Right GIS Map Container */}
      <div className="flex-1 relative h-full">
        <GisMap
          cameras={filteredCameras}
          selectedCamera={activeCamera}
          onSelectCamera={(cam) => setActiveCamera(cam)}
        />

        {/* Slide-over Live Stream & Inspector Drawer (when activeCamera is set) */}
        {activeCamera && (
          <div className="absolute top-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-4 z-[1000] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-white">{activeCamera.camera_id} LIVE FEED</span>
              </div>
              <button
                onClick={() => setActiveCamera(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Camera Stream Element */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
              <img
                src={`/api/stream/${activeCamera.camera_id}`}
                alt={activeCamera.camera_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 font-mono text-[10px] text-emerald-400">
                1080p • 25 FPS
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600/80 font-mono text-[10px] text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                TCP/RTSP
              </div>
            </div>

            {/* Metadata Info Cards */}
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-sans text-[11px]">Location Landmark</div>
                <div className="text-white font-semibold">{activeCamera.location_name}</div>
                <div className="text-[11px] text-emerald-400">{activeCamera.department}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">COORDINATES</div>
                  <div className="text-slate-200 text-[11px]">{activeCamera.latitude?.toFixed(4)}, {activeCamera.longitude?.toFixed(4)}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">INGEST PROTOCOL</div>
                  <div className="text-emerald-400 text-[11px]">RTSP / TCP Monotonic</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px]">RTSP INFERENCE ENDPOINT</div>
                <div className="text-cyan-400 text-[10px] truncate select-all">{activeCamera.stream_url || `rtsp://cctv.corp8.cloud:8554/stream/${activeCamera.camera_id}`}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
