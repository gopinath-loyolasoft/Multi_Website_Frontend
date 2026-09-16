import { BookOpen } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const artsScienceConfig: TemplateConfig = {
  code: 'ARTS_SCIENCE_MODERN',
  displayName: 'Classic Arts & Science Academy',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-amber-50/30 text-slate-900 font-serif',
  bodyBgClass: 'bg-amber-50/30 font-serif',
  headerClass: 'bg-amber-50/80 border-b border-amber-200/80 backdrop-blur-md font-serif',
  nameFont: 'font-serif font-bold tracking-normal text-slate-900',
  titleFont: 'font-serif',
  badgeFont: 'font-serif italic text-emerald-700',
  defaultBadge: 'UGC Autonomous • Heritage Institution',
  crestBg: 'bg-emerald-700 shadow-emerald-800/25',
  CrestIcon: BookOpen,
  heroGradient: 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950',
  statValColor: 'text-emerald-700 font-serif',
  footerDescription: 'Dedicated to the pursuit of classical scholarship, humanities, pure sciences, and holistic ethical character.'
};
