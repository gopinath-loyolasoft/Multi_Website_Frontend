import { Landmark } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const universityConfig: TemplateConfig = {
  code: 'UNIVERSITY_MODERN',
  displayName: 'Comprehensive University Modern',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans',
  bodyBgClass: 'bg-slate-900 font-sans',
  headerClass: 'bg-slate-950/95 border-b border-slate-800 text-white backdrop-blur-md',
  nameFont: 'font-serif font-black tracking-tight text-white',
  titleFont: 'font-serif',
  badgeFont: 'font-sans font-extrabold uppercase text-rose-400 tracking-wider text-[10px]',
  defaultBadge: 'Central Research University • Multi-Faculty',
  crestBg: 'bg-rose-900 shadow-rose-950/25',
  CrestIcon: Landmark,
  heroGradient: 'bg-gradient-to-r from-rose-950 via-slate-950 to-slate-900',
  statValColor: 'text-rose-900 font-serif',
  footerDescription: 'Dedicated to university research leadership, multi-faculty academic excellence, global discoveries, and higher knowledge.'
};
