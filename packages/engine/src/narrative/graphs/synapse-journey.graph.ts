import type { NarrativeGraph } from "@synapse/types";
import { composeNarrativeGraph } from "./compose-narrative-graph";
import { JOURNEY_SEGMENTS } from "./segments/journey-segments";

export const SYNAPSE_JOURNEY_GRAPH: NarrativeGraph = composeNarrativeGraph(
  "synapse-journey",
  "Mohamed Jaasim — Cognitive Universe",
  "origin:spark",
  JOURNEY_SEGMENTS,
);

export function registerSynapseJourneyGraph(registry: {
  register(graph: NarrativeGraph): void;
}): void {
  registry.register(SYNAPSE_JOURNEY_GRAPH);
}
