/**
 * Feature flags. Default-off for systems that arrive in later phases so the
 * shell can render their slots without enabling unfinished behavior.
 */

export interface FeatureFlags {
  readonly canvas: boolean;
  readonly ai: boolean;
  readonly analytics: boolean;
  readonly debugTools: boolean;
}

export const FEATURE_FLAGS: FeatureFlags = {
  canvas: false,
  ai: false,
  analytics: false,
  debugTools: false,
};
