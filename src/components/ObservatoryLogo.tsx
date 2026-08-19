import React from 'react';

interface ObservatoryLogoProps {
  className?: string;
  size?: number;
}

/**
 * Realistic Astronomical Observatory Dome Logo
 * Depicts a classical observatory dome with open shutter, protruding telescope,
 * rotunda drum base, and celestial backdrop.
 */
export const ObservatoryLogo: React.FC<ObservatoryLogoProps> = ({ 
  className = "w-10 h-10", 
  size = 40 
}) => {
  return (
    <div 
      className={`rounded-xl border border-gold-500/40 bg-gradient-to-br from-gold-500/20 via-slate-900 to-space-950 flex items-center justify-center text-gold-400 group-hover:border-gold-400 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 32 32" 
        className="w-[70%] h-[70%] fill-none stroke-current"
        strokeWidth="1.6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Distant celestial stars */}
        <circle cx="6.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="26.5" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
        <path d="M25 10v2m-1-1h2" strokeWidth="0.8" stroke="currentColor" />

        {/* Telescope barrel protruding from the dome slit */}
        <path 
          d="M13 14l6-7 2.2 1.8-6 7z" 
          fill="currentColor" 
          fillOpacity="0.25" 
          stroke="currentColor" 
          strokeWidth="1.2" 
        />
        <path d="M19 7l2.2 1.8" stroke="currentColor" strokeWidth="1.6" />

        {/* Observatory Hemispherical Dome */}
        <path 
          d="M6 19.5c0-5.52 4.48-10 10-10s10 4.48 10 10" 
          stroke="currentColor" 
          strokeWidth="1.6" 
        />

        {/* Dome Slit Aperture Opening */}
        <path 
          d="M13 10c1-.3 2-.45 3-.45 2.8 0 5.3 1.1 7.1 3L16 19.5" 
          stroke="currentColor" 
          strokeWidth="1.2" 
        />

        {/* Dome Base Ring / Rotation Track */}
        <path d="M4 19.5h24" stroke="currentColor" strokeWidth="1.6" />

        {/* Lower Rotunda Building Wall */}
        <path d="M6.5 19.5v6.5h19v-6.5" stroke="currentColor" strokeWidth="1.5" />

        {/* Foundation Plinth Base */}
        <path d="M3.5 26h25" stroke="currentColor" strokeWidth="1.6" />
        
        {/* Entrance Portal */}
        <path d="M13.5 26v-4h5v4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
};
