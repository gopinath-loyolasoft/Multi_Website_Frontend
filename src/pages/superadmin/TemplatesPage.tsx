import React, { useEffect, useState } from 'react';
import { 
  LayoutTemplate, 
  RefreshCw, 
  Plus, 
  Building2, 
  Palette, 
  Sliders, 
  CheckCircle2, 
  X, 
  Pencil, 
  Trash2, 
  BookOpen, 
  Menu as MenuIcon,
  Search,
  Check,
  AlertCircle,
  Wand2,
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import { TemplateItem, Theme, Tenant, CreateTemplatePayload, UpdateTemplatePayload } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, Drawer, ConfirmDialog, Input, Select, Switch } from '../../UI_Componentes/ui';

// Helper: Normalize category strings for matching & database storage
const normalizeCategoryKey = (cat?: string): string => {
  if (!cat) return 'GENERAL';
  const clean = cat.toUpperCase().trim();
  if (clean.includes('GLASS') || clean === 'TEMPLATE6' || clean === 'TEMPLATE_6') return 'DESIGN_3D_GLASS';
  if (clean.includes('ISOMETRIC') || clean === 'TEMPLATE7' || clean === 'TEMPLATE_7') return 'DESIGN_3D_ISOMETRIC';
  if (clean.includes('KINETIC') || clean === 'TEMPLATE8' || clean === 'TEMPLATE_8') return 'DESIGN_3D_KINETIC';
  if (clean.includes('NEUMORPHIC') || clean === 'TEMPLATE9' || clean === 'TEMPLATE_9') return 'DESIGN_3D_NEUMORPHIC';
  if (clean.includes('SLANTED') || clean.includes('SALESIAN') || clean.includes('DESIGN_3D_MODERN') || clean === 'TEMPLATE5' || clean === 'TEMPLATE_5') return 'DESIGN_3D_SLANTED';
  if (clean.includes('3D')) return 'DESIGN_3D_SLANTED';
  if (clean.includes('ARTS') || clean.includes('SCIENCE') || clean === 'TEMPLATE2' || clean === 'TEMPLATE_2') return 'ARTS_SCIENCE';
  if (clean.includes('ENG') || clean.includes('TECH') || clean === 'TEMPLATE1' || clean === 'TEMPLATE_1') return 'ENGINEERING';
  if (clean.includes('MED') || clean.includes('HEALTH') || clean === 'TEMPLATE3' || clean === 'TEMPLATE_3') return 'MEDICAL';
  if (clean.includes('UNIV') || clean === 'TEMPLATE4' || clean === 'TEMPLATE_4') return 'UNIVERSITY';
  return clean;
};

// Helper: Human-friendly category display label
const formatCategoryName = (cat?: string): string => {
  const key = normalizeCategoryKey(cat);
  switch (key) {
    case 'ENGINEERING': return 'Engineering & Technology';
    case 'ARTS_SCIENCE': return 'Arts & Science';
    case 'MEDICAL': return 'Medical & Healthcare';
    case 'UNIVERSITY': return 'University & Multi-Faculty';
    case 'DESIGN_3D_SLANTED': return '3D Slanted Design';
    case 'DESIGN_3D_GLASS': return '3D Glassmorphism';
    case 'DESIGN_3D_ISOMETRIC': return '3D Isometric';
    case 'DESIGN_3D_KINETIC': return '3D Kinetic Flip';
    case 'DESIGN_3D_NEUMORPHIC': return '3D Neumorphic';
    default: return cat || 'General Higher Education';
  }
};

// Helper: Get Template Number and Category Icon
const getTemplateNumberBadge = (code: string): { number: string; icon: string } => {
  const clean = (code || '').toUpperCase();
  if (clean.includes('ENG') || clean === 'TEMPLATE1' || clean === 'TEMPLATE_1') {
    return { number: 'TEMPLATE 1', icon: '⚙️' };
  }
  if (clean.includes('ARTS') || clean === 'TEMPLATE2' || clean === 'TEMPLATE_2') {
    return { number: 'TEMPLATE 2', icon: '🎨' };
  }
  if (clean.includes('MED') || clean === 'TEMPLATE3' || clean === 'TEMPLATE_3') {
    return { number: 'TEMPLATE 3', icon: '⚕️' };
  }
  if (clean.includes('UNIV') || clean === 'TEMPLATE4' || clean === 'TEMPLATE_4') {
    return { number: 'TEMPLATE 4', icon: '🎓' };
  }
  if (clean.includes('GLASS') || clean === 'TEMPLATE6' || clean === 'TEMPLATE_6') {
    return { number: 'TEMPLATE 6', icon: '💎' };
  }
  if (clean.includes('ISOMETRIC') || clean === 'TEMPLATE7' || clean === 'TEMPLATE_7') {
    return { number: 'TEMPLATE 7', icon: '🧊' };
  }
  if (clean.includes('KINETIC') || clean === 'TEMPLATE8' || clean === 'TEMPLATE_8') {
    return { number: 'TEMPLATE 8', icon: '⚡' };
  }
  if (clean.includes('NEUMORPHIC') || clean === 'TEMPLATE9' || clean === 'TEMPLATE_9') {
    return { number: 'TEMPLATE 9', icon: '🛡️' };
  }
  if (clean.includes('SALESIAN') || clean.includes('3D') || clean === 'TEMPLATE5' || clean === 'TEMPLATE_5') {
    return { number: 'TEMPLATE 5', icon: '📐' };
  }
  return { number: 'CUSTOM', icon: '✨' };
};

// Helper: Human-friendly feature module names for all 22 platform modules
const FEATURE_LABEL_MAP: Record<string, string> = {
  PAGES: 'Pages & Layouts',
  SECTIONS: 'Section Builder',
  MENUS: 'Navigation Menus',
  THEMES: 'Theme & Colors',
  BANNERS: 'Hero Sliders & Banners',
  MARQUEE: 'Announcement Ticker',
  STATS: 'Counters & Metrics',
  QUOTE: 'Leadership Quote',
  ABOUT: 'Institutional Heritage',
  DEPARTMENTS: 'Academic Departments',
  COURSES: 'Courses & Programs',
  FACULTY: 'Faculty Directory',
  NEWS: 'News & Announcements',
  EVENTS: 'Events Calendar',
  NOTICES: 'Circulars & Notices',
  GALLERY: 'Photo & Video Gallery',
  MEDIA: 'Multimedia Library',
  PLACEMENTS: 'Placement Partners & CTC',
  COMPLIANCE: 'Mandatory Disclosures',
  TRANSPORT: 'Bus & Route Network',
  HOSTELS: 'Hostels & Residence',
  LIBRARY: 'Digital Library & Archives',
  ALUMNI: 'Global Alumni Network',
  ADMISSIONS: 'Online Admissions Portal',
  CONTACT: 'Contact & Campus Map',
  POPUPS: 'Popup Lightbox Alerts',
};

