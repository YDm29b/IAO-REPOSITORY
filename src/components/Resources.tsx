import React, { useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Wrench, BookOpen, Map, Building2, Globe, ChevronRight, Settings, Package, FileText } from 'lucide-react';
import { RESOURCES_CATEGORIES } from '../data/resourcesData';
import { ResourceCategory, ResourceItem } from '../types';

interface ResourcesProps {
  onNavigateHome: () => void;
  onNavigatePage: (route: string) => void;
}

export const Resources: React.FC<ResourcesProps> = ({ onNavigateHome, onNavigatePage }) => {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'guide': return <BookOpen className="w-6 h-6" />;
      case 'download': return <Download className="w-6 h-6" />;
      case 'tools': return <Wrench className="w-6 h-6" />;
      case 'observatory': return <Building2 className="w-6 h-6" />;
      case 'external': return <Globe className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <FileText className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      case 'tool': return <Settings className="w-4 h-4" />;
      case 'external': return <ExternalLink className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleCategoryClick = (category: ResourceCategory) => {
    setSelectedCategory(category);
    setSelectedItem(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItem(null);
  };

  const handleItemClick = (item: ResourceItem) => {
    if (item.url) {
      if (item.url.startsWith('#')) {
        // Internal link
        const route = item.url.replace('#', '');
        if (route === 'tonights-sky' || route === 'telescopes' || route === 'light-pollution') {
          onNavigatePage(route);
        } else {
          onNavigateHome();
          setTimeout(() => {
            const element = document.getElementById(route);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      } else {
        // External link
        window.open(item.url, '_blank', 'noopener noreferrer');
      }
    } else if (item.downloadUrl) {
      // Download link
      window.open(item.downloadUrl, '_blank');
    } else {
      // Show content
      setSelectedItem(item);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold uppercase">
            Available
          </span>
        );
      case 'coming-soon':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/40 text-amber-400 border border-amber-500/30 text-[10px] font-semibold uppercase">
            Coming Soon
          </span>
        );
      case 'placeholder':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold uppercase">
            Planned
          </span>
        );
      default:
        return null;
    }
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
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-blue-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.25)] shrink-0">
            <Wrench className="w-8 h-8 text-blue-400" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
              <Settings className="w-3.5 h-3.5" />
              <span>Tools, Guides, Downloads & Materials</span>
            </div>
            
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Astronomy Resources
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Practical resources to help you observe, explore, and learn. Download star charts, access observation guides, use interactive tools, and connect with external astronomy resources.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!selectedCategory ? (
        <div className="space-y-4">
          <div className="text-slate-400 text-sm mb-6">
            <span className="text-blue-400 font-semibold">Resource Categories:</span> Select a category to explore available resources
          </div>
          
          {RESOURCES_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="w-full glass-card-dark rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 text-left group"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-blue-500/40 transition-colors">
                  <span className="text-blue-400">
                    {getIcon(category.icon)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif-display text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {category.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="text-blue-400 font-semibold">{category.items.length} resources</span>
                    <span>•</span>
                    <span>{category.items.filter(item => item.status === 'available').length} available</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : selectedItem ? (
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-blue-300 hover:border-blue-500/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {selectedCategory.title}</span>
          </button>

          {/* Item Detail */}
          <div className="glass-card-dark rounded-2xl p-8 border border-slate-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-blue-500/40 flex items-center justify-center shrink-0">
                <span className="text-blue-400">
                  {getTypeIcon(selectedItem.type)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-serif-display text-2xl font-bold text-white">
                    {selectedItem.title}
                  </h2>
                  {getStatusBadge(selectedItem.status)}
                </div>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {selectedItem.description}
                </p>
              </div>
            </div>

            {selectedItem.content && (
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wider">
                  {selectedItem.type === 'guide' ? 'Guide Content' : 'Resource Details'}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedItem.content}
                </p>
              </div>
            )}

            {selectedItem.status === 'placeholder' && (
              <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                <p className="text-slate-400 text-xs">
                  This resource is currently being developed. Check back soon for updates or contact the observatory for more information.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={handleBackToCategories}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-blue-300 hover:border-blue-500/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Categories</span>
          </button>

          {/* Category Header */}
          <div className="glass-card-dark rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-blue-500/40 flex items-center justify-center shrink-0">
                <span className="text-blue-400">
                  {getIcon(selectedCategory.icon)}
                </span>
              </div>
              
              <div>
                <h2 className="font-serif-display text-2xl font-bold text-white mb-1">
                  {selectedCategory.title}
                </h2>
                <p className="text-slate-400 text-sm">
                  {selectedCategory.description}
                </p>
              </div>
            </div>
          </div>

          {/* Resource Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategory.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="glass-card-dark rounded-xl p-5 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-blue-500/40 transition-colors">
                    <span className="text-blue-400">
                      {getTypeIcon(item.type)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors truncate">
                        {item.title}
                      </h3>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {item.url && (
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
