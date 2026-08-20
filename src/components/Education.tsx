import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Star, 
  Moon, 
  Map, 
  Camera, 
  GraduationCap, 
  Binoculars,
  Search,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { EDUCATION_TOPICS } from '../data/educationData';
import { EducationTopic, EducationSubtopic } from '../types';

interface EducationProps {
  onNavigateHome: () => void;
  onNavigatePage: (route: string) => void;
  selectedTopicId?: string | null;
}

export const Education: React.FC<EducationProps> = ({ 
  onNavigateHome, 
  onNavigatePage,
  selectedTopicId
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(selectedTopicId || 'astronomy-basics');
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null);
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  useEffect(() => {
    if (selectedTopicId) {
      setActiveTopicId(selectedTopicId);
      setActiveSubtopicId(null);
    }
  }, [selectedTopicId]);

  const activeTopic: EducationTopic = EDUCATION_TOPICS.find(t => t.id === activeTopicId) || EDUCATION_TOPICS[0];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="w-4 h-4 text-gold-400" />;
      case 'telescope': return <Binoculars className="w-4 h-4 text-gold-400" />;
      case 'moon': return <Moon className="w-4 h-4 text-gold-400" />;
      case 'constellation': return <Map className="w-4 h-4 text-gold-400" />;
      case 'camera': return <Camera className="w-4 h-4 text-gold-400" />;
      case 'book': return <BookOpen className="w-4 h-4 text-gold-400" />;
      default: return <GraduationCap className="w-4 h-4 text-gold-400" />;
    }
  };

  const handleTopicSelect = (topicId: string) => {
    if (topicId === 'light-pollution') {
      onNavigatePage('light-pollution');
      return;
    }
    setActiveTopicId(topicId);
    setActiveSubtopicId(null);
  };

  // Filter glossary content if glossary active
const renderGlossary = () => {
  const lines = (activeTopic.content || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const titleLine = lines[0] || 'Astronomy Glossary';
  const terms = lines.slice(1);

  const filtered = terms.filter(termBlock =>
    termBlock.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Glossary Header + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card-dark p-6 rounded-2xl border border-gold-500/20">
        <div>
          <h3 className="text-lg font-serif-display font-bold text-white mb-1">
            {titleLine}
          </h3>
          <p className="text-xs text-slate-400">
            Search astronomical terms, coordinates, telescope concepts, and observational measurements.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

          <input
            type="text"
            value={glossarySearch}
            onChange={(e) => setGlossarySearch(e.target.value)}
            placeholder="Search glossary terms..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 font-normal"
          />
        </div>
      </div>

      {/* Search Result Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
          {glossarySearch && ` matching "${glossarySearch}"`}
        </p>

        {glossarySearch && (
          <button
            onClick={() => setGlossarySearch('')}
            className="text-[11px] text-gold-400 hover:text-gold-300 transition-colors"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Glossary Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((termBlock, index) => {
            const colonIndex = termBlock.indexOf(':');

            const termName =
              colonIndex !== -1
                ? termBlock
                    .slice(0, colonIndex)
                    .replace(/^•\s*/, '')
                    .trim()
                : termBlock.replace(/^•\s*/, '').trim();

            const termDef =
              colonIndex !== -1
                ? termBlock.slice(colonIndex + 1).trim()
                : '';

            return (
              <div
                key={`${termName}-${index}`}
                className="glass-card-dark rounded-xl p-5 border border-slate-800 hover:border-gold-500/30 transition-all"
              >
                <div className="flex items-start gap-2 text-gold-400 font-serif-display text-sm font-semibold mb-2">
                  <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{termName}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {termDef}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card-dark rounded-2xl p-10 border border-slate-800 text-center">
          <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />

          <h4 className="text-sm font-semibold text-slate-300 mb-1">
            No glossary terms found
          </h4>

          <p className="text-xs text-slate-500">
            Try searching for another astronomical term.
          </p>
        </div>
      )}
    </div>
  );
};

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="glass-card-dark rounded-3xl p-6 sm:p-10 border border-gold-500/20 shadow-2xl relative overflow-hidden mb-8 backdrop-blur-lg">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-gold-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0">
              <GraduationCap className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>IAO Academic Syllabus</span>
              </div>
              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                Astronomy Education & Science
              </h1>
            </div>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed font-light">
            Comprehensive learning modules curated by observatory astronomers, covering astrophysics, telescope optical design, celestial mechanics, and observational astrophotography.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Topic Sidebar + Main Educational Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Topic Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-gold-400 font-semibold border-b border-slate-800 mb-2">
            Educational Modules
          </div>

          {EDUCATION_TOPICS.map((topic) => {
            const isActive = activeTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 shadow-md'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-gold-500/20' : 'bg-slate-800'}`}>
                    {getIcon(topic.icon)}
                  </div>
                  <span className="font-medium text-xs truncate">{topic.title}</span>
                </div>
                {topic.id === 'light-pollution' ? (
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-gold-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Educational Topic Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Topic Header Card */}
          <div className="glass-card-dark rounded-2xl p-6 sm:p-8 border border-gold-500/30">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-gold-500/40 flex items-center justify-center shrink-0">
                {getIcon(activeTopic.icon)}
              </div>
              <div>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-white mb-2">
                  {activeTopic.title}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {activeTopic.description}
                </p>
              </div>
            </div>
          </div>

          {/* Render Subtopics or Single Content / Glossary */}
          {activeTopic.id === 'astronomy-glossary' ? (
            renderGlossary()
          ) : activeTopic.subtopics && activeTopic.subtopics.length > 0 ? (
            <div className="space-y-4">
              {/* Subtopic Selector Tabs */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
                <button
                  onClick={() => setActiveSubtopicId(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeSubtopicId === null
                      ? 'bg-gold-500 text-[#040711]'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  All Subtopics
                </button>

                {activeTopic.subtopics.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubtopicId(sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeSubtopicId === sub.id
                        ? 'bg-gold-500/20 border border-gold-500/40 text-gold-300'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {sub.title}
                  </button>
                ))}
              </div>

              {/* Render Subtopic Cards */}
              <div className="grid grid-cols-1 gap-6">
                {activeTopic.subtopics
                  .filter((sub) => activeSubtopicId === null || activeSubtopicId === sub.id)
                  .map((subtopic: EducationSubtopic) => (
                    <div 
                      key={subtopic.id}
                      className="glass-card-dark rounded-2xl p-6 sm:p-8 border border-slate-800 hover:border-gold-500/30 transition-all space-y-4"
                    >
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Star className="w-4 h-4 text-gold-400 shrink-0" />
                        <h3 className="font-serif-display text-xl font-bold text-white">
                          {subtopic.title}
                        </h3>
                      </div>

                      <p className="text-xs text-gold-400 font-medium italic">
                        {subtopic.description}
                      </p>

                      {subtopic.content && (
                        <div className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-light pt-2 border-t border-slate-900">
                          {subtopic.content}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ) : activeTopic.content ? (
            <div className="glass-card-dark rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-light">
                {activeTopic.content}
              </div>

              {activeTopic.id === 'light-pollution' && (
                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => onNavigatePage('light-pollution')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 text-[#040711] text-xs font-semibold hover:bg-gold-400 transition-all shadow-[0_4px_14px_rgba(212,175,55,0.3)]"
                  >
                    <span>Open Interactive Light Pollution Guide</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : null}

        </div>
      </div>

    </div>
  );
};
