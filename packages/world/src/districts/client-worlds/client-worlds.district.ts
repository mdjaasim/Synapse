import { ARCHITECTURAL_GLASS_FAMILY } from "@synapse/materials";
import { createDistrictManifest } from "../district-manifest";
import type { DistrictRegistration } from "../district-registry";
import {
  createAnimatedDistrict,
  getMaterial,
  mountParticles,
} from "../shared/create-animated-district";
import { fogBackdrop } from "../shared/fog-backdrop";
import {
  createInstancedColumns,
  createOrbitingSpheres,
  wrapOrbitingGroup,
} from "../shared/district-scene-utils";

export const CLIENT_WORLDS_MANIFEST = createDistrictManifest({
  id: "client-worlds",
  name: "Client Worlds",
  mood: "focused",
  description: "Professional ecosystems — Fuze, Filozo, Borderless Creatives.",
  developerLabel: "ExperienceDistrict",
  center: { x: 25, y: 0, z: 15 },
  radius: 26,
  cameraPosition: { x: 25, y: 4, z: 24 },
  cameraTarget: { x: 25, y: 0, z: 15 },
  loadingPriority: 70,
  memoryBudgetBytes: 1_024_000,
  transitionPreferences: {
    preferred: "camera-flight",
    allowed: ["camera-flight", "crossfade"],
    cameraProfileId: "flight",
  },
});

export const CLIENT_WORLDS_REGISTRATION: DistrictRegistration = {
  manifest: CLIENT_WORLDS_MANIFEST,
  create: createAnimatedDistrict({
    manifest: CLIENT_WORLDS_MANIFEST,
    build(ctx) {
      const glass = getMaterial(ctx.materials, ARCHITECTURAL_GLASS_FAMILY);
      const orbiting = createOrbitingSpheres(
        ctx.materials,
        [0, 1, 2].map((i) => ({
          id: `client-${i}`,
          districtId: "client-worlds",
          radius: 0,
          orbitRadius: 3 + i * 2.2,
          orbitSpeed: 0.05,
          phase: i * 1.7,
          size: 0.45,
          materialFamilyId: ARCHITECTURAL_GLASS_FAMILY.id,
        })),
        (factory) => getMaterial(factory, ARCHITECTURAL_GLASS_FAMILY),
      );
      const children = [
        fogBackdrop(ctx.materials, "client-worlds", 50),
        createInstancedColumns("client-worlds", 12, 14, 2.5, glass),
        wrapOrbitingGroup("client-worlds", orbiting),
      ];
      mountParticles(
        orbiting.group,
        "client-worlds",
        ctx.particles,
        ctx.particles.createAtmosphereSystems("client-worlds", 280, 18, 7001, "#8ab4f8"),
        children,
      );
      return { children, update: (elapsed) => orbiting.update(elapsed) };
    },
  }),
};
