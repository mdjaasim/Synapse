import type { Mood } from "@synapse/types";
import type { MaterialFactory } from "@synapse/materials";
import type { ParticleEngine } from "@synapse/particles";
import type { SceneObject } from "../objects/scene-object";

/** Static, automation-friendly description of a district (Doc 16). */
export interface DistrictMetadata {
  readonly name: string;
  readonly mood: Mood;
  readonly description: string;
}

/** Dependencies a district needs to build its scene objects. */
export interface DistrictContext {
  readonly materials: MaterialFactory;
  readonly particles: ParticleEngine;
}

/**
 * A District is a Scene Object (its `object3d` is a group) with metadata. Its
 * children are parented under that group, preserving the ownership chain.
 */
export interface District extends SceneObject {
  readonly metadata: DistrictMetadata;
}
