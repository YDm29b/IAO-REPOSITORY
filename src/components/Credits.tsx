import React from 'react';
import { ArrowLeft, Code2, User, Sparkles, Compass } from 'lucide-react';

interface CreditsProps {
  onNavigateHome: () => void;
}

interface WebTeamMember {
  id: string;
  name: string;
  role: string;
  contribution: string;
  department: string;
}

const WEB_CREDITS_DATA: WebTeamMember[] = [
  {
    id: 'team-member-1',
    name: 'Prof. Najam Abbas Naqvi',
    role: 'Chairman NCGSA & IAO Scientific Advisor',
    contribution: 'Scientific oversight, telescope instrumentation guidance, and research methodology consultation.',
    department: 'Supervisory & Advisory Board',
  },
  {
    id: 'team-member-2',
    name: 'Yawar Abbas',
    role: 'Project Lead & Observatory Operations',
    contribution: 'Strategic planning, project management, and observatory operations coordination.',
    department: 'Projet Supervisory',
  },  
  {
    id: 'team-member-3',
    name: 'Arooj Fatima',
    role: 'Astronomical Ephemeris & Telemetry, Web Design & Development',
    contribution: 'Booking system, weather API, React UI, VSOP87 planetary calculations, celestial coordinates, and telescope filtering.',
    department: 'Content Lead & Web Development',
  },
  {
    id: 'team-member-4',
    name: 'Syeda Radhiya Aamir',
    role: 'Design & Content Lead',
    contribution: 'Content research and design guide for educational materials.',
    department: 'Design & Content Lead',
  },
  {
    id: 'team-member-5',
    name: 'Syeda Fatima Zahra',
    role: 'Software Programming & Development Lead',
    contribution: 'Provided guidance on React component architecture.',
    department: 'Web Development',
  },
  {
    id: 'team-member-6',
    name: 'Syed Ali Mohsin Bukhari',
    role: 'IAO Web Design Advisor',
    contribution: 'Provided IAO azimuth & altitude constraints for ephemeris model.',
    department: 'Quality Assurance & A11y',
  },
  {
    id: 'team-member-7',
    name: 'Muhammad Junaid',
    role: 'Web Development Advisor',
    contribution: 'Web application development advisory and implementation guide.',
    department: 'Software Development',
  },
];

export const Credits: React.FC<CreditsProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col">
      
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
      <div className="glass-card-dark rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden mb-10 backdrop-blur-lg">
        {/* Glow ambient */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border border-gold-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0">
            <Code2 className="w-7 h-7 text-gold-400" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Development</span>
            </div>
            
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              Website Credits
            </h1>
            <h2 className="text-sm sm:text-base font-semibold text-gold-400 mb-3 tracking-wide">
              Web Development Team
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl font-light">
              This platform was designed and engineered for the Institute of Space Technology Astronomical Observatory (IAO) to provide high-precision real-time celestial telemetry, observation planning tools, and public outreach. The web development team members responsible for architecture, scientific modeling, interface design, and systems engineering are acknowledged below.
            </p>
          </div>
        </div>
      </div>

      {/* 7 Compact Team Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {WEB_CREDITS_DATA.map((member) => (
          <div
            key={member.id}
            className="glass-card-dark rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-gold-500/40 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] group relative"
          >
            <div>
              {/* Top Row: Avatar placeholder & ID badge */}
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 group-hover:border-gold-500/40 flex items-center justify-center text-slate-400 group-hover:text-gold-400 transition-colors shadow-inner shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                  {member.department}
                </span>
              </div>

              {/* Member Name */}
              <h3 className="font-serif-display text-base font-bold text-white group-hover:text-gold-300 transition-colors mb-0.5">
                {member.name}
              </h3>

              {/* Role */}
              <div className="text-xs text-gold-400 font-medium mb-2.5">
                {member.role}
              </div>

              {/* Contribution Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {member.contribution}
              </p>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <Compass className="w-3 h-3 text-gold-400/70" /> IAO Web Contributor
              </span>
              <span className="text-gold-400/60">[Slot Active]</span>
            </div>
          </div>
        ))}
      </div>

      {/* Institutional Note */}
      <div className="mt-12 text-center border-t border-slate-800/80 pt-6">
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          IST Astronomical Observatory (IAO) • Space & Education Research Lab (SERL) / NCGSA • Institute of Space Technology, Islamabad
        </p>
      </div>

    </div>
  );
};
