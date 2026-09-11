import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ExternalLink, 
  Globe2, 
  Lock, 
  Server, 
  Sparkles,
  Database,
  ArrowRight,
  Code2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { Tenant } from '../../types';

export const PlatformHomePage: React.FC = () => {
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentPort = window.location.port ? `:${window.location.port}` : '';

  useEffect(() => {
    const loadColleges = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/platform/colleges');
        if (res.data.success) {
          setColleges(res.data.data || []);
        } else {
          setError(res.data.message || 'Failed to load colleges from database');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Unable to connect to database');
        setColleges([]);
      } finally {
        setLoading(false);
      }
    };
    loadColleges();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-tight">
                CollegePlatform<span className="text-amber-400">.io</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                Multi-Tenant SaaS Control Plane
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/superadmin/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Lock className="w-4 h-4" />
              <span>SuperAdmin Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tenant Architecture • PostgreSQL Physical Isolation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Dynamic College Website <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Platform & Routing Hub
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to the centralized platform control plane running on <code className="text-amber-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">localhost:3000</code>.
            From here, the SuperAdmin provisions new colleges, isolated databases, and dynamic domain routes.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/superadmin/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition hover:-translate-y-0.5"
            >
              <Lock className="w-4 h-4" />
              <span>Launch SuperAdmin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Active College Websites Directory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
                <Globe2 className="w-5 h-5 text-purple-400" />
                <span>Live Provisioned College Websites</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any college below to open its dynamic website in a new window via its subdomain route.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {colleges.length} Colleges Available
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Querying live colleges from PostgreSQL database...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-semibold text-center">
              {error}
            </div>
          ) : colleges.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <p className="text-slate-300 text-sm font-semibold">No provisioned colleges found in database.</p>
              <p className="text-xs text-slate-500">Log in to SuperAdmin to provision your first college database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((col) => {
              const collegeDomain = col.primaryDomain || `${col.tenantCode.toLowerCase()}.localhost`;
              const isProdDomain = !collegeDomain.endsWith('.localhost');
              const localDevHost = `${col.tenantCode.toLowerCase()}.localhost`;
              const collegeUrl = isProdDomain && window.location.hostname === 'localhost'
                ? `http://${localDevHost}${currentPort}`
                : `http://${collegeDomain}${currentPort}`;

              return (
                <div
                  key={col.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 transition-all hover:shadow-2xl hover:shadow-amber-500/5 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-black text-xs border border-amber-500/20">
                        {col.tenantCode}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIVE
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition leading-snug">
                        {col.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        Domain: <span className="text-purple-400 font-semibold">{collegeDomain}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono space-y-1">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Database className="w-3.5 h-3.5 text-amber-400" />
                        <span>DB: <strong className="text-slate-200">{col.databaseName || `college_${col.tenantCode.toLowerCase()}_database`}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Server className="w-3.5 h-3.5 text-blue-400" />
                        <span>Port: <strong className="text-slate-200">PostgreSQL :5433</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center gap-2">
                    <a
                      href={collegeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
                    >
                      <span>Open Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`${collegeUrl}/admin/login`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition"
                      title="Direct College Admin Login"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Admin</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Technical Architecture Quick Guide */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>Localhost Subdomain Routing Quick Guide</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/60 space-y-1.5">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Format 1: *.localhost (Recommended)</span>
              </h4>
              <p className="text-[11px] leading-relaxed">
                URLs like <code className="text-amber-400 font-mono">http://kts.localhost:3000</code> or <code className="text-amber-400 font-mono">http://rnc.localhost:3000</code> work automatically in Chrome, Edge, and Firefox without any system setup (RFC 6761).
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/60 space-y-1.5">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-purple-400" />
                <span>Format 2: *.localhost.com</span>
              </h4>
              <p className="text-[11px] leading-relaxed">
                If using <code className="text-purple-400 font-mono">kts.localhost.com:3000</code>, add <code className="text-slate-200 font-mono">127.0.0.1 kts.localhost.com</code> into <code className="text-slate-400 font-mono">C:\Windows\System32\drivers\etc\hosts</code>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-mono">
        Multi-Tenant College Website Architecture Prototype • Port 3000 & Port 5000
      </footer>
    </div>
  );
};
