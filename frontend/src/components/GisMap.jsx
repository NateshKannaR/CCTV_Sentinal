import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix Leaflet default icon paths in bundled environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getDeptColor = (dept) => {
  if (dept.includes('Police')) return '#3b82f6'; // Blue
  if (dept.includes('RTO')) return '#eab308'; // Amber/Yellow
  if (dept.includes('Food')) return '#10b981'; // Green
  if (dept.includes('Municipal') || dept.includes('AMC') || dept.includes('SMC') || dept.includes('VMC') || dept.includes('RMC')) return '#a855f7'; // Purple
  return '#94a3b8'; // Grey/Private
};

export default function GisMap({ cameras, selectedCamera, onSelectCamera, activeRoute, showCoverage }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routeLayerGroupRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.8, 71.9],
      zoom: 7,
      minZoom: 6,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Tactical High-Contrast OpenStreetMap Basemap (No API Key Required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Gujarat Police Sentinel',
      maxZoom: 19
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Camera Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    cameras.forEach(cam => {
      const color = getDeptColor(cam.department);
      const isSelected = selectedCamera && selectedCamera.id === cam.id;
      const isOnline = cam.status === 'online';

      // Custom circular pulsing marker
      const customIcon = L.divIcon({
        className: 'custom-cam-pin',
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '26px' : '18px'};
            height: ${isSelected ? '26px' : '18px'};
            background-color: ${isOnline ? color : '#ef4444'};
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 ${isSelected ? '12px #38bdf8' : '6px rgba(0,0,0,0.5)'};
            transition: all 0.3s ease;
          ">
            ${isSelected ? `<span style="position: absolute; inset: -4px; border-radius: 50%; border: 2px dashed #38bdf8; animation: spin 4s linear infinite;"></span>` : ''}
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([cam.latitude, cam.longitude], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; min-width: 200px;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 14px; margin-bottom: 4px;">${cam.id}</div>
          <div style="font-weight: 600; color: #f3f4f6;">${cam.name}</div>
          <div style="color: #9ca3af; margin-bottom: 6px;">${cam.location_name} (${cam.district})</div>
          <div style="display: flex; gap: 4px; margin-bottom: 6px;">
            <span style="background: ${color}22; color: ${color}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">${cam.department}</span>
            <span style="background: ${isOnline ? '#065f46' : '#991b1b'}; color: ${isOnline ? '#34d399' : '#f87171'}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">${cam.status.toUpperCase()}</span>
          </div>
          <div style="font-size: 11px; color: #94a3b8;">Codec: <b>${cam.codec}</b> | Res: <b>${cam.resolution}</b> | Retention: <b>${cam.storage_retention_days}d</b></div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectCamera) onSelectCamera(cam);
      });

      markersGroupRef.current.addLayer(marker);

      // Coverage radius circle
      if (showCoverage) {
        const circle = L.circle([cam.latitude, cam.longitude], {
          radius: cam.coverage_radius_meters || 200,
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1
        });
        markersGroupRef.current.addLayer(circle);
      }
    });
  }, [cameras, selectedCamera, showCoverage, onSelectCamera]);

  // Render Active Target Vehicle Route (Evaluator Demonstration)
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current) return;
    routeLayerGroupRef.current.clearLayers();

    if (!activeRoute || !activeRoute.hops || activeRoute.hops.length === 0) return;

    const latlngs = activeRoute.hops.map(hop => [hop.latitude, hop.longitude]);

    // Animated glow polyline
    const routeLine = L.polyline(latlngs, {
      color: '#ef4444',
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round'
    });
    routeLayerGroupRef.current.addLayer(routeLine);

    // Numbered waypoint badges
    activeRoute.hops.forEach((hop, idx) => {
      const isLatest = idx === activeRoute.hops.length - 1;
      const hopIcon = L.divIcon({
        className: 'route-hop-badge',
        html: `
          <div style="
            width: 26px;
            height: 26px;
            background: ${isLatest ? '#dc2626' : '#1e293b'};
            border: 2px solid ${isLatest ? '#fca5a5' : '#ef4444'};
            color: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
          ">
            ${hop.sequence}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const hopMarker = L.marker([hop.latitude, hop.longitude], { icon: hopIcon });
      hopMarker.bindPopup(`
        <div style="font-size: 12px;">
          <div style="color: #ef4444; font-weight: bold; font-size: 13px;">Checkpoint #${hop.sequence} [${activeRoute.plate_number}]</div>
          <div><b>${hop.camera_name}</b></div>
          <div style="color: #9ca3af;">${hop.location_name}</div>
          <div style="margin-top: 4px;">Time: <b>${hop.timestamp}</b></div>
          <div>Speed: <b>${hop.speed_kmh} km/h</b> | Distance: <b>${hop.distance_km} km</b></div>
        </div>
      `);
      routeLayerGroupRef.current.addLayer(hopMarker);
    });

    // Fit map bounds to vehicle route
    if (latlngs.length > 1) {
      const bounds = L.latLngBounds(latlngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
    }
  }, [activeRoute]);

  // Center on selected camera if clicked from sidebar
  useEffect(() => {
    if (mapInstanceRef.current && selectedCamera) {
      mapInstanceRef.current.setView([selectedCamera.latitude, selectedCamera.longitude], 14, {
        animate: true,
        duration: 1.0
      });
    }
  }, [selectedCamera]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '520px' }} />

      {/* Map Legend Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-lg p-3 text-xs z-[1000] shadow-lg pointer-events-auto">
        <div className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Gujarat CCTV Registry (Model 1)
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Home (Police)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> RTO Gujarat
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Food & Civil Supplies
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Municipal Corp
          </div>
        </div>
        {activeRoute && (
          <div className="mt-2 pt-2 border-t border-slate-700/80 flex items-center gap-2 text-red-400 font-medium">
            <span className="w-3 h-1 bg-red-500 inline-block"></span>
            Active Trajectory: {activeRoute.plate_number}
          </div>
        )}
      </div>
    </div>
  );
}
