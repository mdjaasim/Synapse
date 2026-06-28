import { COSMIC_MATTER_FAMILY } from "@synapse/materials";
import { createDistrictManifest } from "../district-manifest";
import type { DistrictRegistration } from "../district-registry";
import { createAnimatedDistrict, mountParticles } from "../shared/create-animated-district";
import { fogBackdrop } from "../shared/fog-backdrop";
import { createOrbitingSpheres, wrapOrbitingGroup } from "../shared/district-scene-utils";
import { getMaterial } from "../shared/create-animated-district";

export const PROJECT_GALAXY_MANIFEST = createDistrictManifest({
  id: "project-galaxy",
  name: "Project Galaxy",
  mood: "curious",
  description: "Personal projects as miniature planets — SYNAPSE, Football Dashboard, StoryBooks.",
  developerLabel: "ProjectsDistrict",
  center: { x: -25, y: 0, z: -30 },
  radius: 28,
  cameraPosition: { x: -25, y: 3, z: -22 },
  cameraTarget: { x: -25, y: 0, z: -30 },
  loadingPriority: 75,
  memoryBudgetBytes: 1_280_000,
  transitionPreferences: {
    preferred: "camera-flight",
    allowed: ["camera-flight", "crossfade", "portal"],
    cameraProfileId: "flight",
  },
});

export const PROJECT_GALAXY_REGISTRATION: DistrictRegistration = {
  manifest: PROJECT_GALAXY_MANIFEST,
  create: createAnimatedDistrict({
    manifest: PROJECT_GALAXY_MANIFEST,
    build(ctx) {
      const orbiting = createOrbitingSpheres(
        ctx.materials,
        [0, 1, 2].map((i) => ({
          id: `planet-${i}`,
          districtId: "project-galaxy",
          radius: 0,
          orbitRadius: 4 + i * 1.8,
          orbitSpeed: 0.08 + i * 0.02,
          phase: i * 2.1,
          size: 0.55 + (i % 2) * 0.2,
          materialFamilyId: COSMIC_MATTER_FAMILY.id,
        })),
        (factory) => getMaterial(factory, COSMIC_MATTER_FAMILY),
      );
      const children = [
        fogBackdrop(ctx.materials, "project-galaxy", 55),
        wrapOrbitingGroup("project-galaxy", orbiting),
      ];
      mountParticles(
        orbiting.group,
        "project-galaxy",
        ctx.particles,
        ctx.particles.createAtmosphereSystems("project-galaxy", 350, 22, 9001, "#c4a0ff"),
        children,
      );
      return { children, update: (elapsed) => orbiting.update(elapsed) };
    },
  }),
};
