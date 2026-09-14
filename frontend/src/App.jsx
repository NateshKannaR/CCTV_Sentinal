import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Map as MapIcon, 
  Video, 
  Navigation, 
  Bell, 
  Server, 
  FileText, 
  Presentation, 
  Activity, 
  Filter, 
  Radio, 
  AlertTriangle,
  Play,
  Download,
  Info,
  Volume2,
  VolumeX,
  FileCheck,
  Cloud
} from 'lucide-react';
import confetti from 'canvas-confetti';

import GisMap from './components/GisMap';
import VideoWall from './components/VideoWall';
import RouteReconstructor from './components/RouteReconstructor';
import WatchlistManager from './components/WatchlistManager';
import ScaleCalculator from './components/ScaleCalculator';
import GapAnalysisModal from './components/GapAnalysisModal';
import PresentationModal from './components/PresentationModal';
import ForensicDossierModal from './components/ForensicDossierModal';
import SandboxConnectModal from './components/SandboxConnectModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'video', 'trace', 'watchlist', 'scale'
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [showCoverage, setShowCoverage] = useState(false);

  const [activeRoute, setActiveRoute] = useState(null);
  const [isSearchingRoute, setIsSearchingRoute] = useState(false);

  const [watchlist, setWatchlist] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [latestAlertToast, setLatestAlertToast] = useState(null);

  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [dossierData, setDossierData] = useState(null);
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);

  const [voiceDispatchEnabled, setVoiceDispatchEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { hour12: false }));
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  const wsRef = useRef(null);

  // Tactical Police Radio Dispatch Voice (SpeechSynthesis)
  const speakPoliceDispatch = (alert) => {
    if (!voiceDispatchEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const phonetic = alert.plate_number.split('').join(' ');
      const text = `Attention Crime Branch. Critical alert. Target vehicle ${phonetic} spotted at ${alert.camera_name}. Offence: ${alert.offence_type}. Authorized interception underway.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.92;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS Dispatch error", e);
    }
  };

  // Synthesize police alert sound using Web Audio API
  const playAlertChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("Audio chime unsupported", e);
    }
  };

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchCameras();
    fetchWatchlist();
    fetchAlerts();
    // Default search for evaluation vehicle
    handleSearchPlate('GJ01AB1234');

    // Setup real-time WebSocket for alerts
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/alerts`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'WATCHLIST_ALERT') {
            const alertData = msg.data;
            setAlerts(prev => [alertData, ...prev]);
            setLatestAlertToast(alertData);
            playAlertChime();
            speakPoliceDispatch(alertData);
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
          }
        } catch (err) {
          console.error("WS Parse error", err);
        }
      };

      ws.onerror = () => setIsBackendConnected(false);
      ws.onopen = () => setIsBackendConnected(true);
    } catch (e) {
      console.warn("WS connection error", e);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [voiceDispatchEnabled]);

  const fetchCameras = () => {
    fetch('/api/cameras')
      .then(res => res.json())
      .then(data => {
        setCameras(data);
        setIsBackendConnected(true);
      })
      .catch(() => setIsBackendConnected(false));
  };

  const fetchWatchlist = () => {
    fetch('/api/watchlist')
      .then(res => res.json())
      .then(data => setWatchlist(data))
      .catch(err => console.error(err));
  };

  const fetchAlerts = () => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error(err));
  };

  const handleSearchPlate = (plate) => {
    setIsSearchingRoute(true);
    fetch(`/api/trace/${plate}`)
      .then(res => res.json())
      .then(data => {
        setActiveRoute(data);
        setIsSearchingRoute(false);
      })
      .catch(err => {
        console.error(err);
        setIsSearchingRoute(false);
      });
  };

  const handleTriggerDetection = (camId, plate) => {
    fetch(`/api/simulate-detection?camera_id=${camId}&plate_number=${plate}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.alert) {
          setAlerts(prev => [data.alert, ...prev]);
          setLatestAlertToast(data.alert);
          playAlertChime();
          speakPoliceDispatch(data.alert);
        }
        // Refresh route
        handleSearchPlate(plate);
      });
  };

  const handleAddWatchlist = (item) => {
    fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
      .then(res => res.json())
      .then(saved => {
        setWatchlist(prev => [saved, ...prev]);
      });
  };

  const handleAcknowledgeAlert = (alertId) => {
    fetch(`/api/alerts/${alertId}/acknowledge`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a));
      });
  };

  const handleOpenDossier = (route) => {
    setDossierData(route);
    setIsDossierOpen(true);
  };

  const filteredCameras = selectedDept === 'ALL'
    ? cameras
    : cameras.filter(c => c.department.includes(selectedDept));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Police Command Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600/20 text-red-500 rounded-xl border border-red-500/40 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-white uppercase">
                GUJARAT POLICE <span className="text-blue-400">SENTINEL</span>
              </h1>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono font-bold border border-red-500/30">
                GPIC-2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Integrated Video Management & Predictive Crime Analytics Platform
            </p>
          </div>
        </div>

        {/* Action Controls & System Status */}
        <div className="flex items-center gap-2.5">
          {/* Direct cctv.corp8.cloud Gateway Connector */}
          <button
            onClick={() => setIsSandboxModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-950/70 hover:bg-blue-900/80 text-blue-300 text-xs px-3 py-1.5 rounded-lg border border-blue-500/40 shadow transition-all"
            title="Connect official cctv.corp8.cloud sandbox gateway"
          >
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            cctv.corp8.cloud Gateway
          </button>

          {/* Voice Radio Toggle */}
          <button
            onClick={() => setVoiceDispatchEnabled(!voiceDispatchEnabled)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              voiceDispatchEnabled 
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Police Radio Voice Dispatcher"
          >
            {voiceDispatchEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {voiceDispatchEnabled ? 'Radio: ON' : 'Radio: MUTE'}
          </button>

          <button
            onClick={() => setIsGapModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            Gap Analysis
          </button>

          <button
            onClick={() => setIsPresentationOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md shadow-blue-600/30 transition-all"
          >
            <Presentation className="w-3.5 h-3.5" />
            Pitch Deck
          </button>

          {/* Telemetry Clock & Connectivity */}
          <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-slate-400 text-[11px]">{isBackendConnected ? 'LIVE' : 'OFFLINE'}</span>
            </div>
            <div className="text-slate-200 font-bold">{currentTime} IST</div>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation Bar */}
      <nav className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'map' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            1. GIS Registry Map (Model 1)
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'video' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            2. Video Wall (Model 2)
          </button>

          <button
            onClick={() => setActiveTab('trace')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'trace' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-4 h-4 text-amber-300" />
            3. Vehicle Tracing & Route
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all relative ${
              activeTab === 'watchlist' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            4. Watchlist & Alerts
            {alerts.filter(a => a.status === 'NEW').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scale')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'scale' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            5. ~80,000 Scale Engine
          </button>
        </div>

        {/* Department Filter (Visible in Map View) */}
        {activeTab === 'map' && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Departments (50 Cams)</option>
              <option value="Police">Home Dept (Police)</option>
              <option value="RTO">RTO Gujarat</option>
              <option value="Food">Food & Civil Supplies</option>
              <option value="Municipal">Municipal Corporations</option>
            </select>
            <label className="flex items-center gap-1 text-slate-300 ml-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCoverage}
                onChange={(e) => setShowCoverage(e.target.checked)}
                className="accent-blue-500"
              />
              Coverage Radii
            </label>
          </div>
        )}
      </nav>

      {/* Main Tab Content Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <GisMap
                cameras={filteredCameras}
                selectedCamera={selectedCamera}
                onSelectCamera={setSelectedCamera}
                activeRoute={activeRoute}
                showCoverage={showCoverage}
              />
            </div>

            {/* Sidebar Camera Inventory & Quick Inspector */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3 max-h-[640px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-white">Camera Assets ({filteredCameras.length})</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Model 1 Compliant
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 flex-1 text-xs">
                {filteredCameras.map((cam) => (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCamera(cam)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      selectedCamera?.id === cam.id
                        ? 'bg-blue-950/40 border-blue-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <div className="font-bold text-white font-mono text-[11px]">{cam.id}</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        cam.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {cam.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-slate-300 font-semibold text-xs mt-0.5 truncate">{cam.name}</div>
                    <div className="text-slate-500 text-[10px] mt-0.5 truncate">📍 {cam.location_name}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[9px] text-slate-400">
                      <span>{cam.codec}</span> • <span>{cam.resolution}</span> • <span>{cam.storage_retention_days}d Retention</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <VideoWall
            cameras={cameras}
            onTriggerDetection={handleTriggerDetection}
            activePlate={activeRoute?.plate_number}
          />
        )}

        {activeTab === 'trace' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RouteReconstructor
                activeRoute={activeRoute}
                onSearchPlate={handleSearchPlate}
                isSearching={isSearchingRoute}
                onOpenDossier={handleOpenDossier}
              />
            </div>
            <div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
                <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <MapIcon className="w-4 h-4 text-red-400" />
                  Trajectory GeoJSON Preview
                </div>
                <div className="h-[480px]">
                  <GisMap
                    cameras={cameras}
                    selectedCamera={null}
                    activeRoute={activeRoute}
                    showCoverage={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <WatchlistManager
            watchlist={watchlist}
            alerts={alerts}
            onAddWatchlist={handleAddWatchlist}
            onAcknowledgeAlert={handleAcknowledgeAlert}
          />
        )}

        {activeTab === 'scale' && (
          <ScaleCalculator />
        )}
      </main>

      {/* Floating Real-Time Alert Toast (Bottom Right) */}
      {latestAlertToast && (
        <div className="fixed bottom-6 right-6 z-[3000] max-w-sm w-full bg-red-950 border-2 border-red-500 rounded-xl p-4 shadow-2xl shadow-red-900/50 flex flex-col gap-2 alert-pulse">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
              <div className="font-black text-white text-sm">REAL-TIME WATCHLIST HIT!</div>
            </div>
            <button
              onClick={() => setLatestAlertToast(null)}
              className="text-red-300 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-slate-200">
            Detected: <b className="font-mono text-white text-sm bg-black/40 px-1.5 py-0.5 rounded">{latestAlertToast.plate_number}</b>
          </div>
          <div className="text-xs text-red-300">
            Offence: <b>{latestAlertToast.offence_type}</b>
          </div>
          <div className="text-[11px] text-slate-300">
            📍 {latestAlertToast.camera_name}
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setActiveTab('trace');
                handleSearchPlate(latestAlertToast.plate_number);
                setLatestAlertToast(null);
              }}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow"
            >
              Trace Route on Map →
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <GapAnalysisModal isOpen={isGapModalOpen} onClose={() => setIsGapModalOpen(false)} />
      <PresentationModal isOpen={isPresentationOpen} onClose={() => setIsPresentationOpen(false)} />
      <ForensicDossierModal isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} routeData={dossierData} />
      <SandboxConnectModal isOpen={isSandboxModalOpen} onClose={() => setIsSandboxModalOpen(false)} />
    </div>
  );
}
