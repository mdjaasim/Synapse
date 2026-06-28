/** Data-only camera transition profiles. Visual tweening deferred to Phase 5B. */
export const CAMERA_TRANSITION_PROFILES = {
  instant: { id: "instant", duration: 0, easing: "none" },
  flight: { id: "flight", duration: 2.4, easing: "power2.inOut" },
  drift: { id: "drift", duration: 1.8, easing: "sine.inOut" },
} as const;

export type CameraTransitionProfileId = keyof typeof CAMERA_TRANSITION_PROFILES;

export function getCameraTransitionProfile(id: string) {
  const profile = CAMERA_TRANSITION_PROFILES[id as CameraTransitionProfileId];
  return profile ?? CAMERA_TRANSITION_PROFILES.instant;
}
