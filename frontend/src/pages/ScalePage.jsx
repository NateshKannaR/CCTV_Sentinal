import React from 'react';
import ScaleCalculator from '../components/ScaleCalculator';
import { Sliders, Server, Cpu, HardDrive, Network } from 'lucide-react';

export default function ScalePage() {
  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                80,000 Statewide Camera Sizing Architecture
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                PETABYTE-SCALE SIMULATOR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live capacity planner for bandwidth optimization, tiered cold/warm storage, and distributed edge AI inference clusters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>EDGE HYBRID: 80% OFF-CLOUD</span>
          </div>
        </div>
      </div>

      {/* Embedded Scale Calculator */}
      <ScaleCalculator />
    </div>
  );
}
