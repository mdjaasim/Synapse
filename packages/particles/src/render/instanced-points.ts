import * as THREE from "three";

export interface InstancedPointsOptions {
  readonly count: number;
  readonly radius: number;
  readonly seed?: number;
  /** When true, particles get radial inward direction attributes (energy family). */
  readonly radialFlow?: boolean;
}

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
 * Creates a GPU-driven Points cloud with deterministic layout.
 * Positions initialized once on CPU; all animation happens in the vertex shader.
 */
export function createInstancedPoints(
  material: THREE.ShaderMaterial,
  options: InstancedPointsOptions,
): THREE.Points {
  const { count, radius, seed = 1337, radialFlow = false } = options;
  const rng = mulberry32(seed);

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);
  const directions = radialFlow ? new Float32Array(count * 3) : null;

  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(rng());
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi) * 0.55;
    const z = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    scales[i] = 0.4 + rng() * 1.0;
    seeds[i] = rng();

    if (directions) {
      const len = Math.hypot(x, y, z) || 1;
      directions[i * 3] = -x / len;
      directions[i * 3 + 1] = -y / len;
      directions[i * 3 + 2] = -z / len;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  if (directions) {
    geometry.setAttribute("aDirection", new THREE.BufferAttribute(directions, 3));
  }

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}
