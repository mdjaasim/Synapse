"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { FrameStateSource, FrameStatsHandler } from "@synapse/types";
import type { UniformManager } from "@synapse/shaders";
import type { CameraRig } from "@synapse/camera";

export interface FrameDriverProps {
  uniforms: UniformManager;
  cameraRig: CameraRig;
  source: FrameStateSource;
  onStats?: FrameStatsHandler | undefined;
}

/**
 * The single render-loop driver. Each frame it reads observed state, advances
 * the camera rig, writes the shared uniforms, and samples fps. Reduced motion
 * freezes time (delta 0) so all motion stops while the scene stays rendered.
 * This is how the renderer "observes" the engine without the engine ever
 * depending on the renderer.
 */
export function FrameDriver({ uniforms, cameraRig, source, onStats }: FrameDriverProps) {
  const camera = useThree((state) => state.camera);
  const elapsed = useRef(0);
  const sampler = useRef({ frames: 0, time: 0 });

  useFrame((_, delta) => {
    const dynamic = source.read();
    const dt = dynamic.reducedMotion ? 0 : delta;
    elapsed.current += dt;
    const time = elapsed.current;

    const pose = cameraRig.update(time, dynamic.reducedMotion);
    camera.position.set(pose.position.x, pose.position.y, pose.position.z);
    camera.lookAt(pose.target.x, pose.target.y, pose.target.z);

    const distance = Math.hypot(camera.position.x, camera.position.y, camera.position.z);
    uniforms.update({ frame: { ...dynamic, elapsed: time, delta: dt }, distance });

    if (onStats) {
      const s = sampler.current;
      s.frames += 1;
      s.time += delta;
      if (s.time >= 0.5) {
        onStats({ fps: s.frames / s.time });
        s.frames = 0;
        s.time = 0;
      }
    }
  });

  return null;
}
