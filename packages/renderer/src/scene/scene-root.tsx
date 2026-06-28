"use client";

import * as THREE from "three";
import { useEffect, useState } from "react";
import { createSynapseShaderRegistry, createUniformManager } from "@synapse/shaders";
import { createMaterialFactory, type MaterialFactory } from "@synapse/materials";
import { createParticleEngine, type ParticleEngine } from "@synapse/particles";
import type { DistrictContext, DistrictController } from "@synapse/world";
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
  districtController: DistrictController;
  bindRenderContext: (ctx: DistrictContext) => void;
  onRenderContextReady?: () => Promise<void>;
  onStats?: FrameStatsHandler | undefined;
  themeColor: string;
}

interface RenderSystems {
  readonly uniforms: UniformManager;
  readonly materials: MaterialFactory;
  readonly particles: ParticleEngine;
}

function buildRenderSystems(
  themeColor: string,
  quality: ReturnType<FrameStateSource["read"]>["quality"],
): RenderSystems {
  const shaders = createSynapseShaderRegistry();
  const uniforms = createUniformManager({ themeColor: new THREE.Color(themeColor) });
  const materials = createMaterialFactory({ standard: uniforms.uniforms, shaders });
  const particles = createParticleEngine({ standard: uniforms.uniforms });
  particles.setQuality(quality);
  return { uniforms, materials, particles };
}

export function SceneRoot({
  source,
  environmentSource,
  cameraController,
  districtController,
  bindRenderContext,
  onRenderContextReady,
  onStats,
  themeColor,
}: SceneRootProps) {
  const [systems, setSystems] = useState<RenderSystems | null>(null);
  const [postReady, setPostReady] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const built = buildRenderSystems(themeColor, source.read().quality);
    setSystems(built);
    bindRenderContext({ materials: built.materials, particles: built.particles });

    let cancelled = false;
    let secondFrame = 0;

    const readyPromise = onRenderContextReady?.() ?? Promise.resolve();
    void readyPromise.then(() => {
      if (cancelled) {
        return;
      }
      setReady(true);
      secondFrame = requestAnimationFrame(() => setPostReady(true));
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(secondFrame);
      built.particles.dispose();
      built.materials.dispose();
      setSystems(null);
      setReady(false);
      setPostReady(false);
    };
  }, [themeColor, source, bindRenderContext, onRenderContextReady]);

  if (!systems || !ready) {
    return null;
  }

  return (
    <>
      <primitive object={districtController.worldRoot.group} />
      <LightingRig
        layers={districtController.worldRoot.layers}
        frameSource={source}
        environmentSource={environmentSource}
      />
      <FrameDriver
        uniforms={systems.uniforms}
        cameraController={cameraController}
        source={source}
        environmentSource={environmentSource}
        districtController={districtController}
        onStats={onStats}
      />
      {postReady ? <PostProcessing quality={source.read().quality} /> : null}
    </>
  );
}
