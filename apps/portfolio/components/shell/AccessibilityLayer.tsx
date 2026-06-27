"use client";

/**
 * Accessibility layer: a polite ARIA live region for announcements. Reduced
 * motion is applied to the document root by AccessibilityProvider.
 */
export function AccessibilityLayer() {
  return <div aria-live="polite" aria-atomic className="sr-only" data-slot="a11y-live" />;
}