const formatFeatureName = (code: string): string => {
  return FEATURE_LABEL_MAP[code.toUpperCase()] || code;
};

const ARCHETYPE_METADATA: Record<string, {
  packName: string;
  loginTemplate: string;
  loginStyleName: string;
  loginStyleDesc: string;
  heroHeadline: string;
  heroSub: string;
  layoutHighlights: string[];
  gradientBg: string;
  badgeBg: string;
}> = {
  ENGINEERING_MODERN: {
    packName: 'Engineering & High-Tech Blueprint Suite',
    loginTemplate: 'template1',
    loginStyleName: 'SHC Modern Polygon (Tech Blue)',
    loginStyleDesc: 'Geometric polygon floating cards with sharp isometric blueprints and deep navy styling.',
    heroHeadline: 'Advancing Frontiers in Engineering & Computing Research',
    heroSub: 'Accredited multi-disciplinary departments with state-of-the-art laboratory infrastructure.',
    layoutHighlights: [
      'Cyber grid blueprint canvas and technical metric counters',
      'Laboratory infrastructure & research center dynamic showcases',
      'Dedicated engineering department cards with direct syllabus links',
      'Integrated campus placements and recruiter marquee ticker'
    ],
    gradientBg: 'from-blue-600 via-indigo-700 to-slate-900',
    badgeBg: 'bg-blue-100 text-blue-900 dark:bg-blue-900/60 dark:text-blue-200'
  },
  ARTS_SCIENCE_MODERN: {
    packName: 'Arts & Science Modern Suite',
    loginTemplate: 'template2',
    loginStyleName: 'RCM Gold & Maroon (Curved Ribbon)',
    loginStyleDesc: 'Curved gold ribbons, warm heritage backdrop, and elegant maroon typography.',
    heroHeadline: 'Nurturing Intellect, Creativity & Scholarly Excellence',
    heroSub: 'A distinguished institution for humanities, physical sciences, commerce, and creative arts.',
    layoutHighlights: [
      '3D slanted parallelogram cards with deep gold & heritage maroon accents',
      'Gyroscopic tilt cards and dynamic diagonal hero section slice',
      'Cultural event highlights, fine arts gallery, and student publications',
      'Dean of Academics leadership address and alumni achievements'
    ],
    gradientBg: 'from-amber-600 via-rose-700 to-amber-900',
    badgeBg: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
  },
  MEDICAL_MODERN: {
    packName: 'Medical & Healthcare Institute Suite',
    loginTemplate: 'template3',
    loginStyleName: 'GP College Emerald (Botanical)',
    loginStyleDesc: 'Organic emerald green accents, clinical clean borders, and calm botanical trust motif.',
    heroHeadline: 'Excellence in Clinical Care, Medical Research & Healing',
    heroSub: 'World-class teaching hospital, medical sciences faculty, and clinical residency programs.',
    layoutHighlights: [
      'Emergency OPD announcement ticker with live status updates',
      'Hospital bed capacity, clinical faculty, and active OPD stats counters',
      'Specialized clinical department cards (Cardiology, Neurology, Pediatrics)',
      'Mandatory medical statutory compliance & accreditation registries'
    ],
    gradientBg: 'from-emerald-600 via-teal-700 to-cyan-950',
    badgeBg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
  },
  UNIVERSITY_MODERN: {
    packName: 'University & Multi-Faculty Suite',
    loginTemplate: 'template4',
    loginStyleName: 'CMS360 Sky Blue (Prestige Split)',
    loginStyleDesc: 'Two-tone split screen layout with prestige crest styling and sky blue modern buttons.',
    heroHeadline: 'A Global University Committed to Visionary Research & Leadership',
    heroSub: 'Comprehensive multi-disciplinary schools spanning Technology, Medicine, Law, and Arts.',
    layoutHighlights: [
      'Prestigious collegiate aesthetic with institutional crest & rich mega-header',
      'Chancellor and Vice-Chancellor leadership address showcase',
      'Multi-faculty research gateway and international admissions portal',
      'Campus housing, transport fleet, and sports facilities overview'
    ],
    gradientBg: 'from-sky-600 via-blue-800 to-indigo-950',
    badgeBg: 'bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200'
  },
  SALESIAN_SLANTED: {
    packName: '3D Slanted Navy & Gold Suite',
    loginTemplate: 'template5',
    loginStyleName: '3D Slanted Navy & Gold (Perspective)',
    loginStyleDesc: 'Sharp 3D perspective tilt cards with diagonal badges and metallic gold accents.',
    heroHeadline: 'Transformative Education Powered by Modern Innovation',
    heroSub: 'Dynamic campus ecosystem fostering engineering prowess and leadership.',
    layoutHighlights: [
      '3D perspective tilt cards with depth-shadow elevations',
      'Polygon media showcase and diagonal ribbon section dividers',
      'Interactive department modules with direct syllabus downloads',
      'High-energy student activities and club spotlight'
    ],
    gradientBg: 'from-[#134975] via-[#1e3a5f] to-[#e5a912]',
    badgeBg: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
  },
  DESIGN_3D_GLASS: {
    packName: '3D Holographic Glassmorphism Suite',
    loginTemplate: 'template6',
    loginStyleName: 'Cyber Aurora Glass (Holographic)',
    loginStyleDesc: 'Frosted acrylic panels with chromatic prism neon glows and floating translucent spheres.',
    heroHeadline: 'Next-Gen Educational Experience in Holographic Clarity',
    heroSub: 'Future-ready academic programs rendered with cutting-edge glassmorphic design.',
    layoutHighlights: [
      'Ultra-modern frosted glass panels with dynamic backdrop blur',
      'Chromatic neon prism borders with interactive mouse glow',
      'Floating translucent cards and glowing statistic counters',
      'Cinematic full-width media presentation'
    ],
    gradientBg: 'from-cyan-600 via-blue-700 to-fuchsia-900',
    badgeBg: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/60 dark:text-cyan-200'
  },
  DESIGN_3D_ISOMETRIC: {
    packName: '3D Isometric Tactile Elevation Suite',
    loginTemplate: 'template7',
    loginStyleName: 'Tactile Shadow Bevel (Voxel)',
    loginStyleDesc: 'Chunky 3D voxel blocks with physical button click compression and heavy drop shadows.',
    heroHeadline: 'Tangible Learning, Solid Foundations, Enduring Success',
    heroSub: 'A tactile, structured learning platform designed with modern isometric depth.',
    layoutHighlights: [
      'Chunky 3D voxel blocks and geometric grid layout',
      'Physical push-buttons with mechanical tactile click animations',
      'Deep layered shadow bevels and solid contrast borders',
      'Structured technical and vocational syllabus explorer'
    ],
    gradientBg: 'from-amber-500 via-orange-600 to-slate-900',
    badgeBg: 'bg-amber-100 text-slate-900 dark:bg-amber-900/60 dark:text-amber-200'
  },
  DESIGN_3D_KINETIC: {
    packName: '3D Kinetic Perspective & Flip Suite',
    loginTemplate: 'template8',
    loginStyleName: 'Neon Flip Perspective (Kinetic 3D)',
    loginStyleDesc: 'Kinetic 180° rotation cards on hover with neon accents and gyroscopic cursor tilt.',
    heroHeadline: 'Dynamic Horizons, Motion-Driven Interactive Education',
    heroSub: 'Experience courses and departments through kinetic 3D perspective animations.',
    layoutHighlights: [
      'True 3D card flips (180° smooth rotation on hover)',
      'Gyroscopic cursor parallax across department and faculty cards',
      'Kinetic neon ribbon action buttons and animated headline glows',
      'Interactive student showcase with perspective depth'
    ],
    gradientBg: 'from-rose-600 via-purple-700 to-indigo-950',
    badgeBg: 'bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200'
  },
  DESIGN_3D_NEUMORPHIC: {
    packName: '3D Neumorphic Soft Depth Suite',
    loginTemplate: 'template9',
    loginStyleName: 'Embossed Soft Depth (Neumorphic)',
    loginStyleDesc: 'Soft sculpted shadows, dual-light embossing, and debossed pill elements.',
    heroHeadline: 'Harmonious Design, Seamless Academic Journeys',
    heroSub: 'Elegantly sculpted interfaces delivering clean, distraction-free higher education.',
    layoutHighlights: [
      'Sculpted soft-surface cards with dual light-source embossing',
      'Debossed badge tags and soft pillow interactive buttons',
      'Gentle tactile contrast suited for healthcare and research portals',
      'Minimalist distraction-free typography and content flow'
    ],
    gradientBg: 'from-teal-600 via-slate-700 to-slate-900',
    badgeBg: 'bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200'
  }
};

