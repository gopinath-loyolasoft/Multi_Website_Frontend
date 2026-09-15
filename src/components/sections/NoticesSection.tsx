import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Download, Calendar, ArrowRight } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTheme } from '../../themes/ThemeContext';

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
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const isCenterAligned = isArtsAndScience || isUniversity;

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

  const badgeClass = isArtsAndScience 
    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-serif' 
    : isUniversity 
    ? 'bg-rose-100 text-rose-900 border border-rose-200 font-serif' 
    : isMedical 
    ? 'bg-teal-100 text-teal-800 border border-teal-200 font-sans' 
    : 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 font-sans';

  const headingFont = isArtsAndScience 
    ? 'font-serif font-bold text-emerald-950 dark:text-emerald-50 text-3xl sm:text-4xl' 
    : isUniversity 
    ? 'font-serif font-bold text-rose-950 dark:text-amber-50 text-3xl sm:text-4xl' 
    : isMedical 
    ? 'font-sans font-extrabold text-slate-900 dark:text-white text-3xl sm:text-4xl' 
    : 'font-sans font-black text-slate-900 dark:text-white text-3xl sm:text-4xl';

  const linkColor = isArtsAndScience 
    ? 'text-emerald-700 hover:text-emerald-900 font-serif' 
    : isUniversity 
    ? 'text-rose-900 hover:text-amber-700 font-serif' 
    : isMedical 
    ? 'text-cyan-700 hover:text-cyan-900' 
    : 'text-primary hover:underline';

  const sectionBg = isEngineering
    ? 'py-16 bg-slate-900 text-white border-y border-slate-800'
    : isArtsAndScience
    ? 'py-16 bg-[#f5f2eb] text-slate-900 border-y border-emerald-900/10'
    : isMedical
    ? 'py-16 bg-slate-50 text-slate-900 border-y border-cyan-100'
    : 'py-16 bg-[#f7f4ee] text-slate-900 border-y border-stone-200';

  const containerBg = isEngineering
    ? 'bg-slate-950 text-white rounded-2xl border border-slate-800 divide-y divide-slate-800 shadow-xl overflow-hidden'
    : isArtsAndScience
    ? 'bg-white text-slate-900 rounded-2xl border-2 border-emerald-800/15 divide-y divide-emerald-100 shadow-sm overflow-hidden'
    : isMedical
    ? 'bg-white text-slate-900 rounded-2xl border border-cyan-200 divide-y divide-cyan-100 shadow-sm overflow-hidden'
    : 'bg-white text-slate-900 rounded-2xl border-t-4 border-t-rose-900 border-x border-b border-stone-200 divide-y divide-stone-100 shadow-sm overflow-hidden';

  const itemHover = isEngineering
    ? 'hover:bg-slate-900/60'
    : isArtsAndScience
    ? 'hover:bg-emerald-50/50'
    : isMedical
    ? 'hover:bg-cyan-50/50'
    : 'hover:bg-stone-50';

  return (
    <section className={sectionBg}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        {isCenterAligned ? (
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-3 flex flex-col items-center">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
              <Bell className="w-3.5 h-3.5" />
              <span>Official Circulars & Notifications</span>
            </div>
            <h2 className={headingFont}>
              {content.title || 'Announcements & Circulars'}
            </h2>
            {content.subtitle && (
              <p className="text-sm opacity-80 max-w-2xl mx-auto">
                {content.subtitle}
              </p>
            )}
            <Link
              to="/notices"
              className={`inline-flex items-center gap-1 text-xs font-bold pt-1 ${linkColor}`}
            >
              <span>View All Notices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${badgeClass}`}>
                <Bell className="w-3.5 h-3.5" />
                <span>Official Circulars</span>
              </div>
              <h2 className={headingFont}>
                {content.title || 'Announcements & Circulars'}
              </h2>
              {content.subtitle && (
                <p className="text-sm opacity-80 mt-1">
                  {content.subtitle}
                </p>
              )}
            </div>
            <Link
              to="/notices"
              className={`inline-flex items-center gap-1 text-xs font-bold self-start md:self-auto ${linkColor}`}
            >
              <span>View All Notices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className={containerBg}>
          {notices.map((n, idx) => (
            <div
              key={idx}
              className={`p-5 ${itemHover} transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {n.isImportant && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                      Important
                    </span>
                  )}
                  {n.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-current">
                      {n.category}
                    </span>
                  )}
                  <span className="text-xs opacity-60 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{n.publishDate || 'Recent'}</span>
                  </span>
                </div>
                <h4 className={`text-sm font-bold ${isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans'}`}>
                  {n.title}
                </h4>
              </div>

              {n.pdfUrl && (
                <a
                  href={n.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-500/10 hover:bg-primary hover:text-white transition"
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
