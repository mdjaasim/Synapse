/**
 * Animation categories (Document 25). Each category has a priority used when
 * multiple timelines compete for the same target property.
 */

export const ANIMATION_CATEGORIES = [
  "ambient",
  "interaction",
  "narrative",
  "camera",
  "ai",
  "celebration",
] as const;

export type AnimationCategory = (typeof ANIMATION_CATEGORIES)[number];

/** Lower number = higher priority (Document 25 priority table). */
export const CATEGORY_PRIORITY: Readonly<Record<AnimationCategory, number>> = {
  camera: 1,
  narrative: 2,
  interaction: 3,
  ambient: 4,
  celebration: 5,
  ai: 3,
};
