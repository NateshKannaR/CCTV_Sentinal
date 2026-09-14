import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Video, 
  MapPin, 
  Activity, 
  Search, 
  ArrowUpRight, 
  Radio, 
  FileText, 
  Sliders, 
  AlertTriangle,
  Car,
  Cpu,
  Clock,
  Eye,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { generateCctvSvg } from '../data/fallbackData';

export default function DashboardPage({
  cameras = [],
  alerts = [],
  watchlist = [],
  setShowDossierModal,
  setShowSandboxModal,
  setShowPresentationModal
}) {
  const navigate = useNavigate();

  // Top statistics
  const totalCams = cameras.length || 50;
  const onlineCams = cameras.filter(c => c.status === 'online').length || 48;
  const highThreatCount = watchlist.filter(w => w.severity === 'high' || w.severity === 'critical').length || 6;
  const alertHitsCount = alerts.length || 4;

  const quickStats = [
    { label: 'Active Camera Feeds', value: `${onlineCams} / ${totalCams}`, sub: '100% Ingest Health', icon: Video, color: 'emerald' },
    { label: 'Watchlist Targets', value: watchlist.length || 10, sub: `${highThreatCount} High Priority`, icon: ShieldAlert, color: 'rose' },
    { label: 'Real-Time Hits Today', value: alertHitsCount, sub: 'Scanned across 26 depts', icon: AlertTriangle, color: 'amber' },
    { label: 'Inference Latency', value: '< 180ms', sub: 'Edge RTSP / Monotonic PTS', icon: Cpu, color: 'cyan' },
  ];

  const districts = [
    { name: 'Ahmedabad Urban', count: 18, color: 'bg-emerald-500' },
    { name: 'Gandhinagar Capital', count: 12, color: 'bg-cyan-500' },
    { name: 'Surat Diamond Belt', count: 8, color: 'bg-blue-500' },
    { name: 'Vadodara City', count: 6, color: 'bg-indigo-500' },
    { name: 'Rajkot Highway', count: 6, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Top Welcome & Threat Alert Banner */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 p-4 sm:p-6 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
                STATEWIDE SITUATION MONITORING
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono">CODE: DELTA-SECURE</span>
            </div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Gujarat State Police Integrated CCTV Operations Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Unified surveillance grid across 26 Gujarat Government departments. Continuous cross-referencing against eGujCop, VAHAN, and NAFIS registries with automated Section 65B forensic chain of custody.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/tracing')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Car className="w-4 h-4" />
              <span>TRACE GJ01AB1234</span>
            </button>
            <button
              onClick={() => navigate('/video-wall')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>LAUNCH VIDEO WALL</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Status KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-3.5 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 truncate pr-1">{stat.label}</span>
                <div className={`p-1.5 sm:p-2 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/20 text-${stat.color}-400 group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="text-lg sm:text-2xl font-black text-white font-mono">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full bg-${stat.color}-400 flex-shrink-0`}></span>
                  <span className="truncate">{stat.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Live Matrix Preview + Realtime Threat Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column (8 cols): Tactical Feeds & Route Map Highlights */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tactical Camera Matrix Preview */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">State Feeds Matrix (Live Preview)</h2>
              </div>
              <button
                onClick={() => navigate('/video-wall')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
              >
                VIEW FULL 9-GRID WALL <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Preview Camera Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(cameras.slice(0, 4)).map((cam, idx) => (
                <div 
                  key={cam.camera_id || idx}
                  onClick={() => navigate('/video-wall')}
                  className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video cursor-pointer hover:border-emerald-500/50 transition shadow-lg"
                >
                  <img
                    src={`/api/stream/${cam.camera_id || 'CAM-001'}`}
                    alt={cam.camera_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = generateCctvSvg(cam.camera_id || 'CAM-01', cam.location_name || 'Gujarat Grid', 'GJ01AB1234');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-emerald-400 font-bold">
                      {cam.camera_id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/80 text-white font-sans text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> REC
                    </span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-bold text-white truncate">{cam.camera_name}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{cam.location_name} • {cam.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District Coverage Distribution */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Gujarat Surveillance Coverage Zones</h2>
              </div>
              <button
                onClick={() => navigate('/cameras')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              >
                OPEN GIS ASSET MAP <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {districts.map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <span className={`w-2 h-2 rounded-full ${d.color}`} />
                    <span className="truncate">{d.name}</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">{d.count}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Feeds Ingested</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Live Watchlist Detections & Quick Tool Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active ANPR Hits Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live ANPR Alerts</h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                LIVE
              </span>
            </div>

            <div className="mt-3 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Awaiting real-time stream hit notifications...
                </div>
              ) : (
                alerts.map((al, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/90 border border-rose-500/30 hover:border-rose-500/60 transition group cursor-pointer"
                    onClick={() => navigate(`/tracing?plate=${al.plate_number || 'GJ01AB1234'}`)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-rose-400 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" />
                        {al.plate_number || 'GJ01AB1234'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {al.timestamp ? al.timestamp.split('T')[1]?.slice(0,8) : '12:04:12'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 mt-1">{al.reason || 'Stolen Vehicle - FIR #382/2026'}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900 text-[10px] text-slate-400">
                      <span>{al.location_name || 'SG Highway, Ahmedabad'}</span>
                      <span className="text-emerald-400 group-hover:underline flex items-center gap-0.5 font-mono">
                        TRACE ROUTE &rarr;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Tactical Workspaces</h2>

            <button
              onClick={() => setShowDossierModal(true)}
              className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between group transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Section 65B Dossier</div>
                  <div className="text-[11px] text-slate-400">Indian Evidence Act SHA-256 PDF</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/scale')}
              className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between group transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">80,000 Scale Calculator</div>
                  <div className="text-[11px] text-slate-400">Bandwidth & Edge AI Sizing</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </button>

            <button
              onClick={() => setShowSandboxModal(true)}
              className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/50 flex items-center justify-between group transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Government Sandbox Hub</div>
                  <div className="text-[11px] text-slate-400">cctv.corp8.cloud Ingest API</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
