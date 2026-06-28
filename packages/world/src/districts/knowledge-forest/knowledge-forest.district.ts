import * as THREE from "three";
import { BIOLUMINESCENT_BARK_FAMILY } from "@synapse/materials";
import { createDistrictManifest } from "../district-manifest";
import type { DistrictRegistration } from "../district-registry";
import {
  createAnimatedDistrict,
  getMaterial,
  mountParticles,
} from "../shared/create-animated-district";
import { fogBackdrop } from "../shared/fog-backdrop";
import { createSceneObject } from "../../objects/scene-object";

export const KNOWLEDGE_FOREST_MANIFEST = createDistrictManifest({
  id: "knowledge-forest",
  name: "Knowledge Forest",
  mood: "curious",
  description: "Identity, learning journey, and the builder behind the work.",
  developerLabel: "AboutDistrict",
  center: { x: -30, y: 0, z: 20 },
  radius: 25,
  cameraPosition: { x: -30, y: 3, z: 28 },
  cameraTarget: { x: -30, y: 0, z: 20 },
  loadingPriority: 60,
  memoryBudgetBytes: 768_000,
});

export const KNOWLEDGE_FOREST_REGISTRATION: DistrictRegistration = {
  manifest: KNOWLEDGE_FOREST_MANIFEST,
  create: createAnimatedDistrict({
    manifest: KNOWLEDGE_FOREST_MANIFEST,
    build(ctx) {
      const bark = getMaterial(ctx.materials, BIOLUMINESCENT_BARK_FAMILY);
      const group = new THREE.Group();
      const geos: THREE.BufferGeometry[] = [];
      for (let i = 0; i < 8; i += 1) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 1.6, 8), bark);
        const seed = i * 1.3;
        trunk.position.set(Math.sin(seed) * 6, 0, Math.cos(seed * 0.9) * 6);
        const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.4, 8), bark);
        canopy.position.y = 1.5;
        trunk.add(canopy);
        group.add(trunk);
        geos.push(trunk.geometry, canopy.geometry);
      }
      const forestObj = createSceneObject({
        id: "knowledge-forest:trees",
        object3d: group,
        districtId: "knowledge-forest",
        onDispose: () => geos.forEach((g) => g.dispose()),
      });
      const children = [fogBackdrop(ctx.materials, "knowledge-forest", 48), forestObj];
      mountParticles(
        group,
        "knowledge-forest",
        ctx.particles,
        ctx.particles.createAtmosphereSystems("knowledge-forest", 320, 16, 3001, "#5dffb0"),
        children,
      );
      return {
        children,
        update: (elapsed) => {
          group.rotation.y = Math.sin(elapsed * 0.03) * 0.05;
        },
      };
    },
  }),
};
