import React, { useEffect, useState } from 'react';
import {
  Globe2,
  Plus,
  Trash2,
  RefreshCw,
  Star,
  AlertTriangle,
  Search,
  Server,
  Activity,
  ArrowUpRight,
  Sparkles,
  Link2,
  CheckCircle2,
  Edit2,
  ShieldCheck,
  Check,
  Filter
} from 'lucide-react';
import { DomainItem, Tenant } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { resolveTenantPortalUrl, formatDisplayDomain, getPlatformBaseDomain, getPlatformRootHost } from '../../utils/domainUtils';

export const DomainsPage: React.FC = () => {
  const { toast } = useToast();
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; domain: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'CUSTOM' | 'SUBDOMAINS'>('ALL');

  // Form Drawer (Create)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenantId, setTenantId] = useState<string | number>('');
  const [domain, setDomain] = useState('');
  const [domainType, setDomainType] = useState('PRIMARY');
  const [createLoading, setCreateLoading] = useState(false);

  // Form Drawer (Edit)
  const [editTarget, setEditTarget] = useState<DomainItem | null>(null);
  const [editDomain, setEditDomain] = useState('');
  const [editDomainType, setEditDomainType] = useState('PRIMARY');
  const [editLoading, setEditLoading] = useState(false);

  // Operations
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const [domRes, colRes] = await Promise.all([
        apiClient.get('/superadmin/domains'),
        apiClient.get('/superadmin/colleges')
      ]);

      if (domRes.data.success) {
        setDomains(domRes.data.data || []);
      } else {
        setError(domRes.data.message || 'Failed to load domains');
      }

      if (colRes.data.success) {
        const cols = colRes.data.data || [];
        setColleges(cols);
        if (cols.length > 0 && !tenantId) setTenantId(cols[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to domain service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const sanitizeDomain = (raw: string): string => {
    return raw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .split(':')[0];
  };

  const isPlatformSubdomain = (dom: string): boolean => {
    const clean = dom.toLowerCase();
    const base = getPlatformBaseDomain();
    return clean.endsWith(`.${base}`) || clean.endsWith('.localhost');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      setError(null);
      const cleanDomain = sanitizeDomain(domain);
      await apiClient.post('/superadmin/domains', {
        tenantId,
        domain: cleanDomain,
        domainType,
        isPrimary: domainType === 'PRIMARY'
      });
      setIsModalOpen(false);
      setDomain('');
      toast.success(`Domain '${cleanDomain}' is now routed to target college.`, 'Domain Mapped');
      await fetchDomains();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to map domain');
      toast.error(err.response?.data?.message || 'Failed to map domain.', 'Mapping Failed');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(deleteTarget.id);
      setError(null);
      await apiClient.delete(`/superadmin/domains/${deleteTarget.id}`);
      toast.info(`Mapping for '${deleteTarget.domain}' was removed.`, 'Domain Removed');
      setDeleteTarget(null);
      await fetchDomains();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to remove domain', 'Delete Failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetPrimary = async (id: string | number, domName: string) => {
    try {
      setActionLoading(id);
      setError(null);
      await apiClient.post(`/superadmin/domains/${id}/set-primary`);
      toast.success(`'${domName}' is now set as the primary domain.`, 'Primary Domain Updated');
      await fetchDomains();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to set primary domain', 'Update Failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenEdit = (d: DomainItem) => {
    setEditTarget(d);
    setEditDomain(d.domain);
    setEditDomainType(d.domainType || (d.isPrimary ? 'PRIMARY' : 'SECONDARY'));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      setEditLoading(true);
      setError(null);
      const cleanDomain = sanitizeDomain(editDomain);
      await apiClient.put(`/superadmin/domains/${editTarget.id}`, {
        domain: cleanDomain,
        domainType: editDomainType,
      });
      toast.success(`Domain route updated to '${cleanDomain}'.`, 'Domain Updated');
      setEditTarget(null);
      await fetchDomains();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update domain.', 'Update Failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleVerify = async (id: string | number, domName: string) => {
    try {
      setVerifyingId(id);
      const res = await apiClient.post(`/superadmin/domains/${id}/verify`);
      if (res.data.success) {
        toast.success(`DNS verified for '${domName}'. Domain is live and active!`, 'DNS Verified');
        await fetchDomains();
      } else {
        toast.warning(res.data.message || `DNS records for '${domName}' are still propagating or not yet pointed.`, 'DNS Pending');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'DNS verification request failed.', 'Verification Error');
    } finally {
      setVerifyingId(null);
    }
  };

  // Filtered Domains
  const filteredDomains = domains.filter((d) => {
    const matchesSearch =
      d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tenantCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(d.tenantId).includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterTab === 'CUSTOM') {
      return !isPlatformSubdomain(d.domain);
    }
    if (filterTab === 'SUBDOMAINS') {
      return isPlatformSubdomain(d.domain);
    }
    return true;
  });

  // Metrics
  const totalCount = domains.length;
  const primaryCount = domains.filter((d) => d.isPrimary).length;
  const aliasCount = domains.filter((d) => !d.isPrimary).length;
  const subdomainsCount = domains.filter((d) => isPlatformSubdomain(d.domain)).length;
  const customCount = domains.filter((d) => !isPlatformSubdomain(d.domain)).length;

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 font-sans pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Multi-Tenant Domain Routing
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Central switchboard to route custom domains and subdomains to college databases with zero redeployment.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDomains}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            title="Refresh domains list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Map New Domain</span>
          </button>
        </div>
      </div>

      {/* Live Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Mapped</span>
            <Globe2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-[11px] text-slate-400">domains</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Primary Domains</span>
            <Star className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{primaryCount}</span>
            <span className="text-[11px] text-indigo-600/80 font-medium">official URLs</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Alias Routes</span>
            <Link2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{aliasCount}</span>
            <span className="text-[11px] text-emerald-600/80 font-medium">secondary routes</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Subdomains</span>
            <Server className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{subdomainsCount}</span>
            <span className="text-[11px] text-cyan-600/80 font-medium">auto-active</span>
          </div>
        </div>
      </div>

      {/* Info Card Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3.5 text-xs">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-blue-950 dark:text-blue-100">Zero-Downtime Multi-Tenant Domain Routing</p>
          <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
            • <strong>Platform Subdomains</strong> (e.g. <code className="bg-blue-100/80 dark:bg-blue-900/60 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded font-mono text-[11px]">shc.localhost</code> / <code className="bg-blue-100/80 dark:bg-blue-900/60 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded font-mono text-[11px]">shc.loyolasoft.com</code>): Automatically active via Wildcard DNS.<br />
            • <strong>Custom Domains</strong> (e.g. <code className="bg-blue-100/80 dark:bg-blue-900/60 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded font-mono text-[11px]">rcmcollege.com</code>): The college IT team adds a <strong>CNAME</strong> record in GoDaddy pointing to <code className="bg-blue-100/80 dark:bg-blue-900/60 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded font-mono text-[11px]">{getPlatformRootHost()}</code>.
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {/* Toolbar & Filter Tabs */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search domain or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setFilterTab('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterTab === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('CUSTOM')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterTab === 'CUSTOM'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Custom Domains ({customCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('SUBDOMAINS')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterTab === 'SUBDOMAINS'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Subdomains ({subdomainsCount})
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold shrink-0">
            Showing {filteredDomains.length} of {totalCount} domains
          </div>
        </div>

        {error && (
          <div className="p-3.5 flex items-center gap-2 text-xs font-semibold bg-red-50 dark:bg-red-950/60 border-b border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Domain / Hostname</th>
                <th className="py-3.5 px-6">Target College</th>
                <th className="py-3.5 px-6">Routing Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredDomains.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Globe2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                    <p className="font-semibold text-sm">No domain routes match your search or filter</p>
                    <p className="text-xs mt-0.5">Try clearing filters or mapping a new domain route.</p>
                  </td>
                </tr>
              ) : (
                filteredDomains.map((d) => {
                  const isSub = isPlatformSubdomain(d.domain);

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group">
                      {/* Domain URL Column */}
                      <td className="py-3 px-6 whitespace-nowrap">
                        <a
                          href={resolveTenantPortalUrl(d.domain, d.tenantCode)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center gap-1.5 group-hover:underline text-xs"
                          title="Open live website in new tab"
                        >
                          <span>{formatDisplayDomain(d.domain, d.tenantCode)}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                        </a>
                      </td>

                      {/* Routed College */}
                      <td className="py-3 px-6 whitespace-nowrap">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{d.tenantCode}</span>
                      </td>

                      {/* Routing Type */}
                      <td className="py-3 px-6 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] uppercase ${
                              d.isPrimary
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {d.domainType || (d.isPrimary ? 'PRIMARY' : 'ALIAS')}
                          </span>
                          {d.isPrimary && (
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                              <span>Main</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-6 whitespace-nowrap">
                        {isSub ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            Live (Auto Wildcard)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active & Routed
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Make Primary button (only if not already primary) */}
                          {!d.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(d.id, d.domain)}
                              disabled={actionLoading === d.id}
                              className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition cursor-pointer"
                              title="Set as Primary Official Domain for this College"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}

                          {/* Verify DNS */}
                          <button
                            type="button"
                            onClick={() => handleVerify(d.id, d.domain)}
                            disabled={verifyingId === d.id}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                            title="Verify Live DNS Resolution"
                          >
                            <ShieldCheck className={`w-4 h-4 ${verifyingId === d.id ? 'animate-spin text-blue-600' : ''}`} />
                          </button>

                          {/* Edit Domain Route */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(d)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition cursor-pointer"
                            title="Edit Domain Route"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Domain Route */}
                          {isSub ? (
                            <button
                              type="button"
                              disabled
                              className="p-1.5 text-slate-300 dark:text-slate-700 cursor-not-allowed rounded-lg"
                              title="Platform default wildcard subdomains are protected and cannot be deleted"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: d.id, domain: d.domain })}
                              disabled={actionLoading === d.id}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                              title="Delete Custom Domain Route"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* FormDrawer for Mapping New Domain */}
      <FormDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Map College Domain Route"
        subtitle="Connect an official college domain or development alias to a tenant database"
        icon={<Globe2 className="w-5 h-5 text-blue-600" />}
        mode="create"
        onSubmit={handleCreate}
        loading={createLoading}
        submitText="Save & Map College Domain"
        size="md"
      >
        <div className="space-y-4 text-xs">
          {/* Target College */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Target College <span className="text-red-500">*</span>
            </label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tenantCode})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Select the college that should open when visitors access this domain.
            </p>
          </div>

          {/* Domain Name */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Domain Name / Hostname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. rcmcollege.com or shcedu.in"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              required
            />
            {domain && (
              <div className="mt-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-[11px] font-mono flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Live Route Preview: <strong>https://{sanitizeDomain(domain)}</strong></span>
              </div>
            )}
          </div>

          {/* Routing Role */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Domain Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1 ${
                  domainType === 'PRIMARY'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <input
                    type="radio"
                    name="domainType"
                    value="PRIMARY"
                    checked={domainType === 'PRIMARY'}
                    onChange={() => setDomainType('PRIMARY')}
                    className="text-blue-600"
                  />
                  <span>PRIMARY (Main URL)</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  The primary official website address for this college.
                </span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1 ${
                  domainType === 'SECONDARY'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <input
                    type="radio"
                    name="domainType"
                    value="SECONDARY"
                    checked={domainType === 'SECONDARY'}
                    onChange={() => setDomainType('SECONDARY')}
                    className="text-blue-600"
                  />
                  <span>CNAME / ALIAS</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Additional domain alias, redirect, or development subdomain.
                </span>
              </label>
            </div>
          </div>
        </div>
      </FormDrawer>

      {/* FormDrawer for Editing Domain Route */}
      <FormDrawer
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="Edit Domain Route"
        subtitle={`Updating route configuration for ${editTarget?.tenantCode}`}
        icon={<Edit2 className="w-5 h-5 text-indigo-600" />}
        mode="edit"
        onSubmit={handleUpdate}
        loading={editLoading}
        submitText="Save Route Changes"
        size="md"
      >
        <div className="space-y-4 text-xs">
          {/* Target College info card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Assigned College:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{editTarget?.tenantCode}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
              ID: {String(editTarget?.id).slice(0, 8)}...
            </span>
          </div>

          {/* Domain Name */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Domain Name / Hostname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. rcmcollege.com or shcedu.in"
              value={editDomain}
              onChange={(e) => setEditDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              required
            />
            {editDomain && (
              <div className="mt-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 text-[11px] font-mono flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Live Route Preview: <strong>https://{sanitizeDomain(editDomain)}</strong></span>
              </div>
            )}
          </div>

          {/* Routing Role */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Domain Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1 ${
                  editDomainType === 'PRIMARY'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <input
                    type="radio"
                    name="editDomainType"
                    value="PRIMARY"
                    checked={editDomainType === 'PRIMARY'}
                    onChange={() => setEditDomainType('PRIMARY')}
                    className="text-indigo-600"
                  />
                  <span>PRIMARY (Main URL)</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Sets this domain as the official primary URL for the college.
                </span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1 ${
                  editDomainType === 'SECONDARY'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <input
                    type="radio"
                    name="editDomainType"
                    value="SECONDARY"
                    checked={editDomainType === 'SECONDARY'}
                    onChange={() => setEditDomainType('SECONDARY')}
                    className="text-indigo-600"
                  />
                  <span>CNAME / ALIAS</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Secondary route or alias.
                </span>
              </label>
            </div>
          </div>
        </div>
      </FormDrawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Domain Mapping"
        message={`Are you sure you want to permanently remove the route for "${deleteTarget?.domain}"?`}
        confirmText="Remove Route"
        loading={Boolean(deleteTarget && actionLoading === deleteTarget.id)}
      />
    </div>
  );
};
