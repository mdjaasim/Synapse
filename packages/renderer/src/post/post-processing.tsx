"use client";

import { Bloom, EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";
import type { QualityPreset } from "@synapse/types";
import { effectsForQuality } from "../quality/use-adaptive-quality";

/**
 * Restrained post-processing with multisampling disabled (avoids WebGL
 * framebuffer warnings with three r185). SMAA provides anti-aliasing.
 * Gated on non-zero canvas size to prevent zero-dimension framebuffer errors.
 */
export function PostProcessing({ quality }: { quality: QualityPreset }) {
  const size = useThree((s) => s.size);
  const flags = effectsForQuality(quality);

  if (size.width <= 0 || size.height <= 0) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      {flags.bloom ? (
        <Bloom intensity={0.45} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
      ) : (
        <></>
      )}
      {flags.smaa ? <SMAA /> : <></>}
      {flags.vignette ? <Vignette offset={0.3} darkness={0.7} /> : <></>}
    </EffectComposer>
  );
}
