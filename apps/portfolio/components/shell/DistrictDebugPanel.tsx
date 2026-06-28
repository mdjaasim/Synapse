"use client";

import { useDistrict } from "../../hooks/use-district";
import { useSettingsStore } from "../../hooks/use-stores";
import { useCameraContext } from "../../providers/CameraProvider";

/**
 * Developer panel for district framework state. Visible when developer mode
 * is enabled. No styling investment — functional debug output only.
 */
export function DistrictDebugPanel() {
  const developerMode = useSettingsStore((s) => s.developerMode);
  const district = useDistrict();
  const camera = useCameraContext();

  if (!developerMode) {
    return null;
  }

  const pose = camera.savePose();
  const transition = district.transition;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-neutral-800 bg-black/80 p-3 font-mono text-[10px] leading-relaxed text-neutral-400 backdrop-blur-sm"
      aria-hidden
    >
      <p className="mb-1 text-neutral-500">District Debug</p>
      <p>current: {district.currentDistrictId ?? "none"}</p>
      <p>loaded: {district.loadedDistrictIds.join(", ") || "none"}</p>
      <p>active: {district.activeDistrictIds.join(", ") || "none"}</p>
      <p>memory: {(district.totalMemoryBytesEstimate / 1024).toFixed(1)} KB</p>
      <p>
        transition:{" "}
        {transition.active
          ? `${transition.kind} ${transition.from ?? "?"} → ${transition.to ?? "?"}`
          : "idle"}
      </p>
      <p>
        camera: ({pose.position.x.toFixed(2)}, {pose.position.y.toFixed(2)},{" "}
        {pose.position.z.toFixed(2)})
      </p>
      <p>scroll: {(district.storyProgress * 100).toFixed(1)}%</p>
      <p className="mt-1 text-neutral-500">lifecycle</p>
      {district.districts.map((d) => (
        <p key={d.districtId} className="pl-2 text-neutral-600">
          {d.districtId} [{d.phase}] loaded={String(d.loaded)} mounted={String(d.mounted)}
        </p>
      ))}
    </div>
  );
}
