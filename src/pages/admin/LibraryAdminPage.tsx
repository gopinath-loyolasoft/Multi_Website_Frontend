import React, { useEffect, useState } from 'react';
import {
  Library,
  BookOpen,
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
  GraduationCap
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { LibraryResource } from '../../types';
import { FormDrawer, DrawerMode, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';

const RESOURCE_TYPES = [
  'All Types',
  'Question Paper',
  'E-Journal',
  'E-Book',
  'Syllabus & Notes',
  'Institutional Repository'
];

export const LibraryAdminPage: React.FC = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [showMonitor, setShowMonitor] = useState(true);

  // Drawer & Dialog State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedItem, setSelectedItem] = useState<LibraryResource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState('Question Paper');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [fileUrl, setFileUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/library');
      if (res.data.success && Array.isArray(res.data.data)) {
        setResources(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load library resources', err);
      showNotification('Failed to load library resources', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setDrawerMode('create');
    setTitle('');
    setResourceType('Question Paper');
    setSubjectCode('');
    setSubjectName('');
    setDepartmentName('');
    setSemester(1);
    setAcademicYear('2024-2025');
    setFileUrl('');
    setExternalUrl('');
    setDescription('');
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: LibraryResource) => {
    setSelectedItem(item);
    setDrawerMode('edit');
    setTitle(item.title);
    setResourceType(item.resourceType || 'Question Paper');
    setSubjectCode(item.subjectCode || '');
    setSubjectName(item.subjectName || '');
    setDepartmentName(item.departmentName || '');
    setSemester(item.semester || 1);
    setAcademicYear(item.academicYear || '2024-2025');
    setFileUrl(item.fileUrl || '');
    setExternalUrl(item.externalUrl || '');
    setDescription(item.description || '');
    setIsActive(item.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (item: LibraryResource) => {
    setSelectedItem(item);
    setDrawerMode('view');
    setTitle(item.title);
    setResourceType(item.resourceType || 'Question Paper');
    setSubjectCode(item.subjectCode || '');
    setSubjectName(item.subjectName || '');
    setDepartmentName(item.departmentName || '');
    setSemester(item.semester || 1);
    setAcademicYear(item.academicYear || '2024-2025');
    setFileUrl(item.fileUrl || '');
    setExternalUrl(item.externalUrl || '');
    setDescription(item.description || '');
    setIsActive(item.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const payload = {
      title,
      resourceType,
      subjectCode,
      subjectName,
      departmentName,
      semester: Number(semester),
      academicYear,
      fileUrl,
      externalUrl,
      description,
      isActive,
    };

    try {
      if (drawerMode === 'edit' && selectedItem) {
        await apiClient.put(`/admin/library/${selectedItem.id}`, payload);
        showNotification('Library resource updated successfully');
      } else {
        await apiClient.post('/admin/library', payload);
        showNotification('Library resource cataloged successfully');
      }
      setIsDrawerOpen(false);
      fetchResources();
    } catch (err) {
      console.error('Failed to save library resource', err);
      showNotification('Error saving library resource', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (item: LibraryResource) => {
    const nextStatus = item.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/library/${item.id}`, {
        ...item,
        isActive: nextStatus,
      });
      showNotification(`"${item.title}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchResources();
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
      await apiClient.delete(`/admin/library/${deleteTarget.id}`);
      showNotification('Library resource deleted successfully');
      setDeleteTarget(null);
      fetchResources();
    } catch (err) {
      console.error('Failed to delete library resource', err);
      showNotification('Failed to delete resource', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredResources = resources.filter((item) => {
    const matchesType =
      selectedType === 'All Types' ||
      (item.resourceType && item.resourceType.toLowerCase() === selectedType.toLowerCase());
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      (item.subjectCode && item.subjectCode.toLowerCase().includes(query)) ||
      (item.subjectName && item.subjectName.toLowerCase().includes(query)) ||
      (item.departmentName && item.departmentName.toLowerCase().includes(query));
    return matchesType && matchesSearch;
  });

  const activeResources = resources.filter((r) => r.isActive !== false);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Library className="w-6 h-6 text-blue-600" />
            <span>Central Digital Library & Question Bank</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Catalog university past question papers, semester exam archives, subscribed e-journals, and e-books.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchResources}
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
        moduleKey="library"
        moduleLabel="Central Library & Digital Archives"
        defaultBadge="Knowledge Resource Centre"
        defaultTitle="Central Library & Digital Archives"
        defaultSubtitle="Access 100,000+ print volumes, international peer-reviewed journals, NPTEL digital courseware, and past university question papers."
      />

      {/* ── LIVE LIBRARY MONITOR ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeResources.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 font-mono">
              Live Digital Library Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeResources.length} Active Resources · {resources.length - activeResources.length} Inactive
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
              <div className="text-center text-slate-500 text-xs py-4">Loading library catalog...</div>
            ) : resources.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No resources cataloged yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {resources.slice(0, 4).map((r) => {
                  const isResourceActive = r.isActive !== false;
                  return (
                    <div
                      key={r.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${
                        isResourceActive
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                          : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {r.resourceType || 'Paper'}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${isResourceActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{r.title}</p>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {r.subjectCode ? `${r.subjectCode} · ` : ''}Sem {r.semester || 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Type Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {RESOURCE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedType === type
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {type}
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
            placeholder="Search by title, subject code, or department..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Library Resource</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading library resources...
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Library Resources Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ New Library Resource" to upload past exam question papers, e-books, or research journals.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Title & Subject</th>
                  <th className="py-3 px-4">Resource Type</th>
                  <th className="py-3 px-4">Department & Sem</th>
                  <th className="py-3 px-4">Document / Gateway</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map((item) => {
                  const isItemActive = item.isActive !== false;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 font-bold block">{item.title}</strong>
                        {item.subjectCode && (
                          <span className="text-[11px] text-slate-400">
                            Code: <code className="font-mono text-blue-600 font-semibold">{item.subjectCode}</code> {item.subjectName ? `· ${item.subjectName}` : ''}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {item.resourceType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-medium">{item.departmentName || 'General'}</span>
                        <span className="block text-[11px] text-slate-400">Semester {item.semester || 1} • {item.academicYear}</span>
                      </td>
                      <td className="py-3 px-4">
                        {item.fileUrl ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold text-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </a>
                        ) : item.externalUrl ? (
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-teal-600 hover:underline font-semibold text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Access Gateway</span>
                          </a>
                        ) : (
                          <span className="text-slate-300 italic">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(item)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isItemActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {isItemActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isItemActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Resource Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Resource"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Resource"
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
          {filteredResources.map((item) => {
            const isItemActive = item.isActive !== false;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  isItemActive ? 'border-slate-200' : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-50 text-blue-700 uppercase border border-blue-100">
                      {item.resourceType}
                    </span>
                    <button
                      onClick={() => toggleStatus(item)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isItemActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                      }`}
                    >
                      {isItemActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isItemActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isItemActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {item.title}
                  </h3>

                  {item.subjectCode && (
                    <div className="text-xs text-slate-600">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Subject</span>
                      <span className="font-semibold text-slate-800">{item.subjectCode} - {item.subjectName || 'Coursework'}</span>
                    </div>
                  )}

                  <div className="text-xs text-slate-500">
                    <span>{item.departmentName || 'General'}</span> • <span>Semester {item.semester || 1}</span>
                  </div>

                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline pt-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Download Exam Paper / File</span>
                    </a>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Resource Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Resource"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right-Side Drawer for Library Resource */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Library Resource"
        subtitle={
          drawerMode === 'create'
            ? 'Catalog a new question paper, e-book, or research journal'
            : drawerMode === 'edit'
              ? `Update catalog details for ${title || 'resource'}`
              : `Overview of ${title || 'resource'}`
        }
        icon={<BookOpen className="w-5 h-5 text-blue-600" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedItem ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg font-mono text-xs font-black bg-blue-600 text-white uppercase">
                  {selectedItem.resourceType}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedItem.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedItem.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedItem.title}</h3>
              <p className="text-xs font-semibold text-slate-600">
                {selectedItem.subjectCode ? `${selectedItem.subjectCode} · ` : ''}{selectedItem.subjectName || ''}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department & Semester</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedItem.departmentName || 'All Departments'} • Sem {selectedItem.semester || 1}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Year</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedItem.academicYear || 'All Sessions'}</p>
              </div>
            </div>

            {selectedItem.fileUrl && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Resource PDF Document</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-900 truncate max-w-xs">{selectedItem.fileUrl}</span>
                  <a
                    href={selectedItem.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Resource Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms - Nov 2024 Exam Paper"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Resource Type *</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  {RESOURCE_TYPES.filter((t) => t !== 'All Types').map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Semester Number</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value) || 1)}
                  placeholder="1"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Subject Code</label>
                <input
                  type="text"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="e.g. CS8391"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm uppercase font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Data Structures"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Department</label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2024-2025"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Document File PDF / URL</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://.../question_paper_nov2024.pdf"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">External Gateway URL (e.g. IEEE, Springer)</label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://ieeexplore.ieee.org/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
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
        title="Delete Library Resource"
        message={`This will permanently remove the resource "${deleteTarget?.title}".`}
        confirmText="Delete Resource"
        loading={actionLoading}
      />
    </div>
  );
};
