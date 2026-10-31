export interface Coordinate {latitude:number;longitude:number;}
export type LatitudeDirection="N"|"S";export type LongitudeDirection="E"|"W";
export interface LatitudeDMS {degrees:number;minutes:number;seconds:number;direction:LatitudeDirection;}
export interface LongitudeDMS {degrees:number;minutes:number;seconds:number;direction:LongitudeDirection;}
export interface DMSCoordinate {latitude:LatitudeDMS;longitude:LongitudeDMS;}
export type CoordinateInput=Coordinate|DMSCoordinate;
export interface SimplifyResult {coordinates:Coordinate[];retainedIndices:number[];}
