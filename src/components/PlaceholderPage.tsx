import React, { useState } from 'react';
import { ArrowLeft, Calendar, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { OBSERVATORY_CONFIG } from '../config/observatory';

interface PlaceholderPageProps {
  type: 'book-session' | 'newsletter';
  onNavigateHome: () => void;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ type, onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const config = {
    'book-session': {
      title: 'Observation Session Booking',
      subtitle: 'Schedule a Guided Stargazing & Telescopy Session',
      icon: <Calendar className="w-8 h-8 text-gold-400" />,
      description: 'The automated online reservation portal for university student research groups, academic delegations, and public night sky observation slots is currently in final administrative configuration. Please check back shortly or register your email for priority session notifications.',
      badge: 'Booking Portal • Under Preparation',
      ctaText: 'Notify me when booking opens',
    },
    'newsletter': {
      title: 'Observatory Newsletter & Celestial Bulletin',
      subtitle: 'Monthly Celestial Highlights, Eclipse Notices & Discovery Summaries',
      icon: <Mail className="w-8 h-8 text-gold-400" />,
      description: 'Receive monthly observatory bulletins curated by IAO astronomers detailing upcoming planetary conjunctions, meteor showers visible from Islamabad, and updates from the telescope deck.',
      badge: 'Monthly Dispatch • Coming Soon',
      ctaText: 'Join the IAO Dispatch List',
    },
  }[type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* Main Glass Panel */}
      <div className="glass-card-dark rounded-3xl p-8 sm:p-12 border border-gold-500/30 shadow-2xl relative overflow-hidden text-center">
        
        {/* Glow ambient */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-space-950 border border-gold-500/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          {config.icon}
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{config.badge}</span>
        </div>

        {/* Titles */}
        <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2.5">
          {config.title}
        </h1>

        <div className="text-sm font-semibold text-gold-400 mb-6">
          {config.subtitle}
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          {config.description}
        </p>

        {/* Placeholder Email Interest Form */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
          {submitted ? (
            <div className="flex flex-col items-center gap-2 text-emerald-400 py-4 animate-in fade-in">
              <CheckCircle2 className="w-7 h-7" />
              <span className="text-sm font-semibold">Thank you for your interest!</span>
              <span className="text-xs text-slate-400">
                [Placeholder submission recorded for {email}]
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="text-xs text-slate-300 font-medium text-left">
                Register for updates:
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 font-normal"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-[#040711] text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(212,175,55,0.35)] shrink-0"
                >
                  Notify Me
                </button>
              </div>
              <div className="text-[10px] text-slate-500 text-left font-mono">
                * Centralized placeholder form pending IAO backend setup
              </div>
            </form>
          )}
        </div>

        {/* Contact fallback */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
          Direct inquiries: <strong className="text-slate-200 font-mono">{OBSERVATORY_CONFIG.contact.email}</strong>
        </div>

      </div>

    </div>
  );
};
