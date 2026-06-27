import type { NextConfig } from "next";

/**
 * Synapse packages are consumed as TypeScript source and transpiled by Next.js,
 * so no per-package build step is required.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@synapse/engine",
    "@synapse/world",
    "@synapse/renderer",
    "@synapse/animation",
    "@synapse/camera",
    "@synapse/interactions",
    "@synapse/particles",
    "@synapse/shaders",
    "@synapse/materials",
    "@synapse/ai",
    "@synapse/ui",
    "@synapse/assets",
    "@synapse/config",
    "@synapse/hooks",
    "@synapse/types",
    "@synapse/utils",
  ],
};

export default nextConfig;
