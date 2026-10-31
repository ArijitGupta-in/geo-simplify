export type { Coordinate, CoordinateInput } from "@arijitgupta/geo-core";
/** Result contains simplified decimal-degree vertices and their source indices. */
export interface SimplifyResult {
    coordinates: import("@arijitgupta/geo-core").Coordinate[];
    retainedIndices: number[];
}
