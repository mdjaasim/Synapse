import * as THREE from "three";
import { ETHER_LIGHT_FAMILY } from "@synapse/materials";
import { createDistrictManifest } from "../district-manifest";
import type { DistrictRegistration } from "../district-registry";
import {
  createAnimatedDistrict,
  getMaterial,
  mountParticles,
} from "../shared/create-animated-district";
import { fogBackdrop } from "../shared/fog-backdrop";
import { createSceneObject } from "../../objects/scene-object";

export const AI_OBSERVATORY_MANIFEST = createDistrictManifest({
  id: "ai-observatory",
  name: "AI Observatory",
  mood: "calm",
  description: "Digital Jaasim — Talk to Jaasim in a peaceful observatory.",
  developerLabel: "AIAssistantDistrict",
  center: { x: 0, y: 0, z: 35 },
  radius: 18,
  cameraPosition: { x: 0, y: 2, z: 44 },
  cameraTarget: { x: 0, y: 0, z: 35 },
  loadingPriority: 80,
  memoryBudgetBytes: 768_000,
  transitionPreferences: {
    preferred: "portal",
    allowed: ["portal", "fade", "crossfade"],
    cameraProfileId: "flight",
  },
});

export const AI_OBSERVATORY_REGISTRATION: DistrictRegistration = {
  manifest: AI_OBSERVATORY_MANIFEST,
  create: createAnimatedDistrict({
    manifest: AI_OBSERVATORY_MANIFEST,
    build(ctx) {
      const ether = getMaterial(ctx.materials, ETHER_LIGHT_FAMILY);
      const platform = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.5, 0.3, 64), ether);
      const presence = new THREE.Mesh(new THREE.SphereGeometry(0.9, 64, 64), ether);
      presence.position.y = 1.8;
      platform.add(presence);
      const platformObj = createSceneObject({
        id: "ai-observatory:platform",
        object3d: platform,
        districtId: "ai-observatory",
        onDispose: () => {
          platform.geometry.dispose();
          presence.geometry.dispose();
        },
      });
      const children = [fogBackdrop(ctx.materials, "ai-observatory", 42), platformObj];
      mountParticles(
        platform,
        "ai-observatory",
        ctx.particles,
        [
          ...ctx.particles.createAtmosphereSystems("ai-observatory", 200, 12, 8001, "#9ec5ff"),
          ...ctx.particles.createEnergySystems("ai-observatory", 80, 10, 8002),
        ],
        children,
      );
      return {
        children,
        update: (elapsed) => {
          presence.position.y = 1.8 + Math.sin(elapsed * 0.5) * 0.08;
          platform.rotation.y = elapsed * 0.02;
        },
      };
    },
  }),
};
