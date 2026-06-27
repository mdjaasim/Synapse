import * as THREE from "three";
import { createOriginCore } from "./origin-core";
import { createAtmosphereField } from "./atmosphere-field";
import { createVolumetricFogField } from "./volumetric-fog-field";
import { createSceneObject } from "../../objects/scene-object";
import type { District, DistrictContext, DistrictMetadata } from "../district";
import type { SceneObject } from "../../objects/scene-object";

const METADATA: DistrictMetadata = {
  name: "Origin Void",
  mood: "calm",
  description:
    "The conceptual center of the universe (0,0,0): a calm, near-dark space from which everything originates.",
};

export interface OriginVoidDistrict extends District {
  /**
   * Mounts the deferred ambient layers (sky, fog, particles). Called after the
   * first paint so the core appears as fast as possible (incremental startup).
   */
  attachAmbient(): void;
}

/**
 * Builds the Origin Void district. The hero core is attached immediately; the
 * layered atmosphere is deferred via {@link OriginVoidDistrict.attachAmbient}.
 *
 * Mount order: sky dome → volumetric fog → atmosphere particles → energy particles.
 */
export function createOriginVoidDistrict(ctx: DistrictContext): OriginVoidDistrict {
  const group = new THREE.Group();
  group.name = "district:origin";
  const children: SceneObject[] = [];

  const core = createOriginCore(ctx.materials);
  group.add(core.object3d);
  children.push(core);

  let ambientAttached = false;
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

  return {
    id: "district:origin",
    object3d: group,
    districtId: "origin",
    metadata: METADATA,
    attachAmbient,
    dispose() {
      for (const child of children) {
        child.dispose();
      }
      children.length = 0;
    },
  };
}
