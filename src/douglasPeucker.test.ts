import { describe, expect, it } from "vitest";
import { simplifyDouglasPeucker, simplifyPolyline } from "./index.js";

const point = (latitude: number, longitude: number) => ({ latitude, longitude });

describe("Douglas–Peucker", () => {
    it("preserves paths with at most two vertices", () => {
        expect(simplifyPolyline([], 1)).toEqual([]);
        expect(simplifyPolyline([point(0, 0)], 1)).toEqual([point(0, 0)]);
        expect(simplifyPolyline([point(0, 0), point(0, 1)], 1)).toHaveLength(2);
    });

    it("removes a point on the same great-circle segment", () => {
        const result = simplifyDouglasPeucker([point(0, 0), point(0, 0.5), point(0, 1)], 1);
        expect(result.coordinates).toEqual([point(0, 0), point(0, 1)]);
        expect(result.retainedIndices).toEqual([0, 2]);
    });

    it("retains a point just beyond either segment endpoint at zero tolerance", () => {
        const afterEnd = simplifyPolyline([point(0, 0), point(0, 1.0000005), point(0, 1)], 0);
        const beforeStart = simplifyPolyline([point(0, 0), point(0, -0.0000005), point(0, 1)], 0);
        expect(afterEnd).toHaveLength(3);
        expect(beforeStart).toHaveLength(3);
    });

    it("retains points beyond tolerance", () => {
        expect(simplifyPolyline([point(0, 0), point(1, 0.5), point(0, 1)], 10)).toHaveLength(3);
    });

    it("retains endpoints and stable source indices", () => {
        const result = simplifyDouglasPeucker(
            [point(0, 0), point(0, 0.1), point(0, 0.2), point(0, 0.3)],
            1000,
        );
        expect(result.coordinates).toEqual([point(0, 0), point(0, 0.3)]);
        expect(result.retainedIndices).toEqual([0, 3]);
    });

    it("handles antimeridian paths", () => {
        const result = simplifyPolyline([point(10, 179), point(10.001, 180), point(10, -179)], 500);
        expect(result).toEqual([point(10, 179), point(10, -179)]);
    });

    it("normalizes DMS input using geo-core's antimeridian convention", () => {
        const result = simplifyPolyline(
            [
                {
                    latitude: {
                        degrees: 0,
                        minutes: 0,
                        seconds: 0,
                        direction: "N",
                    },
                    longitude: {
                        degrees: 180,
                        minutes: 0,
                        seconds: 0,
                        direction: "W",
                    },
                },
            ],
            1,
        );
        expect(result).toEqual([point(0, 180)]);
    });

    it("validates coordinates and tolerance", () => {
        expect(() => simplifyPolyline(null as never, 1)).toThrow(TypeError);
        expect(() => simplifyPolyline([point(0, 0), , point(0, 1)] as never, 1)).toThrow(TypeError);
        expect(() => simplifyPolyline([point(0, 0)], Number.NaN)).toThrow(TypeError);
        expect(() => simplifyPolyline([point(0, 0)], -1)).toThrow(RangeError);
        expect(() => simplifyPolyline([point(91, 0)], 1)).toThrow(RangeError);
    });
});
