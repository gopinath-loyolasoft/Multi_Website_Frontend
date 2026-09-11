import React, { useEffect, useState } from 'react';
import { GitBranch, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { DatabaseRegistryItem } from '../../types';
import { apiClient } from '../../services/apiClient';

export const MigrationsPage: React.FC = () => {
  const [databases, setDatabases] = useState<DatabaseRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMigrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/superadmin/databases');
      if (res.data.success) {
        setDatabases(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load migration status');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch migration state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMigrations();
  }, []);

  const migrationsList = [
    { version: 'V1', name: 'create_pages.sql', desc: 'Creates dynamic landing pages table with slug and meta indexing' },
    { version: 'V2', name: 'create_page_sections.sql', desc: 'Defines polymorphic sections with JSONB content payload' },
    { version: 'V3', name: 'create_menus.sql', desc: 'Header navigation menus and container definitions' },
    { version: 'V4', name: 'create_menu_items.sql', desc: 'Nested navigation hierarchy and URL routing links' },
    { version: 'V5', name: 'create_news.sql', desc: 'Campus news, press releases, and rich HTML summaries' },
    { version: 'V6', name: 'create_events.sql', desc: 'Calendar events, location schedules, and registration triggers' },
  ];

  const totalTenants = databases.length;
  const tenantsOnVersion = (version: string) =>
    totalTenants === 0 ? 0 : databases.filter((db) => (db.currentMigrationVersion || '').toUpperCase() >= version.toUpperCase()).length;

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-blue-600" />
            <span>Database Schema Migrations</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking versioned schema state across tenant databases on PostgreSQL port 5433.
          </p>
        </div>

        <button
          onClick={fetchMigrations}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs"
          title="Refresh migrations"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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

      {/* Migration Script History */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Tenant Schema Migration Pipeline (Live Status)</span>
        </h2>

        <div className="space-y-2.5">
          {migrationsList.map((m) => {
            const applied = tenantsOnVersion(m.version);
            const synced = totalTenants > 0 && applied === totalTenants;
            return (
              <div
                key={m.version}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-md font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
                    {m.version}
                  </span>
                  <div>
                    <div className="font-mono font-semibold text-slate-900">{m.name}</div>
                    <div className="text-[11px] text-slate-500">{m.desc}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                  synced
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : totalTenants === 0
                    ? 'text-slate-500 bg-slate-50 border-slate-200'
                    : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${synced ? 'text-emerald-600' : 'text-amber-500'}`} />
                  <span>
                    {totalTenants === 0 ? 'No tenants' : synced ? `Synced (${applied}/${totalTenants})` : `Pending (${applied}/${totalTenants})`}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Tenant Database Status */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          <span>Tenant Database Sync Status</span>
        </h2>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : databases.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-4">No tenant databases found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {databases.map((db) => (
              <div key={db.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{db.tenantName} ({db.tenantCode})</span>
                  <span className="font-mono text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Migration {db.currentMigrationVersion}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Database: <span className="text-blue-600 font-semibold">{db.databaseName}</span>
                </div>
                <div className="text-[10px] text-slate-400">Last verified: {db.lastHealthCheckAt ? new Date(db.lastHealthCheckAt).toLocaleString() : 'Recently'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
