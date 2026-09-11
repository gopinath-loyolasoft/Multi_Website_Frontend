import React from 'react';

interface VideoProps {
  content: {
    title?: string;
    subtitle?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
  };
}

export const VideoSection: React.FC<VideoProps> = ({ content }) => {
  const videoUrl = content.videoUrl;
  if (!videoUrl) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-5xl mx-auto px-6">
        {(content.title || content.subtitle) && (
          <div className="text-center mb-10 space-y-2">
            {content.title && (
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black">
          {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com') ? (
            <iframe
              src={videoUrl}
              title={content.title || 'Campus Video Tour'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              controls
              poster={content.thumbnailUrl}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
};
