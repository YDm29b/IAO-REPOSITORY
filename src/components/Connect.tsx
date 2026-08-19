import React from 'react';
import { Share2, ExternalLink } from 'lucide-react';
import { OBSERVATORY_CONFIG } from '../config/observatory';

export const Connect: React.FC = () => {
  const socials = [
    {
      name: 'Facebook',
      handle: '@istobservatory',
      url: OBSERVATORY_CONFIG.socialLinks.facebook,
      description: 'Public event notices, star party registrations, and live stream broadcasts.',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'hover:text-blue-400 hover:border-blue-500/40',
    },
    {
      name: 'Instagram',
      handle: '@istobservatory',
      url: OBSERVATORY_CONFIG.socialLinks.instagram,
      description: 'High-resolution astrophotography, telescope setup reels, and night-sky updates.',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'hover:text-pink-400 hover:border-pink-500/40',
    },
    {
      name: 'X (Twitter)',
      handle: '@istobservatory',
      url: OBSERVATORY_CONFIG.socialLinks.x,
      description: 'Real-time celestial event alerts, eclipse tracking, and observing announcements.',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'hover:text-cyan-300 hover:border-cyan-500/40',
    },
    {
      name: 'YouTube',
      handle: '@istobservatory',
      url: OBSERVATORY_CONFIG.socialLinks.youtube,
      description: 'Astrophysics lectures, telescope tutorials, and planetarium conference recordings.',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: 'hover:text-red-400 hover:border-red-500/40',
    },
  ];

  return (
    <section
      id="connect"
      aria-labelledby="connect-heading"
      className="py-16 bg-[#040711] border-t border-slate-800 scroll-mt-20 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Share2 className="w-3.5 h-3.5" />
            <span>Community & Social Channels</span>
          </div>
          <h2 id="connect-heading" className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Let’s Connect
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Follow IAO across verified channels for astronomical alerts, lunar watch sessions, and outreach announcements.
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card-dark rounded-2xl p-5 border border-slate-800 transition-all duration-200 flex flex-col justify-between group shadow-xl hover:-translate-y-1 ${s.color}`}
              aria-label={`Visit IST Observatory on ${s.name}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="text-slate-200 group-hover:text-gold-400 transition-colors">
                    {s.icon}
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-gold-400 transition-colors" />
                </div>

                <h3 className="font-serif-display text-base font-bold text-white mb-1">
                  {s.name}
                </h3>
                
                <div className="text-xs font-mono text-gold-400/90 mb-2.5 font-medium">
                  {s.handle}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {s.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>* Official Channel</span>
                <span className="text-gold-400/80 font-medium">Connect →</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
