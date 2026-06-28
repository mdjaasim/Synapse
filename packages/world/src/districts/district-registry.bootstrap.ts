import type { DistrictRegistry } from "./district-registry";
import { ORIGIN_VOID_REGISTRATION } from "./origin-void/origin-void.district";
import { MEMORY_STREAM_REGISTRATION } from "./memory-stream/memory-stream.district";
import { KNOWLEDGE_FOREST_REGISTRATION } from "./knowledge-forest/knowledge-forest.district";
import { ENGINEERING_CORE_REGISTRATION } from "./engineering-core/engineering-core.district";
import { CLIENT_WORLDS_REGISTRATION } from "./client-worlds/client-worlds.district";
import { PROJECT_GALAXY_REGISTRATION } from "./project-galaxy/project-galaxy.district";
import { AI_OBSERVATORY_REGISTRATION } from "./ai-observatory/ai-observatory.district";

const ALL_REGISTRATIONS = [
  ORIGIN_VOID_REGISTRATION,
  MEMORY_STREAM_REGISTRATION,
  KNOWLEDGE_FOREST_REGISTRATION,
  ENGINEERING_CORE_REGISTRATION,
  CLIENT_WORLDS_REGISTRATION,
  PROJECT_GALAXY_REGISTRATION,
  AI_OBSERVATORY_REGISTRATION,
] as const;

/**
 * Single bootstrap entry that registers every district.
 * This is the only file allowed to import all district modules.
 */
export function bootstrapDistrictRegistry(registry: DistrictRegistry): void {
  for (const registration of ALL_REGISTRATIONS) {
    registry.register(registration);
  }
}
