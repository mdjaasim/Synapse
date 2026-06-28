import * as THREE from "three";
import type { QualityPreset } from "@synapse/types";
import type { StandardUniforms } from "@synapse/shaders";
import { PARTICLE_FAMILY_IDS } from "../registry/particle-ids";
import { ParticleRegistry, createParticleRegistry } from "../registry/particle-registry";
import { createAtmosphereParticleMaterial } from "../behaviors/atmosphere.behavior";
import { createEnergyParticleMaterial } from "../behaviors/energy-flow.behavior";
import { createInstancedPoints } from "../render/instanced-points";
import {
  ORIGIN_VOID_ENERGY_CAPS,
  ORIGIN_VOID_PARTICLE_CAPS,
  scaledCount,
} from "../simulation/quality-scaling";

export interface ParticleSystem {
  readonly id: string;
  readonly points: THREE.Points;
  dispose(): void;
}

export interface ParticleEngineOptions {
  readonly standard: StandardUniforms;
}

/**
 * Particle Engine (Doc 26). Owns particle families, GPU buffers, and quality
 * scaling. Framework-light (three.js only). World package mounts the returned
 * Points meshes into the scene graph.
 */
export class ParticleEngine {
  readonly registry: ParticleRegistry;
  readonly #standard: StandardUniforms;
  readonly #systems = new Map<string, ParticleSystem>();
  #quality: QualityPreset = "high";

  constructor({ standard }: ParticleEngineOptions) {
    this.#standard = standard;
    this.registry = createParticleRegistry();
    this.#registerBuiltinFamilies();
  }

  /** Builds Origin Void particle systems and returns them for world mounting. */
  createOriginVoidSystems(): readonly ParticleSystem[] {
    return this.createAtmosphereSystems("origin", 500, 16, 1337, "#8a9ec8");
  }

  /** Generic atmosphere particles for portfolio districts. */
  createAtmosphereSystems(
    districtId: string,
    baseCount: number,
    radius: number,
    seed: number,
    color = "#8a9ec8",
  ): readonly ParticleSystem[] {
    const count = scaledCount(baseCount, this.#quality, ORIGIN_VOID_PARTICLE_CAPS);
    if (count <= 0) {
      return [];
    }
    return [
      this.#createSystem(
        `${districtId}:particles:atmosphere`,
        createAtmosphereParticleMaterial({
          standard: this.#standard,
          color: new THREE.Color(color),
        }),
        { count, radius, seed },
      ),
    ];
  }

  /** Energy flow particles for engineering and AI districts. */
  createEnergySystems(
    districtId: string,
    baseCount: number,
    radius: number,
    seed: number,
  ): readonly ParticleSystem[] {
    const count = scaledCount(baseCount, this.#quality, ORIGIN_VOID_ENERGY_CAPS);
    if (count <= 0) {
      return [];
    }
    return [
      this.#createSystem(
        `${districtId}:particles:energy`,
        createEnergyParticleMaterial({ standard: this.#standard }),
        { count, radius, seed, radialFlow: true },
      ),
    ];
  }

  setQuality(quality: QualityPreset): void {
    this.#quality = quality;
  }

  get activeCount(): number {
    let total = 0;
    for (const sys of this.#systems.values()) {
      const pos = sys.points.geometry.getAttribute("position");
      if (pos) {
        total += pos.count;
      }
    }
    return total;
  }

  dispose(): void {
    for (const sys of this.#systems.values()) {
      sys.dispose();
    }
    this.#systems.clear();
    this.registry.clear();
  }

  #registerBuiltinFamilies(): void {
    this.registry.register({
      id: PARTICLE_FAMILY_IDS.ATMOSPHERE,
      family: "atmosphere",
      name: "Atmosphere Particles",
      maxCount: 600,
      narrativePurpose: "Scale and depth — the void is immense.",
    });
    this.registry.register({
      id: PARTICLE_FAMILY_IDS.ENERGY,
      family: "energy",
      name: "Energy Particles",
      maxCount: 120,
      narrativePurpose: "Genesis whisper — everything originates here.",
    });
  }

  #createSystem(
    id: string,
    material: THREE.ShaderMaterial,
    options: Parameters<typeof createInstancedPoints>[1],
  ): ParticleSystem {
    const points = createInstancedPoints(material, options);
    points.name = id;
    const system: ParticleSystem = {
      id,
      points,
      dispose() {
        points.geometry.dispose();
        material.dispose();
      },
    };
    this.#systems.set(id, system);
    return system;
  }
}

export function createParticleEngine(options: ParticleEngineOptions): ParticleEngine {
  return new ParticleEngine(options);
}
