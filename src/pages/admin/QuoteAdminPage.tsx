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
import { FileUploadInput, Switch } from '../../UI_Componentes/ui';

export const QuoteAdminPage: React.FC = () => {
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
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/quote');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        const img = d.authorImageUrl || d.authorImage || '/assets/templates/common/leader_portrait.svg';
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
        authorName: quote.authorName,
        designation: quote.authorTitle || quote.designation,
        authorTitle: quote.authorTitle || quote.designation,
        authorImageUrl: quote.authorImageUrl || quote.authorImage,
        authorImage: quote.authorImageUrl || quote.authorImage,
        subText: quote.subText || '',
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

  const currentImage = quote.authorImageUrl || quote.authorImage || '/assets/templates/common/leader_portrait.svg';
  const currentTitle = quote.authorTitle || quote.designation || 'Leadership Title';

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
            Display a leadership welcome message from the Chancellor, Chairman, or Principal on the homepage.
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

      {/* Notification Banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Collapsible Visual Live Preview Monitor (LIGHT MODE) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${quote.isActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
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
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {quote.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{quote.isActive ? 'Active on Home Page' : 'Hidden from Visitors'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="p-6 sm:p-10 bg-slate-50/50">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
              {/* Author Photo */}
              <div className="shrink-0 relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md bg-slate-100">
                  {currentImage ? (
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
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Quote className="w-4 h-4" />
                </div>
              </div>

              {/* Quote Content */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <blockquote className="text-base md:text-lg font-serif italic text-slate-800 leading-relaxed">
                  "{quote.quoteText || 'Please enter your leadership message or quote below.'}"
                </blockquote>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-bold text-sm text-slate-900">{quote.authorName || 'Leadership Name'}</div>
                  <div className="text-xs text-blue-600 font-semibold">{currentTitle}</div>
                  {quote.subText && (
                    <div className="text-[11px] text-slate-500 mt-0.5">{quote.subText}</div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic text-center pt-4">
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
              Edit Leadership Quote Information
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
                placeholder="Enter inspiring welcome message or strategic leadership address..."
                value={quote.quoteText}
                onChange={(e) => setQuote({ ...quote, quoteText: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Author Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Aruna Krishnan, Ph.D."
                  value={quote.authorName}
                  onChange={(e) => setQuote({ ...quote, authorName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Author Title / Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Principal & Dean of Arts & Science"
                  value={quote.authorTitle || quote.designation || ''}
                  onChange={(e) => setQuote({ ...quote, authorTitle: e.target.value, designation: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <FileUploadInput
                label="LEADERSHIP PORTRAIT PHOTO"
                value={quote.authorImageUrl || quote.authorImage || ''}
                onChange={(val) => setQuote({ ...quote, authorImage: val, authorImageUrl: val })}
                placeholder="/assets/templates/common/leader_portrait.svg or upload local file"
                helpText="Upload a local portrait photo (SVG, PNG, JPG, WebP) or keep the template vector portrait."
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
