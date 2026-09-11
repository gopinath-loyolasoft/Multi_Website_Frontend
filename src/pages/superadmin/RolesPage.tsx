import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Lock,
  CheckCircle2,
  Search,
  KeyRound,
  Eye,
  ShieldAlert,
  Users,
  Grid,
  ListFilter,
  Check,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { RoleItem, PermissionItem, CreateRolePayload } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, DrawerMode, Input, ConfirmDialog } from '../../UI_Componentes/ui';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'roles' | 'matrix'>('roles');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');

  // Expanded permission chips tracking for role cards
  const [expandedRoleChips, setExpandedRoleChips] = useState<Record<string, boolean>>({});

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchRolesAndPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rolesRes, permsRes] = await Promise.all([
        apiClient.get('/superadmin/roles'),
        apiClient.get('/superadmin/permissions')
      ]);

      if (rolesRes.data?.success) {
        setRoles(rolesRes.data.data || []);
      } else {
        setError(rolesRes.data?.message || 'Failed to load roles');
      }

      if (permsRes.data?.success) {
        setPermissions(permsRes.data.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to roles service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const systemRolesCount = useMemo(() => roles.filter(r => r.isSystem).length, [roles]);
  const customRolesCount = useMemo(() => roles.filter(r => !r.isSystem).length, [roles]);

  const toggleChipExpand = (roleId: string) => {
    setExpandedRoleChips(prev => ({ ...prev, [roleId]: !prev[roleId] }));
  };

  const handleTogglePermission = (id: string) => {
    setSelectedPermIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleToggleModulePerms = (modulePerms: PermissionItem[]) => {
    const modulePermIds = modulePerms.map(p => p.id);
    const allSelected = modulePermIds.every(id => selectedPermIds.includes(id));
    if (allSelected) {
      setSelectedPermIds(prev => prev.filter(id => !modulePermIds.includes(id)));
    } else {
      setSelectedPermIds(prev => Array.from(new Set([...prev, ...modulePermIds])));
    }
  };

  const handleSelectAllPerms = () => {
    if (selectedPermIds.length === permissions.length) {
      setSelectedPermIds([]);
    } else {
      setSelectedPermIds(permissions.map(p => p.id));
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim() || !roleCode.trim()) return;

    try {
      setSaving(true);
      setModalError(null);
      const payload: CreateRolePayload = {
        name: roleName.trim(),
        code: roleCode.trim().replace(/[^a-zA-Z0-9_]/g, ''),
        description: roleDesc.trim(),
        permissionIds: selectedPermIds
      };

      const res = await apiClient.post('/superadmin/roles', payload);
      if (res.data?.success) {
        setIsDrawerOpen(false);
        setRoleName('');
        setRoleCode('');
        setRoleDesc('');
        setSelectedPermIds([]);
        await fetchRolesAndPermissions();
      } else {
        setModalError(res.data?.message || 'Failed to register role');
      }
    } catch (err: any) {
      setModalError(err.response?.data?.message || err.message || 'Role creation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteBusy(true);
      const res = await apiClient.delete(`/superadmin/roles/${deleteTarget.id}`);
      if (res.data?.success) {
        setDeleteTarget(null);
        await fetchRolesAndPermissions();
      } else {
        setError(res.data?.message || 'Failed to delete role');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete role');
    } finally {
      setDeleteBusy(false);
    }
  };

  const filteredRoles = useMemo(() => {
    return roles.filter(r => {
      const matchesSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(search.toLowerCase()));

      if (moduleFilter === 'ALL') return matchesSearch;
      if (moduleFilter === 'SYSTEM') return matchesSearch && r.isSystem;
      if (moduleFilter === 'CUSTOM') return matchesSearch && !r.isSystem;
      return matchesSearch && r.permissions.some(p => p.module?.toUpperCase() === moduleFilter);
    });
  }, [roles, search, moduleFilter]);

  // Group permissions by module for display
  const permissionsByModule = useMemo(() => {
    return permissions.reduce((acc, p) => {
      const mod = p.module || 'GENERAL';
      acc[mod] = acc[mod] || [];
      acc[mod].push(p);
      return acc;
    }, {} as Record<string, PermissionItem[]>);
  }, [permissions]);

  const moduleNames = useMemo(() => Object.keys(permissionsByModule), [permissionsByModule]);

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Platform Roles & Access Control (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centrally define platform authority levels, tenant access barriers, and granular feature rights across all colleges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRolesAndPermissions}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh roles"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setDrawerMode('create');
              setSelectedRole(null);
              setRoleName('');
              setRoleCode('');
              setRoleDesc('');
              setSelectedPermIds([]);
              setModalError(null);
              setIsDrawerOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Define New Role</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Defined Roles</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{roles.length}</span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                ({systemRolesCount} System / {customRolesCount} Custom)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <KeyRound className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Permissions</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{permissions.length}</span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                {moduleNames.length} Modules
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Lock className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Protected Roles</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{systemRolesCount}</span>
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Locked Core Rules</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <ShieldAlert className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filter Enforcement</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">C# [Permission]</span>
              <span className="text-[11px] font-medium text-slate-400">Backend Filter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search roles by title, code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Module Filter Select */}
          <div className="relative">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="py-2 pl-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              <option value="ALL">All Categories</option>
              <option value="SYSTEM">System Roles Only</option>
              <option value="CUSTOM">Custom Roles Only</option>
              {moduleNames.map(mod => (
                <option key={mod} value={mod}>{mod} Module</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('roles')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'roles'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Roles Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Permissions Matrix</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={fetchRolesAndPermissions} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Main Tab Content */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading RBAC roles and permission mappings from PostgreSQL...</p>
        </div>
      ) : activeTab === 'roles' ? (
        /* ROLES GRID VIEW */
        filteredRoles.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              No roles match your search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role) => {
              const isExpanded = Boolean(expandedRoleChips[role.id]);
              const displayedPerms = isExpanded ? role.permissions : role.permissions.slice(0, 8);
              const hiddenCount = role.permissions.length - 8;

              return (
                <div
                  key={role.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="space-y-3.5">
                    {/* Top Header Pills */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900">
                        {role.code}
                      </span>
                      {role.isSystem ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-900 px-2.5 py-0.5 rounded-full">
                          <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>System Role</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-900 px-2.5 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Custom Role</span>
                        </span>
                      )}
                    </div>

                    {/* Role Title & Scope */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{role.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2 min-h-[36px]">
                        {role.description || 'Custom administrative authority level.'}
                      </p>
                    </div>

                    {/* Scope Pill */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Scope:</span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                        {role.code === 'SuperAdmin' ? 'Global Platform' : 'College Tenant'}
                      </span>
                    </div>

                    {/* Granted Permissions List */}
                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <span>Granted Permissions</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">{role.permissions.length} Rights</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 min-h-[56px]">
                        {role.permissions.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">No explicit permissions assigned.</span>
                        ) : (
                          <>
                            {displayedPerms.map((p) => (
                              <span
                                key={p.id}
                                className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300"
                                title={`${p.name}: ${p.description || ''}`}
                              >
                                {p.code}
                              </span>
                            ))}
                            {hiddenCount > 0 && !isExpanded && (
                              <button
                                type="button"
                                onClick={() => toggleChipExpand(role.id)}
                                className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-mono text-[10px] font-bold cursor-pointer hover:bg-blue-100 transition"
                              >
                                +{hiddenCount} more
                              </button>
                            )}
                            {isExpanded && hiddenCount > 0 && (
                              <button
                                type="button"
                                onClick={() => toggleChipExpand(role.id)}
                                className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold cursor-pointer hover:bg-slate-300 transition"
                              >
                                Show less
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole(role);
                        setDrawerMode('view');
                        setIsDrawerOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    {!role.isSystem && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(role)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                        title="Delete custom role"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* PERMISSIONS MATRIX OVERVIEW */
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">System Permissions Matrix</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">All registered system action privileges categorized by functional module</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-200/60 dark:border-indigo-900">
                Enforced by C# [Permission] Filter
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(permissionsByModule).map(([module, perms]) => (
                <div key={module} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                    <span>{module}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-sans font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                      {perms.length} Actions
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    {perms.map(p => (
                      <li key={p.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-start justify-between gap-2.5 shadow-2xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-xs">{p.name}</span>
                          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 block mt-0.5">{p.code}</span>
                          {p.description && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 leading-snug">{p.description}</span>
                          )}
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE & VIEW ROLE DRAWER */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerMode === 'view' ? (selectedRole?.name || 'Role Authority Details') : 'Define Custom Platform Role'}
        subtitle={drawerMode === 'view' ? `System Code: ${selectedRole?.code || ''}` : 'Configure role code and assign granular permission entitlements'}
        icon={<ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        mode={drawerMode}
        size="lg"
        loading={saving}
        onSubmit={drawerMode !== 'view' ? handleCreateRole : undefined}
        submitText="Save Role to Database"
      >
        {drawerMode === 'view' && selectedRole ? (
          <div className="space-y-6 text-slate-900 dark:text-slate-100 text-xs">
            <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedRole.name}</h4>
                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">{selectedRole.code}</p>
                </div>
                {selectedRole.isSystem ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>System Role</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 px-2.5 py-0.5 rounded-full">
                    Custom Role
                  </span>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {selectedRole.description || 'Custom administrative authority level.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Granted Entitlements & Permissions</h5>
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
                  {selectedRole.permissions.length} Assigned
                </span>
              </div>

              {selectedRole.permissions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                  No explicit permissions assigned to this role.
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedRole.permissions.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-xs">{p.name}</span>
                          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 block">{p.code}</span>
                          {p.description && <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">{p.description}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5 text-xs">
            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Role Title"
                required
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  if (!roleCode) setRoleCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                }}
                placeholder="e.g. Academic Dean or Auditor"
              />

              <Input
                label="System Code (Alphanumeric)"
                required
                value={roleCode}
                onChange={(e) => setRoleCode(e.target.value.toUpperCase())}
                placeholder="e.g. DEAN_ADMIN"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Description / Responsibility Scope
              </label>
              <textarea
                rows={2}
                placeholder="Explain what this administrator role is authorized to modify..."
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Permission Selection by Module */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Granted Permissions ({selectedPermIds.length}/{permissions.length} Selected)
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllPerms}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {selectedPermIds.length === permissions.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-72 overflow-y-auto space-y-5">
                {Object.entries(permissionsByModule).map(([module, perms]) => {
                  const modulePermIds = perms.map(p => p.id);
                  const isModuleAllSelected = modulePermIds.every(id => selectedPermIds.includes(id));

                  return (
                    <div key={module} className="space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
                        <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">
                          {module} Module
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleModulePerms(perms)}
                          className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
                        >
                          {isModuleAllSelected ? 'Deselect Module' : 'Select Module'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {perms.map((p) => {
                          const isChecked = selectedPermIds.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                                isChecked
                                  ? 'bg-blue-50/80 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-bold'
                                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(p.id)}
                                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 shrink-0"
                              />
                              <div className="truncate">
                                <span className="font-semibold block truncate text-xs">{p.name}</span>
                                <span className="font-mono text-[10px] text-slate-400 block">{p.code}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </FormDrawer>

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteRole}
        title={`Delete Role "${deleteTarget?.name}"?`}
        message="Are you sure you want to delete this custom authority level? Users assigned to this role will lose their permission rights."
        confirmText="Yes, Delete Role"
        cancelText="Cancel"
        variant="danger"
        loading={deleteBusy}
      />
    </div>
  );
};
