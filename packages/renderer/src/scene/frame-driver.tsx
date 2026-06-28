"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { EnvironmentStateSource, FrameStateSource, FrameStatsHandler } from "@synapse/types";
import type { UniformManager } from "@synapse/shaders";
import type { CameraController } from "@synapse/camera";
import type { DistrictController } from "@synapse/world";
import { evaluateAdaptiveQuality } from "../quality/use-adaptive-quality";

export interface FrameDriverProps {
  uniforms: UniformManager;
  cameraController: CameraController;
  source: FrameStateSource;
  environmentSource: EnvironmentStateSource;
  districtController: DistrictController;
  onStats?: FrameStatsHandler | undefined;
  onQualityChange?: (preset: ReturnType<FrameStateSource["read"]>["quality"]) => void;
}

/**
 * The single render-loop driver. Uses THREE.Timer (not deprecated Clock) for
 * timing. Each frame it reads observed state, advances the camera controller,
 * writes shared uniforms, and samples fps.
 */
export function FrameDriver({
  uniforms,
  cameraController,
  source,
  environmentSource,
  districtController,
  onStats,
  onQualityChange,
}: FrameDriverProps) {
  const camera = useThree((state) => state.camera);
  const timer = useRef(new THREE.Timer());
  const sampler = useRef({ frames: 0, time: 0 });
  const qualitySampler = useRef({ lowSamples: 0, highSamples: 0 });
  const lastFov = useRef<number | null>(null);

  useFrame(() => {
    const dynamic = source.read();
    if (!dynamic.reducedMotion) {
      timer.current.update(performance.now());
    }
    const dt = dynamic.reducedMotion ? 0 : timer.current.getDelta();
    const elapsed = timer.current.getElapsed();

    environmentSource.tick?.({
      delta: dt > 0 ? dt : 1 / 60,
      scroll: dynamic.scroll,
      reducedMotion: dynamic.reducedMotion,
    });
    const environment = environmentSource.read();

    cameraController.setReducedMotion(dynamic.reducedMotion);
    const pose = cameraController.update(elapsed, dynamic.reducedMotion);
    camera.position.set(pose.position.x, pose.position.y, pose.position.z);
    camera.lookAt(pose.target.x, pose.target.y, pose.target.z);
    if ("fov" in camera && typeof camera.fov === "number") {
      camera.fov = pose.fov;
      if (lastFov.current !== pose.fov) {
        camera.updateProjectionMatrix();
        lastFov.current = pose.fov;
      }
    }

    const distance = Math.hypot(camera.position.x, camera.position.y, camera.position.z);
    uniforms.update({ frame: { ...dynamic, elapsed, delta: dt }, environment, distance });
    districtController.update(dt);

    if (onStats) {
      const s = sampler.current;
      s.frames += 1;
      s.time += dt > 0 ? dt : 1 / 60;
      if (s.time >= 0.5) {
        const fps = s.frames / s.time;
        onStats({ fps });

        if (onQualityChange) {
          const q = evaluateAdaptiveQuality({
            fps,
            current: dynamic.quality,
            ...qualitySampler.current,
          });
          qualitySampler.current = { lowSamples: q.lowSamples, highSamples: q.highSamples };
          if (q.preset !== dynamic.quality) {
            onQualityChange(q.preset);
          }
        }

        s.frames = 0;
        s.time = 0;
      }
    }
  });

  return null;
}
