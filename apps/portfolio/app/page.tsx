"use client";

import { ScrollStage } from "../components/shell/ScrollStage";
import { useExperienceStore } from "../hooks/use-experience";

export default function HomePage() {
  const storyProgress = useExperienceStore((state) => state.storyProgress);

  return (
    <>
      <ScrollStage />
      {process.env.NODE_ENV === "development" ? (
        <div className="pointer-events-none fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-[max(1.5rem,env(safe-area-inset-left))] z-40 font-mono text-[10px] text-neutral-600">
          progress: {(storyProgress * 100).toFixed(0)}%
        </div>
      ) : null}
    </>
  );
}
