export interface Dataset {
  time: Date;
  latitude: number;
  longitude: number;
  altitude: number;
  sv: number;
  fix: boolean;
  velocity: number;
}
