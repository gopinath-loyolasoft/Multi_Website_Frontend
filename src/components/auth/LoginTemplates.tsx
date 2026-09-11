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
  ArrowRight
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans text-slate-900 selection:bg-sky-600 selection:text-white overflow-x-hidden">

      {/* Left 55%: Campus Photo + Single Slanted Divider + Blue Dot Grid */}
      <div className="relative lg:w-[55%] min-h-[480px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-slate-900 text-white">
        {/* Campus Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${campusImage})` }}
        />

        {/* Soft Blue Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-blue-950/40 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/80 via-transparent to-transparent" />

        {/* Top Headline */}
        <div className="relative z-20 space-y-3 pt-4 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md uppercase">
            WELCOME BACK
          </h1>
          <p className="text-base sm:text-lg font-medium text-sky-100 drop-shadow">
            Sign in to continue your journey
          </p>

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs font-mono font-extrabold uppercase tracking-widest text-sky-300">
            <span>KNOWLEDGE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>CHARACTER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>SERVICE</span>
          </div>
        </div>

        {/* Bottom Left College Watermark Branding */}
        <div className="relative z-20 pt-8 text-left border-t border-white/20">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            {collegeName}
          </h2>
          <p className="text-xs font-bold text-sky-200 tracking-widest uppercase">
            BUILDING BRIGHTER TOMORROW
          </p>
        </div>

        {/* Single Slanted Angle White Divider Wedge */}
        <div className="hidden lg:block absolute -right-[1px] top-0 bottom-0 w-44 pointer-events-none z-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="100,0 20,0 100,100" fill="#0284c7" opacity="0.35" />
            <polygon points="100,0 40,0 100,100" fill="#ffffff" />
          </svg>
        </div>

        {/* Decorative Blue Dots Grid Pattern near Edge */}
        <div className="hidden lg:block absolute right-24 bottom-20 z-40 pointer-events-none">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(18)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400/90 shadow-xs" />
            ))}
          </div>
        </div>
      </div>

      {/* Right 45%: Full-Height Flat White Layout (NO Floating Card) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white text-slate-900 relative z-20">

        <div className="w-full max-w-md mx-auto space-y-7 my-auto">

          {/* Top Brand Logo matching CMS360 Header */}
          <div className="flex items-center justify-center gap-3">
            {siteConfig?.settings?.logoUrl ? (
              <img
                src={siteConfig.settings.logoUrl}
                alt={collegeName}
                className="h-12 max-w-[180px] object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#0265DC] text-white flex items-center justify-center shadow-md font-black text-xl tracking-tighter">
                CMS
              </div>
            )}
            <div className="text-left">
              <span className="text-2xl font-extrabold tracking-tight text-[#0265DC] block leading-none">
                {collegeName} <span className="text-slate-900 font-bold text-lg">Portal</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block pt-0.5">
                Smart Management. Better Education.
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1 text-center pt-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Great to see you here 👋
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              You're just one step away – sign in to continue.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700 font-bold ml-2 text-base">×</button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email address / Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0265DC] focus:border-[#0265DC] shadow-2xs transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0265DC] focus:border-[#0265DC] shadow-2xs transition"
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
                  className="w-4 h-4 rounded text-[#0265DC] focus:ring-[#0265DC] border-slate-300 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-600">Keep me signed in</span>
              </label>
              <span className="text-xs font-bold text-[#0265DC] hover:underline transition cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#0265DC] hover:bg-[#0151b3] active:scale-[0.99] transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Secondary Link */}
          <div className="text-center pt-1">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-[#0265DC]">
              New here? <span className="font-bold text-[#0265DC] underline">Create an account</span>
            </Link>
          </div>

          {/* Bottom 3 Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 text-center">
            <div className="space-y-1">
              <Shield className="w-5 h-5 text-[#0265DC] mx-auto" />
              <span className="text-xs font-bold text-slate-900 block leading-tight">Secure & Reliable</span>
              <span className="text-[10px] text-slate-500 block leading-tight">Your data is safe with us</span>
            </div>

            <div className="space-y-1">
              <TrendingUp className="w-5 h-5 text-[#0265DC] mx-auto" />
              <span className="text-xs font-bold text-slate-900 block leading-tight">Smart & Simple</span>
              <span className="text-[10px] text-slate-500 block leading-tight">Designed for better experience</span>
            </div>

            <div className="space-y-1">
              <Users className="w-5 h-5 text-[#0265DC] mx-auto" />
              <span className="text-xs font-bold text-slate-900 block leading-tight">Connected Campus</span>
              <span className="text-[10px] text-slate-500 block leading-tight">Bringing students, staff & parents together</span>
            </div>
          </div>

        </div>

        {/* Footer Copyright */}
        <p className="text-[11px] text-slate-400 font-medium text-center pt-6">
          © {new Date().getFullYear()} LoyalaSoft. All Rights Reserved.
        </p>

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
