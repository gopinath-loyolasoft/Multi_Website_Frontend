import React, { useEffect, useState } from 'react';
import { ShieldCheck, FileText, Download, Eye, Search, Filter, AlertCircle, Calendar } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { useTenant } from '../../tenant/TenantContext';
import { ComplianceDocument } from '../../types';
import { PdfDocumentViewerModal } from '../../components/common/PdfDocumentViewerModal';

const CATEGORIES = ['All Documents', 'AICTE / Approvals', 'NIRF', 'NAAC', 'UGC / Autonomous', 'RTI / Governance', 'Audited Accounts', 'Committees'];

export const CompliancePage: React.FC = () => {
  const Template = useActiveTemplate();
  const { siteConfig } = useTenant();
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [search, setSearch] = useState('');
  const [activeViewerDoc, setActiveViewerDoc] = useState<{ title: string; url: string } | null>(null);

  const headerConfig =
    siteConfig?.settings?.socialLinks?.pageHeaders?.compliance ||
    siteConfig?.settings?.pageHeaders?.compliance;

  const badgeText = headerConfig?.badge || 'Regulatory & Statutory Compliances';
  const titleText = headerConfig?.title || 'Mandatory Disclosures & Approvals';
  const subtitleText =
    headerConfig?.subtitle ||
    'Public disclosures, national accreditation certificates, AICTE approvals, NIRF data rankings, and institutional compliance records.';

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await apiClient.get('/site/compliance');
        if (res.data.success && Array.isArray(res.data.data)) {
          setDocuments(res.data.data);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.error('Failed to load compliance documents', err);
        setError('Unable to load statutory documents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocs = documents.filter((doc) => {
    const matchesCat =
      selectedCategory === 'All Documents' ||
      doc.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory.includes('AICTE') && doc.category?.toUpperCase().includes('AICTE')) ||
      (selectedCategory.includes('NIRF') && doc.category?.toUpperCase().includes('NIRF')) ||
      (selectedCategory.includes('NAAC') && doc.category?.toUpperCase().includes('NAAC'));
    const matchesSearch =
      !search.trim() ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase()) ||
      (doc.academicYear && doc.academicYear.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<ShieldCheck className="w-4 h-4 text-amber-300" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports or years..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Documents Table / Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading regulatory documents...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No documents found</h3>
            <p className="text-slate-500 text-xs mt-1">Try selecting another category or refining your search filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Document Title</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Academic Year</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span>{doc.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-semibold">
                        {doc.academicYear || 'All Sessions'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveViewerDoc({ title: doc.title, url: doc.fileUrl || doc.documentPdfUrl || '' })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <a
                            href={doc.fileUrl || doc.documentPdfUrl || '#'}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* PDF Modal */}
      {activeViewerDoc && (
        <PdfDocumentViewerModal
          isOpen={true}
          title={activeViewerDoc.title}
          pdfUrl={activeViewerDoc.url}
          onClose={() => setActiveViewerDoc(null)}
        />
      )}
    </div>
  );
};
