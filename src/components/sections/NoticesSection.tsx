import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Download, Calendar, ArrowRight } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTemplateTheme } from '../../themes/ThemeContext';

interface NoticeItem {
  title: string;
  category?: string;
  publishDate?: string;
  pdfUrl?: string;
  isImportant?: boolean;
}

interface NoticesProps {
  content: {
    title?: string;
    subtitle?: string;
    items?: NoticeItem[];
  };
}

export const NoticesSection: React.FC<NoticesProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const noticeStyles = styles.notices;
  const isCenterAligned = noticeStyles.isCentered ?? false;

  const [fetchedNotices, setFetchedNotices] = React.useState<NoticeItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!content.items || content.items.length === 0) {
      setLoading(true);
      apiClient.get('/site/notices', { params: { limit: 5 } })
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setFetchedNotices(res.data.data.map((n: any) => ({
              title: n.title,
              category: n.category || 'NOTICE',
              publishDate: n.publishDate ? new Date(n.publishDate).toLocaleDateString() : undefined,
              pdfUrl: n.pdfUrl,
              isImportant: n.isImportant,
            })));
          }
        })
        .catch(() => setError('Unable to load notices. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [content.items]);

  const notices = content.items && content.items.length > 0 ? content.items : fetchedNotices;
  if (error && !loading) {
    return <SectionError message={error} className="bg-slate-50 dark:bg-slate-950" />;
  }
  if (!loading && notices.length === 0) return null;

  return (
    <section className={`py-8 sm:py-10 ${noticeStyles.sectionBg} transition-colors`}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        {isCenterAligned ? (
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2 flex flex-col items-center">
            {noticeStyles.sectionHeaderBadge && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${noticeStyles.sectionHeaderBadge}`}>
                <Bell className="w-3.5 h-3.5" />
                <span>{noticeStyles.defaultBadgeText || 'Official Circulars & Notifications'}</span>
              </div>
            )}
            <h2 className={noticeStyles.headingFont}>
              {content.title || noticeStyles.defaultTitle || 'Announcements & Circulars'}
            </h2>
            {content.subtitle && (
              <p className={`${noticeStyles.subtitleFont} max-w-2xl mx-auto`}>
                {content.subtitle}
              </p>
            )}
            <Link
              to="/notices"
              className={`inline-flex items-center gap-1 text-xs font-bold pt-0.5 ${noticeStyles.accentText}`}
            >
              <span>View All Notices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3">
            <div>
              {noticeStyles.sectionHeaderBadge && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-1.5 ${noticeStyles.sectionHeaderBadge}`}>
                  <Bell className="w-3.5 h-3.5" />
                  <span>{noticeStyles.defaultBadgeText || 'Official Circulars'}</span>
                </div>
              )}
              <h2 className={noticeStyles.headingFont}>
                {content.title || noticeStyles.defaultTitle || 'Announcements & Circulars'}
              </h2>
              {content.subtitle && (
                <p className={`${noticeStyles.subtitleFont} mt-1`}>
                  {content.subtitle}
                </p>
              )}
            </div>
            <Link
              to="/notices"
              className={`inline-flex items-center gap-1 text-xs font-bold self-start md:self-auto ${noticeStyles.accentText}`}
            >
              <span>View All Notices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className={`${noticeStyles.cardBg} ${noticeStyles.cardBorder} rounded-xl border divide-y divide-current/10 shadow-xs overflow-hidden`}>
          {notices.map((n, idx) => (
            <div
              key={idx}
              className={`${noticeStyles.noticeItemBg || ''} ${noticeStyles.noticeItemBorder || ''} p-3.5 sm:p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {n.isImportant && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                      Important
                    </span>
                  )}
                  {n.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider opacity-80 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {n.category}
                    </span>
                  )}
                  <span className={`text-[11px] flex items-center gap-1 ${noticeStyles.dateBadge || 'opacity-75'}`}>
                    <Calendar className="w-3 h-3" />
                    <span>{n.publishDate || 'Recent'}</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold leading-snug">
                  {n.title}
                </h4>
              </div>

              {n.pdfUrl && (
                <a
                  href={n.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${noticeStyles.accentText} bg-slate-100 dark:bg-slate-800 hover:opacity-80 transition`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
