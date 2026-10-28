# College Website Multi-Tenant Platform — Frontend (React 19 + Vite + TypeScript)

A modern, high-performance, multi-tenant frontend web application built with **React 19**, **Vite 8**, **TypeScript**, and **Tailwind CSS v4**. This application dynamically delivers customized college websites, a comprehensive **CollegeAdmin CMS**, and a centralized **SuperAdmin Control Plane** based on the requesting domain or subdomain.

---

## 🏛️ Architecture Overview

The frontend operates on a multi-tenant client architecture that dynamically adapts themes, navigation, layout structures, and features based on the hostname:

```
Frontend/college-website-frontend/
├── package.json
├── vite.config.ts
├── tailwindcss & styles (index.css)
└── src/
    ├── UI_Componentes/       # Modular design system primitives
    ├── assets/               # Local templates, logos, and vector illustrations
    ├── components/
    │   ├── admin/            # CMS forms, modals, tables, and media pickers
    │   ├── auth/             # Login cards, template selectors, and auth guards
    │   ├── common/           # Navigation bars, footers, marquee tickers, lightboxes
    │   ├── dynamic/          # Dynamic page builder and section renderers
    │   └── sections/         # 20+ modular page section blocks (Hero, Stats, Faculty, etc.)
    ├── contexts/             # ThemeContext, CapabilityContext, ThemeModeContext, LayoutContext
    ├── layouts/              # WebsiteLayout, AdminLayout, SuperAdminLayout
    ├── pages/
    │   ├── admin/            # Scoped CollegeAdmin CMS management pages
    │   ├── superadmin/       # Platform SuperAdmin control plane pages
    │   ├── website/          # Public-facing college pages (Home, Academics, News, etc.)
    │   └── preview/          # Live module preview sandbox
    ├── routes/               # AppRoutes.tsx with domain-aware route switching
    ├── services/             # Axios API client, token interceptors, platform branding
    ├── templates/            # Template presets (Engineering, Arts & Science, Medical, University)
    ├── tenant/               # TenantContext resolving institution context from host
    ├── themes/               # Dynamic CSS variable injector and color token palette
    └── types/                # TypeScript definitions matching Backend API DTOs
```

---

## 🧩 Core Systems & Technologies Used

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                BROWSER / USER NAVIGATION                                 │
└──────────────────────────────────────────┬───────────────────────────────────────────────┘
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. Hostname Analysis (TenantContext detects subdomain e.g. rnc.localhost or custom DNS)  │
│ 2. Public Config & Theme Hydration (Inquires /api/v1/site/config & /api/v1/site/theme)   │
│ 3. Dynamic CSS Variable Injection (Colors, typography, badges injected to :root)         │
│ 4. CapabilityContext Evaluation (Enables/disables modules based on tenant features)      │
│ 5. Axios Interceptors (Injects JWT Bearer tokens & handles token refresh automatically)  │
└──────────────────────────────────────────┬───────────────────────────────────────────────┘
                                           ▼
