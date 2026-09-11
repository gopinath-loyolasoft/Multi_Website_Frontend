export interface Tenant {
  id: string | number;
  tenantCode: string;
  name: string;
  slug: string;
  status: string;
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
}

export interface EventItem {
  id: string | number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl?: string;
  isPublished: boolean;
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
  description: string;
  defaultThemeId?: string | number;
  defaultThemeCode?: string;
  defaultThemeName?: string;
  themeConfiguration?: ThemeConfig;
  supportedThemes?: string[];
  recommendedFeatures: string[];
  starterPages?: any[];
  starterMenus?: any[];
  collegesCount?: number;
  isActive: boolean;
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
