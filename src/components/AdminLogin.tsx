import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { adminLogin } from '../services/apiService';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setLoginError('Please enter both admin username and password.');
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      const res = await adminLogin(username.trim(), password);
      sessionStorage.setItem('iao_admin_token', res.token);
      onLoginSuccess(res.token);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto flex flex-col justify-center">
      
      {/* Return Home Button */}
      <div className="mb-6">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Observatory Homepage</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="glass-card-dark rounded-3xl p-8 border border-gold-500/30 shadow-2xl relative overflow-hidden text-center backdrop-blur-xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-gold-500/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <ShieldCheck className="w-7 h-7 text-gold-400" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Restricted Portal</span>
        </div>

        {/* Titles */}
        <h1 className="font-serif-display text-2xl font-bold text-white mb-1.5">
          IAO Administrator Portal
        </h1>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed font-light">
          Authenticated access for observatory directors, deck operators, and session managers.
        </p>

        {/* Error Alert */}
        {loginError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 text-left animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold-400" />
              <span>Admin Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter administrator username..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 font-normal"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-[#040711] text-xs font-semibold transition-all duration-200 shadow-[0_4px_14px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate Admin Access</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Development Helper Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono text-center">
          * Development Mode Credentials: Username: <strong className="text-slate-300">admin</strong> | Password: <strong className="text-slate-300">iao_admin_2026_pass</strong>
        </div>

      </div>

    </div>
  );
};