// Fixed system template codes that cannot be deleted
const SYSTEM_TEMPLATE_CODES = [
  'ENGINEERING_MODERN',
  'ARTS_SCIENCE_MODERN',
  'ARTS_SCIENCE_CLASSIC',
  'MEDICAL_MODERN',
  'UNIVERSITY_MODERN',
  'DESIGN_3D_MODERN',
  'SALESIAN_SLANTED',
  'DESIGN_3D_GLASS',
  'DESIGN_3D_ISOMETRIC',
  'DESIGN_3D_KINETIC',
  'DESIGN_3D_NEUMORPHIC',
  'TEMPLATE1',
  'TEMPLATE2',
  'TEMPLATE3',
  'TEMPLATE4',
  'TEMPLATE5',
  'TEMPLATE6',
  'TEMPLATE7',
  'TEMPLATE8',
  'TEMPLATE9'
];

const isSystemTemplate = (tmpl: TemplateItem): boolean => {
  if (tmpl.isSystem) return true;
  return SYSTEM_TEMPLATE_CODES.includes((tmpl.code || '').toUpperCase());
};

// ─── Complete 9-Template Design Archetypes Seed List ────────────────
const SYSTEM_TEMPLATES_SEED_LIST: TemplateItem[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'ENGINEERING_MODERN',
    name: 'Engineering & High-Tech Blueprint Suite',
    category: 'Engineering & Technology',
    description: 'Cyber grid blueprint layout, technical metric counters, laboratory showcases, structured engineering departments with matching polygon tech login.',
    defaultThemeCode: 'THEME_BLUE',
    defaultThemeName: 'Blueprint Royal Blue',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'NOTICES',
      'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT',
      'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    starterPages: [
      { slug: 'home', title: 'Home', isPublished: true },
      { slug: 'about', title: 'About Us', isPublished: true },
      { slug: 'departments', title: 'Departments', isPublished: true },
      { slug: 'courses', title: 'Courses', isPublished: true },
      { slug: 'faculty', title: 'Faculty', isPublished: true },
      { slug: 'placements', title: 'Placements', isPublished: true },
      { slug: 'compliance', title: 'Mandatory Compliance', isPublished: true },
      { slug: 'transport', title: 'Campus Transport', isPublished: true },
      { slug: 'hostels', title: 'Hostels & Living', isPublished: true },
      { slug: 'library', title: 'Digital Library', isPublished: true },
      { slug: 'alumni', title: 'Alumni Network', isPublished: true },
      { slug: 'admissions', title: 'Admissions', isPublished: true },
      { slug: 'contact', title: 'Contact Us', isPublished: true }
    ],
    starterMenus: [
      { title: 'Home', url: '/' },
      { title: 'About Us', url: '/about' },
      { title: 'Departments', url: '/departments' },
      { title: 'Courses', url: '/courses' },
      { title: 'Faculty', url: '/faculty' },
      { title: 'Placements', url: '/placements' },
      { title: 'Compliance', url: '/compliance' },
      { title: 'Admissions', url: '/admissions' },
      { title: 'Contact', url: '/contact' }
    ],
    isSystem: true,
    isActive: true
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'ARTS_SCIENCE_MODERN',
    name: 'Arts & Science Modern Suite',
    category: 'Arts & Science',
    description: '3D slanted parallelogram layout with deep gold & maroon accents, gyro tilt cards, diagonal hero slice with matching curved gold ribbon login.',
    defaultThemeCode: 'THEME_GOLD',
    defaultThemeName: 'Gold & Heritage Maroon',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS',
      'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE',
      'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    isSystem: true,
    isActive: true
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    code: 'MEDICAL_MODERN',
    name: 'Medical & Healthcare Institute Suite',
    category: 'Medical & Healthcare',
    description: 'Clinical trust layout, emergency OPD announcement ticker, bed & doctor stats counter, clinical department cards with matching emerald botanical login.',
    defaultThemeCode: 'THEME_TEAL',
    defaultThemeName: 'Clinical Teal & Cyan',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'NOTICES',
      'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT',
      'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    isSystem: true,
    isActive: true
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    code: 'UNIVERSITY_MODERN',
    name: 'University & Multi-Faculty Suite',
    category: 'University & Multi-Faculty',
    description: 'Prestigious collegiate aesthetic with rich header, chancellor leadership showcase, research gateway with matching sky blue collegiate login.',
    defaultThemeCode: 'THEME_CRIMSON',
    defaultThemeName: 'Oxford Crimson & Navy',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS',
      'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE',
      'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    isSystem: true,
    isActive: true
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    code: 'SALESIAN_SLANTED',
    name: '3D Slanted Navy & Gold Suite',
    category: '3D Slanted Design',
    description: 'Dedicated 3D perspective tilt cards, polygon media articles, diagonal badges, gold stripe headers, and matching slanted 3D login.',
    defaultThemeCode: 'THEME_SLANTED_NAVY',
    defaultThemeName: '3D Slanted Navy & Gold',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS',
      'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE',
      'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    isSystem: true,
    isActive: true
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    code: 'DESIGN_3D_GLASS',
    name: '3D Holographic Glassmorphism Suite',
    category: '3D Glassmorphism',
    description: 'Ultra-modern frosted glass panels, chromatic prism neon glow, floating bokeh spheres, translucent cards with frosted holographic login.',
    defaultThemeCode: 'THEME_CYBER_GLASS',
    defaultThemeName: '3D Holographic Aurora Glass',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS',
      'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE',
      'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    isSystem: true,
    isActive: true
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    code: 'DESIGN_3D_ISOMETRIC',
    name: '3D Isometric Tactile Elevation Suite',
    category: '3D Isometric',
    description: 'Chunky 3D voxel blocks, physical push-buttons with compression feedback, thick shadow bevels, tactile cards with matching voxel login.',
    defaultThemeCode: 'THEME_TACTILE_VOXEL',
    defaultThemeName: '3D Isometric Tactile Ochre',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS',
      'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE',
      'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    isSystem: true,
    isActive: true
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    code: 'DESIGN_3D_KINETIC',
    name: '3D Kinetic Perspective & Flip Suite',
    category: '3D Kinetic Flip',
    description: 'True 3D card flips (180° rotation on hover), gyroscopic cursor parallax, kinetic neon ribbon buttons with matching kinetic flip login.',
    defaultThemeCode: 'THEME_KINETIC_NEON',
    defaultThemeName: '3D Kinetic Ultraviolet & Rose',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS',
      'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE',
      'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    isSystem: true,
    isActive: true
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    code: 'DESIGN_3D_NEUMORPHIC',
    name: '3D Neumorphic Soft Depth Suite',
    category: '3D Neumorphic',
    description: 'Sculpted soft-surface cards, dual-light embossing, debossed pill tags, soft pillow push-buttons with matching neumorphic embossed login.',
    defaultThemeCode: 'THEME_SOFT_NEUMORPHIC',
    defaultThemeName: '3D Neumorphic Soft Slate & Teal',
    recommendedFeatures: [
      'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS',
      'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE',
      'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
    ],
    isSystem: true,
    isActive: true
  }
];

