import * as THREE from "three";
import type { DistrictManifest, DistrictId } from "@synapse/types";
import type { MaterialFactory, MaterialFamily } from "@synapse/materials";
import type { ParticleEngine } from "@synapse/particles";
import { createSceneObject, type SceneObject } from "../../objects/scene-object";
import type {
  BaseDistrict,
  DistrictAnimationContext,
  DistrictContext,
  DistrictInteractionContext,
} from "../base-district";

export interface AnimatedDistrictOptions {
  readonly manifest: DistrictManifest;
  readonly build: (ctx: DistrictContext) => {
    readonly children: readonly SceneObject[];
    readonly update?: (elapsed: number, delta: number) => void;
    readonly onMount?: () => void;
  };
}

export function getMaterial(factory: MaterialFactory, family: MaterialFamily): THREE.Material {
  return factory.get(family);
}

export function mountParticles(
  parent: THREE.Object3D,
  districtId: DistrictId,
  _particles: ParticleEngine,
  systems: ReturnType<ParticleEngine["createAtmosphereSystems"]>,
  children: SceneObject[],
): void {
  for (const system of systems) {
    system.points.renderOrder = 10;
    parent.add(system.points);
    children.push(
      createSceneObject({
        id: system.id,
        object3d: system.points,
        districtId,
        onDispose: () => system.dispose(),
      }),
    );
  }
}

export function createAnimatedDistrict({
  manifest,
  build,
}: AnimatedDistrictOptions): (ctx: DistrictContext) => BaseDistrict {
  return (ctx: DistrictContext) => {
    const group = new THREE.Group();
    group.name = `district:${manifest.id}`;
    const children: SceneObject[] = [];
    let built: ReturnType<typeof build> | null = null;
    let mounted = false;
    let elapsed = 0;

    const district: BaseDistrict = {
      id: `district:${manifest.id}`,
      object3d: group,
      districtId: manifest.id,
      manifest,

      async prepare() {},

      mount() {
        mounted = true;
        if (!built) {
          built = build(ctx);
          for (const child of built.children) {
            group.add(child.object3d);
            children.push(child);
          }
          built.onMount?.();
        }
      },

      unmount() {
        mounted = false;
      },

      update(delta: number) {
        if (!mounted || !built?.update) {
          return;
        }
        elapsed += delta;
        built.update(elapsed, delta);
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
        built = null;
      },
    };

    return district;
  };
}
