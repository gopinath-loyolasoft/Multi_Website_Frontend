import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Sparkles,
  Sliders,
  BarChart3,
  Quote,
  FileText,
  Image as ImageIcon,
  Building2,
  BookOpen,
  Users,
  Camera,
  Video,
  LayoutGrid,
  MessageSquare,
  Newspaper,
  Calendar,
  Bell,
  MapPin,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export interface SectionBlockPreset {
  type: string;
  name: string;
  category: 'HERO' | 'INSTITUTION' | 'ACADEMICS' | 'MEDIA' | 'UPDATES';
  categoryLabel: string;
  description: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultContent: any;
  defaultSettings?: any;
  wireframe: 'HERO_SLIDER' | 'STATS' | 'QUOTE' | 'DEPARTMENTS' | 'COURSES' | 'FACULTY' | 'GALLERY' | 'NEWS' | 'EVENTS' | 'NOTICES' | 'TESTIMONIALS' | 'CONTACT' | 'CARDS' | 'FAQ' | 'TEXT' | 'IMAGE_TEXT' | 'VIDEO';
}

export const SECTION_PRESETS: SectionBlockPreset[] = [
  // 1. Hero & Banners
  {
    type: 'HERO_SLIDER',
    name: 'Hero Slider & Highlights',
    category: 'HERO',
    categoryLabel: 'Hero & Banners',
    description: 'Rotating full-width photographic hero slider with dynamic headings, badges, and primary action buttons.',
    badge: 'High Impact',
    icon: Sliders,
    defaultTitle: 'Hero Showcase & Admissions',
    defaultSubtitle: 'Discover excellence in higher education, research, and campus life',
    wireframe: 'HERO_SLIDER',
    defaultContent: {
      slides: [
        {
          headline: 'Shaping Global Leaders of Tomorrow',
          caption: 'Empowering minds through innovation, accredited degree programs, and state-of-the-art facilities.',
          badge: 'Admissions Open 2026',
          buttonText: 'Explore Academic Programs',
          buttonUrl: '/courses',
          imageUrl: '/assets/templates/arts/banner1.svg',
        },
        {
          headline: 'Pioneering Research & Modern Laboratories',
          caption: 'Join a vibrant collegiate community dedicated to scientific discovery and ethical leadership.',
          badge: 'Campus Showcase',
          buttonText: 'Schedule Campus Visit',
          buttonUrl: '/contact',
          imageUrl: '/assets/templates/arts/banner2.svg',
        },
      ],
      autoplaySpeed: 6000,
      showArrows: true,
      showDots: true,
    },
    defaultSettings: {
      columns: 1,
      cardVariant: 'standard',
      alignment: 'center',
      background: 'dark',
      spacing: 'normal',
      containerWidth: 'full',
    },
  },
  {
    type: 'HERO',
    name: 'Split-Screen Hero Banner',
    category: 'HERO',
    categoryLabel: 'Hero & Banners',
    description: 'Modern two-column hero header with prominent headline, badge tag, action buttons, and a spotlight card.',
    badge: 'Popular',
    icon: Sliders,
    defaultTitle: 'Welcome to Our Campus',
    defaultSubtitle: 'Transformative education for a brighter future',
    wireframe: 'HERO_SLIDER',
    defaultContent: {
      badge: 'Academic Excellence',
      heading: 'Empowering the Next Generation of Innovators',
      subheading: 'Top-Ranked Multi-Disciplinary Institution',
      description: 'Experience world-class experiential learning, faculty mentorship, and cutting-edge campus facilities.',
      ctaText: 'Apply For Admission',
      ctaLink: '/admissions',
      secondaryCtaText: 'Browse Courses',
      secondaryCtaLink: '/courses',
      showRightCard: true,
      cardTitle: 'Admissions Open 2026',
      cardSubtitle: 'Undergraduate & Postgraduate Programs',
    },
  },

  // 2. Institutional & Milestones
  {
    type: 'STATISTICS',
    name: 'Key Statistics & Facts Ribbon',
    category: 'INSTITUTION',
    categoryLabel: 'Institutional',
    description: 'Eye-catching 4-counter milestone ribbon displaying student numbers, degrees, faculty, and accreditations.',
    badge: 'Essential',
    icon: BarChart3,
    defaultTitle: 'Key Numbers & Institutional Milestones',
    defaultSubtitle: 'Verified metrics reflecting our dedication to educational quality',
    wireframe: 'STATS',
    defaultContent: {
      items: [
        { label: 'Active Students', value: '8,500', suffix: '+', iconName: 'Users' },
        { label: 'Degree Programs', value: '45', suffix: '+', iconName: 'BookOpen' },
        { label: 'Faculty Mentors', value: '320', suffix: '+', iconName: 'Award' },
        { label: 'Graduation Rate', value: '98.5', suffix: '%', iconName: 'GraduationCap' },
      ],
    },
    defaultSettings: {
      columns: 4,
      cardVariant: 'elevated',
      alignment: 'center',
      background: 'light',
      spacing: 'compact',
    },
  },
  {
    type: 'QUOTE',
    name: 'Leadership Message / Quote',
    category: 'INSTITUTION',
    categoryLabel: 'Institutional',
    description: 'Prestigious quote block with portrait photo, inspiring vision statement, and Chancellor / Principal designation.',
    icon: Quote,
    defaultTitle: 'Leadership & Academic Vision',
    defaultSubtitle: 'A welcome address from the Office of the Chancellor',
    wireframe: 'QUOTE',
    defaultContent: {
      quoteText: 'Our fundamental mission is to cultivate curious minds, foster ethical citizenship, and equip learners to solve the pressing challenges of our era.',
      authorName: 'Dr. Aruna Krishnan, Ph.D.',
      designation: 'Principal & Dean of Academics',
      authorImageUrl: '/assets/templates/common/leader_portrait.svg',
      subText: 'Office of Academic Governance',
    },
  },
  {
    type: 'TEXT',
    name: 'About Overview & Paragraphs',
    category: 'INSTITUTION',
    categoryLabel: 'Institutional',
    description: 'Clean typographic story layout for Vision & Mission, campus history, or institutional profile text.',
    icon: FileText,
    defaultTitle: 'About Our Institution',
    defaultSubtitle: 'A heritage of classical academic rigor and progressive discovery',
    wireframe: 'TEXT',
    defaultContent: {
      leadText: 'Founded with a dedication to accessible and transformative higher education.',
      bodyHtml: '<p>Our college blends classical intellectual tradition with cutting-edge experiential learning. Our departments span emerging sciences, humanities, management, and technical innovation.</p>',
    },
  },
  {
    type: 'IMAGE_TEXT',
    name: 'Split Media & Narrative',
    category: 'INSTITUTION',
    categoryLabel: 'Institutional',
    description: 'Side-by-side layout featuring a crisp photo on one side and an engaging narrative with bullet points on the other.',
    icon: ImageIcon,
    defaultTitle: 'State-of-the-Art Campus & Research Labs',
    defaultSubtitle: 'Designed to foster interdisciplinary collaboration',
    wireframe: 'IMAGE_TEXT',
    defaultContent: {
      imageUrl: '/assets/templates/arts/banner2.svg',
      imagePosition: 'left',
      heading: 'Pioneering Research Ecosystem',
      description: 'Modern computing clusters, automated scientific laboratories, and digitized research libraries accessible 24/7 for all students and faculty fellows.',
      buttonText: 'Learn More',
      buttonUrl: '/about',
    },
  },

  // 3. Academics & Faculty
  {
    type: 'DEPARTMENTS',
    name: 'Academic Departments Grid',
    category: 'ACADEMICS',
    categoryLabel: 'Academics',
    description: 'Auto-linked grid of academic departments (e.g. Computer Science, Biotechnology, Commerce, Humanities).',
    badge: 'Dynamic Link',
    icon: Building2,
    defaultTitle: 'Academic Departments & Schools',
    defaultSubtitle: 'Explore our specialized faculties offering undergraduate, postgraduate, and doctoral streams',
    wireframe: 'DEPARTMENTS',
    defaultContent: {
      limit: 6,
      showExploreButton: true,
    },
    defaultSettings: {
      columns: 3,
      cardVariant: 'elevated',
      alignment: 'left',
    },
  },
  {
    type: 'COURSES',
    name: 'Degree Programs & Curricula',
    category: 'ACADEMICS',
    categoryLabel: 'Academics',
    description: 'Interactive showcase of degree courses (B.Sc, B.Tech, M.A, MBA) with duration, eligibility, and syllabus links.',
    badge: 'Dynamic Link',
    icon: BookOpen,
    defaultTitle: 'Undergraduate & Postgraduate Programs',
    defaultSubtitle: 'Industry-accredited degree pathways tailored for career excellence',
    wireframe: 'COURSES',
    defaultContent: {
      limit: 6,
      category: 'ALL',
      showExploreButton: true,
    },
    defaultSettings: {
      columns: 3,
      cardVariant: 'standard',
    },
  },
  {
    type: 'FACULTY',
    name: 'Distinguished Faculty Directory',
    category: 'ACADEMICS',
    categoryLabel: 'Academics',
    description: 'Showcases professor profiles, doctoral credentials, designations, and department research specializations.',
    icon: Users,
    defaultTitle: 'Distinguished Faculty & Scholars',
    defaultSubtitle: 'Mentored by renowned academicians, researchers, and industry specialists',
    wireframe: 'FACULTY',
    defaultContent: {
      limit: 6,
      showDesignation: true,
    },
    defaultSettings: {
      columns: 4,
      cardVariant: 'elevated',
    },
  },

  // 4. Media & Visuals
  {
    type: 'GALLERY',
    name: 'Campus Photo Gallery',
    category: 'MEDIA',
    categoryLabel: 'Media & Life',
    description: 'Filterable photo album grid with category tabs (Campus, Cultural, Sports, Labs) and full-screen lightbox zoom.',
    badge: 'Popular',
    icon: Camera,
    defaultTitle: 'Life on Campus — Photo Gallery',
    defaultSubtitle: 'A visual journey across our architecture, festivals, laboratories, and student activities',
    wireframe: 'GALLERY',
    defaultContent: {
      limit: 8,
      categoryFilter: 'ALL',
    },
    defaultSettings: {
      columns: 4,
      cardVariant: 'minimal',
    },
  },
  {
    type: 'CARDS',
    name: 'Feature Highlights Grid',
    category: 'MEDIA',
    categoryLabel: 'Media & Life',
    description: 'Custom multi-column feature cards with distinct icon badges, titles, descriptions, and action links.',
    icon: LayoutGrid,
    defaultTitle: 'Why Choose Our Institution?',
    defaultSubtitle: 'Pillars of academic distinction and student empowerment',
    wireframe: 'CARDS',
    defaultContent: {
      items: [
        {
          title: 'Autonomous & Accredited',
          desc: 'Recognized curricula aligned with modern global industry standards.',
          icon: 'Award',
        },
        {
          title: 'Research & Innovation',
          desc: 'Funded laboratories, patent filing assistance, and incubator center.',
          icon: 'Sparkles',
        },
        {
          title: 'Global Career Mentorship',
          desc: '150+ top institutional recruiters and dedicated career development cell.',
          icon: 'TrendingUp',
        },
      ],
    },
    defaultSettings: {
      columns: 3,
      cardVariant: 'elevated',
      alignment: 'center',
    },
  },
  {
    type: 'TESTIMONIALS',
    name: 'Student Testimonials & Stories',
    category: 'MEDIA',
    categoryLabel: 'Media & Life',
    description: 'Slider or grid of genuine student experiences, graduate quotes, ratings, and career achievements.',
    icon: MessageSquare,
    defaultTitle: 'Student Voices & Alumni Success',
    defaultSubtitle: 'Inspiring stories from our graduates making an impact worldwide',
    wireframe: 'TESTIMONIALS',
    defaultContent: {
      items: [
        {
          name: 'Priyanka Sharma',
          role: 'B.Tech Computer Science, Class of 2024',
          quote: 'The faculty mentorship and practical laboratory projects prepared me thoroughly for my career in software engineering.',
          avatarUrl: '/assets/student1.jpg',
        },
        {
          name: 'Karthik Ramanathan',
          role: 'B.Com Honours, Class of 2024',
          quote: 'An extraordinary journey of leadership and professional skill building. The student culture is vibrant and supportive.',
          avatarUrl: '/assets/student2.jpg',
        },
      ],
    },
    defaultSettings: {
      columns: 2,
      cardVariant: 'elevated',
    },
  },
  {
    type: 'VIDEO',
    name: 'Campus Video Tour Spotlight',
    category: 'MEDIA',
    categoryLabel: 'Media & Life',
    description: 'Embedded video player spotlighting campus overview tour, convocation ceremony, or documentary.',
    icon: Video,
    defaultTitle: 'Experience Our Campus in Motion',
    defaultSubtitle: 'Take a virtual walkthrough of our lecture halls, sports arena, and research center',
    wireframe: 'VIDEO',
    defaultContent: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      coverImageUrl: '/assets/templates/arts/banner1.svg',
      caption: 'Annual Campus Documentary & Infrastructure Walkthrough',
    },
  },

  // 5. Updates & Communication
  {
    type: 'NEWS',
    name: 'Latest Campus News Feed',
    category: 'UPDATES',
    categoryLabel: 'News & Contact',
    description: 'Chronological campus press bulletin with publication dates, headline summaries, and article links.',
    badge: 'Live Feed',
    icon: Newspaper,
    defaultTitle: 'Campus Press & Announcements',
    defaultSubtitle: 'Stay informed with the latest milestones, honors, and campus press releases',
    wireframe: 'NEWS',
    defaultContent: {
      limit: 3,
      showExploreButton: true,
    },
    defaultSettings: {
      columns: 3,
      cardVariant: 'elevated',
    },
  },
  {
    type: 'EVENTS',
    name: 'Upcoming Events Calendar',
    category: 'UPDATES',
    categoryLabel: 'News & Contact',
    description: 'Interactive calendar cards with day/month date badge, event venue, time, and registration button.',
    badge: 'Live Feed',
    icon: Calendar,
    defaultTitle: 'Upcoming Events & Symposiums',
    defaultSubtitle: 'Academic conferences, cultural fests, workshops, and inter-collegiate sports',
    wireframe: 'EVENTS',
    defaultContent: {
      limit: 3,
      showExploreButton: true,
    },
    defaultSettings: {
      columns: 3,
      cardVariant: 'standard',
    },
  },
  {
    type: 'NOTICES',
    name: 'Official Circulars & Notice Board',
    category: 'UPDATES',
    categoryLabel: 'News & Contact',
    description: 'Administrative notice board with urgent tags, circular dates, and downloadable attachments.',
    badge: 'Live Feed',
    icon: Bell,
    defaultTitle: 'Official Notice Board & Circulars',
    defaultSubtitle: 'Important administrative alerts, exam schedules, and academic circulars',
    wireframe: 'NOTICES',
    defaultContent: {
      limit: 4,
    },
  },
  {
    type: 'CONTACT',
    name: 'Campus Helpdesk & Location',
    category: 'UPDATES',
    categoryLabel: 'News & Contact',
    description: 'Two-column layout containing official address, phone/email directory, admissions inquiry form, and location map.',
    icon: MapPin,
    defaultTitle: 'Get in Touch with Our Campus',
    defaultSubtitle: 'Admissions desk, student affairs, and administrative office contacts',
    wireframe: 'CONTACT',
    defaultContent: {
      showInquiryForm: true,
      showMap: true,
    },
  },
  {
    type: 'FAQ',
    name: 'Frequently Asked Questions (FAQ)',
    category: 'UPDATES',
    categoryLabel: 'News & Contact',
    description: 'Clean expandable accordions answering common student questions about admissions, fees, hostel, and scholarships.',
    icon: HelpCircle,
    defaultTitle: 'Frequently Asked Questions',
    defaultSubtitle: 'Quick answers regarding admissions, campus life, scholarships, and examinations',
    wireframe: 'FAQ',
    defaultContent: {
      items: [
        {
          question: 'How do I apply for admissions?',
          answer: 'You can apply online by visiting the Admissions portal or by visiting the campus administrative desk with required academic certificates.',
        },
        {
          question: 'Are merit scholarships available?',
          answer: 'Yes, merit and sports scholarships are available for deserving candidates across all undergraduate and postgraduate faculties.',
        },
        {
          question: 'What hostel facilities are provided?',
          answer: 'The campus features dedicated modern residential hostels with high-speed Wi-Fi, 24/7 security, gym facilities, and nutritious dining halls.',
        },
      ],
    },
  },
];

