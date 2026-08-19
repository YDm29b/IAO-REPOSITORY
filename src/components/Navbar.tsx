import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ExternalLink, 
  Calendar, 
  Info, 
  Users, 
  HelpCircle, 
  Image as ImageIcon, 
  Moon, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { OBSERVATORY_CONFIG } from '../config/observatory';
import { ObservatoryLogo } from './ObservatoryLogo';

interface NavbarProps {
  onNavigatePage: (route: string) => void;
  currentRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigatePage, currentRoute }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [educationDropdownOpen, setEducationDropdownOpen] = useState(false);

  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const educationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor scroll to increase header opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAboutDropdownOpen(false);
        setEducationDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrollTo = (sectionId: string) => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setEducationDropdownOpen(false);

    if (currentRoute !== 'home') {
      onNavigatePage('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageNavigation = (route: string) => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setEducationDropdownOpen(false);
    onNavigatePage(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#040711]/92 backdrop-blur-md border-b border-gold-500/20 py-2 shadow-2xl'
          : 'bg-gradient-to-b from-[#040711]/85 via-[#040711]/45 to-transparent py-2.5 sm:py-3'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Realistic Observatory Logo & Wordmark (Without IST badge text) */}
        <button
          onClick={() => handleScrollTo('top')}
          className="flex items-center gap-2.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-lg p-1 transition-transform"
          aria-label="IAO Homepage - Scroll to top"
        >
          <ObservatoryLogo size={36} />

          <div className="flex flex-col">
            <span className="font-serif-display text-lg font-bold tracking-wider text-white group-hover:text-gold-300 transition-colors leading-tight">
              IAO
            </span>
            <span className="text-[11px] text-slate-400 tracking-tight hidden sm:inline leading-tight">
              IST Astronomical Observatory
            </span>
          </div>
        </button>

        {/* Centre Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
          <button
            onClick={() => handleScrollTo('top')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-lg ${
              currentRoute === 'home'
                ? 'text-gold-400 hover:text-gold-300'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </button>

          {/* Guaranteed Single-Line Tonight's Sky */}
          <button
            onClick={() => handleScrollTo('tonights-sky')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-gold-300 transition-colors rounded-lg whitespace-nowrap"
          >
            Tonight's Sky
          </button>

          <button
            onClick={() => handleScrollTo('telescopes')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-gold-300 transition-colors rounded-lg whitespace-nowrap"
          >
            Available Telescopes
          </button>

          {/* About Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
              setAboutDropdownOpen(true);
            }}
            onMouseLeave={() => {
              aboutTimeoutRef.current = setTimeout(() => setAboutDropdownOpen(false), 200);
            }}
          >
            <button
              onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  setAboutDropdownOpen(true);
                }
              }}
              aria-expanded={aboutDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-gold-300 transition-colors rounded-lg"
            >
              About
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180 text-gold-400' : ''}`} />
            </button>

            {aboutDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-56 glass-dropdown rounded-xl p-2 border border-gold-500/20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                role="menu"
              >
                <button
                  role="menuitem"
                  onClick={() => handleScrollTo('foundation')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg text-left transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-gold-400" />
                  Foundation
                </button>
                <button
                  role="menuitem"
                  onClick={() => handleScrollTo('team')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg text-left transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-gold-400" />
                  Observatory Team
                </button>
                <button
                  role="menuitem"
                  onClick={() => handleScrollTo('faqs')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg text-left transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
                  FAQs
                </button>
              </div>
            )}
          </div>

          {/* Education Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (educationTimeoutRef.current) clearTimeout(educationTimeoutRef.current);
              setEducationDropdownOpen(true);
            }}
            onMouseLeave={() => {
              educationTimeoutRef.current = setTimeout(() => setEducationDropdownOpen(false), 200);
            }}
          >
            <button
              onClick={() => setEducationDropdownOpen(!educationDropdownOpen)}
              aria-expanded={educationDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-gold-300 transition-colors rounded-lg"
            >
              Education
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${educationDropdownOpen ? 'rotate-180 text-gold-400' : ''}`} />
            </button>

            {educationDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-72 glass-dropdown rounded-xl p-2 border border-gold-500/20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                role="menu"
              >
                <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-gold-400 font-semibold border-b border-slate-700/50 mb-1">
                  Learn About Astronomy
                </div>
                <button
                  role="menuitem"
                  onClick={() => handlePageNavigation('education')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                    <span>Education Home</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>
                <button
                  role="menuitem"
                  onClick={() => handleScrollTo('image-gallery')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg text-left transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
                  Image Gallery
                </button>
                <button
                  role="menuitem"
                  onClick={() => handlePageNavigation('light-pollution')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Moon className="w-3.5 h-3.5 text-gold-400" />
                    <span>Light Pollution Guide</span>
                  </div>
                  <span className="text-[9px] text-emerald-400/80 uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Live</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handlePageNavigation('resources')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-lg ${
              currentRoute === 'resources' ? 'text-blue-400' : 'text-slate-300 hover:text-blue-300'
            }`}
          >
            Resources
          </button>

          <button
            onClick={() => handlePageNavigation('newsletter')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-lg ${
              currentRoute === 'newsletter' ? 'text-gold-400' : 'text-slate-300 hover:text-gold-300'
            }`}
          >
            Newsletter
          </button>
        </nav>

        {/* Right Action Buttons - Standardized styling */}
        <div className="hidden sm:flex items-center gap-3">
          {/* VAO Secondary Button */}
          <a
            href={OBSERVATORY_CONFIG.VAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-gold-500/40 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            title="Open Virtual Astronomy Observatory in a new tab"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>VAO Observatory</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>

          {/* Book a Session Prominent Button (Standardized) */}
          <button
            onClick={() => handlePageNavigation('book-session')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#040711] bg-gold-500 hover:bg-gold-400 rounded-xl shadow-[0_4px_14px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book a Session</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => handlePageNavigation('book-session')}
            className="sm:hidden px-3 py-1.5 text-xs font-semibold text-[#040711] bg-gold-500 hover:bg-gold-400 rounded-xl shadow-[0_2px_10px_rgba(212,175,55,0.3)] transition-all"
          >
            Book
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-dropdown border-t border-gold-500/20 px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => handleScrollTo('top')}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
          >
            Home
          </button>
          
          <button
            onClick={() => handleScrollTo('tonights-sky')}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
          >
            Tonight's Sky
          </button>

          <button
            onClick={() => handleScrollTo('telescopes')}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
          >
            Available Telescopes
          </button>

          {/* About Mobile Group */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold px-3 py-1 block">
              About IAO
            </span>
            <button
              onClick={() => handleScrollTo('foundation')}
              className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
            >
              Foundation
            </button>
            <button
              onClick={() => handleScrollTo('team')}
              className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
            >
              Observatory Team
            </button>
            <button
              onClick={() => handleScrollTo('faqs')}
              className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
            >
              FAQs
            </button>
          </div>

          {/* Education & Resources Mobile Group */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold px-3 py-1 block">
              Education & Media
            </span>
            <button
              onClick={() => handlePageNavigation('education')}
              className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
            >
              Education Home
            </button>
            <button
              onClick={() => handleScrollTo('image-gallery')}
              className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
            >
              Image Gallery
            </button>
            <button
              onClick={() => handlePageNavigation('light-pollution')}
              className="w-full flex items-center justify-between px-4 py-1.5 text-xs text-slate-300 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
            >
              <span>Light Pollution Guide</span>
              <span className="text-[9px] text-emerald-400 uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Live</span>
            </button>
          </div>

          {/* Resources Mobile Group */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold px-3 py-1 block">
              Resources & Tools
            </span>
            <button
              onClick={() => handlePageNavigation('resources')}
              className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
            >
              Astronomy Resources
            </button>
          </div>

          {/* Newsletter Mobile */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => handlePageNavigation('newsletter')}
              className="w-full flex items-center justify-between px-4 py-1.5 text-xs text-slate-300 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg"
            >
              <span>Observatory Newsletter</span>
              <span className="text-[9px] text-gold-400 uppercase font-mono px-1.5 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">Soon</span>
            </button>
          </div>

          {/* External Links Mobile */}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href={OBSERVATORY_CONFIG.VAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-xl"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                VAO Virtual Observatory
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={() => handlePageNavigation('book-session')}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[#040711] bg-gold-500 hover:bg-gold-400 rounded-xl shadow-[0_4px_14px_rgba(212,175,55,0.35)] transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book an Observation Session</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
