import { Activity } from 'lucide-react';
import { TemplateConfig } from '../contracts/TemplateContracts';

export const medicalConfig: TemplateConfig = {
  code: 'MEDICAL_MODERN',
  displayName: 'Clinical Healthcare & Medical Sciences',
  pageContainerClass: 'public-website min-h-screen flex flex-col bg-teal-50/20 text-slate-900 font-sans',
  bodyBgClass: 'bg-teal-50/20 font-sans',
  headerClass: 'bg-white/95 border-b border-teal-100 backdrop-blur-md',
  nameFont: 'font-sans font-extrabold tracking-tight',
  titleFont: 'font-sans',
  badgeFont: 'font-sans font-semibold text-cyan-700',
  defaultBadge: 'NMC Recognized • 1200-Bed Teaching Hospital',
  crestBg: 'bg-cyan-700 shadow-cyan-800/25',
  CrestIcon: Activity,
  heroGradient: 'bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950',
  statValColor: 'text-teal-700 font-sans',
  footerDescription: 'Dedicated to high-standard medical training, patient care compassion, clinical research, and hospital service.'
};