// ─── Complete 9-Theme Color Palettes Seed List (1-to-1 with 9 Templates) ──
export const SYSTEM_THEMES_SEED_LIST: Theme[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    code: 'THEME_BLUE',
    name: 'Blueprint Royal Blue',
    isActive: true,
    configuration: {
      themeName: 'Blueprint Royal Blue',
      primaryColor: '#1e40af',
      secondaryColor: '#f59e0b',
      accentColor: '#3b82f6',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: 'Engineering & High-Tech Portal'
    }
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    code: 'THEME_GOLD',
    name: 'Heritage Gold & Maroon',
    isActive: true,
    configuration: {
      themeName: 'Heritage Gold & Maroon',
      primaryColor: '#991b1b',
      secondaryColor: '#d97706',
      accentColor: '#b45309',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: 'Arts & Science Modern Portal'
    }
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    code: 'THEME_TEAL',
    name: 'Clinical Teal & Cyan',
    isActive: true,
    configuration: {
      themeName: 'Clinical Teal & Cyan',
      primaryColor: '#0f766e',
      secondaryColor: '#06b6d4',
      accentColor: '#14b8a6',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: 'Medical & Healthcare Portal'
    }
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    code: 'THEME_CRIMSON',
    name: 'Oxford Crimson & Navy',
    isActive: true,
    configuration: {
      themeName: 'Oxford Crimson & Navy',
      primaryColor: '#881337',
      secondaryColor: '#1e3a8a',
      accentColor: '#be123c',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: 'University & Multi-Faculty Portal'
    }
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    code: 'THEME_SLANTED_NAVY',
    name: '3D Slanted Navy & Gold',
    isActive: true,
    configuration: {
      themeName: '3D Slanted Navy & Gold',
      primaryColor: '#134975',
      secondaryColor: '#e5a912',
      accentColor: '#3b82f6',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: '3D Slanted Design Portal'
    }
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    code: 'THEME_CYBER_GLASS',
    name: '3D Holographic Aurora Glass',
    isActive: true,
    configuration: {
      themeName: '3D Holographic Aurora Glass',
      primaryColor: '#0891b2',
      secondaryColor: '#8b5cf6',
      accentColor: '#06b6d4',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: '3D Glassmorphism Portal'
    }
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    code: 'THEME_TACTILE_VOXEL',
    name: '3D Isometric Tactile Ochre',
    isActive: true,
    configuration: {
      themeName: '3D Isometric Tactile Ochre',
      primaryColor: '#d97706',
      secondaryColor: '#0f172a',
      accentColor: '#f59e0b',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: '3D Isometric Portal'
    }
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    code: 'THEME_KINETIC_NEON',
    name: '3D Kinetic Ultraviolet & Rose',
    isActive: true,
    configuration: {
      themeName: '3D Kinetic Ultraviolet & Rose',
      primaryColor: '#e11d48',
      secondaryColor: '#7c3aed',
      accentColor: '#f43f5e',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: '3D Kinetic Perspective Portal'
    }
  },
  {
    id: '10000000-0000-0000-0000-000000000009',
    code: 'THEME_SOFT_NEUMORPHIC',
    name: '3D Neumorphic Soft Slate & Teal',
    isActive: true,
    configuration: {
      themeName: '3D Neumorphic Soft Slate & Teal',
      primaryColor: '#0d9488',
      secondaryColor: '#334155',
      accentColor: '#14b8a6',
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'solid',
      badgeText: '3D Neumorphic Portal'
    }
  }
];

