import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, ExternalLink, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export interface PopupAnnouncement {
  id: string;
  title: string;
  popupType: 'IMAGE_POSTER' | 'RICH_CONTENT' | 'VIDEO' | string;
  imageUrl?: string;
  badgeText?: string;
  heading?: string;
  description?: string;
  videoUrl?: string;
  targetUrl?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  secondaryTargetUrl?: string;
  openInNewTab?: boolean;
  delaySeconds?: number;
  displayFrequency?: 'EVERY_VISIT' | 'ONCE_PER_SESSION' | 'ONCE_PER_DAY' | string;
  targetPages?: 'HOMEPAGE_ONLY' | 'ALL_PAGES' | 'CUSTOM_SLUGS' | string;
  customTargetSlugs?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export const SitePopupModal: React.FC = () => {
  const [popup, setPopup] = useState<PopupAnnouncement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchPopup = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: PopupAnnouncement | null }>('/site/popup');
        if (!isMounted || !res.data?.data || !res.data.data.isActive) return;

        const p = res.data.data;

        // 1. Page targeting check
        const currentPath = location.pathname;
        if (p.targetPages === 'HOMEPAGE_ONLY' && currentPath !== '/') {
          return;
        }
        if (p.targetPages === 'CUSTOM_SLUGS' && p.customTargetSlugs) {
          const allowedSlugs = p.customTargetSlugs
            .split(',')
            .map((s: string) => s.trim().replace(/^\//, ''))
            .filter(Boolean);
          const activeSlug = currentPath.replace(/^\//, '');
          if (!allowedSlugs.includes(activeSlug)) {
            return;
          }
        }

        // 2. Frequency / Storage dismissal check
        const now = Date.now();
        if (p.displayFrequency === 'ONCE_PER_SESSION') {
          const dismissedSession = sessionStorage.getItem(`popup_dismissed_${p.id}`);
          if (dismissedSession) return;
        } else if (p.displayFrequency === 'ONCE_PER_DAY') {
          const dismissedUntil = localStorage.getItem(`popup_dismissed_until_${p.id}`);
          if (dismissedUntil && parseInt(dismissedUntil, 10) > now) {
            return;
          }
        }

        setPopup(p);

        // 3. Delay before appearance
        const delayMs = Math.max(0, (p.delaySeconds ?? 1) * 1000);
        const timer = setTimeout(() => {
          if (isMounted) {
            setIsVisible(true);
          }
        }, delayMs);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Failed to load popup announcement', err);
      }
    };

    fetchPopup();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, popup, dontShowToday]);

  const handleClose = () => {
    if (!popup) {
      setIsVisible(false);
      return;
    }

    const now = Date.now();
    // Mark in sessionStorage if session frequency
    if (popup.displayFrequency === 'ONCE_PER_SESSION') {
      sessionStorage.setItem(`popup_dismissed_${popup.id}`, 'true');
    }

    // If frequency is ONCE_PER_DAY or user checked "Don't show again today"
    if (popup.displayFrequency === 'ONCE_PER_DAY' || dontShowToday) {
      const tomorrow = now + 24 * 60 * 60 * 1000;
      localStorage.setItem(`popup_dismissed_until_${popup.id}`, tomorrow.toString());
    }

    setIsVisible(false);
  };

  const handleNavigate = (url?: string, newTab?: boolean) => {
    if (!url) return;
    handleClose();

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      if (newTab) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = url;
      }
    } else {
      const path = url.startsWith('/') ? url : `/${url}`;
      if (newTab) {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }
    }
  };

  if (!popup || !isVisible) return null;

  const isPoster = popup.popupType === 'IMAGE_POSTER' || (!popup.popupType && popup.imageUrl);
  const isVideo = popup.popupType === 'VIDEO';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/75 backdrop-blur-sm animate-fade-in transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-up transition-all transform">
        
        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-transform duration-200 hover:scale-110 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          title="Close announcement (Esc)"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ─── 1. POSTER IMAGE MODAL ─── */}
        {isPoster && (
          <div className="flex flex-col">
            {popup.imageUrl && (
              <div 
                className={`relative group overflow-hidden bg-slate-950 ${popup.targetUrl ? 'cursor-pointer' : ''}`}
                onClick={() => popup.targetUrl && handleNavigate(popup.targetUrl, popup.openInNewTab)}
              >
                <img
                  src={popup.imageUrl}
                  alt={popup.title || 'Announcement Poster'}
                  className="w-full h-auto max-h-[75vh] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {popup.targetUrl && (
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-slate-900 font-semibold text-sm shadow-lg flex items-center gap-2">
                      Click to View <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* If heading/description exists with the poster */}
            {(popup.heading || popup.description || popup.ctaText) && (
              <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                {popup.badgeText && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 mb-2">
                    <Sparkles className="w-3 h-3" />
                    {popup.badgeText}
                  </span>
                )}
                {popup.heading && (
                  <h3 id="popup-title" className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {popup.heading}
                  </h3>
                )}
                {popup.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                    {popup.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dontShowToday}
                      onChange={(e) => setDontShowToday(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Don't show again today
                  </label>

                  <div className="flex items-center gap-2 ml-auto">
                    {popup.secondaryTargetUrl && popup.secondaryCtaText && (
                      <button
                        type="button"
                        onClick={() => handleNavigate(popup.secondaryTargetUrl, popup.openInNewTab)}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {popup.secondaryCtaText}
                      </button>
                    )}
                    {popup.targetUrl && (
                      <button
                        type="button"
                        onClick={() => handleNavigate(popup.targetUrl, popup.openInNewTab)}
                        className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                      >
                        {popup.ctaText || 'Learn More'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── 2. RICH CONTENT MODAL ─── */}
        {popup.popupType === 'RICH_CONTENT' && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Bell className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                {popup.badgeText && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 mb-1.5">
                    {popup.badgeText}
                  </span>
                )}
                <h3 id="popup-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {popup.heading || popup.title}
                </h3>
              </div>
            </div>

            {popup.imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden max-h-56 bg-slate-100 dark:bg-slate-800">
                <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" />
              </div>
            )}

            {popup.description && (
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {popup.description}
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowToday}
                  onChange={(e) => setDontShowToday(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Don't show again today
              </label>

              <div className="flex items-center gap-2 ml-auto">
                {popup.secondaryTargetUrl && popup.secondaryCtaText && (
                  <button
                    type="button"
                    onClick={() => handleNavigate(popup.secondaryTargetUrl, popup.openInNewTab)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {popup.secondaryCtaText}
                  </button>
                )}
                {popup.targetUrl ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate(popup.targetUrl, popup.openInNewTab)}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                  >
                    {popup.ctaText || 'Learn More'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── 3. VIDEO MODAL ─── */}
        {isVideo && (
          <div className="flex flex-col">
            {popup.videoUrl && (
              <div className="aspect-video w-full bg-black">
                {popup.videoUrl.includes('youtube.com') || popup.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={popup.videoUrl.replace('watch?v=', 'embed/')}
                    title={popup.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={popup.videoUrl} controls autoPlay className="w-full h-full object-cover" />
                )}
              </div>
            )}
            <div className="p-5 bg-white dark:bg-slate-900">
              <h3 id="popup-title" className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {popup.heading || popup.title}
              </h3>
              {popup.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{popup.description}</p>
              )}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontShowToday}
                    onChange={(e) => setDontShowToday(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
                  />
                  Don't show again today
                </label>
                {popup.targetUrl && (
                  <button
                    type="button"
                    onClick={() => handleNavigate(popup.targetUrl, popup.openInNewTab)}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    {popup.ctaText || 'Learn More'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
