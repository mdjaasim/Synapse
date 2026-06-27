"use client";

import {
  useAccessibilityContext,
  type AccessibilityValue,
} from "../providers/AccessibilityProvider";

/** Returns current accessibility state (e.g. reduced motion). */
export function useAccessibility(): AccessibilityValue {
  return useAccessibilityContext();
}
