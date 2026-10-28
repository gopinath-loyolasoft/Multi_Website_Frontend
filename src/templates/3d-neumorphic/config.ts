import { Shield } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const config3DNeumorphic: TemplateConfig = {
  code: 'DESIGN_3D_NEUMORPHIC',
  displayName: '3D Neumorphic Soft Tactile Depth',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-[#eef2f6] text-slate-800 font-sans',
  bodyBgClass: 'bg-[#eef2f6] font-sans',
  headerClass: 'bg-[#eef2f6] text-slate-800 border-b border-slate-200/80 shadow-[0_10px_20px_rgba(163,177,198,0.3)]',
  nameFont: 'font-sans font-black tracking-tight text-slate-800 uppercase text-base sm:text-lg',
  titleFont: 'font-sans font-black',
  badgeFont: 'font-mono font-bold uppercase text-teal-700 tracking-wider text-[11px]',
  defaultBadge: 'Autonomous College',
  crestBg: 'bg-[#eef2f6] text-teal-600 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]',
  CrestIcon: Shield,
  heroGradient: 'bg-gradient-to-r from-slate-800 via-teal-950 to-slate-900',
  statValColor: 'text-slate-800 font-sans font-black',
  footerDescription: 'Nurturing holistic development, sculptured values, and pristine academic excellence.'
};
