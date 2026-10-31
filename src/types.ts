import type { Coordinate, CoordinateInput } from "@arijitgupta/geo-core";

export type {
    Coordinate,
    CoordinateInput,
    DMSCoordinate,
    LatitudeDMS,
    LatitudeDirection,
    LongitudeDMS,
    LongitudeDirection,
} from "@arijitgupta/geo-core";

/** Simplified coordinates and their zero-based indices in the original input. */
export interface SimplifyResult {
    /** Retained vertices normalized to decimal degrees, in input order. */
    coordinates: Coordinate[];
    /** Zero-based source indices corresponding to `coordinates`. */
    retainedIndices: number[];
}
