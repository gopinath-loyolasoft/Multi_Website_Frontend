import React, { useEffect, useState } from 'react';
import { Users, Plus, RefreshCw, Search, Eye, EyeOff } from 'lucide-react';
import { AdminUserItem, Tenant } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer } from '../../UI_Componentes/ui';

export const CollegeAdminsPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [tenantId, setTenantId] = useState<string>('');
  const [role, setRole] = useState('CollegeAdmin');
  const [createLoading, setCreateLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersRes, colRes] = await Promise.all([
        apiClient.get('/superadmin/users'),
        apiClient.get('/superadmin/colleges')
      ]);

      if (usersRes.data.success) setUsers(usersRes.data.data || []);
      if (colRes.data.success) {
        const cols = colRes.data.data || [];
        setColleges(cols);
        setTenantId((prev) => prev || (cols[0]?.id ? String(cols[0].id) : ''));
      }
    } catch (err) {
      console.error(err);
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
      setIsModalOpen(false);
      setUsername('');
      setEmail('');
      setFullName('');
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.tenantCode && u.tenantCode.toLowerCase().includes(search.toLowerCase()))
  );

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
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200 font-semibold">
            <tr>
              <th className="py-3 px-6">Username</th>
              <th className="py-3 px-6">Full Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">Tenant Scope</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-mono font-semibold text-slate-900">{u.username}</td>
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
                    <span className="text-slate-900 font-semibold">{u.tenantCode} <span className="text-slate-400 font-normal text-[11px]">(ID: #{u.tenantId})</span></span>
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
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};
