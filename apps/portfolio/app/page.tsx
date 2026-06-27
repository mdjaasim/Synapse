"use client";

import { ScrollStage } from "../components/shell/ScrollStage";
import { useExperienceStore } from "../hooks/use-experience";

export default function HomePage() {
  const storyProgress = useExperienceStore((state) => state.storyProgress);

  return (
    <>
      <ScrollStage />
      <div className="pointer-events-none fixed bottom-6 left-6 z-40 font-mono text-[10px] text-neutral-600">
        progress: {(storyProgress * 100).toFixed(0)}%
      </div>
    </>
  );
}
