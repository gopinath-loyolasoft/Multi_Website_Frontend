import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Globe2, 
  Database, 
  Users, 
  ArrowRight, 
  PlusCircle, 
  Activity, 

  RefreshCw
} from 'lucide-react';
import { SuperAdminDashboardStats } from '../../types';
import { apiClient } from '../../services/apiClient';

export const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SuperAdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/superadmin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      } else {
        setError(res.data.message || 'Failed to load dashboard metrics');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to connect to SuperAdmin API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Querying live metrics from Platform DB (dinamic_college_website)...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-950/40 border border-red-800 rounded-2xl text-red-300 space-y-3">
        <h3 className="font-bold text-lg">Error Loading Dashboard</h3>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Colleges',
      value: stats.totalColleges,
      desc: 'Registered tenants',
      icon: Building2,
      color: 'text-blue-600',
      iconBg: 'bg-blue-50 border border-blue-100',
      link: '/superadmin/colleges',
    },
    {
      title: 'Active Colleges',
      value: stats.activeColleges,
      desc: 'Live college websites',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border border-emerald-100',
      link: '/superadmin/colleges',
    },
    {
      title: 'Suspended Colleges',
      value: stats.suspendedColleges,
      desc: 'Disabled/Locked tenants',
      icon: XCircle,
      color: 'text-red-600',
      iconBg: 'bg-red-50 border border-red-100',
      link: '/superadmin/colleges',
    },
    {
      title: 'Domains Mapped',
      value: stats.totalDomains,
      desc: 'Routing hostnames',
      icon: Globe2,
      color: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border border-indigo-100',
      link: '/superadmin/domains',
    },
    {
      title: 'Tenant Databases',
      value: stats.totalDatabases,
      desc: 'Isolated PostgreSQL DBs',
      icon: Database,
      color: 'text-cyan-600',
      iconBg: 'bg-cyan-50 border border-cyan-100',
      link: '/superadmin/databases',
    },
    {
      title: 'College Admins',
      value: stats.totalCollegeAdmins,
      desc: 'Scoped college staff',
      icon: Users,
      color: 'text-slate-700',
      iconBg: 'bg-slate-100 border border-slate-200',
      link: '/superadmin/admins',
    },
  ];

  return (
    <div className="space-y-6 font-sans antialiased text-slate-900">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">SuperAdmin Control Plane</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Global orchestration of multi-tenant colleges, isolated databases, routing, and security policies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardStats}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh Stats</span>
          </button>
          <Link
            to="/superadmin/colleges"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Provision College</span>
          </Link>
        </div>
      </div>

      {/* 6 Real Database Aggregate Cards (Pure White, 12-16px radius, subtle border) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition duration-150 block group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.iconBg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</div>
              <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Two Column Grid: Recent Colleges Table & Live Audit Logs Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colleges Overview Table (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-slate-900 text-sm">Provisioned Colleges (Platform DB)</h2>
            </div>
            <Link
              to="/superadmin/colleges"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              <span>Manage Colleges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="pb-2.5">Code</th>
                  <th className="pb-2.5">College Name</th>
                  <th className="pb-2.5">Primary Domain</th>
                  <th className="pb-2.5">Tenant DB</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stats.recentColleges.map((col) => (
                  <tr key={col.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-mono font-bold text-blue-600">{col.tenantCode}</td>
                    <td className="py-3 font-medium text-slate-900">{col.name}</td>
                    <td className="py-3 font-mono text-slate-500">{col.primaryDomain || `${col.tenantCode.toLowerCase()}.localhost`}</td>
                    <td className="py-3 font-mono text-slate-600">college_{col.tenantCode.toLowerCase()}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          col.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {col.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/superadmin/colleges/${col.id}`}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Audit Log Stream (1 col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="font-semibold text-slate-900 text-sm">Platform Audit Trail</h2>
            </div>
            <Link
              to="/superadmin/audit-logs"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              All Logs →
            </Link>
          </div>

          <div className="space-y-2.5">
            {stats.recentActivity.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-50/80 border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-blue-700 text-[11px]">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">{log.details}</p>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-200/50">
                  <span>By: <strong className="text-slate-700">{log.username}</strong></span>
                  {log.tenantCode && <span className="text-emerald-700 font-semibold">Tenant: {log.tenantCode}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
