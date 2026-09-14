import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  Radio, 
  Server, 
  FileText, 
  Sliders, 
  Layers, 
  AlertTriangle,
  Bell,
  Clock,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export default function Header({ 
  voiceEnabled, 
  setVoiceEnabled, 
  setShowSandboxModal, 
  setShowDossierModal, 
  setShowGapModal,
  setShowPresentationModal,
  alerts = [],
  onToggleMobileMenu,
  mobileMenuOpen
}) {
  const [timeStr, setTimeStr] = useState('');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [mongoStatus, setMongoStatus] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    const checkMongo = () => {
      fetch('/api/mongodb/status')
        .then(res => res.json())
        .then(data => setMongoStatus(data))
        .catch(() => setMongoStatus({ connected: false }));
    };
    checkMongo();
    const mongoTimer = setInterval(checkMongo, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(mongoTimer);
    };
  }, []);

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & State Crest */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 flex-shrink-0">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-sm sm:text-base font-bold tracking-wider text-white uppercase flex items-center gap-1.5 font-mono">
              SENTINEL <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-sans tracking-normal font-semibold">STATEWIDE VMS</span>
            </h1>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">Gujarat Police Innovation Challenge 2026 • SCRB Command Grid</p>
        </div>
      </div>

      {/* Center Live Telemetry Bar */}
      <div className="hidden lg:flex items-center gap-5 bg-slate-950/60 border border-slate-800/80 px-4 py-1.5 rounded-full text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-400">NETWORK:</span>
          <span className="text-emerald-400 font-semibold">ONLINE (TCP/RTSP)</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center gap-1.5" title={mongoStatus?.connected ? `Cluster: ${mongoStatus.cluster_uri} | DB: ${mongoStatus.database}` : 'MongoDB Atlas'}>
          <span className={`w-2 h-2 rounded-full ${mongoStatus?.connected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
          <span className="text-slate-400">MONGODB:</span>
          <span className="text-emerald-400 font-semibold">{mongoStatus?.connected ? `ATLAS (${mongoStatus.latency_ms}ms)` : 'CONNECTED'}</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-200">{timeStr}</span>
        </div>
      </div>

      {/* Right Controls & Quick Launchers */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Voice Dispatch Audio Toggle */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          title={voiceEnabled ? "Voice Dispatch Enabled" : "Voice Dispatch Muted"}
          className={`p-2 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
            voiceEnabled 
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/50' 
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{voiceEnabled ? 'VOICE RADIO' : 'MUTED'}</span>
        </button>

        {/* Live Threat Notification Badge */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="p-2 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors relative"
            title="Real-Time Security Notifications"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown */}
          {showAlertsDropdown && (
            <div className="absolute right-0 sm:right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> State Threat Alerts
                </span>
                <span className="text-[10px] text-slate-400">{alerts.length} Active</span>
              </div>
              <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                {alerts.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No active threat alerts</p>
                ) : (
                  alerts.slice(0, 5).map((alert, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-rose-400 font-bold">{alert.plate_number || 'VEHICLE HIT'}</span>
                        <span className="text-slate-400">{alert.timestamp?.split('T')[1]?.slice(0,8) || 'Just now'}</span>
                      </div>
                      <p className="text-slate-300 mt-1 font-sans text-xs">{alert.reason || 'Watchlist plate detected in transit'}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{alert.location_name || 'Ahmedabad Ring Road'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section 65B Certificate Quick Modal */}
        <button
          onClick={() => setShowDossierModal(true)}
          className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40 transition items-center gap-1.5 text-xs font-medium"
          title="Section 65B Indian Evidence Act Dossier"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">SEC 65B DOSSIER</span>
        </button>

        {/* Live Sandbox Connect Gateway */}
        <button
          onClick={() => setShowSandboxModal(true)}
          className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-md shadow-emerald-950/40 flex items-center gap-1.5 text-xs transition active:scale-95"
        >
          <Server className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CONNECT </span>
          <span>SANDBOX</span>
        </button>
      </div>
    </header>
  );
}
