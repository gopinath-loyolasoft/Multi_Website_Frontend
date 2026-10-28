import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  User,
  Mail,
  Shield,
  TrendingUp,
  Users,
  ArrowLeft,
  GraduationCap,
  Building2,
  Globe,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  Flame,
  Award,
  Layers,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Zap,
  Cpu
} from 'lucide-react';

export interface LoginTemplateProps {
  collegeName: string;
  tagline: string;
  campusImage: string;
  tenantDomain: string;
  siteConfig: any;
  CrestIcon: any;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  loading: boolean;
  error: string | null;
  setError: (val: string | null) => void;
  handleLogin: (e: React.FormEvent) => void;
}

// ============================================================================
// TEMPLATE 1: Sky Blue & Slanted Angle Wave (CMS360 Style)
// ============================================================================
// TEMPLATE 4: 3D Kinetic Perspective & Crimson Velocity
// ============================================================================
export const SkyBlueSlantedTemplate: React.FC<LoginTemplateProps> = ({
  collegeName,
  tagline,
  campusImage,
  tenantDomain,
  siteConfig,
  CrestIcon,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  setError,
  handleLogin
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#030812] font-sans text-white selection:bg-red-500 selection:text-white overflow-x-hidden relative">
      
      {/* Laser Ambient Crimson Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-rose-900/15 blur-[160px] pointer-events-none" />

      {/* Left 70%: High-Precision Library / Campus Canvas + Chamfered HUD Cards */}
      <div className="relative w-full lg:w-[70%] min-h-[540px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 overflow-hidden bg-[#050c18] text-white">
        
        {/* Crystal Clear Daylight / Interior Library Background Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 scale-100"
          style={{ backgroundImage: `url(${campusImage})` }}
        />
        
        {/* Soft Vignette Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030812]/95 via-[#030812]/50 to-[#030812]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030812]/80 via-[#030812]/30 to-[#030812]/85" />

        {/* Top Header: Official Kinetic Badge + Massive Headline */}
        <div className="relative z-20 space-y-4 pt-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-400 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.35)] backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>Kinetic 3D Perspective Core</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.12] tracking-tight uppercase drop-shadow-xl">
            KINETIC<br />
            <span className="text-[#ef4444] drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">VELOCITY</span> &amp;<br />
            GOVERNANCE
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-200 max-w-xl leading-relaxed drop-shadow">
            180° card rotation physics, gyroscopic cursor parallax, and high-performance portal intelligence.
          </p>
        </div>

        {/* 3 Chamfered Glass HUD Cards */}
        <div className="relative z-20 my-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          
          {/* Card 1: 180° Flip Physics */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#081324]/85 border border-slate-700/70 hover:border-red-500/70 transition-all duration-300 shadow-2xl backdrop-blur-xl group relative overflow-hidden">
            {/* Top-Right Chamfer Corner Accent */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-red-500/30 to-transparent border-b border-l border-red-500/40 rotate-45 transform translate-x-4 -translate-y-4" />
            
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center text-sm font-black mb-2.5 shadow-[0_0_15px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-red-400 text-red-400" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">180° Flip Physics</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">True 3D card perspective.</p>
          </div>

          {/* Card 2: Gyro Parallax */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#081324]/85 border border-slate-700/70 hover:border-red-500/70 transition-all duration-300 shadow-2xl backdrop-blur-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-red-500/30 to-transparent border-b border-l border-red-500/40 rotate-45 transform translate-x-4 -translate-y-4" />

            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center text-sm font-black mb-2.5 shadow-[0_0_15px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform">
              <span className="text-base">◎</span>
            </div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Gyro Parallax</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">Interactive motion control.</p>
          </div>

          {/* Card 3: Laser Shield */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#081324]/85 border border-slate-700/70 hover:border-red-500/70 transition-all duration-300 shadow-2xl backdrop-blur-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-red-500/30 to-transparent border-b border-l border-red-500/40 rotate-45 transform translate-x-4 -translate-y-4" />

            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center text-sm font-black mb-2.5 shadow-[0_0_15px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Laser Shield</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">Enterprise session security.</p>
          </div>
        </div>

        {/* Bottom Tagline & Domain Footer */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#ef4444]" />
            <span>{tagline || 'Leading Innovation, Engineering Tomorrow'}</span>
          </div>
          <span className="px-4 py-1.5 rounded-full backdrop-blur-md bg-[#081324] border border-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 shadow-md">
            <span>🌐</span>
            <span>{tenantDomain || 'campus.localhost'}</span>
          </span>
        </div>

        {/* Center 3D Slicing Crimson Laser Blade Divider (Upward Angle /) */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-52 pointer-events-none z-30 overflow-hidden">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Dark Crimson Bottom-Right Triangle Wedge */}
            <polygon points="100,100 15,100 100,25" fill="#7f1d1d" fillOpacity="0.75" />
            {/* Bright Crimson Laser Cutting Blade */}
            <polygon points="100,100 35,100 100,0" fill="url(#crimson-blade)" fillOpacity="0.95" />
            {/* Deep Obsidian Mask */}
            <polygon points="100,100 55,100 100,0" fill="#030812" />
            <defs>
              <linearGradient id="crimson-blade" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#991b1b" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>
          {/* Laser Glow Seam */}
          <div className="absolute top-0 bottom-0 right-0 w-[2.5px] bg-gradient-to-b from-[#f43f5e] via-[#ef4444] to-[#991b1b] shadow-[0_0_35px_#ef4444]" />
        </div>
      </div>

      {/* Right 30%: Kinetic Cyber Login Form Panel */}
      <div className="relative w-full lg:w-[30%] min-h-[560px] lg:min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-6 xl:p-10 z-20 bg-[#030812] overflow-hidden">
        
        {/* Far-Right Edge 3D Crimson Laser Wedge (Bottom-to-Top / Slice) */}
        <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-36 pointer-events-none z-10 overflow-hidden">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Red Background Wedge */}
            <polygon points="100,0 100,100 25,100" fill="#7f1d1d" fillOpacity="0.35" />
            {/* Glowing Crimson Edge Slice */}
            <polygon points="100,25 100,100 50,100" fill="#dc2626" fillOpacity="0.75" />
          </svg>
          {/* Right Laser Seam */}
          <div className="absolute top-20 bottom-0 right-0 w-[2px] bg-gradient-to-t from-[#ef4444] via-[#f43f5e] to-transparent shadow-[0_0_25px_#ef4444]" />
        </div>

        {/* Right Form Container */}
        <div className="w-full max-w-sm mx-auto relative z-20 space-y-5">
          
          {/* College Crest & Header */}
          <div className="text-center mb-5">
            {/* Pure Minimalist Temple / Column Crest */}
            <div className="flex items-center justify-center mb-3">
              <svg className="w-12 h-12 text-[#ef4444] drop-shadow-[0_0_18px_rgba(239,68,68,0.7)]" viewBox="0 0 24 24" fill="currentColor">
                {/* Pediment Roof */}
                <polygon points="12 2, 2 8, 22 8" />
                {/* Architrave Bar */}
                <rect x="3" y="9" width="18" height="2" rx="0.5" />
                {/* 3 Pillars */}
                <rect x="5" y="12" width="2.5" height="7" rx="0.5" />
                <rect x="10.75" y="12" width="2.5" height="7" rx="0.5" />
                <rect x="16.5" y="12" width="2.5" height="7" rx="0.5" />
                {/* Base Steps */}
                <rect x="3" y="20" width="18" height="2" rx="0.5" />
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-white drop-shadow-md uppercase">
              {collegeName}
            </h2>
            <span className="text-xs font-semibold tracking-wider text-slate-300 block mt-1">
              Kinetic Portal Access
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/70 text-red-200 text-xs font-bold backdrop-blur-md shadow-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Field 1: Admin Username with Dark Capsule & Red Accent Wedge */}
            <div>
              <div className="relative flex items-center rounded-full bg-[#131f32] border border-slate-700/80 overflow-hidden group focus-within:border-red-500/80 focus-within:ring-2 focus-within:ring-red-500/30 transition-all shadow-inner">
                <User className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-11 pr-8 py-3.5 bg-[#131f32] text-white text-sm font-medium focus:outline-none placeholder:text-slate-500"
                  required
                />
                {/* Slanted Crimson Right Accent Wedge */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-red-600 to-transparent -skew-x-12 transform origin-bottom pointer-events-none" />
              </div>
            </div>

            {/* Field 2: Password with Dark Capsule & Red Accent Wedge & Eye Toggle */}
            <div>
              <div className="relative flex items-center rounded-full bg-[#131f32] border border-slate-700/80 overflow-hidden group focus-within:border-red-500/80 focus-within:ring-2 focus-within:ring-red-500/30 transition-all shadow-inner">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-11 pr-12 py-3.5 bg-[#131f32] text-white text-sm font-medium focus:outline-none placeholder:text-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 z-10"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {/* Slanted Crimson Right Accent Wedge */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-red-600 to-transparent -skew-x-12 transform origin-bottom pointer-events-none" />
              </div>
            </div>

            {/* Checkbox & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                />
                <span className="font-medium text-slate-300">Remember session</span>
              </label>

              <button
                type="button"
                className="text-xs font-bold text-[#ef4444] hover:text-red-400 hover:underline cursor-pointer transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Parallelogram Slanted Crimson Gradient CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 -skew-x-12 rounded-lg bg-gradient-to-r from-[#f43f5e] via-[#ef4444] to-[#dc2626] hover:from-[#ef4444] hover:to-[#b91c1c] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(239,68,68,0.5)] hover:shadow-[0_0_45px_rgba(239,68,68,0.7)] transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 group"
              >
                <span className="skew-x-12 flex items-center gap-2 font-black">
                  {loading ? 'Authenticating...' : 'LAUNCH KINETIC SESSION →'}
                </span>
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="relative text-center pt-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/80" />
            </div>
            <div className="relative inline-block px-3 bg-[#030812] text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              OR
            </div>
          </div>

          {/* Sign in with SSO Button */}
          <div>
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-full border border-slate-700/80 hover:border-red-500/80 bg-[#0c1626]/80 hover:bg-[#101e34] text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-red-400" />
              <span>Sign in with SSO</span>
            </button>
          </div>

          {/* Back to Website Link */}
          <div className="pt-2 text-center">
            <Link
              to="/"
              className="text-xs font-bold text-[#ef4444] hover:text-red-400 hover:underline transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Back to College Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TEMPLATE 2: Royal Gold & Curved Ribbon (RCM College Style)
// ============================================================================
export const RoyalGoldCurvedTemplate: React.FC<LoginTemplateProps> = ({
  collegeName,
  tagline,
  campusImage,
  tenantDomain,
  siteConfig,
  CrestIcon,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  setError,
  handleLogin
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5] font-sans text-slate-900 selection:bg-amber-600 selection:text-white overflow-x-hidden">

      {/* Left 65%: Campus Photography Canvas */}
      <div className="relative lg:w-[65%] min-h-[520px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-slate-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${campusImage})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent" />

        {/* Eyebrow */}
        <div className="relative z-20 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-amber-400/80 rounded-full" />
          <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-amber-300 drop-shadow">
            TRADITION MEETS TOMORROW
          </span>
        </div>

        {/* Main Serif Headline */}
        <div className="relative z-20 my-auto py-8 space-y-6 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-xl">
            Education<br />
            Empowers<br />
            <span className="text-amber-400 font-serif italic drop-shadow-lg">Tomorrow</span>
          </h1>

          <div className="space-y-2 pt-2">
            <span className="h-[2px] w-12 bg-amber-400/70 block rounded-full" />
            <p className="text-lg sm:text-xl text-slate-100 font-serif font-medium leading-relaxed drop-shadow">
              A better campus for a brighter future.
            </p>
          </div>

          {/* 3 Icon Glass Pill Bar */}
          <div className="pt-6">
            <div className="inline-flex flex-wrap items-center gap-6 sm:gap-8 px-6 py-4 rounded-2xl bg-slate-950/60 border border-white/20 backdrop-blur-md shadow-2xl">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200">Manage Content</span>
              </div>

              <div className="hidden sm:block h-8 w-[1px] bg-white/20" />

              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200">Admissions</span>
              </div>

              <div className="hidden sm:block h-8 w-[1px] bg-white/20" />

              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200">Departments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Motto */}
        <div className="relative z-20 pt-6 border-t border-white/15 flex items-center justify-between gap-4 text-sm font-serif italic text-slate-200">
          <span>“{tagline}”</span>
          <span className="text-xs font-sans not-italic font-mono text-amber-300 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-400/30">
            {tenantDomain}
          </span>
        </div>

        {/* Curved Wave Divider with Golden Ribbon */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-36 pointer-events-none z-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <path d="M100 0 C 40 30, 70 70, 100 100 L 100 100 L 100 0 Z" fill="#FAF8F5" />
            <path d="M100 0 C 40 30, 70 70, 100 100" fill="none" stroke="url(#goldRibbon)" strokeWidth="3.5" />
          </svg>
        </div>
      </div>

      {/* Right 35%: Luxury Warm Off-White Form Panel */}
      <div className="w-full lg:w-[35%] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#FAF8F5] text-slate-900 relative z-20">
        <div className="w-full max-w-sm space-y-7 text-center">

          {/* Centered Crest Emblem */}
          <div className="space-y-3 flex flex-col items-center">
            {siteConfig?.settings?.logoUrl ? (
              <div className="p-3.5 rounded-full bg-white shadow-xl border-2 border-amber-500/30 flex items-center justify-center w-20 h-20 shrink-0">
                <img src={siteConfig.settings.logoUrl} alt={collegeName} className="w-14 h-14 object-contain" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-xl border-4 border-white shrink-0">
                <CrestIcon className="w-10 h-10 text-white" />
              </div>
            )}

            <div className="space-y-0.5 pt-1">
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                {collegeName}
              </h2>
              <p className="text-xs font-serif italic text-amber-800 tracking-wide font-medium">
                {tagline}
              </p>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900">
              Admin Login
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Access your administration dashboard
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between text-left shadow-sm">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 font-bold text-base">×</button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                required
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded text-amber-700" />
                <span className="text-xs font-semibold text-slate-600">Remember me</span>
              </label>
              <span className="text-xs font-bold text-amber-800 cursor-pointer">Forgot password?</span>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#8B1A24] hover:bg-[#72131b] transition shadow-lg flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-300 w-full" />
            <span className="bg-[#FAF8F5] px-3 text-[11px] font-mono text-slate-400 font-bold uppercase absolute">OR</span>
          </div>

          <Link to="/" className="w-full py-3 rounded-xl font-bold text-xs text-amber-900 bg-white border border-amber-900/30 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </Link>

          <p className="text-[11px] text-slate-500 font-medium pt-4">
            © {new Date().getFullYear()} {collegeName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};


// ============================================================================
// TEMPLATE 3: Emerald Botanical Wave (GP College Style)
// ============================================================================
export const EmeraldBotanicalTemplate: React.FC<LoginTemplateProps> = ({
  collegeName,
  tagline,
  campusImage,
  tenantDomain,
  siteConfig,
  CrestIcon,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  setError,
  handleLogin
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f0fdf4] font-sans text-slate-900 selection:bg-emerald-600 selection:text-white overflow-x-hidden">

      {/* Left 62%: Emerald Botanical Wave Canvas */}
      <div className="relative lg:w-[62%] min-h-[500px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-emerald-950 text-white">

        {/* Background Image with Botanical Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${campusImage})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-teal-950/60 to-emerald-900/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-transparent to-transparent" />

        {/* Top Header Logo */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 backdrop-blur-md flex items-center justify-center text-emerald-300">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-none tracking-tight uppercase">
              {collegeName}
            </h2>
            <p className="text-xs font-semibold text-emerald-300 pt-0.5">
              Innovation for a Better Tomorrow
            </p>
          </div>
        </div>

        {/* Middle Hero Section */}
        <div className="relative z-20 my-auto py-8 space-y-5 max-w-xl">
          <span className="h-1 w-12 bg-emerald-400 block rounded-full" />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            Building<br />
            Brighter<br />
            <span className="text-emerald-400">Futures</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 font-medium">
            Knowledge today. A better tomorrow.
          </p>

          {/* 3 Green Icon Columns */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mx-auto flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 block leading-tight">Academic Excellence</span>
            </div>

            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mx-auto flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 block leading-tight">Vibrant Community</span>
            </div>

            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mx-auto flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 block leading-tight">Lifelong Opportunities</span>
            </div>
          </div>
        </div>

        {/* Footer Line */}
        <div className="relative z-20 pt-6 border-t border-emerald-800/60 flex items-center gap-3 text-xs font-mono text-emerald-300">
          <span className="h-0.5 w-6 bg-emerald-400" />
          <span>Learn &nbsp;|&nbsp; Grow &nbsp;|&nbsp; Belong</span>
        </div>

        {/* Emerald SVG Curved Divider */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-36 pointer-events-none z-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M100 0 C 20 40, 90 60, 100 100 L 100 100 L 100 0 Z" fill="#f0fdf4" />
          </svg>
        </div>

      </div>

      {/* Right 38%: Floating White Rounded Card Section */}
      <div className="w-full lg:w-[38%] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#f0fdf4] relative z-20">

        {/* Floating Rounded Card */}
        <div className="w-full max-w-sm p-8 sm:p-10 rounded-3xl bg-white shadow-2xl border border-emerald-100/80 space-y-6 text-left">

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sign in to continue
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 font-bold">×</button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
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
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-600">Remember me</span>
              </label>

              <span className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In →</span>
            </button>
          </form>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-mono text-slate-400 uppercase absolute">or</span>
          </div>

          <Link
            to="/"
            className="w-full py-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-2 transition"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Back to Public Website</span>
          </Link>

          <p className="text-[11px] text-slate-400 font-medium text-center pt-2">
            © {new Date().getFullYear()} {collegeName}. All rights reserved.
          </p>

        </div>

      </div>

    </div>
  );
};


// ============================================================================
// TEMPLATE 4: Modern Tech Blue Polygon (SHC Style)
// ============================================================================
export const ModernTechPolygonTemplate: React.FC<LoginTemplateProps> = ({
  collegeName,
  tagline,
  campusImage,
  tenantDomain,
  siteConfig,
  CrestIcon,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  setError,
  handleLogin
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#eaf2ff] font-sans text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden">

      {/* Left 58%: Angular Tech Blue Polygon Canvas */}
      <div className="relative lg:w-[58%] min-h-[500px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-slate-950 text-white">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${campusImage})` }}
        />

        {/* Tech Geometric Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/80 to-slate-900/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-transparent to-transparent" />

        {/* Top Flame / Crest Logo */}
        <div className="relative z-20 flex items-center gap-3">
          {siteConfig?.settings?.logoUrl ? (
            <img
              src={siteConfig.settings.logoUrl}
              alt={collegeName}
              className="h-12 max-w-[160px] object-contain drop-shadow-md"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-xl border border-white/20">
              <Flame className="w-7 h-7 fill-white" />
            </div>
          )}
          <div className="text-left">
            <h2 className="text-xl font-black tracking-tight text-white leading-none uppercase drop-shadow-sm">
              {siteConfig?.settings?.siteName || collegeName}
            </h2>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-sky-400 block pt-1">
              {siteConfig?.settings?.tagline || tagline || "DISCOVER • LEARN • GROW"}
            </span>
          </div>
        </div>

        {/* Middle Modern Hero Section */}
        <div className="relative z-20 my-auto py-8 space-y-6 max-w-xl text-left">
          <div className="flex items-center gap-2">
            <span className="h-1 w-12 bg-sky-400 block rounded-full" />
            <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest">
              OFFICIAL INSTITUTIONAL PORTAL
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
            Continue Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-300">
              Academic Journey
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed drop-shadow">
            Empowering students, faculty, and administrators with a smarter, unified platform.
          </p>

          {/* 3 Tech Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-md text-center space-y-1.5 hover:border-sky-400/50 transition-all shadow-lg">
              <GraduationCap className="w-6 h-6 text-sky-400 mx-auto drop-shadow" />
              <span className="text-xs font-bold text-white block leading-tight">Academic Portal</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-md text-center space-y-1.5 hover:border-sky-400/50 transition-all shadow-lg">
              <Users className="w-6 h-6 text-sky-400 mx-auto drop-shadow" />
              <span className="text-xs font-bold text-white block leading-tight">Faculty & Staff</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md text-center space-y-1.5 hover:border-sky-400/50 transition-all shadow-lg">
              <Layers className="w-6 h-6 text-sky-400 mx-auto drop-shadow" />
              <span className="text-xs font-bold text-white block leading-tight">Website Control</span>
            </div>
          </div>
        </div>

        {/* Bottom Motto */}
        <div className="relative z-20 pt-6 border-t border-white/15 text-xs font-mono font-bold tracking-widest uppercase text-sky-300 text-left">
          {tagline ? tagline.toUpperCase() : "A BRIGHTER TOMORROW TOGETHER"}
        </div>

        {/* Double Polygon Diagonal SVG Wave Divider */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-48 pointer-events-none z-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="100,0 15,0 100,100" fill="#1d4ed8" opacity="0.75" />
            <polygon points="100,0 35,0 100,100" fill="#eaf2ff" />
          </svg>
        </div>

      </div>

      {/* Right 42%: Soft Blue Gradient Backdrop with Top-Right & Bottom-Left Dot Matrix Grids + Floating White Card */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#eaf2ff] via-[#dfecff] to-[#d3e4ff] relative z-20">

        {/* Top Right Cyan Dot Matrix Grid */}
        <div className="hidden lg:block absolute top-8 right-8 pointer-events-none opacity-70">
          <div className="grid grid-cols-5 gap-2">
            {[...Array(25)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            ))}
          </div>
        </div>

        {/* Bottom Left Cyan Dot Matrix Grid */}
        <div className="hidden lg:block absolute bottom-8 left-8 pointer-events-none opacity-70">
          <div className="grid grid-cols-5 gap-2">
            {[...Array(25)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            ))}
          </div>
        </div>

        {/* FLOATING WHITE CARD WRAPPER WITH AMBIENT GLOW */}
        <div className="relative group w-full max-w-md z-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/40 via-cyan-400/30 to-blue-500/40 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

          <div className="relative w-full p-8 sm:p-10 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-sky-900/10 border border-slate-100 space-y-6 text-left">

            {/* Top Brand / Status Badge Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/70 text-[11px] font-bold text-sky-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Portal Secure
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Sign in to access your college admin portal
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between animate-shake">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700 font-bold">×</button>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative group/input">
                  <User className="w-4 h-4 text-slate-400 group-focus-within/input:text-sky-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white hover:bg-white transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative group/input">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within/input:text-sky-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white hover:bg-white transition-all shadow-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600">Keep me signed in</span>
                </label>

                <span className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:from-sky-600 hover:via-blue-700 hover:to-cyan-600 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 group/btn"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200/80 w-full" />
              <span className="bg-white px-3 text-[11px] font-mono text-slate-400 uppercase tracking-widest absolute">OR</span>
            </div>

            <Link
              to="/"
              className="w-full py-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Globe className="w-4 h-4 text-sky-600" />
              <span>Back to College Website</span>
            </Link>

            <p className="text-[11px] text-slate-400 font-medium text-center pt-2">
              © {new Date().getFullYear()} {collegeName}. All rights reserved.
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};

// ============================================================================
// TEMPLATE 5: 3D Slanted Parallelogram Suite (Navy & Gold - Salesian Archetype)
// ============================================================================
export const SlantedNavyGoldTemplate: React.FC<LoginTemplateProps> = ({
  collegeName,
  tagline,
  campusImage,
  tenantDomain,
  siteConfig,
  CrestIcon,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  handleLogin,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#071728] font-sans text-slate-100 selection:bg-[#e5a912] selection:text-slate-950 overflow-x-hidden relative">

      {/* Left 70%: Majestic Campus Photography + 3 Glass Feature Cards + Tagline Bar */}
      <div className="relative w-full lg:w-[70%] min-h-[540px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 overflow-hidden bg-[#0a1b2d] text-white">
        
        {/* Crystal Clear Daylight Campus Background Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100 scale-100"
          style={{ backgroundImage: `url(${campusImage})` }}
        />

        {/* Ambient Golden Sunlight Glow on Top Right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-amber-400/35 via-amber-500/10 to-transparent pointer-events-none blur-3xl" />

        {/* Soft Bottom-To-Top Gradient (Transparent at top/center so campus architecture is crystal clear) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071728]/95 via-[#071728]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071728]/70 via-[#071728]/20 to-transparent" />

        {/* Top Hero Area: Official 3D Badge + Big Slanted Headline + Subtitle */}
        <div className="relative z-20 space-y-4 max-w-2xl pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 -skew-x-12 rounded bg-[#0b243b]/90 border border-[#e5a912]/90 text-[#e5a912] text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg shadow-black/40">
            <ShieldCheck className="w-4 h-4 text-[#e5a912] shrink-0 skew-x-12" />
            <span className="skew-x-12">Official 3D Admin Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.15] tracking-tight uppercase drop-shadow-xl">
            EXCELLENCE THROUGH<br />
            <span className="text-[#e5a912]">3D SLANTED</span> LEADERSHIP
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-100 max-w-xl leading-relaxed drop-shadow">
            Empowering college administrators with high-precision content management, governance, and institutional intelligence.
          </p>
        </div>

        {/* Bottom Content Area: 3 Frosted Cards + Footer Line */}
        <div className="relative z-20 space-y-6 w-full max-w-4xl pb-2 pt-6">
          
          {/* 3 Frosted Glass Feature Cards with Yellow Icon Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: 3D Dynamic Matrix */}
            <div className="p-4 rounded-xl bg-[#09223a]/80 border border-white/20 backdrop-blur-md shadow-2xl hover:border-[#e5a912] transition-all duration-300 group -skew-x-3">
              <div className="skew-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#e5a912] text-slate-950 flex items-center justify-center font-bold mb-2.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">3D Dynamic Matrix</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">Slanted perspective cards &amp; departments.</p>
              </div>
            </div>

            {/* Card 2: Curriculum CMS */}
            <div className="p-4 rounded-xl bg-[#09223a]/80 border border-white/20 backdrop-blur-md shadow-2xl hover:border-[#e5a912] transition-all duration-300 group -skew-x-3">
              <div className="skew-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#e5a912] text-slate-950 flex items-center justify-center font-bold mb-2.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4 text-slate-950" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Curriculum CMS</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">Instant syllabus &amp; course publishing.</p>
              </div>
            </div>

            {/* Card 3: Tenant Isolation */}
            <div className="p-4 rounded-xl bg-[#09223a]/80 border border-white/20 backdrop-blur-md shadow-2xl hover:border-[#e5a912] transition-all duration-300 group -skew-x-3">
              <div className="skew-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#e5a912] text-slate-950 flex items-center justify-center font-bold mb-2.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4 text-slate-950" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Tenant Isolation</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">Secure multi-tenant SQL database sandbox.</p>
              </div>
            </div>
          </div>

          {/* Tagline & Domain Pill Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/20 text-xs">
            <div className="flex items-center gap-2 text-slate-200 text-xs font-medium tracking-wide">
              <span className="w-6 h-0.5 bg-[#e5a912]" />
              <span>{tagline || 'Leading Innovation, Engineering Tomorrow'}</span>
            </div>
            <div className="px-4 py-1.5 -skew-x-12 rounded-md bg-[#071728]/95 border border-[#e5a912] text-[#e5a912] font-mono font-bold text-xs shadow-lg shadow-amber-500/10">
              <span className="skew-x-12 inline-block">
                {tenantDomain || 'campus.localhost'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Razor-Sharp 3D Slanted Gold Ribbon Divider & Dot Matrix */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-44 pointer-events-none z-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="100,0 20,0 100,100" fill="#e5a912" />
            <polygon points="100,0 35,0 100,100" fill="#071728" />
          </svg>
          {/* Decorative Dot Matrix on Slanted Divider Base */}
          <div className="absolute bottom-16 right-10 grid grid-cols-4 gap-1.5 opacity-40">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#e5a912]" />
            ))}
          </div>
        </div>
      </div>

      {/* Right 30%: Compact & Sleek Minimalist 3D Form + Architectural Accents */}
      <div className="relative w-full lg:w-[30%] min-h-[560px] lg:min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-6 xl:p-10 bg-[#071728] z-20 overflow-hidden">
        
        {/* Right Edge 3D Overlapping Architectural Polygon Panels */}
        <div className="hidden xl:block absolute top-0 right-0 bottom-0 w-40 pointer-events-none z-10 overflow-hidden">
          {/* Back Polygon Slice with Gold Border */}
          <div className="absolute top-[-10%] right-[-20px] w-36 h-[120%] bg-gradient-to-br from-[#0c243c] via-[#091d31] to-[#071728] border-l-2 border-[#e5a912]/40 -skew-x-12 transform shadow-2xl" />
          {/* Front Polygon Accent Wedge with Glowing Edge */}
          <div className="absolute top-[20%] right-[-30px] w-28 h-[80%] bg-gradient-to-br from-[#10304f] via-[#0a2034] to-[#071728] border-l-2 border-[#e5a912] -skew-x-12 transform shadow-2xl" />
          {/* Top Gold Lighting Reflection */}
          <div className="absolute top-12 right-6 w-28 h-28 bg-amber-400/20 rounded-full blur-3xl" />
        </div>

        {/* Center Form Container */}
        <div className="w-full max-w-sm mx-auto relative z-20 space-y-6">
          
          {/* College Crest & Title Header */}
          <div className="text-center">
            {/* Parallelogram Skewed Gold Crest Box */}
            <div className="inline-flex items-center justify-center w-16 h-16 -skew-x-12 rounded-xl bg-[#0b243b] border-2 border-[#e5a912] text-[#e5a912] mb-3.5 shadow-xl shadow-amber-500/20">
              <div className="skew-x-12">
                <CrestIcon className="w-8 h-8" />
              </div>
            </div>

            {/* College Name */}
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white drop-shadow-md">
              {collegeName}
            </h2>

            {/* Subtitle */}
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e5a912] mt-1.5 drop-shadow">
              Admin &amp; Content Gateway
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-lg bg-red-950/90 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Field 1: Admin Username with Solid Light Box */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#e5a912] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. kkc-admin"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#ebf0f5] text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e5a912] placeholder:text-slate-500 shadow-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Field 2: Password with Solid Light Box & Eye Toggle */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#e5a912] absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-lg bg-[#ebf0f5] text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e5a912] placeholder:text-slate-500 shadow-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#ebf0f5] border-transparent text-[#e5a912] focus:ring-[#e5a912] cursor-pointer accent-[#e5a912]"
                />
                <span className="font-medium text-slate-300">Remember this workstation</span>
              </label>

              <button
                type="button"
                className="text-xs font-bold text-[#e5a912] hover:text-amber-300 hover:underline cursor-pointer transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Exact Slanted Parallelogram CTA Button with Arrow */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 -skew-x-12 rounded-md bg-gradient-to-r from-[#f5a623] via-[#e5a912] to-[#df9b08] hover:from-[#e5a912] hover:to-[#f5a623] text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 group"
              >
                <span className="skew-x-12 inline-flex items-center gap-2 font-black">
                  {loading ? 'Authenticating...' : (
                    <>
                      Sign In to Campus Portal
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="relative text-center pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/80" />
            </div>
            <div className="relative inline-block px-3 bg-[#071728] text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              OR
            </div>
          </div>

          {/* Back to Website */}
          <div className="text-center pt-1">
            <Link
              to="/"
              className="text-xs font-bold text-[#e5a912] hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 hover:underline"
            >
              <span>← Back to College Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TEMPLATE 6: 3D Holographic Glassmorphism (Cyber Aurora)
// ============================================================================
export const HolographicGlassLoginTemplate: React.FC<LoginTemplateProps> = ({
  collegeName,
  tagline,
  campusImage,
  tenantDomain,
  CrestIcon,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  handleLogin,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#020713] font-sans text-white selection:bg-cyan-400 selection:text-slate-950 overflow-x-hidden relative">
      
      {/* Background Animated Aurora Glow Orbs */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[160px] pointer-events-none" />

      {/* Left 70%: Frosted Glass Hero Panel with Daylight/Twilight Campus Backdrop */}
      <div className="relative w-full lg:w-[70%] min-h-[540px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 overflow-hidden">
        
        {/* Crystal Clear Campus Photo Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100 scale-100"
          style={{ backgroundImage: `url(${campusImage})` }}
        />
        {/* Soft Ambient Cyber Blue Lighting & Subtle Vignette for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020713]/95 via-[#020713]/40 to-[#020713]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020713]/60 via-[#020713]/20 to-[#020713]/80" />

        {/* Top Header */}
        <div className="relative z-20 space-y-4 pt-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-cyan-950/60 border border-cyan-400/60 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.35)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cyber Aurora Holographic Core</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white drop-shadow-xl leading-[1.12]">
            Next-Generation<br />
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ec4899] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,229,255,0.4)]">
              Holographic
            </span><br />
            Administration
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-200 max-w-xl leading-relaxed drop-shadow">
            Translucent frosted panels, chromatic prism neon highlights, and seamless real-time institutional synchronisation.
          </p>
        </div>

        {/* 3 Frosted Glass Hologram Feature Cards */}
        <div className="relative z-20 my-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          
          {/* Card 1: Frosted Glass HUD */}
          <div className="p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-[#061226]/80 border border-slate-700/60 hover:border-cyan-400/60 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/40 text-cyan-300 border border-cyan-400/40 flex items-center justify-center text-sm font-black mb-2.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
              💎
            </div>
            <h4 className="text-xs font-bold text-white tracking-wide">Frosted Glass HUD</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">Ultra-clean chromatic UI layers.</p>
          </div>

          {/* Card 2: Real-Time Core */}
          <div className="p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-[#061226]/80 border border-slate-700/60 hover:border-purple-400/60 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/40 text-purple-300 border border-purple-400/40 flex items-center justify-center text-sm font-black mb-2.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <h4 className="text-xs font-bold text-white tracking-wide">Real-Time Core</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">Instant multi-campus publishing.</p>
          </div>

          {/* Card 3: Zero-Trust Shield */}
          <div className="p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-[#061226]/80 border border-slate-700/60 hover:border-amber-400/60 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/40 text-amber-300 border border-amber-400/40 flex items-center justify-center text-sm font-black mb-2.5 shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
              🔒
            </div>
            <h4 className="text-xs font-bold text-white tracking-wide">Zero-Trust Shield</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">Cryptographic session guard.</p>
          </div>
        </div>

        {/* Bottom Tagline & Domain Pill Footer */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-6 h-0.5 bg-cyan-400" />
            <span>{tagline || 'Leading Innovation, Engineering Tomorrow'}</span>
          </div>
          <span className="px-4 py-1.5 rounded-full backdrop-blur-md bg-[#051329] border border-cyan-500/60 text-cyan-400 font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            {tenantDomain || 'campus.localhost'}
          </span>
        </div>

        {/* Center Angled Cyber Prism Laser Divider with 3D Crystalline Facets */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-48 pointer-events-none z-30 overflow-hidden">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="45%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
              <linearGradient id="cyber-purple-facet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>
              <linearGradient id="cyber-cyan-facet" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {/* Upper-left violet facet */}
            <polygon points="100,0 20,0 60,35 100,50" fill="url(#cyber-purple-facet)" fillOpacity="0.85" />
            {/* Lower-left cyan facet */}
            <polygon points="100,60 25,100 100,100" fill="url(#cyber-cyan-facet)" fillOpacity="0.85" />
            {/* Deep Obsidian Body */}
            <polygon points="100,0 45,0 70,50 35,100 100,100" fill="#030917" />
          </svg>
          {/* Laser Glow Line */}
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-[#a855f7] via-[#00f0ff] to-[#00f0ff] shadow-[0_0_30px_#00f0ff]" />
          {/* Cyber Dot Matrix Particles on Crystal Edge */}
          <div className="absolute top-10 right-8 grid grid-cols-4 gap-1.5 opacity-40">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#00f0ff]" />
            ))}
          </div>
        </div>
      </div>

      {/* Right 30%: Floating Hologram Glass Form with Capsule Fields & SSO */}
      <div className="relative w-full lg:w-[30%] min-h-[560px] lg:min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-6 xl:p-10 z-20 bg-[#030917] overflow-hidden">
        
        {/* Top-Right Cyber Dot Matrix */}
        <div className="hidden xl:block absolute top-6 right-8 pointer-events-none opacity-40 z-10">
          <div className="grid grid-cols-4 gap-1.5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#00f0ff]" />
            ))}
          </div>
        </div>

        {/* Top-Right & Bottom-Right Cyber Crystal Slices & Laser Line */}
        <div className="hidden xl:block absolute top-0 right-0 bottom-0 w-36 pointer-events-none z-10 overflow-hidden">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="100,0 100,100 40,100" fill="#700b97" fillOpacity="0.25" />
            <polygon points="100,20 100,100 65,100" fill="#00d2ff" fillOpacity="0.15" />
          </svg>
          <div className="absolute top-16 bottom-0 right-0 w-[1.5px] bg-gradient-to-t from-[#00f0ff] via-[#a855f7] to-transparent shadow-[0_0_20px_#00f0ff]" />
        </div>

        {/* Right Form Container */}
        <div className="w-full max-w-sm mx-auto relative z-20 space-y-5">
          
          {/* Top College Crest & Titles */}
          <div className="text-center mb-5">
            {/* Hexagonal Glowing Cyber Badge with Gradient Border */}
            <div className="relative inline-flex items-center justify-center mb-3">
              <div className="w-16 h-16 relative flex items-center justify-center">
                {/* Hexagon SVG Outline with Cyan-to-Purple Glow */}
                <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_18px_rgba(0,240,255,0.7)]" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="cyber-hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="50 4, 92 26, 92 74, 50 96, 8 74, 8 26"
                    fill="#071936"
                    stroke="url(#cyber-hex-grad)"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="50 11, 85 29, 85 71, 50 89, 15 71, 15 29"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                    opacity="0.4"
                  />
                </svg>
                {/* Microchip CPU Icon inside Hexagon */}
                <div className="relative z-10 text-cyan-300">
                  <Cpu className="w-7 h-7 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-black tracking-wider text-white drop-shadow-md uppercase">
              {collegeName}
            </h2>
            <span className="text-xs font-bold tracking-widest text-[#00f0ff] uppercase block mt-1.5 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              Admin &amp; Control Gateway
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/70 text-red-200 text-xs font-bold backdrop-blur-md shadow-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Field 1: Admin Username with Capsule Pill Box */}
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative flex items-center">
                <div className="w-7 h-7 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-400 absolute left-3 pointer-events-none">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-[#182842] border border-[#2d4464] text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-slate-400 shadow-inner transition-all"
                  required
                />
              </div>
            </div>

            {/* Field 2: Password with Capsule Pill Box & Eye Toggle */}
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="w-7 h-7 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-400 absolute left-3 pointer-events-none">
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-11 py-3 rounded-full bg-[#182842] border border-[#2d4464] text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-slate-400 shadow-inner transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#182842] border-slate-600 text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-500"
                />
                <span className="font-medium text-slate-300">Remember this workstation</span>
              </label>

              <button
                type="button"
                className="text-xs font-bold text-[#00f0ff] hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Capsule Cyan-to-Purple Gradient CTA Button with Right Arrow Circle */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-1.5 pl-6 pr-1.5 rounded-full bg-gradient-to-r from-[#00d2ff] via-[#2f80ed] to-[#9b51e0] hover:from-[#00e5ff] hover:to-[#a855f7] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:shadow-[0_0_40px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-70 flex items-center justify-between group"
              >
                <span className="flex-1 text-center font-black tracking-wider">
                  {loading ? 'Authenticating...' : 'AUTHENTICATE & ENTER PORTAL →'}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#8224e3] border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md mr-0.5">
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                </div>
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="relative text-center pt-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/80" />
            </div>
            <div className="relative inline-block px-3 bg-[#030917] text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              OR
            </div>
          </div>

          {/* Sign in with SSO Button */}
          <div>
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-full border border-slate-700 hover:border-cyan-400/80 bg-[#0d1e38]/70 hover:bg-[#122648] text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Sign in with SSO</span>
            </button>
          </div>

          {/* Back to Website Link */}
          <div className="pt-2 text-center">
            <Link
              to="/"
              className="text-xs font-bold text-[#00f0ff] hover:text-cyan-300 hover:underline transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Back to College Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TEMPLATE 7: 3D Isometric Tactile Elevation (Voxel & Solid Hard Shadow)
// ============================================================================
export const IsometricElevationLoginTemplate: React.FC<LoginTemplateProps> = ({
  collegeName,
  tagline,
  campusImage,
  tenantDomain,
  CrestIcon,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  handleLogin,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-amber-50/80 font-sans text-slate-900 selection:bg-slate-950 selection:text-amber-400 overflow-x-hidden">
      {/* Left 55%: Tactile Isometric Blueprint Hero */}
      <div className="relative lg:w-[55%] min-h-[500px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-slate-900 text-white border-r-4 border-slate-900">
        {/* Campus Photo Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${campusImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-950/80" />

        {/* Top Header */}
        <div className="relative z-20 space-y-3 pt-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400 border-2 border-slate-900 text-slate-950 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#0f172a]">
            <span>🧊 Tactile Voxel Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-tight">
            Solid Tactile <span className="text-amber-400">Institutional</span> Engine
          </h1>
          <p className="text-sm sm:text-base font-bold text-slate-300 max-w-xl">
            Physical push-button precision, chunky voxel geometry, and reliable multi-faculty operations.
          </p>
        </div>

        {/* 3 Chunky 3D Voxel Blocks */}
        <div className="relative z-20 my-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-white text-slate-900 border-2 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] rounded-none">
            <div className="w-8 h-8 bg-amber-300 border border-slate-900 flex items-center justify-center font-black mb-2 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
              🧊
            </div>
            <h4 className="text-xs font-black uppercase">Tactile Matrix</h4>
            <p className="text-[11px] text-slate-600 mt-0.5 font-bold">Chunky 3D elevation.</p>
          </div>

          <div className="p-4 bg-white text-slate-900 border-2 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] rounded-none">
            <div className="w-8 h-8 bg-amber-300 border border-slate-900 flex items-center justify-center font-black mb-2 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
              ⚙️
            </div>
            <h4 className="text-xs font-black uppercase">CMS Control</h4>
            <p className="text-[11px] text-slate-600 mt-0.5 font-bold">Total departmental sync.</p>
          </div>

          <div className="p-4 bg-white text-slate-900 border-2 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] rounded-none">
            <div className="w-8 h-8 bg-amber-300 border border-slate-900 flex items-center justify-center font-black mb-2 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
              📦
            </div>
            <h4 className="text-xs font-black uppercase">Voxel Guard</h4>
            <p className="text-[11px] text-slate-600 mt-0.5 font-bold">Zero-drift stability.</p>
          </div>
        </div>

        {/* Bottom Tagline & Domain */}
        <div className="relative z-20 flex items-center justify-between pt-4 border-t-2 border-slate-700 text-xs font-black font-mono text-slate-400">
          <span>{tagline}</span>
          <span className="px-3 py-1 bg-amber-400 text-slate-950 border border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
            {tenantDomain || 'campus.localhost'}
          </span>
        </div>
      </div>

      {/* Right 45%: Chunky 3D Voxel Login Card */}
      <div className="relative lg:w-[45%] flex items-center justify-center p-6 sm:p-10 lg:p-12 z-20">
        <div className="w-full max-w-md bg-white border-3 border-slate-900 rounded-2xl p-8 sm:p-10 shadow-[10px_10px_0px_0px_#0f172a] text-slate-900 relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-amber-400 border-2 border-slate-900 text-slate-950 mb-3 shadow-[4px_4px_0px_0px_#0f172a]">
              <CrestIcon className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{collegeName}</h2>
            <span className="text-xs font-black text-amber-700 font-mono block mt-1">
              Admin Workstation Gateway
            </span>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded bg-red-100 border-2 border-red-500 text-red-900 text-xs font-black shadow-[2px_2px_0px_0px_#ef4444]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-900 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-slate-900 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-900 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg border-2 border-slate-900 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700 font-bold pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-slate-950 focus:ring-slate-900"
                />
                <span>Remember workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] active:translate-y-1.5 active:shadow-none transition-all cursor-pointer disabled:opacity-70 mt-3"
            >
              {loading ? 'Authenticating...' : '✦ Sign In to Campus Control ✦'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-slate-200 text-center">
            <Link to="/" className="text-xs font-black text-slate-900 hover:text-amber-600">
              ← Back to College Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TEMPLATE 8: 3D Kinetic Perspective & Laser Flip
// ============================================================================
export const KineticPerspectiveLoginTemplate: React.FC<LoginTemplateProps> = (props) => {
  return <SkyBlueSlantedTemplate {...props} />;
};

// ============================================================================
// TEMPLATE 9: 3D Neumorphic Soft Depth (Dual-Light Embossed)
// ============================================================================
export const NeumorphicSoftLoginTemplate: React.FC<LoginTemplateProps> = ({
  collegeName,
  tagline,
  campusImage,
  tenantDomain,
  CrestIcon,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  handleLogin,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#eef2f6] font-sans text-slate-800 selection:bg-teal-600 selection:text-white overflow-x-hidden">
      {/* Left 55%: Soft-Depth Architectural Hero */}
      <div className="relative lg:w-[55%] min-h-[500px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-[#e5ebf1] border-r border-slate-200/60">
        {/* Campus Photo Background with Soft Mask */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${campusImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#e5ebf1] via-[#eef2f6]/90 to-[#e5ebf1]/80" />

        {/* Top Header */}
        <div className="relative z-20 space-y-3 pt-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef2f6] text-teal-800 text-xs font-bold uppercase tracking-wider shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span>Sculpted Soft-Depth Core</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-800 uppercase leading-tight">
            Sculpted <span className="text-teal-700">Depth</span> &amp; Governance
          </h1>
          <p className="text-sm sm:text-base font-bold text-slate-600 max-w-xl">
            Dual-light source embossing, debossed input wells, and ergonomic management harmony.
          </p>
        </div>

        {/* 3 Neumorphic Soft Badges */}
        <div className="relative z-20 my-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#eef2f6] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]">
            <div className="w-8 h-8 rounded-xl bg-[#eef2f6] text-teal-600 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center font-black mb-2">
              🛡️
            </div>
            <h4 className="text-xs font-black text-slate-800 uppercase">Embossed Guard</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Dual-light security.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#eef2f6] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]">
            <div className="w-8 h-8 rounded-xl bg-[#eef2f6] text-teal-600 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center font-black mb-2">
              ☁️
            </div>
            <h4 className="text-xs font-black text-slate-800 uppercase">Cloud Sync</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Soft-surface sync.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#eef2f6] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]">
            <div className="w-8 h-8 rounded-xl bg-[#eef2f6] text-teal-600 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center font-black mb-2">
              🎨
            </div>
            <h4 className="text-xs font-black text-slate-800 uppercase">Soft Depth</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Tactile depression.</p>
          </div>
        </div>

        {/* Bottom Tagline & Domain */}
        <div className="relative z-20 flex items-center justify-between pt-4 border-t border-slate-300 text-xs font-bold text-slate-500">
          <span>{tagline}</span>
          <span className="px-3 py-1 rounded-full bg-[#eef2f6] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] text-teal-800">
            {tenantDomain || 'campus.localhost'}
          </span>
        </div>
      </div>

      {/* Right 45%: Sculpted Neumorphic Login Form */}
      <div className="relative lg:w-[45%] flex items-center justify-center p-6 sm:p-10 lg:p-12 z-20">
        <div className="w-full max-w-md bg-[#eef2f6] rounded-3xl p-8 sm:p-10 shadow-[16px_16px_32px_#d1d9e6,-16px_-16px_32px_#ffffff] text-slate-800 relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#eef2f6] text-teal-600 mb-3 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]">
              <CrestIcon className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{collegeName}</h2>
            <span className="text-xs font-mono font-bold text-teal-700 block mt-1">
              Admin &amp; Content Gateway
            </span>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-2xl bg-[#eef2f6] text-red-700 text-xs font-bold shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-600 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#eef2f6] text-slate-800 text-sm font-medium shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#eef2f6] text-slate-800 text-sm font-medium shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1 font-bold">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-600"
                />
                <span>Remember workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-[6px_6px_14px_rgba(13,148,136,0.35),-4px_-4px_10px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)] transition-all cursor-pointer disabled:opacity-70 mt-3"
            >
              {loading ? 'Authenticating...' : '✦ Sign In to Soft Depth Portal ✦'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-300/80 text-center">
            <Link to="/" className="text-xs font-bold text-teal-700 hover:underline">
              ← Back to College Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


