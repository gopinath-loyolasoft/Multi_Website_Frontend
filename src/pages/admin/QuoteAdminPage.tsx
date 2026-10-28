import React, { useEffect, useState } from 'react';
import { 
  Quote, 
  Save, 
  Check, 
  X, 
  RefreshCw, 
  Sparkles, 
  User, 
  Eye,
  EyeOff
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { QuoteSettings } from '../../types';
import { useTenant } from '../../tenant/TenantContext';
import { FileUploadInput, Switch, useToast } from '../../UI_Componentes/ui';

export const QuoteAdminPage: React.FC = () => {
  const { toast } = useToast();
  const { refreshConfig } = useTenant();
  const [quote, setQuote] = useState<QuoteSettings>({
    quoteText: '',
    authorName: '',
    authorTitle: '',
    designation: '',
    authorImage: '',
    authorImageUrl: '',
    subText: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/quote');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        const img = d.authorImageUrl || d.authorImage || '';
        const title = d.designation || d.authorTitle || '';
        setQuote({
          id: d.id,
          quoteText: d.quoteText || '',
          authorName: d.authorName || '',
          authorTitle: title,
          designation: title,
          authorImage: img,
          authorImageUrl: img,
          subText: d.subText || '',
          isActive: d.isActive !== false,
        });
      }
    } catch (err) {
      console.error('Failed to load quote settings', err);
      showNotification('Failed to load quote settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const toggleVisibility = async () => {
    try {
      setToggling(true);
      const nextState = !quote.isActive;
      setQuote((prev) => ({ ...prev, isActive: nextState }));
      const res = await apiClient.patch('/admin/quote/visibility', { isActive: nextState });
      if (res.data.success) {
        showNotification(`Quote section is now ${nextState ? 'Active' : 'Hidden'}`);
        try {
          await refreshConfig();
        } catch {
          // ignore background refresh err
        }
      } else {
        showNotification('Failed to toggle visibility', 'error');
        setQuote((prev) => ({ ...prev, isActive: !nextState }));
      }
    } catch {
      showNotification('Failed to toggle visibility', 'error');
      setQuote((prev) => ({ ...prev, isActive: !quote.isActive }));
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        quoteText: quote.quoteText,
        authorName: quote.authorName?.trim() || '',
        designation: (quote.authorTitle || quote.designation || '').trim(),
        authorTitle: (quote.authorTitle || quote.designation || '').trim(),
        authorImageUrl: (quote.authorImageUrl || quote.authorImage || '').trim(),
        authorImage: (quote.authorImageUrl || quote.authorImage || '').trim(),
        subText: quote.subText?.trim() || '',
        isActive: quote.isActive,
      };
      const res = await apiClient.put('/admin/quote', payload);
      if (res.data.success) {
        showNotification('Leadership quote updated and published!');
        await fetchQuote();
        try {
          await refreshConfig();
        } catch {
          // ignore background refresh err
        }
      } else {
        showNotification(res.data.message || 'Failed to update quote', 'error');
      }
    } catch {
      showNotification('Failed to save quote settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentImage = quote.authorImageUrl || quote.authorImage || '';
  const currentTitle = quote.authorTitle || quote.designation || '';

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <Quote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Welcome Quote & Leadership Message</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Display an inspiring quote or leadership welcome message on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchQuote}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top Collapsible Visual Live Preview Monitor (DARK & LIGHT MODE) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${quote.isActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Live Quote Banner Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleVisibility}
              disabled={toggling}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                quote.isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {quote.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{quote.isActive ? 'Active on Home Page' : 'Hidden from Visitors'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="p-6 sm:p-10 bg-slate-100/90 dark:bg-slate-950/60">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
              {/* Author Photo if available, or Quote icon cameo */}
              {currentImage ? (
                <div className="shrink-0 relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900/50 shadow-md bg-slate-100 dark:bg-slate-800">
                    <img
                      key={currentImage}
                      src={currentImage}
                      alt={quote.authorName || 'Author'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/assets/templates/common/leader_portrait.svg';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md">
                    <Quote className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                  <Quote className="w-8 h-8" />
                </div>
              )}

              {/* Quote Content */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <blockquote className="text-base md:text-lg font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed">
                  "{quote.quoteText || 'Please enter your quote message below.'}"
                </blockquote>
                {(quote.authorName || currentTitle || quote.subText) && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    {quote.authorName && (
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{quote.authorName}</div>
                    )}
                    {currentTitle && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{currentTitle}</div>
                    )}
                    {quote.subText && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{quote.subText}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center pt-4">
              * Renders dynamically on your homepage as configured below.
            </p>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Edit Quote Information
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {quote.isActive ? '🟢 Section Active' : '⚪ Section Hidden'}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-semibold">
            Loading quote settings...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Quote Text *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Enter inspiring quote or message..."
                value={quote.quoteText}
                onChange={(e) => setQuote({ ...quote, quoteText: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Author Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Aruna Krishnan, Ph.D."
                  value={quote.authorName}
                  onChange={(e) => setQuote({ ...quote, authorName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Author Title / Designation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Principal & Dean of Arts & Science"
                  value={quote.authorTitle || quote.designation || ''}
                  onChange={(e) => setQuote({ ...quote, authorTitle: e.target.value, designation: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <FileUploadInput
                label="LEADERSHIP PORTRAIT PHOTO (OPTIONAL)"
                value={quote.authorImageUrl || quote.authorImage || ''}
                onChange={(val) => setQuote({ ...quote, authorImage: val, authorImageUrl: val })}
                placeholder="Enter image URL or upload portrait photo"
                helpText="Upload a portrait photo or leave blank if no photo is needed."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Tagline / College Affiliation (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Dedicated to transformative education and character building"
                value={quote.subText || ''}
                onChange={(e) => setQuote({ ...quote, subText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="pt-2">
              <Switch
                label="Quote Section Active"
                description="When enabled, this leadership quote appears dynamically on your college homepage."
                checked={quote.isActive}
                onChange={(checked) => setQuote({ ...quote, isActive: checked })}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Publishing Changes...' : 'Save & Publish Quote'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
