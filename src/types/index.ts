export interface Tenant {
  id: string | number;
  tenantCode: string;
  name: string;
  slug: string;
  status: string;
  provisioningStatus?: string;
  defaultThemeId?: string | number;
  dbConnectionString?: string;
  primaryDomain?: string;
  databaseName?: string;
  adminUsername?: string;
  templateCode?: string;
  loginTemplate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ThemeConfig {
  themeName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  headerStyle?: string;
  badgeText?: string;
  loginTemplate?: string;
}

export interface Theme {
  id: string | number;
  name: string;
  code: string;
  configuration?: ThemeConfig;
  isActive: boolean;
}

export interface MenuItem {
  id: string | number;
  menuId: string | number;
  parentId?: string | number | null;
  itemType?: string;
  targetType?: string;
  pageId?: string | number | null;
  title: string;
  url?: string;
  sortOrder: number;
  isExternal?: boolean;
  isVisible?: boolean;
  isActive?: boolean;
  openInNewTab?: boolean;
  icon?: string;
  children?: MenuItem[];
}

export interface MarqueeSettings {
  id?: string | number;
  isActive: boolean;
  speed: 'slow' | 'medium' | 'fast' | string;
  pauseOnHover: boolean;
  bgColor: string;
  textColor: string;
  badgeBgColor: string;
  updatedAt?: string;
}

export interface MarqueeItem {
  id: string | number;
  badgeText?: string;
  message: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export interface MarqueeData {
  settings: MarqueeSettings;
  items: MarqueeItem[];
}

export interface StatsSettings {
  id?: string | number;
  badge?: string;
  title?: string;
  subtitle?: string;
  isActive?: boolean;
  updatedAt?: string;
}

export interface SiteConfig {
  tenant: Tenant;
  theme?: Theme;
  templateCode?: string;
  primaryMenu: MenuItem[];
  enabledFeatures?: string[];
  settings?: any;
  banners?: any[];
  marquee?: MarqueeData;
  stats?: StatItem[];
  statsSettings?: StatsSettings;
  quote?: QuoteSettings;
}

export interface SectionSettings {
  columns?: number;
  cardVariant?: 'standard' | 'elevated' | 'bordered' | 'minimal';
  alignment?: 'left' | 'center';
  background?: 'light' | 'muted' | 'dark' | 'gradient';
  spacing?: 'compact' | 'normal' | 'large';
  containerWidth?: 'narrow' | 'standard' | 'full';
  customCssClass?: string;
  anchorId?: string;
}

export interface PageSection {
  id: string | number;
  pageId: string | number;
  sectionType: 'HERO' | 'TEXT' | 'IMAGE_TEXT' | 'NEWS' | 'EVENTS' | string;
  title?: string;
  subtitle?: string;
  content: any;
  settings?: SectionSettings;
  sortOrder: number;
  isVisible: boolean;
}

export interface PageData {
  id: string | number;
  slug: string;
  title: string;
  metaDescription?: string;
  isPublished: boolean;
  sections: PageSection[];
}

export interface NewsItem {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl?: string;
  publishedDate: string;
  isPublished: boolean;
  category?: string;
}

export interface EventItem {
  id: string | number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl?: string;
  isPublished: boolean;
  category?: string;
  time?: string;
}

export interface NoticeItem {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  pdfUrl?: string;
  category: string;
  publishDate: string;
  expiryDate?: string;
  isPublished: boolean;
  isImportant: boolean;
}

// --- CMS Expanded Section Types ---
export interface DocumentItem {
  id?: string | number;
  title: string;
  description?: string;
  category?: string;
  fileUrl: string;
  fileType?: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP' | string;
  fileSize?: string;
  publishDate?: string;
  openInNewTab?: boolean;
  sortOrder?: number;
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableSectionContent {
  title?: string;
  subtitle?: string;
  columns?: TableColumn[];
  rows?: Record<string, any>[];
  striped?: boolean;
  bordered?: boolean;
  searchable?: boolean;
}

export interface TimelineItem {
  id?: string | number;
  year: string;
  title: string;
  description?: string;
  badge?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface TabItem {
  id?: string | number;
  title: string;
  icon?: string;
  badge?: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface TestimonialItem {
  id?: string | number;
  name: string;
  role?: string;
  batch?: string;
  degree?: string;
  company?: string;
  avatarUrl?: string;
  quote: string;
  rating?: number;
}

export interface EmbedSectionContent {
  title?: string;
  subtitle?: string;
  embedUrl: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'custom';
  heightPx?: number;
  allowFullscreen?: boolean;
  caption?: string;
}

export interface AuthState {
  token: string | null;
  username: string | null;
  fullName: string | null;
  role: string | null;
  tenantId: string | number | null;
  tenantCode: string | null;
}

// -------------------------------------------------------------
// SuperAdmin Specific Interfaces
// -------------------------------------------------------------

export interface SuperAdminDashboardStats {
  totalColleges: number;
  activeColleges: number;
  suspendedColleges: number;
  totalDomains: number;
  totalDatabases: number;
  totalCollegeAdmins: number;
  recentColleges: Tenant[];
  recentActivity: AuditLogItem[];
}

export interface DomainItem {
  id: string | number;
  tenantId: string | number;
  tenantCode: string;
  domain: string;
  domainType: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface DatabaseRegistryItem {
  id: string | number;
  tenantId: string | number;
  tenantCode: string;
  tenantName: string;
  databaseName: string;
  host: string;
  port: number;
  dbUser: string;
  status: string;
  currentMigrationVersion: string;
  lastHealthCheckAt: string;
  createdAt: string;
}

export interface FeatureItem {
  id: string | number;
  code: string;
  name: string;
  description: string;
  category?: string;
  icon?: string;
  sortOrder?: number;
  isActive: boolean;
  collegesUsingCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeatureSummary {
  totalFeatures: number;
  activeFeatures: number;
  disabledFeatures: number;
  categoriesCount: number;
  totalColleges?: number;
  totalAssignments: number;
}

export interface FeatureCollegeUsage {
  featureCode: string;
  featureName: string;
  colleges: {
    tenantId: string | number;
    tenantCode: string;
    collegeName: string;
    isEnabled: boolean;
    primaryDomain?: string;
  }[];
}

export interface CollegeFeatureStatus {
  tenantId: string | number;
  tenantCode: string;
  collegeName: string;
  isEnabled: boolean;
  primaryDomain?: string;
}

export interface CreateFeaturePayload {
  code: string;
  name: string;
  description: string;
  category?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateFeaturePayload {
  name: string;
  description: string;
  category?: string;
  icon?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface TenantFeatureItem {
  featureCode: string;
  featureName: string;
  description: string;
  isEnabled: boolean;
}

export interface AuditLogItem {
  id: string | number;
  userId?: string | number | null;
  username: string;
  tenantId?: string | number | null;
  tenantCode?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface AdminUserItem {
  id: string | number;
  tenantId?: string | number | null;
  tenantCode?: string | null;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface CollegeDetails {
  tenant: Tenant;
  domains: DomainItem[];
  database?: DatabaseRegistryItem;
  theme?: Theme;
  features: TenantFeatureItem[];
  admins: AdminUserItem[];
  auditLogs: AuditLogItem[];
}

export interface CreateCollegeWorkflowRequest {
  tenantCode: string;
  name: string;
  slug: string;
  primaryDomain: string;
  databaseName?: string;
  defaultThemeId?: string | number;
  templateCode?: string;
  loginTemplate?: string;
  enabledFeatures?: string[];
  adminUsername?: string;
  adminEmail?: string;
  adminFullName?: string;
  adminPassword?: string;
}

export interface TemplateItem {
  id: string | number;
  code: string;
  name: string;
  category: string;
  description?: string;
  defaultThemeId?: string | number;
  defaultThemeCode?: string;
  defaultThemeName?: string;
  themeConfiguration?: ThemeConfig;
  supportedThemes?: string[];
  recommendedFeatures?: string[];
  starterPages?: any[];
  starterMenus?: any[];
  isActive: boolean;
  isSystem?: boolean;
  collegesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplatePayload {
  code: string;
  name: string;
  category: string;
  description: string;
  defaultThemeId?: string | number;
  supportedThemes?: string[];
  recommendedFeatures?: string[];
  starterPagesJson?: string;
  starterMenusJson?: string;
  isActive?: boolean;
}

export interface UpdateTemplatePayload {
  name: string;
  category: string;
  description: string;
  defaultThemeId?: string | number;
  supportedThemes?: string[];
  recommendedFeatures?: string[];
  starterPagesJson?: string;
  starterMenusJson?: string;
  isActive?: boolean;
}

export interface AssignTemplatePayload {
  tenantId: string | number;
  seedStarterData?: boolean;
}

export interface AdminModuleItem {
  featureCode: string;
  name: string;
  category: string;
  icon: string;
  path: string;
  sortOrder: number;
}

export interface CollegeCapabilities {
  tenantId: string | number;
  tenantCode: string;
  tenantName: string;
  templateCode: string;
  templateName: string;
  themeId?: string | number;
  themeCode?: string;
  themeName?: string;
  themeConfiguration?: ThemeConfig;
  enabledFeatures: string[];
  modules: AdminModuleItem[];
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  iconName?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface QuoteSettings {
  id?: string;
  quoteText: string;
  authorName: string;
  designation?: string;
  authorTitle?: string;
  authorImage?: string;
  authorImageUrl?: string;
  subText?: string;
  isActive: boolean;
}

export interface PermissionItem {
  id: string;
  code: string;
  name: string;
  module: string;
  description?: string;
}

export interface RoleItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  isSystem: boolean;
  permissions: PermissionItem[];
}

export interface CreateRolePayload {
  name: string;
  code: string;
  description?: string;
  permissionIds?: string[];
}

export interface CreateThemePayload {
  name: string;
  code: string;
  configuration: {
    themeName?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    headerStyle?: string;
    badgeText?: string;
  };
}

// -------------------------------------------------------------
// College Modules & Academic Entities
// -------------------------------------------------------------

export interface LaboratoryItem {
  name: string;
  description?: string;
  equipment?: string;
  imageUrl?: string;
}

export interface SemesterSyllabusItem {
  semesterNumber?: number;
  semester?: number;
  title: string;
  pdfUrl?: string;
  wordUrl?: string;
  regulationYear?: string;
  credits?: number;
}

export interface Course {
  id: string | number;
  departmentId?: string | number;
  departmentName?: string;
  name: string;
  code: string;
  slug?: string;
  degreeLevel: string;
  durationYears: number;
  totalSemesters?: number;
  regulationYear?: string;
  intake?: number;
  description: string;
  eligibility: string;
  feeStructure?: string;
  tuitionFee?: string;
  syllabusPdfUrl?: string;
  semesterSyllabi?: SemesterSyllabusItem[];
  curriculumHighlights?: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  isActive: boolean;
}

export interface FacultyMember {
  id: string | number;
  departmentId?: string | number;
  departmentName?: string;
  name: string;
  designation: string;
  qualification: string;
  specialization?: string;
  email?: string;
  profileImageUrl?: string;
  bio?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface DepartmentSyllabusItem {
  id?: string;
  title: string;
  academicYear?: string;
  regulationYear?: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  description?: string;
}

export interface Department {
  id: string | number;
  name: string;
  code: string;
  slug?: string;
  description: string;
  headOfDepartment?: string;
  hodMessage?: string;
  hodPhotoUrl?: string;
  visionMission?: string;
  stream?: string;
  totalSemesters?: number;
  labCount?: number;
  studentCount?: number;
  laboratories?: LaboratoryItem[];
  email?: string;
  phone?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  syllabusPdfUrl?: string;
  curriculumPdfUrl?: string;
  syllabi?: DepartmentSyllabusItem[];
  syllabiJson?: string;
  displayOrder?: number;
  isActive: boolean;
  courses?: Course[];
  faculty?: FacultyMember[];
}


export interface ComplianceDocument {
  id: string | number;
  title: string;
  category: string;
  fileUrl?: string;
  documentPdfUrl?: string;
  fileSize?: string;
  academicYear?: string;
  description?: string;
  sortOrder?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface TransportStop {
  stopName: string;
  time?: string;
}

export interface TransportRoute {
  id: string | number;
  routeNumber: string;
  routeName: string;
  startPoint?: string;
  startingPoint?: string;
  endPoint?: string;
  destination?: string;
  departureTime?: string;
  morningPickupTime?: string;
  eveningDropTime?: string;
  viaStops?: string[];
  stopsJson?: string;
  stops?: TransportStop[];
  busNumber?: string;
  driverName?: string;
  driverPhone?: string;
  timingPdfUrl?: string;
  routeMapPdfUrl?: string;
  isActive?: boolean;
}

export interface HostelRoomType {
  type: string;
  fee?: string;
}

export interface HostelFacility {
  id: string | number;
  name: string;
  type?: string;
  genderType?: 'BOYS' | 'GIRLS' | 'FACULTY' | string;
  capacity?: number;
  totalRooms?: number;
  description?: string;
  amenities?: string[];
  roomTypesJson?: string;
  roomTypes?: HostelRoomType[];
  wardenName?: string;
  wardenPhone?: string;
  wardenEmail?: string;
  messMenuPdfUrl?: string;
  rulesPdfUrl?: string;
  photoUrl?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface LibraryResource {
  id: string | number;
  title: string;
  resourceType: 'QUESTION_PAPER' | 'E_JOURNAL' | 'SYLLABUS_BOOK' | 'THESIS' | string;
  departmentCode?: string;
  departmentName?: string;
  subjectCode?: string;
  subjectName?: string;
  semester?: number;
  academicYear?: string;
  externalUrl?: string;
  fileUrl?: string;
  pdfUrl?: string;
  description?: string;
  isActive?: boolean;
}

export interface AlumniMember {
  id: string | number;
  fullName: string;
  email?: string;
  phone?: string;
  graduationYear?: number;
  batchYear?: string | number;
  degree?: string;
  degreeCourse?: string;
  currentCompany?: string;
  currentDesignation?: string;
  currentCity?: string;
  testimonial?: string;
  testimonialQuote?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  isFeatured?: boolean;
  isDistinguished?: boolean;
  isApproved?: boolean;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED' | string;
}

export interface PopupAnnouncement {
  id: string;
  title: string;
  popupType: 'IMAGE_POSTER' | 'RICH_CONTENT' | 'VIDEO' | string;
  imageUrl?: string;
  badgeText?: string;
  heading?: string;
  description?: string;
  videoUrl?: string;
  targetUrl?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  secondaryTargetUrl?: string;
  openInNewTab?: boolean;
  delaySeconds?: number;
  displayFrequency?: 'EVERY_VISIT' | 'ONCE_PER_SESSION' | 'ONCE_PER_DAY' | string;
  targetPages?: 'HOMEPAGE_ONLY' | 'ALL_PAGES' | 'CUSTOM_SLUGS' | string;
  customTargetSlugs?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


