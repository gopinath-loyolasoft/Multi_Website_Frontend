/**
 * Layout utility helpers used by the LayoutContext / Customizer system.
 */

/**
 * Detects the OS-level preferred colour scheme.
 * Returns 'dark' or 'light'.
 */
export const getSystemTheme = (): string => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Sets (or removes) an attribute on the root <html> element.
 * Used to drive CSS variable-based theming (data-theme, data-skin, etc.).
 */
export const toggleAttribute = (attribute: string, value: string): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute(attribute, value);
};
