import React, { useState, useEffect } from 'react';
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
import { applyBrowserBranding } from '../../services/platformBranding';

export const SuperAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure SuperAdmin title and favicon load immediately on opening login page
    applyBrowserBranding();
  }, []);

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
        setError('Unauthorized: This portal is exclusively for Platform SuperAdmins.');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid superadmin credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#080d24] font-sans relative overflow-hidden select-none">

      {/* ---------------------------------------------------- */}
      {/* LEFT COLUMN: HERO & BRANDING (DEEP NAVY THEME)      */}
      {/* ---------------------------------------------------- */}
      <div className="w-full lg:w-[58%] xl:w-[60%] bg-[#0b102b] relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-14 text-white">

        {/* Ambient Dark Navy/Indigo Glow Highlights */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Subtle Matrix Dot Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#818cf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Top Header / Branding */}
        <div className="relative z-20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0b102b] rounded-[10px] flex items-center justify-center">
              <Settings className="w-5 h-5 text-indigo-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Super Admin
            </h2>
            <p className="text-xs text-slate-400 font-medium">
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
          <div className="hidden xl:flex xl:col-span-6 items-center justify-center relative pr-12 pt-14 -translate-x-10 translate-y-10">
            <div className="relative w-full max-w-lg lg:max-w-xl scale-105">
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

        {/* Multi-Layered Curved Purple Ribbon & White Cove Divider SVG */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-44 pointer-events-none z-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="purpleRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            {/* Outer soft glowing purple ribbon */}
            <path
              d="M 100 0 C 22 25, 22 75, 100 100 L 100 100 L 100 0 Z"
              fill="url(#purpleGlow)"
            />
            {/* White/Off-White Form Panel Cove Body */}
            <path
              d="M 100 0 C 35 25, 35 75, 100 100 L 100 100 L 100 0 Z"
              fill="#F5F7FB"
            />
            {/* Vibrant Purple Edge Ribbon Stroke */}
            <path
              d="M 100 0 C 35 25, 35 75, 100 100"
              fill="none"
              stroke="url(#purpleRibbon)"
              strokeWidth="2.8"
            />
          </svg>
        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* RIGHT COLUMN: LOGIN FORM (CLEAN WHITE / SLATE)      */}
      {/* ---------------------------------------------------- */}
      <div className="w-full lg:w-[42%] xl:w-[40%] bg-[#F5F7FB] flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 relative z-20 overflow-hidden">

        {/* Ambient Top Right Subtle Dot Accent */}
        <div
          className="absolute top-8 right-8 w-24 h-24 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1.5px, transparent 1.5px)`,
            backgroundSize: '10px 10px'
          }}
        />

        {/* Decorative Botanical Corner Curve Accent (Bottom Right) */}
        <div className="hidden lg:block absolute -bottom-6 -right-6 w-56 h-56 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 200 C 130 160, 90 110, 110 30 C 120 80, 150 130, 200 160 Z" stroke="#6366f1" strokeWidth="1.5" fill="none" />
            <path d="M200 200 C 160 130, 110 90, 30 110 C 80 120, 130 150, 160 200 Z" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
            <path d="M200 200 C 160 160, 120 120, 70 70 C 120 100, 150 140, 200 200 Z" stroke="#a855f7" strokeWidth="1.2" fill="none" />
            <path d="M200 120 C 140 100, 100 60, 120 0 C 130 40, 160 80, 200 90 Z" stroke="#6366f1" strokeWidth="1.2" fill="none" />
            <path d="M120 200 C 100 140, 60 100, 0 120 C 40 130, 80 160, 90 200 Z" stroke="#8b5cf6" strokeWidth="1.2" fill="none" />
          </svg>
        </div>

        <div className="w-full max-w-sm space-y-6 text-center relative z-10">

          {/* Shield Icon Header */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5] shadow-xs">
              <Crown className="w-7 h-7 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Super Admin Login
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Access the central administration panel
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-left animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                  className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
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
