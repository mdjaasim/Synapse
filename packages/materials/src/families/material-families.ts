import type { MaterialFamily } from "./material-family";
import { ORIGIN_MATTER_FAMILY } from "./origin-matter";
import { LIVING_FOG_FAMILY } from "./living-fog";
import { DUST_FAMILY } from "./dust";
import { VOLUMETRIC_FOG_FAMILY } from "./volumetric-fog";
import { DISTRICT_MATERIAL_FAMILIES } from "./district-materials";

/** All material families available in Phase 2+. */
export const MATERIAL_FAMILIES: readonly MaterialFamily[] = [
  ORIGIN_MATTER_FAMILY,
  LIVING_FOG_FAMILY,
  VOLUMETRIC_FOG_FAMILY,
  DUST_FAMILY,
  ...DISTRICT_MATERIAL_FAMILIES,
];
