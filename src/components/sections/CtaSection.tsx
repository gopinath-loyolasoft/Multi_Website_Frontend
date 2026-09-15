import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTemplateTheme } from '../../themes/ThemeContext';

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
  const { styles } = useTemplateTheme();
  const cta = styles.cta;

  if (!content.headline && !content.buttonText) return null;

  return (
    <section className={cta.sectionBg}>
      <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
        
        {/* Badge */}
        {(content.badge || true) && (
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs ${cta.badgeClass}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.badge || 'ADMISSIONS 2026-27 ACTIVE'}</span>
          </div>
        )}

        {/* Headline */}
        {content.headline && (
          <h2 className={cta.headlineFont}>
            {content.headline}
          </h2>
        )}

        {/* Subheadline */}
        {content.subheadline && (
          <p className={cta.subheadlineFont}>
            {content.subheadline}
          </p>
        )}

        {/* Action Buttons */}
        {(content.buttonText || content.secondaryButtonText) && (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {content.buttonText && (
              <Link
                to={content.buttonUrl || '/admissions'}
                className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm transition transform hover:-translate-y-0.5 ${cta.primaryBtnClass}`}
              >
                <span>{content.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {content.secondaryButtonText && (
              <Link
                to={content.secondaryButtonUrl || '/contact'}
                className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm transition backdrop-blur-md ${cta.secondaryBtnClass}`}
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
