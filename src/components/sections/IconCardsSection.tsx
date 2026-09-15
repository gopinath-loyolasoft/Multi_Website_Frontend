import React from 'react';
import { 
  Globe2, 
  Award, 
  Compass,
  Lightbulb
} from 'lucide-react';
import { useTheme } from '../../themes/ThemeContext';

interface IconCardItem {
  title: string;
  description: string;
  icon?: string;
}

interface IconCardsProps {
  content: {
    title?: string;
    subtitle?: string;
    columns?: number;
    items?: IconCardItem[];
  };
}

export const IconCardsSection: React.FC<IconCardsProps> = ({ content }) => {
  const { isArtsAndScience, isUniversity } = useTheme();
  const isCenterAligned = isArtsAndScience || isUniversity;

  const items = content.items && content.items.length > 0 ? content.items : [];
  if (items.length === 0) return null;
  const colClass = content.columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Globe2': return <Globe2 className="w-6 h-6 text-primary" />;
      case 'Lightbulb': return <Lightbulb className="w-6 h-6 text-amber-500" />;
      case 'Compass': return <Compass className="w-6 h-6 text-emerald-500" />;
      default: return <Award className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        {(content.title || content.subtitle) && (
          <div className={`${isCenterAligned ? 'text-center max-w-2xl mx-auto' : 'text-left max-w-2xl'} mb-12 space-y-2`}>
            {content.title && (
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 ${colClass} gap-6`}>
          {items.map((it, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition duration-300 space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                {getIcon(it.icon)}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {it.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {it.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
