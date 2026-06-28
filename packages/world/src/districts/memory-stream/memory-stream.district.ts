import * as THREE from "three";
import { MEMORY_CRYSTAL_FAMILY } from "@synapse/materials";
import { createDistrictManifest } from "../district-manifest";
import type { DistrictRegistration } from "../district-registry";
import {
  createAnimatedDistrict,
  getMaterial,
  mountParticles,
} from "../shared/create-animated-district";
import { fogBackdrop } from "../shared/fog-backdrop";
import { createCrystalShards } from "../shared/district-scene-utils";

export const MEMORY_STREAM_MANIFEST = createDistrictManifest({
  id: "memory-stream",
  name: "Memory Stream",
  mood: "reflective",
  description: "Memories, contact, and the infinite loop — where the journey ends and begins.",
  developerLabel: "ContactDistrict",
  center: { x: 40, y: 0, z: 0 },
  radius: 20,
  cameraPosition: { x: 40, y: 2, z: 8 },
  cameraTarget: { x: 40, y: 0, z: 0 },
  loadingPriority: 50,
  memoryBudgetBytes: 512_000,
  streamingPolicy: { tier: "low", preloadAdjacent: false, unloadWhenDormant: true },
});

export const MEMORY_STREAM_REGISTRATION: DistrictRegistration = {
  manifest: MEMORY_STREAM_MANIFEST,
  create: createAnimatedDistrict({
    manifest: MEMORY_STREAM_MANIFEST,
    build(ctx) {
      const crystal = getMaterial(ctx.materials, MEMORY_CRYSTAL_FAMILY);
      const shards = createCrystalShards("memory-stream", 18, 5, crystal);
      const children = [fogBackdrop(ctx.materials, "memory-stream", 40), shards.object];
      mountParticles(
        shards.object.object3d as THREE.Group,
        "memory-stream",
        ctx.particles,
        ctx.particles.createAtmosphereSystems("memory-stream", 260, 14, 6001, "#d4b8ff"),
        children,
      );
      return { children, update: (elapsed) => shards.update(elapsed) };
    },
  }),
};