interface VisualSectionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: SectionBlockPreset) => void;
}

export const VisualSectionPickerModal: React.FC<VisualSectionPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'ALL', label: 'All Section Blocks' },
    { id: 'HERO', label: '🌟 Hero & Banners' },
    { id: 'INSTITUTION', label: '🏛️ Institutional' },
    { id: 'ACADEMICS', label: '🎓 Academics & Faculty' },
    { id: 'MEDIA', label: '📸 Media & Life' },
    { id: 'UPDATES', label: '📢 News & Contact' },
  ];

  const filteredPresets = useMemo(() => {
    return SECTION_PRESETS.filter((item) => {
      const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Choose a Section Block
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a visual block template to insert directly into your page layout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search section types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Section Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-950/30">
          {filteredPresets.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-bold">No matching section blocks found</p>
              <p className="text-xs mt-1">Try another keyword or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((preset) => {
                const Icon = preset.icon;
                return (
                  <div
                    key={preset.type}
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                  >
                    {/* Top Schematic Wireframe Mockup */}
                    <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/50 p-3 mb-3 flex flex-col justify-center items-center relative overflow-hidden group-hover:bg-blue-50/40 dark:group-hover:bg-blue-950/20 transition-colors">
                      {/* Wireframe Schematics */}
                      {preset.wireframe === 'HERO_SLIDER' && (
                        <div className="w-full h-full flex flex-col justify-center items-center space-y-1.5 text-center">
                          <div className="w-16 h-2 rounded bg-blue-500/80" />
                          <div className="w-28 h-1.5 rounded bg-slate-300 dark:bg-slate-600" />
                          <div className="flex gap-1.5 pt-1">
                            <div className="w-10 h-3 rounded bg-blue-600" />
                            <div className="w-10 h-3 rounded bg-slate-300 dark:bg-slate-600" />
                          </div>
                        </div>
                      )}

                      {preset.wireframe === 'STATS' && (
                        <div className="w-full grid grid-cols-4 gap-1.5 px-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded p-1.5 text-center shadow-2xs">
                              <div className="w-4 h-1.5 bg-blue-500 mx-auto rounded mb-1" />
                              <div className="w-6 h-1 bg-slate-300 dark:bg-slate-700 mx-auto rounded" />
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'QUOTE' && (
                        <div className="w-full flex items-center gap-3 px-3">
                          <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <div className="w-full h-1.5 bg-slate-400 dark:bg-slate-500 rounded" />
                            <div className="w-3/4 h-1.5 bg-slate-300 dark:bg-slate-600 rounded" />
                            <div className="w-1/2 h-1 bg-blue-500 rounded" />
                          </div>
                        </div>
                      )}

                      {preset.wireframe === 'DEPARTMENTS' && (
                        <div className="w-full grid grid-cols-3 gap-1.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded p-2 text-center shadow-2xs">
                              <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/50 mx-auto mb-1" />
                              <div className="w-8 h-1 bg-slate-400 mx-auto rounded" />
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'COURSES' && (
                        <div className="w-full grid grid-cols-3 gap-1.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded p-1.5 shadow-2xs space-y-1">
                              <div className="w-full h-8 rounded bg-slate-200 dark:bg-slate-700" />
                              <div className="w-10 h-1 bg-slate-400 rounded" />
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'FACULTY' && (
                        <div className="w-full grid grid-cols-3 gap-2 px-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 mb-1" />
                              <div className="w-8 h-1 bg-slate-400 rounded" />
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'GALLERY' && (
                        <div className="w-full grid grid-cols-3 gap-1">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-9 rounded bg-slate-200 dark:bg-slate-700" />
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'NEWS' && (
                        <div className="w-full space-y-1.5 px-3">
                          {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded shadow-2xs">
                              <div className="w-6 h-6 rounded bg-blue-500/20 shrink-0" />
                              <div className="space-y-1 flex-1">
                                <div className="w-3/4 h-1.5 bg-slate-400 rounded" />
                                <div className="w-1/2 h-1 bg-slate-300 dark:bg-slate-600 rounded" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'EVENTS' && (
                        <div className="w-full grid grid-cols-2 gap-2 px-2">
                          {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded shadow-2xs">
                              <div className="w-6 h-6 rounded bg-amber-500/20 text-[8px] font-bold text-amber-600 flex items-center justify-center shrink-0">
                                15
                              </div>
                              <div className="space-y-0.5 flex-1">
                                <div className="w-full h-1 bg-slate-400 rounded" />
                                <div className="w-2/3 h-1 bg-slate-300 rounded" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'CONTACT' && (
                        <div className="w-full grid grid-cols-2 gap-2 px-2">
                          <div className="space-y-1.5">
                            <div className="w-full h-1.5 bg-slate-400 rounded" />
                            <div className="w-3/4 h-1 bg-slate-300 rounded" />
                            <div className="w-1/2 h-1 bg-slate-300 rounded" />
                          </div>
                          <div className="h-16 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      )}

                      {preset.wireframe === 'CARDS' && (
                        <div className="w-full grid grid-cols-3 gap-1.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded p-1.5 text-center shadow-2xs">
                              <div className="w-4 h-4 rounded-full bg-blue-500/20 mx-auto mb-1" />
                              <div className="w-6 h-1 bg-slate-400 mx-auto rounded" />
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'TESTIMONIALS' && (
                        <div className="w-full grid grid-cols-2 gap-2 px-2">
                          {[1, 2].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-2 rounded shadow-2xs space-y-1">
                              <div className="w-full h-1 bg-slate-400 rounded" />
                              <div className="w-2/3 h-1 bg-slate-300 rounded" />
                              <div className="w-1/2 h-1 bg-blue-500 rounded" />
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'FAQ' && (
                        <div className="w-full space-y-1.5 px-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-900 p-1.5 rounded shadow-2xs">
                              <div className="w-3/4 h-1 bg-slate-400 rounded" />
                              <div className="w-2 h-2 rounded bg-slate-300" />
                            </div>
                          ))}
                        </div>
                      )}

                      {preset.wireframe === 'TEXT' && (
                        <div className="w-full space-y-1.5 px-4">
                          <div className="w-1/2 h-2 bg-blue-500 rounded" />
                          <div className="w-full h-1.5 bg-slate-400 rounded" />
                          <div className="w-5/6 h-1.5 bg-slate-300 rounded" />
                          <div className="w-4/5 h-1.5 bg-slate-300 rounded" />
                        </div>
                      )}

                      {preset.wireframe === 'IMAGE_TEXT' && (
                        <div className="w-full grid grid-cols-2 gap-2 px-2">
                          <div className="h-16 rounded bg-slate-200 dark:bg-slate-700" />
                          <div className="space-y-1.5 pt-1">
                            <div className="w-full h-1.5 bg-blue-500 rounded" />
                            <div className="w-4/5 h-1 bg-slate-400 rounded" />
                            <div className="w-3/4 h-1 bg-slate-300 rounded" />
                          </div>
                        </div>
                      )}

                      {preset.wireframe === 'VIDEO' && (
                        <div className="w-full h-full rounded bg-slate-900 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                            <div className="w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-white ml-0.5" />
                          </div>
                        </div>
                      )}

                      {preset.wireframe === 'NOTICES' && (
                        <div className="w-full space-y-1.5 px-3">
                          {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded shadow-2xs">
                              <Bell className="w-3 h-3 text-red-500" />
                              <div className="w-3/4 h-1 bg-slate-400 rounded" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Badge in top right */}
                      {preset.badge && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {preset.badge}
                        </span>
                      )}
                    </div>

                    {/* Card Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {preset.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {preset.categoryLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Select Block</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
