"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { CameraController } from "@synapse/camera";
import type { EnvironmentStateSource, FrameStateSource, FrameStatsHandler } from "@synapse/types";
import { dprForQuality } from "../quality/use-adaptive-quality";
import { SceneRoot } from "../scene/scene-root";

export interface ExperienceCanvasProps {
  source: FrameStateSource;
  environmentSource: EnvironmentStateSource;
  cameraController: CameraController;
  onStats?: FrameStatsHandler;
  themeColor?: string;
}

/**
 * The R3F canvas entry point. Antialias is disabled because post-processing
 * uses SMAA; native MSAA conflicts with EffectComposer multisampling.
 */
export function ExperienceCanvas({
  source,
  environmentSource,
  cameraController,
  onStats,
  themeColor = "#5b8cff",
}: ExperienceCanvasProps) {
  const quality = source.read().quality;

  return (
    <Canvas
      dpr={dprForQuality(quality)}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
      }}
      camera={{ position: [0, 0.6, 6], fov: 42, near: 0.1, far: 200 }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        scene.background = new THREE.Color("#02030a");
      }}
    >
      <SceneRoot
        source={source}
        environmentSource={environmentSource}
        cameraController={cameraController}
        onStats={onStats}
        themeColor={themeColor}
      />
    </Canvas>
  );
}
