/**
 * @synapse/engine
 *
 * The Experience Engine: runtime, lifecycle, Event Bus, and the experience and
 * performance stores. Consumers instantiate systems through the exported
 * factories/classes; this package never creates module-scope singletons.
 */

export { EventBus, createEventBus } from "./event-bus/event-bus";
export {
  ExperienceEngine,
  createExperienceEngine,
  type ExperienceEngineStores,
} from "./runtime/experience-engine";
export { ENGINE_PHASES, type EnginePhase } from "./runtime/lifecycle";
export {
  createExperienceStore,
  type ExperienceActions,
  type ExperienceStore,
  type ExperienceStoreState,
} from "./stores/experience.store";
export {
  createPerformanceStore,
  type PerformanceActions,
  type PerformanceStore,
  type PerformanceStoreState,
} from "./stores/performance.store";
