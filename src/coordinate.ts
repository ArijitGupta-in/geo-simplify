import type { Coordinate, CoordinateInput, DMSCoordinate } from "./types.js";
function record(value:unknown):value is Record<string,unknown>{return typeof value==="object"&&value!==null&&!Array.isArray(value);}
function finite(value:unknown,label:string):asserts value is number{if(typeof value!=="number"||!Number.isFinite(value))throw new TypeError(label+" must be a finite number");}
function dmsAxis(value:unknown,axis:"latitude"|"longitude"):number{
 if(!record(value))throw new TypeError(axis+" DMS value must be an object");
 const max=axis==="latitude"?90:180;
 finite(value.degrees,axis+" degrees");finite(value.minutes,axis+" minutes");finite(value.seconds,axis+" seconds");
 const positive=axis==="latitude"?"N":"E",negative=axis==="latitude"?"S":"W";
 if(value.direction!==positive&&value.direction!==negative)throw new TypeError(axis+" direction must be "+positive+" or "+negative);
 if(!Number.isInteger(value.degrees)||value.degrees<0||value.degrees>max)throw new RangeError(axis+" degrees are out of range");
 if(!Number.isInteger(value.minutes)||value.minutes<0||value.minutes>=60)throw new RangeError(axis+" minutes must be an integer in [0, 60)");
 if(value.seconds<0||value.seconds>=60)throw new RangeError(axis+" seconds must be in [0, 60)");
 const magnitude=value.degrees+value.minutes/60+value.seconds/3600;
 if(magnitude>max)throw new RangeError(axis+" DMS value exceeds "+max+" degrees");
 return magnitude===0?0:(value.direction===negative?-magnitude:magnitude);
}
/** Validate and convert decimal-degree or DMS input to a fresh coordinate. */
export function normalizeCoordinate(input:CoordinateInput):Coordinate{
 if(!record(input))throw new TypeError("Coordinate must be an object");
 if(record(input.latitude)){
  const dms=input as unknown as DMSCoordinate;
  return {latitude:dmsAxis(dms.latitude,"latitude"),longitude:dmsAxis(dms.longitude,"longitude")};
 }
 const value=input as unknown as Coordinate;
 finite(value.latitude,"Latitude");finite(value.longitude,"Longitude");
 if(value.latitude < -90||value.latitude>90)throw new RangeError("Latitude must be between -90 and 90");
 if(value.longitude < -180||value.longitude>180)throw new RangeError("Longitude must be between -180 and 180");
 return {latitude:value.latitude,longitude:value.longitude===0?0:value.longitude};
}
