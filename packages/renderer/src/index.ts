/**
 * @synapse/renderer
 *
 * The React Three Fiber rendering layer: the canvas, scene root, render loop,
 * lighting, and post-processing. This is the only package that depends on R3F.
 * It owns the Three.js Scene and observes application state through an injected
 * `FrameStateSource` (it never imports the Experience Engine).
 */

export { ExperienceCanvas, type ExperienceCanvasProps } from "./canvas/experience-canvas";
