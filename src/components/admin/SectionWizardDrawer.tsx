import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  ArrowRight,
  ArrowLeft,
  Check,
  LayoutTemplate,
  FileText,
  Image as ImageIcon,
  Layers,
  Quote,
  Grid,
  Video,
  Newspaper,
  Calendar,
  Bell,
  GraduationCap,
  Building2,
  Users,
  BarChart3,
  HelpCircle,
  Mail,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Flame,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
  Download,
  Award,
  Globe,
  AlignLeft,
  AlignCenter,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Plus,
  Table,
  History,
  MessageSquare,
  FolderOpen,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { SectionSettings, PageSection } from '../../types';
import { SectionContentEditor } from './SectionContentEditor';
import { SectionRenderer } from '../dynamic/SectionRenderer';
import { Input, Select, Switch } from '../../UI_Componentes/ui';
import {
  VisualCanvasEditor,
  INITIAL_CANVAS_STARTER,
  convertSectionToCanvasBlocks,
  syncBlocksToStructuredContent,
} from '../canvas-builder';

export interface SectionTypeMeta {
  code: string;
  name: string;
  description: string;
  category: 'CONTENT' | 'MEDIA' | 'WEBSITE' | 'DYNAMIC' | 'UTILITY';
  icon: React.ElementType;
  defaultTitle?: string;
  defaultSubtitle?: string;
  badge?: string;
  tagline: string;
}

export const SECTION_METADATA_CATALOG: SectionTypeMeta[] = [
  // --- CONTENT ---
  {
    code: 'CUSTOM_CANVAS',
    name: 'Blank Canvas (Start from Scratch)',
    description: 'Start with a clean blank canvas. Direct access to Drag & Drop Studio with live block palette & properties inspector.',
    category: 'CONTENT',
    icon: Sparkles,
    defaultTitle: '',
    defaultSubtitle: '',
    badge: '⚡ Direct to Studio',
    tagline: 'Skip forms ➔ Build freely with drag-and-drop tools',
  },
  {
    code: 'TEXT',
    name: 'Text Block',
    description: 'Clean headline, lead highlight, and rich narrative paragraphs.',
    category: 'CONTENT',
    icon: FileText,
    defaultTitle: 'About Our Institution',
    defaultSubtitle: 'Learn more about our heritage and academic legacy',
    tagline: 'Centered headline + rich paragraphs',
  },
  {
    code: 'IMAGE',
    name: 'Single Image',
    description: 'High-resolution feature photo with caption and alt tag.',
    category: 'CONTENT',
    icon: ImageIcon,
    defaultTitle: 'Campus Showcase',
    defaultSubtitle: 'State-of-the-art infrastructure & learning spaces',
    tagline: '16:9 photo layout + caption',
  },
  {
    code: 'IMAGE_TEXT',
    name: 'Image + Text',
    description: 'Split-column editorial story with image, feature checklist, and CTA.',
    category: 'CONTENT',
    icon: LayoutTemplate,
    defaultTitle: 'Empowering Next-Gen Leaders',
    defaultSubtitle: 'Holistic education through research and industry exposure',
    tagline: '50/50 split photo & narrative',
  },
  {
    code: 'CARDS',
    name: 'Cards Grid',
    description: 'Structured 3-column card grid for features, highlights, and perks.',
    category: 'CONTENT',
    icon: Grid,
    defaultTitle: 'Why Choose Us',
    defaultSubtitle: 'Key institutional differentiators and academic excellence',
    tagline: '3-Column responsive feature cards',
  },
  {
    code: 'ICON_CARDS',
    name: 'Icon Cards',
    description: 'Lightweight cards paired with visual icons and concise highlights.',
    category: 'CONTENT',
    icon: Layers,
    defaultTitle: 'Core Capabilities',
    defaultSubtitle: 'Highlights that define our educational environment',
    tagline: 'Icon-driven visual highlights',
  },
  {
    code: 'QUOTE',
    name: 'Quote / Leadership Message',
    description: 'Chancellor or Dean quote with portrait photo and credentials.',
    category: 'CONTENT',
    icon: Quote,
    defaultTitle: 'Leadership & Vision',
    defaultSubtitle: 'Message from the Academic Directorate',
    tagline: 'Quote box + leader photo & title',
  },
  {
    code: 'DOCUMENTS',
    name: 'Document / PDF Downloads',
    description: 'Official circulars, syllabi, fee schedules, and downloadable PDF reports.',
    category: 'CONTENT',
    icon: FileText,
    defaultTitle: 'Downloads & Official Documents',
    defaultSubtitle: 'Access syllabus copies, circulars, application forms, and policy manuals',
    badge: 'Essential',
    tagline: 'PDF file list/grid with new-tab viewer & search',
  },
  {
    code: 'TABLE',
    name: 'Data Table / Matrix',
    description: 'Structured comparison table for fee breakdowns, seat intake, and exam schedules.',
    category: 'CONTENT',
    icon: Table,
    defaultTitle: 'Fee Structure & Seat Intake Matrix',
    defaultSubtitle: 'Transparent fee breakdown and academic admissions capacity',
    tagline: 'Responsive sortable data table',
  },
  {
    code: 'TIMELINE',
    name: 'Timeline / Milestones',
    description: 'Stepped history roadmap tracing college foundation, accreditation, and achievements.',
    category: 'CONTENT',
    icon: History,
    defaultTitle: 'Our Journey of Excellence',
    defaultSubtitle: 'Tracing the milestones that define our institutional legacy',
    tagline: 'Stepped vertical milestone journey',
  },
  {
    code: 'TABS',
    name: 'Tabs / Switchable Content',
    description: 'Multi-panel tab switcher for curriculum, laboratories, and student outcomes.',
    category: 'CONTENT',
    icon: Layers,
    defaultTitle: 'Academic Ecosystem',
    defaultSubtitle: 'Switch between curriculum, research labs, and career opportunities',
    tagline: 'Multi-panel tab switcher',
  },

  // --- MEDIA ---
  {
    code: 'GALLERY',
    name: 'Photo Gallery',
    description: 'Curated photo grid showcasing campus life, laboratories, and events.',
    category: 'MEDIA',
    icon: ImageIcon,
    defaultTitle: 'Campus Photo Gallery',
    defaultSubtitle: 'A visual journey across our world-class facilities',
    tagline: '6-Photo mosaic grid layout',
  },
  {
    code: 'VIDEO',
    name: 'Video Showcase',
    description: 'Embedded YouTube video or MP4 showcase with custom poster cover.',
    category: 'MEDIA',
    icon: Video,
    defaultTitle: 'Campus Tour & Life',
    defaultSubtitle: 'Watch our story in motion',
    tagline: 'Video player with custom poster',
  },
  {
    code: 'LOGO_GRID',
    name: 'Logo Grid / Partners',
    description: 'Logos grid for recruiters, industry partners, and accreditations.',
    category: 'MEDIA',
    icon: Grid,
    defaultTitle: 'Our Esteemed Partners',
    defaultSubtitle: 'Leading global organizations recruiting our graduates',
    tagline: 'Recruiter & partner logo matrix',
  },
  {
    code: 'MAP',
    name: 'Campus Map',
    description: 'Interactive map and directions to the college campus.',
    category: 'MEDIA',
    icon: MapPin,
    defaultTitle: 'Visit Our Campus',
    defaultSubtitle: 'Easy transit routes and physical address details',
    tagline: 'Map box + physical address card',
  },
  {
    code: 'EMBED',
    name: 'Embed / Virtual Tour',
    description: '360° virtual campus tour, Google Form, live stream, or external portal.',
    category: 'MEDIA',
    icon: Globe,
    defaultTitle: '360° Virtual Campus Tour',
    defaultSubtitle: 'Explore our state-of-the-art campus and facilities interactively',
    tagline: 'Responsive embedded portal / tour',
  },

  // --- WEBSITE ---
  {
    code: 'HERO',
    name: 'Hero Banner',
    description: 'Primary landing banner with headline, CTA buttons, and info card.',
    category: 'WEBSITE',
    icon: Flame,
    defaultTitle: 'Shaping Global Futures',
    defaultSubtitle: 'Admissions Open for Academic Year 2026-27',
    badge: 'Popular',
    tagline: 'Full banner + dual CTAs + card',
  },
  {
    code: 'HERO_SLIDER',
    name: 'Hero Slider',
    description: 'Multi-slide rotating carousel with custom headlines and buttons.',
    category: 'WEBSITE',
    icon: LayoutTemplate,
    defaultTitle: 'Campus Highlights & Innovations',
    defaultSubtitle: 'Explore our world-class campus and vibrant student community',
    tagline: 'Rotating carousel with controls',
  },
  {
    code: 'BANNERS',
    name: 'Banners Slider',
    description: 'Rotating promotional banners for timely notices and announcements.',
    category: 'WEBSITE',
    icon: LayoutTemplate,
    defaultTitle: 'Featured Announcements',
    defaultSubtitle: 'Key campus highlights and admission deadlines',
    tagline: 'Promotional banners carousel',
  },

  // --- DYNAMIC ---
  {
    code: 'TESTIMONIALS',
    name: 'Student & Alumni Stories',
    description: 'Authentic student reflections, alumni career journeys, and peer reviews.',
    category: 'DYNAMIC',
    icon: MessageSquare,
    defaultTitle: 'Voices of Our Achievers',
    defaultSubtitle: 'Read authentic reflections from graduates shaping global industries',
    tagline: 'Alumni reviews with ratings & roles',
  },
  {
    code: 'NEWS',
    name: 'News Feed',
    description: 'Dynamic campus news, research publications, and press releases.',
    category: 'DYNAMIC',
    icon: Newspaper,
    defaultTitle: 'Latest Campus News',
    defaultSubtitle: 'Discover research breakthroughs, honors, and campus updates',
    tagline: '3 News cards with date tags',
  },
  {
    code: 'EVENTS',
    name: 'Events Feed',
    description: 'Upcoming academic conferences, student fests, and workshops.',
    category: 'DYNAMIC',
    icon: Calendar,
    defaultTitle: 'Upcoming Events & Workshops',
    defaultSubtitle: 'Engage in academic symposiums and cultural fests',
    tagline: 'Event cards with calendar badges',
  },
  {
    code: 'NOTICES',
    name: 'Notice Board',
    description: 'Official circulars, exam schedules, and administrative notifications.',
    category: 'DYNAMIC',
    icon: Bell,
    defaultTitle: 'Official Notice Board',
    defaultSubtitle: 'Important announcements and circulars for students & staff',
    tagline: 'Notice rows with download pills',
  },
  {
    code: 'COURSES',
    name: 'Courses & Programs',
    description: 'Degree offerings, undergraduate & postgraduate program cards.',
    category: 'DYNAMIC',
    icon: GraduationCap,
    defaultTitle: 'Courses & Programs',
    defaultSubtitle: 'Industry-aligned degree tracks designed for professional success',
    tagline: 'Degree cards + duration badge',
  },
  {
    code: 'DEPARTMENTS',
    name: 'Departments',
    description: 'Specialized academic schools and departmental profiles.',
    category: 'DYNAMIC',
    icon: Building2,
    defaultTitle: 'Academic Departments',
    defaultSubtitle: 'Specialized schools offering cutting-edge disciplines',
    tagline: 'School cards + lab specs',
  },
  {
    code: 'FACULTY',
    name: 'Distinguished Faculty',
    description: 'Faculty directory with professor profiles, research areas, and bio.',
    category: 'DYNAMIC',
    icon: Users,
    defaultTitle: 'Distinguished Faculty',
    defaultSubtitle: 'Renowned researchers, doctorate scholars, and industry fellows',
    tagline: 'Faculty avatar profiles with titles',
  },
  {
    code: 'PLACEMENTS',
    name: 'Placement Partners (Logo Marquee)',
    description: 'Continuous right-to-left logo animation of corporate recruiters, hiring companies, and industry partners.',
    category: 'DYNAMIC',
    icon: Building2,
    defaultTitle: 'Placement Partners',
    defaultSubtitle: 'Our students are placed in leading global organizations',
    badge: 'Corporate',
    tagline: 'Infinite right-to-left marquee logo animation',
  },
  {
    code: 'COMPLIANCE',
    name: 'Mandatory Disclosures & Compliance',
    description: 'AICTE, UGC, NIRF, NAAC, anti-ragging documents and statutory compliance reports.',
    category: 'DYNAMIC',
    icon: FileText,
    defaultTitle: 'Mandatory Disclosures & Statutory Compliance',
    defaultSubtitle: 'Official statutory compliance documents and AICTE regulatory disclosures',
    badge: 'Compliance',
    tagline: 'PDF documents viewer & regulatory tables',
  },
  {
    code: 'HOSTELS',
    name: 'Hostel & Mess Facilities',
    description: 'Boys & Girls hostel capacity, room types, warden contact details, and mess menu.',
    category: 'DYNAMIC',
    icon: Building2,
    defaultTitle: 'Hostels & Residential Facilities',
    defaultSubtitle: 'Safe, comfortable, and modern campus housing for students',
    tagline: 'Hostel capacity cards + mess menu download',
  },
  {
    code: 'TRANSPORT',
    name: 'Transport & Bus Routes',
    description: 'College bus route schedules, pickup stops, bus numbers, and driver contact info.',
    category: 'DYNAMIC',
    icon: Grid,
    defaultTitle: 'Campus Transport & Bus Services',
    defaultSubtitle: 'Comprehensive fleet connecting major transit hubs to campus',
    tagline: 'Bus route numbers, timing & stop details',
  },
  {
    code: 'LIBRARY',
    name: 'Library & E-Resources',
    description: 'Digital repository, previous question papers, e-journals, and syllabus books.',
    category: 'DYNAMIC',
    icon: FolderOpen,
    defaultTitle: 'Central Library & Learning Resources',
    defaultSubtitle: 'Access e-journals, previous question papers, and academic repositories',
    tagline: 'Filterable academic resources & papers',
  },
  {
    code: 'ALUMNI',
    name: 'Alumni Network & Spotlight',
    description: 'Distinguished alumni profiles, batch years, career quotes, and current companies.',
    category: 'DYNAMIC',
    icon: Award,
    defaultTitle: 'Distinguished Alumni',
    defaultSubtitle: 'Celebrating our graduates leading industries around the globe',
    tagline: 'Alumni cards with company & designation',
  },

  // --- UTILITY ---
  {
    code: 'STATISTICS',
    name: 'Key Statistics',
    description: 'Milestone counters, placement rates, student count, and rankings.',
    category: 'UTILITY',
    icon: BarChart3,
    defaultTitle: 'Key Statistics & Milestones',
    defaultSubtitle: 'Our institutional track record and student excellence',
    tagline: '4 Milestone counter metric boxes',
  },
  {
    code: 'CTA',
    name: 'Call to Action (CTA)',
    description: 'High-conversion banner prompting applications, downloads, or contact.',
    category: 'UTILITY',
    icon: Flame,
    defaultTitle: 'Begin Your Academic Journey',
    defaultSubtitle: 'Apply now for scholarships and early-round admissions',
    tagline: 'Gradient banner with action buttons',
  },
  {
    code: 'FAQ',
    name: 'FAQ Accordion',
    description: 'Expandable frequently asked questions and admissions answers.',
    category: 'UTILITY',
    icon: HelpCircle,
    defaultTitle: 'Frequently Asked Questions',
    defaultSubtitle: 'Quick answers about admissions, fees, and campus life',
    tagline: 'Expandable Q&A accordion rows',
  },
  {
    code: 'CONTACT',
    name: 'Contact & Inquiry Form',
    description: 'Direct inquiry form, contact phone/email cards, and office hours.',
    category: 'UTILITY',
    icon: Mail,
    defaultTitle: 'Connect with Admissions',
    defaultSubtitle: 'Reach our helpdesk or visit our administrative offices',
    tagline: 'Split contact cards + inquiry form',
  },
];

