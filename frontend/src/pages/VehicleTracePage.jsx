import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RouteReconstructor from '../components/RouteReconstructor';
import { Car, Shield, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';
import { FALLBACK_ROUTE_GJ01 } from '../data/fallbackData';

export default function VehicleTracePage({
  activeRoute = FALLBACK_ROUTE_GJ01,
  onSearchPlate,
  isSearching,
  setShowDossierModal
}) {
  const [searchParams] = useSearchParams();
  const plateParam = searchParams.get('plate');

  useEffect(() => {
    if (plateParam) {
      onSearchPlate(plateParam);
    }
  }, [plateParam]);

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/30">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Statewide Vehicle Re-Identification & Trace Engine
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                AI RE-ID ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Primary Target: <span className="font-mono font-bold text-emerald-400">GJ01AB1234</span> • Multi-camera tracking across SG Highway, Ring Road, and Capital Expressway
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDossierModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-300 font-semibold text-xs flex items-center gap-2 transition"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>GENERATE SEC 65B EVIDENCE</span>
        </button>
      </div>

      {/* Embedded Route Reconstructor */}
      <RouteReconstructor
        activeRoute={activeRoute}
        onSearchPlate={onSearchPlate}
        isSearching={isSearching}
        onOpenDossier={() => setShowDossierModal(true)}
      />
    </div>
  );
}
