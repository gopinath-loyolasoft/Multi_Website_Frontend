import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  LayoutGrid,
  List,
  FileText,
  ExternalLink,
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { ComplianceDocument } from '../../types';
import { FormDrawer, DrawerMode, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';

const CATEGORIES = [
  'All Categories',
  'AICTE Approvals',
  'NIRF Data',
  'NAAC Accreditation',
  'UGC / Autonomous',
  'RTI & Governance',
  'Audited Statements',
  'Committees & Policies'
];

export const ComplianceAdminPage: React.FC = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [showMonitor, setShowMonitor] = useState(true);

  // Drawer & Dialog State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedDoc, setSelectedDoc] = useState<ComplianceDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AICTE Approvals');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/compliance');
      if (res.data.success && Array.isArray(res.data.data)) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load compliance docs', err);
      showNotification('Failed to load compliance documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleOpenCreate = () => {
    setSelectedDoc(null);
    setDrawerMode('create');
    setTitle('');
    setCategory('AICTE Approvals');
    setAcademicYear('2025-2026');
    setFileUrl('');
    setDescription('');
    setDisplayOrder(documents.length + 1);
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (doc: ComplianceDocument) => {
    setSelectedDoc(doc);
    setDrawerMode('edit');
    setTitle(doc.title);
    setCategory(doc.category || 'AICTE Approvals');
    setAcademicYear(doc.academicYear || '2025-2026');
    setFileUrl(doc.fileUrl || doc.documentPdfUrl || '');
    setDescription(doc.description || '');
    setDisplayOrder(doc.displayOrder || 1);
    setIsActive(doc.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (doc: ComplianceDocument) => {
    setSelectedDoc(doc);
    setDrawerMode('view');
    setTitle(doc.title);
    setCategory(doc.category || 'AICTE Approvals');
    setAcademicYear(doc.academicYear || '2025-2026');
    setFileUrl(doc.fileUrl || doc.documentPdfUrl || '');
    setDescription(doc.description || '');
    setDisplayOrder(doc.displayOrder || 1);
    setIsActive(doc.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        title,
        category,
        academicYear,
        fileUrl,
        documentPdfUrl: fileUrl,
        description,
        displayOrder: Number(displayOrder),
        isActive,
      };

      if (drawerMode === 'edit' && selectedDoc) {
        await apiClient.put(`/admin/compliance/${selectedDoc.id}`, payload);
        showNotification('Compliance document updated successfully');
      } else {
        await apiClient.post('/admin/compliance', payload);
        showNotification('Compliance document published successfully');
      }
      setIsDrawerOpen(false);
      fetchDocs();
    } catch (err) {
      console.error('Failed to save document', err);
      showNotification('Error saving compliance document', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (doc: ComplianceDocument) => {
    const nextStatus = doc.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/compliance/${doc.id}`, {
        ...doc,
        fileUrl: doc.fileUrl || doc.documentPdfUrl,
        isActive: nextStatus,
      });
      showNotification(`"${doc.title}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchDocs();
    } catch {
      showNotification('Failed to update status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/compliance/${deleteTarget.id}`);
      showNotification('Compliance document deleted successfully');
      setDeleteTarget(null);
      fetchDocs();
    } catch (err) {
      console.error('Failed to delete doc', err);
      showNotification('Failed to delete document', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      (doc.category && doc.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.category && doc.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.academicYear && doc.academicYear.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeDocs = documents.filter((d) => d.isActive !== false);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            <span>Mandatory Disclosures & Statutory Compliance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain regulatory approvals, AICTE Extension of Approvals, NIRF rankings, NAAC SSR certificates, and audited accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDocs}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Public Page Banner Customizer */}
      <ModulePageHeaderCustomizer
        moduleKey="compliance"
        moduleLabel="Mandatory Disclosures & Compliance"
        defaultBadge="Regulatory & Statutory Compliance"
        defaultTitle="Mandatory Disclosures & Approvals"
        defaultSubtitle="Official public disclosures, regulatory approvals, institutional audit reports, and AICTE/NIRF records."
      />

      {/* ── LIVE COMPLIANCE MONITOR ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeDocs.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 font-mono">
              Live Statutory Compliance Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeDocs.length} Active Disclosures · {documents.length - activeDocs.length} Inactive
            </span>
            <button
              type="button"
              onClick={() => setShowMonitor(!showMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {showMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showMonitor && (
          <div className="p-5 bg-slate-100/90 dark:bg-slate-950/60">
            {loading ? (
              <div className="text-center text-slate-500 text-xs py-4">Loading disclosures...</div>
            ) : documents.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No statutory documents registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {documents.slice(0, 4).map((doc) => {
                  const isDocActive = doc.isActive !== false;
                  return (
                    <div
                      key={doc.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${
                        isDocActive
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                          : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-50 text-red-700 border border-red-200 uppercase">
                          {doc.academicYear || 'Statutory'}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${isDocActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{doc.title}</p>
                      <span className="text-[10px] text-slate-400 block truncate">{doc.category}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, category, year..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-red-600 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Table / List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Compliance Document</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading compliance disclosures...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Compliance Documents Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload AICTE approval letters, NAAC certificates, or NIRF data disclosures.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Statutory Category</th>
                  <th className="py-3 px-4">Academic Year</th>
                  <th className="py-3 px-4">Document File (PDF)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => {
                  const isDocActive = doc.isActive !== false;
                  const docUrl = doc.fileUrl || doc.documentPdfUrl;
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 font-bold block">{doc.title}</strong>
                        {doc.description && (
                          <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">{doc.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-medium text-[11px] bg-red-50 text-red-700 border border-red-100">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {doc.academicYear || 'All Years'}
                      </td>
                      <td className="py-3 px-4">
                        {docUrl ? (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold text-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View PDF</span>
                          </a>
                        ) : (
                          <span className="text-slate-300 italic">No PDF attached</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(doc)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isDocActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {isDocActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isDocActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(doc)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Document Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Document"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: doc.id, title: doc.title })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const isDocActive = doc.isActive !== false;
            const docUrl = doc.fileUrl || doc.documentPdfUrl;
            return (
              <div
                key={doc.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  isDocActive ? 'border-slate-200' : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-100 uppercase">
                      {doc.category}
                    </span>
                    <button
                      onClick={() => toggleStatus(doc)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isDocActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                      }`}
                    >
                      {isDocActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isDocActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isDocActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.description || 'Mandatory statutory compliance disclosure.'}
                  </p>

                  {doc.academicYear && (
                    <div className="text-xs text-slate-600">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Academic Year</span>
                      <span className="font-semibold">{doc.academicYear}</span>
                    </div>
                  )}

                  {docUrl && (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline pt-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Download PDF Document</span>
                    </a>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(doc)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Document Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(doc)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Document"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: doc.id, title: doc.title })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right-Side Drawer for Compliance Document */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Compliance Document"
        subtitle={
          drawerMode === 'create'
            ? 'Publish a new statutory approval or regulatory disclosure'
            : drawerMode === 'edit'
              ? `Update compliance details for ${title || 'document'}`
              : `Overview of ${title || 'document'}`
        }
        icon={<ShieldCheck className="w-5 h-5 text-red-600" />}
        mode={drawerMode}
        onSubmit={handleSaveDoc}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedDoc ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg font-mono text-xs font-black bg-red-50 text-red-700 border border-red-200 uppercase">
                  {selectedDoc.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedDoc.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedDoc.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedDoc.title}</h3>
              <p className="text-xs font-semibold text-slate-500">Academic Year: {selectedDoc.academicYear || 'All Batches'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description / Notes</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedDoc.description || 'Official statutory disclosure for regulatory transparency.'}
              </p>
            </div>

            {(selectedDoc.fileUrl || selectedDoc.documentPdfUrl) && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Attached Document File</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-900 truncate max-w-xs">
                    {selectedDoc.fileUrl || selectedDoc.documentPdfUrl}
                  </span>
                  <a
                    href={selectedDoc.fileUrl || selectedDoc.documentPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open PDF</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Document Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AICTE Extension of Approval (EoA) 2025-2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Statutory Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2025-2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Document File PDF / URL *</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://.../aicte_eoa_2025.pdf"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description / Summary</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the approval, reference number, or committee findings..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Compliance Document"
        message={`This will permanently remove the statutory document "${deleteTarget?.title}".`}
        confirmText="Delete Document"
        loading={actionLoading}
      />
    </div>
  );
};
