import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Wrench, 
  BookOpen, 
  Globe, 
  ChevronRight, 
  Settings, 
  Package, 
  FileText,
  Video,
  Headphones,
  GraduationCap,
  Sparkles,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { RESOURCES_CATEGORIES } from '../data/resourcesData';
import { ResourceCategory, ResourceItem } from '../types';
import { OBSERVATORY_CONFIG } from '../config/observatory';

interface ResourcesProps {
  onNavigateHome: () => void;
  onNavigatePage: (route: string) => void;
}

export const Resources: React.FC<ResourcesProps> = ({ onNavigateHome, onNavigatePage }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('observation-guides');
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const activeCategory: ResourceCategory = RESOURCES_CATEGORIES.find(c => c.id === activeCategoryId) || RESOURCES_CATEGORIES[0];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'guide': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'download': return <Download className="w-4 h-4 text-blue-400" />;
      case 'tools': return <Wrench className="w-4 h-4 text-blue-400" />;
      case 'external': return <Globe className="w-4 h-4 text-blue-400" />;
      default: return <Package className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'download': return <Download className="w-4 h-4 text-emerald-400" />;
      case 'tool': return <Settings className="w-4 h-4 text-gold-400" />;
      case 'video': return <Video className="w-4 h-4 text-purple-400" />;
      case 'audio': return <Headphones className="w-4 h-4 text-pink-400" />;
      case 'paper': return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'external': return <ExternalLink className="w-4 h-4 text-sky-400" />;
      default: return <Package className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleDownload = (item: ResourceItem) => {
    // Generate a clean sample printable document Blob for downloads
    const lat = OBSERVATORY_CONFIG.coordinates.latitude.toFixed(4);
    const lon = OBSERVATORY_CONFIG.coordinates.longitude.toFixed(4);
    let contentHeader = `IST ASTRONOMICAL OBSERVATORY (IAO)\nOfficial Resource Document: ${item.title}\nDate: ${new Date().toLocaleDateString()}\nLocation: Islamabad, Pakistan (${lat}° N, ${lon}° E)\n\n`;
    let sampleContent = item.content || 'Astronomical reference materials and field chart.';
    
    const blob = new Blob([contentHeader + sampleContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage(`Sample document "${item.title}" downloaded successfully.`);
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  const handleItemAction = (item: ResourceItem) => {
    if (item.url) {
      if (item.url.startsWith('#')) {
        const route = item.url.replace('#', '');
        if (route === 'tonights-sky' || route === 'telescopes' || route === 'light-pollution') {
          onNavigatePage(route);
        } else {
          onNavigateHome();
        }
      } else {
        window.open(item.url, '_blank', 'noopener noreferrer');
      }
    } else if (item.downloadUrl) {
      handleDownload(item);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-300 hover:text-blue-300 hover:border-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="glass-card-dark rounded-3xl p-6 sm:p-10 border border-blue-500/30 shadow-2xl relative overflow-hidden mb-8 backdrop-blur-lg">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-blue-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.25)] shrink-0">
              <Wrench className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Observatory Resource Hub</span>
              </div>
              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                Astronomy Resources & Tools
              </h1>
            </div>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed font-light">
            Practical tools, downloadable star charts, video lectures, scientific research papers, and curated links to institutional astronomy databases.
          </p>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccessMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in shadow-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout: Resource Category Tabs + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Category Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-blue-400 font-semibold border-b border-slate-800 mb-2">
            Resource Categories
          </div>

          {RESOURCES_CATEGORIES.map((cat) => {
            const isActive = activeCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setSelectedItem(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-blue-500/15 border border-blue-500/40 text-blue-300 shadow-md'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-slate-800'}`}>
                    {getIcon(cat.icon)}
                  </div>
                  <span className="font-medium text-xs truncate">{cat.title}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Category Header */}
          <div className="glass-card-dark rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-blue-500/40 flex items-center justify-center shrink-0">
                {getIcon(activeCategory.icon)}
              </div>
              <div>
                <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-white mb-1">
                  {activeCategory.title}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  {activeCategory.description}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Item Detail View OR Category Items List */}
          {selectedItem ? (
            <div className="glass-card-dark rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <button
                onClick={() => setSelectedItem(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-blue-300 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to {activeCategory.title}</span>
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/40 shrink-0">
                  {getTypeIcon(selectedItem.type)}
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-2">
                    {selectedItem.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              {selectedItem.content && (
                <div className="pt-4 border-t border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-light">
                  {selectedItem.content}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCategory.items.map((item: ResourceItem) => (
                <div
                  key={item.id}
                  className="glass-card-dark rounded-xl p-5 border border-slate-800 hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                          {getTypeIcon(item.type)}
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                          {item.type}
                        </span>
                      </div>

                      {item.fileSize && (
                        <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {item.fileSize}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif-display text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h3>

                    {item.author && (
                      <div className="text-[11px] text-amber-400/90 font-medium mb-1.5">
                        Authors: {item.author} ({item.year}) • <span className="italic">{item.journal}</span>
                      </div>
                    )}

                    <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Responsive Video Embed */}
                    {item.embedUrl && (
                      <div className="mb-4 rounded-xl overflow-hidden aspect-video border border-slate-800 bg-black">
                        <iframe
                          src={item.embedUrl}
                          title={item.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    {item.status === 'placeholder' ? (
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Future Observatory Upload</span>
                    ) : (
                      <button
                        onClick={() => handleItemAction(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {item.downloadUrl ? (
                          <>
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Download Printable File</span>
                          </>
                        ) : item.url ? (
                          <>
                            <span>Open Resource</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>View Guide Details</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
