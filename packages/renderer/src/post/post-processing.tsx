"use client";

import { Bloom, EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import type { QualityPreset } from "@synapse/types";
import { effectsForQuality } from "../quality/use-adaptive-quality";

/**
 * Restrained post-processing (Doc 17 allow-list): subtle mipmap Bloom to let
 * the core and dust glow, optional SMAA, and a gentle Vignette. Effects are
 * gated by quality so low-end devices skip the expensive passes.
 */
export function PostProcessing({ quality }: { quality: QualityPreset }) {
  const flags = effectsForQuality(quality);
  return (
    <EffectComposer>
      {flags.bloom ? (
        <Bloom intensity={0.6} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
      ) : (
        <></>
      )}
      {flags.smaa ? <SMAA /> : <></>}
      {flags.vignette ? <Vignette offset={0.3} darkness={0.7} /> : <></>}
    </EffectComposer>
  );
}
