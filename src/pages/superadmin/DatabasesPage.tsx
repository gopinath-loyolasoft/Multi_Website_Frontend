import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, ShieldAlert, Server, HardDrive } from 'lucide-react';
import { DatabaseRegistryItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { ConfirmDialog } from '../../UI_Componentes/ui';

export const DatabasesPage: React.FC = () => {
  const [databases, setDatabases] = useState<DatabaseRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  const [reprovisionTarget, setReprovisionTarget] = useState<DatabaseRegistryItem | null>(null);

  const healthyCount = databases.filter((d) =>
    ['HEALTHY', 'VERIFIED', 'PROVISIONED'].includes((d.status || '').toUpperCase())
  ).length;
  const uniqueTenants = new Set(databases.map((d) => d.tenantId)).size;
  const latestVersion =
    databases.length === 0
      ? 'N/A'
      : databases
          .map((d) => (d.currentMigrationVersion || '').toUpperCase())
          .filter(Boolean)
          .sort()
          .pop();

  const fetchDatabases = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/superadmin/databases');
      if (res.data.success) {
        setDatabases(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load database registry');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to database service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleVerify = async (tenantId: string | number) => {
    try {
      setActionLoading(tenantId);
      setError(null);
      await apiClient.post(`/superadmin/databases/${tenantId}/verify`);
      await fetchDatabases();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to verify database health');
    } finally {
      setActionLoading(null);
    }
  };

  const handleProvision = async () => {
    if (!reprovisionTarget) return;
    const tenantId = reprovisionTarget.tenantId;
    try {
      setActionLoading(tenantId);
      setError(null);
      await apiClient.post(`/superadmin/databases/${tenantId}/provision`);
      setReprovisionTarget(null);
      await fetchDatabases();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to re-provision tenant database');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Database className="w-6 h-6 text-blue-600" />
            <span>Multi-Tenant Database Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Physical database-per-tenant isolation with live provisioning status.
          </p>
        </div>

        <button
          onClick={fetchDatabases}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs"
          title="Refresh database registry"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Platform Master DB Card */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Platform Control Plane Database</h2>
              <p className="text-xs text-slate-500">Stores platform registry, tenants, users, themes, features, and audit trail</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            ACTIVE • Registry
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Provisioned Databases</span>
            <span className="text-blue-600 font-bold">{databases.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Unique Tenants</span>
            <span className="text-slate-800 font-bold">{uniqueTenants}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Healthy / Verified</span>
            <span className="text-emerald-600 font-bold">{healthyCount}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Latest Schema</span>
            <span className="text-indigo-600 font-bold">{latestVersion}</span>
          </div>
        </div>
      </div>

      {/* Tenant Databases Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <HardDrive className="w-4 h-4 text-blue-600" />
          <span>Provisioned Tenant Databases (Physical DB Isolation)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">College</th>
                <th className="py-2.5 px-3">Physical Database</th>
                <th className="py-2.5 px-3">Connection Host</th>
                <th className="py-2.5 px-3">Migration Version</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {databases.map((db) => (
                <tr key={db.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3 font-medium text-slate-900">
                    {db.tenantName} (<span className="text-blue-600 font-mono font-semibold">{db.tenantCode}</span>)
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">
                    {db.databaseName}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {db.host}:{db.port}
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-indigo-600">
                    {db.currentMigrationVersion}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{db.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleVerify(db.tenantId)}
                        disabled={actionLoading === db.tenantId}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 shadow-2xs transition"
                      >
                        <RefreshCw className={`w-3 h-3 text-slate-500 ${actionLoading === db.tenantId ? 'animate-spin' : ''}`} />
                        <span>Verify Health</span>
                      </button>
                      <button
                        onClick={() => setReprovisionTarget(db)}
                        disabled={actionLoading === db.tenantId}
                        className="px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                      >
                        Re-Migrate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Re-Migration Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(reprovisionTarget)}
        onClose={() => setReprovisionTarget(null)}
        onConfirm={handleProvision}
        title="Re-run Migrations on Tenant Database?"
        message={`This re-runs all pending migrations for "${reprovisionTarget?.tenantName}" (${reprovisionTarget?.databaseName}). This may take a few seconds.`}
        confirmText="Re-Migrate"
        variant="warning"
        loading={Boolean(reprovisionTarget && actionLoading === reprovisionTarget.tenantId)}
      />
    </div>
  );
};
