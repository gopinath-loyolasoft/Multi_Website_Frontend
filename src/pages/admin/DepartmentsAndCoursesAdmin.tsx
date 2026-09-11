import React, { useEffect, useState } from 'react';
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


  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, DrawerMode, ConfirmDialog } from '../../UI_Componentes/ui';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment: string;
  email: string;
  isActive: boolean;
}

interface Course {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  degreeLevel: string;
  durationYears: number;
  description: string;
  eligibility: string;
  isActive: boolean;
}

export const DepartmentsManagementPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  // Drawer State (Add, Edit, View)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [email, setEmail] = useState('');

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
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

  const handleOpenCreate = () => {
    setSelectedDept(null);
    setDrawerMode('create');
    setName('');
    setCode('');
    setDescription('');
    setHeadOfDepartment('');
    setEmail('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setSelectedDept(dept);
    setDrawerMode('edit');
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description || '');
    setHeadOfDepartment(dept.headOfDepartment || '');
    setEmail(dept.email || '');
    setIsDrawerOpen(true);
  };

  const handleOpenView = (dept: Department) => {
    setSelectedDept(dept);
    setDrawerMode('view');
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description || '');
    setHeadOfDepartment(dept.headOfDepartment || '');
    setEmail(dept.email || '');
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (drawerMode === 'edit' && selectedDept) {
        await apiClient.put(`/admin/departments/${selectedDept.id}`, {
          name,
          code: code.toUpperCase(),
          description,
          headOfDepartment,
          email,
          isActive: selectedDept.isActive !== false,
        });
        showNotification('Department updated successfully');
      } else {
        await apiClient.post('/admin/departments', {
          name,
          code: code.toUpperCase(),
          description,
          headOfDepartment,
          email,
          isActive: true,
        });
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

      {/* Notification banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── LIVE DEPARTMENTS MONITOR (LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeDepartments.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Live Departments Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              {activeDepartments.length} Active · {departments.length - activeDepartments.length} Inactive
            </span>
            <button
              type="button"
              onClick={() => setShowDeptMonitor(!showDeptMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {showDeptMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showDeptMonitor && (
          <div className="p-5 bg-slate-50/50">
            {loading ? (
              <div className="text-center text-slate-500 text-xs py-4">Loading departments...</div>
            ) : departments.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
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
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-100/70 border-dashed border-slate-300 opacity-60'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black font-mono bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {dept.code}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        />
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{dept.name}</p>
                      {dept.headOfDepartment && (
                        <p className="text-[11px] text-slate-500 truncate font-medium">HOD: {dept.headOfDepartment}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 italic text-center pt-4">
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
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Head of Department (HOD)
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedDept.headOfDepartment || 'Not assigned'}
                </p>
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
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Department Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CSE, MECH, EEE, MBA"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm uppercase font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Head of Department (HOD)
              </label>
              <input
                type="text"
                value={headOfDepartment}
                onChange={(e) => setHeadOfDepartment(e.target.value)}
                placeholder="e.g. Dr. Rajesh Kumar, Ph.D."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Contact Email
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
                Brief Overview / Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Focus areas, research labs, accreditation..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:outline-none"
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
        title="Delete Department"
        message={`This permanently deletes "${deleteTarget?.title}" and its courses. This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  );
};

export const CoursesManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  // Drawer State (Add, Edit, View)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [departmentId, setDepartmentId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [degreeLevel, setDegreeLevel] = useState('Undergraduate');
  const [durationYears, setDurationYears] = useState(4);
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
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
    setDegreeLevel('Undergraduate');
    setDurationYears(4);
    setDescription('');
    setEligibility('');
    if (departments.length > 0) setDepartmentId(departments[0].id);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setSelectedCourse(course);
    setDrawerMode('edit');
    setDepartmentId(course.departmentId);
    setName(course.name);
    setCode(course.code);
    setDegreeLevel(course.degreeLevel || 'Undergraduate');
    setDurationYears(course.durationYears || 4);
    setDescription(course.description || '');
    setEligibility(course.eligibility || '');
    setIsDrawerOpen(true);
  };

  const handleOpenView = (course: Course) => {
    setSelectedCourse(course);
    setDrawerMode('view');
    setDepartmentId(course.departmentId);
    setName(course.name);
    setCode(course.code);
    setDegreeLevel(course.degreeLevel || 'Undergraduate');
    setDurationYears(course.durationYears || 4);
    setDescription(course.description || '');
    setEligibility(course.eligibility || '');
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (drawerMode === 'edit' && selectedCourse) {
        await apiClient.put(`/admin/courses/${selectedCourse.id}`, {
          departmentId,
          name,
          code: code.toUpperCase(),
          degreeLevel,
          durationYears: Number(durationYears),
          description,
          eligibility,
          isActive: selectedCourse.isActive !== false,
        });
        showNotification('Course updated successfully');
      } else {
        await apiClient.post('/admin/courses', {
          departmentId,
          name,
          code: code.toUpperCase(),
          degreeLevel,
          durationYears: Number(durationYears),
          description,
          eligibility,
          isActive: true,
        });
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
            <span>Degree Courses &amp; Programs</span>
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

      {/* Notification banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── LIVE COURSES MONITOR (LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeCourses.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Live Courses &amp; Programs Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              {activeCourses.length} Active · {courses.length - activeCourses.length} Inactive
            </span>
            <button
              type="button"
              onClick={() => setShowCoursesMonitor(!showCoursesMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {showCoursesMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showCoursesMonitor && (
          <div className="p-5 bg-slate-50/50">
            {loading ? (
              <div className="text-center text-slate-500 text-xs py-4">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
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
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-100/70 border-dashed border-slate-300 opacity-60'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {course.code}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">{course.degreeLevel}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{course.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span>{course.durationYears} yr{course.durationYears !== 1 ? 's' : ''}</span>
                        {dept && <span className="text-slate-400">· {dept.code}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 italic text-center pt-4">
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

            <div className="grid grid-cols-2 gap-3">
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
                  Program Duration
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCourse.durationYears} {selectedCourse.durationYears === 1 ? 'Year' : 'Years'}
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
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. BT-CSE"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm uppercase font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Duration (Years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={durationYears}
                  onChange={(e) => setDurationYears(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
            </div>

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