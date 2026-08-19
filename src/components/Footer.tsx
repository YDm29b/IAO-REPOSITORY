import React from 'react';
import { ExternalLink, ArrowUp, Mail, Phone } from 'lucide-react';
import { OBSERVATORY_CONFIG } from '../config/observatory';
import { ObservatoryLogo } from './ObservatoryLogo';

interface FooterProps {
  onNavigatePage: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage }) => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (id: string) => {
    onNavigatePage('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-[#020409] text-slate-400 border-t border-slate-800/90 pt-14 pb-12 relative" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Identity & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="flex items-center gap-3">
              <ObservatoryLogo size={38} />

              <div>
                <div className="font-serif-display text-base font-bold text-white tracking-wide">
                  IAO — IST Astronomical Observatory
                </div>
                <div className="text-xs text-gold-400 font-mono">
                  {OBSERVATORY_CONFIG.institution}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              The primary astronomical observation and space science research facility at the Institute of Space Technology, Islamabad, Pakistan.
            </p>

            <div className="pt-1 text-[11px] font-mono text-slate-500">
              Coordinates: {OBSERVATORY_CONFIG.coordinates.latitude}° N, {OBSERVATORY_CONFIG.coordinates.longitude}° E
            </div>
          </div>

          {/* Col 2: Navigation & Sections (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs uppercase font-bold tracking-widest text-gold-400">
              Observatory Sections
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => handleScrollToSection('tonights-sky')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Tonight’s Sky
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToSection('telescopes')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Available Telescopes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToSection('image-gallery')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Image Gallery Archives
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToSection('foundation')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Foundation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToSection('team')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Observatory Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToSection('find-us')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Find Us & Connect
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollToSection('faqs')}
                  className="hover:text-gold-300 transition-colors"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Affiliations & Partners (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs uppercase font-bold tracking-widest text-gold-400">
              Institutional Affiliations
            </h4>
            <ul className="space-y-1.5 text-xs">
              {OBSERVATORY_CONFIG.partners.map((partner) => (
                <li key={partner.short}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
                  >
                    <span>{partner.name}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 group-hover:text-gold-400" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Inquiries (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs uppercase font-bold tracking-widest text-gold-400">
              Contact & Inquiries
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="font-mono text-[11px] truncate">{OBSERVATORY_CONFIG.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="font-mono text-[11px]">{OBSERVATORY_CONFIG.contact.phone}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleScrollToTop}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-gold-500/40 text-xs font-semibold text-slate-300 hover:text-gold-300 transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Back to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {currentYear} IST Astronomical Observatory (IAO) — Institute of Space Technology. All rights reserved.
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span>British English Spelling</span>
            <span>•</span>
            <span>Academic & Public Outreach Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
