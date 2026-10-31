# @arijitgupta/geo-simplify

Geographic polyline simplification using iterative Douglas–Peucker and spherical point-to-segment deviation. The package has no runtime dependencies and accepts decimal-degree or DMS coordinates.

## Install

```bash
npm install @arijitgupta/geo-simplify
```

## Example

```ts
import { simplifyDouglasPeucker, simplifyPolyline } from "@arijitgupta/geo-simplify";
const route = [
    { latitude: 22.5726, longitude: 88.3639 },
    { latitude: 22.573, longitude: 88.3642 },
    { latitude: 22.574, longitude: 88.365 },
];
const compact = simplifyPolyline(route, 8); // tolerance in meters
const result = simplifyDouglasPeucker(route, 8); // coordinates + retainedIndices
```

## API

- `simplifyPolyline(coordinates, toleranceMeters)`: return simplified decimal-degree vertices.
- `simplifyDouglasPeucker(coordinates, toleranceMeters)`: return vertices and their indices in the input.

The algorithm is iterative (no recursive call-stack growth). Deviation is measured as spherical distance to the nearest point on the minor great-circle arc between retained endpoints. It uses a spherical Earth radius of 6,371,000 m, not an ellipsoidal geodesic. First and last vertices are always retained. Empty and short paths are validated and returned unchanged. Output order is stable.

Tolerance must be finite and non-negative, and is measured in meters. Decimal-degree and DMS coordinates are range-validated and normalized before processing. Near-antipodal segment endpoints have no unique minor arc; for these degenerate segments the implementation falls back to the nearer endpoint distance.

## Development

Requires Node.js 22.12+ and npm 10+. Run `npm install`, `npm test`, `npm run check`, `npm run build`, and `npm run lint:md`.

## License

MIT
