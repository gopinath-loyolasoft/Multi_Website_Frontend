import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Download, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';

interface NoticeItem {
  title: string;
  category?: string;
  publishDate?: string;
  pdfUrl?: string;
  isImportant?: boolean;
}

export const NoticesPage: React.FC = () => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await apiClient.get('/site/notices', { params: { limit: 100 } });
        if (res.data.success && Array.isArray(res.data.data)) {
          setNotices(res.data.data.map((n: any) => ({
            title: n.title,
            category: n.category || 'NOTICE',
            publishDate: n.publishDate ? new Date(n.publishDate).toLocaleDateString() : undefined,
            pdfUrl: n.pdfUrl,
            isImportant: n.isImportant,
          })));
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load notices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const heroBg = isArtsAndScience
    ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950'
    : isMedical
    ? 'bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950'
    : isUniversity
    ? 'bg-gradient-to-r from-rose-950 via-slate-950 to-slate-900'
    : 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900';

  const titleFont = isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans';

  return (
    <div className={`min-h-screen ${isArtsAndScience ? 'bg-amber-50/30' : isMedical ? 'bg-teal-50/20' : 'bg-slate-50'}`}>
      {/* Header Banner */}
      <section className={`relative ${heroBg} text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            <Bell className="w-4 h-4 text-amber-300" />
            <span>{isArtsAndScience ? 'Scholarly Circulars & Directives' : isMedical ? 'Clinical Bulletins & Directives' : isUniversity ? 'Official Gazette & Circulars' : 'Official Circulars'}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 ${titleFont}`}>
            Notices & Official Announcements
          </h1>
          <p className={`text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isArtsAndScience ? 'font-serif' : ''}`}>
            Circulars, examination schedules, admission updates, and institutional announcements.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-20 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-200 p-8 max-w-md mx-auto shadow-xs">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-red-700 text-lg">Something went wrong</h3>
            <p className="text-red-500 text-xs mt-1">{error}</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto shadow-xs">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No notices posted</h3>
            <p className="text-slate-500 text-xs mt-1">Check back soon for official circulars.</p>
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
};