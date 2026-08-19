import React from 'react';
import { ArrowLeft, Moon, AlertTriangle, ShieldCheck, Star, Map } from 'lucide-react';
import { OBSERVATORY_CONFIG } from '../config/observatory';

interface LightPollutionProps {
  onNavigateHome: () => void;
}

export const LightPollution: React.FC<LightPollutionProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="glass-card-dark rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden mb-8 backdrop-blur-lg">
        {/* Glow ambient */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-gold-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0">
            <Moon className="w-8 h-8 text-gold-400" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
              <Star className="w-3.5 h-3.5" />
              <span>Dark-Sky Conservation</span>
            </div>
            
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Light Pollution & Night Sky Protection
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Artificial light at night is one of the most rapidly expanding forms of environmental degradation. As an astronomical observatory, IAO is dedicated to educating the public on how irresponsible lighting impacts science, wildlife, and human heritage.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: What is Light Pollution */}
          <section className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
            <h2 className="text-xl font-serif-display font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Types of Light Pollution
            </h2>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Light pollution is the inappropriate or excessive use of artificial light. It washes out starlight in the night sky, interferes with astronomical research, disrupts ecosystems, and wastes energy.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <h3 className="text-sm font-bold text-gold-300 mb-2">Skyglow</h3>
                <p className="text-xs text-slate-400 leading-relaxed">The brightening of the night sky over inhabited areas. This is the orange or white dome you see over a city from afar.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <h3 className="text-sm font-bold text-gold-300 mb-2">Light Trespass</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Light falling where it is not intended or needed, such as a street light illuminating a bedroom window.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <h3 className="text-sm font-bold text-gold-300 mb-2">Glare</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Excessive brightness that causes visual discomfort and decreases visibility, often caused by unshielded fixtures.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <h3 className="text-sm font-bold text-gold-300 mb-2">Clutter</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Bright, confusing, and excessive groupings of light sources, commonly found in over-lit urban areas.</p>
              </div>
            </div>
          </section>

          {/* Section: Impacts */}
          <section className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
            <h2 className="text-xl font-serif-display font-bold text-white mb-4">Impacts of Artificial Light</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-2">Astronomical Research</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Skyglow drastically reduces the contrast of the night sky, making it impossible to see faint deep-sky objects like galaxies and nebulae. Observatories like IAO require dark skies to gather accurate photometric data and perform meaningful celestial observations. 
                </p>
              </div>
              
              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-sm font-bold text-slate-200 mb-2">Nocturnal Ecosystems</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Millions of years of evolution have adapted wildlife to a natural diurnal cycle. Artificial light disrupts migration patterns of birds, affects the reproduction of amphibians, and alters predator-prey relationships.
                </p>
              </div>
              
              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-sm font-bold text-slate-200 mb-2">Human Health & Energy Waste</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Exposure to blue-rich artificial light at night suppresses melatonin production, disrupting human circadian rhythms. Furthermore, unshielded outdoor lighting wastes immense amounts of energy and carbon footprint by shining light directly into space rather than towards the ground.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Actionable Advice Card */}
          <div className="bg-slate-900/60 backdrop-blur-lg rounded-2xl p-6 border border-gold-500/20 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-serif-display font-bold text-white mb-4">How You Can Help</h2>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-xs text-white block mb-0.5">Use proper shielding</strong>
                  <span className="text-[11px] text-slate-400 leading-tight block">Ensure outdoor lights point downward. Light should only shine where needed.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-xs text-white block mb-0.5">Use warmer colors</strong>
                  <span className="text-[11px] text-slate-400 leading-tight block">Choose LEDs with a color temperature of 3000K or lower to reduce blue light scattering.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-xs text-white block mb-0.5">Dim or turn off</strong>
                  <span className="text-[11px] text-slate-400 leading-tight block">Use timers, motion sensors, and dimmers so light is only active when actively needed.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* IAO Commitment */}
          <div className="bg-[#040711]/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">IAO Dark-Sky Commitment</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Situated in the twin cities, the IST Astronomical Observatory actively advocates for responsible lighting on campus and in the surrounding communities. By preserving the sky, we ensure that students and the public can continue to experience the universe through our telescopes.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
              Coordinates: {OBSERVATORY_CONFIG.coordinates.latitude}°N, {OBSERVATORY_CONFIG.coordinates.longitude}°E
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};
