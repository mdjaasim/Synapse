import * as THREE from "three";
import type { MaterialFactory } from "@synapse/materials";
import type { DistrictId } from "@synapse/types";
import { createSceneObject, type SceneObject } from "../../objects/scene-object";

export interface OrbitingSphereSpec {
  readonly id: string;
  readonly districtId: DistrictId;
  readonly radius: number;
  readonly orbitRadius: number;
  readonly orbitSpeed: number;
  readonly phase: number;
  readonly size: number;
  readonly materialFamilyId: string;
}

export interface OrbitingSphereGroup {
  readonly group: THREE.Group;
  readonly update: (elapsed: number) => void;
  readonly dispose: () => void;
}

export function createOrbitingSpheres(
  materials: MaterialFactory,
  specs: readonly OrbitingSphereSpec[],
  getMaterial: (factory: MaterialFactory, familyId: string) => THREE.Material,
): OrbitingSphereGroup {
  const group = new THREE.Group();
  const entries: Array<{ mesh: THREE.Mesh; spec: OrbitingSphereSpec }> = [];

  for (const spec of specs) {
    const geometry = new THREE.SphereGeometry(spec.size, 48, 48);
    const material = getMaterial(materials, spec.materialFamilyId);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = spec.id;
    group.add(mesh);
    entries.push({ mesh, spec });
  }

  return {
    group,
    update(elapsed: number) {
      for (const { mesh, spec } of entries) {
        const angle = elapsed * spec.orbitSpeed + spec.phase;
        mesh.position.set(
          Math.cos(angle) * spec.orbitRadius,
          Math.sin(angle * 0.7) * spec.orbitRadius * 0.35,
          Math.sin(angle) * spec.orbitRadius,
        );
        mesh.rotation.y = elapsed * 0.15 + spec.phase;
      }
    },
    dispose() {
      for (const { mesh } of entries) {
        mesh.geometry.dispose();
        group.remove(mesh);
      }
    },
  };
}

export function wrapOrbitingGroup(
  districtId: DistrictId,
  orbiting: OrbitingSphereGroup,
): SceneObject {
  return createSceneObject({
    id: `district:${districtId}:orbits`,
    object3d: orbiting.group,
    districtId,
    onDispose: () => orbiting.dispose(),
  });
}

export function createBackdropDome(
  materials: MaterialFactory,
  familyId: string,
  radius: number,
  districtId: DistrictId,
  getMaterial: (factory: MaterialFactory, familyId: string) => THREE.Material,
): SceneObject {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = getMaterial(materials, familyId);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `${districtId}-backdrop`;
  mesh.renderOrder = -50;
  mesh.frustumCulled = false;

  return createSceneObject({
    id: `district:${districtId}:backdrop`,
    object3d: mesh,
    districtId,
    onDispose: () => {
      geometry.dispose();
    },
  });
}

export function createInstancedColumns(
  districtId: DistrictId,
  count: number,
  spread: number,
  height: number,
  material: THREE.Material,
): SceneObject {
  const geometry = new THREE.BoxGeometry(0.4, height, 0.4);
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.name = `${districtId}-columns`;
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i += 1) {
    const seed = i * 1.618;
    dummy.position.set(
      (Math.sin(seed) * 0.5 + 0.5) * spread - spread / 2,
      height / 2 - 1,
      (Math.cos(seed * 1.3) * 0.5 + 0.5) * spread - spread / 2,
    );
    dummy.scale.setScalar(0.6 + (i % 3) * 0.2);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;

  return createSceneObject({
    id: `district:${districtId}:columns`,
    object3d: mesh,
    districtId,
    onDispose: () => geometry.dispose(),
  });
}

export function createCrystalShards(
  districtId: DistrictId,
  count: number,
  spread: number,
  material: THREE.Material,
): { readonly object: SceneObject; readonly update: (elapsed: number) => void } {
  const group = new THREE.Group();
  group.name = `${districtId}-crystals`;
  const meshes: THREE.Mesh[] = [];

  for (let i = 0; i < count; i += 1) {
    const geometry = new THREE.OctahedronGeometry(0.25 + (i % 4) * 0.08, 0);
    const mesh = new THREE.Mesh(geometry, material);
    const seed = i * 2.399;
    mesh.position.set(
      Math.sin(seed) * spread,
      (Math.cos(seed * 0.7) * 0.5 + 0.5) * 2 - 0.5,
      Math.cos(seed * 1.1) * spread,
    );
    mesh.rotation.set(seed, seed * 0.5, seed * 0.3);
    group.add(mesh);
    meshes.push(mesh);
  }

  const object = createSceneObject({
    id: `district:${districtId}:crystals`,
    object3d: group,
    districtId,
    onDispose: () => {
      for (const mesh of meshes) {
        mesh.geometry.dispose();
      }
    },
  });

  return {
    object,
    update(elapsed: number) {
      for (let i = 0; i < meshes.length; i += 1) {
        const mesh = meshes[i];
        if (mesh) {
          mesh.rotation.y = elapsed * 0.08 + i;
          mesh.position.y += Math.sin(elapsed * 0.4 + i) * 0.0008;
        }
      }
    },
  };
}
