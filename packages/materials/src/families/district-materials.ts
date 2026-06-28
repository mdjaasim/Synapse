import { createEmissivePhysicalFamily } from "./emissive-physical";

export const COSMIC_MATTER_FAMILY = createEmissivePhysicalFamily("cosmic-matter", {
  color: "#1a1530",
  emissive: "#3d2a6b",
  glow: "#c4a0ff",
  emissiveIntensity: 1.2,
  roughness: 0.15,
  transmission: 0.55,
  thickness: 1.4,
});

export const ARCHITECTURAL_GLASS_FAMILY = createEmissivePhysicalFamily("architectural-glass", {
  color: "#141820",
  emissive: "#2a3548",
  glow: "#8ab4f8",
  emissiveIntensity: 0.9,
  roughness: 0.08,
  transmission: 0.72,
  thickness: 1.2,
  metalness: 0.2,
});

export const PRECISION_METAL_FAMILY = createEmissivePhysicalFamily("precision-metal", {
  color: "#121418",
  emissive: "#1e2836",
  glow: "#6ec4ff",
  emissiveIntensity: 1.0,
  roughness: 0.25,
  transmission: 0.2,
  thickness: 0.8,
  metalness: 0.65,
});

export const BIOLUMINESCENT_BARK_FAMILY = createEmissivePhysicalFamily("bioluminescent-bark", {
  color: "#0f1a14",
  emissive: "#1a3d2a",
  glow: "#5dffb0",
  emissiveIntensity: 1.1,
  roughness: 0.35,
  transmission: 0.15,
  thickness: 0.6,
});

export const ETHER_LIGHT_FAMILY = createEmissivePhysicalFamily("ether-light", {
  color: "#101828",
  emissive: "#243656",
  glow: "#9ec5ff",
  emissiveIntensity: 1.3,
  roughness: 0.1,
  transmission: 0.8,
  thickness: 2.0,
});

export const MEMORY_CRYSTAL_FAMILY = createEmissivePhysicalFamily("memory-crystal", {
  color: "#18122a",
  emissive: "#352a55",
  glow: "#d4b8ff",
  emissiveIntensity: 1.15,
  roughness: 0.05,
  transmission: 0.85,
  thickness: 1.8,
});

export const DISTRICT_MATERIAL_FAMILIES = [
  COSMIC_MATTER_FAMILY,
  ARCHITECTURAL_GLASS_FAMILY,
  PRECISION_METAL_FAMILY,
  BIOLUMINESCENT_BARK_FAMILY,
  ETHER_LIGHT_FAMILY,
  MEMORY_CRYSTAL_FAMILY,
] as const;

export const DISTRICT_MATERIAL_IDS = {
  COSMIC: COSMIC_MATTER_FAMILY.id,
  GLASS: ARCHITECTURAL_GLASS_FAMILY.id,
  METAL: PRECISION_METAL_FAMILY.id,
  BARK: BIOLUMINESCENT_BARK_FAMILY.id,
  ETHER: ETHER_LIGHT_FAMILY.id,
  CRYSTAL: MEMORY_CRYSTAL_FAMILY.id,
} as const;
