/**
 * Shader Registry (Doc 27).
 *
 * A single place that owns reusable shader presets (vertex/fragment source).
 * Materials select a preset by id via the Material Factory; no shader exists for
 * a single object and no GLSL is duplicated.
 */

export interface ShaderPreset {
  readonly id: string;
  readonly vertex: string;
  readonly fragment: string;
}

export class ShaderRegistry {
  readonly #presets = new Map<string, ShaderPreset>();

  register(preset: ShaderPreset): void {
    this.#presets.set(preset.id, preset);
  }

  has(id: string): boolean {
    return this.#presets.has(id);
  }

  get(id: string): ShaderPreset {
    const preset = this.#presets.get(id);
    if (!preset) {
      throw new Error(`Shader preset "${id}" is not registered.`);
    }
    return preset;
  }
}

/** Creates a registry, optionally pre-populated with the given presets. */
export function createShaderRegistry(presets: readonly ShaderPreset[] = []): ShaderRegistry {
  const registry = new ShaderRegistry();
  for (const preset of presets) {
    registry.register(preset);
  }
  return registry;
}
