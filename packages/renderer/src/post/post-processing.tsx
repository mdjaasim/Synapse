"use client";

import { Bloom, EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { BloomEffect, VignetteEffect } from "postprocessing";
import type { FrameStateSource } from "@synapse/types";
import { bloomIntensityForDistrict, effectsForQuality } from "../quality/use-adaptive-quality";

/**
 * Restrained post-processing — district-tuned bloom, transition-aware vignette.
 */
export function PostProcessing({ source }: { source: FrameStateSource }) {
  const size = useThree((s) => s.size);
  const bloomEffect = useRef<BloomEffect>(null);
  const vignetteEffect = useRef<VignetteEffect>(null);

  useFrame(() => {
    const frame = source.read();
    const flags = effectsForQuality(frame.quality);
    if (bloomEffect.current) {
      bloomEffect.current.intensity = flags.bloom
        ? bloomIntensityForDistrict(frame.currentDistrict)
        : 0;
    }
    if (vignetteEffect.current) {
      const t = frame.transitionProgress;
      const active = t < 1;
      vignetteEffect.current.offset = active ? 0.25 + (1 - t) * 0.15 : 0.3;
      vignetteEffect.current.darkness = active ? 0.75 + (1 - t) * 0.2 : 0.7;
    }
  });

  const quality = source.read().quality;
  const flags = effectsForQuality(quality);
  const districtBloom = bloomIntensityForDistrict(source.read().currentDistrict);

  if (size.width <= 0 || size.height <= 0) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      {flags.bloom ? (
        <Bloom
          ref={bloomEffect}
          intensity={districtBloom}
          luminanceThreshold={0.58}
          luminanceSmoothing={0.32}
          mipmapBlur
        />
      ) : (
        <></>
      )}
      {flags.smaa ? <SMAA /> : <></>}
      {flags.vignette ? <Vignette ref={vignetteEffect} offset={0.3} darkness={0.7} /> : <></>}
    </EffectComposer>
  );
}
