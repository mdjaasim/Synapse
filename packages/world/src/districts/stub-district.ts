import * as THREE from "three";
import type { DistrictManifest } from "@synapse/types";
import type {
  BaseDistrict,
  DistrictAnimationContext,
  DistrictContext,
  DistrictInteractionContext,
} from "./base-district";

/**
 * Creates a placeholder district with an empty scene group.
 * All lifecycle methods are real no-ops — no TODOs.
 */
export function createStubDistrict(manifest: DistrictManifest): BaseDistrict {
  const group = new THREE.Group();
  group.name = `district:${manifest.id}`;
  let mounted = false;

  return {
    id: `district:${manifest.id}`,
    object3d: group,
    districtId: manifest.id,
    manifest,

    async prepare() {},

    mount() {
      mounted = true;
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
      group.clear();
    },
  };
}

export function createStubDistrictFactory(
  manifest: DistrictManifest,
): (_ctx: DistrictContext) => BaseDistrict {
  return () => createStubDistrict(manifest);
}
