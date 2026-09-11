import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CtaProps {
  content: {
    headline?: string;
    subheadline?: string;
    badge?: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
  };
}

export const CtaSection: React.FC<CtaProps> = ({ content }) => {
  if (!content.headline && !content.buttonText) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-blue-900 text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
        {content.badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm text-yellow-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.badge}</span>
          </div>
        )}

        {content.headline && (
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            {content.headline}
          </h2>
        )}

        {content.subheadline && (
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {content.subheadline}
          </p>
        )}

        {(content.buttonText || content.secondaryButtonText) && (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {content.buttonText && (
              <Link
                to={content.buttonUrl || '/admissions'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-400/20 transition transform hover:-translate-y-0.5"
              >
                <span>{content.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {content.secondaryButtonText && (
              <Link
                to={content.secondaryButtonUrl || '/contact'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm transition"
              >
                <span>{content.secondaryButtonText}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
