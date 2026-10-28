import { Box } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const config3DIsometric: TemplateConfig = {
  code: 'DESIGN_3D_ISOMETRIC',
  displayName: '3D Isometric Tactile Elevation',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans',
  bodyBgClass: 'bg-slate-100 font-sans',
  headerClass: 'bg-white text-slate-900 border-b-4 border-slate-900 shadow-md',
  nameFont: 'font-sans font-black tracking-tight text-slate-900 uppercase text-base sm:text-lg',
  titleFont: 'font-sans font-black',
  badgeFont: 'font-mono font-black uppercase text-amber-600 tracking-wider text-[11px]',
  defaultBadge: 'Autonomous College',
  crestBg: 'bg-amber-500 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]',
  CrestIcon: Box,
  heroGradient: 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950',
  statValColor: 'text-slate-900 font-sans font-black',
  footerDescription: 'Constructing future leaders with structured academic pathways, tactile innovation, and global excellence.'
};
