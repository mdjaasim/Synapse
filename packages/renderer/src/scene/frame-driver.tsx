"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { EnvironmentStateSource, FrameStateSource, FrameStatsHandler } from "@synapse/types";
import type { UniformManager } from "@synapse/shaders";
import type { CameraController } from "@synapse/camera";
import type { DistrictController } from "@synapse/world";

export interface FrameDriverProps {
  uniforms: UniformManager;
  cameraController: CameraController;
  source: FrameStateSource;
  environmentSource: EnvironmentStateSource;
  districtController: DistrictController;
  onStats?: FrameStatsHandler | undefined;
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
}: FrameDriverProps) {
  const camera = useThree((state) => state.camera);
  const timer = useRef(new THREE.Timer());
  const sampler = useRef({ frames: 0, time: 0 });

  useFrame(() => {
    const dynamic = source.read();
    const environment = environmentSource.read();
    if (!dynamic.reducedMotion) {
      timer.current.update(performance.now());
    }
    const dt = dynamic.reducedMotion ? 0 : timer.current.getDelta();
    const elapsed = timer.current.getElapsed();

    const pose = cameraController.update(elapsed, dynamic.reducedMotion);
    camera.position.set(pose.position.x, pose.position.y, pose.position.z);
    camera.lookAt(pose.target.x, pose.target.y, pose.target.z);
    if ("fov" in camera && typeof camera.fov === "number") {
      camera.fov = pose.fov;
      camera.updateProjectionMatrix();
    }

    const distance = Math.hypot(camera.position.x, camera.position.y, camera.position.z);
    uniforms.update({ frame: { ...dynamic, elapsed, delta: dt }, environment, distance });
    districtController.update(dt);

    if (onStats) {
      const s = sampler.current;
      s.frames += 1;
      s.time += dt > 0 ? dt : 1 / 60;
      if (s.time >= 0.5) {
        onStats({ fps: s.frames / s.time });
        s.frames = 0;
        s.time = 0;
      }
    }
  });

  return null;
}
