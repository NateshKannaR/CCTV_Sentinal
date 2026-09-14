import React, { useState } from 'react';
import { 
  Search, 
  Navigation, 
  AlertTriangle, 
  Clock, 
  Gauge, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Eye, 
  Crosshair, 
  ShieldAlert, 
  FileCheck,
  Radio
} from 'lucide-react';
import { generateCctvSvg, FALLBACK_ROUTE_GJ01 } from '../data/fallbackData';

export default function RouteReconstructor({ activeRoute = FALLBACK_ROUTE_GJ01, onSearchPlate, isSearching, onOpenDossier }) {
  const [searchInput, setSearchInput] = useState('GJ01AB1234');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [dispatchedCheckpoints, setDispatchedCheckpoints] = useState({});

  // Defensive field resolution to prevent blank page crashes
  const currentRoute = activeRoute || FALLBACK_ROUTE_GJ01;
  const hops = currentRoute?.hops || currentRoute?.sightings || [];
  const totalDetections = currentRoute?.total_detections ?? currentRoute?.total_sightings ?? hops.length;
  const watchlistInfo = currentRoute?.watchlist_info || currentRoute?.watchlist_entry;
  const predictedInterception = Array.isArray(currentRoute?.predicted_interception)
    ? currentRoute.predicted_interception
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() && onSearchPlate) {
      onSearchPlate(searchInput.trim());
    }
  };

  const samplePlates = ['GJ01AB1234', 'GJ05XY9999', 'GJ27CD5678'];

  const handleDispatchRoadblock = (checkpointName) => {
    setDispatchedCheckpoints(prev => ({
      ...prev,
      [checkpointName]: true
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-5 shadow-2xl flex flex-col gap-4 sm:gap-5">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            Designated Vehicle Route Reconstruction
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            State-wide chronological movement history, trajectory mapping, and predictive interception planner
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Quick Test:</span>
          {samplePlates.map(p => (
            <button
              key={p}
              onClick={() => {
                setSearchInput(p);
                onSearchPlate(p);
              }}
              className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-mono font-bold transition-all ${
                currentRoute?.plate_number === p
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Plate Search Input & Legal Dossier Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-1 gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-[10px] font-bold text-amber-400 bg-black/40 px-1 rounded border border-amber-500/40">IND</span>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              placeholder="Enter Vehicle Reg No (e.g. GJ01AB1234)"
              className="w-full pl-12 sm:pl-14 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono font-bold text-xs sm:text-sm tracking-wider focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {isSearching ? 'Reconstructing...' : 'Trace Vehicle'}
          </button>
        </form>

        {totalDetections > 0 && (
          <button
            onClick={() => onOpenDossier && onOpenDossier(currentRoute)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold px-4 py-2.5 rounded-lg text-xs transition-all whitespace-nowrap"
            title="Generate Official Section 65B Indian Evidence Act Certified Forensic Docket"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Export Section 65B Dossier
          </button>
        )}
      </div>

      {/* Watchlist Match Banner (If Vehicle is Flagged) */}
      {watchlistInfo && (
        <div className="bg-red-950/40 border border-red-500/60 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/20 rounded text-red-400 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="font-bold text-red-300 flex items-center gap-2">
                CRITICAL WATCHLIST HIT: {watchlistInfo.offence_type || 'Flagged Target'}
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                  {watchlistInfo.priority || 'CRITICAL'}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Owner/Suspect: <b>{watchlistInfo.owner_name || 'Unknown'}</b> | Model: <b>{watchlistInfo.vehicle_model || 'Unknown'}</b>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                FIR: <b>{watchlistInfo.fir_number || 'N/A'}</b> ({watchlistInfo.police_station || 'HQ'}) | Source DB: <b>{watchlistInfo.source_db || 'State CCTNS'}</b>
              </div>
            </div>
          </div>
          <div className="text-xs text-red-300 bg-red-900/30 px-3 py-1.5 rounded border border-red-700/40 whitespace-nowrap">
            ⚠️ Law & Order Alert Dispatched
          </div>
        </div>
      )}

      {/* Route Summary Telemetry Cards */}
      {totalDetections > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-950/80 border border-slate-800 border-t-2 border-t-emerald-500 rounded-xl p-3.5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium">CCTV Checkpoints</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-1.5 font-mono tracking-tight">
              {totalDetections} <span className="text-xs text-emerald-400 font-sans font-semibold">Nodes</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sequential Ingestion
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 border-t-2 border-t-cyan-500 rounded-xl p-3.5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium">Total Traversed</span>
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-1.5 font-mono tracking-tight">
              {currentRoute?.total_distance_km ?? 0} <span className="text-xs text-cyan-400 font-sans font-semibold">km</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Haversine Spatial Graph</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-3.5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium">Avg Transit Speed</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Gauge className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-1.5 font-mono tracking-tight">
              {currentRoute?.average_speed_kmh ?? 0} <span className="text-xs text-amber-400 font-sans font-semibold">km/h</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Inter-Hop Monotonic PTS</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 border-t-2 border-t-purple-500 rounded-xl p-3.5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium">Track Duration</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-white mt-2 font-mono truncate">
              {hops.length > 1 && hops[hops.length - 1]?.timestamp
                ? `${hops[hops.length - 1].timestamp.split(' ')[1] || hops[hops.length - 1].timestamp}`
                : 'Single Sight'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">First to Last Sighting</div>
          </div>
        </div>
      )}

      {/* UNIQUE FEATURE: AI Predictive Interception & Roadblock Planner */}
      {predictedInterception.length > 0 && (
        <div className="bg-blue-950/20 border border-blue-500/40 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-blue-400 animate-spin" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Predictive Interception & Tactical Roadblock Planner
              </h3>
            </div>
            <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-bold">
              PROACTIVE INTERCEPTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {predictedInterception.map((plan, i) => {
              const isDispatched = dispatchedCheckpoints[plan.checkpoint];

              return (
                <div key={i} className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex flex-col justify-between gap-2.5 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-blue-400">ETA: {plan.eta_minutes} Mins</span>
                      <span className="text-slate-400 text-[10px]">Distance: {plan.distance_km} km</span>
                    </div>
                    <div className="font-bold text-white text-xs mt-1">{plan.checkpoint}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{plan.district}</div>
                    <p className="text-[11px] text-slate-300 mt-1.5 bg-slate-900/90 p-2 rounded border border-slate-800/80 leading-relaxed">
                      🎯 <b>Action:</b> {plan.tactical_action}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {plan.probability_percent}% Match
                    </span>
                    {isDispatched ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Roadblock Deployed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDispatchRoadblock(plan.checkpoint)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded text-[10px] transition-colors"
                      >
                        Authorize Intercept
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chronological Movement Hop Timeline */}
      {hops.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Chronological Checkpoint Sequence</span>
            <span className="text-slate-400 font-normal">Click any snapshot to inspect evidence</span>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {hops.map((hop, idx) => (
              <div
                key={hop.sequence || idx}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-4 transition-all"
              >
                {/* Sequence & Cam Info */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 border border-red-500/80 text-red-400 flex items-center justify-center font-bold text-[11px] sm:text-xs font-mono flex-shrink-0">
                    {hop.sequence || idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">{hop.camera_name}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1 py-0.2 rounded flex-shrink-0">
                        {hop.camera_id}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                      📍 {hop.location_name}
                    </div>
                    <div className="sm:hidden text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      ⏱️ {hop.timestamp?.split(' ')[1] || hop.timestamp} • {hop.speed_kmh} km/h
                    </div>
                  </div>
                </div>

                {/* Telemetry Numbers */}
                <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-slate-200 font-bold">{hop.timestamp}</div>
                    <div className="text-[10px] text-slate-400">
                      +{hop.distance_km} km • {hop.speed_kmh} km/h
                    </div>
                  </div>

                  {/* Snapshot Thumbnail Preview */}
                  <button
                    onClick={() => setSelectedSnapshot(hop)}
                    className="relative w-12 h-8 sm:w-14 sm:h-9 bg-slate-800 rounded overflow-hidden border border-slate-700 hover:border-red-400 group cursor-pointer flex-shrink-0"
                    title="Inspect Snapshot"
                  >
                    <img
                      src={hop.snapshot_url || generateCctvSvg(hop.camera_id, hop.location_name, currentRoute?.plate_number)}
                      alt="Crop"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = generateCctvSvg(hop.camera_id, hop.location_name, currentRoute?.plate_number);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 text-xs bg-slate-950/40 rounded-lg border border-slate-800/60">
          No movement trace recorded for this plate. Try searching <b>GJ01AB1234</b>.
        </div>
      )}

      {/* Snapshot Evidence Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-3 sm:p-4 shadow-2xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>CCTV Snapshot Evidence</span>
                <span className="text-[10px] sm:text-xs font-mono bg-red-600 text-white px-2 py-0.5 rounded">
                  {selectedSnapshot.camera_id}
                </span>
              </div>
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
              <img
                src={selectedSnapshot.snapshot_url || generateCctvSvg(selectedSnapshot.camera_id, selectedSnapshot.location_name, currentRoute?.plate_number)}
                alt="Evidence"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = generateCctvSvg(selectedSnapshot.camera_id, selectedSnapshot.location_name, currentRoute?.plate_number);
                }}
              />
            </div>
            <div className="text-[11px] sm:text-xs text-slate-300 flex flex-col sm:flex-row sm:justify-between gap-1">
              <div className="truncate">📍 {selectedSnapshot.location_name}</div>
              <div className="font-mono">Timestamp: {selectedSnapshot.timestamp}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
