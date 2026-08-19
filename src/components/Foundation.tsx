import React from 'react';
import { BookOpen, Sparkles, Award, Compass } from 'lucide-react';

export const Foundation: React.FC = () => {
  return (
    <section
      id="foundation"
      aria-labelledby="foundation-heading"
      className="py-16 bg-transparent border-t border-slate-800 scroll-mt-20 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic & Institutional Heritage</span>
          </div>
          <h2 id="foundation-heading" className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Foundation
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Advancing space science education, stellar observation, and public astronomical outreach in Pakistan.
          </p>
        </div>

        {/* Foundation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Institutional Mandate */}
          <div className="glass-card-dark rounded-3xl p-6 sm:p-7 border border-slate-800 flex flex-col justify-between shadow-2xl relative group hover:border-gold-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-lg sm:text-xl font-bold text-white mb-2.5">
                Research & Discovery
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                The IST Astronomical Observatory serves as a primary observational research facility for faculty and students at the Institute of Space Technology. The facility supports optical photometry, celestial event tracking, and undergraduate astrophysics experiments.
              </p>
            </div>
            
          </div>

          {/* Card 2: Academic Collaboration */}
          <div className="glass-card-dark rounded-3xl p-6 sm:p-7 border border-slate-800 flex flex-col justify-between shadow-2xl relative group hover:border-gold-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-5">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-lg sm:text-xl font-bold text-white mb-2.5">
                Space Science Synergy
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Operating in close coordination with the National Center of GIS & Space Applications (NCGSA),the Space & Astronomy Research Lab (SARL), and the Pakistan Space & Upper Atmosphere Research Commission (SUPARCO), IAO fosters hands-on instrumentation expertise, data collection pipelines, and space awareness initiatives across Pakistan.
              </p>
            </div>
            
          </div>

          {/* Card 3: Public Outreach */}
          <div className="glass-card-dark rounded-3xl p-6 sm:p-7 border border-slate-800 flex flex-col justify-between shadow-2xl relative group hover:border-gold-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-5">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-lg sm:text-xl font-bold text-white mb-2.5">
                Community & Education
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Through special day and night observation sessions, IAO inspires youth curiosity in astronomy, space technology, and dark-sky preservation in the federal capital region.
              </p>
            </div>
           
          </div>

        </div>

      </div>
    </section>
  );
};
