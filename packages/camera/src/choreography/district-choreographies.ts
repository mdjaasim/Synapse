import type { DistrictId } from "@synapse/types";
import type { CameraPoseState } from "../controller/camera-pose";
import { createDistrictCameraChoreography } from "./district-choreography";

const CHOREOGRAPHY_TARGETS: Record<
  DistrictId,
  {
    start: {
      position: { x: number; y: number; z: number };
      target: { x: number; y: number; z: number };
      fov: number;
    };
    end: {
      position: { x: number; y: number; z: number };
      target: { x: number; y: number; z: number };
      fov: number;
    };
  }
> = {
  origin: {
    start: { position: { x: 0, y: 0.6, z: 6 }, target: { x: 0, y: 0, z: 0 }, fov: 42 },
    end: { position: { x: -0.8, y: 0.3, z: 7.5 }, target: { x: 0, y: 0, z: 0 }, fov: 42 },
  },
  "project-galaxy": {
    start: { position: { x: -25, y: 3, z: -22 }, target: { x: -25, y: 0, z: -30 }, fov: 42 },
    end: { position: { x: -22, y: 5, z: -26 }, target: { x: -25, y: 0, z: -30 }, fov: 38 },
  },
  "client-worlds": {
    start: { position: { x: 25, y: 4, z: 24 }, target: { x: 25, y: 0, z: 15 }, fov: 42 },
    end: { position: { x: 28, y: 2, z: 18 }, target: { x: 25, y: 0, z: 15 }, fov: 40 },
  },
  "engineering-core": {
    start: { position: { x: 0, y: 2.5, z: -32 }, target: { x: 0, y: 0, z: -40 }, fov: 42 },
    end: { position: { x: 2, y: 1.5, z: -36 }, target: { x: 0, y: 0, z: -40 }, fov: 38 },
  },
  "knowledge-forest": {
    start: { position: { x: -30, y: 3, z: 28 }, target: { x: -30, y: 0, z: 20 }, fov: 42 },
    end: { position: { x: -27, y: 2, z: 22 }, target: { x: -30, y: 0, z: 20 }, fov: 40 },
  },
  "ai-observatory": {
    start: { position: { x: 0, y: 2, z: 44 }, target: { x: 0, y: 0, z: 35 }, fov: 42 },
    end: { position: { x: 0, y: 2.5, z: 40 }, target: { x: 0, y: 1.5, z: 35 }, fov: 38 },
  },
  "memory-stream": {
    start: { position: { x: 40, y: 2, z: 8 }, target: { x: 40, y: 0, z: 0 }, fov: 42 },
    end: { position: { x: 40, y: 4, z: 14 }, target: { x: 40, y: 0, z: 0 }, fov: 36 },
  },
};

export function createDistrictScrollChoreography(
  districtId: DistrictId,
  narrativePose: CameraPoseState,
) {
  const cfg = CHOREOGRAPHY_TARGETS[districtId];
  return createDistrictCameraChoreography(districtId, narrativePose, cfg.start, cfg.end);
}

export function registerAllDistrictChoreographies(
  narrativePose: CameraPoseState,
  register: (def: ReturnType<typeof createDistrictScrollChoreography>) => void,
): void {
  const ids = Object.keys(CHOREOGRAPHY_TARGETS) as DistrictId[];
  for (const id of ids) {
    register(createDistrictScrollChoreography(id, narrativePose));
  }
}
