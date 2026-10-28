/**
 * General-purpose helper utilities used across admin pages and layout components.
 */

/**
 * Converts a string into a URL-safe slug.
 * e.g. "Hello World!" → "hello-world"
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')      // remove special chars
    .replace(/[\s_-]+/g, '-')       // spaces/underscores → hyphens
    .replace(/^-+|-+$/g, '');       // trim leading/trailing hyphens
};

/**
 * Copies a string value to the system clipboard.
 * Falls back gracefully in environments without clipboard API.
 */
export const copyToClipboard = (text: string): void => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return;
  }
  navigator.clipboard.writeText(text).catch(() => {
    // silently fail
  });
};

/**
 * Merges class names together, filtering out falsy values.
 * Used by Customizer components (Dir.tsx, etc.) for conditional CSS classes.
 * e.g. cn('base-class', isActive && 'active', undefined) → "base-class active"
 */
export const cn = (...classes: (string | false | null | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Converts a string to PascalCase.
 * e.g. "hello-world" → "HelloWorld"
 * Used by Width.tsx in the Customizer panel.
 */
export const toPascalCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c: string) => c.toUpperCase());
};

/**
 * Converts a string to Title Case.
 * e.g. "hello-world" → "Hello World"
 * Used by Skin.tsx, Theme.tsx, TopbarColor.tsx, SidenavColor.tsx, Orientation.tsx.
 */
export const toTitleCase = (str: string): string => {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};
