import React, { useEffect, useState } from 'react';
import { Globe2, Plus, Trash2, ExternalLink, RefreshCw, ShieldCheck, Star, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DomainItem, Tenant } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, ConfirmDialog } from '../../UI_Componentes/ui';

export const DomainsPage: React.FC = () => {
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; domain: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenantId, setTenantId] = useState<string | number>('');
  const [domain, setDomain] = useState('');
  const [domainType, setDomainType] = useState('PRIMARY');
  const [createLoading, setCreateLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const [domRes, colRes] = await Promise.all([
        apiClient.get('/superadmin/domains'),
        apiClient.get('/superadmin/colleges')
      ]);

      if (domRes.data.success) setDomains(domRes.data.data || []);
      else setError(domRes.data.message || 'Failed to load domains');

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      setError(null);
      setNotice(null);
      await apiClient.post('/superadmin/domains', {
        tenantId,
        domain: domain.trim().toLowerCase(),
        domainType,
        isPrimary: domainType === 'PRIMARY'
      });
      setIsModalOpen(false);
      setDomain('');
      setNotice(`Domain '${domain.trim().toLowerCase()}' mapped successfully.`);
      await fetchDomains();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to map domain');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(deleteTarget.id);
      setError(null);
      setNotice(null);
      await apiClient.delete(`/superadmin/domains/${deleteTarget.id}`);
      setNotice('Domain mapping removed.');
      setDeleteTarget(null);
      await fetchDomains();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to remove domain');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerify = async (id: string | number) => {
    try {
      setActionLoading(id);
      setError(null);
      setNotice(null);
      await apiClient.post(`/superadmin/domains/${id}/verify`);
      setNotice('Domain verification completed.');
      await fetchDomains();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to verify domain');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetPrimary = async (id: string | number) => {
    try {
      setActionLoading(id);
      setError(null);
      setNotice(null);
      await apiClient.post(`/superadmin/domains/${id}/set-primary`);
      setNotice('Primary domain route updated.');
      await fetchDomains();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to set primary domain');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Globe2 className="w-6 h-6 text-blue-600" />
            <span>Multi-Tenant Domain Routing</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Map custom domain names and localhost subdomains dynamically to tenant colleges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDomains}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs"
            title="Refresh domains"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Map New Domain</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {notice && (
          <div className="p-3.5 flex items-center gap-2 text-xs font-semibold bg-emerald-50 border-b border-emerald-200 text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
        {error && (
          <div className="p-3.5 flex items-center gap-2 text-xs font-semibold bg-red-50 border-b border-red-200 text-red-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200 font-semibold">
            <tr>
              <th className="py-3 px-6">Domain / Hostname</th>
              <th className="py-3 px-6">Routed College</th>
              <th className="py-3 px-6">Routing Type</th>
              <th className="py-3 px-6">Verified</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {domains.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-mono font-semibold text-blue-600">
                  <a
                    href={`http://${d.domain}${window.location.port ? `:${window.location.port}` : ''}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{d.domain}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </td>
                <td className="py-3.5 px-6 font-medium text-slate-900">
                  {d.tenantCode} <span className="text-slate-400 font-normal text-[11px]">(ID: #{d.tenantId})</span>
                </td>
                <td className="py-3.5 px-6 font-mono text-slate-600">
                  {d.domainType} {d.isPrimary && '• Primary'}
                </td>
                <td className="py-3.5 px-6">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                    d.isVerified
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${d.isVerified ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                    {d.isVerified ? 'Verified Active' : 'Pending Verification'}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {!d.isVerified && (
                      <button
                        onClick={() => handleVerify(d.id)}
                        disabled={actionLoading === d.id}
                        className="p-1.5 text-blue-600 hover:text-blue-800 disabled:opacity-50 transition"
                        title="Verify domain configuration"
                      >
                        <ShieldCheck className={`w-4 h-4 ${actionLoading === d.id ? 'animate-pulse' : ''}`} />
                      </button>
                    )}
                    {!d.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(d.id)}
                        disabled={actionLoading === d.id}
                        className="p-1.5 text-amber-600 hover:text-amber-800 disabled:opacity-50 transition"
                        title="Set as primary domain"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    {!d.isPrimary && (
                      <button
                        onClick={() => setDeleteTarget({ id: d.id, domain: d.domain })}
                        disabled={actionLoading === d.id}
                        className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-50 transition"
                        title="Remove domain mapping"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {d.isPrimary && !d.isVerified && (
                      <span className="text-[10px] text-slate-400 font-medium pr-1">System primary</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FormDrawer for Mapping New Domain */}
      <FormDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Map Domain Route"
        subtitle="Configure custom domain or localhost subdomain for a college"
        icon={<Globe2 className="w-5 h-5 text-blue-600" />}
        mode="create"
        onSubmit={handleCreate}
        loading={createLoading}
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target College *</label>
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

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Domain Hostname *</label>
            <input
              type="text"
              placeholder="e.g. campus.rnc.edu or custom.localhost"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Routing Type *</label>
            <select
              value={domainType}
              onChange={(e) => setDomainType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="PRIMARY">PRIMARY (Main College Domain)</option>
              <option value="SECONDARY">SECONDARY (Subdomain / Localhost)</option>
              <option value="ALIAS">ALIAS (Redirect)</option>
            </select>
          </div>
        </div>
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Domain Mapping"
        message={`This permanently removes routing for "${deleteTarget?.domain}". This action cannot be undone.`}
        confirmText="Remove"
        loading={Boolean(deleteTarget && actionLoading === deleteTarget.id)}
      />
    </div>
  );
};
