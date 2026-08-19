import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Camera, 
  ArrowRight, 
  ExternalLink
} from 'lucide-react';
import { GALLERY_DATA } from '../data/galleryData';
import { OBSERVATORY_CONFIG } from '../config/observatory';

export const ImageGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = GALLERY_DATA.length;
  const currentItem = GALLERY_DATA[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying) {
      autoplayTimerRef.current = setInterval(nextSlide, 6000);
    } else if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

  const handleScrollToTelescopes = () => {
    const el = document.getElementById('telescopes');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="image-gallery"
      aria-labelledby="gallery-heading"
      className="py-16 bg-[#040711] border-t border-slate-800 scroll-mt-20 relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="IAO Astrophotography Gallery"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-800 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Astrophotography & Deck Archives</span>
            </div>
            <h2 id="gallery-heading" className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Captured at IAO
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl">
              An evolving gallery archive of celestial targets photographed through the observatory's optical systems and research instrumentation.
            </p>
          </div>

          {/* Standardized Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleScrollToTelescopes}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#040711] bg-gold-500 hover:bg-gold-400 rounded-xl shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>See Telescopes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={OBSERVATORY_CONFIG.VAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-gold-500/40 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Visit VAO</span>
              <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Carousel Presentation Frame */}
        <div 
          className="glass-card-dark rounded-3xl p-4 sm:p-7 border border-slate-800 relative overflow-hidden shadow-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Slide Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[380px]">
            
            {/* Visual Media Placeholder Box (7 cols) */}
            <div className="lg:col-span-7 relative h-[260px] sm:h-[340px] lg:h-[380px] rounded-2xl overflow-hidden border border-slate-700/80 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-br bg-slate-950 shadow-inner">
              
              {/* Background Simulation */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentItem.placeholderColor || 'from-slate-900 to-space-950'} opacity-70`} />
              
              {/* Star Particle Backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

              {/* Target Graphic / Placeholder Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider bg-space-950/80 text-gold-300 border border-gold-500/30 backdrop-blur-md">
                  {currentItem.category}
                </span>

                <span className="text-[11px] font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded border border-slate-700">
                  SLOT {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                </span>
              </div>

              {/* Center Stylized Placeholder Icon */}
              <div className="relative z-10 text-center my-auto">
                <div className="w-16 h-16 rounded-full border border-gold-500/30 bg-space-950/70 flex items-center justify-center mx-auto mb-2.5 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                  <Camera className="w-8 h-8 text-gold-400" />
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-slate-300 font-medium">
                  Genuine Image Slot
                </div>
                <div className="text-[10px] text-gold-400/80 font-mono mt-0.5">
                  [Pending Official IAO Astrophotography Asset]
                </div>
              </div>

              {/* Bottom Target Tag */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 bg-space-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 backdrop-blur-sm">
                <span>Target: <strong className="font-medium text-white">{currentItem.targetObject}</strong></span>
                <span className="font-mono text-gold-400 text-[11px]">IAO Archive</span>
              </div>
            </div>

            {/* Metadata & Editorial Details (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5 lg:pl-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-1.5">
                  Observation Record
                </div>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white mb-2.5">
                  {currentItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                  {currentItem.caption}
                </p>

                {/* Technical Metadata Table */}
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Optics / Sensor:</span>
                    <span className="font-mono text-slate-200 text-right max-w-[200px] truncate font-medium" title={currentItem.equipment}>
                      {currentItem.equipment}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Capture Date:</span>
                    <span className="font-mono text-slate-200 font-medium">{currentItem.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Credit / Team:</span>
                    <span className="font-mono text-gold-300 font-medium">{currentItem.creditPlaceholder}</span>
                  </div>
                </div>
              </div>

              {/* Controls Bar: Prev, Next, Play/Pause, Slide Dots */}
              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 gap-3">
                
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5" role="tablist">
                  {GALLERY_DATA.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      role="tab"
                      aria-selected={currentIndex === idx}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        currentIndex === idx
                          ? 'w-7 bg-gold-400 shadow-[0_0_8px_#d4af37]'
                          : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow and Playback Buttons - Standardized */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
