import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Mail, 
  Award, 
  Search, 
  Check, 
  X, 
  ExternalLink,
  GraduationCap,
  Copy,
  Lock,
  Unlock,
  RotateCcw,
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { slugify, copyToClipboard } from '../../utils/helpers';
import { FormDrawer, DrawerMode, FileUploadInput, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';

interface Faculty {
  id: string;
  departmentId: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  qualificationDetails?: string;
  researchInterests?: string;
  email: string;
  phone?: string;
  officeRoom?: string;
  profileImageUrl?: string;
  bio?: string;
  sortOrder?: number;
  isActive: boolean;
}

interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  category?: string;
  isPublished: boolean;
}

export const FacultyManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [showFacultyMonitor, setShowFacultyMonitor] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Drawer State (Add, Edit, View)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // Section A: Basic Information
  const [departmentId, setDepartmentId] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('Professor');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  // Section B: Academic Information
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualificationDetails, setQualificationDetails] = useState('');
  const [researchInterests, setResearchInterests] = useState('');

  // Section C: Contact Details
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [officeRoom, setOfficeRoom] = useState('');

  // Section D: Website Display Settings
  const [bio, setBio] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facRes, deptRes] = await Promise.all([
        apiClient.get('/admin/faculty'),
        apiClient.get('/admin/departments')
      ]);
      if (facRes.data.success) setFacultyList(facRes.data.data.items || facRes.data.data || []);
      if (deptRes.data.success) {
        const depts = deptRes.data.data.items || deptRes.data.data || [];
        setDepartments(depts);
        if (depts.length > 0 && !departmentId) setDepartmentId(depts[0].id);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load faculty directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedFaculty(null);
    setDrawerMode('create');
    setName('');
    setDesignation('Professor');
    setProfileImageUrl('');
    setQualification('');
    setSpecialization('');
    setQualificationDetails('');
    setResearchInterests('');
    setEmail('');
    setPhone('');
    setOfficeRoom('');
    setBio('');
    setSortOrder(1);
    setIsActive(true);
    if (departments.length > 0) setDepartmentId(departments[0].id);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (f: Faculty) => {
    setSelectedFaculty(f);
    setDrawerMode('edit');
    setDepartmentId(f.departmentId);
    setName(f.name);
    setDesignation(f.designation);
    setProfileImageUrl(f.profileImageUrl || '');
    setQualification(f.qualification || '');
    setSpecialization(f.specialization || '');
    setQualificationDetails(f.qualificationDetails || '');
    setResearchInterests(f.researchInterests || '');
    setEmail(f.email || '');
    setPhone(f.phone || '');
    setOfficeRoom(f.officeRoom || '');
    setBio(f.bio || '');
    setSortOrder(f.sortOrder || 1);
    setIsActive(f.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (f: Faculty) => {
    setSelectedFaculty(f);
    setDrawerMode('view');
    setDepartmentId(f.departmentId);
    setName(f.name);
    setDesignation(f.designation);
    setProfileImageUrl(f.profileImageUrl || '');
    setQualification(f.qualification || '');
    setSpecialization(f.specialization || '');
    setQualificationDetails(f.qualificationDetails || '');
    setResearchInterests(f.researchInterests || '');
    setEmail(f.email || '');
    setPhone(f.phone || '');
    setOfficeRoom(f.officeRoom || '');
    setBio(f.bio || '');
    setSortOrder(f.sortOrder || 1);
    setIsActive(f.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        departmentId,
        name,
        designation,
        profileImageUrl,
        qualification,
        specialization,
        qualificationDetails,
        researchInterests,
        email,
        phone,
        officeRoom,
        bio,
        sortOrder: Number(sortOrder) || 1,
        isActive,
      };

      if (drawerMode === 'edit' && selectedFaculty) {
        await apiClient.put(`/admin/faculty/${selectedFaculty.id}`, payload);
        showNotification('Faculty profile updated successfully');
      } else {
        await apiClient.post('/admin/faculty', payload);
        showNotification('Faculty member added successfully');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch {
      showNotification('Failed to save faculty profile', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (f: Faculty) => {
    const nextStatus = f.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/faculty/${f.id}`, {
        departmentId: f.departmentId,
        name: f.name,
        designation: f.designation,
        qualification: f.qualification,
        specialization: f.specialization,
        qualificationDetails: f.qualificationDetails,
        researchInterests: f.researchInterests,
        email: f.email,
        phone: f.phone,
        officeRoom: f.officeRoom,
        profileImageUrl: f.profileImageUrl,
        bio: f.bio,
        sortOrder: f.sortOrder || 1,
        isActive: nextStatus,
      });
      showNotification(`"${f.name}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchData();
    } catch {
      showNotification('Failed to update faculty status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/faculty/${deleteTarget.id}`);
      showNotification('Faculty profile removed');
      setDeleteTarget(null);
      fetchData();
    } catch {
      showNotification('Failed to delete faculty profile', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.specialization && f.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.qualification && f.qualification.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = !selectedDeptFilter || String(f.departmentId) === String(selectedDeptFilter);
    return matchesSearch && matchesDept;
  });

  const activeFaculty = facultyList.filter((f) => f.isActive !== false);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Faculty Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage professors, lecturers, researchers, qualifications, and specializations.
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
        moduleKey="faculty"
        moduleLabel="Faculty Directory"
        defaultBadge="Distinguished Faculty"
        defaultTitle="World-Class Faculty & Academic Mentors"
        defaultSubtitle="Meet our accomplished professors, researchers, and academic mentors driving educational excellence and cutting-edge research."
      />

      {/* ── LIVE FACULTY MONITOR (DARK & LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeFaculty.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Live Faculty Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeFaculty.length} Active · {facultyList.length - activeFaculty.length} Inactive
            </span>
            <button
              type="button"
              onClick={() => setShowFacultyMonitor(!showFacultyMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {showFacultyMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showFacultyMonitor && (
          <div className="p-5 bg-slate-100/90 dark:bg-slate-950/60">
            {loading ? (
              <div className="text-center text-slate-500 dark:text-slate-400 text-xs py-4">Loading faculty directory...</div>
            ) : facultyList.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>No faculty members yet. Add your first faculty member to see it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {facultyList.slice(0, 4).map((fac) => {
                  const isActive = fac.isActive !== false;
                  const dept = departments.find((d) => String(d.id) === String(fac.departmentId));
                  return (
                    <div
                      key={fac.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${
                        isActive
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                          : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 truncate max-w-[140px]">
                          {fac.designation || 'Faculty'}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">{fac.name}</p>
                      {dept && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">Dept: {dept.name}</p>
                      )}
                      {fac.qualification && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{fac.qualification}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center pt-4">
              * Renders dynamically on your faculty directory page. Showing {Math.min(facultyList.length, 4)} of {facultyList.length} faculty profiles.
            </p>
          </div>
        )}
      </div>

      {/* Search Bar, Department Filter & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, designation, or specialization..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm min-w-[180px] cursor-pointer"
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'card'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'list'
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
            <span>New Faculty Profile</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading faculty directory...
        </div>
      ) : filteredFaculty.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Faculty Profiles Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Add teaching staff, research scholars, and heads of departments.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Qualification & Specialization</th>
                  <th className="py-3 px-4">Email / Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFaculty.map((fac) => {
                  const isActive = fac.isActive !== false;
                  const dept = departments.find((d) => String(d.id) === String(fac.departmentId));
                  return (
                    <tr key={fac.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {fac.profileImageUrl ? (
                            <img
                              src={fac.profileImageUrl}
                              alt={fac.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {fac.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{fac.name}</p>
                            {fac.officeRoom && (
                              <p className="text-[10px] text-slate-400 font-medium">Room: {fac.officeRoom}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {dept ? (
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                            {dept.code}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {fac.designation}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {fac.qualification && <div className="font-medium text-slate-700">{fac.qualification}</div>}
                        {fac.specialization && <div className="text-[11px] text-slate-400">{fac.specialization}</div>}
                        {!fac.qualification && !fac.specialization && <span className="text-slate-300 italic">—</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {fac.email && <div>{fac.email}</div>}
                        {fac.phone && <div className="text-slate-400 text-[10px]">{fac.phone}</div>}
                        {!fac.email && !fac.phone && <span className="text-slate-300 italic">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(fac)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isActive
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
                            onClick={() => handleOpenView(fac)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(fac)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: fac.id, name: fac.name })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Profile"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.map((fac) => {
            const isActive = fac.isActive !== false;
            const dept = departments.find((d) => String(d.id) === String(fac.departmentId));

            return (
              <div
                key={fac.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                  isActive
                    ? 'border-slate-200'
                    : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {fac.designation}
                    </span>
                    <button
                      onClick={() => toggleStatus(fac)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {fac.profileImageUrl ? (
                      <img
                        src={fac.profileImageUrl}
                        alt={fac.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {fac.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                    )}
                    <div>
                      <h3 className={`font-bold text-base leading-snug ${isActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                        {fac.name}
                      </h3>
                      {dept && (
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          Dept: {dept.name} ({dept.code})
                        </span>
                      )}
                    </div>
                  </div>

                  {fac.qualification && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.qualification}</span>
                    </div>
                  )}

                  {fac.specialization && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.specialization}</span>
                    </div>
                  )}

                  {fac.email && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono truncate pt-1">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{fac.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(fac)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(fac)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: fac.id, name: fac.name })}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FormDrawer for Faculty Profile (Create / Edit / View) */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Add Faculty Member'
            : drawerMode === 'edit'
            ? 'Edit Faculty Profile'
            : selectedFaculty?.name || 'Faculty Profile'
        }
        subtitle={
          drawerMode === 'create'
            ? 'Register a new professor, lecturer, or mentor'
            : drawerMode === 'edit'
            ? 'Update academic credentials and departmental assignment'
            : 'Faculty profile details and contact information'
        }
        icon={<Users className="w-5 h-5 text-blue-600" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="lg"
      >
        {drawerMode === 'view' && selectedFaculty ? (
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
              {selectedFaculty.profileImageUrl ? (
                <img
                  src={selectedFaculty.profileImageUrl}
                  alt={selectedFaculty.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  {selectedFaculty.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedFaculty.name}</h3>
                <p className="text-xs font-semibold text-blue-700">{selectedFaculty.designation}</p>
                <p className="text-xs text-slate-500">
                  {departments.find((d) => String(d.id) === String(selectedFaculty.departmentId))?.name || 'Unassigned'}
                </p>
              </div>
            </div>

            {/* Academic details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Academic Credentials</h4>
              {selectedFaculty.qualification && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Highest Qualification</span>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">{selectedFaculty.qualification}</p>
                </div>
              )}
              {selectedFaculty.qualificationDetails && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Qualification Details</span>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedFaculty.qualificationDetails}</p>
                </div>
              )}
              {selectedFaculty.specialization && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Research Specialization</span>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">{selectedFaculty.specialization}</p>
                </div>
              )}
              {selectedFaculty.researchInterests && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Research Interests</span>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedFaculty.researchInterests}</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact & Location</h4>
              {selectedFaculty.email && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Official Email</span>
                  <p className="text-xs font-mono text-slate-700 mt-0.5">{selectedFaculty.email}</p>
                </div>
              )}
              {selectedFaculty.phone && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Phone Number</span>
                  <p className="text-xs font-mono text-slate-700 mt-0.5">{selectedFaculty.phone}</p>
                </div>
              )}
              {selectedFaculty.officeRoom && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Office / Room</span>
                  <p className="text-xs text-slate-700 mt-0.5">{selectedFaculty.officeRoom}</p>
                </div>
              )}
            </div>

            {/* Bio */}
            {selectedFaculty.bio && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Biography</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedFaculty.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* ── SECTION A: BASIC INFORMATION ── */}
            <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">A</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Basic Information</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Department *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer bg-white"
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
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Designation *
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer bg-white"
                    required
                  >
                    <option value="Professor & Head of Department">Professor & Head of Department</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Research Director">Research Director</option>
                    <option value="Visiting Faculty">Visiting Faculty</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. A. P. Raman"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  required
                />
              </div>

              <FileUploadInput
                label="Profile Photo (URL or Upload)"
                value={profileImageUrl}
                onChange={setProfileImageUrl}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            {/* ── SECTION B: ACADEMIC INFORMATION ── */}
            <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">B</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Academic Information</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. Ph.D. in Computer Science"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Research Specialization
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Artificial Intelligence, Machine Learning"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Qualification Details
                </label>
                <input
                  type="text"
                  value={qualificationDetails}
                  onChange={(e) => setQualificationDetails(e.target.value)}
                  placeholder="e.g. Ph.D. in Computer Science – Anna University"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Research Interests
                </label>
                <input
                  type="text"
                  value={researchInterests}
                  onChange={(e) => setResearchInterests(e.target.value)}
                  placeholder="e.g. AI, ML, Computer Vision, Robotics"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* ── SECTION C: CONTACT DETAILS ── */}
            <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">C</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Contact Details</h4>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. faculty@college.edu"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Office / Room
                  </label>
                  <input
                    type="text"
                    value={officeRoom}
                    onChange={(e) => setOfficeRoom(e.target.value)}
                    placeholder="e.g. Block A - 204"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION D: WEBSITE DISPLAY SETTINGS ── */}
            <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">D</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Website Display Settings</h4>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Short Biography
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write short faculty biography, career summary, and background..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>{isActive ? 'Active (Visible on Website)' : 'Inactive (Hidden)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Faculty Profile"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from the faculty directory?`}
        confirmText="Delete Profile"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
};

const GALLERY_CATEGORIES = [
  'Campus',
  'Academics',
  'Sports',
  'Cultural',
  'Convocation',
  'Events & Fests',
  'Seminars & Conferences',
  'Research & Expo',
  'Hostel & Student Life',
  'Placements & Alumni',
];

export const GalleryManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [showGalleryMonitor, setShowGalleryMonitor] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [category, setCategory] = useState('Campus');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const handleCopyLink = (targetSlug: string) => {
    const url = `/gallery/${targetSlug}`;
    copyToClipboard(url);
    setCopiedSlug(targetSlug);
    showNotification(`Copied URL "${url}" to clipboard!`);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/gallery');
      if (res.data.success) {
        setGalleries(res.data.data.items || res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load gallery albums', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (autoSlug) {
      setSlug(slugify(newTitle));
    }
  };

  const handleOpenCreate = () => {
    setSelectedGallery(null);
    setTitle('');
    setSlug('');
    setAutoSlug(true);
    setDescription('');
    setCoverImageUrl('');
    setCategory('Campus');
    setCustomCategory('');
    setIsCustomCategory(false);
    setIsPublished(true);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (g: Gallery) => {
    setSelectedGallery(g);
    setTitle(g.title);
    setSlug(g.slug || slugify(g.title));
    setAutoSlug(false);
    setDescription(g.description || '');
    setCoverImageUrl(g.coverImageUrl || '');
    const galCat = g.category || 'Campus';
    if (GALLERY_CATEGORIES.includes(galCat)) {
      setCategory(galCat);
      setIsCustomCategory(false);
      setCustomCategory('');
    } else {
      setCategory('Custom');
      setIsCustomCategory(true);
      setCustomCategory(galCat);
    }
    setIsPublished(g.isPublished !== false);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleOpenView = (g: Gallery) => {
    setSelectedGallery(g);
    setTitle(g.title);
    setSlug(g.slug || slugify(g.title));
    setAutoSlug(false);
    setDescription(g.description || '');
    setCoverImageUrl(g.coverImageUrl || '');
    const galCat = g.category || 'Campus';
    if (GALLERY_CATEGORIES.includes(galCat)) {
      setCategory(galCat);
      setIsCustomCategory(false);
      setCustomCategory('');
    } else {
      setCategory('Custom');
      setIsCustomCategory(true);
      setCustomCategory(galCat);
    }
    setIsPublished(g.isPublished !== false);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slugify(slug || title);
    const finalCategory = isCustomCategory ? (customCategory.trim() || 'Campus') : category;
    try {
      setActionLoading(true);
      if (drawerMode === 'edit' && selectedGallery) {
        await apiClient.put(`/admin/gallery/${selectedGallery.id}`, {
          title,
          slug: finalSlug,
          description,
          coverImageUrl,
          category: finalCategory,
          isPublished,
        });
        showNotification('Gallery album updated');
      } else {
        await apiClient.post('/admin/gallery', {
          title,
          slug: finalSlug,
          description,
          coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
          category: finalCategory,
          isPublished,
        });
        showNotification('Gallery album created');
      }
      setIsDrawerOpen(false);
      fetchGalleries();
    } catch {
      showNotification('Failed to save gallery', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (g: Gallery) => {
    const nextStatus = g.isPublished === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/gallery/${g.id}`, {
        title: g.title,
        slug: g.slug,
        description: g.description,
        coverImageUrl: g.coverImageUrl,
        category: g.category || 'Campus',
        isPublished: nextStatus,
      });
      showNotification(`"${g.title}" is now ${nextStatus ? 'PUBLISHED' : 'DRAFT'}`);
      fetchGalleries();
    } catch {
      showNotification('Failed to update album status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/gallery/${deleteTarget.id}`);
      showNotification('Gallery album deleted');
      setDeleteTarget(null);
      fetchGalleries();
    } catch {
      showNotification('Failed to delete album', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Compute available filter categories for admin toolbar
  const adminCategories = React.useMemo(() => {
    const cats = new Set<string>();
    galleries.forEach((g) => {
      if (g.category && g.category.trim()) cats.add(g.category.trim());
    });
    return Array.from(cats);
  }, [galleries]);

  const filteredGalleries = galleries.filter((g) => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.category && g.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.slug && g.slug.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedFilterCategory === 'ALL' || (g.category || 'Campus').toLowerCase() === selectedFilterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const publishedGalleries = galleries.filter((g) => g.isPublished !== false);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            <span>Photo & Event Gallery</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish event photo albums, convocations, campus infrastructure, and laboratory tours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchGalleries}
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
        moduleKey="gallery"
        moduleLabel="Campus Photo Gallery"
        defaultBadge="Campus In Pictures"
        defaultTitle="Photo Gallery & Life at Campus"
        defaultSubtitle="A visual journey through state-of-the-art laboratories, infrastructure, sports meets, cultural fests, and student life."
      />

      {/* ── LIVE GALLERY MONITOR (DARK & LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${publishedGalleries.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Live Gallery Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {publishedGalleries.length} Published · {galleries.length - publishedGalleries.length} Draft
            </span>
            <button
              type="button"
              onClick={() => setShowGalleryMonitor(!showGalleryMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {showGalleryMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showGalleryMonitor && (
          <div className="p-5 bg-slate-100/90 dark:bg-slate-950/60">
            {loading ? (
              <div className="text-center text-slate-500 dark:text-slate-400 text-xs py-4">Loading gallery albums...</div>
            ) : galleries.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>No photo albums yet. Create your first album to showcase campus life.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {galleries.slice(0, 4).map((gal) => {
                  const isPub = gal.isPublished !== false;
                  return (
                    <div
                      key={gal.id}
                      className={`rounded-xl p-3 space-y-2 border transition ${
                        isPub
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                          : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <div className="h-24 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                        <img
                          src={gal.coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80'}
                          alt={gal.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                          {gal.category || 'Campus'}
                        </span>
                        <span
                          className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${isPub ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">{gal.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">/gallery/{gal.slug || slugify(gal.title)}</p>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center pt-4">
              * Renders dynamically on your gallery page. Showing {Math.min(galleries.length, 4)} of {galleries.length} photo albums.
            </p>
          </div>
        )}
      </div>

      {/* Search Bar, Category Filter & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search albums by title, category, or description..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm min-w-[160px] cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {adminCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'card'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'list'
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
            <span>New Album</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading gallery albums...
        </div>
      ) : filteredGalleries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Photo Albums Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Create photo albums to showcase campus festivals, sports days, and ceremonies.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">Album Title & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGalleries.map((gal) => {
                  const isPub = gal.isPublished !== false;
                  const albumSlug = gal.slug || slugify(gal.title);
                  const isCopied = copiedSlug === albumSlug;

                  return (
                    <tr key={gal.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                          <img
                            src={gal.coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80'}
                            alt={gal.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{gal.title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <button
                            onClick={() => handleCopyLink(albumSlug)}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
                            }`}
                            title="Click to copy public URL"
                          >
                            {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            <span>/gallery/{albumSlug}</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {gal.category || 'Campus'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {gal.description || <span className="text-slate-300 italic">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(gal)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isPub
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isPub ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/gallery/${albumSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Open Public Album"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleOpenView(gal)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Album"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(gal)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Album"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: gal.id, title: gal.title })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Album"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGalleries.map((gal) => {
            const isPub = gal.isPublished !== false;
            const albumSlug = gal.slug || slugify(gal.title);
            const isCopied = copiedSlug === albumSlug;
            const galCategory = gal.category || 'Campus';

            return (
              <div
                key={gal.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between transition ${
                  isPub
                    ? 'border-slate-200'
                    : 'border-dashed border-red-200 opacity-75'
                }`}
              >
                {/* Cover Image */}
                <div className="h-40 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={gal.coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80'}
                    alt={gal.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {/* Category & Published Badges */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white shadow-sm">
                      {galCategory}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => toggleStatus(gal)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition shadow-sm cursor-pointer ${
                        isPub ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {isPub ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {gal.title}
                    </h3>
                    
                    {/* Slug & Copy Link Pill */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyLink(albumSlug)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
                        }`}
                        title="Click to copy public URL"
                      >
                        {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>/gallery/{albumSlug}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {gal.description || 'Campus photo collection'}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`/gallery/${albumSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Public Album</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenView(gal)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="View Album"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(gal)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="Edit Album"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: gal.id, title: gal.title })}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete Album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FormDrawer for Creating / Editing / Viewing Gallery Album */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Create Gallery Album'
            : drawerMode === 'edit'
            ? 'Edit Gallery Album'
            : selectedGallery?.title || 'Album Details'
        }
        subtitle={
          drawerMode === 'create'
            ? 'Upload photos and create a new campus event album'
            : drawerMode === 'edit'
            ? 'Update album title, slug, cover image, or details'
            : 'Gallery album preview and settings'
        }
        icon={<ImageIcon className="w-5 h-5 text-blue-600" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedGallery ? (
          <div className="space-y-4">
            {selectedGallery.coverImageUrl && (
              <div className="h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedGallery.coverImageUrl}
                  alt={selectedGallery.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Album Title</span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{selectedGallery.title}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Category</span>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mt-1">
                  {selectedGallery.category || 'Campus'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Public URL Route</span>
                <p className="text-xs font-mono text-blue-600 mt-0.5">/gallery/{selectedGallery.slug || slugify(selectedGallery.title)}</p>
              </div>
              {selectedGallery.description && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Description</span>
                  <p className="text-sm text-slate-700 mt-0.5">{selectedGallery.description}</p>
                </div>
              )}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Visibility</span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${selectedGallery.isPublished !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {selectedGallery.isPublished !== false ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Album Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Annual Convocation 2026"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Category / Type Field Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Album Category / Type *
              </label>
              <select
                value={isCustomCategory ? '__CUSTOM__' : category}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '__CUSTOM__') {
                    setIsCustomCategory(true);
                  } else {
                    setIsCustomCategory(false);
                    setCategory(val);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                required
              >
                {GALLERY_CATEGORIES.map((catOption) => (
                  <option key={catOption} value={catOption}>
                    {catOption}
                  </option>
                ))}
                <option value="__CUSTOM__">+ Custom / Other Type</option>
              </select>

              {isCustomCategory && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name (e.g. NCC & NSS, Robotics Expo)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required={isCustomCategory}
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* URL Slug Field with Auto-Sync & Custom toggles */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  URL Slug *
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !autoSlug;
                      setAutoSlug(next);
                      if (next && title) {
                        setSlug(slugify(title));
                      }
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                      autoSlug
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                    title={autoSlug ? 'Auto-generating from title (click to unlock custom edit)' : 'Custom slug mode (click to re-enable auto-sync)'}
                  >
                    {autoSlug ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                    <span>{autoSlug ? 'Auto-Sync' : 'Custom'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(title))}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Sync slug with current title"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Sync</span>
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="e.g. annual-convocation-2026"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
              <p className="text-[11px] text-slate-400">
                Public Route: <span className="font-mono text-blue-600">/gallery/{slug || 'album-slug'}</span>
              </p>
            </div>

            {/* Local File Upload for Cover Image */}
            <FileUploadInput
              label="COVER IMAGE"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              placeholder="/assets/templates/... or upload local image"
              helpText="Upload an album cover photo from your computer or paste an image URL."
              accept="image/*"
            />

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Album Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Moments captured from campus ceremonies, student festivals, and sports..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Published Status Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase text-slate-700 block">Album Visibility</span>
                <span className="text-[11px] text-slate-500">
                  {isPublished ? 'Visible to public visitors on live site' : 'Hidden as draft'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isPublished
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {isPublished ? 'Published' : 'Draft'}
              </button>
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Gallery Album"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All photos in this album will be removed.`}
        confirmText="Delete Album"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
};
