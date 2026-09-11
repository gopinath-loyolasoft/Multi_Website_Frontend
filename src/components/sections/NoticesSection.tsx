import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Download, Calendar, ArrowRight } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';

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
    <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Official Circulars</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {content.title || 'Announcements & Circulars'}
            </h2>
            {content.subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {content.subtitle}
              </p>
            )}
          </div>
          <Link
            to="/notices"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline self-start md:self-auto"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
          {notices.map((n, idx) => (
            <div
              key={idx}
              className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {n.isImportant && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                      Important
                    </span>
                  )}
                  {n.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {n.category}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{n.publishDate || 'Recent'}</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {n.title}
                </h4>
              </div>

              {n.pdfUrl && (
                <a
                  href={n.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition"
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
