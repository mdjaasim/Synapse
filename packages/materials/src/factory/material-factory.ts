import type { Material } from "three";
import type { MaterialFamily, MaterialFamilyContext } from "../families/material-family";

/**
 * Material Factory (Doc 27): builds and caches materials from families, binding
 * the shared standard uniforms. Materials never instantiate shaders manually,
 * and identical families are reused rather than duplicated.
 */
export class MaterialFactory {
  readonly #ctx: MaterialFamilyContext;
  readonly #cache = new Map<string, Material>();

  constructor(ctx: MaterialFamilyContext) {
    this.#ctx = ctx;
  }

  /** Returns the cached material for a family, creating it on first request. */
  get(family: MaterialFamily): Material {
    const cached = this.#cache.get(family.id);
    if (cached) {
      return cached;
    }
    const created = family.create(this.#ctx);
    this.#cache.set(family.id, created);
    return created;
  }

  /** Disposes every material this factory created. */
  dispose(): void {
    for (const material of this.#cache.values()) {
      material.dispose();
    }
    this.#cache.clear();
  }
}

export function createMaterialFactory(ctx: MaterialFamilyContext): MaterialFactory {
  return new MaterialFactory(ctx);
}
