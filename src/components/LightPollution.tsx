import React from 'react';
import {
  ArrowLeft,
  Moon,
  AlertTriangle,
  ShieldCheck,
  Star,
  Map,
  MapPin,
  Info
} from 'lucide-react';
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
        
        {/* Sky Pollution Map - FIRST */}
<section className="lg:col-span-3 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
  
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-6">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Map className="w-5 h-5 text-gold-400" />
        <h2 className="text-xl font-serif-display font-bold text-white">
          Sky Pollution Map
        </h2>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
        Explore the distribution of artificial skyglow and identify darker
        areas that may provide better conditions for astronomical observation.
        Darker regions generally offer better visibility of faint stars and
        deep-sky objects.
      </p>
    </div>

    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
      <MapPin className="w-3.5 h-3.5 text-gold-400" />
      <span className="text-[11px] text-slate-400">
        Islamabad Region
      </span>
    </div>
  </div>

  {/* Map Container */}
  <div className="relative h-[420px] sm:h-[500px] rounded-2xl overflow-hidden border border-slate-700/80 bg-[#07101f]">

    {/* Replace this container with your actual map component */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center px-6">
        <Map className="w-12 h-12 text-slate-700 mx-auto mb-4" />

        <h3 className="text-sm font-semibold text-slate-300 mb-2">
          Interactive Sky Pollution Map
        </h3>

        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
          This map will display artificial skyglow data, dark-sky conditions,
          and observing locations across the region.
        </p>
      </div>
    </div>

    {/* Map Legend */}
    <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-3.5 h-3.5 text-gold-400" />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-300">
          Sky Brightness
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-slate-950 border border-slate-700" />
          <span className="text-[10px] text-slate-400">
            Very Dark
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-indigo-900" />
          <span className="text-[10px] text-slate-400">
            Dark Sky
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-700" />
          <span className="text-[10px] text-slate-400">
            Moderate
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-900" />
          <span className="text-[10px] text-slate-400">
            High Pollution
          </span>
        </div>
      </div>
    </div>

  </div>

  {/* Map Information */}
  <div className="mt-4 flex flex-col sm:flex-row gap-3">
    <div className="flex-1 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
      <h3 className="text-xs font-semibold text-white mb-1">
        What the map shows
      </h3>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        Brighter areas indicate greater artificial skyglow. Darker areas
        generally provide better conditions for astronomical observation.
      </p>
    </div>

    <div className="flex-1 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
      <h3 className="text-xs font-semibold text-white mb-1">
        For observers
      </h3>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        Use dark-sky information together with weather, atmospheric
        transparency, and seeing conditions when choosing an observing site.
      </p>
    </div>
  </div>

</section>

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

                  {/* Bortle Dark-Sky Scale */}
          <section className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
            <h2 className="text-xl font-serif-display font-bold text-white mb-4">
              Bortle Dark-Sky Scale
            </h2>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              The Bortle scale is a nine-class system used to describe the
              darkness of the night sky, ranging from exceptionally dark
              rural locations to heavily illuminated urban skies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  class: '1',
                  title: 'Excellent Dark Sky',
                  description:
                    'Extremely dark conditions with a highly detailed Milky Way and excellent visibility of faint celestial objects.'
                },
                {
                  class: '2',
                  title: 'Truly Dark Sky',
                  description:
                    'Very dark skies with strong Milky Way structure and excellent deep-sky visibility.'
                },
                {
                  class: '3',
                  title: 'Rural Sky',
                  description:
                    'The Milky Way remains prominent, although some skyglow may be visible near the horizon.'
                },
                {
                  class: '4',
                  title: 'Rural / Suburban Transition',
                  description:
                    'Light domes become visible around populated areas while many deep-sky objects remain observable.'
                },
                {
                  class: '5',
                  title: 'Suburban Sky',
                  description:
                    'Noticeable skyglow reduces the contrast and detail of the Milky Way.'
                },
                {
                  class: '6',
                  title: 'Bright Suburban Sky',
                  description:
                    'Only brighter portions of the Milky Way may remain visible.'
                },
                {
                  class: '7',
                  title: 'Suburban / Urban Transition',
                  description:
                    'Strong skyglow dominates much of the sky and many constellations become difficult to recognize.'
                },
                {
                  class: '8',
                  title: 'City Sky',
                  description:
                    'The sky is strongly illuminated and only brighter stars and celestial objects are readily visible.'
                },
                {
                  class: '9',
                  title: 'Inner-City Sky',
                  description:
                    'Extremely bright sky conditions where the brightest stars, planets, and Moon dominate naked-eye observations.'
                }
              ].map((item) => (
                <div
                  key={item.class}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-gold-400">
                        {item.class}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
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
                  <span className="text-[11px] text-slate-400 leading-tight block">Use fully shielded fixtures so light is directed only where it is needed and does not shine unnecessarily into the sky.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-xs text-white block mb-0.5">Use warmer colors</strong>
                  <span className="text-[11px] text-slate-400 leading-tight block">Prefer warmer, lower-intensity lighting where practical, particularly in areas where strong illumination is unnecessary.</span>
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
              The IST Astronomical Observatory promotes awareness of responsible outdoor lighting and the scientific value of dark skies. Protecting the night sky helps preserve opportunities for astronomical observation and allows students and the public to experience a clearer view of the universe.
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
