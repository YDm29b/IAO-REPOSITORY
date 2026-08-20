import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Bell,
  Moon,
  Star
} from 'lucide-react';
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '../services/apiService';

interface NewsletterProps {
  onNavigateHome: () => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onNavigateHome }) => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'already' | 'unsubscribed'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'subscribe' | 'unsubscribe'>('subscribe');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await subscribeToNewsletter(email);
      if (res.status === 'ALREADY_SUBSCRIBED') {
        setStatusMessage({ type: 'already', text: res.message });
      } else {
        setStatusMessage({ type: 'success', text: res.message });
        setEmail('');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit newsletter subscription.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await unsubscribeFromNewsletter(email);
      setStatusMessage({ type: 'unsubscribed', text: res.message });
      setEmail('');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to process unsubscribe request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      
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

      {/* Main Glass Card Container */}
      <div className="glass-card-dark rounded-3xl p-8 sm:p-12 border border-gold-500/30 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-gold-500/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <Mail className="w-8 h-8 text-gold-400" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Monthly Celestial Dispatch</span>
        </div>

        {/* Titles */}
        <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2.5">
          IAO Astronomical Observatory Newsletter
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed mb-8 font-light">
          Receive monthly astronomical bulletins detailing upcoming planetary conjunctions, meteor showers visible from Islamabad, research updates from the telescope deck, and public observation session schedules.
        </p>

        {/* Toggle Subscribe / Unsubscribe Tab */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => { setActiveTab('subscribe'); setStatusMessage(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'subscribe'
                ? 'bg-gold-500 text-black shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Subscribe to Bulletins
          </button>
          <button
            onClick={() => { setActiveTab('unsubscribe'); setStatusMessage(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'unsubscribe'
                ? 'bg-slate-800 text-rose-300 border border-rose-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Unsubscribe Option
          </button>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div className={`max-w-md mx-auto mb-6 p-4 rounded-2xl border text-xs flex items-center gap-3 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : statusMessage.type === 'already'
              ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
              : statusMessage.type === 'unsubscribed'
              ? 'bg-slate-900 border-slate-700 text-slate-300'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : statusMessage.type === 'already' ? (
              <Bell className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-left leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {/* Subscription Form */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner">
          <form onSubmit={activeTab === 'subscribe' ? handleSubscribe : handleUnsubscribe} className="space-y-4">
            <div className="text-xs text-slate-300 font-medium text-left">
              {activeTab === 'subscribe' ? 'Enter your email for monthly dispatches:' : 'Enter your registered email to unsubscribe:'}
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="astronomer@domain.com"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 shrink-0 flex items-center gap-2 ${
                  activeTab === 'subscribe'
                    ? 'bg-gold-500 hover:bg-gold-400 text-[#040711] shadow-[0_4px_14px_rgba(212,175,55,0.35)]'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : activeTab === 'subscribe' ? (
                  <span>Subscribe</span>
                ) : (
                  <span>Unsubscribe</span>
                )}
              </button>
            </div>

            {/* Privacy & Consent Disclosure */}
            <div className="pt-2 text-[10px] text-slate-400 text-left flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Commitment:</strong> Your email address will strictly be used for official IAO astronomical notifications. We respect your privacy and never distribute subscriber data.
              </span>
            </div>
          </form>
        </div>

        {/* Feature Highlights */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-slate-800/80 pt-8">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Moon className="w-4 h-4 text-gold-400 mb-2" />
            <h3 className="text-xs font-bold text-white mb-1">Celestial Highlights</h3>
            <p className="text-[11px] text-slate-400">Monthly lunar phase schedules, planetary oppositions, and meteor shower forecasts.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Star className="w-4 h-4 text-gold-400 mb-2" />
            <h3 className="text-xs font-bold text-white mb-1">Observatory Science</h3>
            <p className="text-[11px] text-slate-400">Updates on new telescope instrumentation, optical filters, and student research projects.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Bell className="w-4 h-4 text-gold-400 mb-2" />
            <h3 className="text-xs font-bold text-white mb-1">Priority Session Access</h3>
            <p className="text-[11px] text-slate-400">Early notification when public night sky and solar observation booking slots open.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
