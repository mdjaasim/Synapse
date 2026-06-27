"use client";

import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { SceneLayers } from "@synapse/world";
import type { EnvironmentStateSource, FrameStateSource } from "@synapse/types";
import { interpolateOriginVoidLighting } from "./lighting-profiles";

interface LightingRigLights {
  readonly ambient: THREE.AmbientLight;
  readonly key: THREE.DirectionalLight;
  readonly rim: THREE.PointLight;
}

/**
 * Mounts the Origin Void lights into the world's `lighting` layer and updates
 * their color/intensity each frame from mood, scroll, and environmental bias.
 */
export function LightingRig({
  layers,
  frameSource,
  environmentSource,
}: {
  layers: SceneLayers;
  frameSource: FrameStateSource;
  environmentSource: EnvironmentStateSource;
}) {
  const lights = useMemo<LightingRigLights>(() => {
    const ambient = new THREE.AmbientLight("#10182f", 0.6);
    const key = new THREE.DirectionalLight("#9ab4ff", 1.4);
    key.position.set(3, 4, 5);
    const rim = new THREE.PointLight("#3a5bd0", 1.1, 50);
    rim.position.set(-4, -2, -3);
    return { ambient, key, rim };
  }, []);

  useEffect(() => {
    const layer = layers.lighting;
    const all = [lights.ambient, lights.key, lights.rim];
    for (const light of all) {
      layer.add(light);
    }
    return () => {
      for (const light of all) {
        layer.remove(light);
        light.dispose();
      }
    };
  }, [lights, layers]);

  useFrame(() => {
    const frame = frameSource.read();
    const env = environmentSource.read();
    const profile = interpolateOriginVoidLighting(frame.mood, frame.scroll, env.lightBias);

    lights.ambient.color.set(profile.ambient.color);
    lights.ambient.intensity = profile.ambient.intensity;

    lights.key.color.set(profile.key.color);
    lights.key.intensity = profile.key.intensity;
    if (profile.key.position) {
      lights.key.position.set(
        profile.key.position.x,
        profile.key.position.y,
        profile.key.position.z,
      );
    }

    lights.rim.color.set(profile.rim.color);
    lights.rim.intensity = profile.rim.intensity;
    if (profile.rim.position) {
      lights.rim.position.set(
        profile.rim.position.x,
        profile.rim.position.y,
        profile.rim.position.z,
      );
    }
  });

  return null;
}
