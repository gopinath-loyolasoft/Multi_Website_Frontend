import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Calendar, 
  FileCheck, 
  FileSpreadsheet, 
  FileCode, 
  File,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { useTemplateTheme } from '../../themes/ThemeContext';

interface DocumentsSectionProps {
  content: {
    badge?: string;
    title?: string;
    subtitle?: string;
    layout?: 'list' | 'grid' | 'categorized';
    documents?: DocumentItem[];
    showSearch?: boolean;
    showCategories?: boolean;
  };
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const documents = useMemo(() => {
    return Array.isArray(content.documents) ? content.documents : [];
  }, [content.documents]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    documents.forEach(doc => {
      if (doc.category && doc.category.trim()) {
        cats.add(doc.category.trim());
      }
    });
    return Array.from(cats);
  }, [documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        !searchQuery.trim() ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.category && doc.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        activeCategory === 'ALL' || 
        (doc.category && doc.category.trim().toLowerCase() === activeCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, activeCategory]);

  const getFileIcon = (fileUrl: string, fileType?: string) => {
    const ext = (fileType || fileUrl.split('.').pop() || '').toUpperCase();
    if (ext.includes('PDF')) return <FileText className="w-6 h-6 text-rose-600" />;
    if (ext.includes('XLS') || ext.includes('CSV') || ext.includes('SHEET')) return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
    if (ext.includes('DOC')) return <FileCheck className="w-6 h-6 text-blue-600" />;
    if (ext.includes('ZIP') || ext.includes('RAR')) return <FileCode className="w-6 h-6 text-amber-600" />;
    return <File className="w-6 h-6 text-slate-500" />;
  };

  const getFileTypeBadge = (fileUrl: string, fileType?: string) => {
    const ext = (fileType || fileUrl.split('.').pop() || 'PDF').toUpperCase();
    let colorClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900';
    if (ext.includes('XLS') || ext.includes('CSV')) colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900';
    if (ext.includes('DOC')) colorClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900';
    
    return (
      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${colorClass}`}>
        {ext}
      </span>
    );
  };

  if (documents.length === 0) return null;

  const sectionBadge = content.badge || 'Official Circulars & Downloads';
  const sectionTitle = content.title || 'Downloads & Official Documents';
  const sectionSubtitle = content.subtitle || 'Access syllabus copies, examination circulars, policy manuals, and official academic records';
  const isGrid = content.layout === 'grid';

  return (
    <section className="py-12 sm:py-16 bg-slate-50/70 dark:bg-slate-950/60 transition-colors border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            {sectionBadge && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{sectionBadge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
                {sectionSubtitle}
              </p>
            )}
          </div>

          {/* Search Bar */}
          {content.showSearch !== false && documents.length > 3 && (
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search documents by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>

        {/* Category Pills */}
        {content.showCategories !== false && categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-2">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'ALL'
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Documents ({documents.length})
            </button>
            {categories.map((cat) => {
              const count = documents.filter(d => d.category?.trim().toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-primary text-white shadow-sm shadow-primary/30'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Documents Container */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <FolderOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">No documents match your query</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or selecting a different category filter.
            </p>
          </div>
        ) : isGrid ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocuments.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                      {getFileIcon(doc.fileUrl, doc.fileType)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {getFileTypeBadge(doc.fileUrl, doc.fileType)}
                      {doc.category && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    {doc.publishDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {doc.publishDate}
                      </span>
                    )}
                    {doc.fileSize && <span>{doc.fileSize}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-95 transition shadow-xs"
                    >
                      <span>Open in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={doc.fileUrl}
                      download
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Download PDF file"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View Layout (Default clean archive standard) */
          <div className="space-y-3">
            {filteredDocuments.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    {getFileIcon(doc.fileUrl, doc.fileType)}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                        {doc.title}
                      </h3>
                      {getFileTypeBadge(doc.fileUrl, doc.fileType)}
                      {doc.category && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                      )}
                    </div>
                    {doc.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      {doc.publishDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {doc.publishDate}
                        </span>
                      )}
                      {doc.fileSize && <span>• {doc.fileSize}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-95 transition shadow-xs"
                  >
                    <span>View Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={doc.fileUrl}
                    download
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Download document file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
