"use client";

import * as THREE from "three";
import { useEffect, useState } from "react";
import { createSynapseShaderRegistry, createUniformManager } from "@synapse/shaders";
import { createMaterialFactory, type MaterialFactory } from "@synapse/materials";
import { createParticleEngine, type ParticleEngine } from "@synapse/particles";
import {
  createOriginVoidDistrict,
  createWorldRoot,
  DistrictManager,
  type OriginVoidDistrict,
  type WorldRoot,
} from "@synapse/world";
import type { CameraController } from "@synapse/camera";
import type { EnvironmentStateSource, FrameStateSource, FrameStatsHandler } from "@synapse/types";
import type { UniformManager } from "@synapse/shaders";
import { LightingRig } from "../lighting/lighting-rig";
import { PostProcessing } from "../post/post-processing";
import { FrameDriver } from "./frame-driver";

export interface SceneRootProps {
  source: FrameStateSource;
  environmentSource: EnvironmentStateSource;
  cameraController: CameraController;
  onStats?: FrameStatsHandler | undefined;
  themeColor: string;
}

interface RenderSystems {
  readonly uniforms: UniformManager;
  readonly materials: MaterialFactory;
  readonly particles: ParticleEngine;
  readonly worldRoot: WorldRoot;
  readonly districts: DistrictManager;
  readonly district: OriginVoidDistrict;
}

function buildSystems(
  themeColor: string,
  quality: ReturnType<FrameStateSource["read"]>["quality"],
): RenderSystems {
  const shaders = createSynapseShaderRegistry();
  const uniforms = createUniformManager({ themeColor: new THREE.Color(themeColor) });
  const materials = createMaterialFactory({ standard: uniforms.uniforms, shaders });
  const particles = createParticleEngine({ standard: uniforms.uniforms });
  particles.setQuality(quality);
  const worldRoot = createWorldRoot();
  const districts = new DistrictManager({ worldRoot });
  const district = createOriginVoidDistrict({ materials, particles });
  districts.activate(district);
  return { uniforms, materials, particles, worldRoot, districts, district };
}

export function SceneRoot({
  source,
  environmentSource,
  cameraController,
  onStats,
  themeColor,
}: SceneRootProps) {
  const [systems, setSystems] = useState<RenderSystems | null>(null);
  const [postReady, setPostReady] = useState(false);

  useEffect(() => {
    const built = buildSystems(themeColor, source.read().quality);
    setSystems(built);

    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      built.district.attachAmbient();
      secondFrame = requestAnimationFrame(() => setPostReady(true));
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      built.districts.dispose();
      built.worldRoot.dispose();
      built.particles.dispose();
      built.materials.dispose();
      setSystems(null);
      setPostReady(false);
    };
  }, [themeColor, source]);

  if (!systems) {
    return null;
  }

  return (
    <>
      <primitive object={systems.worldRoot.group} />
      <LightingRig
        layers={systems.worldRoot.layers}
        frameSource={source}
        environmentSource={environmentSource}
      />
      <FrameDriver
        uniforms={systems.uniforms}
        cameraController={cameraController}
        source={source}
        environmentSource={environmentSource}
        onStats={onStats}
      />
      {postReady ? <PostProcessing quality={source.read().quality} /> : null}
    </>
  );
}
