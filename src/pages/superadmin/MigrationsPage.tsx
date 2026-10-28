import React, { useEffect, useState } from 'react';
import { 
  GitBranch, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Server, 
  Check, 
  HardDrive,
  Play,
  History,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { DatabaseRegistryItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { ConfirmDialog, useToast } from '../../UI_Componentes/ui';

interface MigrationHistoryItem {
  version: string;
  scriptName: string;
  description: string;
  status: string;
  appliedAt: string;
}

interface MigrationStatusPayload {
  tenantId: string | number;
  tenantCode: string;
  databaseName: string;
  currentVersion: string;
  status: string;
  lastCheckedAt: string;
  appliedMigrations: MigrationHistoryItem[];
}

export const MigrationsPage: React.FC = () => {
  const toast = useToast();
  const [databases, setDatabases] = useState<DatabaseRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);
  const [verifiedTenantId, setVerifiedTenantId] = useState<string | number | null>(null);

  // Run-migration confirmation + progress state
  const [migrateTarget, setMigrateTarget] = useState<DatabaseRegistryItem | null>(null);
  const [migrateBusy, setMigrateBusy] = useState(false);
  const [migratedTenantId, setMigratedTenantId] = useState<string | number | null>(null);

  // Per-tenant migration history expansion
  const [expandedTenantId, setExpandedTenantId] = useState<string | number | null>(null);
  const [tenantMigrationStatus, setTenantMigrationStatus] = useState<Record<string | number, MigrationStatusPayload>>({});
  const [historyLoadingId, setHistoryLoadingId] = useState<string | number | null>(null);

  const fetchMigrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/superadmin/databases');
      if (res.data.success) {
        setDatabases(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load database status');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch database state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMigrations();
  }, []);

  const handleVerify = async (tenantId: string | number) => {
    try {
      setActionLoading(tenantId);
      setError(null);
      await apiClient.post(`/superadmin/databases/${tenantId}/verify`);
      setVerifiedTenantId(tenantId);
      setTimeout(() => setVerifiedTenantId(null), 3000);
      await fetchMigrations();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Failed to verify database health';
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunMigration = async () => {
    if (!migrateTarget) return;
    try {
      setMigrateBusy(true);
      setError(null);
      const res = await apiClient.post(`/superadmin/migrations/${migrateTarget.tenantId}/migrate`);
      if (res.data?.success) {
        setMigratedTenantId(migrateTarget.tenantId);
        setTimeout(() => setMigratedTenantId(null), 4000);
        toast.success(`Schema migration completed for '${migrateTarget.tenantCode}'`);
        setMigrateTarget(null);
        await fetchMigrations();
        // Refresh any expanded history panel
        if (expandedTenantId === migrateTarget.tenantId) {
          await loadMigrationHistory(migrateTarget.tenantId, true);
        }
      } else {
        const msg = res.data?.message || 'Migration failed';
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Migration execution failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setMigrateBusy(false);
    }
  };

  const loadMigrationHistory = async (tenantId: string | number, force = false) => {
    if (!force && tenantMigrationStatus[tenantId]) {
      // Already loaded — just toggle collapsed
      setExpandedTenantId((prev) => (prev === tenantId ? null : tenantId));
      return;
    }
    try {
      setHistoryLoadingId(tenantId);
      const res = await apiClient.get(`/superadmin/migrations/${tenantId}/status`);
      if (res.data?.success) {
        setTenantMigrationStatus((prev) => ({ ...prev, [tenantId]: res.data.data }));
        setExpandedTenantId(tenantId);
      } else {
        toast.error(res.data?.message || 'Failed to load migration history');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load migration history');
    } finally {
      setHistoryLoadingId(null);
    }
  };

  const healthyCount = databases.filter((d) =>
    ['HEALTHY', 'VERIFIED', 'PROVISIONED'].includes((d.status || '').toUpperCase())
  ).length;

  const platformMigrationCount = databases.length > 0
    ? tenantMigrationStatus[databases[0].tenantId]?.appliedMigrations.length
    : undefined;

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-blue-600" />
            <span>Database Schema & Sync Monitor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time health, schema versioning, and physical database isolation across all college tenants.
          </p>
        </div>

        <button
          onClick={fetchMigrations}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs flex items-center gap-1.5"
          title="Refresh database state"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchMigrations} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold">
            Retry
          </button>
        </div>
      )}

      {/* Top Metric Cards Grid - Only Real Dynamic Data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Tenant Databases</span>
            <span className="text-lg font-bold text-slate-900">{databases.length} Active</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Database Health</span>
            <span className="text-lg font-bold text-emerald-600">
              {databases.length > 0 ? `${healthyCount}/${databases.length} Healthy` : 'Healthy'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Schema Migrations</span>
            <span className="text-lg font-bold text-slate-900">
              {platformMigrationCount !== undefined ? `V1..V${platformMigrationCount} Applied` : 'Latest (Live)'}
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Tenant Physical Isolation Architecture Card */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Multi-Tenant Database Isolation & Schema Integrity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Physical DB Isolation
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every college operates on its own dedicated PostgreSQL database with complete data and storage separation.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Automated Schema Provisioning
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All database tables and relationships are automatically constructed when a college is provisioned.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-blue-600" />
              On-Demand Migration Runner
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Re-apply the latest schema (V1..V8) to any tenant database instantly using the Run Migration action.
            </p>
          </div>
        </div>
      </div>

      {/* Tenant Databases Sync Status Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <HardDrive className="w-4 h-4 text-blue-600" />
            <span>Active Tenant Databases & Sync Status</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {databases.length} tenant databases connected
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500">Inspecting tenant database connections...</p>
          </div>
        ) : databases.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-6">No tenant databases found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">College & Tenant Code</th>
                  <th className="py-2.5 px-3">Dedicated Database Name</th>
                  <th className="py-2.5 px-3">Host & Port</th>
                  <th className="py-2.5 px-3">Schema Version</th>
                  <th className="py-2.5 px-3">Health Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {databases.map((db) => {
                  const isVerified = verifiedTenantId === db.tenantId;
                  const isMigrated = migratedTenantId === db.tenantId;
                  const isExpanded = expandedTenantId === db.tenantId;
                  const history = tenantMigrationStatus[db.tenantId];
                  return (
                    <React.Fragment key={db.id}>
                      <tr className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-3 font-medium text-slate-900">
                          <div>{db.tenantName}</div>
                          <span className="font-mono text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            {db.tenantCode}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">
                          {db.databaseName}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {db.host}:{db.port}
                        </td>
                        <td className="py-3 px-3 font-mono text-indigo-600 font-semibold">
                          {db.currentMigrationVersion ? `Migration ${db.currentMigrationVersion}` : 'Latest (Live)'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            (db.status || '').toUpperCase() === 'CONNECTION_ERROR'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${(db.status || '').toUpperCase() === 'CONNECTION_ERROR' ? 'bg-red-600' : 'bg-emerald-600'}`} />
                            <span>{db.status || 'HEALTHY'}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => loadMigrationHistory(db.tenantId)}
                              disabled={historyLoadingId === db.tenantId}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50"
                              title="View applied migration history for this tenant"
                            >
                              {historyLoadingId === db.tenantId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                              ) : (
                                <History className="w-3.5 h-3.5 text-slate-500" />
                              )}
                              <span>{isExpanded ? 'Hide' : 'History'}</span>
                            </button>
                            <button
                              onClick={() => setMigrateTarget(db)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition"
                              title="Re-apply latest schema migrations to this tenant database"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Run Migration</span>
                            </button>
                            <button
                              onClick={() => handleVerify(db.tenantId)}
                              disabled={actionLoading === db.tenantId}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50"
                            >
                              {isVerified ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 font-semibold">Verified</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${actionLoading === db.tenantId ? 'animate-spin text-blue-600' : ''}`} />
                                  <span>Verify Health</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Migration History Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="py-4 px-3 bg-slate-50/60">
                            {history ? (
                              <div className="space-y-2.5">
                                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600">
                                  <span className="font-mono">DB: {history.databaseName}</span>
                                  <span className="inline-flex items-center gap-1 text-indigo-600 font-bold">
                                    <GitBranch className="w-3.5 h-3.5" />
                                    Current Version: {history.currentVersion}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 ${history.status === 'HEALTHY' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {history.status === 'HEALTHY' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                    {history.status}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-slate-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    Checked {new Date(history.lastCheckedAt).toLocaleString()}
                                  </span>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                                      <tr>
                                        <th className="py-2 px-3">Version</th>
                                        <th className="py-2 px-3">Script</th>
                                        <th className="py-2 px-3">Description</th>
                                        <th className="py-2 px-3">Status</th>
                                        <th className="py-2 px-3">Applied</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {history.appliedMigrations.map((m) => (
                                        <tr key={m.version}>
                                          <td className="py-2 px-3 font-mono font-bold text-indigo-600">{m.version}</td>
                                          <td className="py-2 px-3 font-mono text-slate-600">{m.scriptName}</td>
                                          <td className="py-2 px-3 text-slate-600">{m.description}</td>
                                          <td className="py-2 px-3">
                                            <span className={`inline-flex items-center gap-1 font-semibold ${m.status === 'SUCCESS' ? 'text-emerald-600' : 'text-red-600'}`}>
                                              {m.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                              {m.status}
                                            </span>
                                          </td>
                                          <td className="py-2 px-3 font-mono text-slate-400">
                                            {new Date(m.appliedAt).toLocaleString()}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                Loading migration history...
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Run Migration Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(migrateTarget)}
        onClose={() => setMigrateTarget(null)}
        onConfirm={handleRunMigration}
        title={`Run Schema Migration on '${migrateTarget?.tenantCode || ''}'?`}
        message={`This will re-apply the latest schema (V1..V8) to database '${migrateTarget?.databaseName || ''}'. Existing data is preserved. The operation is recorded in the platform audit trail.`}
        confirmText="Run Migration"
        cancelText="Cancel"
        variant="primary"
        loading={migrateBusy}
      />
    </div>
  );
};
