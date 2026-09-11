import React from 'react';

interface ImageProps {
  content: {
    imageUrl?: string;
    caption?: string;
    altText?: string;
    fullWidth?: boolean;
    aspectRatio?: string;
  };
}

export const ImageSection: React.FC<ImageProps> = ({ content }) => {
  const imgUrl = content.imageUrl;
  if (!imgUrl) return null;

  return (
    <section className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className={content.fullWidth ? 'w-full px-0' : 'max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16'}>
        <div className="overflow-hidden rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
          <img
            src={imgUrl}
            alt={content.altText || 'Campus Showcase'}
            className="w-full h-auto max-h-[500px] object-cover"
          />
          {content.caption && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
              {content.caption}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
