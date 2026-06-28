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
export {
  createNarrativeGraphRegistry,
  type NarrativeGraphRegistry,
} from "./narrative/narrative-graph-registry";
export {
  ORIGIN_VOID_NARRATIVE_GRAPH,
  registerOriginVoidGraph,
} from "./narrative/graphs/origin-void-narrative.graph";
export {
  SYNAPSE_JOURNEY_GRAPH,
  registerSynapseJourneyGraph,
} from "./narrative/graphs/synapse-journey.graph";
export {
  composeNarrativeGraph,
  nodePair,
  type NarrativeSegment,
} from "./narrative/graphs/compose-narrative-graph";
export { createNarrativeDirector, type NarrativeDirector } from "./narrative/narrative-director";
export { createScrollDirector, type ScrollDirector } from "./scroll/scroll-director";
export {
  createSceneStateStore,
  syncSceneToExperience,
  type SceneStateStore,
  type SceneStateStoreState,
} from "./scene/scene-state.store";
export { createSceneDirector, type SceneDirector } from "./scene/scene-director";
export { createSceneDirectorBundle, type SceneDirectorBundle } from "./scene/create-scene-director";
export { createTransitionPipeline, type TransitionPipeline } from "./scene/transition-pipeline";
export { createLoadingStrategy, type LoadingStrategy } from "./scene/loading-strategy";