const CATEGORY_TABS: { key: 'ALL' | SectionTypeMeta['category']; label: string }[] = [
  { key: 'ALL', label: 'All Types' },
  { key: 'CONTENT', label: 'Content' },
  { key: 'MEDIA', label: 'Media' },
  { key: 'WEBSITE', label: 'Website' },
  { key: 'DYNAMIC', label: 'Dynamic' },
  { key: 'UTILITY', label: 'Utility' },
];

/**
 * Visual Layout Wireframe Mockup for each Section Type
 * Renders a clean structural blueprint of the website UI directly on the card
 */
const SectionLayoutWireframe: React.FC<{ code: string; isSelected: boolean }> = ({
  code,
  isSelected,
}) => {
  const norm = code.toUpperCase();

  return (
    <div
      className={`w-full h-24 rounded-xl border p-2 flex flex-col justify-between transition overflow-hidden select-none ${
        isSelected
          ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300'
      }`}
    >
      {/* 0. CUSTOM_CANVAS / BLANK CANVAS */}
      {(norm === 'CUSTOM_CANVAS' || norm === 'CANVAS_BUILDER' || norm === 'FREE_CANVAS' || norm === 'BLANK_CANVAS') && (
        <div className="h-full bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-800 dark:to-purple-950/30 rounded-lg p-2 flex flex-col justify-between border border-purple-200 dark:border-purple-900/60 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-black uppercase text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5">
              <Sparkles className="w-2 h-2 text-purple-600" />
              <span>Blank Canvas</span>
            </span>
            <span className="text-[6px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/60">
              ⚡ Direct
            </span>
          </div>
          <div className="border border-dashed border-purple-300 dark:border-purple-700/60 rounded-md p-2 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/60 h-11 space-y-0.5">
            <div className="flex items-center gap-1 text-[7px] font-bold text-purple-700 dark:text-purple-300">
              <Plus className="w-2.5 h-2.5 text-purple-600" />
              <span>Drag & Drop Any Elements</span>
            </div>
            <div className="flex gap-1 text-[6px] text-slate-600 dark:text-slate-300">
              <span>Text</span>
              <span>•</span>
              <span>Media</span>
              <span>•</span>
              <span>Layouts</span>
            </div>
          </div>
        </div>
      )}

      {/* 1. HERO */}
      {norm === 'HERO' && (
        <div className="h-full flex flex-col justify-between bg-slate-900 rounded-lg p-2 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <div className="w-12 h-1.5 rounded-full bg-blue-500" />
            <div className="w-4 h-1.5 rounded bg-white/40" />
          </div>
          <div className="space-y-1">
            <div className="w-3/4 h-2 rounded bg-white font-bold" />
            <div className="w-1/2 h-1.5 rounded bg-white/60" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <div className="w-8 h-2.5 rounded bg-blue-600" />
              <div className="w-6 h-2.5 rounded bg-white/20" />
            </div>
            <div className="w-10 h-3 rounded bg-white/10 border border-white/20" />
          </div>
        </div>
      )}

      {/* 2. HERO_SLIDER or BANNERS */}
      {(norm === 'HERO_SLIDER' || norm === 'BANNERS') && (
        <div className="h-full flex flex-col justify-between bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-2 text-white shadow-xs relative">
          <div className="flex items-center justify-between text-[8px] text-white/50">
            <span>⟨</span>
            <div className="w-14 h-1.5 rounded bg-amber-400" />
            <span>⟩</span>
          </div>
          <div className="space-y-1 text-center flex flex-col items-center">
            <div className="w-3/5 h-2 rounded bg-white" />
            <div className="w-2/5 h-1.5 rounded bg-white/60" />
          </div>
          <div className="flex justify-center items-center gap-1">
            <span className="w-2 h-1 rounded-full bg-white" />
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="w-1 h-1 rounded-full bg-white/40" />
          </div>
        </div>
      )}

      {/* 3. TEXT */}
      {norm === 'TEXT' && (
        <div className="h-full flex flex-col justify-center gap-1.5 px-2">
          <div className="w-1/3 h-2 rounded bg-blue-600 mx-auto" />
          <div className="w-1/2 h-1.5 rounded bg-slate-300 dark:bg-slate-600 mx-auto" />
          <div className="space-y-1 pt-1">
            <div className="w-full h-1.5 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="w-5/6 h-1.5 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="w-4/6 h-1.5 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      )}

      {/* 4. IMAGE */}
      {norm === 'IMAGE' && (
        <div className="h-full flex flex-col gap-1.5">
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center border border-slate-300 dark:border-slate-600">
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="w-1/2 h-1.5 rounded bg-slate-300 dark:bg-slate-600 mx-auto" />
        </div>
      )}

      {/* 5. IMAGE_TEXT */}
      {norm === 'IMAGE_TEXT' && (
        <div className="h-full grid grid-cols-2 gap-2 items-center">
          <div className="h-full bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-1.5">
            <div className="w-10 h-1.5 rounded bg-blue-600" />
            <div className="w-full h-2 rounded bg-slate-800 dark:bg-slate-200" />
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                <div className="w-4/5 h-1 rounded bg-slate-300 dark:bg-slate-600" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                <div className="w-3/5 h-1 rounded bg-slate-300 dark:bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. CARDS */}
      {norm === 'CARDS' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 shadow-2xs space-y-1"
              >
                <div className="w-2.5 h-2.5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[7px]">
                  ★
                </div>
                <div className="w-full h-1 rounded bg-slate-700 dark:bg-slate-200" />
                <div className="w-4/5 h-1 rounded bg-slate-300 dark:bg-slate-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. ICON_CARDS */}
      {norm === 'ICON_CARDS' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg p-1 border border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-1 text-center"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
                <div className="w-full h-1 rounded bg-slate-700 dark:bg-slate-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. QUOTE */}
      {norm === 'QUOTE' && (
        <div className="h-full flex flex-col justify-between bg-blue-50/60 dark:bg-blue-950/40 rounded-lg p-2 border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-start gap-1.5">
            <span className="text-blue-600 font-serif font-black text-xs leading-none">“</span>
            <div className="space-y-1 flex-1">
              <div className="w-full h-1.5 rounded bg-slate-700 dark:bg-slate-300 italic" />
              <div className="w-4/5 h-1.5 rounded bg-slate-700 dark:bg-slate-300 italic" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shrink-0" />
            <div className="space-y-0.5">
              <div className="w-12 h-1.5 rounded bg-slate-900 dark:bg-white font-bold" />
              <div className="w-8 h-1 rounded bg-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* 9. GALLERY */}
      {norm === 'GALLERY' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center border border-slate-300 dark:border-slate-600"
              >
                <ImageIcon className="w-2 h-2 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. VIDEO */}
      {norm === 'VIDEO' && (
        <div className="h-full bg-slate-900 rounded-lg p-2 flex flex-col justify-between text-white relative">
          <div className="w-1/3 h-1 rounded bg-white/40" />
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-md">
              <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
            </div>
          </div>
          <div className="w-full h-1 rounded bg-white/20 overflow-hidden">
            <div className="w-1/3 h-full bg-red-600" />
          </div>
        </div>
      )}

      {/* 11. LOGO_GRID */}
      {norm === 'LOGO_GRID' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-3.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex items-center justify-center"
              >
                <div className="w-3 h-1 rounded bg-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. MAP */}
      {norm === 'MAP' && (
        <div className="h-full bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-900 p-1.5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-12 h-1.5 rounded bg-emerald-700 dark:bg-emerald-300 font-bold" />
            <div className="w-16 h-1 rounded bg-slate-400" />
            <div className="w-8 h-2 rounded bg-emerald-600" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-200 dark:bg-emerald-900/60 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
          </div>
        </div>
      )}

      {/* 13. NEWS */}
      {norm === 'NEWS' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 space-y-1"
              >
                <div className="h-3 bg-blue-100 dark:bg-blue-900/60 rounded" />
                <div className="w-6 h-1 rounded bg-blue-600" />
                <div className="w-full h-1 rounded bg-slate-700 dark:bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. EVENTS */}
      {norm === 'EVENTS' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 flex items-start gap-1"
              >
                <div className="w-3.5 h-4 bg-red-100 dark:bg-red-950/80 border border-red-200 text-red-600 text-[6px] font-bold rounded flex flex-col items-center justify-center leading-none shrink-0">
                  <span>15</span>
                  <span>OCT</span>
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="w-full h-1 rounded bg-slate-800 dark:bg-slate-200" />
                  <div className="w-3/4 h-1 rounded bg-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 15. NOTICES */}
      {norm === 'NOTICES' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="space-y-1">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded p-1 border border-slate-200 dark:border-slate-600 flex items-center justify-between"
              >
                <div className="flex items-center gap-1 min-w-0">
                  <Bell className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                  <div className="w-24 h-1 rounded bg-slate-700 dark:bg-slate-200 truncate" />
                </div>
                <div className="w-4 h-2 rounded bg-blue-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLACEMENTS LOGO MARQUEE WIREFRAME */}
      {(norm === 'PLACEMENTS' || norm === 'PLACEMENT_PARTNERS' || norm === 'PLACEMENT_COMPANIES') && (
        <div className="h-full flex flex-col justify-between bg-slate-900 rounded-lg p-2 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <div className="w-14 h-1.5 rounded bg-amber-400" />
            <div className="w-8 h-1.5 rounded bg-white/40" />
          </div>
          <div className="flex items-center gap-1 overflow-hidden py-1 border-y border-white/10">
            <span className="text-[7px] text-amber-400 font-bold shrink-0">← ←</span>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-8 bg-white/10 rounded flex items-center justify-center shrink-0 border border-white/20">
                <Building2 className="w-2 h-2 text-white/70" />
              </div>
            ))}
          </div>
          <div className="text-[6px] text-white/50 text-center">Right-to-Left Infinite Logo Marquee</div>
        </div>
      )}

      {/* 16. COURSES */}
      {norm === 'COURSES' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 space-y-1"
              >
                <div className="w-8 h-1 rounded bg-indigo-600 font-bold" />
                <div className="w-full h-1.5 rounded bg-slate-800 dark:bg-slate-200" />
                <div className="w-10 h-1.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-indigo-700 text-[6px]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 17. DEPARTMENTS */}
      {norm === 'DEPARTMENTS' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded-lg p-1.5 border border-slate-200 dark:border-slate-600 flex flex-col justify-between"
              >
                <Building2 className="w-2.5 h-2.5 text-blue-600" />
                <div className="w-full h-1.5 rounded bg-slate-800 dark:bg-slate-200" />
                <div className="w-8 h-1 rounded bg-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 18. FACULTY */}
      {norm === 'FACULTY' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 flex flex-col items-center gap-0.5 text-center"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="w-full h-1 rounded bg-slate-800 dark:bg-slate-200" />
                <div className="w-3/4 h-0.5 rounded bg-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 19. STATISTICS */}
      {(norm === 'STATISTICS' || norm === 'STATS') && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-4 gap-1">
            {['98%', '15k+', '#1', '350+'].map((val, idx) => (
              <div
                key={idx}
                className="bg-blue-50 dark:bg-blue-950/60 rounded p-1 border border-blue-200 dark:border-blue-900/60 flex flex-col items-center justify-center"
              >
                <span className="text-[9px] font-black text-blue-700 dark:text-blue-300 leading-none">
                  {val}
                </span>
                <div className="w-3 h-0.5 rounded bg-slate-400 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 20. CTA */}
      {(norm === 'CTA' || norm === 'CALL_TO_ACTION') && (
        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-2 flex flex-col justify-between text-white shadow-xs">
          <div className="w-10 h-1.5 rounded bg-white/50" />
          <div className="space-y-1">
            <div className="w-3/4 h-2 rounded bg-white font-bold" />
            <div className="w-1/2 h-1 rounded bg-white/70" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-10 h-2.5 rounded bg-white" />
            <div className="w-8 h-2.5 rounded bg-white/20" />
          </div>
        </div>
      )}

      {/* 21. FAQ */}
      {norm === 'FAQ' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded px-1.5 py-1 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-[7px]"
              >
                <div className="w-24 h-1 rounded bg-slate-800 dark:bg-slate-200" />
                <span className="text-slate-400">⌄</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 22. CONTACT */}
      {norm === 'CONTACT' && (
        <div className="h-full grid grid-cols-2 gap-1.5 items-center">
          <div className="bg-blue-50 dark:bg-blue-950/50 rounded p-1.5 border border-blue-100 dark:border-blue-900/50 space-y-1">
            <div className="w-12 h-1.5 rounded bg-blue-600 font-bold" />
            <div className="w-full h-1 rounded bg-slate-400" />
            <div className="w-3/4 h-1 rounded bg-slate-400" />
          </div>
          <div className="space-y-1">
            <div className="w-full h-2 rounded bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
            <div className="w-full h-2 rounded bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
            <div className="w-10 h-2.5 rounded bg-blue-600 ml-auto" />
          </div>
        </div>
      )}

      {/* 23. DOCUMENTS */}
      {(norm === 'DOCUMENTS' || norm === 'DOCUMENT_DOWNLOADS' || norm === 'CIRCULARS' || norm === 'DOWNLOADS') && (
        <div className="h-full flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <div className="w-1/3 h-1.5 rounded bg-blue-600" />
            <div className="w-12 h-1.5 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-1">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded p-1 border border-slate-200 dark:border-slate-600 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-3.5 h-3.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center text-[6px] font-black shrink-0">
                    PDF
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="w-16 h-1 rounded bg-slate-800 dark:bg-slate-200 truncate" />
                    <div className="w-10 h-0.5 rounded bg-slate-400" />
                  </div>
                </div>
                <div className="w-3.5 h-3.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 text-[7px]">
                  ↗
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 24. TABLE */}
      {(norm === 'TABLE' || norm === 'DATA_TABLE' || norm === 'FEES_TABLE') && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="border border-slate-200 dark:border-slate-600 rounded overflow-hidden">
            <div className="bg-slate-800 dark:bg-slate-900 grid grid-cols-3 gap-0.5 p-1 text-white">
              <div className="w-full h-1 rounded bg-white/70" />
              <div className="w-full h-1 rounded bg-white/70" />
              <div className="w-full h-1 rounded bg-white/70" />
            </div>
            <div className="bg-white dark:bg-slate-700 grid grid-cols-3 gap-0.5 p-1 border-b border-slate-100 dark:border-slate-600">
              <div className="w-full h-1 rounded bg-slate-600 dark:bg-slate-300" />
              <div className="w-full h-1 rounded bg-slate-400" />
              <div className="w-full h-1 rounded bg-slate-400" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 grid grid-cols-3 gap-0.5 p-1">
              <div className="w-full h-1 rounded bg-slate-600 dark:bg-slate-300" />
              <div className="w-full h-1 rounded bg-slate-400" />
              <div className="w-full h-1 rounded bg-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* 25. TIMELINE */}
      {(norm === 'TIMELINE' || norm === 'MILESTONES' || norm === 'HISTORY') && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="relative flex items-center justify-between px-2 pt-1">
            <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-0.5 bg-blue-200 dark:bg-blue-800" />
            {[2010, 2018, 2026].map((yr) => (
              <div key={yr} className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[5px] font-bold ring-2 ring-white dark:ring-slate-900">
                  ●
                </div>
                <span className="text-[6px] font-bold text-slate-700 dark:text-slate-300">{yr}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 26. TABS */}
      {norm === 'TABS' && (
        <div className="h-full flex flex-col justify-between">
          <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700 pb-1">
            <div className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[6px] font-bold">Overview</div>
            <div className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[6px]">Curriculum</div>
            <div className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[6px]">Careers</div>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded p-1.5 border border-slate-200 dark:border-slate-600 space-y-1">
            <div className="w-1/2 h-1.5 rounded bg-slate-800 dark:bg-slate-200" />
            <div className="w-full h-1 rounded bg-slate-300 dark:bg-slate-500" />
            <div className="w-3/4 h-1 rounded bg-slate-300 dark:bg-slate-500" />
          </div>
        </div>
      )}

      {/* 27. TESTIMONIALS */}
      {norm === 'TESTIMONIALS' && (
        <div className="h-full flex flex-col justify-between">
          <div className="w-1/3 h-1.5 rounded bg-blue-600 mx-auto" />
          <div className="grid grid-cols-2 gap-1.5">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-700 rounded p-1.5 border border-slate-200 dark:border-slate-600 space-y-1 shadow-2xs"
              >
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div className="text-[6px] text-amber-500 font-bold">★★★★★</div>
                </div>
                <div className="w-full h-1 rounded bg-slate-700 dark:bg-slate-300" />
                <div className="w-2/3 h-0.5 rounded bg-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 28. EMBED */}
      {norm === 'EMBED' && (
        <div className="h-full bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between text-white border border-slate-700">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-400" />
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
            </div>
            <div className="w-16 h-1 rounded bg-white/20" />
          </div>
          <div className="flex flex-col items-center justify-center py-1">
            <Globe className="w-4 h-4 text-blue-400 mb-0.5 animate-pulse" />
            <span className="text-[6px] text-slate-300">360° Virtual Tour / Portal</span>
          </div>
          <div className="w-full h-1 rounded bg-blue-600/40" />
        </div>
      )}
    </div>
  );
};

export const DEFAULT_SETTINGS_BY_TYPE: Record<string, SectionSettings> = {
  CUSTOM_CANVAS: { columns: 1, alignment: 'left', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  HERO: { columns: 1, alignment: 'center', background: 'dark', cardVariant: 'standard', spacing: 'large', containerWidth: 'full' },
  HERO_SLIDER: { columns: 1, alignment: 'center', background: 'dark', cardVariant: 'standard', spacing: 'large', containerWidth: 'full' },
  BANNERS: { columns: 1, alignment: 'center', background: 'dark', cardVariant: 'standard', spacing: 'normal', containerWidth: 'full' },
  TEXT: { columns: 1, alignment: 'left', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  IMAGE: { columns: 1, alignment: 'center', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  IMAGE_TEXT: { columns: 2, alignment: 'left', background: 'light', cardVariant: 'minimal', spacing: 'normal', containerWidth: 'standard' },
  CARDS: { columns: 3, alignment: 'center', background: 'light', cardVariant: 'elevated', spacing: 'normal', containerWidth: 'standard' },
  ICON_CARDS: { columns: 3, alignment: 'center', background: 'light', cardVariant: 'bordered', spacing: 'normal', containerWidth: 'standard' },
  STATISTICS: { columns: 4, alignment: 'center', background: 'gradient', cardVariant: 'elevated', spacing: 'normal', containerWidth: 'standard' },
  STATS: { columns: 4, alignment: 'center', background: 'gradient', cardVariant: 'elevated', spacing: 'normal', containerWidth: 'standard' },
  QUOTE: { columns: 1, alignment: 'center', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'narrow' },
  GALLERY: { columns: 3, alignment: 'center', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  VIDEO: { columns: 1, alignment: 'center', background: 'dark', cardVariant: 'standard', spacing: 'large', containerWidth: 'standard' },
  LOGO_GRID: { columns: 4, alignment: 'center', background: 'light', cardVariant: 'minimal', spacing: 'normal', containerWidth: 'standard' },
  MAP: { columns: 1, alignment: 'center', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  NEWS: { columns: 3, alignment: 'left', background: 'light', cardVariant: 'elevated', spacing: 'normal', containerWidth: 'standard' },
  EVENTS: { columns: 3, alignment: 'left', background: 'light', cardVariant: 'bordered', spacing: 'normal', containerWidth: 'standard' },
  NOTICES: { columns: 2, alignment: 'left', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  COURSES: { columns: 3, alignment: 'left', background: 'light', cardVariant: 'elevated', spacing: 'normal', containerWidth: 'standard' },
  DEPARTMENTS: { columns: 3, alignment: 'left', background: 'light', cardVariant: 'elevated', spacing: 'normal', containerWidth: 'standard' },
  FACULTY: { columns: 4, alignment: 'center', background: 'light', cardVariant: 'elevated', spacing: 'normal', containerWidth: 'standard' },
  CTA: { columns: 1, alignment: 'center', background: 'gradient', cardVariant: 'elevated', spacing: 'large', containerWidth: 'standard' },
  CALL_TO_ACTION: { columns: 1, alignment: 'center', background: 'gradient', cardVariant: 'elevated', spacing: 'large', containerWidth: 'standard' },
  FAQ: { columns: 1, alignment: 'left', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'narrow' },
  CONTACT: { columns: 2, alignment: 'left', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  DOCUMENTS: { columns: 1, alignment: 'left', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  DOCUMENT_DOWNLOADS: { columns: 1, alignment: 'left', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  TABLE: { columns: 1, alignment: 'left', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  TIMELINE: { columns: 1, alignment: 'center', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  TABS: { columns: 1, alignment: 'center', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
  TESTIMONIALS: { columns: 3, alignment: 'center', background: 'light', cardVariant: 'elevated', spacing: 'normal', containerWidth: 'standard' },
  EMBED: { columns: 1, alignment: 'center', background: 'light', cardVariant: 'standard', spacing: 'normal', containerWidth: 'standard' },
};

export const DEFAULT_CONTENT_BY_TYPE: Record<string, Record<string, any>> = {
  CUSTOM_CANVAS: {
    canvasVersion: '1.0',
    containerWidth: 'standard',
    blocks: [],
  },
  DOCUMENTS: {
    badge: 'Official Downloads & Circulars',
    layout: 'list',
    showSearch: true,
    showCategories: true,
    documents: [
      {
        title: 'Academic Regulation & Syllabus Curriculum (2026-27)',
        description: 'Comprehensive course structure, credit distribution, and evaluation scheme for all undergraduate programs.',
        category: 'Syllabus',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        publishDate: 'Sep 2026',
      },
      {
        title: 'End-Semester Examination Schedule & Guidelines',
        description: 'Official hall ticket instructions, exam timetable, and central valuation protocols.',
        category: 'Examination',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'PDF',
        fileSize: '1.1 MB',
        publishDate: 'Aug 2026',
      },
      {
        title: 'Scholarship & Financial Aid Application Form',
        description: 'Prescribed proforma for merit-cum-means and sports quota financial aid grants.',
        category: 'Forms',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'PDF',
        fileSize: '540 KB',
        publishDate: 'Jul 2026',
      },
    ],
  },
  TABLE: {
    badge: 'Fee Structure 2026-27',
    striped: true,
    searchable: true,
    columns: [
      { key: 'col1', label: 'Program / Degree', align: 'left' },
      { key: 'col2', label: 'Duration', align: 'left' },
      { key: 'col3', label: 'Approved Intake', align: 'center' },
      { key: 'col4', label: 'Annual Tuition (INR)', align: 'right' },
    ],
    rows: [
      { col1: 'B.Tech Computer Science & Engineering', col2: '4 Years', col3: '180 Seats', col4: '₹1,25,000' },
      { col1: 'B.Tech Artificial Intelligence & Data Science', col2: '4 Years', col3: '120 Seats', col4: '₹1,20,000' },
      { col1: 'B.Tech Electronics & Communication', col2: '4 Years', col3: '120 Seats', col4: '₹1,10,000' },
      { col1: 'M.Tech Applied Cyber Security', col2: '2 Years', col3: '30 Seats', col4: '₹85,000' },
    ],
  },
  TIMELINE: {
    badge: 'Heritage & Milestones',
    items: [
      { year: '1996', title: 'Establishment of the Institution', description: 'Founded with a vision to deliver world-class technical education and ethical leadership.', badge: 'Foundation' },
      { year: '2008', title: 'Autonomous Status & Research Hub', description: 'Granted autonomous academic status with multi-crore national research laboratory grants.', badge: 'Autonomy' },
      { year: '2018', title: 'NAAC A++ Grade Accreditation', description: 'Recognized in the top tier of national institutions with highest quality benchmarks.', badge: 'Excellence' },
      { year: '2026', title: 'Global Innovation & Incubation Center', description: 'Inauguration of international collaborative incubator supporting student startups.', badge: 'Innovation' },
    ],
  },
  TABS: {
    badge: 'Academic Ecosystem',
    tabs: [
      {
        title: 'Curriculum & Pedagogy',
        badge: 'Industry-Aligned',
        content: 'Our dynamic curriculum is engineered in consultation with top technology firms, emphasizing hands-on laboratory problem solving, semester internships, and interdisciplinary electives.',
        buttonText: 'Explore Degree Programs',
        buttonUrl: '/courses',
      },
      {
        title: 'Research & Labs',
        badge: '40+ Advanced Labs',
        content: 'Students conduct research in state-of-the-art facilities including Robotics, Cyber Security, Clean Energy, and Bio-Medical Imaging centers equipped with high-performance computing clusters.',
        buttonText: 'View Departments',
        buttonUrl: '/departments',
      },
      {
        title: 'Career Placements',
        badge: 'Top Recruiters',
        content: 'Our dedicated training and placement cell facilitates campus interviews with over 350+ multinational corporations, providing intensive soft skills, coding bootcamps, and executive coaching.',
        buttonText: 'Contact Admissions',
        buttonUrl: '/contact',
      },
    ],
  },
  TESTIMONIALS: {
    badge: 'Alumni Reflections',
    testimonials: [
      {
        name: 'Aishwarya Ramesh',
        degree: 'B.Tech CSE',
        batch: 'Class of 2024',
        role: 'Software Engineer',
        company: 'Microsoft',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        quote: 'The collaborative research environment and constant encouragement from faculty gave me the confidence to excel in competitive hackathons and land my dream career.',
        rating: 5,
      },
      {
        name: 'Karthik Subramanian',
        degree: 'B.Tech ECE',
        batch: 'Class of 2023',
        role: 'Hardware Systems Engineer',
        company: 'Qualcomm',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        quote: 'The hands-on laboratory training and mentor support transformed my understanding of embedded systems. It was the defining chapter of my technical journey.',
        rating: 5,
      },
    ],
  },
  EMBED: {
    badge: 'Interactive Experience',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    heightPx: 480,
    allowFullscreen: true,
    caption: 'Explore our state-of-the-art campus and facilities in 360° interactive view.',
  },
  TEXT: {
    leadText: 'Dedicated to nurturing visionary thinkers, innovative engineers, and compassionate leaders since 1985.',
    bodyHtml: '<p>Our institution is recognized internationally for groundbreaking research, distinguished faculty, and an empowering campus culture.</p><p>We provide state-of-the-art laboratory facilities, global exchange partnerships, and holistic career mentorship to prepare students for global leadership.</p>',
    authorName: 'Office of Academic Affairs',
    authorRole: 'Institutional Charter',
  },
  IMAGE: {
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
    caption: 'Main Academic Quadrangle & Innovation Atrium Complex',
    altText: 'Campus architectural view and student commons',
    fullWidth: false,
  },
  IMAGE_TEXT: {
    badge: 'Academic Distinction',
    heading: 'Empowering Tomorrow’s Innovators & Global Leaders',
    description: 'Our curriculum blends foundational theory with immersive, hands-on lab experiences, industry mentorship, and cutting-edge research.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    points: [
      'Top 1% ranked nationally for career placements and corporate recruitment',
      'Over 40+ specialized research laboratories and incubation centers',
      'Distinguished doctorate faculty with international credentials',
    ],
    ctaText: 'Explore Degree Programs',
    ctaLink: '/courses',
  },
  CARDS: {
    items: [
      { title: 'Global Exchange Programs', desc: 'Semester abroad partnerships with prestigious universities across Europe, North America, and Asia.', icon: 'Globe' },
      { title: 'Research & Incubation Hubs', desc: 'Cutting-edge innovation centers funded by national research grants for student-led startups and patents.', icon: 'Lightbulb' },
      { title: 'Industry-Aligned Curriculum', desc: 'Hands-on project-based pedagogy designed in collaboration with corporate tech advisory boards.', icon: 'Award' },
    ],
  },
  ICON_CARDS: {
    items: [
      { title: 'Global Recognition', description: 'Accredited with highest academic excellence grade by national education governance councils.', icon: 'Globe2' },
      { title: 'Research First Pedagogy', description: 'Over $15M in active annual research funding across AI, clean energy, and biomedical labs.', icon: 'Lightbulb' },
      { title: 'Career Acceleration Cell', description: 'Dedicated placement cell providing personalized interview coaching, hackathons, and corporate connect.', icon: 'Compass' },
    ],
  },
  QUOTE: {
    quoteText: 'Education is not merely the acquisition of facts, but the training of the mind to think critically, innovate fearlessly, and serve humanity with integrity.',
    authorName: 'Dr. Arthur Sterling, Ph.D.',
    designation: 'Chancellor & Chief Academic Officer',
    authorImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    subText: 'Office of Academic Affairs & Governance',
  },
  GALLERY: {
    images: [
      { title: 'Central Library & Research Commons', imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80' },
      { title: 'Advanced Robotics & AI Lab', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
      { title: 'Campus Amphitheatre & Sports Arena', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' },
      { title: 'Student Innovation & Design Studio', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  VIDEO: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    caption: 'Official 2026 Campus Virtual Tour & Academic Experience',
  },
  LOGO_GRID: {
    logos: [
      { name: 'Google', url: 'https://google.com' },
      { name: 'Microsoft', url: 'https://microsoft.com' },
      { name: 'Amazon', url: 'https://amazon.com' },
      { name: 'IBM', url: 'https://ibm.com' },
      { name: 'Intel', url: 'https://intel.com' },
      { name: 'Infosys', url: 'https://infosys.com' },
    ],
  },
  MAP: {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0016!2d80.1!3d13.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzAwLjAiTiA4MMKwMDYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000',
    address: 'University Main Campus, Academic Expressway, Knowledge City - 600100',
    height: 420,
  },
  HERO: {
    heading: 'Shaping Global Futures Through Academic Excellence',
    description: 'Admissions are open for the academic year 2026-27. Explore our industry-aligned degrees, cutting-edge research facilities, and merit scholarships.',
    badge: 'Admissions 2026-27 Open',
    ctaText: 'Explore Programs',
    ctaLink: '/courses',
    secondaryCtaText: 'Apply Online',
    secondaryCtaLink: '/admissions',
    showRightCard: true,
    cardTitle: 'Campus Highlights',
    cardSubtitle: 'University Record',
    cardBadge: '2026 Record',
    cardItems: [
      { title: 'Top 1% Ranked Institution', desc: 'Accredited with highest academic grade' },
      { title: '100% Placement Support', desc: 'Over 350+ global corporate partners' },
    ],
    pillars: ['NAAC A++ Grade Accredited', '350+ Global Recruiters', '$15M Research Funding'],
  },
  HERO_SLIDER: {
    autoplaySpeed: 6000,
    showArrows: true,
    showDots: true,
    slides: [
      { headline: 'Pioneering Next-Generation Education', caption: 'Empowering students with hands-on research and world-class laboratory infrastructure.', buttonText: 'Explore Degree Programs', buttonUrl: '/courses' },
      { headline: 'Innovate, Collaborate, Excel', caption: 'Join a vibrant campus community of 15,000+ forward-thinking scholars.', buttonText: 'Campus Virtual Tour', buttonUrl: '/about' },
    ],
  },
  BANNERS: {
    autoplaySpeed: 6000,
    showArrows: true,
    showDots: true,
    slides: [
      { headline: 'Merit Scholarship Applications Open', caption: 'Up to 100% tuition coverage for top percentile rank holders in entrance exams.', buttonText: 'Apply For Scholarship', buttonUrl: '/admissions' },
    ],
  },
  NEWS: {
    limit: 3,
    heading: 'Latest Campus News & Research Highlights',
    subheading: 'Discover recent research breakthroughs, student honors, and campus announcements',
    badge: 'Campus Bulletin',
  },
  EVENTS: {
    limit: 3,
    title: 'Upcoming Events & Symposiums',
    subtitle: 'Participate in international conferences, technical hackathons, and cultural fests',
  },
  NOTICES: {
    items: [
      { title: 'End Semester Examination Schedule & Hall Ticket Circular', category: 'EXAMINATION', publishDate: '2026-09-15', isImportant: true },
      { title: 'National Science & Innovation Symposium Registration', category: 'ACADEMIC', publishDate: '2026-09-10', isImportant: false },
      { title: 'Annual Sports Meet & Inter-College Championship Guidelines', category: 'STUDENT AFFAIRS', publishDate: '2026-09-05', isImportant: false },
    ],
  },
  COURSES: {
    limit: 4,
    courses: [
      { name: 'B.Tech in Artificial Intelligence & Data Science', degreeLevel: 'Undergraduate', duration: '4 Years', department: 'School of Computing', description: 'Comprehensive curriculum spanning machine learning, neural networks, deep learning, and cloud computing.' },
      { name: 'B.Tech in Computer Science & Engineering', degreeLevel: 'Undergraduate', duration: '4 Years', department: 'School of Computing', description: 'Core software engineering, algorithms, distributed systems, and cyber security tracks.' },
      { name: 'M.Tech in Autonomous Systems & Robotics', degreeLevel: 'Postgraduate', duration: '2 Years', department: 'School of Engineering', description: 'Advanced robotics kinematics, embedded AI, autonomous navigation, and IoT sensor integration.' },
      { name: 'Master of Business Administration (MBA)', degreeLevel: 'Postgraduate', duration: '2 Years', department: 'School of Management', description: 'Strategic leadership, business analytics, fintech, and global supply chain management.' },
    ],
  },
  DEPARTMENTS: {
    departments: [
      { name: 'Department of Computer Science & AI', code: 'CS-AI', headOfDepartment: 'Dr. Elena Rostova', description: 'State-of-the-art supercomputing labs, high-throughput GPU clusters, and machine learning research groups.' },
      { name: 'Department of Electronics & Communication', code: 'ECE', headOfDepartment: 'Dr. Marcus Vance', description: 'VLSI chip design suites, RF communications, antenna testbeds, and signal processing laboratories.' },
      { name: 'Department of Mechanical & Aerospace Engineering', code: 'MAE', headOfDepartment: 'Dr. Rajesh Sundaram', description: 'Wind tunnels, advanced CAD/CAM manufacturing suites, robotics fabrication, and thermal dynamics labs.' },
    ],
  },
  FACULTY: {
    faculty: [
      { name: 'Dr. Sarah Jenkins, Ph.D.', designation: 'Professor & Dean of Engineering', qualification: 'Ph.D. in Computer Systems, MIT', specialization: 'Distributed Systems & Quantum Computing' },
      { name: 'Dr. Vikramaditya Sharma, Ph.D.', designation: 'Head of Department, AI & Data Science', qualification: 'Ph.D. in Machine Learning, Stanford', specialization: 'Deep Neural Architectures & NLP' },
      { name: 'Dr. Claire Laurent, Ph.D.', designation: 'Associate Professor, Robotics', qualification: 'Ph.D. in Mechatronics, ETH Zurich', specialization: 'Autonomous Drone Systems & Computer Vision' },
      { name: 'Dr. Anand Kumar, Ph.D.', designation: 'Professor of Management & Dean', qualification: 'Ph.D. in Quantitative Finance, Harvard', specialization: 'Fintech Strategies & Corporate Governance' },
    ],
  },
  STATISTICS: {
    items: [
      { label: 'Campus Placement Rate', value: '98', suffix: '%', iconName: 'TrendingUp' },
      { label: 'Enrolled Scholars & Students', value: '15,000', suffix: '+', iconName: 'Users' },
      { label: 'National Institutional Ranking', value: '1', prefix: '#', iconName: 'Award' },
      { label: 'Global Recruiting Partners', value: '350', suffix: '+', iconName: 'Briefcase' },
    ],
  },
  STATS: {
    items: [
      { label: 'Campus Placement Rate', value: '98', suffix: '%', iconName: 'TrendingUp' },
      { label: 'Enrolled Scholars & Students', value: '15,000', suffix: '+', iconName: 'Users' },
      { label: 'National Institutional Ranking', value: '1', prefix: '#', iconName: 'Award' },
      { label: 'Global Recruiting Partners', value: '350', suffix: '+', iconName: 'Briefcase' },
    ],
  },
  CTA: {
    badge: 'Admissions Open 2026-27',
    headline: 'Ready to Begin Your Transformative Academic Journey?',
    subheadline: 'Applications are currently open for all undergraduate, postgraduate, and research fellowship tracks. Explore merit scholarships and begin your enrollment today.',
    buttonText: 'Start Online Application',
    buttonUrl: '/admissions',
    secondaryButtonText: 'Download 2026 Prospectus',
    secondaryButtonUrl: '/prospectus.pdf',
  },
  CALL_TO_ACTION: {
    badge: 'Admissions Open 2026-27',
    headline: 'Ready to Begin Your Transformative Academic Journey?',
    subheadline: 'Applications are currently open for all undergraduate, postgraduate, and research fellowship tracks. Explore merit scholarships and begin your enrollment today.',
    buttonText: 'Start Online Application',
    buttonUrl: '/admissions',
    secondaryButtonText: 'Download 2026 Prospectus',
    secondaryButtonUrl: '/prospectus.pdf',
  },
  FAQ: {
    items: [
      { question: 'What are the primary eligibility criteria for admissions?', answer: 'Undergraduate applicants must have completed higher secondary (10+2) with minimum 60% in science/mathematics. Postgraduate applicants require a relevant Bachelor degree with qualifying entrance scores.' },
      { question: 'Are scholarships and fee concessions available?', answer: 'Yes, we offer up to 100% tuition waivers for top entrance test rankers, national sports champions, and merit-cum-means eligible applicants.' },
      { question: 'How can I schedule a guided physical campus visit?', answer: 'You can book an in-person campus walking tour through our admissions desk or by submitting the contact inquiry form below.' },
      { question: 'What is the hostel accommodation and dining facility like?', answer: 'We offer air-conditioned single, double, and triple sharing rooms with high-speed Wi-Fi, 24/7 security, multi-cuisine cafeterias, and on-campus medical care.' },
    ],
  },
  CONTACT: {
    phone: '+91 (044) 2890-5000',
    email: 'admissions@university.edu',
    address: 'University Main Campus, Academic Expressway, Knowledge City - 600100',
    showForm: true,
  },
};

export interface SectionWizardDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  editingSection?: PageSection | null;
  onClose: () => void;
  onSave: (data: {
    sectionType: string;
    title: string;
    subtitle: string;
    content: Record<string, any>;
    settings: SectionSettings;
    sortOrder: number;
    isVisible: boolean;
  }) => Promise<void>;
  isSaving: boolean;
  serverError?: string | null;
  defaultSortOrder?: number;
  availablePages?: { id: string | number; title: string; slug: string }[];
  currentPageId?: string | number;
  targetPageTitle?: string;
}

export interface ExistingSectionEntry {
  pageId: string | number;
  pageTitle: string;
  pageSlug: string;
  section: PageSection;
}

export const SectionWizardDrawer: React.FC<SectionWizardDrawerProps> = ({
  isOpen,
  mode,
  editingSection,
  onClose,
  onSave,
  isSaving,
  serverError,
  defaultSortOrder = 1,
  availablePages = [],
  currentPageId,
  targetPageTitle,
}) => {
  // Wizard Step: 1 (Type), 2 (Appearance), 3 (Content), 4 (Drag & Drop Studio), 5 (Live Preview)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(mode === 'edit' ? 3 : 1);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'ALL' | SectionTypeMeta['category']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Section State
  const [selectedType, setSelectedType] = useState<string>('TEXT');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState<Record<string, any>>({});
  const [settings, setSettings] = useState<SectionSettings>(
    DEFAULT_SETTINGS_BY_TYPE.TEXT || {
      columns: 1,
      cardVariant: 'standard',
      alignment: 'left',
      background: 'light',
      spacing: 'normal',
      containerWidth: 'standard',
    }
  );
  const [sortOrder, setSortOrder] = useState<number>(defaultSortOrder);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Initialize or reset form state when opening or changing section
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && editingSection) {
      const type = editingSection.sectionType || 'TEXT';
      setSelectedType(type);
      setTitle(editingSection.title || '');
      setSubtitle(editingSection.subtitle || '');
      setContent(editingSection.content || {});
      setSettings(
        editingSection.settings ||
          DEFAULT_SETTINGS_BY_TYPE[type.toUpperCase()] || {
            columns: 3,
            cardVariant: 'standard',
            alignment: 'center',
            background: 'light',
            spacing: 'normal',
            containerWidth: 'standard',
          }
      );
      setSortOrder(Number(editingSection.sortOrder) || defaultSortOrder);
      setIsVisible(editingSection.isVisible !== false);
      setCurrentStep(3); // In edit mode, start on content directly
      setShowAdvanced(false);
      setValidationError(null);
    } else {
      setSelectedType('TEXT');
      setTitle('About Our Institution');
      setSubtitle('Learn more about our heritage and academic legacy');
      setContent(JSON.parse(JSON.stringify(DEFAULT_CONTENT_BY_TYPE.TEXT || {})));
      setSettings(
        DEFAULT_SETTINGS_BY_TYPE.TEXT || {
          columns: 1,
          cardVariant: 'standard',
          alignment: 'left',
          background: 'light',
          spacing: 'normal',
          containerWidth: 'standard',
        }
      );
      setSortOrder(defaultSortOrder);
      setIsVisible(true);
      setCurrentStep(1); // In create mode, start on Step 1
      setShowAdvanced(false);
      setValidationError(null);
      setSearchQuery('');
      setActiveTab('ALL');
    }
  }, [isOpen, mode, editingSection, defaultSortOrder]);

  // Handle section type selection
  const handleSelectType = (typeMeta: SectionTypeMeta) => {
    setSelectedType(typeMeta.code);

    // If Blank Canvas is selected in create mode, jump DIRECTLY to Step 4 Studio
    if (typeMeta.code === 'CUSTOM_CANVAS' && mode === 'create') {
      setTitle('');
      setSubtitle('');
      setContent({
        canvasVersion: '1.0',
        containerWidth: 'standard',
        blocks: [],
      });
      setSettings(
        DEFAULT_SETTINGS_BY_TYPE.CUSTOM_CANVAS || {
          columns: 1,
          cardVariant: 'standard',
          alignment: 'left',
          background: 'light',
          spacing: 'normal',
          containerWidth: 'standard',
        }
      );
      setCurrentStep(4); // Instant fast-track directly to Step 4 Studio!
      return;
    }

    // If in create mode for pre-built template sections, auto-populate sensible defaults & optimal layout settings
    if (mode === 'create') {
      setTitle(typeMeta.defaultTitle || '');
      setSubtitle(typeMeta.defaultSubtitle || '');
      const starter = DEFAULT_CONTENT_BY_TYPE[typeMeta.code.toUpperCase()] || {};
      setContent(JSON.parse(JSON.stringify(starter)));
      const optimal = DEFAULT_SETTINGS_BY_TYPE[typeMeta.code.toUpperCase()];
      if (optimal) {
        setSettings({ ...optimal });
      }
      setCurrentStep(2); // Automatically advance to Step 2: Appearance & Layout
    }
  };

  // Filtered types by category and search query
  const filteredCatalog = useMemo(() => {
    let items = SECTION_METADATA_CATALOG;
    if (activeTab !== 'ALL') {
      items = items.filter((item) => item.category === activeTab);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery, activeTab]);

  // Selected Meta
  const selectedMeta: SectionTypeMeta = useMemo(() => {
    const norm = selectedType.toUpperCase();
    return (
      SECTION_METADATA_CATALOG.find((m) => m.code === norm) || {
        code: norm,
        name: norm,
        description: 'Custom Page Section',
        category: 'CONTENT',
        icon: LayoutTemplate,
        defaultTitle: '',
        defaultSubtitle: '',
        tagline: 'Custom section layout',
      }
    );
  }, [selectedType]);

  const navigateToStep = (targetStep: 1 | 2 | 3 | 4 | 5) => {
    setValidationError(null);
    if (targetStep === 4) {
      if (selectedType !== 'CUSTOM_CANVAS') {
        // Convert latest Step 3 form content (uploaded photos, texts) into fresh Canvas blocks for Studio
        const freshBlocks = convertSectionToCanvasBlocks(
          selectedType,
          content,
          title,
          subtitle,
          settings,
          true
        );
        setContent((prev) => ({
          ...prev,
          blocks: freshBlocks,
        }));
      }
    }
    setCurrentStep(targetStep);
  };

  // Navigation handlers across the 5-step wizard
  const handleNext = () => {
    setValidationError(null);
    if (currentStep === 1) {
      if (!selectedType) {
        setValidationError('Please choose a section type to continue.');
        return;
      }
      if (selectedType === 'CUSTOM_CANVAS') {
        navigateToStep(4);
      } else {
        navigateToStep(2);
      }
    } else if (currentStep === 2) {
      navigateToStep(3);
    } else if (currentStep === 3) {
      navigateToStep(4);
    } else if (currentStep === 4) {
      navigateToStep(5);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep === 5) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (selectedType === 'CUSTOM_CANVAS' && mode === 'create') {
        setCurrentStep(1); // Return directly to Step 1 for Blank Canvas
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (mode === 'create') {
        setCurrentStep(1);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    if (!selectedType) {
      setValidationError('Section type is required.');
      setCurrentStep(1);
      return;
    }

    try {
      await onSave({
        sectionType: selectedType,
        title: title.trim(),
        subtitle: subtitle.trim(),
        content,
        settings,
        sortOrder: Number(sortOrder) || defaultSortOrder,
        isVisible,
      });
    } catch {
      // Error handled by parent component / serverError prop
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div
        data-drawer-backdrop="true"
        onClick={onClose}
        className="fixed inset-0 drawer-backdrop transition-opacity duration-300 cursor-pointer"
      />

      {/* Drawer Container Sliding in from Right or Fullscreen */}
      <div
        className={`fixed inset-y-0 right-0 flex max-w-full pointer-events-none transition-all duration-300 ${
          isFullScreen ? 'inset-0 w-full pl-0' : 'pl-2 sm:pl-4'
        }`}
      >
        <div
          className={`pointer-events-auto transition-all duration-300 ${
            isFullScreen
              ? 'w-screen max-w-none h-screen rounded-none border-0'
              : currentStep === 4
              ? 'w-screen max-w-[92vw] 2xl:max-w-7xl'
              : currentStep === 5 || currentStep === 1
              ? 'w-screen max-w-5xl xl:max-w-6xl'
              : 'w-screen max-w-4xl'
          } bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-drawer-slide-in`}
        >
          {/* ─────────────────────────────────────────────────────────────
              HEADER & STEP PROGRESS BAR (5 STEPS)
          ───────────────────────────────────────────────────────────── */}
          {/* ─────────────────────────────────────────────────────────────
              HEADER & STEP PROGRESS BAR (COMPACT SINGLE ROW IN STEP 4)
          ───────────────────────────────────────────────────────────── */}
          <div className={`px-4 sm:px-6 ${currentStep === 4 ? 'py-2' : 'py-3'} border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shrink-0 transition-all`}>
            {currentStep === 4 ? (
              /* Single-Row Compact Header for Step 4 Studio */
              <div className="flex items-center justify-between gap-3">
                {/* Left: Title & Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <LayoutTemplate className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {mode === 'edit' ? 'Edit Section' : 'Create Section'}
                    </h3>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      mode === 'edit'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {mode === 'edit' ? 'Edit' : 'New'}
                    </span>
                  </div>
                </div>

                {/* Middle: Compact Step Navigator */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                  {[
                    { num: 1, label: 'Type', allow: mode === 'create' },
                    { num: 2, label: 'Appearance', allow: selectedType !== 'CUSTOM_CANVAS' },
                    { num: 3, label: 'Content', allow: selectedType !== 'CUSTOM_CANVAS' },
                    { num: 4, label: 'Studio', allow: true },
                    { num: 5, label: 'Preview', allow: true },
                  ].map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => s.allow && navigateToStep(s.num as any)}
                      disabled={!s.allow}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        currentStep === s.num
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : currentStep > s.num
                          ? 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                          : !s.allow
                          ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        currentStep === s.num
                          ? 'bg-white text-purple-700'
                          : currentStep > s.num
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : !s.allow
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {currentStep > s.num ? <Check className="w-2.5 h-2.5" /> : s.num}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* Right: Fullscreen & Close */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isFullScreen
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    }`}
                    title={isFullScreen ? 'Exit Fullscreen' : 'Expand Screen'}
                  >
                    {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isFullScreen ? 'Exit' : 'Expand'}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Close (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Standard 2-Row Header for Steps 1, 2, 3, 5 with tightened padding */
              <>
                <div className="flex items-center justify-between pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <LayoutTemplate className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                          {mode === 'edit' ? 'Edit Section' : 'Create Section'}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          mode === 'edit'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}>
                          {mode === 'edit' ? 'Edit Mode' : 'Add New'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isFullScreen
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      }`}
                      title={isFullScreen ? 'Exit Fullscreen' : 'Expand Screen'}
                    >
                      {isFullScreen ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Exit Fullscreen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Expand Screen</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Close (Esc)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Step Wizard Progress Header - 5 Steps */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="grid grid-cols-5 gap-1.5 text-xs">
                    {/* Step 1: Choose Type */}
                    <button
                      type="button"
                      onClick={() => mode === 'create' && navigateToStep(1)}
                      disabled={mode === 'edit'}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border transition text-left cursor-pointer ${
                        currentStep === 1
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                          : currentStep > 1
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 font-medium opacity-60'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          currentStep === 1
                            ? 'bg-blue-600 text-white'
                            : currentStep > 1
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {currentStep > 1 ? <Check className="w-2.5 h-2.5" /> : '1'}
                      </span>
                      <span className="truncate hidden sm:inline">Type</span>
                    </button>

                    {/* Step 2: Appearance & Layout */}
                    <button
                      type="button"
                      onClick={() => selectedType !== 'CUSTOM_CANVAS' && navigateToStep(2)}
                      disabled={selectedType === 'CUSTOM_CANVAS'}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border transition text-left cursor-pointer ${
                        selectedType === 'CUSTOM_CANVAS'
                          ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-900'
                          : currentStep === 2
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                          : currentStep > 2
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 font-medium opacity-60'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          currentStep === 2
                            ? 'bg-blue-600 text-white'
                            : currentStep > 2
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {currentStep > 2 ? <Check className="w-2.5 h-2.5" /> : '2'}
                      </span>
                      <span className="truncate hidden sm:inline">Appearance</span>
                    </button>

                    {/* Step 3: Content & Media */}
                    <button
                      type="button"
                      onClick={() => selectedType !== 'CUSTOM_CANVAS' && navigateToStep(3)}
                      disabled={selectedType === 'CUSTOM_CANVAS'}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border transition text-left cursor-pointer ${
                        selectedType === 'CUSTOM_CANVAS'
                          ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-900'
                          : currentStep === 3
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                          : currentStep > 3
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 font-medium opacity-60'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          currentStep === 3
                            ? 'bg-blue-600 text-white'
                            : currentStep > 3
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {currentStep > 3 ? <Check className="w-2.5 h-2.5" /> : '3'}
                      </span>
                      <span className="truncate hidden sm:inline">Content</span>
                    </button>

                    {/* Step 4: Drag & Drop Visual Studio */}
                    <button
                      type="button"
                      onClick={() => navigateToStep(4)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border transition text-left cursor-pointer ${
                        (currentStep as number) === 4
                          ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold shadow-2xs'
                          : currentStep > 4
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 font-medium opacity-60'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          (currentStep as number) === 4
                            ? 'bg-purple-600 text-white'
                            : currentStep > 4
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {currentStep > 4 ? <Check className="w-2.5 h-2.5" /> : '4'}
                      </span>
                      <span className="truncate hidden sm:inline">Studio</span>
                    </button>

                    {/* Step 5: Live Preview */}
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border transition text-left cursor-pointer ${
                        currentStep === 5
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 font-medium opacity-60'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          currentStep === 5
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        5
                      </span>
                      <span className="truncate hidden sm:inline">Preview</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SCROLLABLE BODY BY STEP
          ───────────────────────────────────────────────────────────── */}
          <div className={`flex-1 ${currentStep === 4 ? 'p-0 overflow-hidden flex flex-col min-h-0' : 'overflow-y-auto p-6 space-y-6'} text-slate-800 dark:text-slate-200`}>
            {/* Global Error Alerts */}
            {(validationError || serverError) && currentStep !== 4 && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError || serverError}</span>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 1: CHOOSE SECTION TYPE
            ═════════════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search section types (e.g. Hero, Cards, Gallery, Quote, Statistics)..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        activeTab === tab.key
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Responsive Visual Wireframe Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
                  {filteredCatalog.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = selectedType === item.code;

                    return (
                      <div
                        key={item.code}
                        onClick={() => handleSelectType(item)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left group relative ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xs'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Visual UI Wireframe Illustration of the Layout */}
                          <SectionLayoutWireframe code={item.code} isSelected={isSelected} />

                          {/* Card Header & Title */}
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition ${
                                    isSelected
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600'
                                  }`}
                                >
                                  <IconComp className="w-3.5 h-3.5" />
                                </div>
                                <h4
                                  className={`text-xs font-bold transition truncate ${
                                    isSelected
                                      ? 'text-blue-700 dark:text-blue-300'
                                      : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600'
                                  }`}
                                >
                                  {item.name}
                                </h4>
                              </div>

                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredCatalog.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      No section types match your search.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveTab('ALL');
                      }}
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 2: SETTINGS & APPEARANCE (+ Advanced Accordion)
            ═════════════════════════════════════════════════════════ */}
            {currentStep === 2 && (() => {
              const typeCode = (selectedType || '').toUpperCase().trim();

              const supportsColumns = [
                'CARDS',
                'ICON_CARDS',
                'STATISTICS',
                'STATS',
                'GALLERY',
                'LOGO_GRID',
                'DEPARTMENTS',
                'COURSES',
                'FACULTY',
                'NEWS',
                'EVENTS',
                'FAQ',
                'TESTIMONIALS',
                'DOCUMENTS',
              ].includes(typeCode);

              const supportsCardStyles = [
                'CARDS',
                'ICON_CARDS',
                'STATISTICS',
                'STATS',
                'DEPARTMENTS',
                'COURSES',
                'FACULTY',
                'NEWS',
                'EVENTS',
                'TESTIMONIALS',
                'DOCUMENTS',
                'TABLE',
                'TABS',
              ].includes(typeCode);

              const supportsAlignment = [
                'TEXT',
                'HERO',
                'HERO_SLIDER',
                'BANNERS',
                'QUOTE',
                'CTA',
                'CALL_TO_ACTION',
                'CARDS',
                'ICON_CARDS',
                'STATISTICS',
                'STATS',
                'FAQ',
                'IMAGE_TEXT',
                'VIDEO',
                'TIMELINE',
                'TABLE',
                'TABS',
                'DOCUMENTS',
                'TESTIMONIALS',
              ].includes(typeCode);

              return (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Active Section Type Context Indicator Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900/40 border border-blue-100 dark:border-blue-900/60 shadow-2xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                        {React.createElement(selectedMeta.icon, { className: 'w-5 h-5' })}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {selectedMeta.name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                            {selectedMeta.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {selectedMeta.description}
                        </p>
                      </div>
                    </div>

                    {mode === 'create' && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition cursor-pointer shadow-2xs shrink-0"
                      >
                        <span>Change Type</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Auto-Configuration Preset Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-blue-50/60 to-slate-50 dark:from-emerald-950/40 dark:via-blue-950/20 dark:to-slate-900/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                        Optimal Layout Preset Applied for {selectedMeta.name}
                      </p>
                      <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
                        Settings are pre-configured to look best with this section type. You can customize any option below.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const optimal = DEFAULT_SETTINGS_BY_TYPE[selectedType.toUpperCase()];
                      if (optimal) setSettings({ ...optimal });
                    }}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0 cursor-pointer bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800"
                  >
                    Reset Defaults
                  </button>
                </div>

                {/* 1. Layout Columns (Only for multi-item Grid layouts) */}
                {supportsColumns && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Desktop Layout Columns
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { val: 1, label: '1 Column', desc: 'Full Row' },
                        { val: 2, label: '2 Columns', desc: 'Split 50/50' },
                        { val: 3, label: '3 Columns', desc: 'Standard Grid' },
                        { val: 4, label: '4 Columns', desc: 'Compact Grid' },
                      ].map((col) => {
                        const active = (settings?.columns || 3) === col.val;
                        return (
                          <button
                            key={col.val}
                            type="button"
                            onClick={() => setSettings({ ...settings, columns: col.val })}
                            className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                              active
                                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-2xs font-bold ring-2 ring-blue-500/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            <span className="text-xs">{col.label}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{col.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Content Alignment & Container Width Grid */}
                <div className={`grid gap-4 ${supportsAlignment ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Content Alignment (Only when section has text/heading) */}
                  {supportsAlignment && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Content & Text Alignment
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: 'left', label: 'Left Aligned', icon: AlignLeft },
                          { val: 'center', label: 'Center Aligned', icon: AlignCenter },
                        ].map((align) => {
                          const Icon = align.icon;
                          const active = (settings?.alignment || 'center') === align.val;
                          return (
                            <button
                              key={align.val}
                              type="button"
                              onClick={() => setSettings({ ...settings, alignment: align.val as any })}
                              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                                active
                                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold ring-2 ring-blue-500/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-xs">{align.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Container Width */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Container Width
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 'narrow', label: 'Narrow', sub: 'Max-4XL' },
                        { val: 'standard', label: 'Standard', sub: 'Max-7XL' },
                        { val: 'full', label: 'Fluid', sub: 'Edge-to-Edge' },
                      ].map((w) => {
                        const active = (settings?.containerWidth || 'standard') === w.val;
                        return (
                          <button
                            key={w.val}
                            type="button"
                            onClick={() => setSettings({ ...settings, containerWidth: w.val as any })}
                            className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition cursor-pointer ${
                              active
                                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold ring-2 ring-blue-500/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            <span className="text-xs">{w.label}</span>
                            <span className="text-[9px] text-slate-400 font-normal">{w.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Section Background Swatches */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Section Background Shade
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { val: 'light', label: 'Light White', swatch: 'bg-white border-slate-300' },
                      { val: 'muted', label: 'Muted Slate', swatch: 'bg-slate-100 dark:bg-slate-800 border-slate-300' },
                      { val: 'dark', label: 'Dark Navy', swatch: 'bg-slate-900 border-slate-700 text-white' },
                      { val: 'gradient', label: 'Theme Gradient', swatch: 'bg-gradient-to-r from-blue-600 to-indigo-700 border-transparent text-white' },
                    ].map((bg) => {
                      const active = (settings?.background || 'light') === bg.val;
                      return (
                        <button
                          key={bg.val}
                          type="button"
                          onClick={() => setSettings({ ...settings, background: bg.val as any })}
                          className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 text-left ${
                            active
                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border shrink-0 shadow-2xs ${bg.swatch}`} />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {bg.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Card Style Variant & Spacing Grid */}
                <div className={`grid gap-4 ${supportsCardStyles ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Card Style Variant (Only for sections that render cards) */}
                  {supportsCardStyles && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Card Style Aesthetic
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: 'standard', label: 'Standard Flat' },
                          { val: 'elevated', label: 'Elevated Shadow' },
                          { val: 'bordered', label: 'Bordered Accent' },
                          { val: 'minimal', label: 'Minimal Ghost' },
                        ].map((card) => {
                          const active = (settings?.cardVariant || 'standard') === card.val;
                          return (
                            <button
                              key={card.val}
                              type="button"
                              onClick={() => setSettings({ ...settings, cardVariant: card.val as any })}
                              className={`p-2.5 rounded-xl border text-center transition cursor-pointer text-xs ${
                                active
                                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold ring-2 ring-blue-500/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                              }`}
                            >
                              {card.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Vertical Spacing */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Vertical Spacing (Padding)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 'compact', label: 'Compact', sub: 'Py-8' },
                        { val: 'normal', label: 'Normal', sub: 'Py-16' },
                        { val: 'large', label: 'Spacious', sub: 'Py-24' },
                      ].map((sp) => {
                        const active = (settings?.spacing || 'normal') === sp.val;
                        return (
                          <button
                            key={sp.val}
                            type="button"
                            onClick={() => setSettings({ ...settings, spacing: sp.val as any })}
                            className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                              active
                                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold ring-2 ring-blue-500/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            <span className="text-xs">{sp.label}</span>
                            <span className="text-[9px] text-slate-400 font-normal">{sp.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 5. Advanced Settings Accordion */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                      <span>Advanced Configuration (Sort Order & Visibility)</span>
                    </div>
                    {showAdvanced ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {showAdvanced && (
                    <div className="p-4 mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 animate-in fade-in duration-150">
                      <Input
                        label="Sort Order"
                        type="number"
                        value={String(sortOrder)}
                        onChange={(e) => setSortOrder(Number(e.target.value) || 1)}
                        helperText="Position index in the page scroll sequence (e.g., 1, 2, 3)."
                      />

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Switch
                          checked={isVisible}
                          onChange={(v) => setIsVisible(v)}
                          label="Section Visibility"
                          description="When enabled, this section renders live on the website. Disabled sections remain saved as drafts."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              );
            })()}

            {/* ═════════════════════════════════════════════════════════
                STEP 3: CONTENT & MEDIA (Title, Subtitle & Fields)
            ═════════════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Active Section Type Context Indicator Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900/40 border border-blue-100 dark:border-blue-900/60 shadow-2xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                        {React.createElement(selectedMeta.icon, { className: 'w-5 h-5' })}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {selectedMeta.name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                            {selectedMeta.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {selectedMeta.description}
                        </p>
                      </div>
                    </div>

                    {mode === 'create' && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition cursor-pointer shadow-2xs shrink-0"
                      >
                        <span>Change Type</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Headings Grouped Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3.5">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Section Headings
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Input
                      label="Section Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={selectedMeta.defaultTitle || 'Visible section heading (e.g. About Our College)'}
                      helperText="Primary heading displayed at the top of this section."
                    />

                    <Input
                      label="Section Subtitle"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder={selectedMeta.defaultSubtitle || 'Supporting description or tagline'}
                      helperText="Optional secondary context line beneath the heading."
                    />
                  </div>
                </div>

                {/* Specific Content Form Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {selectedMeta.name} Content Fields
                      </span>
                    </div>
                  </div>

                  <SectionContentEditor
                    sectionType={selectedType}
                    content={content}
                    onChange={(c) => setContent(c)}
                    availablePages={availablePages}
                  />
                </div>

                {/* Studio Callout Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/90 via-indigo-50/60 to-blue-50/40 dark:from-purple-950/40 dark:via-indigo-950/20 dark:to-slate-900/40 border border-purple-200/80 dark:border-purple-900/60 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-600/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Next: Drag & Drop Visual Studio (Step 4)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        In the next step, you can visually drag & drop elements, select Google Fonts, custom color palettes, padding, and alignments.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition cursor-pointer shadow-sm shadow-purple-600/20 shrink-0"
                  >
                    <span>Open Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 4: DRAG & DROP VISUAL STUDIO (FULL CANVAS)
            ═════════════════════════════════════════════════════════ */}
            {currentStep === 4 && (
              <div className="flex-1 h-full min-h-0 flex flex-col animate-in fade-in duration-200">
                <VisualCanvasEditor
                  initialContent={{
                    ...content,
                    containerWidth: settings?.containerWidth || 'standard',
                    backgroundColor:
                      settings?.background === 'dark'
                        ? '#0f172a'
                        : settings?.background === 'muted'
                        ? '#f8fafc'
                        : undefined,
                    gradient:
                      settings?.background === 'gradient'
                        ? 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)'
                        : undefined,
                    blocks:
                      content.blocks && content.blocks.length > 0
                        ? content.blocks
                        : convertSectionToCanvasBlocks(selectedType, content, title, subtitle, settings),
                  }}
                  onSaveContent={(c) => {
                    const synced = syncBlocksToStructuredContent(selectedType, c.blocks || [], c);
                    if (synced.title && typeof synced.title === 'string' && synced.title !== title) {
                      setTitle(synced.title);
                    }
                    if (synced.subtitle && typeof synced.subtitle === 'string' && synced.subtitle !== subtitle) {
                      setSubtitle(synced.subtitle);
                    }
                    setContent(synced);
                  }}
                  onSyncFromLayout={() => {
                    const freshBlocks = convertSectionToCanvasBlocks(selectedType, content, title, subtitle, settings, true);
                    setContent((prev) => ({
                      ...prev,
                      blocks: freshBlocks,
                    }));
                  }}
                  sectionTitle={title || selectedMeta.name}
                  availablePages={availablePages}
                />
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 5: LIVE RESPONSIVE INLINE PREVIEW
            ═════════════════════════════════════════════════════════ */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Device Toolbar & Section Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Live Responsive Preview
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                          {selectedMeta.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Real-time interactive rendering of your configured section layout
                      </p>
                    </div>
                  </div>

                  {/* Device Viewport Selector */}
                  <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewDevice === 'desktop'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                      title="Desktop Fullscreen (100%)"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Desktop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewDevice('tablet')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewDevice === 'tablet'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                      title="Tablet View (768px)"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tablet (768px)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewDevice === 'mobile'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                      title="Mobile View (375px)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mobile (375px)</span>
                    </button>
                  </div>
                </div>

                {/* Live Canvas Mockup */}
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/5 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex justify-center items-start min-h-[420px] overflow-x-auto">
                  <div
                    className={`transition-all duration-300 w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden ${
                      previewDevice === 'tablet'
                        ? 'max-w-[768px]'
                        : previewDevice === 'mobile'
                        ? 'max-w-[375px]'
                        : 'max-w-full'
                    }`}
                  >
                    {/* Device Screen Header Bar */}
                    <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                      </div>
                      <span className="text-[10px] truncate max-w-[200px]">
                        {previewDevice === 'desktop'
                          ? 'Desktop Preview (100%)'
                          : previewDevice === 'tablet'
                          ? 'Tablet View (768px)'
                          : 'Mobile View (375px)'}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                        {selectedType}
                      </span>
                    </div>

                    {/* Dynamic Section Content Rendering */}
                    <div className="p-2 sm:p-4">
                      <SectionRenderer
                        section={{
                          id: 'preview-section-id',
                          pageId: 'preview-page-id',
                          sectionType: selectedType,
                          title: title.trim(),
                          subtitle: subtitle.trim(),
                          content,
                          settings,
                          sortOrder: Number(sortOrder) || defaultSortOrder,
                          isVisible: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              STICKY FOOTER NAVIGATION (5 STEPS)
          ───────────────────────────────────────────────────────────── */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm flex items-center justify-between gap-3 shrink-0">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>

              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-sm shadow-blue-600/20"
                >
                  <span>
                    {selectedType === 'CUSTOM_CANVAS'
                      ? 'Open Visual Studio'
                      : 'Continue to Appearance'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-sm shadow-blue-600/20"
                >
                  <span>Continue to Content</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {currentStep === 3 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Save Directly</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition cursor-pointer shadow-sm shadow-purple-600/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Continue to Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Save Directly</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-sm shadow-blue-600/20"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Continue to Live Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {currentStep === 5 && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shadow-sm shadow-blue-600/20"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Section...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{mode === 'edit' ? 'Update Section' : 'Create Section'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
