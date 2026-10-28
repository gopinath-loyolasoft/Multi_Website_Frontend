import React from 'react';
import { X, Download, ExternalLink, FileText, Maximize2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentUrl?: string;
  pdfUrl?: string;
  subtitle?: string;
  downloadFileName?: string;
}

export const PdfDocumentViewerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  documentUrl,
  pdfUrl,
  subtitle,
  downloadFileName,
}) => {
  const activeUrl = pdfUrl || documentUrl;
  if (!isOpen || !activeUrl) return null;

  const isPdf = activeUrl.toLowerCase().includes('.pdf') || activeUrl.startsWith('blob:') || activeUrl.startsWith('data:application/pdf');
  const isDoc = activeUrl.toLowerCase().includes('.doc') || activeUrl.toLowerCase().includes('.docx');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = activeUrl;
    a.download = downloadFileName || title.toLowerCase().replace(/\s+/g, '_') + (isDoc ? '.docx' : '.pdf');
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[88vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-xs"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 overflow-hidden flex flex-col justify-center items-center">
          {isPdf ? (
            <iframe
              src={`${activeUrl}#toolbar=1&navpanes=0`}
              title={title}
              className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white shadow-inner"
            />
          ) : isDoc ? (
            <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Word Document (.doc / .docx)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Microsoft Word documents can be downloaded directly to open on your device.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Word Document</span>
              </button>
            </div>
          ) : (
            <iframe
              src={activeUrl}
              title={title}
              className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white shadow-inner"
            />
          )}
        </div>
      </div>
    </div>
  );
};
