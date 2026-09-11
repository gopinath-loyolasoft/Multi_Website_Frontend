import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Settings,
  Landmark,
  Users,
  Sliders,
  BarChart3,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
  Crown
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const SuperAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await apiClient.post('/auth/login', { username, password });
      if (res.data.success && res.data.data.role === 'SuperAdmin') {
        localStorage.setItem('college_auth_token', res.data.data.token);
        localStorage.setItem('college_auth_user', JSON.stringify(res.data.data));
        navigate('/superadmin/dashboard');
      } else if (res.data.success) {
        setError('This account does not have SuperAdmin platform privileges.');
      } else {
        setError(res.data.message || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0b1026] font-sans text-slate-100 selection:bg-indigo-600 selection:text-white overflow-x-hidden">

      {/* ============================================================================ */}
      {/* LEFT 60%: Midnight Blue Platform Control Visual Canvas */}
      {/* ============================================================================ */}
      <div className="relative lg:w-[60%] min-h-[600px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden bg-[#0b1026] text-white">

        {/* Subtle Map / Grid Background Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.12),transparent_70%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#a5b4fc 1.5px, transparent 1.5px)`,
            backgroundSize: '28px 28px'
          }}
        />

        {/* Top Brand Header */}
        <div className="relative z-20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/20 shrink-0">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
              Super Admin
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Multi-Tenant College Management
            </p>
          </div>
        </div>

        {/* Middle Content Grid */}
        <div className="relative z-20 my-auto py-4 grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">

          {/* Main Headline & 4 Feature Items (6 cols) */}
          <div className="xl:col-span-6 space-y-6 text-left">
            {/* Top Eyebrow Bar */}
            <div className="h-1 w-10 bg-indigo-500 rounded-full" />

            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.08]">
                One Platform
              </h1>
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent tracking-tight leading-[1.08]">
                Complete Control
              </h1>
              <p className="text-sm font-medium text-slate-300 pt-2 leading-relaxed">
                Manage Multiple Colleges. Empower Education.
              </p>
            </div>

            {/* 4 Feature Items Stack */}
            <div className="space-y-4 pt-3">
              {/* Feature 1 */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#161f42] border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 shadow-md">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Multi-Tenant Management
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Manage all colleges from one place
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#161f42] border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 shadow-md">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Users & Permissions
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Control access across institutions
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#161f42] border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 shadow-md">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Dynamic Configuration
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Customize features for each college
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#161f42] border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 shadow-md">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Reports & Analytics
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Get insights, ensure growth
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prominent 3D Isometric Central Visual (6 cols) */}
          <div className="hidden xl:flex xl:col-span-6 items-center justify-center relative pr-12 pt-14 -translate-x-10 translate-y-10">            <div className="relative w-full max-w-lg lg:max-w-xl scale-105">
            <img
              src="/assets/superadmin_hub.png"
              alt="3D Multi-Tenant Platform Cloud Visual"
              className="w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(79,70,229,0.45)]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* Floating College Badges - Positioned over Larger Graphic */}
            <div className="absolute top-[18%] left-[26%] -translate-x-1/2 px-3 py-1 rounded-md bg-[#0f1738]/95 border border-indigo-500/50 text-[11px] font-bold text-indigo-300 backdrop-blur-sm shadow-xl pointer-events-none">
              College 1
            </div>
            <div className="absolute top-[50%] left-[6%] px-3 py-1 rounded-md bg-[#0f1738]/95 border border-purple-500/50 text-[11px] font-bold text-purple-300 backdrop-blur-sm shadow-xl pointer-events-none">
              College 2
            </div>
            <div className="absolute bottom-[18%] right-[16%] px-3 py-1 rounded-md bg-[#0f1738]/95 border border-indigo-400/50 text-[11px] font-bold text-indigo-200 backdrop-blur-sm shadow-xl pointer-events-none">
              College 3
            </div>
          </div>
          </div>

        </div>

        {/* Footer Motto */}
        <div className="relative z-20 pt-6 border-t border-slate-800/60 flex items-center gap-3 text-xs font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
          <span className="h-[2px] w-7 bg-indigo-500 rounded-full" />
          <span>CENTRALIZE &nbsp;|&nbsp; SIMPLIFY &nbsp;|&nbsp; EMPOWER</span>
        </div>

        {/* Multi-Layered Curved Purple Ribbon Edge SVG */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-44 pointer-events-none z-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ribbonBand1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="ribbonBand2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Layer 1: Wide Outer Soft Purple Glow Ribbon */}
            <path d="M100 0 C 15 25, 55 75, 100 100 L 100 100 L 100 0 Z" fill="url(#ribbonBand1)" />

            {/* Layer 2: Vibrant Indigo-Purple Ribbon Accent Band */}
            <path d="M100 0 C 26 28, 66 72, 100 100 L 100 100 L 100 0 Z" fill="url(#ribbonBand2)" />

            {/* Layer 3: Solid Off-White Right Panel Cutout */}
            <path d="M100 0 C 35 30, 75 70, 100 100 L 100 100 L 100 0 Z" fill="#F5F7FB" />
          </svg>
        </div>

      </div>


      {/* ============================================================================ */}
      {/* RIGHT 40%: Soft Off-White Panel & Master Form */}
      {/* ============================================================================ */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#F5F7FB] text-slate-900 relative z-20 min-h-screen">

        {/* Top-Right Decorative Dot Matrix */}
        <div className="absolute top-8 right-8 z-10 pointer-events-none opacity-40">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            ))}
          </div>
        </div>

        {/* Bottom-Right Soft Leaf/Floral Decorative Outline */}
        <div className="absolute bottom-0 right-0 z-0 pointer-events-none opacity-20 text-indigo-400">
          <svg width="220" height="220" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M100 100 C 60 90, 40 60, 40 0 C 70 40, 90 60, 100 100 Z" fill="rgba(99,102,241,0.05)" />
            <path d="M100 80 C 70 70, 55 50, 55 10 C 75 35, 90 55, 100 80 Z" />
            <path d="M80 100 C 70 70, 50 55, 10 55 C 35 75, 55 90, 80 100 Z" />
          </svg>
        </div>

        <div className="w-full max-w-sm space-y-7 text-center relative z-20">

          {/* Centered Crown Shield Emblem */}
          <div className="space-y-3 flex flex-col items-center">
            {/* Custom Shield with Crown Emblem */}
            <div className="relative w-16 h-18 flex items-center justify-center">
              <svg className="w-16 h-18 text-indigo-600 drop-shadow-md" viewBox="0 0 64 72" fill="none">
                <path
                  d="M32 3 L58 12 V34 C58 50 46 63 32 68 C18 63 6 50 6 34 V12 L32 3 Z"
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
              </svg>
              <Crown className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-1 pt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Super Admin Login
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Access the central administration panel
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between text-left shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700 font-bold ml-2 text-base">×</button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-2xs transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-2xs transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-600">Remember me</span>
              </label>
              <span className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#4f46e5] hover:bg-[#4338ca] active:scale-[0.99] transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-[#F5F7FB] px-3 text-[11px] font-mono text-slate-400 font-bold uppercase absolute">OR</span>
          </div>

          {/* Secondary Action: Go to Website */}
          <Link
            to="/"
            className="w-full py-3 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 shadow-2xs transition"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Go to Website</span>
          </Link>

          {/* Footer Copyright */}
          <p className="text-[11px] text-slate-400 font-medium pt-4">
            © {new Date().getFullYear()}. Super Admin Panel. All rights reserved.
          </p>

        </div>

      </div>

    </div>
  );
};

