"use client";

import * as THREE from "three";
import { useEffect, useState } from "react";
import { createSynapseShaderRegistry, createUniformManager } from "@synapse/shaders";
import { createMaterialFactory, type MaterialFactory } from "@synapse/materials";
import {
  createOriginVoidDistrict,
  createWorldRoot,
  DistrictManager,
  type OriginVoidDistrict,
  type WorldRoot,
} from "@synapse/world";
import { createCameraRig, ORIGIN_VOID_CAMERA, type CameraRig } from "@synapse/camera";
import type { FrameStateSource, FrameStatsHandler } from "@synapse/types";
import type { UniformManager } from "@synapse/shaders";
import { LightingRig } from "../lighting/lighting-rig";
import { PostProcessing } from "../post/post-processing";
import { FrameDriver } from "./frame-driver";

export interface SceneRootProps {
  source: FrameStateSource;
  onStats?: FrameStatsHandler | undefined;
  themeColor: string;
}

interface RenderSystems {
  readonly uniforms: UniformManager;
  readonly materials: MaterialFactory;
  readonly worldRoot: WorldRoot;
  readonly districts: DistrictManager;
  readonly district: OriginVoidDistrict;
  readonly cameraRig: CameraRig;
}

/**
 * Builds the rendering systems via dependency injection (no module singletons):
 * shader registry -> uniform manager -> material factory -> world root ->
 * district manager -> Origin Void. Only the hero core is attached here so the
 * first frame is fast.
 */
function buildSystems(themeColor: string): RenderSystems {
  const shaders = createSynapseShaderRegistry();
  const uniforms = createUniformManager({ themeColor: new THREE.Color(themeColor) });
  const materials = createMaterialFactory({ standard: uniforms.uniforms, shaders });
  const worldRoot = createWorldRoot();
  const districts = new DistrictManager({ worldRoot });
  const district = createOriginVoidDistrict({ materials });
  districts.activate(district);
  const cameraRig = createCameraRig(ORIGIN_VOID_CAMERA);
  return { uniforms, materials, worldRoot, districts, district, cameraRig };
}

/**
 * Owns the scene graph for the React lifetime. Creation and disposal are paired
 * in one effect so every mount (including React StrictMode's dev double-mount)
 * gets a fresh, fully-disposed set of GPU resources. Startup is incremental:
 * ambient layers attach on the next frame and post-processing one frame later.
 */
export function SceneRoot({ source, onStats, themeColor }: SceneRootProps) {
  const [systems, setSystems] = useState<RenderSystems | null>(null);
  const [postReady, setPostReady] = useState(false);

  useEffect(() => {
    const built = buildSystems(themeColor);
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
      built.materials.dispose();
      setSystems(null);
      setPostReady(false);
    };
  }, [themeColor]);

  if (!systems) {
    return null;
  }

  return (
    <>
      <primitive object={systems.worldRoot.group} />
      <LightingRig layers={systems.worldRoot.layers} />
      <FrameDriver
        uniforms={systems.uniforms}
        cameraRig={systems.cameraRig}
        source={source}
        onStats={onStats}
      />
      {postReady ? <PostProcessing quality={source.read().quality} /> : null}
    </>
  );
}
