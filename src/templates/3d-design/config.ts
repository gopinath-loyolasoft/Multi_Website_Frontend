import { GraduationCap } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const config3DDesign: TemplateConfig = {
  code: 'DESIGN_3D_MODERN',
  displayName: '3D Designed Modern Blueprint',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-white text-slate-900 font-sans',
  bodyBgClass: 'bg-slate-50 font-sans',
  headerClass: 'bg-[#134975] text-white border-b-2 border-[#e5a912] shadow-md',
  nameFont: 'font-sans font-black tracking-tight text-white uppercase text-base sm:text-lg',
  titleFont: 'font-sans font-black',
  badgeFont: 'font-sans font-bold uppercase text-amber-300 tracking-wider text-[11px]',
  defaultBadge: 'Autonomous College',
  crestBg: 'bg-[#0b3353] border border-amber-400/40 shadow-inner',
  CrestIcon: GraduationCap,
  heroGradient: 'bg-gradient-to-r from-slate-950 via-[#134975] to-slate-900',
  statValColor: 'text-[#134975] font-sans font-extrabold',
  footerDescription: 'Empowering minds with academic excellence, research leadership, dynamic values, and vibrant student life.'
};

export const salesianConfig = config3DDesign;

