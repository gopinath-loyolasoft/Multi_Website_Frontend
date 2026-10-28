import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { TabItem } from '../../types';

interface TabsSectionProps {
  content: {
    badge?: string;
    title?: string;
    subtitle?: string;
    tabs?: TabItem[];
  };
}

export const TabsSection: React.FC<TabsSectionProps> = ({ content }) => {
  const tabs = Array.isArray(content.tabs) ? content.tabs : [];
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  if (tabs.length === 0) return null;

  const currentTab = tabs[activeTabIdx] || tabs[0];
  const sectionBadge = content.badge || 'Academic & Campus Highlights';
  const sectionTitle = content.title || 'Explore Our Academic Ecosystem';
  const sectionSubtitle = content.subtitle || 'Select a tab below to explore curriculum, research labs, career outcomes, and student services';

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
          {sectionBadge && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{sectionBadge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* Tab Buttons Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          {tabs.map((tab, idx) => {
            const isActive = activeTabIdx === idx;
            return (
              <button
                key={tab.id || idx}
                onClick={() => setActiveTabIdx(idx)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{tab.title}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Panel */}
        {currentTab && (
          <div className="bg-slate-50 dark:bg-slate-950/80 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-primary shrink-0" />
                <span>{currentTab.title}</span>
              </h3>
              {currentTab.badge && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                  {currentTab.badge}
                </span>
              )}
            </div>

            <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
              {currentTab.content}
            </div>

            {currentTab.buttonText && currentTab.buttonUrl && (
              <div className="pt-2">
                <Link
                  to={currentTab.buttonUrl}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-95 transition shadow-sm"
                >
                  <span>{currentTab.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
