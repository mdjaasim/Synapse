/**
 * Stable identifiers for built-in shader presets. Materials reference shaders
 * by id through the registry rather than importing GLSL directly.
 */
export const SHADER_IDS = {
  ATMOSPHERE: "atmosphere",
  DUST: "dust",
} as const;

export type ShaderId = (typeof SHADER_IDS)[keyof typeof SHADER_IDS];
