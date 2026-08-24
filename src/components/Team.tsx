import React from 'react';
import { Users, User, Award } from 'lucide-react';
import { OBSERVATORY_HEAD, TEAM_MEMBERS } from '../data/teamData';

export const Team: React.FC = () => {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="py-16 bg-gradient-to-b from-[#040711] via-[#080e22] to-[#040711] border-t border-slate-800 scroll-mt-20 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Observatory Leadership & Staff</span>
          </div>
          <h2 id="team-heading" className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Observatory Team
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            The astronomers, engineers, and educators directing scientific observations and academic research at IAO.
          </p>
        </div>

        {/* 1. Observatory Head Featured Spotlight (Large Profile Card) */}
        <div className="glass-card-dark rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-2xl max-w-4xl mx-auto mb-10 relative overflow-hidden group">
          {/* Subtle Glow Ambient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Head Photo Placeholder */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-slate-900 border-2 border-gold-500/40 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                <div className="w-16 h-16 rounded-full bg-space-950/80 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-2">
                  <User className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-medium">
                  Head of IAO
                </span>
                <span className="text-[10px] font-mono text-gold-400/80 mt-1">
                  [Photo Placeholder]
                </span>
              </div>
            </div>

            {/* Head Editorial Content */}
            <div className="md:col-span-8 space-y-3.5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/15 text-gold-300 border border-gold-500/30">
                <Award className="w-3.5 h-3.5 text-gold-400" />
                <span>In Charge IAO</span>
              </div>

              <div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white mb-1">
                  {OBSERVATORY_HEAD.name}
                </h3>
                <div className="text-sm font-semibold text-gold-400">
                  {OBSERVATORY_HEAD.role}
                </div>
                <div className="text-xs text-slate-400">
                  {OBSERVATORY_HEAD.department}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 font-normal">
                {OBSERVATORY_HEAD.bio}
              </p>

              <div className="pt-2.5 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>Astronomy Outreach Lead</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Team Members Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="glass-card-dark rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-gold-500/30 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Photo Placeholder Box */}
                <div className="w-full h-36 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-space-950 border border-slate-700 flex items-center justify-center text-slate-400 mb-1">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                    [Team Photo Slot]
                  </span>
                </div>

                <div className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1">
                  {member.role}
                </div>

                <h4 className="font-serif-display text-base sm:text-lg font-bold text-white mb-1">
                  {member.name}
                </h4>

                <div className="text-[11px] text-slate-400 mb-2.5">
                  {member.department}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {member.bio}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800 text-[10px] font-mono text-gold-400/70">
                * Pending IAO staff assignment
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