┌──────────────────────────────┬──────────────────────────────┬────────────────────────────┐
│     SuperAdmin Control Plane │     College Admin CMS        │     Public College Website │
│  (/superadmin/dashboard)     │  (/admin/dashboard)          │   (/, /departments, /news) │
└──────────────────────────────┴──────────────────────────────┴────────────────────────────┘
```

### 1. 🌐 Multi-Tenant Domain & Subdomain Resolution
- **TenantContext (`src/tenant/TenantContext.tsx`)**:
  - Automatically identifies whether the user is browsing the root platform or an institutional tenant via `window.location.hostname` (e.g. `rnc.localhost:5173` or `kts.localhost:5173`).
  - Fetches the institution's metadata, logo, tagline, and contact information seamlessly on first paint.
- **Domain-Aware Routing (`src/routes/AppRoutes.tsx`)**:
  - Automatically toggles between the Platform SuperAdmin interface and the institution's public dynamic website without code duplication.

---

### 2. 🎨 Dynamic Theming & Template Registry
- **CSS Variable Injection (`src/themes/ThemeContext.tsx`)**:
  - Reads active theme properties (`primaryColor`, `secondaryColor`, `accentColor`, `fontFamily`, `headerStyle`) and dynamically injects them into document CSS custom properties (`--primary`, `--secondary`, etc.).
- **Light & Dark Mode (`src/contexts/ThemeModeContext.tsx`)**:
  - Theme mode provider preserving user preference across sessions.
- **Pre-Built Institutional Templates (`src/templates/templateRegistry.ts`)**:
  - `ENGINEERING_MODERN`: Technical showcase, lab metrics, research highlights, and blue/gold aesthetic.
  - `ARTS_SCIENCE_MODERN`: Liberal arts, scholarly publications, classic serif fonts, and emerald accents.
  - `MEDICAL_MODERN`: Clinical healthcare, hospital OPD metrics, and clean teal palette.
  - `UNIVERSITY_MODERN`: Comprehensive multi-faculty university layout with crimson/navy styling.

---

### 3. 📝 Dynamic CMS & Modular Page Section Engine
- **Dynamic Page Builder (`src/pages/website/DynamicPage.tsx`)**:
  - Loads layout structure and ordered section blocks from the backend.
- **20+ Modular Section Components (`src/components/sections/`)**:
  - `HeroSection` & `HeroSliderSection`: Multi-slide hero carousels with CTA actions.
  - `StatisticsSection`: Animated counter cards showcasing campus achievements.
  - `QuoteSection`: Leadership welcome addresses with portrait photos.
  - `DepartmentsSection` & `CoursesSection`: Departmental catalogs and degree programs.
  - `FacultySection`: Faculty directory with profile modals.
  - `NewsSection` & `EventsSection`: Institutional press and calendar feeds.
  - `GallerySection`: Lightbox-enabled photo albums.
  - `NoticesSection`: Official circulars with downloadable PDF links.
  - `ContactSection`: Interactive inquiries with Google Map integration.
  - `CardsSection`, `IconCardsSection`, `ImageTextSection`, `LogoGridSection`, `FaqSection`, `VideoSection`.
- **Live Preview System (`src/pages/preview/ModulePreviewPage.tsx`)**:
  - Provides real-time preview sandbox for draft pages and unpublished CMS sections before going live.

---

### 4. 🔐 Authentication, Authorization & Feature Flags
- **JWT & Token Refresh Interceptors (`src/services/apiClient.ts`)**:
  - Axios client automatically attaches `Authorization: Bearer <token>` to protected requests.
  - Transparently intercepts `401 Unauthorized` responses to refresh the access token via `/api/v1/auth/refresh` without interrupting the user.
- **Role-Based Views**:
  - Separate login views for **College Admins** (`/admin/login`) and **SuperAdmins** (`/superadmin/login`).
- **Capability Guarding (`src/contexts/CapabilityContext.tsx`)**:
  - Conditionally renders sidebar links and CMS features based on enabled tenant capabilities (`BANNERS`, `MARQUEE`, `STATS`, `QUOTE`, `ADMISSIONS`, `GALLERY`, etc.).
- **XSS Sanitization (`DOMPurify`)**:
  - All rich text and dynamic HTML fields are sanitized via `DOMPurify` before rendering to protect against Cross-Site Scripting vulnerabilities.

---

## 🛠️ Tech Stack & Dependencies

- **UI Framework**: [React 19](https://react.dev/) (`react`, `react-dom` 19.2)
- **Build Tool**: [Vite 8](https://vitejs.dev/) (`@vitejs/plugin-react` 6.1)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (~6.0)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite` 4.3)
- **Routing**: [React Router v7](https://reactrouter.com/) (`react-router-dom` 7.18)
- **HTTP Client**: [Axios](https://axios-http.com/) (1.20)
- **Icons**: [Lucide React](https://lucide.dev/) (1.39)
- **HTML Sanitization**: [DOMPurify](https://github.com/cure53/DOMPurify) (3.4)
- **Utilities**: [usehooks-ts](https://usehooks-ts.com/) (3.1)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) (1.79)

---

## ⚙️ Configuration & Environment Variables

Environment files configure the API endpoint and root domains:

- [`.env.development`](.env.development)
```env
# Development Environment Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_PLATFORM_BASE_DOMAIN=localhost
VITE_PLATFORM_ROOT_HOST=localhost
VITE_APP_NAME="Dynamic College Website Platform (Dev)"
```

- [`.env.production`](.env.production)
```env
# Production Environment Configuration
VITE_API_BASE_URL=/api/v1
VITE_PLATFORM_BASE_DOMAIN=yourdomain.com
VITE_PLATFORM_ROOT_HOST=yourdomain.com
VITE_APP_NAME="Dynamic College Website Platform"
```

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js 20+** or **Node.js 22 LTS** ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js) or **pnpm** / **yarn**
- Running Backend API on `http://localhost:5000`

### 2. Install Dependencies
```bash
# Navigate to the frontend directory
cd Frontend/college-website-frontend

# Install node dependencies
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The application will launch at **`http://localhost:5173`**.

---

## 🧭 Navigation & Access URLs (Local Development)

| Interface | URL | Description | Default Credentials |
| :--- | :--- | :--- | :--- |
| **SuperAdmin Login** | `http://localhost:5173/superadmin/login` | Platform Master Control Plane | `superadmin` / `SuperAdmin@123` |
| **SuperAdmin Dashboard** | `http://localhost:5173/superadmin/dashboard` | Manage Colleges, Domains, Themes & DBs | Authenticated Session |
| **College Admin Login** | `http://localhost:5173/admin/login` | Institution CMS Admin Portal | `rnc-admin` / `Admin@123` |
| **RNC College Website** | `http://rnc.localhost:5173/` or `http://localhost:5173/site` | Public Dynamic Website for RNC | Public Access |
| **KTS College Website** | `http://kts.localhost:5173/` | Public Dynamic Website for KTS | Public Access |
| **Module Live Preview** | `http://localhost:5173/preview/module/hero` | Live Sandbox Preview for CMS Blocks | Authenticated / Public |

> [!TIP]
> Modern browsers (Chrome, Edge, Firefox) automatically resolve `*.localhost` (like `rnc.localhost:5173` and `kts.localhost:5173`) to `127.0.0.1` without needing to edit your hosts file.

---

## 📦 Available Scripts

```bash
# Start local Vite development server with HMR
npm run dev

# Compile TypeScript and build production bundle
npm run build

# Build for development mode
npm run build:dev

# Build for production mode
npm run build:prod

# Run fast code linting via Oxlint
npm run lint

# Preview production build locally
npm run preview
```

---

## 🔒 Security Best Practices

1. **Automatic XSS Defense**: All user-generated content and CMS rich-text descriptions are sanitized with **DOMPurify** before rendering.
2. **Secure Token Storage**: JWT tokens and refresh credentials are kept in memory and synchronized with secure storage.
3. **Automatic Session Recovery**: Transparent token refresh handles expired tokens without forcing users back to the login screen.
4. **Tenant Isolation**: Protected views enforce tenant context boundaries and prevent unauthorized cross-tenant mutations.

---

## 📄 License & Maintainers

Maintained for the **Dynamic Multi-Tenant College Website Platform**.
All rights reserved.
