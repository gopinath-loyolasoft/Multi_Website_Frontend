import React, { useEffect, useState, useRef } from 'react';
import {
  Building2,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Clock,
  Search,
  Check,
  X,
  Mail,
  Phone,
  RefreshCw,
  LayoutGrid,
  List,
  Sparkles,
  ExternalLink,
  Copy,
  Users,
  Award,
  FlaskConical,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  UploadCloud,
  Loader2,
  GraduationCap
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, DrawerMode, FileUploadInput, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { slugify, copyToClipboard } from '../../utils/helpers';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';

export interface DepartmentSyllabusItem {
  id?: string;
  title: string;
  academicYear?: string;
  regulationYear?: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  description?: string;
}

interface LaboratoryItem {
  id?: string;
  name: string;
  equipment: string;
  capacity?: number;
}

interface SemesterSyllabusItem {
  semester: number;
  title: string;
  pdfUrl?: string;
  credits?: number;
}

interface Department {
  id: string;
  name: string;
  code: string;
  slug?: string;
  description: string;
  headOfDepartment: string;
  email: string;
  phone?: string;
  coverImageUrl?: string;
  imageUrl?: string;
  syllabusPdfUrl?: string;
  syllabi?: DepartmentSyllabusItem[];
  syllabiJson?: string;
  displayOrder?: number;
  isActive: boolean;
  stream?: string;
  totalSemesters?: number;
  hodMessage?: string;
  hodPhotoUrl?: string;
  visionMission?: string;
  labCount?: number;
  studentCount?: number;
  laboratories?: LaboratoryItem[];
}

interface Course {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  slug?: string;
  degreeLevel: string;
  durationYears: number;
  totalSemesters?: number;
  regulationYear?: string;
  intake?: number;
  description: string;
  eligibility: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  isActive: boolean;
  semesterSyllabi?: SemesterSyllabusItem[];
}

export const DepartmentsManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  // Drawer State (Add, Edit, View)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState('');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [syllabusPdfUrl, setSyllabusPdfUrl] = useState('');
  const [syllabi, setSyllabi] = useState<DepartmentSyllabusItem[]>([]);
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const [batchUploadProgress, setBatchUploadProgress] = useState<{ total: number; current: number; name: string } | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [stream, setStream] = useState('Science & Information Technology');
  const [totalSemesters, setTotalSemesters] = useState(8);
  const [hodMessage, setHodMessage] = useState('');
  const [hodPhotoUrl, setHodPhotoUrl] = useState('');
  const [visionMission, setVisionMission] = useState('');
  const [laboratories, setLaboratories] = useState<LaboratoryItem[]>([]);
  const [newLabName, setNewLabName] = useState('');
  const [newLabEquipment, setNewLabEquipment] = useState('');
  const [newLabCapacity, setNewLabCapacity] = useState(30);
  const [activeFormTab, setActiveFormTab] = useState<'overview' | 'hod' | 'vision' | 'labs' | 'syllabus'>('overview');

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/departments');
      if (res.data.success) {
        setDepartments(res.data.data.items || res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (drawerMode === 'create' || autoSlug) {
      setSlug(slugify(val));
    }
    if (drawerMode === 'create' && !code) {
      const acronym = val
        .split(' ')
        .filter((w) => !['and', '&', 'of', 'the', 'in', 'for'].includes(w.toLowerCase()))
        .map((w) => w[0])
        .join('')
        .toUpperCase();
      if (acronym.length >= 2) {
        setCode(acronym);
      }
    }
  };

  const parseDepartmentSyllabi = (dept: Department): DepartmentSyllabusItem[] => {
    if (Array.isArray(dept.syllabi) && dept.syllabi.length > 0) {
      return dept.syllabi;
    }
    if (dept.syllabiJson) {
      try {
        const parsed = JSON.parse(dept.syllabiJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    const legacyUrl = dept.syllabusPdfUrl || (dept as any).curriculumPdfUrl;
    if (legacyUrl) {
      return [{
        id: '1',
        title: '2024-2025 Syllabus & Regulation Handbook',
        fileUrl: legacyUrl,
        fileName: legacyUrl.split('/').pop() || 'Syllabus.pdf',
        fileType: legacyUrl.endsWith('.docx') ? 'docx' : legacyUrl.endsWith('.doc') ? 'doc' : 'pdf',
      }];
    }
    return [];
  };

  const handleOpenCreate = () => {
    setSelectedDept(null);
    setDrawerMode('create');
    setActiveFormTab('overview');
    setName('');
    setCode('');
    setSlug('');
    setAutoSlug(true);
    setDescription('');
    setHeadOfDepartment('');
    setEmail('');
    setPhone('');
    setCoverImageUrl('');
    setSyllabusPdfUrl('');
    setSyllabi([]);
    setDisplayOrder(departments.length + 1);
    setStream('Science & Information Technology');
    setTotalSemesters(8);
    setHodMessage('');
    setHodPhotoUrl('');
    setVisionMission('');
    setLaboratories([]);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setSelectedDept(dept);
    setDrawerMode('edit');
    setActiveFormTab('overview');
    setName(dept.name);
    setCode(dept.code);
    setSlug(dept.slug || slugify(dept.name));
    setAutoSlug(false);
    setDescription(dept.description || '');
    setHeadOfDepartment(dept.headOfDepartment || '');
    setEmail(dept.email || '');
    setPhone(dept.phone || '');
    setCoverImageUrl(dept.coverImageUrl || dept.imageUrl || '');
    setSyllabusPdfUrl(dept.syllabusPdfUrl || (dept as any).curriculumPdfUrl || '');
    setSyllabi(parseDepartmentSyllabi(dept));
    setDisplayOrder(dept.displayOrder || 1);
    setStream(dept.stream || 'Science & Information Technology');
    setTotalSemesters(dept.totalSemesters || 8);
    setHodMessage(dept.hodMessage || '');
    setHodPhotoUrl(dept.hodPhotoUrl || '');
    setVisionMission(dept.visionMission || '');
    setLaboratories(dept.laboratories || []);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (dept: Department) => {
    setSelectedDept(dept);
    setDrawerMode('view');
    setActiveFormTab('overview');
    setName(dept.name);
    setCode(dept.code);
    setSlug(dept.slug || slugify(dept.name));
    setDescription(dept.description || '');
    setHeadOfDepartment(dept.headOfDepartment || '');
    setEmail(dept.email || '');
    setPhone(dept.phone || '');
    setCoverImageUrl(dept.coverImageUrl || dept.imageUrl || '');
    setSyllabusPdfUrl(dept.syllabusPdfUrl || (dept as any).curriculumPdfUrl || '');
    setSyllabi(parseDepartmentSyllabi(dept));
    setDisplayOrder(dept.displayOrder || 1);
    setStream(dept.stream || 'Science & Information Technology');
    setTotalSemesters(dept.totalSemesters || 8);
    setHodMessage(dept.hodMessage || '');
    setHodPhotoUrl(dept.hodPhotoUrl || '');
    setVisionMission(dept.visionMission || '');
    setLaboratories(dept.laboratories || []);
    setIsDrawerOpen(true);
  };

  const handleAddLab = () => {
    if (!newLabName.trim()) return;
    setLaboratories([
      ...laboratories,
      { name: newLabName.trim(), equipment: newLabEquipment.trim(), capacity: newLabCapacity }
    ]);
    setNewLabName('');
    setNewLabEquipment('');
    setNewLabCapacity(30);
  };

  const handleRemoveLab = (index: number) => {
    setLaboratories(laboratories.filter((_, idx) => idx !== index));
  };

  // ── MULTI-SYLLABUS MANAGEMENT HANDLERS ──
  const handleBatchSyllabusUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsBatchUploading(true);
      const newItems: DepartmentSyllabusItem[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        setBatchUploadProgress({ total: totalFiles, current: i + 1, name: file.name });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('altText', file.name);

        const response = await apiClient.post('/admin/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const uploadedPath =
          response.data?.data?.filePath ||
          response.data?.data?.url ||
          (typeof response.data?.data === 'string' ? response.data.data : '') ||
          response.data?.filePath ||
          response.data?.url ||
          '';

        if (uploadedPath) {
          const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
          
          let cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          if (!/syllabus|curriculum|regulation/i.test(cleanTitle)) {
            cleanTitle = `${cleanTitle} Syllabus`;
          }

          newItems.push({
            id: `${Date.now()}-${i}`,
            title: cleanTitle.trim(),
            fileUrl: uploadedPath,
            fileName: file.name,
            fileType: ext,
          });
        }
      }

      if (newItems.length > 0) {
        setSyllabi((prev) => [...prev, ...newItems]);
        showNotification(`Uploaded ${newItems.length} syllabus document(s) successfully`);
      }
    } catch (err: any) {
      console.error('Batch upload error:', err);
      showNotification('Error uploading some documents', 'error');
    } finally {
      setIsBatchUploading(false);
      setBatchUploadProgress(null);
      if (batchFileInputRef.current) {
        batchFileInputRef.current.value = '';
      }
    }
  };

  const handleAddSyllabusItem = () => {
    setSyllabi([
      ...syllabi,
      {
        id: String(Date.now()),
        title: '2024-2025 Syllabus',
        fileUrl: '',
        fileName: '',
        fileType: 'pdf',
      },
    ]);
  };

  const handleUpdateSyllabusItem = (index: number, field: keyof DepartmentSyllabusItem, value: any) => {
    setSyllabi(
      syllabi.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveSyllabusItem = (index: number) => {
    setSyllabi(syllabi.filter((_, idx) => idx !== index));
  };

  const handleMoveSyllabusItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === syllabi.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...syllabi];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSyllabi(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const finalSlug = slugify(slug || name || code);
      const primarySyllabusUrl = syllabi.find((s) => s.fileUrl)?.fileUrl || syllabusPdfUrl || '';

      const payload = {
        name,
        code: code.toUpperCase(),
        slug: finalSlug,
        description,
        headOfDepartment,
        email,
        phone,
        coverImageUrl,
        syllabusPdfUrl: primarySyllabusUrl,
        syllabi,
        syllabiJson: JSON.stringify(syllabi),
        displayOrder: Number(displayOrder) || 1,
        stream,
        totalSemesters: Number(totalSemesters),
        hodMessage,
        hodPhotoUrl,
        visionMission,
        labCount: laboratories.length,
        laboratories,
        isActive: selectedDept ? selectedDept.isActive !== false : true,
      };

      if (drawerMode === 'edit' && selectedDept) {
        await apiClient.put(`/admin/departments/${selectedDept.id}`, payload);
        showNotification('Department updated successfully');
      } else {
        await apiClient.post('/admin/departments', payload);
        showNotification('Department registered successfully');
      }
      setIsDrawerOpen(false);
      fetchDepartments();
    } catch {
      showNotification('Failed to save department', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (dept: Department) => {
    const nextStatus = dept.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/departments/${dept.id}`, {
        name: dept.name,
        code: dept.code,
        description: dept.description,
        headOfDepartment: dept.headOfDepartment,
        email: dept.email,
        isActive: nextStatus,
      });
      showNotification(`"${dept.name}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchDepartments();
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
      await apiClient.delete(`/admin/departments/${deleteTarget.id}`);
      showNotification('Department deleted');
      setDeleteTarget(null);
      fetchDepartments();
    } catch {
      showNotification('Failed to delete department', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.headOfDepartment && d.headOfDepartment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeDepartments = departments.filter((d) => d.isActive !== false);
  const [showDeptMonitor, setShowDeptMonitor] = React.useState(true);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Academic Departments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure academic departments, codes, HOD leadership, and contact emails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDepartments}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Public Page Banner Customizer */}
      <ModulePageHeaderCustomizer
        moduleKey="departments"
        moduleLabel="Academic Departments"
        defaultBadge="Academic Divisions"
        defaultTitle="Departments & Academic Schools"
        defaultSubtitle="Explore our cutting-edge departments driving technical proficiency, engineering leadership, and innovation."
      />

      {/* ── LIVE DEPARTMENTS MONITOR (DARK & LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeDepartments.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Live Departments Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeDepartments.length} Active · {departments.length - activeDepartments.length} Inactive
            </span>
            <button
              type="button"
              onClick={() => setShowDeptMonitor(!showDeptMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {showDeptMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showDeptMonitor && (
          <div className="p-5 bg-slate-100/90 dark:bg-slate-950/60">
            {loading ? (
              <div className="text-center text-slate-500 dark:text-slate-400 text-xs py-4">Loading departments...</div>
            ) : departments.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>No departments yet. Create your first department to see it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {departments.slice(0, 4).map((dept) => {
                  const isActive = dept.isActive !== false;
                  return (
                    <div
                      key={dept.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${isActive
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 uppercase">
                          {dept.code}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{dept.name}</p>
                      {dept.headOfDepartment && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">HOD: {dept.headOfDepartment}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center pt-4">
              * Renders dynamically on your departments page. Showing {Math.min(departments.length, 4)} of {departments.length} departments.
            </p>
          </div>
        )}
      </div>


      {/* Search Bar & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments by name, code, or HOD..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${viewMode === 'card'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
                }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
                }`}
              title="Table / List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Department</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading departments...
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Departments Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Create departments like Computer Science, Mechanical, Arts, or Commerce.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4">Head of Department</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepartments.map((dept) => {
                  const isActive = dept.isActive !== false;
                  return (
                    <tr key={dept.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {dept.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {dept.name}
                        {dept.description && (
                          <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">{dept.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {dept.headOfDepartment || <span className="text-slate-300 italic">Not set</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {dept.email || <span className="text-slate-300 italic">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(dept)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            }`}
                        >
                          {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(dept)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Department"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(dept)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Department"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: dept.id, title: dept.name })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Department"
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
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((dept) => {
            const isActive = dept.isActive !== false;
            return (
              <div
                key={dept.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${isActive
                  ? 'border-slate-200'
                  : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-50 text-blue-700 uppercase border border-blue-100">
                      {dept.code}
                    </span>
                    <button
                      onClick={() => toggleStatus(dept)}
                      disabled={actionLoading}
                      title={isActive ? 'Click to make Inactive' : 'Click to make Active'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${isActive
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                        }`}
                    >
                      {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {dept.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {dept.description || 'No description provided.'}
                  </p>

                  {dept.headOfDepartment && (
                    <div className="pt-2 text-xs text-slate-700">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Head of Department</span>
                      <span className="font-semibold">{dept.headOfDepartment}</span>
                    </div>
                  )}

                  {dept.email && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{dept.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(dept)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Department Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Department"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: dept.id, title: dept.name })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Department">
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right-Side Drawer for Adding, Editing, and Viewing Department */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Department"
        subtitle={
          drawerMode === 'create'
            ? 'Register a new academic department'
            : drawerMode === 'edit'
              ? `Update details for ${selectedDept?.name || 'department'}`
              : `Overview of ${selectedDept?.name || 'department'}`
        }
        icon={<Building2 className="w-5 h-5 text-primary" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedDept ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg font-mono text-xs font-black bg-primary/10 text-primary uppercase">
                  {selectedDept.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedDept.isActive !== false
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                    }`}
                >
                  {selectedDept.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedDept.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                {selectedDept.hodPhotoUrl && (
                  <img
                    src={selectedDept.hodPhotoUrl}
                    alt={selectedDept.headOfDepartment || 'HOD'}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Head of Department (HOD)
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDept.headOfDepartment || 'Not assigned'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official Contact Email
                </span>
                <p className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {selectedDept.email || 'No email registered'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Overview & Description
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedDept.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ── STICKY TOP TAB BAR (Matches Public Department Detail Tabs 1-to-1) ── */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: '1. Overview', icon: Sparkles },
                { id: 'hod', label: '2. HOD Desk', icon: Users },
                { id: 'vision', label: '3. Vision', icon: Award },
                { id: 'labs', label: `4. Labs (${laboratories.length})`, icon: FlaskConical },
                { id: 'syllabus', label: '5. Syllabi & Curriculum', icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFormTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFormTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: OVERVIEW & IDENTITY ── */}
            {activeFormTab === 'overview' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Step 1: Configure core department name, academic stream, code, and header branding.
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                      Department Code *
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. CSE, MECH, EEE, MBA"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm uppercase font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                        URL Slug
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAutoSlug(true);
                          setSlug(slugify(name || code));
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                        title="Regenerate slug from name"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Auto</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setAutoSlug(false);
                        setSlug(slugify(e.target.value));
                      }}
                      placeholder="e.g. cse or computer-science"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                {slug && (
                  <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-blue-700 dark:text-blue-300 truncate">
                      /departments/{slug}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(`/departments/${slug}`);
                        showNotification('Department path copied to clipboard');
                      }}
                      className="text-blue-600 hover:text-blue-800 shrink-0 p-1"
                      title="Copy link path"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                      Academic Stream / Category
                    </label>
                    <select
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="Science & Information Technology">Science & Information Technology</option>
                      <option value="Commerce & Accounting">Commerce & Accounting</option>
                      <option value="Management & Business Administration">Management & Business Administration</option>
                      <option value="Hotel Management & Catering">Hotel Management & Catering</option>
                      <option value="Arts, Humanities & Social Sciences">Arts, Humanities & Social Sciences</option>
                      <option value="Engineering & Technology">Engineering & Technology</option>
                      <option value="Medical & Allied Health Sciences">Medical & Allied Health Sciences</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value) || 1)}
                      placeholder="1"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Department Overview / Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of the department, focus disciplines, research areas..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <FileUploadInput
                  label="Department Cover / Feature Banner Image"
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  placeholder="https://... or upload local banner image"
                  helpText="Banner displayed at top of the department detail page."
                  accept="image/*"
                />
              </div>
            )}

            {/* ── TAB 2: HOD DESK & LEADERSHIP ── */}
            {activeFormTab === 'hod' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium">
                  Step 2: Head of Department credentials, leadership photo, and welcome message.
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Head of Department (HOD) Full Name
                  </label>
                  <input
                    type="text"
                    value={headOfDepartment}
                    onChange={(e) => setHeadOfDepartment(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar, Ph.D."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                      HOD Official Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. cse.dept@college.edu"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                      Contact Phone / Office Ext
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 44 2811 0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <FileUploadInput
                  label="Head of Department (HOD) Photo"
                  value={hodPhotoUrl}
                  onChange={setHodPhotoUrl}
                  placeholder="https://... or upload local profile image"
                  helpText="Photo shown on HOD card and HOD Desk Tab."
                  accept="image/*"
                />

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    HOD Leadership Welcome Note / Message
                  </label>
                  <textarea
                    rows={4}
                    value={hodMessage}
                    onChange={(e) => setHodMessage(e.target.value)}
                    placeholder="Welcome message from the Head of Department to prospective students and researchers..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 3: VISION & OBJECTIVES ── */}
            {activeFormTab === 'vision' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  Step 3: Core vision, mission, and pedagogical values of the department.
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Vision & Mission Statement
                  </label>
                  <textarea
                    rows={6}
                    value={visionMission}
                    onChange={(e) => setVisionMission(e.target.value)}
                    placeholder="Provide the long-term vision, academic goals, and research objectives of the department..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 4: LABORATORIES & INFRASTRUCTURE ── */}
            {activeFormTab === 'labs' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 rounded-xl text-xs text-indigo-800 dark:text-indigo-300 font-medium">
                  Step 4: Department practical laboratories, testing beds, and workstation capacities.
                </div>

                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-200">
                    Registered Laboratories ({laboratories.length})
                  </label>
                </div>

                {laboratories.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {laboratories.map((lab, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
                        <div>
                          <strong className="text-slate-900 dark:text-white">{lab.name}</strong>
                          {lab.equipment && <p className="text-[11px] text-slate-500 mt-0.5">{lab.equipment}</p>}
                          {lab.capacity && <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Capacity: {lab.capacity} workstations</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLab(idx)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                          title="Remove laboratory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2.5">
                  <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    + Add New Laboratory
                  </span>
                  <input
                    type="text"
                    placeholder="Lab Name (e.g. Advanced Robotics & IoT Lab)"
                    value={newLabName}
                    onChange={(e) => setNewLabName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:text-white"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Key Equipment (e.g. 40x GPU Nodes)"
                      value={newLabEquipment}
                      onChange={(e) => setNewLabEquipment(e.target.value)}
                      className="col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Capacity"
                      value={newLabCapacity}
                      onChange={(e) => setNewLabCapacity(Number(e.target.value) || 30)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLab}
                    className="w-full py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    + Add Laboratory to Department
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 5: CURRICULUM & SYLLABI (MULTI-UPLOAD & ACADEMIC YEAR FIELDS) ── */}
            {activeFormTab === 'syllabus' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Top Banner with Batch Upload Action */}
                <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-purple-200 dark:border-purple-900/50 rounded-2xl text-xs text-purple-900 dark:text-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <span className="font-black uppercase tracking-wider block text-[10px] text-purple-600 dark:text-purple-400">
                      Step 5 of 5: Syllabi &amp; Curriculum Management
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      Upload Multiple Department Syllabi, Regulation Books &amp; Academic Handbooks
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload multiple PDF or Word DOC files at once, with custom title labels (e.g. <em>2024-2025 Syllabus</em>).
                    </p>
                  </div>

                  {/* Hidden Multi File Input */}
                  <input
                    type="file"
                    ref={batchFileInputRef}
                    onChange={handleBatchSyllabusUpload}
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isBatchUploading}
                      onClick={() => batchFileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isBatchUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading ({batchUploadProgress?.current}/{batchUploadProgress?.total})...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload Multi (PDF / DOC)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Batch upload in-flight progress */}
                {isBatchUploading && batchUploadProgress && (
                  <div className="p-3.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold">
                        Processing &amp; Uploading {batchUploadProgress.current} of {batchUploadProgress.total} documents...
                      </p>
                      <p className="text-[11px] text-purple-700 dark:text-purple-300 truncate mt-0.5">
                        {batchUploadProgress.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Dynamic Syllabi Documents List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Uploaded Syllabus Documents ({syllabi.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSyllabusItem}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Single Document</span>
                    </button>
                  </div>

                  {syllabi.length === 0 ? (
                    <div
                      onClick={() => batchFileInputRef.current?.click()}
                      className="p-8 border-2 border-dashed border-purple-200 dark:border-purple-900/60 rounded-2xl bg-purple-50/30 dark:bg-purple-950/10 text-center cursor-pointer hover:bg-purple-50/60 transition group"
                    >
                      <FileText className="w-10 h-10 text-purple-400 dark:text-purple-500 mx-auto mb-2.5 group-hover:scale-110 transition" />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        No Syllabus Documents Added Yet
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                        Click here to select multiple PDF/DOC files at once (e.g. <em>2024-2025 Syllabus</em>, <em>Regulation 2023</em>), or click <strong>+ Add Single Document</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {syllabi.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3 relative group shadow-xs"
                        >
                          {/* Row Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700/60">
                            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span>Document #{idx + 1}</span>
                            </span>
                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveSyllabusItem(idx, 'up')}
                                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
                                  title="Move up"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {idx < syllabi.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveSyllabusItem(idx, 'down')}
                                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
                                  title="Move down"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveSyllabusItem(idx)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer transition ml-1"
                                title="Delete document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* 1. TEXT FIELD BEFORE UPLOAD */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                              Document Title / Academic Year *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 2024-2025 Syllabus, Regulation 2024, or Master Handbook"
                              value={item.title}
                              onChange={(e) => handleUpdateSyllabusItem(idx, 'title', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            {/* Fast Presets Chips */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <span className="text-[10px] text-slate-400 font-medium">Suggestions:</span>
                              {[
                                '2024-2025 Syllabus',
                                '2023-2024 Syllabus',
                                '2025-2026 Syllabus',
                                'Regulation 2024 Curriculum',
                                'Master Department Handbook',
                              ].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => handleUpdateSyllabusItem(idx, 'title', preset)}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/70 hover:bg-purple-100 hover:text-purple-700 dark:bg-slate-700 dark:hover:bg-purple-900/60 dark:hover:text-purple-200 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                                >
                                  + {preset}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. FILE UPLOAD INPUT */}
                          <div className="pt-1">
                            <FileUploadInput
                              label="Upload Syllabus File (PDF / DOC / DOCX)"
                              value={item.fileUrl}
                              onChange={(val) => {
                                handleUpdateSyllabusItem(idx, 'fileUrl', val);
                                const ext = val.split('.').pop()?.toLowerCase() || 'pdf';
                                handleUpdateSyllabusItem(idx, 'fileType', ext);
                                if (!item.fileName) {
                                  handleUpdateSyllabusItem(idx, 'fileName', val.split('/').pop() || 'Document');
                                }
                              }}
                              placeholder="https://... or choose local PDF / DOC file"
                              helpText="Supports PDF, DOC, and DOCX files."
                              accept=".pdf,.doc,.docx"
                            />
                          </div>

                          {/* Live Preview / Status Badge */}
                          {item.fileUrl && (
                            <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] uppercase bg-purple-600 text-white">
                                  {item.fileType || item.fileUrl.split('.').pop() || 'PDF'}
                                </span>
                                <span className="font-bold text-purple-900 dark:text-purple-200 truncate">
                                  {item.fileName || item.title || 'Document attached'}
                                </span>
                              </div>
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-purple-600 hover:underline inline-flex items-center gap-1 shrink-0 ml-2"
                              >
                                <span>Preview</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    Degree Programs &amp; Semester Breakdown
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    The syllabus documents added above will appear for download in the public <strong>Curriculum &amp; Syllabi</strong> tab. Semester 1 to N breakdown for specific courses can also be configured under <strong>Courses &amp; Programs</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP-BY-STEP BOTTOM CONTROLS ── */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              {activeFormTab !== 'overview' ? (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['overview', 'hod', 'vision', 'labs', 'syllabus'] as const;
                    const currentIndex = tabs.indexOf(activeFormTab);
                    if (currentIndex > 0) setActiveFormTab(tabs[currentIndex - 1]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div />
              )}

              {activeFormTab !== 'syllabus' ? (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['overview', 'hod', 'vision', 'labs', 'syllabus'] as const;
                    const currentIndex = tabs.indexOf(activeFormTab);
                    if (currentIndex < tabs.length - 1) setActiveFormTab(tabs[currentIndex + 1]);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`This permanently deletes "${deleteTarget?.title}" and its courses. This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  );
};

export const CoursesManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  // Drawer State (Add, Edit, View)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [departmentId, setDepartmentId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [degreeLevel, setDegreeLevel] = useState('Undergraduate');
  const [durationYears, setDurationYears] = useState(4);
  const [totalSemesters, setTotalSemesters] = useState(8);
  const [regulationYear, setRegulationYear] = useState('2024');
  const [intake, setIntake] = useState(60);
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [semesterSyllabi, setSemesterSyllabi] = useState<SemesterSyllabusItem[]>([]);
  const [newSemNumber, setNewSemNumber] = useState(1);
  const [newSemTitle, setNewSemTitle] = useState('');
  const [newSemPdfUrl, setNewSemPdfUrl] = useState('');
  const [newSemCredits, setNewSemCredits] = useState(24);
  const [isUploadingSyllabus, setIsUploadingSyllabus] = useState(false);
  const syllabusFileRef = React.useRef<HTMLInputElement>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const handleSyllabusFileUpload = async (file: File) => {
    if (!file) return;
    try {
      setIsUploadingSyllabus(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', file.name);

      const response = await apiClient.post('/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const uploadedPath = response.data.data?.filePath || response.data.data?.url || '';
        setNewSemPdfUrl(uploadedPath);
        if (!newSemTitle.trim()) {
          setNewSemTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        showNotification('Syllabus PDF uploaded successfully');
      } else {
        showNotification(response.data.message || 'Failed to upload document', 'error');
      }
    } catch {
      showNotification('Failed to upload syllabus document', 'error');
    } finally {
      setIsUploadingSyllabus(false);
    }
  };

  const handleCourseNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, deptRes] = await Promise.all([
        apiClient.get('/admin/courses'),
        apiClient.get('/admin/departments')
      ]);
      if (coursesRes.data.success) setCourses(coursesRes.data.data.items || coursesRes.data.data || []);
      if (deptRes.data.success) {
        const depts = deptRes.data.data.items || deptRes.data.data || [];
        setDepartments(depts);
        if (depts.length > 0 && !departmentId) setDepartmentId(depts[0].id);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedCourse(null);
    setDrawerMode('create');
    setName('');
    setCode('');
    setSlug('');
    setAutoSlug(true);
    setDegreeLevel('Undergraduate');
    setDurationYears(4);
    setTotalSemesters(8);
    setRegulationYear('2024');
    setIntake(60);
    setDescription('');
    setEligibility('');
    setImageUrl('');
    setSemesterSyllabi([]);
    if (departments.length > 0) setDepartmentId(departments[0].id);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setSelectedCourse(course);
    setDrawerMode('edit');
    setDepartmentId(course.departmentId);
    setName(course.name);
    setCode(course.code);
    setSlug(course.slug || slugify(course.name || course.code));
    setAutoSlug(false);
    setDegreeLevel(course.degreeLevel || 'Undergraduate');
    setDurationYears(course.durationYears || 4);
    setTotalSemesters(course.totalSemesters || (course.durationYears ? course.durationYears * 2 : 8));
    setRegulationYear(course.regulationYear || '2024');
    setIntake(course.intake || 60);
    setDescription(course.description || '');
    setEligibility(course.eligibility || '');
    setImageUrl(course.imageUrl || (course as any).thumbnailUrl || '');
    setSemesterSyllabi(course.semesterSyllabi || []);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (course: Course) => {
    setSelectedCourse(course);
    setDrawerMode('view');
    setDepartmentId(course.departmentId);
    setName(course.name);
    setCode(course.code);
    setSlug(course.slug || slugify(course.name || course.code));
    setAutoSlug(false);
    setDegreeLevel(course.degreeLevel || 'Undergraduate');
    setDurationYears(course.durationYears || 4);
    setTotalSemesters(course.totalSemesters || (course.durationYears ? course.durationYears * 2 : 8));
    setRegulationYear(course.regulationYear || '2024');
    setIntake(course.intake || 60);
    setDescription(course.description || '');
    setEligibility(course.eligibility || '');
    setImageUrl(course.imageUrl || (course as any).thumbnailUrl || '');
    setSemesterSyllabi(course.semesterSyllabi || []);
    setIsDrawerOpen(true);
  };

  const handleAddSyllabus = () => {
    if (!newSemTitle.trim()) return;
    setSemesterSyllabi([
      ...semesterSyllabi,
      { semester: newSemNumber, title: newSemTitle.trim(), pdfUrl: newSemPdfUrl.trim(), credits: newSemCredits }
    ]);
    setNewSemNumber(newSemNumber + 1);
    setNewSemTitle('');
    setNewSemPdfUrl('');
  };

  const handleRemoveSyllabus = (index: number) => {
    setSemesterSyllabi(semesterSyllabi.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const computedSlug = slugify(slug || name || code);
      const payload = {
        departmentId,
        name,
        code: code.toUpperCase(),
        slug: computedSlug,
        degreeLevel,
        durationYears: Number(durationYears),
        totalSemesters: Number(totalSemesters),
        regulationYear,
        intake: Number(intake),
        description,
        eligibility,
        imageUrl,
        semesterSyllabi,
        isActive: selectedCourse ? selectedCourse.isActive !== false : true,
      };

      if (drawerMode === 'edit' && selectedCourse) {
        await apiClient.put(`/admin/courses/${selectedCourse.id}`, payload);
        showNotification('Course updated successfully');
      } else {
        await apiClient.post('/admin/courses', payload);
        showNotification('Course registered successfully');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch {
      showNotification('Failed to save course', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (course: Course) => {
    const nextStatus = course.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/courses/${course.id}`, {
        departmentId: course.departmentId,
        name: course.name,
        code: course.code,
        degreeLevel: course.degreeLevel,
        durationYears: course.durationYears,
        description: course.description,
        eligibility: course.eligibility,
        isActive: nextStatus,
      });
      showNotification(`"${course.name}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchData();
    } catch {
      showNotification('Failed to update course status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/courses/${deleteTarget.id}`);
      showNotification('Course deleted');
      setDeleteTarget(null);
      fetchData();
    } catch {
      showNotification('Failed to delete course', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.degreeLevel && c.degreeLevel.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = !selectedDeptFilter || String(c.departmentId) === String(selectedDeptFilter);
    return matchesSearch && matchesDept;
  });

  const activeCourses = courses.filter((c) => c.isActive !== false);
  const [showCoursesMonitor, setShowCoursesMonitor] = useState(true);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Courses &amp; Programs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage undergraduate, postgraduate, and doctoral offerings with eligibility criteria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Public Page Banner Customizer */}
      <ModulePageHeaderCustomizer
        moduleKey="courses"
        moduleLabel="Courses & Programs"
        defaultBadge="Curriculum & Degree Programs"
        defaultTitle="Courses & Programs"
        defaultSubtitle="Gain recognized degrees accredited by national and international bodies, empowered by experiential learning, cutting-edge labs, and corporate ecosystems."
      />

      {/* ── LIVE COURSES MONITOR (DARK & LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeCourses.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Live Courses &amp; Programs Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeCourses.length} Active · {courses.length - activeCourses.length} Inactive
            </span>
            <button
              type="button"
              onClick={() => setShowCoursesMonitor(!showCoursesMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {showCoursesMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showCoursesMonitor && (
          <div className="p-5 bg-slate-100/90 dark:bg-slate-950/60">
            {loading ? (
              <div className="text-center text-slate-500 dark:text-slate-400 text-xs py-4">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>No courses yet. Create your first course/program to see it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {courses.slice(0, 3).map((course) => {
                  const isActive = course.isActive !== false;
                  const dept = departments.find((d) => String(d.id) === String(course.departmentId));
                  return (
                    <div
                      key={course.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${isActive
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                          {course.code}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{course.degreeLevel}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{course.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>{course.durationYears} yr{course.durationYears !== 1 ? 's' : ''}</span>
                        {dept && <span className="text-slate-400 dark:text-slate-500">· {dept.code}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center pt-4">
              * Renders dynamically on your courses &amp; programs page. Showing {Math.min(courses.length, 3)} of {courses.length} courses.
            </p>
          </div>
        )}
      </div>

      {/* Search & Department Filter & View Switcher */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by name or code..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />
          </div>

          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs cursor-pointer min-w-[200px]"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${viewMode === 'card'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
                }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
                }`}
              title="Table / List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Course</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading courses...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Courses Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Add undergraduate or postgraduate degree offerings under your departments.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Course / Program</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => {
                  const isActive = course.isActive !== false;
                  const dept = departments.find((d) => String(d.id) === String(course.departmentId));
                  return (
                    <tr key={course.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {course.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {course.name}
                        {course.description && (
                          <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">{course.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {dept ? dept.name : <span className="text-slate-300 italic">—</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {course.degreeLevel || 'UG'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {course.durationYears} Year{course.durationYears !== 1 ? 's' : ''}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(course)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            }`}
                        >
                          {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(course)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Course Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(course)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Course"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: course.id, title: course.name })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Course"
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
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredCourses.map((course) => {
            const isActive = course.isActive !== false;
            const dept = departments.find((d) => String(d.id) === String(course.departmentId));

            return (
              <div
                key={course.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${isActive
                  ? 'border-slate-200'
                  : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-50 text-blue-700 uppercase border border-blue-100">
                      {course.code}
                    </span>
                    <button
                      onClick={() => toggleStatus(course)}
                      disabled={actionLoading}
                      title={isActive ? 'Click to make Inactive' : 'Click to make Active'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${isActive
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                        }`}
                    >
                      {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {course.name}
                  </h3>

                  {dept && (
                    <span className="inline-block text-[11px] font-medium text-slate-500">
                      Dept: {dept.name}
                    </span>
                  )}

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {course.degreeLevel || 'UG'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.durationYears} Years</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description || 'No description available.'}
                  </p>

                  {course.eligibility && (
                    <div className="pt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Eligibility</span>
                      <span className="line-clamp-2">{course.eligibility}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(course)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Course Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Course"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: course.id, title: course.name })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right-Side Drawer for Adding, Editing, and Viewing Course */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Degree Course"
        subtitle={
          drawerMode === 'create'
            ? 'Register a new degree course or academic program'
            : drawerMode === 'edit'
              ? `Update program details for ${selectedCourse?.name || 'course'}`
              : `Overview of ${selectedCourse?.name || 'course'}`
        }
        icon={<BookOpen className="w-5 h-5 text-primary" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedCourse ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg font-mono text-xs font-black bg-primary/10 text-primary uppercase">
                  {selectedCourse.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedCourse.isActive !== false
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                    }`}
                >
                  {selectedCourse.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedCourse.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Department: {departments.find((d) => d.id === selectedCourse.departmentId)?.name || 'General Department'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Degree Level
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCourse.degreeLevel || 'Undergraduate'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Duration & Semesters
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCourse.durationYears} Yrs ({selectedCourse.totalSemesters || 8} Sems)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Regulation & Intake
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Reg {selectedCourse.regulationYear || '2024'} • {selectedCourse.intake || 60} Seats
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Eligibility Criteria
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {selectedCourse.eligibility || 'Standard higher secondary admission rules apply.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Course Description & Curriculum Overview
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedCourse.description || 'No detailed syllabus overview provided.'}
              </p>
            </div>

            {selectedCourse.semesterSyllabi && selectedCourse.semesterSyllabi.length > 0 && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Configured Semester Syllabi ({selectedCourse.semesterSyllabi.length})
                </span>
                <div className="space-y-2">
                  {selectedCourse.semesterSyllabi.map((sem, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-2">Sem {sem.semester}:</span>
                        <span className="text-slate-600 dark:text-slate-300">{sem.title}</span>
                      </div>
                      {sem.pdfUrl && (
                        <a href={sem.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                          View PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                required
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleCourseNameChange(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BT-CSE"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm uppercase font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(true);
                      setSlug(slugify(name || code));
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                    title="Regenerate slug from name"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. btech-cse"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {slug && (
              <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-indigo-700 dark:text-indigo-300 truncate">
                  /courses/{slug}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(`/courses/${slug}`);
                    showNotification('Course path copied to clipboard');
                  }}
                  className="text-indigo-600 hover:text-indigo-800 shrink-0 p-1"
                  title="Copy link path"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Degree Level
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Undergraduate">Undergraduate (UG / B.Tech / B.Sc)</option>
                <option value="Postgraduate">Postgraduate (PG / M.Tech / MBA)</option>
                <option value="Doctoral">Doctoral (Ph.D / Research)</option>
                <option value="Diploma">Diploma / Certification</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Duration (Yrs)
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={durationYears}
                  onChange={(e) => setDurationYears(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Total Sems
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={totalSemesters}
                  onChange={(e) => setTotalSemesters(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Intake Seats
                </label>
                <input
                  type="number"
                  min={1}
                  value={intake}
                  onChange={(e) => setIntake(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Regulation Year (e.g. 2021 / 2024)
              </label>
              <input
                type="text"
                value={regulationYear}
                onChange={(e) => setRegulationYear(e.target.value)}
                placeholder="2024"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Eligibility Criteria
              </label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. 10+2 with 60% in Physics, Chemistry, Math"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Course Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Program overview, career paths, specializations..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <FileUploadInput
              label="Course Thumbnail / Card Feature Image"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://... or upload local course preview photo"
              helpText="Image displayed on the department course cards and listing pages."
              accept="image/*"
            />

            {/* Semester 1 to N Syllabus Repeater */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Semester 1 to {totalSemesters} Syllabus Documents ({semesterSyllabi.length})
                </label>
              </div>

              {semesterSyllabi.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {semesterSyllabi.map((sem, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <strong className="text-slate-900 dark:text-white">Semester {sem.semester}: {sem.title}</strong>
                        {sem.pdfUrl && <p className="text-[11px] text-blue-600 truncate max-w-xs">{sem.pdfUrl}</p>}
                        {sem.credits && <p className="text-[10px] text-slate-400">Credits: {sem.credits}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSyllabus(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    placeholder="Sem #"
                    min={1}
                    max={totalSemesters}
                    value={newSemNumber}
                    onChange={(e) => setNewSemNumber(Number(e.target.value) || 1)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Syllabus Title (e.g. Sem 1 Core)"
                    value={newSemTitle}
                    onChange={(e) => setNewSemTitle(e.target.value)}
                    className="col-span-3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="PDF Document URL or Upload from PC"
                      value={newSemPdfUrl}
                      onChange={(e) => setNewSemPdfUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800"
                    />
                    <input
                      type="file"
                      ref={syllabusFileRef}
                      accept=".pdf,.doc,.docx,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleSyllabusFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={isUploadingSyllabus}
                      onClick={() => syllabusFileRef.current?.click()}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      {isUploadingSyllabus ? 'Uploading...' : '📁 Upload PDF'}
                    </button>
                    <input
                      type="number"
                      placeholder="Credits"
                      value={newSemCredits}
                      onChange={(e) => setNewSemCredits(Number(e.target.value) || 24)}
                      className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddSyllabus}
                  className="w-full py-1.5 bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs rounded-lg hover:bg-slate-900 cursor-pointer"
                >
                  + Add Semester Syllabus Document
                </button>
              </div>
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`This permanently deletes "${deleteTarget?.title}". This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  );
};