"use client";

import { useEffect, useState } from "react";
import { useExperienceContext } from "../../providers/ExperienceProvider";

/**
 * Polite ARIA live region — announces district changes and story milestones.
 */
export function AccessibilityLayer() {
  const engine = useExperienceContext();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const unsubs = [
      engine.bus.subscribe("story.nodeEnter", ({ districtId }) => {
        setAnnouncement(`Entered ${districtId.replace(/-/g, " ")} district`);
      }),
      engine.bus.subscribe("story.completed", () => {
        setAnnouncement("Journey complete");
      }),
    ];
    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, [engine.bus]);

  return (
    <div aria-live="polite" aria-atomic className="sr-only" data-slot="a11y-live">
      {announcement}
    </div>
  );
}
