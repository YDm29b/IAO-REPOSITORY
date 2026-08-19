import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS_DATA } from '../data/faqsData';

export const Faqs: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // First open by default
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="faqs"
      aria-labelledby="faqs-heading"
      className="py-16 bg-[#040711] border-t border-slate-800 scroll-mt-20 relative"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Visiting & Operations FAQ</span>
          </div>
          <h2 id="faqs-heading" className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            FAQs
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Essential guidelines on booking procedures, weather policies, and observation deck protocols at IAO.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS_DATA.map((faq) => {
            const isOpen = !!openIds[faq.id];

            return (
              <div
                key={faq.id}
                className={`glass-card-dark rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-gold-500/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-2xl"
                >
                  <span className="font-serif-display text-base sm:text-lg font-bold text-white pr-2 flex items-center gap-3">
                    <span className="text-xs font-mono text-gold-400 opacity-80">Q:</span>
                    {faq.question}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-gold-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-200 font-normal">
                    <p className="mb-3">{faq.answer}</p>
                    
                   
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
