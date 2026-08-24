import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  Calendar,
  Cloud,
  Wind,
  Thermometer,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { calculateMoonData } from '../services/astronomyService';
import { fetchLiveObservatoryWeather } from '../services/weatherService';
import { MoonCalculation, WeatherData } from '../types';

interface HeroProps {
  onNavigatePage: (route: string) => void;
}

// TEMPORARY WEATHER VISUAL PREVIEW
// Set to null to use real live weather.
// Options: 'clear' | 'partly-cloudy' | 'overcast' | 'rain' | 'thunderstorm' | 'fog'
const WEATHER_PREVIEW: 
  | 'clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'rain'
  | 'thunderstorm'
  | 'fog'
  | null = null; //Change to temporarily preview specific weather conditions for development/testing purposes. Set to null for live weather.

/**
 * Realistic Animated Atmospheric Weather Scene
 * Dynamically reacts to live weatherCode, cloudCover, windSpeed, and temperature.
 */
const WeatherSceneVisual: React.FC<{ weather: WeatherData }> = ({ weather }) => {
  const preview: Record<string, { code: number; cloud: number }> = {
    clear: { code: 0, cloud: 0 },
    'partly-cloudy': { code: 2, cloud: 50 },
    overcast: { code: 3, cloud: 90 },
    rain: { code: 61, cloud: 90 },
    thunderstorm: { code: 95, cloud: 95 },
    fog: { code: 45, cloud: 80 },
  };

  const activePreview = WEATHER_PREVIEW ? preview[WEATHER_PREVIEW] : null;
  const code = activePreview ? activePreview.code : weather.weatherCode;
  const cloud = activePreview ? activePreview.cloud : weather.cloudCover;

  const isRain = code >= 50 && code < 90;
  const isThunder = code >= 95;
  const isFog = code === 45 || code === 48;
  const isOvercast = cloud > 65 || code === 3;
  const isPartlyCloudy = (cloud > 20 && cloud <= 65) || code === 2 || code === 1;
  const isClear = cloud <= 20 && code <= 1 && !isRain && !isThunder && !isFog;

  // Stable random rain streaks - increased density and full downward sweep
  const rainDrops = useMemo(() => {
    const drops = [];
    for (let i = 0; i < 34; i++) {
      drops.push({
        id: i,
        left: `${(i * 3.0 + Math.random() * 2.5).toFixed(1)}%`,
        delay: `${(Math.random() * 0.9).toFixed(2)}s`,
        duration: `${(0.48 + Math.random() * 0.32).toFixed(2)}s`,
        opacity: (0.6 + Math.random() * 0.38).toFixed(2),
        height: `${Math.floor(Math.random() * 14 + 16)}px`,
      });
    }
    return drops;
  }, []);

  // Stable random stars for clear/partly cloudy nights - enhanced with more variety and prominence
  const stars = useMemo(() => {
    const s = [];
    for (let i = 0; i < 35; i++) {
      const sizeCategory = Math.random();
      let size, glowIntensity, brightness;
      
      if (sizeCategory < 0.15) {
        // Very bright prominent stars
        size = 3.5 + Math.random() * 2;
        glowIntensity = 12;
        brightness = 1;
      } else if (sizeCategory < 0.35) {
        // Medium bright stars
        size = 2.2 + Math.random() * 1.3;
        glowIntensity = 6;
        brightness = 0.95;
      } else if (sizeCategory < 0.6) {
        // Small bright stars
        size = 1.5 + Math.random() * 0.8;
        glowIntensity = 3;
        brightness = 0.85;
      } else {
        // Tiny background stars
        size = 1 + Math.random() * 0.5;
        glowIntensity = 1.5;
        brightness = 0.7;
      }
      
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.15) {
        color = '#fef08a'; // Warm yellow
      } else if (colorChoice < 0.3) {
        color = '#bfdbfe'; // Cool blue
      } else if (colorChoice < 0.4) {
        color = '#fecaca'; // Slight red tint
      } else {
        color = '#ffffff'; // Pure white
      }
      
      s.push({
        id: i,
        top: `${Math.floor(Math.random() * 78 + 4)}%`,
        left: `${Math.floor(Math.random() * 90 + 5)}%`,
        size,
        glowIntensity,
        brightness,
        delay: `${(Math.random() * 5).toFixed(1)}s`,
        duration: `${(2 + Math.random() * 3).toFixed(1)}s`,
        color,
      });
    }
    return s;
  }, []);

  // Render purely as a scene layer block — no outer container, no labels.
  // Parent card wraps this in an absolute-positioned overlay.
  return (
    <>
      {/* ── 1. CLEAR SKY SCENE ─────────────────────────────────────────────── */}
      {isClear && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#010208] via-[#020818] to-[#040d28]" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-4 left-2 w-28 h-28 bg-indigo-500/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute top-8 right-8 w-20 h-20 bg-violet-500/10 rounded-full blur-lg pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none">
            {stars.map((star) => (
              <span
                key={star.id}
                className="absolute rounded-full anim-weather-twinkle"
                style={{
                  top: star.top,
                  left: star.left,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  boxShadow: `0 0 ${star.glowIntensity}px ${star.color}, 0 0 ${star.glowIntensity * 2}px ${star.color}40`,
                  opacity: star.brightness,
                  animationDelay: star.delay,
                  animationDuration: star.duration,
                }}
              />
            ))}
          </div>
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none" />
        </>
      )}

      {/* ── 2. PARTLY CLOUDY SCENE ────────────────────────────────────────── */}
      {isPartlyCloudy && !isRain && !isThunder && !isFog && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#030914] via-[#061022] to-[#0a1a32]" />
          <div className="absolute inset-0 pointer-events-none opacity-80">
            {stars.slice(0, 18).map((star) => (
              <span
                key={star.id}
                className="absolute rounded-full anim-weather-twinkle"
                style={{
                  top: star.top,
                  left: star.left,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  boxShadow: `0 0 ${star.glowIntensity}px ${star.color}, 0 0 ${star.glowIntensity * 2}px ${star.color}40`,
                  opacity: star.brightness * 0.8,
                  animationDelay: star.delay,
                  animationDuration: star.duration,
                }}
              />
            ))}
          </div>
          <div className="absolute -top-3 left-0 w-[180%] h-28 opacity-55 blur-sm anim-weather-cloud-slow pointer-events-none">
            <svg viewBox="0 0 320 120" className="w-full h-full fill-slate-400">
              <path d="M10,75 C20,55 45,45 68,52 C82,32 110,24 135,32 C155,16 188,18 210,34 C230,22 258,26 275,44 C295,48 312,65 310,85 C305,102 20,102 10,75 Z" />
            </svg>
          </div>
          <div className="absolute top-5 -left-10 w-[170%] h-32 opacity-80 blur-[2px] anim-weather-cloud-fast pointer-events-none">
            <svg viewBox="0 0 320 120" className="w-full h-full fill-slate-300">
              <path d="M15,80 C25,60 52,50 78,58 C95,36 128,28 155,38 C178,20 215,22 240,40 C262,28 292,34 308,56 C320,70 315,92 295,100 C270,105 30,105 15,80 Z" />
            </svg>
          </div>
          <div className="absolute top-11 -left-5 w-[160%] h-24 opacity-65 blur-md anim-weather-cloud-slow pointer-events-none" style={{ animationDelay: '4s' }}>
            <svg viewBox="0 0 320 120" className="w-full h-full fill-slate-500">
              <path d="M30,75 C45,55 75,48 98,58 C115,40 145,35 170,44 C190,30 222,32 245,48 C265,38 290,44 305,62 C312,78 20,95 30,75 Z" />
            </svg>
          </div>
        </>
      )}

      {/* ── 3. OVERCAST / CLOUDY SCENE ────────────────────────────────────── */}
      {isOvercast && !isRain && !isThunder && !isFog && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a101e] via-[#121e33] to-[#1a2a42]" />
          <div className="absolute top-0 left-1/4 w-32 h-24 bg-slate-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-4 -left-6 w-[200%] h-32 opacity-70 blur-md anim-weather-cloud-slow pointer-events-none">
            <svg viewBox="0 0 340 120" className="w-full h-full fill-slate-500">
              <path d="M5,65 C18,42 48,32 75,40 C95,18 132,10 162,20 C188,6 225,8 252,26 C278,12 312,18 330,42 C342,60 338,82 320,95 C295,105 20,105 5,65 Z" />
            </svg>
          </div>
          <div className="absolute top-4 -left-12 w-[190%] h-36 opacity-90 blur-[3px] anim-weather-cloud-fast pointer-events-none">
            <svg viewBox="0 0 340 120" className="w-full h-full fill-slate-400">
              <path d="M12,72 C28,48 60,38 88,46 C110,24 148,16 178,28 C205,12 242,16 268,34 C292,20 325,28 338,52 C348,72 335,95 310,102 C280,108 25,108 12,72 Z" />
            </svg>
          </div>
          <div className="absolute top-10 -left-8 w-[180%] h-28 opacity-75 blur-sm anim-weather-cloud-slow pointer-events-none" style={{ animationDelay: '3s' }}>
            <svg viewBox="0 0 340 120" className="w-full h-full fill-slate-400">
              <path d="M25,68 C42,46 72,38 98,48 C120,28 155,22 182,34 C208,20 242,24 266,42 C288,30 318,38 330,60 C338,78 30,100 25,68 Z" />
            </svg>
          </div>
          <div className="absolute top-16 -left-4 w-[170%] h-28 opacity-85 blur-md anim-weather-cloud-fast pointer-events-none" style={{ animationDelay: '5s' }}>
            <svg viewBox="0 0 340 120" className="w-full h-full fill-slate-500">
              <path d="M15,75 C32,52 65,44 92,54 C115,34 150,28 178,40 C202,26 238,30 260,48 C282,36 312,44 325,66 C332,84 25,104 15,75 Z" />
            </svg>
          </div>
          <div className="absolute bottom-0 -left-8 w-[160%] h-20 opacity-60 blur-sm pointer-events-none">
            <div className="w-full h-full bg-gradient-to-t from-slate-900 via-slate-800/80 to-transparent" />
          </div>
        </>
      )}

      {/* ── 4. RAIN SCENE ─────────────────────────────────────────────────── */}
      {isRain && !isThunder && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#040813] via-[#081326] to-[#0c1c36]" />
          
          {/* Organic Layered Storm Clouds concentrated at upper & right area */}
          <div className="absolute -top-6 -right-4 w-[150%] h-36 opacity-75 blur-md anim-weather-cloud-slow pointer-events-none">
            <svg viewBox="0 0 340 120" className="w-full h-full fill-slate-700">
              <path d="M20,65 C35,42 68,34 95,44 C118,22 155,15 185,26 C212,12 250,15 278,32 C302,18 335,26 348,50 C358,70 345,95 315,102 C285,108 30,108 20,65 Z" />
            </svg>
          </div>
          <div className="absolute -top-3 right-0 w-[130%] h-32 opacity-85 blur-[2.5px] anim-weather-cloud-fast pointer-events-none" style={{ animationDelay: '2s' }}>
            <svg viewBox="0 0 320 120" className="w-full h-full fill-slate-600">
              <path d="M40,68 C58,45 88,38 115,48 C138,28 172,22 198,34 C222,20 258,24 280,42 C302,30 330,40 340,62 C348,80 50,100 40,68 Z" />
            </svg>
          </div>
          <div className="absolute top-2 right-4 w-[110%] h-28 opacity-90 blur-[1.5px] anim-weather-cloud-slow pointer-events-none" style={{ animationDelay: '4s' }}>
            <svg viewBox="0 0 300 110" className="w-full h-full fill-slate-500">
              <path d="M50,62 C68,42 95,36 120,45 C142,26 175,22 198,32 C220,18 252,22 272,38 C290,28 318,36 328,56 C335,74 60,94 50,62 Z" />
            </svg>
          </div>

          {/* Extended Rain Streaks falling continuously across the entire card height */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden transform -rotate-12 scale-115">
            {rainDrops.map((drop) => (
              <span
                key={drop.id}
                className="absolute w-[1.5px] rounded-full anim-weather-rain bg-gradient-to-b from-transparent via-cyan-300 to-cyan-100 shadow-[0_0_2px_rgba(165,243,252,0.8)]"
                style={{
                  left: drop.left,
                  height: drop.height,
                  opacity: drop.opacity,
                  animationDelay: drop.delay,
                  animationDuration: drop.duration,
                }}
              />
            ))}
          </div>

          {/* Bottom Ground Rain Mist / Splash Haze */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-cyan-950/60 via-slate-900/40 to-transparent blur-xs pointer-events-none" />
        </>
      )}

      {/* ── 5. THUNDERSTORM SCENE ─────────────────────────────────────────── */}
      {isThunder && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#02040b] via-[#050b18] to-[#091224]" />
          
          {/* Deep Organic Storm Cloud Formations */}
          <div className="absolute -top-8 -right-6 w-[160%] h-44 opacity-95 blur-md anim-weather-cloud-slow pointer-events-none">
            <svg viewBox="0 0 360 140" className="w-full h-full fill-slate-900">
              <path d="M10,75 C25,48 60,38 90,50 C115,24 158,16 190,30 C220,12 265,16 298,36 C325,20 360,30 375,58 C388,80 375,110 340,120 C300,128 20,128 10,75 Z" />
            </svg>
          </div>
          <div className="absolute -top-4 right-0 w-[140%] h-38 opacity-90 blur-[2.5px] anim-weather-cloud-fast pointer-events-none" style={{ animationDelay: '2s' }}>
            <svg viewBox="0 0 340 130" className="w-full h-full fill-slate-800">
              <path d="M30,72 C48,46 82,38 112,50 C138,28 178,20 208,34 C235,18 275,22 300,42 C325,28 358,38 370,64 C378,85 40,115 30,72 Z" />
            </svg>
          </div>
          <div className="absolute top-2 right-4 w-[115%] h-32 opacity-85 blur-[1.5px] anim-weather-cloud-slow pointer-events-none" style={{ animationDelay: '4s' }}>
            <svg viewBox="0 0 320 120" className="w-full h-full fill-slate-700">
              <path d="M45,65 C62,42 95,35 122,46 C145,26 182,20 208,32 C232,16 268,20 290,38 C310,26 340,34 350,56 C358,75 55,102 45,65 Z" />
            </svg>
          </div>

          {/* Atmospheric Flash Overlay only (NO physical lightning bolt SVG strikes) */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/90 via-indigo-200/60 to-purple-300/30 pointer-events-none anim-weather-lightning mix-blend-screen" />
          
          {/* Dense Torrential Rain Streaks falling all the way to base */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden transform -rotate-12 scale-115">
            {rainDrops.map((drop) => (
              <span
                key={drop.id}
                className="absolute w-[1.5px] rounded-full anim-weather-rain bg-gradient-to-b from-transparent via-cyan-200 to-white shadow-[0_0_3px_rgba(255,255,255,0.9)]"
                style={{
                  left: drop.left,
                  height: `${parseInt(drop.height) + 6}px`,
                  opacity: drop.opacity,
                  animationDelay: drop.delay,
                  animationDuration: `${(parseFloat(drop.duration) * 0.8).toFixed(2)}s`,
                }}
              />
            ))}
          </div>

          {/* Heavy Bottom Splash Mist */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent pointer-events-none" />
        </>
      )}

      {/* ── 6. FOG / MIST SCENE ───────────────────────────────────────────── */}
      {isFog && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#080f1e] via-[#101828] to-[#16202e]" />
          {/* Background fog layer - deep, slow moving */}
          <div className="absolute inset-x-0 top-2 h-20 bg-gradient-to-r from-slate-400/30 via-slate-200/50 to-slate-400/30 rounded-full blur-xl anim-weather-fog pointer-events-none" />
          {/* Mid fog layer - slightly faster, more visible */}
          <div
            className="absolute inset-x-0 top-8 h-24 bg-gradient-to-r from-slate-400/45 via-slate-200/65 to-slate-400/45 rounded-full blur-2xl anim-weather-fog pointer-events-none"
            style={{ animationDelay: '3s', animationDuration: '20s' }}
          />
          {/* Upper fog layer - prominent, creating depth */}
          <div
            className="absolute inset-x-0 top-16 h-28 bg-gradient-to-r from-slate-300/55 via-slate-100/75 to-slate-300/55 rounded-full blur-2xl anim-weather-fog pointer-events-none"
            style={{ animationDelay: '5s', animationDuration: '16s' }}
          />
          {/* Lower foreground fog - very visible, faster movement */}
          <div
            className="absolute inset-x-0 bottom-4 h-32 bg-gradient-to-r from-slate-400/60 via-slate-200/80 to-slate-400/60 rounded-full blur-2xl anim-weather-fog pointer-events-none"
            style={{ animationDelay: '2s', animationDuration: '14s' }}
          />
          {/* Bottom dense fog layer - heaviest opacity */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-r from-slate-500/50 via-slate-300/70 to-slate-500/50 rounded-full blur-3xl anim-weather-fog pointer-events-none"
            style={{ animationDelay: '8s', animationDuration: '22s' }}
          />
          {/* Additional mist strips for depth */}
          <div
            className="absolute inset-x-0 top-24 h-16 bg-gradient-to-r from-slate-400/40 via-slate-200/60 to-slate-400/40 rounded-full blur-lg anim-weather-fog pointer-events-none"
            style={{ animationDelay: '6s', animationDuration: '18s' }}
          />
          <div
            className="absolute inset-x-0 bottom-8 h-20 bg-gradient-to-r from-slate-500/35 via-slate-300/55 to-slate-500/35 rounded-full blur-xl anim-weather-fog pointer-events-none"
            style={{ animationDelay: '10s', animationDuration: '24s' }}
          />
        </>
      )}
    </>
  );
};

/**
 * Geometrically accurate SVG Moon Phase Visual based on live astronomical ephemeris.
 * Renders the clean Moon sphere directly with authentic lunar surface features and precise terminator geometry.
 */
const MoonPhaseVisual: React.FC<{ moon: MoonCalculation }> = ({ moon }) => {
  const { illuminationPercentage, phaseName, phaseAngleDegrees, isWaxing: moonIsWaxing } = moon;

  // Authoritative physical signal: 0° to 180° = Waxing (Sun to West, right-side illuminated in Northern Hemisphere)
  // 180° to 360° = Waning (Sun to East, left-side illuminated in Northern Hemisphere)
  const isWaxing = typeof moonIsWaxing === 'boolean'
    ? moonIsWaxing
    : (typeof phaseAngleDegrees === 'number'
        ? (phaseAngleDegrees > 0 && phaseAngleDegrees < 180)
        : (phaseName.includes('Waxing') || phaseName.includes('First Quarter')));

  const frac = Math.max(0, Math.min(1, illuminationPercentage / 100));
  const isFullMoon = phaseName === 'Full Moon' || frac >= 0.99;
  const isNewMoon = phaseName === 'New Moon' || frac <= 0.01;

  const r = 40;
  const cx = 44;
  const cy = 44;
  const size = 88;

  // Terminator semi-minor axis: r * |2 * frac - 1|
  const terminatorRx = Math.max(0.01, r * Math.abs(2 * frac - 1));

  const topX = cx;
  const topY = cy - r;
  const botX = cx;
  const botY = cy + r;

  let illuminatedPath = '';

  if (!isNewMoon) {
    if (isFullMoon) {
      illuminatedPath = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
    } else if (isWaxing) {
      // Right side illuminated (outer right semicircle from top to bottom, sweep = 1)
      if (frac < 0.5) {
        // Waxing Crescent: terminator is to the right of center (sweep = 0 from bottom to top)
        illuminatedPath = `M ${topX} ${topY} A ${r} ${r} 0 0 1 ${botX} ${botY} A ${terminatorRx} ${r} 0 0 0 ${topX} ${topY} Z`;
      } else {
        // Waxing Gibbous & First Quarter: terminator is to the left of center (sweep = 1 from bottom to top)
        illuminatedPath = `M ${topX} ${topY} A ${r} ${r} 0 0 1 ${botX} ${botY} A ${terminatorRx} ${r} 0 0 1 ${topX} ${topY} Z`;
      }
    } else {
      // Left side illuminated (outer left semicircle from top to bottom, sweep = 0)
      if (frac < 0.5) {
        // Waning Crescent: terminator is to the left of center (sweep = 1 from bottom to top)
        illuminatedPath = `M ${topX} ${topY} A ${r} ${r} 0 0 0 ${botX} ${botY} A ${terminatorRx} ${r} 0 0 1 ${topX} ${topY} Z`;
      } else {
        // Waning Gibbous & Third Quarter: terminator is to the right of center (sweep = 0 from bottom to top)
        illuminatedPath = `M ${topX} ${topY} A ${r} ${r} 0 0 0 ${botX} ${botY} A ${terminatorRx} ${r} 0 0 0 ${topX} ${topY} Z`;
      }
    }
  }

  // Directional lighting origin matching the illuminated lunar limb
  const lightCx = isFullMoon ? '50%' : isWaxing ? '62%' : '38%';

  return (
    <div
      className="relative shrink-0 select-none flex items-center justify-center"
      aria-label={`Moon phase: ${phaseName}, ${illuminationPercentage}% illuminated`}
    >
      {/* Clean Moon SVG Sphere (no wrapper box) */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-14 h-14 sm:w-16 sm:h-16 relative z-10 drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <clipPath id="moon-clip">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
          <radialGradient id="lit-grad" cx={lightCx} cy="38%" r="62%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#f1f5f9" />
            <stop offset="70%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          <radialGradient id="limb-dark" cx="50%" cy="50%" r="50%">
            <stop offset="68%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
          </radialGradient>
        </defs>

        {/* Dark lunar body layer */}
        <circle cx={cx} cy={cy} r={r} fill="#080b18" />

        {/* Dark-side surface topography / subtle earthshine */}
        <g clipPath="url(#moon-clip)" opacity="0.25">
          <ellipse cx={34} cy={30} rx={10} ry={7} fill="#1a2244" />
          <ellipse cx={52} cy={48} rx={8} ry={6} fill="#1a2244" />
          <ellipse cx={26} cy={52} rx={6} ry={5} fill="#161e3a" />
          <ellipse cx={58} cy={24} rx={5} ry={4} fill="#161e3a" />
          <circle cx={38} cy={38} r={3.5} fill="#131a33" />
        </g>

        {/* Illuminated portion with high-resolution lunar maria and craters */}
        {illuminatedPath && (
          <g clipPath="url(#moon-clip)">
            <path d={illuminatedPath} fill="url(#lit-grad)" />
            {/* Lunar Maria (Oceanus Procellarum, Mare Imbrium, Mare Serenitatis, Mare Tranquillitatis) */}
            <ellipse cx={34} cy={30} rx={10} ry={7} fill="#64748b" opacity="0.32" />
            <ellipse cx={52} cy={48} rx={8} ry={6} fill="#64748b" opacity="0.26" />
            <ellipse cx={26} cy={52} rx={6} ry={5} fill="#64748b" opacity="0.22" />
            <ellipse cx={58} cy={24} rx={5} ry={4} fill="#64748b" opacity="0.24" />
            {/* Prominent Crater Formations (Tycho, Copernicus, Kepler) */}
            <circle cx={38} cy={38} r={3.5} fill="none" stroke="#475569" strokeWidth="0.6" opacity="0.45" />
            <circle cx={38} cy={38} r={0.9} fill="#475569" opacity="0.25" />
            <circle cx={30} cy={24} r={2.5} fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.4" />
            <circle cx={52} cy={42} r={2} fill="none" stroke="#475569" strokeWidth="0.45" opacity="0.35" />
            <circle cx={46} cy={30} r={1.5} fill="none" stroke="#64748b" strokeWidth="0.4" opacity="0.32" />
            <circle cx={24} cy={40} r={1.8} fill="none" stroke="#475569" strokeWidth="0.4" opacity="0.35" />
            <circle cx={42} cy={54} r={1.2} fill="none" stroke="#64748b" strokeWidth="0.35" opacity="0.28" />
            {/* Spherical 3D limb shading overlay */}
            <path d={illuminatedPath} fill="url(#limb-dark)" />
          </g>
        )}

        {/* Outer Lunar Rim Accents */}
        <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r + 1.2} fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="1.8" />
      </svg>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ onNavigatePage }) => {
  const [moonData, setMoonData] = useState<MoonCalculation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    const update = () => setMoonData(calculateMoonData(new Date()));
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setWeatherLoading(true);
        const d = await fetchLiveObservatoryWeather();
        if (mounted) { setWeatherData(d); setWeatherError(false); }
      } catch {
        if (mounted) setWeatherError(true);
      } finally {
        if (mounted) setWeatherLoading(false);
      }
    })();
    const t = setInterval(async () => {
      try {
        const d = await fetchLiveObservatoryWeather();
        if (mounted) { setWeatherData(d); setWeatherError(false); }
      } catch { if (mounted) setWeatherError(true); }
    }, 15 * 60_000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const handleScrollToSky = () => {
    document.getElementById('tonights-sky')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      aria-label="Observatory Hero Presentation"
      className="relative isolate min-h-[100vh] flex flex-col justify-between overflow-hidden bg-transparent pt-24 md:pt-32 pb-14"
    >
    <img
      src="/images/foreground.png"
      alt=""
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 z-10 w-full h-full object-contain object-bottom pointer-events-none"
    />
      {/* Background Gradient & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
       <div className="absolute inset-0 bg-gradient-to-b from-[#020409]/40 via-[#060b1c]/30 via-60% to-[#040711]/40" />
       <div className="absolute top-[12%] left-[25%] w-[480px] h-[280px] bg-blue-900/10 rounded-full blur-[100px]" />
       <div className="absolute top-[18%] right-[20%] w-[380px] h-[240px] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Institute of Space Technology • Islamabad • Pakistan</span>
        </div>

        {/* Hero Headings: "Welcome to IAO" + Largest: "IST Astronomical Observatory" on one line where width allows */}
        <div className="mb-5 text-center">
          <span className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light block mb-1.5 tracking-wide">
            Welcome to IAO
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gold-400 leading-tight sm:whitespace-nowrap">
            IST Astronomical Observatory
          </h1>
        </div>

        {/* Subheading */}
        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8">
          Plan your night at IST — see live sky conditions and book a guided observation session.
        </p>

        {/* CTAs - Standardized Button Design */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleScrollToSky}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-[#040711] bg-gold-500 hover:bg-gold-400 rounded-xl shadow-[0_4px_18px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_24px_rgba(212,175,55,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore Tonight's Sky</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigatePage('book-session')}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-[#040711] bg-gold-500 hover:bg-gold-400 rounded-xl shadow-[0_4px_18px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_24px_rgba(212,175,55,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Book a Session</span>
          </button>
        </div>
      </div>

      {/* Live Information Cards: Weather (left) · Moon (right) — compact, equal height, edge-positioned */}
      <div className="relative z-20 w-full px-3 sm:px-5 lg:px-8 mt-6 flex items-stretch justify-between gap-4 pointer-events-none">

        {/* ── 1. Live Weather Card — LEFT ─────────────────────────────── */}
        {/* Card is relative+overflow-hidden so WeatherSceneVisual renders as its background */}
        <div className="glass-card-dark rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between w-full max-w-[250px] pointer-events-auto shrink-0 relative overflow-hidden">

          {/* Weather scene as integrated card background */}
          {weatherData && (
            <div className="absolute inset-0 z-0 opacity-45">
              <WeatherSceneVisual weather={weatherData} />
            </div>
          )}
          {/* Dark scrim so text stays readable over the animated scene */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#040813]/85 via-[#040813]/65 to-[#040813]/90 pointer-events-none" />

          {/* Card content sits above the background */}
          <div className="relative z-10 p-3 flex-1 flex flex-col justify-between">
            {/* Header: two-line layout to prevent clipping */}
            <div className="mb-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className={weatherData && weatherData.cloudCover <= 35 ? 'led-dot-green' : 'led-dot'} />
                <h3 className="text-[10px] font-semibold tracking-wide text-white uppercase font-sans">Live Weather</h3>
              </div>
              <div className="text-[8.5px] font-mono text-slate-400 tracking-wider pl-3.5">IAO, IST, Islamabad</div>
            </div>

            {weatherLoading ? (
              <div className="py-4 flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-slate-400">Fetching telemetry...</span>
              </div>
            ) : weatherError || !weatherData ? (
              <div className="py-4 text-[10px] text-slate-400 italic text-center">Live conditions temporarily unavailable</div>
            ) : (
              /* Telemetry stack — compact on the left, condition box removed */
              <div className="flex flex-col gap-1.5 my-auto">
                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 w-fit min-w-[124px]">
                  <Thermometer className="w-3 h-3 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[8px] uppercase text-slate-400 font-medium leading-none">Temp</div>
                    <div className="text-[10px] font-medium text-slate-200">{weatherData.temperature}°C</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 w-fit min-w-[124px]">
                  <Cloud className="w-3 h-3 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[8px] uppercase text-slate-400 font-medium leading-none">Cloud Cover</div>
                    <div className="text-[10px] font-medium text-slate-200">{weatherData.cloudCover}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 w-fit min-w-[124px]">
                  <Wind className="w-3 h-3 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[8px] uppercase text-slate-400 font-medium leading-none">Wind Speed</div>
                    <div className="text-[10px] font-medium text-slate-200">{weatherData.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Status & Subtle Condition Text at bottom-right */}
          {weatherData && (
            <div className="relative z-10 flex items-center justify-between px-3 pb-2.5 pt-2 border-t border-slate-700/60">
              {weatherData.cloudCover > 35 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-rose-950/70 text-rose-300 border border-rose-500/40 shrink-0">
                  Sessions not possible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shrink-0">
                  Clear for observation
                </span>
              )}
              
              {/* Unobtrusive condition text + source link at bottom-right */}
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] font-medium text-slate-200 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {weatherData.conditionText}
                </span>
                <a
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[8.5px] text-slate-400 hover:text-gold-400 transition-colors inline-flex items-center gap-0.5 font-mono"
                >
                  <span>Open-Meteo</span>
                  <ExternalLink className="w-2 h-2 opacity-70" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ── 2. Tonight's Moon Card — RIGHT ──────────────────────────── */}
        <div className="glass-card-dark rounded-xl p-3 border border-slate-800 shadow-xl flex flex-col justify-between w-full max-w-[250px] pointer-events-auto shrink-0">

          {/* Header: stacked to avoid clipping */}
          <div className="mb-2.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className={moonData?.isWithinHeroWindow ? 'led-dot-green' : 'led-dot'} />
              <h3 className="text-[10px] font-semibold tracking-wide text-white uppercase font-sans">Tonight's Moon</h3>
            </div>
            <div className="text-[8.5px] font-mono text-slate-400 tracking-wider pl-3.5">
              {moonData ? `${moonData.phaseName} · ${moonData.illuminationPercentage}% illuminated` : 'Calculating...'}
            </div>
          </div>

          {moonData ? (
            /* Card Body: telemetry left (fixed width), moon sphere right */
            <div className="flex items-center justify-between gap-2 my-auto">
              {/* Telemetry column — fixed 104 px so it never pushes the Moon graphic */}
              <div className="flex flex-col gap-1.5 w-[104px] flex-none overflow-hidden">
                <div className="px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800">
                  <div className="text-[8px] uppercase text-slate-400 font-medium leading-none">Altitude</div>
                  <div className="text-[10px] font-medium text-slate-200">{moonData.altitudeDegrees}°</div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800">
                  <div className="text-[8px] uppercase text-slate-400 font-medium leading-none">Azimuth</div>
                  <div className="text-[10px] font-medium text-slate-200">{moonData.azimuthDegrees}°</div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800">
                  <div className="text-[8px] uppercase text-slate-400 font-medium leading-none">Phase Angle</div>
                  <div className="text-[10px] font-medium text-slate-200">{moonData.phaseAngleDegrees}°</div>
                </div>
                {/* Rise / Set — two equal columns filling the fixed telemetry width */}
                <div className="grid grid-cols-2 gap-1">
                  <div className="px-1.5 py-0.5 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="text-[7.5px] uppercase text-gold-400/90 font-medium leading-none mb-0.5">Rise</div>
                    <div className="text-[9.5px] font-mono font-medium text-slate-200 leading-tight">{moonData.riseTimeStr || '--:--'}</div>
                    {moonData.riseIsNextDay && (
                      <div className="text-[7px] text-slate-500 leading-none mt-0.5">tomorrow</div>
                    )}
                  </div>
                  <div className="px-1.5 py-0.5 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="text-[7.5px] uppercase text-gold-400/90 font-medium leading-none mb-0.5">Set</div>
                    <div className="text-[9.5px] font-mono font-medium text-slate-200 leading-tight">{moonData.setTimeStr || '--:--'}</div>
                    {moonData.setIsNextDay && (
                      <div className="text-[7px] text-slate-500 leading-none mt-0.5">tomorrow</div>
                    )}
                  </div>
                </div>
              </div>
              {/* Moon sphere — fills remaining space, stays centred */}
              <div className="flex-1 flex items-center justify-center self-center py-1">
                <MoonPhaseVisual moon={moonData} />
              </div>
            </div>
          ) : (
            <div className="py-4 text-[10px] text-slate-400 italic text-center">Computing astronomical ephemeris...</div>
          )}

          {/* Bottom Status — Browser Ephemeris label removed */}
          {moonData && (
            <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between min-h-[30px]">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border ${
                moonData.isWithinHeroWindow
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}>
                {moonData.isAboveHorizon
                  ? moonData.isWithinHeroWindow
                    ? "Within IST's 35°–65° prime window"
                    : `Alt: ${moonData.altitudeDegrees}° (Above Horizon)`
                  : 'Moon currently below horizon'}
              </span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
