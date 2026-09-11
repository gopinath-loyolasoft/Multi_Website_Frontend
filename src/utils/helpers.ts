export const toTitleCase = (str: string): string => {
  if (!str) return ''
  return str
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const toPascalCase = (str: string): string => {
  if (!str) return ''
  return str
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Converts a text string into a clean, URL-safe slug.
 * Handles:
 * - Lowercase conversion
 * - Trims whitespace and leading/trailing dashes
 * - Replaces & with 'and'
 * - Replaces spaces, underscores, and special characters with hyphens
 * - Removes non-alphanumeric chars (preserves letters, numbers, hyphens)
 * - Collapses repeated hyphens into a single hyphen
 *
 * Example:
 * "Computer Science & Engineering 2026!" => "computer-science-and-engineering-2026"
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&+/g, '-and-')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Copies text to the user's clipboard safely across all environments.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.warn('Failed to copy to clipboard', err);
    return false;
  }
}
