import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Eye, 
  Calendar, 
  ExternalLink, 
  Layers,
  Telescope as TelescopeIcon,
  CheckCircle2,
  Filter,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { OBSERVATORY_CONFIG } from '../config/observatory';
import { 
  calculateVisibleSkyObjects, 
  CONSTELLATION_LINES 
} from '../services/astronomyService';

interface TonightsSkyProps {
  onNavigatePage: (route: string) => void;
}

export const TonightsSky: React.FC<TonightsSkyProps> = ({ onNavigatePage }) => {
  const [skyData, setSkyData] = useState<ReturnType<typeof calculateVisibleSkyObjects> | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'planets-moon' | 'deep-sky' | 'stars'>('all');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pan & Zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Update sky ephemeris every 30 seconds
  useEffect(() => {
    const updateSky = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      const computed = calculateVisibleSkyObjects(now);
      setSkyData(computed);
    };

    updateSky();
    const interval = setInterval(updateSky, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered observable celestial targets based on category tab
  const filteredObservableTargets = useMemo(() => {
    if (!skyData) return [];
    const list = skyData.observableTargets;
    if (selectedCategory === 'all') return list;
    if (selectedCategory === 'planets-moon') return list.filter(t => t.type === 'planet' || t.type === 'moon');
    if (selectedCategory === 'deep-sky') return list.filter(t => t.type === 'nebula' || t.type === 'galaxy' || t.type === 'cluster');
    if (selectedCategory === 'stars') return list.filter(t => t.type === 'star' || t.type === 'double-star');
    return list;
  }, [skyData, selectedCategory]);

  // Prevent default wheel behavior on the canvas to stop page scrolling when zooming
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preventScroll = (e: Event) => {
      if (zoom > 1 || (e as globalThis.WheelEvent).deltaY < 0) {
        e.preventDefault();
      }
    };
    canvas.addEventListener('wheel', preventScroll, { passive: false });
    return () => canvas.removeEventListener('wheel', preventScroll);
  }, [zoom]);

  // Handle Pan & Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const newZoom = Math.min(Math.max(1, zoom - e.deltaY * 0.005), 4);
    if (newZoom === 1) {
      setOffset({ x: 0, y: 0 });
    }
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || zoom <= 1) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    
    // Boundary checks to prevent dragging out of view
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxOffset = (canvas.clientWidth * zoom - canvas.clientWidth) / 2;
    
    setOffset({
      x: Math.min(Math.max(newX, -maxOffset), maxOffset),
      y: Math.min(Math.max(newY, -maxOffset), maxOffset)
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (zoom <= 1) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
    e.preventDefault();
    const newX = e.touches[0].clientX - dragStart.current.x;
    const newY = e.touches[0].clientY - dragStart.current.y;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxOffset = (canvas.clientWidth * zoom - canvas.clientWidth) / 2;
    
    setOffset({
      x: Math.min(Math.max(newX, -maxOffset), maxOffset),
      y: Math.min(Math.max(newY, -maxOffset), maxOffset)
    });
  };

  // Render Open Sky Map on 2D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !skyData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-resolution rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Ensure we have a valid rect before setting canvas dimensions
    if (rect.width === 0 || rect.height === 0) return;
    
    // Set actual size in memory (scaled to account for extra pixel density).
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Normalize coordinate system to use css pixels.
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    
    // Base center point
    const baseCenterX = width / 2;
    const baseCenterY = height / 2;
    
    // Apply zoom and offset transformations
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    
    ctx.translate(baseCenterX + offset.x, baseCenterY + offset.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-baseCenterX, -baseCenterY);

    const centerX = baseCenterX;
    const centerY = baseCenterY;
    const radius = Math.min(width, height) / 2 - 36;

    // 1. Celestial Hemisphere Dome Background
    const domeGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    domeGradient.addColorStop(0, '#06102a'); // Slightly richer deep blue center
    domeGradient.addColorStop(0.4, '#040b1e');
    domeGradient.addColorStop(0.8, '#020612');
    domeGradient.addColorStop(1, '#000000');
    ctx.fillStyle = domeGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // 2. IAO Prime Observing Window Zone (35° to 65° altitude)
    const rInner65 = radius * (25 / 90);
    const rOuter35 = radius * (55 / 90);

    // Highlighted Annular Zone for IAO Prime Window
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, rOuter35, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY, rInner65, 0, 2 * Math.PI, true);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.fill();
    ctx.restore();

    // 3. Altitude Rings
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 1 / zoom; // Adjust line width based on zoom
    ctx.setLineDash([4 / zoom, 4 / zoom]);
    
    // 65° Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, rInner65, 0, 2 * Math.PI);
    ctx.stroke();

    // 35° Ring
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = 1.2 / zoom;
    ctx.setLineDash([5 / zoom, 4 / zoom]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, rOuter35, 0, 2 * Math.PI);
    ctx.stroke();

    // Horizon Circle (0° altitude)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1.5 / zoom;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Altitude Labels on Chart
    ctx.font = `${Math.max(9 / zoom, 6)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('65° (IAO Upper)', centerX, centerY - rInner65 - (2 / zoom));
    ctx.fillText('35° (IAO Prime)', centerX, centerY - rOuter35 - (2 / zoom));

    // Zenith crosshair (+)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 1 / zoom;
    ctx.beginPath();
    ctx.moveTo(centerX - 7 / zoom, centerY);
    ctx.lineTo(centerX + 7 / zoom, centerY);
    ctx.moveTo(centerX, centerY - 7 / zoom);
    ctx.lineTo(centerX, centerY + 7 / zoom);
    ctx.stroke();

    // Cardinal Directions on Horizon (N, E, S, W)
    const cardinals = [
      { label: 'N', angle: -Math.PI / 2 },
      { label: 'E', angle: 0 },
      { label: 'S', angle: Math.PI / 2 },
      { label: 'W', angle: Math.PI },
    ];

    ctx.font = `bold ${Math.max(12 / zoom, 8)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    cardinals.forEach(({ label, angle }) => {
      const cardX = centerX + (radius + 18 / zoom) * Math.cos(angle);
      const cardY = centerY + (radius + 18 / zoom) * Math.sin(angle);
      ctx.fillText(label, cardX, cardY);
    });

    const projectAltAz = (altDeg: number, azDeg: number) => {
      const r = radius * ((90 - Math.max(0, altDeg)) / 90);
      const theta = (azDeg - 90) * (Math.PI / 180);
      return {
        x: centerX + r * Math.cos(theta),
        y: centerY + r * Math.sin(theta),
      };
    };

    const starMapPos: Record<string, { x: number; y: number; isVisible: boolean }> = {};

    // 4. Draw Stars
    skyData.stars.forEach((star) => {
      if (star.altitude === undefined || star.azimuth === undefined) return;
      const pos = projectAltAz(star.altitude, star.azimuth);
      starMapPos[star.name] = { x: pos.x, y: pos.y, isVisible: star.isVisible };

      if (!star.isVisible) return;

      const baseStarRadius = Math.max(0.5, 3.5 - star.mag * 0.7);
      const starRadius = baseStarRadius / Math.sqrt(zoom); // slightly scale down relative to zoom

      // Enhanced star glow
      const glowRadius = starRadius * (star.mag < 1 ? 5 : 3);
      const starGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
      starGradient.addColorStop(0, star.spectralColor || '#ffffff');
      starGradient.addColorStop(0.2, (star.spectralColor || '#ffffff') + 'CC');
      starGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = starGradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, glowRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Solid core for bright stars
      if (star.mag < 2) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, starRadius * 0.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Label prominent stars
      if (star.mag < 1.4 || (star.isWithinWindow && zoom > 1.5)) {
        ctx.font = `${Math.max(9 / zoom, 5)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = star.isWithinWindow ? 'rgba(254, 240, 138, 0.9)' : 'rgba(203, 213, 225, 0.75)';
        ctx.textAlign = 'center';
        ctx.fillText(star.name, pos.x, pos.y + (starRadius + 6) / Math.sqrt(zoom));
      }
    });

    // 5. Draw Constellation Link Lines (more elegant)
    ctx.strokeStyle = 'rgba(126, 203, 247, 0.15)';
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([2 / zoom, 4 / zoom]);

    CONSTELLATION_LINES.forEach(([nameA, nameB]) => {
      const posA = starMapPos[nameA];
      const posB = starMapPos[nameB];
      if (posA && posB && posA.isVisible && posB.isVisible) {
        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);
        ctx.stroke();
      }
    });
    ctx.setLineDash([]);

    // 6. Draw Deep-Sky Objects
    skyData.deepSky.forEach((dso) => {
      if (dso.altitude === undefined || dso.azimuth === undefined || !dso.isVisible) return;
      const pos = projectAltAz(dso.altitude, dso.azimuth);

      const dsoRadius = 4 / Math.sqrt(zoom);

      // Distinct glyph for DSO (dashed ellipse/circle)
      ctx.strokeStyle = dso.isWithinWindow ? 'rgba(56, 189, 248, 0.8)' : 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.2 / zoom;
      ctx.setLineDash([2 / zoom, 2 / zoom]);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, dsoRadius + 2 / zoom, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = dso.isWithinWindow ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0.1)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, dsoRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Core point
      ctx.fillStyle = dso.isWithinWindow ? '#38bdf8' : 'rgba(56, 189, 248, 0.6)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 1 / zoom, 0, 2 * Math.PI);
      ctx.fill();

      // Label
      if (dso.isWithinWindow || zoom > 2) {
        ctx.font = `bold ${Math.max(9 / zoom, 5)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = '#7dd3fc';
        ctx.textAlign = 'center';
        ctx.fillText(dso.name, pos.x, pos.y + (dsoRadius + 8) / Math.sqrt(zoom));
      }
    });

    // 7. Draw Visible Planets
    skyData.planets.forEach((planet) => {
      if (planet.altitude === undefined || planet.azimuth === undefined || !planet.isVisible) return;
      const pos = projectAltAz(planet.altitude, planet.azimuth);
      
      const pRadius = 3.5 / Math.sqrt(zoom);

      // Planet glow ring
      ctx.strokeStyle = planet.color;
      ctx.lineWidth = (planet.isWithinWindow ? 1.5 : 1) / zoom;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pRadius + 2.5 / zoom, 0, 2 * Math.PI);
      ctx.stroke();

      // Planet Body
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Label
      ctx.font = `bold ${Math.max(10 / zoom, 6)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = planet.color;
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, pos.x, pos.y + (pRadius + 10) / Math.sqrt(zoom));
    });

    // 8. Draw Moon
    if (skyData.moon && skyData.moon.altitude !== undefined && skyData.moon.azimuth !== undefined && skyData.moon.isVisible) {
      const pos = projectAltAz(skyData.moon.altitude, skyData.moon.azimuth);
      const mRadius = 7 / Math.sqrt(zoom);

      // Moon glow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, mRadius + 5 / zoom, 0, 2 * Math.PI);
      ctx.fill();

      // Moon Body
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 10 / zoom;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, mRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.font = `bold ${Math.max(10 / zoom, 6)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(`Moon (${Math.round(skyData.moon.phaseFraction * 100)}%)`, pos.x, pos.y + (mRadius + 9) / Math.sqrt(zoom));
    }

    ctx.restore();
  }, [skyData, zoom, offset]);

  // Make sure we redraw if window is resized since canvas relies on getBoundingClientRect()
  useEffect(() => {
    const handleResize = () => {
      // Trigger a re-render of the canvas effect
      setSkyData(prev => prev ? { ...prev } : null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section 
      id="tonights-sky" 
      aria-labelledby="sky-heading"
      className="py-16 relative bg-[#040711] border-t border-slate-800/80 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header & Main CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 pb-6 border-b border-slate-800 gap-6">
          <div className="flex-1">
            <h2 id="sky-heading" className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Tonight's Sky Above IAO
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl">
              Real-time celestial positions filtered for IAO's usable <span className="text-gold-400 font-semibold">35°–65° observing window</span> and matched to available observatory telescope optics.
            </p>
          </div>

          {/* Prominent CTAs next to header */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={OBSERVATORY_CONFIG.VAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-gold-500/40 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-gold-400" />
              <span>View Live Moon & Sun on VAO</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>
            
            <button
              onClick={() => onNavigatePage('book-session')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 text-xs font-semibold text-[#040711] bg-gold-500 hover:bg-gold-400 rounded-xl shadow-[0_4px_18px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_24px_rgba(212,175,55,0.5)] transition-all duration-200 hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Session</span>
            </button>
          </div>
        </div>

        {/* Observatory Telemetry Status Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/70 backdrop-blur-sm border border-slate-800/90 text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e]" />
            <span className="text-slate-300 font-medium">IAO Prime Window:</span>
            <span className="px-2 py-0.5 rounded bg-gold-500/10 text-gold-300 border border-gold-500/30 font-mono text-[11px] font-semibold">
              35° – 65° Altitude
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Local Time: <strong className="text-white font-medium">{currentTimeStr}</strong></span>
            <span>Observable Targets: <strong className="text-emerald-400 font-medium">{skyData?.observableTargets.length || 0}</strong></span>
            <span>Coordinates: <strong className="text-slate-300 font-medium">{OBSERVATORY_CONFIG.coordinates.latitude}°N, {OBSERVATORY_CONFIG.coordinates.longitude}°E</strong></span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 7/12 Width: Observatory Sky Dome Projection Chart */}
          <div className="lg:col-span-7 glass-card-dark rounded-2xl p-4 sm:p-6 border border-slate-800 relative flex flex-col items-center justify-center shadow-2xl overflow-hidden backdrop-blur-md">
            
            {/* Sky Chart Header */}
            <div className="w-full flex items-center justify-between mb-4 z-10 relative">
              <div className="flex items-center gap-2">
                <div className="led-dot-green" />
                <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">
                  IAO Horizon View
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-900/80 border border-slate-700 rounded-lg p-0.5 mr-2 shadow-sm">
                  <button 
                    onClick={() => { setZoom(Math.max(1, zoom - 0.5)); if(zoom - 0.5 <= 1) setOffset({x:0, y:0}); }}
                    className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                    title="Zoom Out"
                    disabled={zoom <= 1}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-300 px-2 select-none w-[42px] text-center">{Math.round(zoom * 100)}%</span>
                  <button 
                    onClick={() => setZoom(Math.min(4, zoom + 0.5))}
                    className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                    title="Zoom In"
                    disabled={zoom >= 4}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <span className="inline-block w-2.5 h-2.5 rounded bg-gold-500/20 border border-gold-500/50" />
                  <span>35°–65° Zone</span>
                </div>
              </div>
            </div>

            {/* Sky Dome Canvas - High Res, Zoomable, Pannable */}
            <div className="relative w-full aspect-square max-w-[540px] mx-auto flex items-center justify-center overflow-hidden rounded-full border border-slate-700/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-[#02040a]">
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%' }}
                className={`touch-none ${zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
                role="region"
                aria-label="Night sky map above IAO showing current observable objects in 35-65 degree window"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUpOrLeave}
                onTouchCancel={handleMouseUpOrLeave}
              />
            </div>

            {/* Sky Map Legend */}
            <div className="w-full mt-5 flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 gap-2 relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_4px_#fff]" /> Stars
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_#fbbf24]" /> Planets
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_4px_#38bdf8]" /> Deep-Sky
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 shadow-[0_0_4px_#cbd5e1]" /> Moon
                </span>
              </div>
              <span className="font-mono text-[11px] flex flex-col items-end text-right">
                <span>Alt-Az Stereographic Projection</span>
                <span className="text-gold-400/80">Scroll to zoom, drag to pan</span>
              </span>
            </div>
          </div>

          {/* 5/12 Width: Visible Objects & IAO Telescope Recommendations */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Visible Objects Card */}
            <div className="glass-card-dark rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
              
              {/* Header & Filter Pills */}
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gold-400" />
                  <span>Visible Objects</span>
                </h3>

                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {filteredObservableTargets.length} in 35°–65° Window
                </span>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-1.5 mb-4 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gold-500 text-[#040711] font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Targets
                </button>
                <button
                  onClick={() => setSelectedCategory('planets-moon')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                    selectedCategory === 'planets-moon'
                      ? 'bg-gold-500 text-[#040711] font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Planets & Moon
                </button>
                <button
                  onClick={() => setSelectedCategory('deep-sky')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                    selectedCategory === 'deep-sky'
                      ? 'bg-gold-500 text-[#040711] font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Deep-Sky
                </button>
                <button
                  onClick={() => setSelectedCategory('stars')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                    selectedCategory === 'stars'
                      ? 'bg-gold-500 text-[#040711] font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Stars & Doubles
                </button>
              </div>

              {/* Observable Objects List */}
              {filteredObservableTargets.length === 0 ? (
                <div className="p-5 text-center rounded-xl bg-slate-900/50 border border-slate-800/80 my-2">
                  <Filter className="w-6 h-6 text-slate-500 mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-slate-300 font-medium mb-1">
                    No targets in this category currently between 35°–65°.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Check "All Targets" to view currently observable celestial objects across other categories.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredObservableTargets.map((target) => {
                    const isSelected = selectedTargetId === target.id;

                    return (
                      <div 
                        key={target.id}
                        onClick={() => setSelectedTargetId(isSelected ? null : target.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900/95 border-gold-500/60 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Top Row: Name, Category, Alt/Az */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white font-serif-display">
                                {target.name}
                              </span>
                              {target.catalogId && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  {target.catalogId}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-gold-400 font-medium">
                                {target.categoryLabel}
                              </span>
                              {target.constellation && (
                                <span className="text-[10px] text-slate-400">
                                  • {target.constellation}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-mono">
                                • Mag {target.mag}
                              </span>
                            </div>
                          </div>

                          {/* Coordinates */}
                          <div className="text-right text-[11px] font-mono shrink-0">
                            <div className="text-emerald-400 font-semibold">Alt {target.altitude}°</div>
                            <div className="text-slate-400">Az {target.azimuth}°</div>
                          </div>
                        </div>

                        {/* Telescope Suitability Box */}
                        <div className="mt-2.5 p-2.5 rounded-lg bg-[#040918] border border-gold-500/25 space-y-1.5 shadow-inner">
                          <div className="flex items-start gap-1.5">
                            <TelescopeIcon className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="text-slate-400 font-medium">Best Telescope: </span>
                              <strong className="text-gold-300 font-semibold">{target.bestTelescope}</strong>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed pl-5 font-normal">
                            {target.telescopeReason}
                          </p>

                          {target.compatibleTelescopes.length > 0 && (
                            <div className="text-[10px] text-slate-400 pl-5 pt-1 border-t border-slate-800/60 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>Also observable on: <strong className="text-slate-300 font-medium">{target.compatibleTelescopes.join(', ')}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Target Description */}
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                          {target.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
          </div>

        </div>

      </div>
    </section>
  );
};
