import React, { useEffect, useState } from 'react';
import { FileClock, RefreshCw, Search, Filter, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { AuditLogItem, Tenant } from '../../types';
import { apiClient } from '../../services/apiClient';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchColleges = async () => {
    try {
      const res = await apiClient.get('/superadmin/colleges');
      if (res.data.success) {
        setColleges(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load colleges for audit filter', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params: any = {
        pageNumber: page,
        pageSize: pageSize
      };
      if (selectedTenantId) params.tenantId = selectedTenantId;
      if (selectedAction) params.action = selectedAction;

      const res = await apiClient.get('/superadmin/audit-logs', { params });
      if (res.data.success) {
        const raw = res.data.data;
        if (Array.isArray(raw)) {
          setLogs(raw);
          setTotalCount((prev) => (prev >= raw.length ? prev : raw.length));
        } else if (raw && Array.isArray(raw.items)) {
          setLogs(raw.items);
          setTotalCount(raw.totalCount ?? raw.items.length);
          if (raw.totalPages !== undefined && raw.totalPages === 1 && raw.totalCount > raw.items.length) {
            setTotalCount(raw.totalCount);
          }
        } else {
          setLogs([]);
          setTotalCount(0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [page, selectedTenantId, selectedAction]);

  const filtered = logs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
    l.username.toLowerCase().includes(search.toLowerCase()) ||
    (l.tenantCode && l.tenantCode.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileClock className="w-6 h-6 text-blue-600" />
            <span>Platform Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable audit record of all platform provisioning, database migrations, themes, and access changes.
          </p>
        </div>

        <button
          onClick={() => {
            setPage(1);
            fetchAuditLogs();
          }}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-2xs"
          title="Refresh logs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within page by action, details, user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tenant Scope Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs shadow-2xs">
            <Building2 className="w-4 h-4 text-blue-600" />
            <select
              value={selectedTenantId}
              onChange={(e) => {
                setSelectedTenantId(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="" className="text-slate-900">All Colleges / Platform</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-900">
                  {c.name} ({c.tenantCode})
                </option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs shadow-2xs">
            <Filter className="w-4 h-4 text-blue-600" />
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="" className="text-slate-900">All Actions</option>
              <option value="CREATE_COLLEGE" className="text-slate-900">CREATE_COLLEGE</option>
              <option value="UPDATE_COLLEGE" className="text-slate-900">UPDATE_COLLEGE</option>
              <option value="ACTIVATE_COLLEGE" className="text-slate-900">ACTIVATE_COLLEGE</option>
              <option value="SUSPEND_COLLEGE" className="text-slate-900">SUSPEND_COLLEGE</option>
              <option value="ASSIGN_THEME" className="text-slate-900">ASSIGN_THEME</option>
              <option value="UPDATE_FEATURES" className="text-slate-900">UPDATE_FEATURES</option>
              <option value="CREATE_ROLE" className="text-slate-900">CREATE_ROLE</option>
              <option value="UPDATE_ROLE_PERMISSIONS" className="text-slate-900">UPDATE_ROLE_PERMISSIONS</option>
              <option value="VERIFY_DATABASE" className="text-slate-900">VERIFY_DATABASE</option>
              <option value="CREATE_DOMAIN" className="text-slate-900">CREATE_DOMAIN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-slate-500 text-sm">No audit logs matching current criteria.</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6">Action</th>
                  <th className="py-3 px-6">Entity</th>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Tenant Scope</th>
                  <th className="py-3 px-6">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-6 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-semibold text-blue-600 text-[11px] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-600 whitespace-nowrap">
                      {log.entityType}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-900 whitespace-nowrap">
                      {log.username}
                    </td>
                    <td className="py-3.5 px-6 font-mono whitespace-nowrap">
                      {log.tenantCode ? (
                        <span className="text-slate-900 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                          {log.tenantCode}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">GLOBAL_PLATFORM</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 max-w-lg">
                      <span className="line-clamp-2 text-xs" title={log.details || ''}>
                        {log.details || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="text-slate-900 font-bold">{filtered.length}</span> of{' '}
            <span className="text-slate-900 font-bold">{totalCount}</span> total recorded events
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center gap-1 font-medium transition text-slate-700 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 shadow-2xs">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center gap-1 font-medium transition text-slate-700 shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
