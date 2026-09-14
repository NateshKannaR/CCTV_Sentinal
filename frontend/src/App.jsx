import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, Tv, Car, ShieldAlert, Menu } from 'lucide-react';
import confetti from 'canvas-confetti';

// Shared Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ForensicDossierModal from './components/ForensicDossierModal';
import SandboxConnectModal from './components/SandboxConnectModal';
import PresentationModal from './components/PresentationModal';
import GapAnalysisModal from './components/GapAnalysisModal';

// Dedicated Page Views
import DashboardPage from './pages/DashboardPage';
import CamerasPage from './pages/CamerasPage';
import VideoWallPage from './pages/VideoWallPage';
import VehicleTracePage from './pages/VehicleTracePage';
import WatchlistPage from './pages/WatchlistPage';
import ScalePage from './pages/ScalePage';
import IntegratorPage from './pages/IntegratorPage';

// Offline & Vercel Resilient Data Fallbacks
import { 
  FALLBACK_CAMERAS, 
  FALLBACK_WATCHLIST, 
  FALLBACK_ALERTS, 
  FALLBACK_ROUTE_GJ01 
} from './data/fallbackData';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cameras, setCameras] = useState(FALLBACK_CAMERAS);
  const [watchlist, setWatchlist] = useState(FALLBACK_WATCHLIST);
  const [alerts, setAlerts] = useState(FALLBACK_ALERTS);
  const [activeRoute, setActiveRoute] = useState(FALLBACK_ROUTE_GJ01);
  const [isSearchingRoute, setIsSearchingRoute] = useState(false);

  // Global Modals
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [showGapModal, setShowGapModal] = useState(false);

  // Tactical Audio & Voice Radio
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [latestAlertToast, setLatestAlertToast] = useState(null);
  const wsRef = useRef(null);

  // Tactical Police Radio Dispatch Voice (SpeechSynthesis)
  const speakPoliceDispatch = (alert) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const plate = alert.plate_number || 'UNKNOWN';
      const phonetic = plate.split('').join(' ');
      const camName = alert.camera_name || alert.location_name || 'Ahmedabad Ring Road';
      const offence = alert.offence_type || alert.reason || 'Watchlist Hit';
      const text = `Attention SCRB Command. Target vehicle ${phonetic} sighted at ${camName}. Offence: ${offence}. Initiating tactical interception.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
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
      osc.frequency.setValueAtTime(850, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio chime error", e);
    }
  };

  // Load initial backend catalogue & state
  useEffect(() => {
    fetchCameras();
    fetchWatchlist();
    fetchAlerts();
    handleSearchPlate('GJ01AB1234');

    // WebSocket real-time subscription
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
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.85 } });
          }
        } catch (err) {
          console.error("WS Parse error", err);
        }
      };
    } catch (e) {
      console.warn("WS setup error", e);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [voiceEnabled]);

  const fetchCameras = () => {
    fetch('/api/cameras')
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        if (data && data.length) setCameras(data);
        else setCameras(FALLBACK_CAMERAS);
      })
      .catch(() => setCameras(FALLBACK_CAMERAS));
  };

  const fetchWatchlist = () => {
    fetch('/api/watchlist')
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        if (data && data.length) setWatchlist(data);
        else setWatchlist(FALLBACK_WATCHLIST);
      })
      .catch(() => setWatchlist(FALLBACK_WATCHLIST));
  };

  const fetchAlerts = () => {
    fetch('/api/alerts')
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        if (data && data.length) setAlerts(data);
        else setAlerts(FALLBACK_ALERTS);
      })
      .catch(() => setAlerts(FALLBACK_ALERTS));
  };

  const handleSearchPlate = (plate) => {
    setIsSearchingRoute(true);
    fetch(`/api/trace/${plate}`)
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        setActiveRoute(data);
        setIsSearchingRoute(false);
      })
      .catch(() => {
        setActiveRoute(FALLBACK_ROUTE_GJ01);
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
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.85 } });
        }
        handleSearchPlate(plate);
      })
      .catch(() => {
        const cam = cameras.find(c => (c.camera_id || c.id) === camId);
        const simAlert = {
          id: `ALT-${Date.now()}`,
          plate_number: plate || "GJ01AB1234",
          camera_id: camId,
          camera_name: cam?.name || cam?.camera_name || camId,
          location_name: cam?.location_name || "Gujarat State Highway",
          timestamp: new Date().toISOString(),
          offence_type: "Stolen Vehicle / Armed Robbery",
          priority: "CRITICAL",
          status: "NEW"
        };
        setAlerts(prev => [simAlert, ...prev]);
        setLatestAlertToast(simAlert);
        playAlertChime();
        speakPoliceDispatch(simAlert);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.85 } });
        setActiveRoute(FALLBACK_ROUTE_GJ01);
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
      })
      .catch(() => {
        const newItem = { ...item, id: `WL-${Date.now()}` };
        setWatchlist(prev => [newItem, ...prev]);
      });
  };

  const handleAcknowledgeAlert = (alertId) => {
    fetch(`/api/alerts/${alertId}/acknowledge`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a));
      })
      .catch(() => {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a));
      });
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
        {/* Tactical Header */}
        <Header
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
          setShowSandboxModal={setShowSandboxModal}
          setShowDossierModal={setShowDossierModal}
          setShowGapModal={setShowGapModal}
          setShowPresentationModal={setShowPresentationModal}
          alerts={alerts}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
          mobileMenuOpen={mobileMenuOpen}
        />

        {/* Layout Body: Sidebar + Dynamic Routed Page */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            setShowPresentationModal={setShowPresentationModal}
            setShowGapModal={setShowGapModal}
            activeAlertCount={alerts.filter(a => a.status !== 'ACKNOWLEDGED').length}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />

          {/* Main Page Route Views */}
          <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 md:pb-0">
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardPage
                    cameras={cameras}
                    alerts={alerts}
                    watchlist={watchlist}
                    setShowDossierModal={setShowDossierModal}
                    setShowSandboxModal={setShowSandboxModal}
                    setShowPresentationModal={setShowPresentationModal}
                  />
                }
              />
              <Route
                path="/cameras"
                element={<CamerasPage cameras={cameras} />}
              />
              <Route
                path="/video-wall"
                element={
                  <VideoWallPage
                    cameras={cameras}
                    onTriggerDetection={handleTriggerDetection}
                    activePlate="GJ01AB1234"
                  />
                }
              />
              <Route
                path="/tracing"
                element={
                  <VehicleTracePage
                    activeRoute={activeRoute}
                    onSearchPlate={handleSearchPlate}
                    isSearching={isSearchingRoute}
                    setShowDossierModal={setShowDossierModal}
                  />
                }
              />
              <Route
                path="/watchlist"
                element={
                  <WatchlistPage
                    watchlist={watchlist}
                    alerts={alerts}
                    onAddWatchlist={handleAddWatchlist}
                    onAcknowledgeAlert={handleAcknowledgeAlert}
                  />
                }
              />
              <Route
                path="/scale"
                element={<ScalePage />}
              />
              <Route
                path="/integrator"
                element={<IntegratorPage setShowSandboxModal={setShowSandboxModal} />}
              />
              {/* Fallback to Overview */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Global Slide-In Threat Alert Banner Toast */}
        {latestAlertToast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-rose-950/95 border border-rose-500 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-bounce">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                TACTICAL INTERCEPTION ALERT
              </div>
              <button
                onClick={() => setLatestAlertToast(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                DISMISS [X]
              </button>
            </div>
            <p className="text-white font-mono font-black text-base mt-1">
              {latestAlertToast.plate_number || 'GJ01AB1234'}
            </p>
            <p className="text-rose-200 text-xs mt-0.5">
              {latestAlertToast.reason || 'Watchlist Criminal Target Detected in Transit'}
            </p>
            <p className="text-slate-400 text-[11px] mt-1 font-mono">
              📍 {latestAlertToast.location_name || 'Ahmedabad Ring Road'}
            </p>
          </div>
        )}

        {/* Forensic Section 65B Dossier Modal */}
        <ForensicDossierModal
          isOpen={showDossierModal}
          onClose={() => setShowDossierModal(false)}
          dossierData={activeRoute}
        />

        {/* Official Sandbox Connect Modal */}
        <SandboxConnectModal
          isOpen={showSandboxModal}
          onClose={() => setShowSandboxModal(false)}
          onConnected={(catalogue) => {
            if (catalogue && catalogue.length) {
              setCameras(catalogue);
            }
          }}
        />

        {/* Pitch Deck Presentation Modal */}
        <PresentationModal
          isOpen={showPresentationModal}
          onClose={() => setShowPresentationModal(false)}
        />

        {/* Hackathon Compliance & Gap Analysis Modal */}
        <GapAnalysisModal
          isOpen={showGapModal}
          onClose={() => setShowGapModal(false)}
        />

        {/* Mobile Modern Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-40 flex items-center justify-around py-1.5 px-1 shadow-2xl">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/cameras"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <MapPin className="w-4 h-4" />
            <span>GIS</span>
          </NavLink>

          <NavLink
            to="/video-wall"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Tv className="w-4 h-4" />
            <span>Wall</span>
          </NavLink>

          <NavLink
            to="/tracing"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Car className="w-4 h-4" />
            <span>Trace</span>
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors relative ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <div className="relative">
              <ShieldAlert className="w-4 h-4" />
              {alerts.some(a => a.status !== 'ACKNOWLEDGED') && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <span>Watch</span>
          </NavLink>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span>More</span>
          </button>
        </nav>
      </div>
    </HashRouter>
  );
}
