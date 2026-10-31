# @arijitgupta/geo-simplify

Simplify geographic coordinate paths with the iterative Douglas–Peucker algorithm and spherical point-to-minor-arc deviation. Coordinates and normalization are shared with [`@arijitgupta/geo-core`](https://www.npmjs.com/package/@arijitgupta/geo-core). The algorithm's spherical geometry remains local because the other geo packages do not provide point-to-arc deviation.

## Install

```bash
npm install @arijitgupta/geo-simplify
```

The required `geo-core` runtime dependency is installed automatically.

## Example

```ts
import {
    simplifyDouglasPeucker,
    simplifyPolyline,
    type Polyline,
} from "@arijitgupta/geo-simplify";

const route: Polyline = [
    { latitude: 22.5726, longitude: 88.3639 },
    { latitude: 22.573, longitude: 88.3642 },
    { latitude: 22.574, longitude: 88.365 },
];

const compact = simplifyPolyline(route, 8);
const result = simplifyDouglasPeucker(route, 8);
console.log(result.coordinates, result.retainedIndices);
```

Tolerance is in meters. Inputs may use decimal-degree or DMS coordinates; outputs are normalized decimal-degree coordinates.

## API

All functions and types are exported from the package root.

| Export | Description |
| --- | --- |
| `simplifyPolyline(input, toleranceMeters)` | Simplify a path and return only its retained normalized coordinates. |
| `simplifyDouglasPeucker(input, toleranceMeters)` | Return retained normalized coordinates and their original zero-based indices. |
| `Coordinate`, `CoordinateInput`, `DMSCoordinate`, `LatitudeDMS`, `LongitudeDMS`, `LatitudeDirection`, `LongitudeDirection` | Shared coordinate types re-exported from `geo-core`. |
| `SimplifyResult` | Result shape containing `coordinates` and `retainedIndices`. |

## Behavior and limitations

- The first and last vertices are always retained. Output order is stable, and the input is not mutated.
- Empty paths and paths with one or two vertices are validated and returned normalized without dropping vertices.
- Sparse input arrays are rejected.
- Tolerance must be finite and non-negative. Invalid coordinates throw `TypeError` or `RangeError`.
- Deviation is the spherical distance to the nearest point on the minor great-circle arc between retained endpoints. Longitude normalization and coordinate validation follow `geo-core`; antimeridian-crossing paths are supported.
- For nearly antipodal segment endpoints, the minor arc is numerically unstable. The implementation uses the nearer endpoint distance for these degenerate arcs; this can retain more points than expected.
- The Earth is modeled as a sphere with mean radius 6,371,000 m, not an ellipsoid.
- Time complexity is O(n²) in the worst case; additional memory is O(n). See `npm run benchmark` for a small scaling benchmark.

## Development

Requires Node.js 22.12+ and npm 10+.

```bash
npm ci
npm test
npm run check
npm run build
npm run lint:md
npm run test:coverage
npm run benchmark
```

## License

MIT
