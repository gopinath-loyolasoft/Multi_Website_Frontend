import React, { useEffect, useState } from 'react';
import { BookOpen, Search, ExternalLink, Download, FileText, Globe, Bookmark, Layers, Database } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { useTenant } from '../../tenant/TenantContext';
import { LibraryResource } from '../../types';
import { PdfDocumentViewerModal } from '../../components/common/PdfDocumentViewerModal';

const RESOURCE_TYPES = ['All Resources', 'Question Papers', 'E-Journals & Databases', 'E-Books', 'Syllabus & Notes', 'Institutional Repository'];

export const LibraryPage: React.FC = () => {
  const Template = useActiveTemplate();
  const { siteConfig } = useTenant();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All Resources');
  const [search, setSearch] = useState('');
  const [activeDoc, setActiveDoc] = useState<{ title: string; url: string } | null>(null);

  const headerConfig =
    siteConfig?.settings?.socialLinks?.pageHeaders?.library ||
    siteConfig?.settings?.pageHeaders?.library;

  const badgeText = headerConfig?.badge || 'Knowledge Resource Centre';
  const titleText = headerConfig?.title || 'Central Library & Digital Archives';
  const subtitleText =
    headerConfig?.subtitle ||
    'Access 100,000+ print volumes, international peer-reviewed journals, NPTEL digital courseware, and past university question papers.';

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await apiClient.get('/site/library');
        if (res.data.success && Array.isArray(res.data.data)) {
          setResources(res.data.data);
        } else {
          setResources([]);
        }
      } catch (err) {
        console.error('Failed to load library resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const filtered = resources.filter((r) => {
    const q = search.toLowerCase();
    const matchesType =
      selectedType === 'All Resources' ||
      r.resourceType?.toLowerCase() === selectedType.toLowerCase() ||
      (selectedType.includes('Question') && r.resourceType?.toLowerCase().includes('question')) ||
      (selectedType.includes('Journal') && r.resourceType?.toLowerCase().includes('journal'));
    const matchesSearch =
      !search.trim() ||
      r.title.toLowerCase().includes(q) ||
      r.subjectName?.toLowerCase().includes(q) ||
      r.subjectCode?.toLowerCase().includes(q) ||
      r.departmentName?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<BookOpen className="w-4 h-4 text-amber-300" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Quick Digital Gateway Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            href="https://ieeexplore.ieee.org"
            target="_blank"
            rel="noreferrer"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">E-Resource</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">IEEE Xplore</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Global tech papers</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
          </a>

          <a
            href="https://link.springer.com"
            target="_blank"
            rel="noreferrer"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">Database</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">Springer Nature</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Journals & books</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
          </a>

          <a
            href="https://delnet.in"
            target="_blank"
            rel="noreferrer"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 block">Consortium</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">DELNET Union</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Inter-library loan</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
          </a>

          <a
            href="https://ndl.iitkgp.ac.in"
            target="_blank"
            rel="noreferrer"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block">National Portal</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">NDLI Gateway</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Digital Library India</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
          </a>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {RESOURCE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subject code, name, year..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Resources Listing */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading library repository...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No resources found</h3>
            <p className="text-slate-500 text-xs mt-1">Try another keyword or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary font-extrabold text-[11px] rounded-lg">
                      {item.resourceType}
                    </span>
                    {item.semester && (
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Sem {item.semester}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">{item.title}</h3>
                  {item.subjectName && (
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      {item.subjectCode && <span className="font-mono text-primary font-bold mr-1">[{item.subjectCode}]</span>}
                      {item.subjectName}
                    </p>
                  )}
                  {item.academicYear && (
                    <p className="text-[11px] text-slate-400 mt-1">Exam Session: {item.academicYear}</p>
                  )}
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.description}</p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {item.fileUrl ? (
                    <>
                      <button
                        onClick={() => setActiveDoc({ title: item.title, url: item.fileUrl! })}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </button>
                      <a
                        href={item.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </>
                  ) : item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Access Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Modal */}
      {activeDoc && (
        <PdfDocumentViewerModal
          isOpen={true}
          title={activeDoc.title}
          pdfUrl={activeDoc.url}
          onClose={() => setActiveDoc(null)}
        />
      )}
    </div>
  );
};
