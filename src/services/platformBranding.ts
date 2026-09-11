export interface PlatformBranding {
  platformName: string;
  platformSubtitle: string;
  logoUrl: string;
  faviconUrl: string;
}

const STORAGE_KEY = 'superadmin_platform_branding';

export const DEFAULT_PLATFORM_BRANDING: PlatformBranding = {
  platformName: 'Multi Website',
  platformSubtitle: 'SuperAdmin Control Plane',
  logoUrl: '/assets/superadmin-logo.png',
  faviconUrl: '/assets/superadmin-logo.png',
};

/**
 * Retrieve current platform branding from storage or defaults.
 */
export const getPlatformBranding = (): PlatformBranding => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        platformName: parsed.platformName || DEFAULT_PLATFORM_BRANDING.platformName,
        platformSubtitle: parsed.platformSubtitle || DEFAULT_PLATFORM_BRANDING.platformSubtitle,
        logoUrl: parsed.logoUrl || DEFAULT_PLATFORM_BRANDING.logoUrl,
        faviconUrl: parsed.faviconUrl || parsed.logoUrl || DEFAULT_PLATFORM_BRANDING.faviconUrl,
      };
    }
  } catch (e) {
    console.error('Failed to parse platform branding from storage', e);
  }
  return { ...DEFAULT_PLATFORM_BRANDING };
};

/**
 * Persist platform branding and dispatch update event across tabs/windows.
 */
export const savePlatformBranding = (branding: Partial<PlatformBranding>): PlatformBranding => {
  const current = getPlatformBranding();
  const updated: PlatformBranding = {
    platformName: branding.platformName?.trim() || current.platformName,
    platformSubtitle: branding.platformSubtitle?.trim() || current.platformSubtitle,
    logoUrl: branding.logoUrl?.trim() || current.logoUrl,
    faviconUrl: branding.faviconUrl?.trim() || branding.logoUrl?.trim() || current.faviconUrl,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save platform branding', e);
  }

  // Update current document immediately
  applyBrowserBranding(updated.platformName, updated.faviconUrl);

  // Dispatch custom event for in-page reactivity
  window.dispatchEvent(new CustomEvent('platform-branding-updated', { detail: updated }));

  return updated;
};

/**
 * Reset platform branding to factory defaults.
 */
export const resetPlatformBranding = (): PlatformBranding => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear platform branding', e);
  }

  applyBrowserBranding(DEFAULT_PLATFORM_BRANDING.platformName, DEFAULT_PLATFORM_BRANDING.faviconUrl);
  window.dispatchEvent(new CustomEvent('platform-branding-updated', { detail: DEFAULT_PLATFORM_BRANDING }));

  return { ...DEFAULT_PLATFORM_BRANDING };
};

/**
 * Dynamically updates document.title and the browser tab favicon link.
 */
export const applyBrowserBranding = (title?: string, faviconUrl?: string) => {
  const branding = getPlatformBranding();
  const finalTitle = title || branding.platformName || DEFAULT_PLATFORM_BRANDING.platformName;
  const finalFavicon = faviconUrl || branding.faviconUrl || DEFAULT_PLATFORM_BRANDING.faviconUrl;

  // 1. Set document tab title
  document.title = finalTitle;

  // 2. Set/Update favicon link element
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  link.href = finalFavicon;
  if (finalFavicon.endsWith('.ico')) {
    link.type = 'image/x-icon';
  } else if (finalFavicon.endsWith('.svg')) {
    link.type = 'image/svg+xml';
  } else {
    link.type = 'image/png';
  }
};
