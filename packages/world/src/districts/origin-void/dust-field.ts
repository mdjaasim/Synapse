import * as THREE from "three";
import { DUST_FAMILY, type MaterialFactory } from "@synapse/materials";
import { createSceneObject, type SceneObject } from "../../objects/scene-object";

export interface DustFieldOptions {
  readonly count?: number;
  readonly radius?: number;
  readonly seed?: number;
}

/** Small deterministic PRNG so the dust layout is stable across reloads. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Ambient dust — a single GPU-instanced Points cloud. Positions are generated
 * once (deterministic), and all motion happens in the dust shader via uTime.
 * No CPU per-frame work; this is intentionally NOT the Phase 4 Particle Engine.
 */
export function createDustField(
  materials: MaterialFactory,
  options: DustFieldOptions = {},
): SceneObject {
  const count = options.count ?? 600;
  const radius = options.radius ?? 14;
  const rng = mulberry32(options.seed ?? 1337);

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(rng());
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    scales[i] = 0.5 + rng() * 1.5;
    seeds[i] = rng();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const material = materials.get(DUST_FAMILY);
  const points = new THREE.Points(geometry, material);
  points.name = "dust";
  points.renderOrder = 10;
  points.frustumCulled = false;
  return createSceneObject({ id: "origin:dust", object3d: points, districtId: "origin" });
}
