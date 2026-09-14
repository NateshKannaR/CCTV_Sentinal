import React from 'react';
import WatchlistManager from '../components/WatchlistManager';
import { ShieldAlert, Database, Bell, Radio } from 'lucide-react';

export default function WatchlistPage({
  watchlist = [],
  alerts = [],
  onAddWatchlist,
  onAcknowledgeAlert
}) {
  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                State Law Enforcement Watchlist & Dispatch
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                eGujCop / VAHAN / SARTHI / NAFIS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous cross-referencing against 80,000 edge nodes with instant voice radio dispatch and police intercept units
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>SYNCHRONIZED WITH STATE CRIME RECORDS BUREAU</span>
        </div>
      </div>

      {/* Embedded Watchlist Manager */}
      <WatchlistManager
        watchlist={watchlist}
        alerts={alerts}
        onAddWatchlist={onAddWatchlist}
        onAcknowledgeAlert={onAcknowledgeAlert}
      />
    </div>
  );
}
