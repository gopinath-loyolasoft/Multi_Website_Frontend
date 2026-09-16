import { Cpu } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const engineeringConfig: TemplateConfig = {
  code: 'ENGINEERING_MODERN',
  displayName: 'Modern Engineering & Technology',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans',
  bodyBgClass: 'bg-slate-50 font-sans',
  headerClass: 'bg-white/95 border-b border-slate-200 backdrop-blur-md',
  nameFont: 'font-sans font-black tracking-tight uppercase',
  titleFont: 'font-sans',
  badgeFont: 'font-sans font-bold text-blue-800',
  defaultBadge: 'AICTE Approved • NBA Tier-1',
  crestBg: 'bg-blue-800 shadow-blue-900/25',
  CrestIcon: Cpu,
  heroGradient: 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900',
  statValColor: 'text-blue-700 font-sans',
  footerDescription: 'Dedicated to high-impact technical education, patent innovation, engineering research, and career development.'
};
