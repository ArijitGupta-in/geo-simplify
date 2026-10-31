# @arijitgupta/geo-simplify

A lightweight TypeScript library for reducing the number of coordinates in geographic paths while controlling geometric deviation.

This package is in its initial scaffold stage. Supported algorithms, distance models, tolerance semantics, and the public API will be defined through design issues before implementation.

## Planned scope

The library will focus on geometric simplification of ordered geographic paths. Candidate approaches include Douglas–Peucker (Ramer–Douglas–Peucker) and Visvalingam–Whyatt. Their suitability for geographic coordinates, antimeridian-crossing paths, and high-latitude data must be evaluated before selection.

Simplification should preserve path order and document what its tolerance means. No algorithm or tolerance unit is committed yet.

## Coordinate model

Shared coordinate types, DMS conversion, normalization, and validation are provided by [`@arijitgupta/geo-core`](https://www.npmjs.com/package/@arijitgupta/geo-core).

## Development

Requires Node.js 22.12+ and npm 10+.

```bash
npm install
npm test
npm run test:coverage
npm run check
npm run lint:md
npm run build
```

## Status

Under initial development. No stable public API has been released.

## License

MIT
