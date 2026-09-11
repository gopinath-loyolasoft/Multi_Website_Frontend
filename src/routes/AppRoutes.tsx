import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WebsiteLayout } from '../layouts/WebsiteLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';

import { DynamicPage } from '../pages/website/DynamicPage';
import { NewsListPage, NewsDetailPage } from '../pages/website/NewsPages';
import { EventsListPage, EventDetailPage } from '../pages/website/EventsPages';
import { DepartmentsPage } from '../pages/website/DepartmentsPage';
import { CoursesPage } from '../pages/website/CoursesPage';
import { FacultyPage } from '../pages/website/FacultyPage';
import { GalleryPage } from '../pages/website/GalleryPage';
import { AdmissionsPage } from '../pages/website/AdmissionsPage';
import { ContactPage } from '../pages/website/ContactPage';
import { AboutPage } from '../pages/website/AboutPage';
import { NoticesPage } from '../pages/website/NoticesPage';

import { LoginPage } from '../pages/admin/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';

import { NewsManagementPage, EventsManagementPage } from '../pages/admin/NewsAndEventsAdmin';
import { DepartmentsManagementPage, CoursesManagementPage } from '../pages/admin/DepartmentsAndCoursesAdmin';
import { FacultyManagementPage, GalleryManagementPage } from '../pages/admin/FacultyAndGalleryAdmin';
import { BannersManagementPage, AdmissionsManagementPage } from '../pages/admin/BannersAndAdmissionsAdmin';
import { MenusAdminPage } from '../pages/admin/MenusAdmin';
import { MarqueeAdminPage } from '../pages/admin/MarqueeAdmin';
import { SettingsAdminPage } from '../pages/admin/SettingsAdmin';
import { PagesAdminPage } from '../pages/admin/PagesAdmin';
import { StatsAdminPage } from '../pages/admin/StatsAdminPage';
import { QuoteAdminPage } from '../pages/admin/QuoteAdminPage';
import { PlacementsAdminPage } from '../pages/admin/PlacementsAdminPage';
import { ContactSubmissionsAdminPage } from '../pages/admin/ContactSubmissionsAdmin';
import { ContactInfoAdminPage } from '../pages/admin/ContactInfoAdmin';
import { NoticesAdminPage } from '../pages/admin/NoticesAdminPage';

import { SuperAdminLoginPage } from '../pages/superadmin/SuperAdminLoginPage';
import { SuperAdminDashboard } from '../pages/superadmin/SuperAdminDashboard';
import { CollegesPage } from '../pages/superadmin/CollegesPage';
import { CollegeDetailPage } from '../pages/superadmin/CollegeDetailPage';
import { CollegeAdminsPage } from '../pages/superadmin/CollegeAdminsPage';
import { RolesPage } from '../pages/superadmin/RolesPage';
import { DomainsPage } from '../pages/superadmin/DomainsPage';
import { DatabasesPage } from '../pages/superadmin/DatabasesPage';
import { TemplatesPage } from '../pages/superadmin/TemplatesPage';
import { ThemesPage } from '../pages/superadmin/ThemesPage';
import { FeaturesPage } from '../pages/superadmin/FeaturesPage';
import { MigrationsPage } from '../pages/superadmin/MigrationsPage';
import { AuditLogsPage } from '../pages/superadmin/AuditLogsPage';
import { PlatformSettingsPage } from '../pages/superadmin/PlatformSettingsPage';

import { isPlatformRootHost } from '../services/apiClient';
import { PlatformHomePage } from '../pages/platform/PlatformHomePage';

import { ModulePreviewPage } from '../pages/preview/ModulePreviewPage';

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export const AppRoutes: React.FC = () => {
  const isRootPlatform = isPlatformRootHost();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Dedicated Standalone Module Preview Routes */}
        <Route path="/preview/module/:moduleKey" element={<ModulePreviewPage />} />
        <Route path="/preview/module" element={<ModulePreviewPage />} />

        {/* 1. SuperAdmin Control Plane Routes */}
        <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="colleges" element={<CollegesPage />} />
          <Route path="colleges/:id" element={<CollegeDetailPage />} />
          <Route path="admins" element={<CollegeAdminsPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="domains" element={<DomainsPage />} />
          <Route path="databases" element={<DatabasesPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="themes" element={<ThemesPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="migrations" element={<MigrationsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<PlatformSettingsPage />} />
        </Route>

        {/* 2. CollegeAdmin CMS Routes (Tenant-Scoped) */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="menus" element={<MenusAdminPage />} />
          <Route path="marquee" element={<MarqueeAdminPage />} />
          <Route path="departments" element={<DepartmentsManagementPage />} />
          <Route path="courses" element={<CoursesManagementPage />} />
          <Route path="faculty" element={<FacultyManagementPage />} />
          <Route path="news" element={<NewsManagementPage />} />
          <Route path="events" element={<EventsManagementPage />} />
          <Route path="gallery" element={<GalleryManagementPage />} />
          <Route path="banners" element={<BannersManagementPage />} />
          <Route path="stats" element={<StatsAdminPage />} />
          <Route path="quote" element={<QuoteAdminPage />} />
          <Route path="placements" element={<PlacementsAdminPage />} />
          <Route path="recruiters" element={<PlacementsAdminPage />} />
          <Route path="pages" element={<PagesAdminPage />} />
          <Route path="admissions" element={<AdmissionsManagementPage />} />
          <Route path="contact-submissions" element={<ContactSubmissionsAdminPage />} />
          <Route path="contact-info-settings" element={<ContactInfoAdminPage />} />
          <Route path="notices" element={<NoticesAdminPage />} />
          <Route path="settings" element={<SettingsAdminPage />} />
        </Route>

        {/* 3. Root & Dynamic College Website Routing */}
        {isRootPlatform ? (
          <>
            <Route path="/" element={<PlatformHomePage />} />
            <Route path="/site" element={<WebsiteLayout />}>
              <Route index element={<DynamicPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="faculty" element={<FacultyPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="admissions" element={<AdmissionsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="news" element={<NewsListPage />} />
              <Route path="news/:slug" element={<NewsDetailPage />} />
              <Route path="events" element={<EventsListPage />} />
              <Route path="events/:id" element={<EventDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path=":slug" element={<DynamicPage />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="/" element={<WebsiteLayout />}>
              <Route index element={<DynamicPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="faculty" element={<FacultyPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="admissions" element={<AdmissionsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="news" element={<NewsListPage />} />
              <Route path="news/:slug" element={<NewsDetailPage />} />
              <Route path="events" element={<EventsListPage />} />
              <Route path="events/:id" element={<EventDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path=":slug" element={<DynamicPage />} />
            </Route>
            {/* Fallback alias for /site on tenant domain */}
            <Route path="/site" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
