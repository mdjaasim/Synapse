import type { DistrictManifest, Vec3 } from "@synapse/types";

/** Resolves the primary camera target from a district manifest. */
export function primaryCameraTarget(manifest: DistrictManifest) {
  const { cameraDefaults } = manifest;
  const target =
    cameraDefaults.targets.find((t) => t.id === cameraDefaults.primaryTargetId) ??
    cameraDefaults.targets[0];
  if (!target) {
    throw new Error(`District "${manifest.id}" has no camera targets.`);
  }
  return target;
}

/** Builds a camera preset from manifest defaults. */
export function cameraPresetFromManifest(manifest: DistrictManifest) {
  const target = primaryCameraTarget(manifest);
  return {
    position: target.position,
    target: target.target,
    fov: target.fov,
  };
}

export function vec3Equal(a: Vec3, b: Vec3): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}
