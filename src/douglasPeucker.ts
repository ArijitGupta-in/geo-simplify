import type { Coordinate } from "@arijitgupta/geo-distance";
import { normalizeCoordinate } from "./coordinate.js";
import type { CoordinateInput, SimplifyResult } from "./types.js";
type Vec=[number,number,number];
const R=6_371_000,RAD=Math.PI/180;
const dot=(a:Vec,b:Vec)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a:Vec,b:Vec):Vec=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=(v:Vec)=>Math.sqrt(dot(v,v));
const mul=(v:Vec,k:number):Vec=>[v[0]*k,v[1]*k,v[2]*k];
const sub=(a:Vec,b:Vec):Vec=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const clamp=(v:number)=>Math.max(-1,Math.min(1,v));
function vector(c:Coordinate):Vec{const lat=c.latitude*RAD,lon=c.longitude*RAD,cos=Math.cos(lat);return[cos*Math.cos(lon),cos*Math.sin(lon),Math.sin(lat)];}
function angle(a:Vec,b:Vec):number{return Math.atan2(norm(cross(a,b)),clamp(dot(a,b)));}
function pointToArc(p:Vec,a:Vec,b:Vec):number{
 const arc=angle(a,b);if(arc<1e-12||Math.PI-arc<1e-8)return Math.min(angle(p,a),angle(p,b))*R;
 const n=cross(a,b),n2=dot(n,n),projection=sub(p,mul(n,dot(p,n)/n2)),length=norm(projection);
 if(length<1e-12)return Math.min(angle(p,a),angle(p,b))*R;
 const q=mul(projection,1/length),candidates:Vec[]=[q,mul(q,-1)];let best=Math.min(angle(p,a),angle(p,b));
 for(const candidate of candidates)if(Math.abs(angle(a,candidate)+angle(candidate,b)-arc)<1e-7)best=Math.min(best,angle(p,candidate));
 return best*R;
}
/** Iterative Douglas–Peucker with spherical point-to-minor-great-circle-arc deviation in meters. */
export function simplifyDouglasPeucker(input:readonly CoordinateInput[],toleranceMeters:number):SimplifyResult{
 if(!Array.isArray(input))throw new TypeError("Coordinates must be an array");
 if(typeof toleranceMeters!=="number"||!Number.isFinite(toleranceMeters))throw new TypeError("toleranceMeters must be a finite number");
 if(toleranceMeters<0)throw new RangeError("toleranceMeters must not be negative");
 const coordinates=input.map(normalizeCoordinate),n=coordinates.length;
 if(n<=2)return{coordinates,retainedIndices:coordinates.map((_,i)=>i)};
 const vectors=coordinates.map(vector),keep=new Uint8Array(n);keep[0]=1;keep[n-1]=1;
 const stack:Array<[number,number]>=[[0,n-1]];
 while(stack.length){const [start,end]=stack.pop()!;let farthest=-1,max=toleranceMeters;
  for(let i=start+1;i<end;i+=1){const d=pointToArc(vectors[i]!,vectors[start]!,vectors[end]!);if(d>max){max=d;farthest=i;}}
  if(farthest!==-1){keep[farthest]=1;stack.push([start,farthest],[farthest,end]);}
 }
 const retainedIndices:number[]=[],simplified:Coordinate[]=[];
 for(let i=0;i<n;i+=1)if(keep[i]){retainedIndices.push(i);simplified.push(coordinates[i]!);}
 return{coordinates:simplified,retainedIndices};
}
export function simplifyPolyline(input:readonly CoordinateInput[],toleranceMeters:number):Coordinate[]{return simplifyDouglasPeucker(input,toleranceMeters).coordinates;}
