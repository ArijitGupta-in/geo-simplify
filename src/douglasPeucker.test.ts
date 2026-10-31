import { describe, expect, it } from "vitest";
import { simplifyDouglasPeucker, simplifyPolyline } from "./index.js";
const p=(latitude:number,longitude:number)=>({latitude,longitude});
describe("Douglas–Peucker",()=>{
 it("preserves paths with at most two vertices",()=>{expect(simplifyPolyline([],1)).toEqual([]);expect(simplifyPolyline([p(0,0)],1)).toEqual([p(0,0)]);expect(simplifyPolyline([p(0,0),p(0,1)],1)).toHaveLength(2);});
 it("removes a point on the same great-circle segment",()=>{const r=simplifyDouglasPeucker([p(0,0),p(0,0.5),p(0,1)],1);expect(r.coordinates).toEqual([p(0,0),p(0,1)]);expect(r.retainedIndices).toEqual([0,2]);});
 it("retains points beyond tolerance",()=>{expect(simplifyPolyline([p(0,0),p(1,0.5),p(0,1)],10)).toHaveLength(3);});
 it("retains endpoints and stable source indices",()=>{const r=simplifyDouglasPeucker([p(0,0),p(0,0.1),p(0,0.2),p(0,0.3)],1000);expect(r.coordinates).toEqual([p(0,0),p(0,0.3)]);expect(r.retainedIndices).toEqual([0,3]);});
 it("handles antimeridian paths",()=>{const r=simplifyPolyline([p(10,179),p(10.001,180),p(10,-179)],500);expect(r).toEqual([p(10,179),p(10,-179)]);});
 it("validates coordinates and tolerance",()=>{expect(()=>simplifyPolyline(null as never,1)).toThrow(TypeError);expect(()=>simplifyPolyline([p(0,0)],NaN)).toThrow(TypeError);expect(()=>simplifyPolyline([p(0,0)],-1)).toThrow(RangeError);expect(()=>simplifyPolyline([p(91,0)],1)).toThrow(RangeError);});
});
