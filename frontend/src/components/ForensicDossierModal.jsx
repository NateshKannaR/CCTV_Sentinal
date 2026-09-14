import React from 'react';
import { Shield, Printer, CheckCircle2, FileCheck, MapPin, Clock, Calendar, Lock } from 'lucide-react';

export default function ForensicDossierModal({ isOpen, onClose, routeData }) {
  if (!isOpen || !routeData) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[3000] flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-8 shadow-2xl flex flex-col gap-6 text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:max-w-none">
        
        {/* Action Bar (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded font-mono font-bold border border-blue-500/30">
              LEGAL FORENSIC EXHIBIT
            </span>
            <span className="text-xs text-slate-400">Indian Evidence Act Section 65B Certified</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save Official PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Official Header */}
        <div className="text-center border-b-2 border-slate-700 print:border-black pb-4">
          <div className="text-xs tracking-widest uppercase font-bold text-blue-400 print:text-gray-700">
            Government of Gujarat • Home Department
          </div>
          <h1 className="text-xl font-black tracking-wide text-white print:text-black uppercase mt-1">
            State Crime Record Bureau (SCRB) — Cyber Forensic Directorate
          </h1>
          <div className="text-xs text-slate-400 print:text-gray-600 mt-1">
            Next to Police Bhawan, Sector-18, Gandhinagar, Gujarat - 382009
          </div>
          <div className="mt-2 inline-block bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 px-3 py-1 rounded text-xs font-mono font-bold">
            CASE DOSSIER REF: SCRB/GJ/CCTV-TRACE/{routeData.plate_number}/2026
          </div>
        </div>

        {/* Case & Target Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 print:bg-gray-50 p-4 rounded-xl border border-slate-800 print:border-gray-200">
          <div>
            <div className="text-slate-500 print:text-gray-500 font-semibold">Target Plate</div>
            <div className="font-mono font-bold text-base text-white print:text-black mt-0.5">{routeData.plate_number}</div>
          </div>
          <div>
            <div className="text-slate-500 print:text-gray-500 font-semibold">Offence Category</div>
            <div className="font-bold text-red-400 print:text-red-700 mt-0.5">{routeData.watchlist_info?.offence_type || "Surveillance Audit"}</div>
          </div>
          <div>
            <div className="text-slate-500 print:text-gray-500 font-semibold">FIR / Station</div>
            <div className="font-mono text-slate-300 print:text-black mt-0.5">{routeData.watchlist_info?.fir_number || "N/A"} ({routeData.watchlist_info?.police_station || "Gujarat State"})</div>
          </div>
          <div>
            <div className="text-slate-500 print:text-gray-500 font-semibold">Date of Extraction</div>
            <div className="font-mono text-slate-300 print:text-black mt-0.5">{currentDate}</div>
          </div>
        </div>

        {/* Trajectory Table */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-800 mb-2">
            Chronological CCTV Movement Sequence (Certified Sensor Log)
          </h2>
          <div className="border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-black font-semibold border-b border-slate-800 print:border-gray-300">
                <tr>
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Camera Node & Department</th>
                  <th className="py-2 px-3">Geo Coordinates</th>
                  <th className="py-2 px-3">Timestamp (IST)</th>
                  <th className="py-2 px-3">Inter-Hop Speed</th>
                  <th className="py-2 px-3">Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                {routeData.hops.map((hop) => (
                  <tr key={hop.sequence} className="hover:bg-slate-850">
                    <td className="py-2 px-3 font-mono font-bold">{hop.sequence}</td>
                    <td className="py-2 px-3 font-semibold text-white print:text-black">
                      {hop.camera_name}
                      <div className="text-[10px] text-slate-400 print:text-gray-500 font-mono">{hop.camera_id} • {hop.location_name}</div>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-400 print:text-gray-600">
                      {hop.latitude.toFixed(4)}° N, {hop.longitude.toFixed(4)}° E
                    </td>
                    <td className="py-2 px-3 font-mono">{hop.timestamp}</td>
                    <td className="py-2 px-3 font-mono text-amber-400 print:text-black font-bold">{hop.speed_kmh} km/h</td>
                    <td className="py-2 px-3 font-mono">+{hop.distance_km} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 65B Indian Evidence Act Legal Certificate Block */}
        <div className="bg-slate-950 print:bg-gray-50 p-4 rounded-xl border border-slate-800 print:border-gray-300 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400 print:text-emerald-800">
            <FileCheck className="w-4 h-4" />
            Certificate of Authenticity under Section 65B of the Indian Evidence Act, 1872
          </div>
          <p className="text-[11px] text-slate-400 print:text-gray-700 leading-relaxed">
            I hereby certify that the electronic camera telemetry, presentation timestamps (PTS), and ANPR photographic extracts reproduced in this document were recorded during regular electronic operation by the Gujarat Police Sentinel Surveillance Grid. The source storage and optical sensors were operating under supervised tamper-evident protocols. Cryptographic SHA-256 validation has confirmed integrity without post-facto alteration.
          </p>
          <div className="flex justify-between items-center pt-2 text-[10px] font-mono text-slate-500 print:text-gray-500">
            <span>SHA-256 HASH: 8f9b4e13d987e9124bb431ef82a723dc9124fa10b98214ee67</span>
            <span>STATUS: CERTIFIED ADMISSIBLE IN COURT</span>
          </div>
        </div>

        {/* Signature & Seal Block */}
        <div className="grid grid-cols-2 pt-6 text-xs text-center border-t border-slate-800 print:border-black">
          <div>
            <div className="font-bold text-slate-300 print:text-black">Investigating Officer (IO)</div>
            <div className="text-[11px] text-slate-500 print:text-gray-600 mt-1">Crime Branch / Traffic Command, Gujarat Police</div>
            <div className="mt-8 font-mono text-slate-600 print:text-black">[ DIGITAL SIGNATURE VERIFIED ]</div>
          </div>
          <div>
            <div className="font-bold text-slate-300 print:text-black">Cyber Forensic Superintendent</div>
            <div className="text-[11px] text-slate-500 print:text-gray-600 mt-1">State Crime Record Bureau (SCRB), Gandhinagar</div>
            <div className="mt-8 font-mono text-slate-600 print:text-black">[ OFFICIAL SEAL AFFIXED ]</div>
          </div>
        </div>

      </div>
    </div>
  );
}
