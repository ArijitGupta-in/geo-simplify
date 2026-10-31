# Changelog

All notable changes are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Iterative Douglas–Peucker simplification with spherical point-to-minor-arc deviation in meters.
- Results include original indices for retained vertices.
- Unit tests for endpoints, tolerance, and antimeridian cases.
- Shared coordinate types and normalization through `geo-core`.
- CI across supported Node.js versions and npm tag publishing workflow.

### Changed

- Documented the algorithm's complexity, spherical model, and near-antipodal fallback.
- Cleaned generated output before builds to prevent stale files from entering the published package.
- Set the unpublished package's first release version to 1.0.0.

### Fixed

- Replaced the permissive arc-membership tolerance that could incorrectly discard points just outside a segment.
- Reject sparse coordinate arrays rather than allowing `Array.map` to skip missing vertices.
- Reused `geo-core` coordinate normalization, types, and spherical constants instead of maintaining duplicate definitions.
