"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { FrameStateSource, FrameStatsHandler } from "@synapse/types";
import { dprForQuality } from "../quality/use-adaptive-quality";
import { SceneRoot } from "../scene/scene-root";

export interface ExperienceCanvasProps {
  source: FrameStateSource;
  onStats?: FrameStatsHandler;
  themeColor?: string;
}

/**
 * The R3F canvas — the renderer's public entry point and the one place R3F is
 * used. Configures a premium GL pipeline (ACES Filmic tone mapping, sRGB
 * output, clamped DPR) and hosts the scene. Mount client-side only.
 */
export function ExperienceCanvas({
  source,
  onStats,
  themeColor = "#5b8cff",
}: ExperienceCanvasProps) {
  const quality = source.read().quality;

  return (
    <Canvas
      dpr={dprForQuality(quality)}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false, stencil: false }}
      camera={{ position: [0, 0.6, 6], fov: 42, near: 0.1, far: 200 }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        scene.background = new THREE.Color("#02030a");
      }}
    >
      <SceneRoot source={source} onStats={onStats} themeColor={themeColor} />
    </Canvas>
  );
}
