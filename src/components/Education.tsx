import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Star, Moon, Map, Camera, ChevronRight, GraduationCap, Binoculars } from 'lucide-react';
import { EDUCATION_TOPICS } from '../data/educationData';
import { EducationTopic } from '../types';

interface EducationProps {
  onNavigateHome: () => void;
  onNavigatePage: (route: string) => void;
}

export const Education: React.FC<EducationProps> = ({ onNavigateHome, onNavigatePage }) => {
  const [selectedTopic, setSelectedTopic] = useState<EducationTopic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="w-6 h-6" />;
      case 'telescope': return <Binoculars className="w-6 h-6" />;
      case 'moon': return <Moon className="w-6 h-6" />;
      case 'constellation': return <Map className="w-6 h-6" />;
      case 'camera': return <Camera className="w-6 h-6" />;
      case 'book': return <BookOpen className="w-6 h-6" />;
      default: return <GraduationCap className="w-6 h-6" />;
    }
  };

  const handleTopicClick = (topic: EducationTopic) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedSubtopic(null);
  };

  const handleSubtopicClick = (subtopicId: string) => {
    setSelectedSubtopic(subtopicId);
  };

  const handleLightPollutionClick = () => {
    onNavigatePage('light-pollution');
  };

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
      <div className="glass-card-dark rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden mb-8 backdrop-blur-lg">
        {/* Glow ambient */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-gold-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0">
            <GraduationCap className="w-8 h-8 text-gold-400" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learn About Astronomy</span>
            </div>
            
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Astronomy Education
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Explore the wonders of the universe through our comprehensive educational resources. From understanding the basics of stargazing to advanced astrophotography techniques, discover the science behind the stars.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!selectedTopic ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDUCATION_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => topic.id === 'light-pollution' ? handleLightPollutionClick() : handleTopicClick(topic)}
              className="glass-card-dark rounded-2xl p-6 border border-slate-800 hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1 text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-4 group-hover:border-gold-500/40 transition-colors">
                <span className="text-gold-400">
                  {getIcon(topic.icon)}
                </span>
              </div>
              
              <h3 className="font-serif-display text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                {topic.title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {topic.description}
              </p>
              
              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold">
                <span>Explore</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={handleBackToTopics}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Topics</span>
          </button>

          {/* Topic Header */}
          <div className="glass-card-dark rounded-2xl p-8 border border-slate-800">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-gold-500/40 flex items-center justify-center shrink-0">
                <span className="text-gold-400">
                  {getIcon(selectedTopic.icon)}
                </span>
              </div>
              
              <div>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-white mb-3">
                  {selectedTopic.title}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  {selectedTopic.description}
                </p>
              </div>
            </div>
          </div>

          {/* Subtopics */}
          {selectedTopic.subtopics && selectedTopic.subtopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTopic.subtopics.map((subtopic) => (
                <button
                  key={subtopic.id}
                  onClick={() => handleSubtopicClick(subtopic.id)}
                  className={`glass-card-dark rounded-xl p-6 border transition-all duration-300 text-left group ${
                    selectedSubtopic === subtopic.id 
                      ? 'border-gold-500/50 bg-gold-500/5' 
                      : 'border-slate-800 hover:border-gold-500/40'
                  }`}
                >
                  <h3 className="font-semibold text-white mb-2 group-hover:text-gold-300 transition-colors">
                    {subtopic.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {subtopic.description}
                  </p>
                  {selectedSubtopic === subtopic.id && subtopic.content && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {subtopic.content}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : selectedTopic.content ? (
            <div className="glass-card-dark rounded-2xl p-8 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedTopic.content}
              </p>
            </div>
          ) : null}
        </div>
      )}

    </div>
  );
};
