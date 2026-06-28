import type {
  AnimationCommandPort,
  CameraCommandPort,
  DistrictCommandPort,
  SynapseEventBus,
} from "@synapse/types";
import type { ExperienceStore } from "../stores/experience.store";
import { createNarrativeDirector } from "../narrative/narrative-director";
import {
  createNarrativeGraphRegistry,
  type NarrativeGraphRegistry,
} from "../narrative/narrative-graph-registry";
import { registerSynapseJourneyGraph } from "../narrative/graphs/synapse-journey.graph";
import { createScrollDirector, type ScrollDirector } from "../scroll/scroll-director";
import { createSceneDirector, type SceneDirector } from "./scene-director";

export interface SceneDirectorBundle {
  readonly registry: NarrativeGraphRegistry;
  readonly sceneDirector: SceneDirector;
  readonly scrollDirector: ScrollDirector;
}

export interface CreateSceneDirectorBundleOptions {
  readonly graphId?: string;
  readonly bus: SynapseEventBus;
  readonly experienceStore: ExperienceStore;
  readonly district: DistrictCommandPort;
  readonly camera: CameraCommandPort;
  readonly animation?: AnimationCommandPort;
}

/** Wires narrative graph, directors, and scroll pipeline for DI in the app layer. */
export function createSceneDirectorBundle({
  graphId = "synapse-journey",
  bus,
  experienceStore,
  district,
  camera,
  animation,
}: CreateSceneDirectorBundleOptions): SceneDirectorBundle {
  const registry = createNarrativeGraphRegistry();
  registerSynapseJourneyGraph(registry);

  const narrativeDirector = createNarrativeDirector({ graphId, registry });
  const sceneDirector = createSceneDirector({
    graphId,
    bus,
    experienceStore,
    registry,
    narrativeDirector,
    district,
    camera,
    ...(animation ? { animation } : {}),
  });

  const scrollDirector = createScrollDirector({
    narrativeDirector,
    onIntent: (intent) => {
      void sceneDirector.handleNarrativeIntent(intent);
    },
    getPaused: () => sceneDirector.sceneState.getState().narrativePaused,
  });

  return { registry, sceneDirector, scrollDirector };
}
