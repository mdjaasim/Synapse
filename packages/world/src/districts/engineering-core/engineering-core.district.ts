import * as THREE from "three";
import { PRECISION_METAL_FAMILY } from "@synapse/materials";
import { createDistrictManifest } from "../district-manifest";
import type { DistrictRegistration } from "../district-registry";
import {
  createAnimatedDistrict,
  getMaterial,
  mountParticles,
} from "../shared/create-animated-district";
import { fogBackdrop } from "../shared/fog-backdrop";
import { createSceneObject } from "../../objects/scene-object";

export const ENGINEERING_CORE_MANIFEST = createDistrictManifest({
  id: "engineering-core",
  name: "Engineering Core",
  mood: "focused",
  description: "How Mohamed thinks — performance, systems, architecture, AI.",
  developerLabel: "SkillsDistrict",
  center: { x: 0, y: 0, z: -40 },
  radius: 22,
  cameraPosition: { x: 0, y: 2.5, z: -32 },
  cameraTarget: { x: 0, y: 0, z: -40 },
  loadingPriority: 65,
  memoryBudgetBytes: 896_000,
});

export const ENGINEERING_CORE_REGISTRATION: DistrictRegistration = {
  manifest: ENGINEERING_CORE_MANIFEST,
  create: createAnimatedDistrict({
    manifest: ENGINEERING_CORE_MANIFEST,
    build(ctx) {
      const lattice = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.2, 1),
        getMaterial(ctx.materials, PRECISION_METAL_FAMILY),
      );
      const latticeObj = createSceneObject({
        id: "engineering-core:lattice",
        object3d: lattice,
        districtId: "engineering-core",
        onDispose: () => lattice.geometry.dispose(),
      });
      const children = [fogBackdrop(ctx.materials, "engineering-core", 45), latticeObj];
      mountParticles(
        lattice,
        "engineering-core",
        ctx.particles,
        ctx.particles.createEnergySystems("engineering-core", 120, 14, 5001),
        children,
      );
      return {
        children,
        update: (elapsed) => {
          lattice.rotation.x = elapsed * 0.06;
          lattice.rotation.y = elapsed * 0.09;
        },
      };
    },
  }),
};
