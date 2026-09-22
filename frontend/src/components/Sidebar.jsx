import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Tv, 
  Car, 
  ShieldAlert, 
  Sliders, 
  Terminal, 
  Layers, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
  X,
  Shield
} from 'lucide-react';

export default function Sidebar({ 
  collapsed, 
  setCollapsed, 
  setShowPresentationModal, 
  setShowGapModal,
  activeAlertCount = 0,
  mobileOpen = false,
  setMobileOpen
}) {
  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, badge: null },
    { to: '/cameras', label: 'GIS Cameras', icon: MapPin, badge: '50 LIVE' },
    { to: '/video-wall', label: 'Video Wall', icon: Tv, badge: 'REAL GRID' },
    { to: '/tracing', label: 'Vehicle Tracer', icon: Car, badge: 'AI LOCK' },
    { to: '/watchlist', label: 'Watchlist', icon: ShieldAlert, badge: activeAlertCount > 0 ? `${activeAlertCount} HITS` : null, alert: activeAlertCount > 0 },
    { to: '/evidence', label: 'Evidence Vault', icon: Shield, badge: 'BSA 2023' },
    { to: '/scale', label: '80K Scale Engine', icon: Sliders, badge: null },
    { to: '/integrator', label: 'Sandbox / Ingest', icon: Terminal, badge: 'RTSP' },
  ];

  const handleMobileNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden animate-fade-in"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 z-50 flex flex-col justify-between p-3 shadow-2xl transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        <div className="space-y-3 overflow-y-auto">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase">SCRB Command</div>
                <div className="text-[10px] text-emerald-400 font-mono">Gujarat Police VMS</div>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleMobileNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-white shadow-lg shadow-emerald-950/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <div className="flex items-center justify-between flex-1">
                        <span className="font-semibold tracking-wide">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase ${
                            item.alert 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Mobile Drawer Footer Modals */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              setShowPresentationModal(true);
              handleMobileNavClick();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/20 border border-purple-800/40 hover:bg-purple-900/30 transition"
          >
            <Layers className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>PITCH PRESENTATION</span>
          </button>
          <button
            onClick={() => {
              setShowGapModal(true);
              handleMobileNavClick();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/20 border border-cyan-800/40 hover:bg-cyan-900/30 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>COMPLIANCE MATRIX</span>
          </button>
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside 
        className={`hidden md:flex h-[calc(100vh-4rem)] bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex-col justify-between transition-all duration-300 z-30 select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
      {/* Navigation Group */}
      <div className="p-3 space-y-1">
        {/* State Command Indicator */}
        <div className={`mb-4 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            {!collapsed && (
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300">SCRB LIVE MESH</span>
            )}
          </div>
          {!collapsed && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              v2.6 PRO
            </span>
          )}
        </div>

        {/* Links */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-white shadow-lg shadow-emerald-950/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="font-semibold tracking-wide">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            item.alert 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Left Active Glow Indicator */}
                    {isActive && (
                      <span className="absolute -left-1 top-2 bottom-2 w-1.5 rounded-r-full bg-emerald-400 shadow-[0_0_12px_#10b981]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Section / Utility Modals & Collapse Button */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* Slide Deck Modal Button */}
        <button
          onClick={() => setShowPresentationModal(true)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/20 border border-purple-800/40 hover:bg-purple-900/30 transition ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Open Pitch Deck / Solution Slides"
        >
          <Layers className="w-4 h-4 text-purple-400 flex-shrink-0" />
          {!collapsed && <span>PITCH PRESENTATION</span>}
        </button>

        {/* Gap Analysis Button */}
        <button
          onClick={() => setShowGapModal(true)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/20 border border-cyan-800/40 hover:bg-cyan-900/30 transition ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Hackathon Deliverables & Readiness"
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          {!collapsed && <span>COMPLIANCE MATRIX</span>}
        </button>

        {/* Sidebar Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-2 py-2 flex items-center justify-center rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={collapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-1.5 text-[11px] font-mono"><ChevronLeft className="w-4 h-4" /> COLLAPSE</div>}
        </button>
      </div>
    </aside>
    </>
  );
}
