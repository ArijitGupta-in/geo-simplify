# Review findings

Findings from the review of `@arijitgupta/geo-simplify`.

All identified correctness findings are fixed. The performance characteristic is documented and benchmarked; no algorithm replacement is justified by the current scope.

| Priority | Finding | Status |
| --- | --- | --- |
| Medium | A permissive angular-sum epsilon could treat a projected point just outside a minor arc as lying on it, underestimating deviation and removing a vertex beyond the requested tolerance. | Fixed: point projection now uses oriented along-arc membership with endpoint distance fallback; regression tests cover sub-meter points beyond both endpoints. |
| Low | `Array.map` skipped sparse coordinate-array holes, allowing missing vertices to bypass normalization. | Fixed: sparse inputs are rejected before normalization, with a regression test. |
| Enhancement | Iterative Douglas–Peucker has O(n²) worst-case time and O(n) auxiliary memory. | Documented in API and README; added a repeatable benchmark covering straight, smooth, alternating, and skewed paths at multiple sizes. |
| Enhancement | Coordinate types, normalization, and spherical constants duplicated shared code. | Fixed: package now depends on `geo-core` for types, normalization, and constants. `geo-distance`, `geo-polyline`, and `geo-filter` do not expose a point-to-minor-arc deviation primitive, so the simplifier keeps its necessary geometry calculations local and avoids unnecessary dependencies. |