export const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [features, setFeatures] = useState<{ code: string; name: string; category?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Preview Showcase Modal State
  const [showcaseModalOpen, setShowcaseModalOpen] = useState(false);
  const [showcaseTmpl, setShowcaseTmpl] = useState<TemplateItem | null>(null);

  // Create / Edit Drawer
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Engineering & Technology',
    description: '',
    defaultThemeId: '',
    supportedThemes: [] as string[],
    recommendedFeatures: [] as string[],
    isActive: true
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningTemplate, setAssigningTemplate] = useState<TemplateItem | null>(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');
  const [seedData, setSeedData] = useState(true);
  const [assigning, setAssigning] = useState(false);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState<TemplateItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tmplRes, themeRes, colRes, featRes] = await Promise.all([
        apiClient.get('/superadmin/templates'),
        apiClient.get('/superadmin/themes'),
        apiClient.get('/superadmin/colleges'),
        apiClient.get('/superadmin/features')
      ]);

      const CANONICAL_TEMPLATE_MAP: Record<string, string> = {
        ENGINEERING_MODERN: 'ENGINEERING_MODERN',
        TEMPLATE1: 'ENGINEERING_MODERN',
        TEMPLATE_1: 'ENGINEERING_MODERN',
        ARTS_SCIENCE_MODERN: 'ARTS_SCIENCE_MODERN',
        ARTS_SCIENCE_CLASSIC: 'ARTS_SCIENCE_MODERN',
        TEMPLATE2: 'ARTS_SCIENCE_MODERN',
        TEMPLATE_2: 'ARTS_SCIENCE_MODERN',
        MEDICAL_MODERN: 'MEDICAL_MODERN',
        TEMPLATE3: 'MEDICAL_MODERN',
        TEMPLATE_3: 'MEDICAL_MODERN',
        UNIVERSITY_MODERN: 'UNIVERSITY_MODERN',
        TEMPLATE4: 'UNIVERSITY_MODERN',
        TEMPLATE_4: 'UNIVERSITY_MODERN',
        SALESIAN_SLANTED: 'SALESIAN_SLANTED',
        DESIGN_3D_MODERN: 'SALESIAN_SLANTED',
        TEMPLATE5: 'SALESIAN_SLANTED',
        TEMPLATE_5: 'SALESIAN_SLANTED',
        DESIGN_3D_GLASS: 'DESIGN_3D_GLASS',
        TEMPLATE6: 'DESIGN_3D_GLASS',
        TEMPLATE_6: 'DESIGN_3D_GLASS',
        DESIGN_3D_ISOMETRIC: 'DESIGN_3D_ISOMETRIC',
        TEMPLATE7: 'DESIGN_3D_ISOMETRIC',
        TEMPLATE_7: 'DESIGN_3D_ISOMETRIC',
        DESIGN_3D_KINETIC: 'DESIGN_3D_KINETIC',
        TEMPLATE8: 'DESIGN_3D_KINETIC',
        TEMPLATE_8: 'DESIGN_3D_KINETIC',
        DESIGN_3D_NEUMORPHIC: 'DESIGN_3D_NEUMORPHIC',
        TEMPLATE9: 'DESIGN_3D_NEUMORPHIC',
        TEMPLATE_9: 'DESIGN_3D_NEUMORPHIC'
      };

      const rawTemplates: TemplateItem[] = tmplRes.data.success ? (tmplRes.data.data || []) : [];
      
      // Seed all 9 canonical templates in order
      const templateMap = new Map<string, TemplateItem>();
      SYSTEM_TEMPLATES_SEED_LIST.forEach(seed => {
        templateMap.set(seed.code, { ...seed });
      });

      // Merge database templates into canonical packs
      rawTemplates.forEach(dbItem => {
        const canonicalCode = CANONICAL_TEMPLATE_MAP[dbItem.code.toUpperCase()] || dbItem.code;
        if (templateMap.has(canonicalCode)) {
          const current = templateMap.get(canonicalCode)!;
          templateMap.set(canonicalCode, {
            ...current,
            id: dbItem.id || current.id,
            collegesCount: (current.collegesCount || 0) + (dbItem.collegesCount || 0),
            isActive: dbItem.isActive ?? current.isActive,
            defaultThemeId: dbItem.defaultThemeId || current.defaultThemeId
          });
        } else if (!dbItem.isSystem) {
          templateMap.set(dbItem.code, dbItem);
        }
      });

      const mergedTemplates = Array.from(templateMap.values());
      setTemplates(mergedTemplates);

      // Merge Themes to guarantee all 9 dedicated palettes exist
      const rawThemes: Theme[] = themeRes.data.success ? (themeRes.data.data || []) : [];
      const themeMap = new Map<string, Theme>();

      SYSTEM_THEMES_SEED_LIST.forEach(seed => {
        themeMap.set(seed.code, { ...seed });
      });

      rawThemes.forEach(dbTheme => {
        const code = dbTheme.code?.toUpperCase();
        if (code && themeMap.has(code)) {
          const current = themeMap.get(code)!;
          themeMap.set(code, {
            ...current,
            id: dbTheme.id || current.id,
            isActive: dbTheme.isActive ?? current.isActive,
            configuration: dbTheme.configuration || current.configuration
          });
        } else if (code) {
          themeMap.set(code, dbTheme);
        }
      });

      const mergedThemes = Array.from(themeMap.values());
      setThemes(mergedThemes);

      if (colRes.data.success) {
        const cols = colRes.data.data || [];
        setColleges(cols);
        if (cols.length > 0 && !selectedCollegeId) {
          setSelectedCollegeId(String(cols[0].id));
        }
      }

      if (featRes.data.success) {
        setFeatures(featRes.data.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load platform data');
      setTemplates(SYSTEM_TEMPLATES_SEED_LIST);
      setThemes(SYSTEM_THEMES_SEED_LIST);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateDrawer = () => {
    setFormMode('create');
    setEditingId(null);
    setFormError(null);
    setFormData({
      code: '',
      name: '',
      category: 'Engineering & Technology',
      description: '',
      defaultThemeId: themes[0]?.id ? String(themes[0].id) : '',
      supportedThemes: themes.map(t => t.code),
      recommendedFeatures: [
        'PAGES', 'SECTIONS', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'NOTICES',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT',
        'HOSTELS', 'LIBRARY', 'ALUMNI', 'ADMISSIONS', 'CONTACT'
      ],
      isActive: true
    });
    setIsFormOpen(true);
  };

  const openEditDrawer = (tmpl: TemplateItem) => {
    setFormMode('edit');
    setEditingId(tmpl.id);
    setFormError(null);
    setFormData({
      code: tmpl.code,
      name: tmpl.name,
      category: formatCategoryName(tmpl.category),
      description: tmpl.description || '',
      defaultThemeId: tmpl.defaultThemeId ? String(tmpl.defaultThemeId) : '',
      supportedThemes: tmpl.supportedThemes || [],
      recommendedFeatures: tmpl.recommendedFeatures || [],
      isActive: tmpl.isActive
    });
    setIsFormOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Template name is required');
      return;
    }
    if (formMode === 'create' && !formData.code.trim()) {
      setFormError('Template code is required');
      return;
    }

    try {
      setFormSaving(true);
      setFormError(null);

      if (formMode === 'create') {
        const payload: CreateTemplatePayload = {
          code: formData.code.trim().toUpperCase(),
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          defaultThemeId: formData.defaultThemeId ? formData.defaultThemeId : undefined,
          supportedThemes: formData.supportedThemes,
          recommendedFeatures: formData.recommendedFeatures,
          isActive: formData.isActive
        };

        const res = await apiClient.post('/superadmin/templates', payload);
        if (res.data.success) {
          setIsFormOpen(false);
          showNotification(`Template "${payload.name}" created successfully!`);
          await fetchData();
        } else {
          setFormError(res.data.message || 'Failed to create template');
        }
      } else {
        const payload: UpdateTemplatePayload = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          defaultThemeId: formData.defaultThemeId ? formData.defaultThemeId : undefined,
          supportedThemes: formData.supportedThemes,
          recommendedFeatures: formData.recommendedFeatures,
          isActive: formData.isActive
        };

        const res = await apiClient.put(`/superadmin/templates/${editingId}`, payload);
        if (res.data.success) {
          setIsFormOpen(false);
          showNotification(`Template "${payload.name}" updated successfully!`);
          await fetchData();
        } else {
          setFormError(res.data.message || 'Failed to update template');
        }
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save template');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await apiClient.delete(`/superadmin/templates/${deleteTarget.id}`);
      if (res.data.success) {
        showNotification(`Template "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        await fetchData();
      } else {
        setError(res.data.message || 'Failed to delete template');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete template');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  // Fixed Assign Template API call aligned with backend endpoint: POST /superadmin/templates/assign?tenantId={id}
  const handleAssignTemplate = async () => {
    if (!assigningTemplate || !selectedCollegeId) return;
    try {
      setAssigning(true);
      const res = await apiClient.post(`/superadmin/templates/assign?tenantId=${selectedCollegeId}`, {
        templateCode: assigningTemplate.code,
        seedStarterData: seedData
      });
      if (res.data.success) {
        showNotification(`Template "${assigningTemplate.name}" assigned successfully! ${seedData ? 'Starter blueprints seeded into college database.' : ''}`);
        setAssignModalOpen(false);
        await fetchData();
      } else {
        setError(res.data.message || 'Failed to assign template');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to assign template');
    } finally {
      setAssigning(false);
    }
  };

  const toggleFormFeature = (fCode: string) => {
    setFormData(prev => ({
      ...prev,
      recommendedFeatures: prev.recommendedFeatures.includes(fCode)
        ? prev.recommendedFeatures.filter(c => c !== fCode)
        : [...prev.recommendedFeatures, fCode]
    }));
  };

  const categories = [
    'ALL',
    'Engineering & Technology',
    'Arts & Science',
    'Medical & Healthcare',
    'University & Multi-Faculty',
    '3D Slanted Design',
    '3D Glassmorphism',
    '3D Isometric',
    '3D Kinetic Flip',
    '3D Neumorphic'
  ];

  // Fixed Category Filter Matching logic comparing normalized values
  const filteredTemplates = templates.filter(t => {
    const matchesCategory = 
      selectedCategory === 'ALL' || 
      normalizeCategoryKey(t.category) === normalizeCategoryKey(selectedCategory);
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatCategoryName(t.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalTemplates = templates.length;
  const activeTemplates = templates.filter(t => t.isActive).length;
  const totalCollegesUsing = templates.reduce((acc, t) => acc + (t.collegesCount || 0), 0);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 mb-2 border border-blue-100 dark:border-blue-900/50">
            <LayoutTemplate className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Platform Design System</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            College Website Templates & Blueprints
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Manage industry-specific website templates connected with default theme styles, recommended feature modules, and starter blueprints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Refresh templates"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Templates</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalTemplates}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
              {activeTemplates} Active
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Colleges Using</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{totalCollegesUsing}</span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/50">
              Live Sites
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Available Themes</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{themes.length}</span>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-900/50">
              Connected
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Feature Modules</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{features.length || 18}</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
              Selectable
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 dark:text-emerald-400 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 dark:text-red-400 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by code, name, or description..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Loading templates catalog...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
          <LayoutTemplate className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-slate-700 dark:text-slate-300 text-sm font-bold">No templates match your filter criteria.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Try searching for a different keyword or selecting "ALL" categories.</p>
          <button
            onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs font-bold hover:bg-blue-100 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map((tmpl) => {
            const defaultTheme = themes.find(t => String(t.id) === String(tmpl.defaultThemeId)) || 
                                 themes.find(t => t.code === tmpl.defaultThemeCode);
            const primaryColor = defaultTheme?.configuration?.primaryColor || tmpl.themeConfiguration?.primaryColor || '#1e40af';
            const secondaryColor = defaultTheme?.configuration?.secondaryColor || tmpl.themeConfiguration?.secondaryColor || '#f59e0b';
            const categoryLabel = formatCategoryName(tmpl.category);

            return (
              <div
                key={tmpl.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md dark:hover:border-slate-700 transition duration-200"
              >
                <div className="space-y-4">
                  {/* Top Bar: Template Number + Code Badge + Category Pill + Active Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-600 text-white shadow-2xs">
                        {getTemplateNumberBadge(tmpl.code).number}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl font-mono text-xs font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                        {tmpl.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                        <span>{getTemplateNumberBadge(tmpl.code).icon}</span>
                        <span>{categoryLabel}</span>
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        tmpl.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${tmpl.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {tmpl.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{tmpl.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{tmpl.description}</p>
                  </div>

                  {/* Connected Theme Swatch */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">Default Theme:</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-100">
                        {defaultTheme?.name || tmpl.defaultThemeName || tmpl.defaultThemeCode || 'Default Theme'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs" 
                          style={{ backgroundColor: primaryColor }} 
                          title={`Primary: ${primaryColor}`} 
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs" 
                          style={{ backgroundColor: secondaryColor }} 
                          title={`Secondary: ${secondaryColor}`} 
                        />
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {primaryColor} / {secondaryColor}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400">
                        {defaultTheme?.configuration?.fontFamily || 'Inter'}
                      </span>
                    </div>
                  </div>

                  {/* Recommended Features Tags with Friendly Labels */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        Recommended Modules ({tmpl.recommendedFeatures?.length || 0})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(tmpl.recommendedFeatures || []).slice(0, 6).map((fCode) => (
                        <span
                          key={fCode}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {formatFeatureName(fCode)}
                        </span>
                      ))}
                      {(tmpl.recommendedFeatures?.length || 0) > 6 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50">
                          +{(tmpl.recommendedFeatures?.length || 0) - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Colleges Using Info */}
                  <div className="flex items-center justify-end text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span
                      className="flex items-center gap-1.5 font-semibold"
                      title="Colleges assigned to this template"
                    >
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>Colleges Assigned:</span> <strong className="text-slate-800 dark:text-slate-200 font-bold">{tmpl.collegesCount || 0}</strong>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowcaseTmpl(tmpl);
                        setShowcaseModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-900/50 transition cursor-pointer"
                      title="Preview archetype details and feature package"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Preview Archetype</span>
                    </button>
                    <button
                      onClick={() => {
                        setAssigningTemplate(tmpl);
                        setAssignModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      title="Assign this template to an active college tenant"
                    >
                      <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Assign</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditDrawer(tmpl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition cursor-pointer"
                      title="Edit template configuration"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {!isSystemTemplate(tmpl) && (
                      <button
                        onClick={() => setDeleteTarget(tmpl)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition cursor-pointer"
                        title="Delete template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* Create / Edit Template Drawer */}
      <FormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'create' ? 'Create Website Template' : 'Edit Website Template'}
        subtitle={formMode === 'create' ? 'Define a new industry layout template with default theme and features' : `Updating ${formData.code}`}
        icon={<LayoutTemplate className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        mode={formMode}
        loading={formSaving}
        onSubmit={handleSaveTemplate}
        size="lg"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formMode === 'create' && (
            <Input
              label="Template Code"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. POLYTECHNIC_MODERN"
              helperText="Unique uppercase identifier for this template."
            />
          )}

          <Input
            label="Template Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Polytechnic & Diploma Modern"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Engineering & Technology', label: 'Engineering & Technology' },
              { value: 'Arts & Science', label: 'Arts & Science' },
              { value: 'Medical & Healthcare', label: 'Medical & Healthcare' },
              { value: 'University', label: 'University' },
              { value: 'General Higher Education', label: 'General Higher Education' },
            ]}
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the target audience, aesthetic tone, and key focus of this template."
          />

          <Select
            label="Connected Default Theme"
            value={formData.defaultThemeId}
            onChange={(e) => setFormData({ ...formData, defaultThemeId: e.target.value })}
            options={themes.map(t => ({
              value: String(t.id),
              label: `${t.name} (${t.code})`
            }))}
            helperText="When this template is selected during college onboarding, this theme is automatically assigned."
          />

          {/* Recommended Features Selection Grid */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Recommended Feature Modules ({formData.recommendedFeatures.length} selected)
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Check all modules that should be enabled by default when this template is picked:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
              {features.map((f) => {
                const isChecked = formData.recommendedFeatures.includes(f.code);
                return (
                  <button
                    type="button"
                    key={f.code}
                    onClick={() => toggleFormFeature(f.code)}
                    className={`p-2 rounded-lg text-left text-xs font-medium border transition cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="truncate">{formatFeatureName(f.code)}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <Switch
              label="Template Active"
              description="Inactive templates are hidden from the college creation wizard."
              checked={formData.isActive}
              onChange={(val) => setFormData({ ...formData, isActive: val })}
            />
          </div>
        </div>
      </FormDrawer>

      {/* Assign Template Drawer */}
      <FormDrawer
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Template to College"
        subtitle={assigningTemplate ? `Assign ${assigningTemplate.name} (${assigningTemplate.code}) to a college tenant.` : undefined}
        icon={<Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
        mode="create"
        loading={assigning}
        submitText={assigning ? 'Assigning...' : 'Confirm Assignment'}
        onSubmit={(e) => {
          e.preventDefault();
          handleAssignTemplate();
        }}
        size="md"
      >
        {assigningTemplate && (
          <div className="space-y-4">
            <Select
              label="Target College Tenant"
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              options={colleges.map(c => ({
                value: String(c.id),
                label: `${c.name} (${c.tenantCode})`
              }))}
            />

            <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 space-y-1 text-xs">
              <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Connected Theme Assignment
              </span>
              <p className="text-blue-700 dark:text-blue-300 text-[11px] leading-relaxed">
                Target college will automatically be configured with <strong>{assigningTemplate.defaultThemeName || 'Default Theme'}</strong>.
              </p>
            </div>

            <Switch
              label="Seed Starter Blueprint Data"
              description="Populate default pages, navigation menus and sections into this college's database."
              checked={seedData}
              onChange={setSeedData}
            />
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTemplate}
        title="Delete Template?"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.code})? Colleges currently using this template will continue using their seeded data, but this template will no longer be available.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Template'}
        variant="danger"
      />

      {/* Archetype Preview Showcase Drawer */}
      <Drawer
        isOpen={showcaseModalOpen}
        onClose={() => {
          setShowcaseModalOpen(false);
          setShowcaseTmpl(null);
        }}
        title="Template Archetype Specification"
        subtitle={showcaseTmpl ? `${showcaseTmpl.name} (${showcaseTmpl.code})` : undefined}
        icon={<LayoutTemplate className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        size="xl"
      >
        {showcaseTmpl && (() => {
          const meta = ARCHETYPE_METADATA[showcaseTmpl.code.toUpperCase()] || {
            packName: showcaseTmpl.name,
            loginTemplate: 'template1',
            loginStyleName: 'Standard Layout Archetype',
            loginStyleDesc: 'Clean responsive layout with standard theme branding.',
            heroHeadline: 'Excellence in Higher Education & Research',
            heroSub: 'Comprehensive multi-disciplinary academic institution with modern campus life.',
            layoutHighlights: [
              'Dynamic multi-section responsive homepage layout',
              'Modular departments, courses, and faculty profiles',
              'Integrated news, notices, and events announcements',
              'Institutional statutory compliance & disclosures'
            ],
            gradientBg: 'from-blue-600 to-indigo-900',
            badgeBg: 'bg-blue-100 text-blue-900'
          };

          const defaultTheme = themes.find(t => String(t.id) === String(showcaseTmpl.defaultThemeId)) || 
                               themes.find(t => t.code === showcaseTmpl.defaultThemeCode);
          const primaryColor = defaultTheme?.configuration?.primaryColor || showcaseTmpl.themeConfiguration?.primaryColor || '#1e40af';
          const secondaryColor = defaultTheme?.configuration?.secondaryColor || showcaseTmpl.themeConfiguration?.secondaryColor || '#f59e0b';
          const categoryLabel = formatCategoryName(showcaseTmpl.category);
          const badge = getTemplateNumberBadge(showcaseTmpl.code);

          return (
            <div className="space-y-6 text-slate-900 dark:text-slate-100 font-sans pb-4">
              {/* Header Hero Simulation Banner */}
              <div className={`p-6 rounded-3xl bg-gradient-to-r ${meta.gradientBg} text-white shadow-md relative overflow-hidden space-y-4`}>
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white font-black text-xs">
                      {badge.number}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-black/20 backdrop-blur-md text-white font-mono font-bold text-xs">
                      {showcaseTmpl.code}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold flex items-center gap-1.5">
                    <span>{badge.icon}</span>
                    <span>{categoryLabel}</span>
                  </span>
                </div>

                <div className="relative z-10 space-y-2 max-w-2xl">
                  <h3 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
                    {meta.heroHeadline}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {meta.heroSub}
                  </p>
                </div>

                {/* Simulated live visual badges */}
                <div className="relative z-10 flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/15 backdrop-blur-md text-white">
                    🎨 Theme: {defaultTheme?.name || showcaseTmpl.defaultThemeName || 'Curated Theme'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/15 backdrop-blur-md text-white">
                    🔒 Paired Login: {meta.loginStyleName}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/15 backdrop-blur-md text-white">
                    📦 22-Module Blueprint Connected
                  </span>
                </div>
              </div>

              {/* Grid: Connected Theme & Login Archetype Spec */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Theme Specification */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Default Color Palette
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {defaultTheme?.code || showcaseTmpl.defaultThemeCode || 'THEME_BLUE'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Theme Name:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {defaultTheme?.name || showcaseTmpl.defaultThemeName || 'Default Theme'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm" 
                        style={{ backgroundColor: primaryColor }} 
                        title={`Primary: ${primaryColor}`} 
                      />
                      <div 
                        className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm" 
                        style={{ backgroundColor: secondaryColor }} 
                        title={`Secondary: ${secondaryColor}`} 
                      />
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                        {primaryColor} / {secondaryColor}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {defaultTheme?.configuration?.fontFamily || 'Inter, sans-serif'}
                    </span>
                  </div>
                </div>

                {/* Login Archetype Specification */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Paired SuperAdmin & Tenant Login Style
                    </span>
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                      {meta.loginTemplate}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {meta.loginStyleName}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {meta.loginStyleDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Design & Layout Key Highlights */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Archetype Architecture & Design Highlights
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {meta.layoutHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-medium">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete 22-Module Blueprint Checklist */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Recommended Feature Modules ({showcaseTmpl.recommendedFeatures?.length || 22} Enabled)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                    Full Platform Parity
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(showcaseTmpl.recommendedFeatures || []).map((fCode) => (
                    <div 
                      key={fCode}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                        {formatFeatureName(fCode)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Drawer Footer Bar */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowcaseModalOpen(false);
                    setShowcaseTmpl(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Close Preview
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const t = showcaseTmpl;
                      setShowcaseModalOpen(false);
                      setShowcaseTmpl(null);
                      openEditDrawer(t);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Blueprint</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const t = showcaseTmpl;
                      setShowcaseModalOpen(false);
                      setShowcaseTmpl(null);
                      setAssigningTemplate(t);
                      setAssignModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Assign Template to College</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </Drawer>
    </div>
  );
};
