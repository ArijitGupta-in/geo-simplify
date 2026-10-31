import { MEAN_EARTH_RADIUS_METERS, RADIANS_PER_DEGREE, normalizeCoordinate } from "./geo.js";
import type { Coordinate, CoordinateInput, SimplifyResult } from "./types.js";

type Vector = [number, number, number];
type Segment = [start: number, end: number];

const DEGENERATE_ARC_RADIANS = 1e-12;
const NEAR_ANTIPODAL_RADIANS = 1e-8;

function dot(a: Vector, b: Vector): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: Vector, b: Vector): Vector {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function norm(vector: Vector): number {
    return Math.sqrt(dot(vector, vector));
}

function scale(vector: Vector, factor: number): Vector {
    return [vector[0] * factor, vector[1] * factor, vector[2] * factor];
}

function subtract(a: Vector, b: Vector): Vector {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function clamp(value: number): number {
    return Math.max(-1, Math.min(1, value));
}

function toVector(coordinate: Coordinate): Vector {
    const latitude = coordinate.latitude * RADIANS_PER_DEGREE;
    const longitude = coordinate.longitude * RADIANS_PER_DEGREE;
    const cosLatitude = Math.cos(latitude);
    return [
        cosLatitude * Math.cos(longitude),
        cosLatitude * Math.sin(longitude),
        Math.sin(latitude),
    ];
}

function angleBetween(a: Vector, b: Vector): number {
    return Math.atan2(norm(cross(a, b)), clamp(dot(a, b)));
}

function endpointDistance(point: Vector, start: Vector, end: Vector): number {
    return (
        Math.min(angleBetween(point, start), angleBetween(point, end)) * MEAN_EARTH_RADIUS_METERS
    );
}

function pointToArcDistance(point: Vector, start: Vector, end: Vector): number {
    const arcLength = angleBetween(start, end);
    if (arcLength < DEGENERATE_ARC_RADIANS || Math.PI - arcLength < NEAR_ANTIPODAL_RADIANS) {
        return endpointDistance(point, start, end);
    }

    const normal = cross(start, end);
    const normalSquared = dot(normal, normal);
    const projection = subtract(point, scale(normal, dot(point, normal) / normalSquared));
    const projectionLength = norm(projection);
    if (projectionLength < DEGENERATE_ARC_RADIANS) {
        return endpointDistance(point, start, end);
    }

    const projectedPoint = scale(projection, 1 / projectionLength);
    const unitNormal = scale(normal, 1 / Math.sqrt(normalSquared));
    let minimumAngle = Math.min(angleBetween(point, start), angleBetween(point, end));

    for (const candidate of [projectedPoint, scale(projectedPoint, -1)]) {
        const alongArc = Math.atan2(
            dot(unitNormal, cross(start, candidate)),
            dot(start, candidate),
        );
        if (alongArc >= 0 && alongArc <= arcLength) {
            minimumAngle = Math.min(minimumAngle, angleBetween(point, candidate));
        }
    }

    return minimumAngle * MEAN_EARTH_RADIUS_METERS;
}

function assertDenseCoordinates(input: readonly CoordinateInput[]): void {
    for (let index = 0; index < input.length; index += 1) {
        if (!Object.hasOwn(input, index)) {
            throw new TypeError("Coordinates are missing a vertex at index " + index);
        }
    }
}

/**
 * Simplifies a geographic path with the iterative Douglas–Peucker algorithm.
 *
 * Deviations are measured in meters from each point to the nearest location on
 * the minor great-circle arc between the current endpoints. The first and last
 * vertices are always retained. For nearly antipodal endpoints, where the
 * minor arc is numerically unstable, deviation falls back to the nearer
 * endpoint distance.
 *
 * The implementation uses O(n) additional memory and has O(n²) worst-case
 * time, where n is the number of input vertices.
 *
 * @param input - Ordered decimal-degree or DMS coordinates.
 * @param toleranceMeters - Maximum deviation allowed in meters; must be finite and non-negative.
 * @returns Normalized retained coordinates and their original input indices.
 * @throws {TypeError} If the input is not a dense array, a coordinate is malformed,
 *   or the tolerance is not finite.
 * @throws {RangeError} If a coordinate is outside its valid geographic range or the tolerance is negative.
 */
export function simplifyDouglasPeucker(
    input: readonly CoordinateInput[],
    toleranceMeters: number,
): SimplifyResult {
    if (!Array.isArray(input)) {
        throw new TypeError("Coordinates must be an array");
    }
    if (typeof toleranceMeters !== "number" || !Number.isFinite(toleranceMeters)) {
        throw new TypeError("toleranceMeters must be finite");
    }
    if (toleranceMeters < 0) {
        throw new RangeError("toleranceMeters must not be negative");
    }

    assertDenseCoordinates(input);

    const coordinates = input.map(normalizeCoordinate);
    const count = coordinates.length;
    if (count <= 2) {
        return {
            coordinates,
            retainedIndices: coordinates.map((_, index) => index),
        };
    }

    const vectors = coordinates.map(toVector);
    const keep = new Uint8Array(count);
    keep[0] = 1;
    keep[count - 1] = 1;

    const stack: Segment[] = [[0, count - 1]];
    while (stack.length > 0) {
        const [start, end] = stack.pop()!;
        let farthestIndex = -1;
        let maximumDistance = toleranceMeters;

        for (let index = start + 1; index < end; index += 1) {
            const distance = pointToArcDistance(vectors[index]!, vectors[start]!, vectors[end]!);
            if (distance > maximumDistance) {
                maximumDistance = distance;
                farthestIndex = index;
            }
        }

        if (farthestIndex !== -1) {
            keep[farthestIndex] = 1;
            stack.push([start, farthestIndex], [farthestIndex, end]);
        }
    }

    const retainedIndices: number[] = [];
    const simplified: Coordinate[] = [];
    for (let index = 0; index < count; index += 1) {
        if (keep[index]) {
            retainedIndices.push(index);
            simplified.push(coordinates[index]!);
        }
    }

    return { coordinates: simplified, retainedIndices };
}

/**
 * Simplifies a geographic path and returns only its retained coordinates.
 *
 * @param input - Ordered decimal-degree or DMS coordinates.
 * @param toleranceMeters - Maximum deviation allowed in meters; must be finite and non-negative.
 * @returns Normalized retained coordinates in their original order.
 * @throws {TypeError} If the input is not a dense array, a coordinate is malformed,
 *   or the tolerance is not finite.
 * @throws {RangeError} If a coordinate is outside its valid geographic range or the tolerance is negative.
 */
export function simplifyPolyline(
    input: readonly CoordinateInput[],
    toleranceMeters: number,
): Coordinate[] {
    return simplifyDouglasPeucker(input, toleranceMeters).coordinates;
}
