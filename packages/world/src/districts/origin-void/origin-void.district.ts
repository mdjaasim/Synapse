import * as THREE from "three";
import { createOriginCore } from "./origin-core";
import { createAtmosphereField } from "./atmosphere-field";
import { createVolumetricFogField } from "./volumetric-fog-field";
import { createSceneObject } from "../../objects/scene-object";
import { createDistrictManifest } from "../district-manifest";
import type { DistrictRegistration } from "../district-registry";
import type {
  BaseDistrict,
  DistrictAnimationContext,
  DistrictContext,
  DistrictInteractionContext,
} from "../base-district";
import type { SceneObject } from "../../objects/scene-object";

export const ORIGIN_VOID_MANIFEST = createDistrictManifest({
  id: "origin",
  name: "Origin Void",
  mood: "calm",
  description:
    "The conceptual center of the universe (0,0,0): a calm, near-dark space from which everything originates.",
  developerLabel: "OriginVoid",
  center: { x: 0, y: 0, z: 0 },
  radius: 20,
  cameraPosition: { x: 0, y: 0.6, z: 6 },
  cameraTarget: { x: 0, y: 0, z: 0 },
  fov: 42,
  loadingPriority: 100,
  memoryBudgetBytes: 2_048_000,
  streamingPolicy: { tier: "critical", preloadAdjacent: false, unloadWhenDormant: false },
  transitionPreferences: {
    preferred: "fade",
    allowed: ["fade", "crossfade", "blackout"],
    cameraProfileId: "instant",
  },
});

/**
 * Builds the Origin Void district. Core mounts immediately; ambient layers
 * mount on first {@link BaseDistrict.mount} call (deferred startup preserved).
 */
export function createOriginVoidDistrict(ctx: DistrictContext): BaseDistrict {
  const manifest = ORIGIN_VOID_MANIFEST;
  const group = new THREE.Group();
  group.name = "district:origin";
  const children: SceneObject[] = [];

  const core = createOriginCore(ctx.materials);
  group.add(core.object3d);
  children.push(core);

  let ambientAttached = false;
  let mounted = false;

  const attachAmbient = (): void => {
    if (ambientAttached) {
      return;
    }
    ambientAttached = true;
    const atmosphere = createAtmosphereField(ctx.materials);
    const fog = createVolumetricFogField(ctx.materials);
    group.add(atmosphere.object3d, fog.object3d);
    children.push(atmosphere, fog);

    const particleSystems = ctx.particles.createOriginVoidSystems();
    for (const system of particleSystems) {
      system.points.renderOrder = 10;
      group.add(system.points);
      children.push(
        createSceneObject({
          id: system.id,
          object3d: system.points,
          districtId: "origin",
          onDispose: () => system.dispose(),
        }),
      );
    }
  };

  const district: BaseDistrict = {
    id: "district:origin",
    object3d: group,
    districtId: "origin",
    manifest,

    async prepare() {},

    mount() {
      mounted = true;
      if (!ambientAttached) {
        requestAnimationFrame(() => attachAmbient());
      }
    },

    unmount() {
      mounted = false;
    },

    update(_delta: number) {
      if (!mounted) {
        return;
      }
    },

    enter() {},
    exit() {},

    registerAnimations(_ctx: DistrictAnimationContext) {},
    registerInteractions(_ctx: DistrictInteractionContext) {},

    dispose() {
      for (const child of children) {
        child.dispose();
      }
      children.length = 0;
    },
  };

  return district;
}

export const ORIGIN_VOID_REGISTRATION: DistrictRegistration = {
  manifest: ORIGIN_VOID_MANIFEST,
  create: createOriginVoidDistrict,
};

/** @deprecated Use {@link createOriginVoidDistrict} returning {@link BaseDistrict}. */
export type OriginVoidDistrict = BaseDistrict;
