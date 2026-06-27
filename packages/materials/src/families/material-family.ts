import type { Material } from "three";
import type { ShaderRegistry, StandardUniforms } from "@synapse/shaders";

/**
 * Context passed to every material family when it builds its material. The
 * standard uniforms are shared by reference so the UniformManager's per-frame
 * write reaches every material at once.
 */
export interface MaterialFamilyContext {
  readonly standard: StandardUniforms;
  readonly shaders: ShaderRegistry;
}

/**
 * A material family is a "personality" (Doc 17/27). It owns how its three.js
 * Material is constructed and which shader capabilities it enables.
 */
export interface MaterialFamily {
  readonly id: string;
  create(ctx: MaterialFamilyContext): Material;
}
