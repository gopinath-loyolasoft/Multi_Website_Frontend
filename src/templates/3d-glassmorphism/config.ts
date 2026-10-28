import { Sparkles } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const config3DGlass: TemplateConfig = {
  code: 'DESIGN_3D_GLASS',
  displayName: '3D Holographic Glassmorphism',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-black',
  bodyBgClass: 'bg-slate-950 text-slate-100 font-sans',
  headerClass: 'bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl text-white',
  nameFont: 'font-sans font-black tracking-tight text-white uppercase text-base sm:text-lg drop-shadow-md',
  titleFont: 'font-sans font-black tracking-tight',
  badgeFont: 'font-mono font-bold uppercase text-cyan-400 tracking-wider text-[11px]',
  defaultBadge: 'Autonomous Institution',
  crestBg: 'bg-gradient-to-tr from-cyan-600/30 to-violet-600/30 border border-cyan-400/40 shadow-inner backdrop-blur-xl',
  CrestIcon: Sparkles,
  heroGradient: 'bg-gradient-to-tr from-slate-950 via-indigo-950/80 to-slate-900',
  statValColor: 'text-cyan-400 font-sans font-black drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]',
  footerDescription: 'Pioneering knowledge, creative research, and dynamic transformation with futuristic excellence.'
};
