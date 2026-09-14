import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, ShieldAlert, BarChart3, MapPin } from 'lucide-react';

export default function GapAnalysisModal({ isOpen, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/cameras/gap-analysis')
        .then(res => res.json())
        .then(resData => setData(resData))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Statewide CCTV Gap Analysis & Health Audit (Model 1)
            </h2>
            <p className="text-xs text-slate-400">
              Departmental distribution, retention periods, camera health, and uncovered surveillance zones
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold">
            ✕
          </button>
        </div>

        {/* Fleet Health Metrics */}
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400">Total Cameras</div>
            <div className="text-xl font-bold text-white mt-1 font-mono">{data.total_cameras}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400">Operational Online</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{data.online_cameras}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400">Offline / Down</div>
            <div className="text-xl font-bold text-red-400 mt-1 font-mono">{data.offline_cameras}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400">Degraded Feeds</div>
            <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{data.degraded_cameras}</div>
          </div>
        </div>

        {/* Department Distribution */}
        <div>
          <div className="text-xs font-semibold text-slate-300 mb-2">Departmental Camera Share</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Object.entries(data.departments_count).map(([dept, count]) => (
              <div key={dept} className="bg-slate-950/70 p-2.5 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 truncate max-w-[120px]">{dept}</span>
                <span className="font-mono font-bold text-blue-400">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Uncovered Zones & High-Risk Gaps */}
        <div>
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Identified Surveillance Blind Spots & Recommendations
          </div>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 text-xs">
            {data.coverage_gaps.map((gap, i) => (
              <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {gap.zone}
                    <span className="text-[10px] text-slate-400 font-mono">({gap.district})</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{gap.recommendation}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  gap.risk === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {gap.risk} Risk
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded">
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
