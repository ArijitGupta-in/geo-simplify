# Contributing to @arijitgupta/geo-simplify

## Prerequisites

- Node.js 22.12 or later
- npm 10 or later

## Setup

```bash
git clone https://github.com/ArijitGupta-in/geo-simplify.git
cd geo-simplify
npm install
```

## Development commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests and enforce coverage thresholds |
| `npm run check` | Type-check source and tests |
| `npm run lint:md` | Lint Markdown files |
| `npm run build` | Compile TypeScript to `dist/` |

## Project conventions

- Source files live under `src/`; tests sit alongside their subjects.
- The public API is defined only by exports from `src/index.ts`.
- Use strict TypeScript and `import type` for type-only imports.
- Use `@arijitgupta/geo-core` for shared coordinate types and validation.
- Validate untrusted inputs at public API boundaries.
- Document algorithm choice, tolerance units, error bounds, and geographic assumptions explicitly.
- Every public function needs happy-path, boundary, and invalid-input tests.
- Avoid `as any` in tests unless deliberately testing unsafe input.

## Design before implementation

The supported algorithms and API are not finalized. In particular, do not assume planar simplification is sufficient for all geographic paths. Discuss antimeridian crossing, high latitudes, degenerate paths, endpoints, and tolerance semantics in the relevant design issue before implementation.

Keep this package focused on simplification; path representation belongs in `geo-polyline`, and GPS observation filtering belongs in `geo-filter`.

## Commit messages

Use Conventional Commits, for example:

```text
feat: add Douglas-Peucker simplification
fix: preserve endpoints for closed paths
test: cover antimeridian-crossing paths
docs: define simplification tolerance
chore: update Vitest
```

## Changelog

Add user-visible changes under [Unreleased] in `CHANGELOG.md`, using Keep a Changelog categories.

## Pull requests

1. Create a branch from `main`.
2. Make a focused change and add tests.
3. Run `npm run check`, `npm run lint:md`, and `npm run test:coverage`.
4. Explain what changed and why; link related issues.

## License

By contributing, you agree that contributions will be licensed under the MIT License.
