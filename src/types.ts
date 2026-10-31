import type { Coordinate, DMSCoordinate } from "@arijitgupta/geo-distance";
export type { Coordinate, DMSCoordinate } from "@arijitgupta/geo-distance";
export type CoordinateInput = Coordinate | DMSCoordinate;
export interface SimplifyResult { coordinates: Coordinate[]; retainedIndices: number[]; }
