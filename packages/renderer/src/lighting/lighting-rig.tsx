"use client";

import * as THREE from "three";
import { useEffect, useMemo } from "react";
import type { SceneLayers } from "@synapse/world";
import { ORIGIN_VOID_LIGHTING } from "./lighting-profiles";

/**
 * Mounts the Origin Void lights into the world's `lighting` layer (preserving
 * the ownership chain) and disposes them on unmount. Lights are created once
 * and added imperatively so they live alongside the imperative scene graph.
 */
export function LightingRig({ layers }: { layers: SceneLayers }) {
  const lights = useMemo<readonly THREE.Light[]>(() => {
    const profile = ORIGIN_VOID_LIGHTING;

    const ambient = new THREE.AmbientLight(
      new THREE.Color(profile.ambient.color),
      profile.ambient.intensity,
    );

    const key = new THREE.DirectionalLight(
      new THREE.Color(profile.key.color),
      profile.key.intensity,
    );
    if (profile.key.position) {
      key.position.set(profile.key.position.x, profile.key.position.y, profile.key.position.z);
    }

    const rim = new THREE.PointLight(new THREE.Color(profile.rim.color), profile.rim.intensity, 50);
    if (profile.rim.position) {
      rim.position.set(profile.rim.position.x, profile.rim.position.y, profile.rim.position.z);
    }

    return [ambient, key, rim];
  }, []);

  useEffect(() => {
    const layer = layers.lighting;
    for (const light of lights) {
      layer.add(light);
    }
    return () => {
      for (const light of lights) {
        layer.remove(light);
        light.dispose();
      }
    };
  }, [lights, layers]);

  return null;
}
