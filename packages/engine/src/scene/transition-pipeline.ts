import type {
  DistrictId,
  DistrictTransitionKind,
  StoryNode,
  StoryNodeId,
  SynapseEventBus,
} from "@synapse/types";
import type { DistrictCommandPort } from "@synapse/types";
import type { TransitionHandlerRegistry } from "./transition-handler-registry";

export interface TransitionPipelineOptions {
  readonly bus: SynapseEventBus;
  readonly district: DistrictCommandPort;
  readonly handlers: TransitionHandlerRegistry;
}

export interface NarrativeTransitionRequest {
  readonly kind: DistrictTransitionKind;
  readonly fromNodeId: StoryNodeId | null;
  readonly toNode: StoryNode;
  readonly fromDistrictId: DistrictId | null;
}

/**
 * Narrative-layer transition coordinator above district execution.
 * Publishes story.transition* events; delegates district navigation to ports.
 */
export class TransitionPipeline {
  readonly #bus: SynapseEventBus;
  readonly #district: DistrictCommandPort;
  readonly #handlers: TransitionHandlerRegistry;

  constructor({ bus, district, handlers }: TransitionPipelineOptions) {
    this.#bus = bus;
    this.#district = district;
    this.#handlers = handlers;
  }

  async execute(request: NarrativeTransitionRequest): Promise<void> {
    const { kind, fromNodeId, toNode, fromDistrictId } = request;
    const toDistrictId = toNode.districtId;

    this.#bus.publish("story.transitionStarted", {
      kind,
      fromNodeId,
      toNodeId: toNode.id,
      fromDistrictId,
      toDistrictId,
    });

    this.#handlers.get(kind).execute();

    if (fromDistrictId !== toDistrictId) {
      await this.#district.navigateTo(toDistrictId, kind);
    }

    this.#bus.publish("story.transitionCompleted", {
      kind,
      fromNodeId,
      toNodeId: toNode.id,
      fromDistrictId,
      toDistrictId,
    });
  }
}

export function createTransitionPipeline(options: TransitionPipelineOptions): TransitionPipeline {
  return new TransitionPipeline(options);
}
