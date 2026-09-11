import React from 'react';

interface MapProps {
  content: {
    title?: string;
    subtitle?: string;
    embedUrl?: string;
    address?: string;
    height?: number;
  };
}

export const MapSection: React.FC<MapProps> = ({ content }) => {
  const mapEmbed = content.embedUrl;
  if (!mapEmbed) return null;

  return (
    <section className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        {(content.title || content.subtitle) && (
          <div className="text-center mb-8 space-y-1">
            {content.title && (
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
          <iframe
            src={mapEmbed}
            title="Campus Map Location"
            className="w-full border-0"
            style={{ height: content.height || 420 }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
