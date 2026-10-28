import { Zap } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const config3DKinetic: TemplateConfig = {
  code: 'DESIGN_3D_KINETIC',
  displayName: '3D Kinetic Perspective & Flip',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-slate-900 text-white font-sans selection:bg-rose-500 selection:text-white',
  bodyBgClass: 'bg-slate-900 text-slate-100 font-sans',
  headerClass: 'bg-slate-900/90 backdrop-blur-xl border-b border-rose-500/30 text-white shadow-xl',
  nameFont: 'font-sans font-black tracking-tight text-white uppercase text-base sm:text-lg',
  titleFont: 'font-sans font-black',
  badgeFont: 'font-mono font-bold uppercase text-rose-400 tracking-wider text-[11px]',
  defaultBadge: 'Autonomous College',
  crestBg: 'bg-gradient-to-tr from-rose-600 to-indigo-600 border border-rose-400/50 shadow-lg',
  CrestIcon: Zap,
  heroGradient: 'bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900',
  statValColor: 'text-rose-400 font-sans font-black',
  footerDescription: 'Accelerating academic innovation, dynamic student engagement, and revolutionary future perspectives.'
};
