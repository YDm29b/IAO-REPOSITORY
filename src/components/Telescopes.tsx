import React, { useState } from 'react';
import { 
  Eye, 
  Sun, 
  Compass,
  FileText
} from 'lucide-react';
import { TELESCOPES_DATA } from '../data/telescopesData';

export const Telescopes: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredSpecsId, setHoveredSpecsId] = useState<string | null>(null);

  const categories = ['All', 'Deep Sky & Planetary', 'Solar Research', 'High-Resolution Imaging'];

  const filteredTelescopes = selectedCategory === 'All'
    ? TELESCOPES_DATA
    : TELESCOPES_DATA.filter((t) => t.category === selectedCategory);

  return (
    <section
      id="telescopes"
      aria-labelledby="telescopes-heading"
      className="py-16 bg-[#040711] border-t border-slate-800/80 scroll-mt-20 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Fleet Overview Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-800/60 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3 shadow-sm">
              <Eye className="w-3.5 h-3.5" />
              <span>Observatory Instrumentation Fleet</span>
            </div>
            <h2 id="telescopes-heading" className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Available Telescopes
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl">
              IAO operates five precision optical instruments across heavy-duty Alt-Azimuth and Equatorial mounts, engineered for deep-sky photometry, solar dynamics, and planetary research.
            </p>
          </div>

          {/* Instrument Count Badge */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#040711]/60 backdrop-blur-md border border-slate-700/50 shadow-[0_0_15px_rgba(212,175,55,0.1)] shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-serif-display text-xl font-bold">
              5
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gold-400 font-semibold">Total Instruments</div>
              <div className="text-[11px] text-slate-400">4 Distinct Models • 2× EdgeHD 8"</div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills - Standardized Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-[#040711] shadow-[0_4px_14px_rgba(212,175,55,0.35)]'
                  : 'bg-[#040711]/60 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Telescopes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {filteredTelescopes.map((telescope) => {
            const isHovered = hoveredSpecsId === telescope.id;

            return (
              <div
                key={telescope.id}
                className="rounded-3xl p-6 sm:p-7 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-gold-500/40 hover:bg-slate-900/60 transition-all flex flex-col justify-between shadow-xl relative"
              >
                <div>
                  {/* Top Badge & Mount */}
                  <div className="flex items-center justify-between mb-5 gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-gold-500/10 text-gold-300 border border-gold-500/20 shadow-sm">
                      {telescope.badge || telescope.category}
                    </span>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/30 border border-slate-700/50 text-slate-300 flex items-center gap-1.5 font-normal">
                      <Compass className="w-3 h-3 text-gold-400" />
                      {telescope.mountType}
                    </span>
                  </div>

                  {/* Telescope Image */}
<div className="w-full h-44 sm:h-48 rounded-2xl bg-slate-950 border border-white/10 relative overflow-hidden mb-6 shadow-inner">
  
  <img
  src={telescope.image}
  alt={telescope.title}
  className="w-full h-full object-cover p-4"
/>

  {/* Subtle overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

  {/* Quantity badge */}
  {telescope.quantity > 1 && (
    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-medium backdrop-blur-md">
      2 UNITS
    </div>
  )}
</div>

                  {/* Title & Subtitle */}
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white mb-1.5 drop-shadow-md">
                    {telescope.title}
                  </h3>
                  
                  <div className="text-xs text-gold-400/90 font-medium mb-3">
                    {telescope.subtitle}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-light opacity-90">
                    {telescope.summary}
                  </p>

                  {/* Key Highlights Quick Specs (Refined & Minimal) */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                    <div className="p-3 rounded-xl bg-black/20 border border-slate-700/50 flex flex-col justify-center">
                      <div className="text-[10px] uppercase text-slate-400/80 font-medium mb-1">Aperture</div>
                      <div className="font-mono text-slate-200 font-medium text-sm">{telescope.specs.aperture}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/20 border border-slate-700/50 flex flex-col justify-center">
                      <div className="text-[10px] uppercase text-slate-400/80 font-medium mb-1">Focal Length</div>
                      <div className="font-mono text-slate-200 font-medium text-sm">{telescope.specs.focalLength}</div>
                    </div>
                  </div>
                </div>

                {/* View Specifications Non-Expanding Popover Trigger */}
                <div 
                  className="relative pt-4 border-t border-slate-700/50"
                  onMouseEnter={() => setHoveredSpecsId(telescope.id)}
                  onMouseLeave={() => setHoveredSpecsId(null)}
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#040711] bg-gold-500 hover:bg-gold-400 rounded-xl shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    aria-label={`View specifications for ${telescope.title}`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Specifications</span>
                  </button>

                  {/* Elegant Glass Popover */}
                  {isHovered && (
                    <div 
                      className="absolute bottom-full mb-3 left-0 right-0 max-h-[22rem] overflow-y-auto bg-slate-900/95 backdrop-blur-2xl border border-gold-500/30 rounded-2xl p-5 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150 custom-scrollbar"
                      role="tooltip"
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gold-500/20">
                        <span className="text-sm font-bold font-serif-display text-gold-400 drop-shadow-md">
                          {telescope.title} Specs
                        </span>
                        <span className="text-[10px] font-mono text-slate-400/80 uppercase tracking-widest">Detail View</span>
                      </div>

                      <div className="space-y-2.5 text-xs font-light">
                        {telescope.specs.opticalDesign && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Design</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.opticalDesign}</span>
                          </div>
                        )}
                        {telescope.specs.mount && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Mount</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.mount}</span>
                          </div>
                        )}
                        {telescope.specs.focalRatio && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Focal Ratio</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.focalRatio}</span>
                          </div>
                        )}
                        {telescope.specs.coatings && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Coatings</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.coatings}</span>
                          </div>
                        )}
                        {telescope.specs.primaryMirror && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Primary Mirror</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.primaryMirror}</span>
                          </div>
                        )}
                        {telescope.specs.trackingAndGoto && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Tracking</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.trackingAndGoto}</span>
                          </div>
                        )}
                        {telescope.specs.focus && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Focusing</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.focus}</span>
                          </div>
                        )}
                        {telescope.specs.etalonBandpass && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Etalon Bandpass</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.etalonBandpass}</span>
                          </div>
                        )}
                        {telescope.specs.tuning && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Tuning</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.tuning}</span>
                          </div>
                        )}
                        {telescope.specs.resolvingPower && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Resolution</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.resolvingPower}</span>
                          </div>
                        )}
                        {telescope.specs.limitingMagnitude && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">Limiting Mag</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.limitingMagnitude}</span>
                          </div>
                        )}
                        {telescope.specs.otaWeight && (
                          <div className="flex justify-between items-end pb-1.5 border-b border-white/5">
                            <span className="text-slate-400">OTA Weight</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.otaWeight}</span>
                          </div>
                        )}
                        {telescope.specs.power && (
                          <div className="flex justify-between items-end">
                            <span className="text-slate-400">Power</span>
                            <span className="font-mono text-slate-200 text-right">{telescope.specs.power}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
