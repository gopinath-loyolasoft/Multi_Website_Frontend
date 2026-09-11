import React from 'react';

interface LogoItem {
  name: string;
  logoUrl?: string;
  url?: string;
}

interface LogoGridProps {
  content: {
    title?: string;
    subtitle?: string;
    logos?: LogoItem[];
  };
}

export const LogoGridSection: React.FC<LogoGridProps> = ({ content }) => {
  const logos = content.logos && content.logos.length > 0 ? content.logos : [];
  if (logos.length === 0) return null;

  const renderLogo = (l: LogoItem) => {
    const inner = l.logoUrl ? (
      <img
        src={l.logoUrl}
        alt={l.name}
        loading="lazy"
        className="h-12 w-auto max-w-[160px] object-contain"
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = 'none';
        }}
      />
    ) : (
      <span className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-wider uppercase">
        {l.name}
      </span>
    );

    if (l.url) {
      return (
        <a
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center hover:scale-105 hover:shadow-md transition duration-300 min-w-[140px] min-h-[64px]"
          title={l.name}
        >
          {inner}
        </a>
      );
    }

    return (
      <div
        className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center hover:scale-105 hover:shadow-md transition duration-300 min-w-[140px] min-h-[64px]"
        title={l.name}
      >
        {inner}
      </div>
    );
  };

  return (
    <section className="py-14 bg-slate-50 dark:bg-slate-950 transition-colors border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 text-center space-y-6">
        {content.title && (
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {content.title}
          </h3>
        )}
        {content.subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">{content.subtitle}</p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {logos.map((l, i) => (
            <div key={i}>{renderLogo(l)}</div>
          ))}
        </div>
      </div>
    </section>
  );
};
