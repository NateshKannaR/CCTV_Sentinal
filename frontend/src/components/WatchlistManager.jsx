import React, { useState } from 'react';
import { ShieldAlert, Plus, Bell, CheckCircle, Database, Car, FileWarning, ExternalLink } from 'lucide-react';

export default function WatchlistManager({ watchlist, alerts, onAddWatchlist, onAcknowledgeAlert }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    plate_number: '',
    owner_name: '',
    vehicle_model: '',
    offence_type: 'Stolen Vehicle / Armed Robbery',
    fir_number: '',
    police_station: 'Crime Branch Ahmedabad',
    priority: 'CRITICAL',
    source_db: 'eGujCop',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plate_number) return;
    onAddWatchlist(formData);
    setShowAddModal(false);
    setFormData({
      plate_number: '',
      owner_name: '',
      vehicle_model: '',
      offence_type: 'Stolen Vehicle / Armed Robbery',
      fir_number: '',
      police_station: 'Crime Branch Ahmedabad',
      priority: 'CRITICAL',
      source_db: 'eGujCop',
      notes: ''
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Watchlist Database & Live Alerting Engine
          </h2>
          <p className="text-xs text-slate-400">
            Automated cross-referencing with VAHAN, SARTHI, eGujCop, and NAFIS for real-time criminal detection
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Target Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist Table (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-400" />
              Active Watchlist Records ({watchlist.length})
            </span>
            <span className="text-slate-400 font-normal">Cross-referenced continuous AI ingestion</span>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Vehicle Plate</th>
                  <th className="py-2.5 px-3">Offence / FIR</th>
                  <th className="py-2.5 px-3">Police Station</th>
                  <th className="py-2.5 px-3">Source DB</th>
                  <th className="py-2.5 px-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                {watchlist.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded border border-amber-500/30">
                          IND
                        </span>
                        {item.plate_number}
                      </div>
                      <div className="text-[10px] font-sans font-normal text-slate-400 mt-0.5">
                        {item.vehicle_model}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-200">
                      <div className="font-semibold">{item.offence_type}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.fir_number}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {item.police_station}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-blue-400">
                      {item.source_db}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Alerts Stream (1 Column) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-red-500 animate-bounce" />
              Live Alerts Stream ({alerts.length})
            </span>
            <span className="text-[10px] bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/40">
              REAL-TIME
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs bg-slate-950/40 rounded-lg border border-slate-800">
                Awaiting real-time detection matches...
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs flex flex-col gap-2 transition-all ${
                    alert.status === 'NEW'
                      ? 'bg-red-950/30 border-red-500/70 shadow-lg shadow-red-950/40'
                      : 'bg-slate-950 border-slate-800 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        {alert.plate_number}
                      </div>
                      <div className="text-[11px] text-red-400 font-semibold mt-0.5">
                        {alert.offence_type}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {alert.timestamp?.split(' ')[1] || alert.timestamp}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    📍 {alert.camera_name}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400">
                      {alert.camera_id}
                    </span>
                    {alert.status === 'NEW' ? (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-0.5 rounded text-[10px] transition-colors"
                      >
                        Acknowledge & Dispatch
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Dispatched
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Target Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                Add Target Vehicle to Watchlist
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={formData.plate_number}
                  onChange={(e) => setFormData({ ...formData, plate_number: e.target.value.toUpperCase() })}
                  placeholder="e.g. GJ01AB9999"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Owner / Suspect</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    placeholder="e.g. Unknown Suspect"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={formData.vehicle_model}
                    onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
                    placeholder="e.g. White SUV"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Offence / Case Type</label>
                <input
                  type="text"
                  value={formData.offence_type}
                  onChange={(e) => setFormData({ ...formData, offence_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">FIR Number</label>
                  <input
                    type="text"
                    value={formData.fir_number}
                    onChange={(e) => setFormData({ ...formData, fir_number: e.target.value })}
                    placeholder="FIR-55/2026"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Source DB</label>
                  <select
                    value={formData.source_db}
                    onChange={(e) => setFormData({ ...formData, source_db: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="eGujCop">eGujCop (Police CCTNS)</option>
                    <option value="VAHAN">VAHAN (National Vehicle DB)</option>
                    <option value="SARTHI">SARTHI (Licensing DB)</option>
                    <option value="AFIS">AFIS (Fingerprint DB)</option>
                    <option value="NAFIS">NAFIS (National NAFIS)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500"
                >
                  Save to Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
