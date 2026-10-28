import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Pencil,
  KeyRound,
  Building2,
  Trash2,
  Power,
  AlertCircle
} from 'lucide-react';
import { AdminUserItem, Tenant, RoleItem } from '../../types';

interface UserTenantMembership {
  tenantId: string | number;
  roleId?: string | number | null;
}
import { apiClient, getApiErrorMessage } from '../../services/apiClient';
import { FormDrawer, Input, ConfirmDialog, useToast } from '../../UI_Componentes/ui';

const getCurrentUsername = (): string => {
  try {
    const raw = localStorage.getItem('college_auth_user');
    return raw ? (JSON.parse(raw)?.username || '') : '';
  } catch {
    return '';
  }
};

export const CollegeAdminsPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [tenantId, setTenantId] = useState<string>('');
  const [role, setRole] = useState('CollegeAdmin');
  const [createLoading, setCreateLoading] = useState(false);

  // Edit drawer state
  const [editTarget, setEditTarget] = useState<AdminUserItem | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  // Multi-college assignment drawer state
  const [assignTarget, setAssignTarget] = useState<AdminUserItem | null>(null);
  const [assignedTenantIds, setAssignedTenantIds] = useState<string[]>([]);
  const [assignedRoleId, setAssignedRoleId] = useState<string>('');
  const [assignLoading, setAssignLoading] = useState(false);

  // Password reset drawer state
  const [resetTarget, setResetTarget] = useState<AdminUserItem | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<AdminUserItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Toggle status busy state
  const [toggleBusyId, setToggleBusyId] = useState<string | number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, colRes, rolesRes] = await Promise.all([
        apiClient.get('/superadmin/users'),
        apiClient.get('/superadmin/colleges'),
        apiClient.get('/superadmin/roles').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      if (usersRes.data.success) setUsers(usersRes.data.data || []);
      if (colRes.data.success) {
        const cols = colRes.data.data || [];
        setColleges(cols);
        setTenantId((prev) => prev || (cols[0]?.id ? String(cols[0].id) : ''));
      }
      if (rolesRes.data?.success) setRoles(rolesRes.data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load administrators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      await apiClient.post('/superadmin/users', {
        tenantId: role === 'SuperAdmin' ? null : tenantId,
        username,
        email,
        fullName,
        password,
        role
      });
      toast.success(`Administrator '${username}' created successfully`);
      setIsModalOpen(false);
      setUsername('');
      setEmail('');
      setFullName('');
      setPassword('Admin@123');
      await fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create administrator';
      toast.error(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditDrawer = async (u: AdminUserItem) => {
    setEditTarget(u);
    setEditFullName(u.fullName);
    setEditEmail(u.email);
    setEditIsActive(u.isActive);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      setEditLoading(true);
      const res = await apiClient.put(`/superadmin/users/${editTarget.id}`, {
        fullName: editFullName,
        email: editEmail,
        isActive: editIsActive
      });
      if (res.data?.success) {
        toast.success(`Administrator '${editTarget.username}' updated successfully`);
        setEditTarget(null);
        await fetchUsers();
      } else {
        toast.error(res.data?.message || 'Failed to update administrator');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update administrator');
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleActive = async (u: AdminUserItem) => {
    try {
      setToggleBusyId(u.id);
      const res = await apiClient.put(`/superadmin/users/${u.id}`, {
        fullName: u.fullName,
        email: u.email,
        isActive: !u.isActive
      });
      if (res.data?.success) {
        toast.success(`Administrator '${u.username}' ${u.isActive ? 'disabled' : 'enabled'}`);
        await fetchUsers();
      } else {
        toast.error(res.data?.message || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update status');
    } finally {
      setToggleBusyId(null);
    }
  };

  const openAssignDrawer = async (u: AdminUserItem) => {
    setAssignTarget(u);
    setAssignedTenantIds(u.tenantId ? [String(u.tenantId)] : []);
    setAssignedRoleId('');
    // Load existing multi-college memberships
    try {
      const res = await apiClient.get(`/superadmin/users/${u.id}/tenants`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        const memberships = res.data.data as UserTenantMembership[];
        setAssignedTenantIds(memberships.map((m) => String(m.tenantId)));
        setAssignedRoleId(memberships[0]?.roleId ? String(memberships[0].roleId) : '');
      }
    } catch {
      // Keep single-tenant fallback
    }
  };

  const handleAssignTenants = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTarget) return;
    try {
      setAssignLoading(true);
      const res = await apiClient.put(`/superadmin/users/${assignTarget.id}/tenants`, {
        tenantIds: assignedTenantIds,
        roleId: assignedRoleId || null
      });
      if (res.data?.success) {
        toast.success(`College assignments saved for '${assignTarget.username}'`);
        setAssignTarget(null);
        await fetchUsers();
      } else {
        toast.error(res.data?.message || 'Failed to save college assignments');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save college assignments');
    } finally {
      setAssignLoading(false);
    }
  };

  const openResetDrawer = (u: AdminUserItem) => {
    setResetTarget(u);
    setNewPassword('');
    setShowNewPassword(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      setResetLoading(true);
      const res = await apiClient.post(`/superadmin/users/${resetTarget.id}/reset-password`, {
        newPassword
      });
      if (res.data?.success) {
        toast.success(`Password reset for '${resetTarget.username}'`);
        setResetTarget(null);
      } else {
        toast.error(res.data?.message || 'Failed to reset password');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteBusy(true);
      const res = await apiClient.delete(`/superadmin/users/${deleteTarget.id}`);
      if (res.data?.success) {
        toast.success(`Administrator '${deleteTarget.username}' deleted`);
        setDeleteTarget(null);
        await fetchUsers();
      } else {
        toast.error(res.data?.message || 'Failed to delete administrator');
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, 'Failed to delete administrator'));
    } finally {
      setDeleteBusy(false);
    }
  };

  const currentUsername = getCurrentUsername();
  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.tenantCode && u.tenantCode.toLowerCase().includes(search.toLowerCase()))
  );

  const collegeName = (id: string | number | null | undefined) => {
    const c = colleges.find((col) => String(col.id) === String(id));
    return c ? `${c.name} (${c.tenantCode})` : null;
  };

  const tableCellAction = 'h-7 px-2.5 rounded-lg text-[11px] font-semibold transition cursor-pointer inline-flex items-center justify-center gap-1.5 border whitespace-nowrap shadow-2xs select-none flex-shrink-0';

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Administrators & Scoped Access</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage SuperAdmins (Level 1) and CollegeAdmins (Level 2 tenant-scoped credentials).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs"
            title="Refresh users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Admin User</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={fetchUsers} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold">
            Retry
          </button>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by username, name, or college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-6">Username</th>
                <th className="py-3 px-6">Full Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Tenant Scope</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right whitespace-nowrap min-w-[360px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                    <span className="block mt-2 text-xs">Loading administrators...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    No administrators match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isSelf = u.username === currentUsername;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6 font-mono font-semibold text-slate-900">
                        {u.username}
                        {isSelf && <span className="ml-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">YOU</span>}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-900">{u.fullName}</td>
                      <td className="py-3.5 px-6 font-mono text-slate-500">{u.email}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md font-mono text-[10px] font-semibold ${
                            u.role === 'SuperAdmin'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-mono">
                        {u.tenantCode ? (
                          <span className="text-slate-900 font-semibold">{u.tenantCode}</span>
                        ) : (
                          <span className="text-blue-600 font-semibold">ALL (Global Platform)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-600' : 'bg-red-600'}`} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5 flex-nowrap">
                          <button
                            onClick={() => openAssignDrawer(u)}
                            className={`${tableCellAction} text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100`}
                            title="Assign colleges to this administrator"
                          >
                            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Colleges</span>
                          </button>
                          <button
                            onClick={() => openResetDrawer(u)}
                            className={`${tableCellAction} text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100`}
                            title="Reset password"
                          >
                            <KeyRound className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Password</span>
                          </button>
                          <button
                            onClick={() => openEditDrawer(u)}
                            className={`${tableCellAction} text-slate-700 bg-slate-100 border-slate-200 hover:bg-slate-200`}
                            title="Edit profile"
                          >
                            <Pencil className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleToggleActive(u)}
                            disabled={toggleBusyId === u.id}
                            className={`${tableCellAction} ${u.isActive
                              ? 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'} disabled:opacity-50`}
                            title={u.isActive ? 'Disable login for this administrator' : 'Re-enable login'}
                          >
                            <Power className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{u.isActive ? 'Disable' : 'Enable'}</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            disabled={isSelf}
                            className="h-7 w-7 rounded-lg text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer inline-flex items-center justify-center shadow-2xs flex-shrink-0"
                            title={isSelf ? 'You cannot delete your own account' : 'Delete administrator'}
                          >
                            <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FormDrawer for Creating New Administrator */}
      <FormDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Administrator"
        subtitle="Assign role and scoped tenant credentials"
        icon={<Users className="w-5 h-5 text-blue-600" />}
        mode="create"
        onSubmit={handleCreateUser}
        loading={createLoading}
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="CollegeAdmin">CollegeAdmin (Tenant Scoped)</option>
              <option value="SuperAdmin">SuperAdmin (Platform Scoped)</option>
            </select>
          </div>

          {role === 'CollegeAdmin' && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Assign to College *</label>
              <select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.tenantCode})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer rounded focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-500" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </FormDrawer>

      {/* Edit Administrator Drawer */}
      <FormDrawer
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title={`Edit '${editTarget?.username || ''}'`}
        subtitle="Update profile details and login status"
        icon={<Pencil className="w-5 h-5 text-blue-600" />}
        mode="edit"
        onSubmit={handleUpdateUser}
        loading={editLoading}
        size="md"
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Full Name"
            required
            value={editFullName}
            onChange={(e) => setEditFullName(e.target.value)}
            placeholder="Full display name"
          />
          <Input
            label="Email"
            type="email"
            required
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="admin@college.edu"
          />
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={editIsActive}
              onChange={(e) => setEditIsActive(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 shrink-0"
            />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">Account Active</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Inactive accounts cannot sign in to any portal.
              </span>
            </div>
          </label>
        </div>
      </FormDrawer>

      {/* Assign Colleges Drawer */}
      <FormDrawer
        isOpen={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        title={`College Assignments — '${assignTarget?.username || ''}'`}
        subtitle="Grant this administrator access to one or more college tenants"
        icon={<Building2 className="w-5 h-5 text-blue-600" />}
        mode="edit"
        onSubmit={handleAssignTenants}
        loading={assignLoading}
        size="md"
        submitText="Save College Assignments"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200 font-medium">
            Select every college this administrator should manage. The first selected college becomes their primary tenant.
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 max-h-80 overflow-y-auto space-y-2">
            {colleges.map((c) => {
              const isChecked = assignedTenantIds.includes(String(c.id));
              return (
                <label
                  key={c.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                    isChecked
                      ? 'bg-blue-50/80 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setAssignedTenantIds((prev) =>
                        isChecked
                          ? prev.filter((id) => id !== String(c.id))
                          : [...prev, String(c.id)]
                      );
                    }}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 dark:text-white block truncate">{c.name}</span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{c.tenantCode}</span>
                  </div>
                </label>
              );
            })}
            {colleges.length === 0 && (
              <p className="text-slate-400 text-center py-6">No colleges provisioned yet.</p>
            )}
          </div>

          {roles.length > 0 && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Role for Assignments</label>
              <select
                value={assignedRoleId}
                onChange={(e) => setAssignedRoleId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Use account default role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </FormDrawer>

      {/* Reset Password Drawer */}
      <FormDrawer
        isOpen={Boolean(resetTarget)}
        onClose={() => setResetTarget(null)}
        title={`Reset Password — '${resetTarget?.username || ''}'`}
        subtitle="Generate a new sign-in credential for this administrator"
        icon={<KeyRound className="w-5 h-5 text-amber-600" />}
        mode="edit"
        onSubmit={handleResetPassword}
        loading={resetLoading}
        size="sm"
        submitText="Reset Password"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 font-medium">
            The administrator will need this new password at their next sign-in. The change is recorded in the platform audit trail.
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">New Password (min 6 chars) *</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer rounded focus:outline-none"
                title={showNewPassword ? 'Hide password' : 'Show password'}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUser}
        title={`Delete '${deleteTarget?.username}'?`}
        message="This administrator will lose all portal access immediately and their college assignments will be cleared. This action is recorded in the audit trail."
        confirmText="Delete Administrator"
        cancelText="Cancel"
        variant="danger"
        loading={deleteBusy}
      />
    </div>
  );
};
