import React, { useState, useEffect } from 'react';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  Globe,
  ExternalLink
} from 'lucide-react';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  urlPath?: string;
  title?: string;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  urlPath = '/',
  title = 'Live Website Preview',
}) => {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset loading state on reload or url change
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [urlPath, key, isOpen]);

  if (!isOpen) return null;

  const handleReload = () => {
    setLoading(true);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="live-preview-modal fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Browser Toolbar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-4 shrink-0">
        {/* Left: Window Controls & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition flex items-center justify-center text-[9px] text-red-950 font-bold cursor-pointer"
              title="Close Preview (Esc)"
            >
              ×
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
            <Globe className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-bold text-white truncate max-w-[200px]">
              {title}
            </span>
          </div>
        </div>

        {/* Center: Device Switcher Toolbar */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              device === 'desktop'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              device === 'tablet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              device === 'mobile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Mock URL Bar, Reload, and Close */}
        <div className="flex items-center gap-2">
          {/* Simulated Address Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono max-w-sm truncate">
            <span className="text-emerald-400 font-semibold">{urlPath.startsWith('http') ? '' : 'https://'}</span>
            <span className="truncate text-slate-300">{urlPath.startsWith('http') ? urlPath.replace(/^https?:\/\//, '') : `${window.location.host}${urlPath}`}</span>
          </div>

          <a
            href={urlPath.startsWith('http') ? urlPath : `${window.location.origin}${urlPath}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Open in new window"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleReload}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Reload Preview Frame"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Workspace */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-slate-950/60">
        <div
          className={`h-full transition-all duration-300 relative flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800 ${
            device === 'desktop'
              ? 'w-full'
              : device === 'tablet'
              ? 'w-[768px] max-w-full'
              : 'w-[375px] max-w-full'
          }`}
        >
          {/* Device Notch & Frame Bar for Tablet and Mobile */}
          {device !== 'desktop' && (
            <div className="h-6 bg-slate-900 border-b border-slate-800 flex items-center justify-center shrink-0">
              <div className="w-16 h-2 rounded-full bg-slate-800" />
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xs">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Rendering live college platform preview...
              </p>
            </div>
          )}

          {/* The Live Interactive Iframe */}
          <iframe
            key={key}
            src={urlPath}
            title={title}
            onLoad={() => setLoading(false)}
            className="w-full h-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
