import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTemplateTheme } from '../../themes/ThemeContext';

interface CardItem {
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  badge?: string;
}

interface CardsProps {
  content: {
    title?: string;
    subtitle?: string;
    columns?: number;
    cards?: CardItem[];
  };
}

export const CardsSection: React.FC<CardsProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const cardStyles = styles.cards;

  const rawCards = content.cards && content.cards.length > 0 ? content.cards : (content as any).items;
  const cards: CardItem[] = Array.isArray(rawCards) ? rawCards : [];
  if (cards.length === 0) return null;
  const colClass = content.columns === 4 ? 'lg:grid-cols-4' : content.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        {(content.title || content.subtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            {content.title && (
              <h2 className={`text-3xl font-black text-slate-900 dark:text-white tracking-tight ${cardStyles.headingFont}`}>
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

        <div className={`grid grid-cols-1 md:grid-cols-2 ${colClass} gap-8`}>
          {cards.map((c, i) => (
            <div
              key={i}
              className={`group ${cardStyles.cardBg} rounded-2xl overflow-hidden shadow-sm hover:shadow-xl ${cardStyles.cardBorder} transition duration-300 flex flex-col`}
            >
              {c.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {c.badge && (
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${cardStyles.badge}`}>
                      {c.badge}
                    </span>
                  )}
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className={`text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition ${cardStyles.headingFont}`}>
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </div>
                {c.linkUrl && (
                  <div className="pt-2">
                    <Link
                      to={c.linkUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
