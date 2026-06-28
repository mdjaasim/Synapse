import type { MaterialFactory } from "@synapse/materials";
import type { ParticleEngine } from "@synapse/particles";
import type { DistrictManifest } from "@synapse/types";
import type { SceneObject } from "../objects/scene-object";

/** Dependencies injected when constructing a district instance. */
export interface DistrictContext {
  readonly materials: MaterialFactory;
  readonly particles: ParticleEngine;
}

/** Optional animation registration context (Phase 5B). */
export interface DistrictAnimationContext {
  readonly districtId: string;
}

/** Optional interaction registration context (Phase 5B). */
export interface DistrictInteractionContext {
  readonly districtId: string;
}

/**
 * Base district contract (Doc 8 / Doc 16). Every district is data-driven via
 * its manifest and exposes a uniform lifecycle API.
 */
export interface BaseDistrict extends SceneObject {
  readonly manifest: DistrictManifest;

  prepare(): Promise<void>;
  mount(): void;
  unmount(): void;
  update(delta: number): void;
  enter(): void;
  exit(): void;
  registerAnimations(ctx: DistrictAnimationContext): void;
  registerInteractions(ctx: DistrictInteractionContext): void;
}

/** Factory signature registered in the district registry. */
export type DistrictFactory = (ctx: DistrictContext) => BaseDistrict;

/** A manifest + factory pair — the only input needed to register a district. */
export interface DistrictRegistration {
  readonly manifest: DistrictManifest;
  readonly create: DistrictFactory;
}
