import { GeoJsonTypes } from 'geojson';

export interface ICoords {
  lat: number,
  lng: number
}

// pin to be displayed on the map
export interface IPin {
  id: string,
  text: string,
  public?: boolean,
  created_at: string,
  updated_at: string,
  description: string,
  version: number,
  coords: ICoords
}

// all data points
export interface IPoint {
  type: 'Feature',
  properties: {
    cluster: boolean,
    pinId: string,
    text: string,

    /** Cluster ID */
    cluster_id?: number;
    /** Number of points in the cluster. */
    point_count?: number;
    /**
     * Abbreviated number of points in the cluster as string if the number
     * is 1000 or greater (e.g. `1.3k` if the number is 1298).
     *
     * For less than 1000 points it is the same value as `point_count`.
     */
    point_count_abbreviated?: string | number;
  },
  geometry: {
    type: 'Point',
    coordinates: number[]
  }
}

export interface IPointProps {
  cluster: boolean,
  pinId: string,
  text: string
}

export interface IFruit {
  id: string,
  text: string
}


export interface ISession {
  provider_token?: string | null,
  access_token: string,
  expires_at?: number,
  expires_in?: number,
  refresh_token?: string,
  token_type: string,
  user: SupabaseUser | null,
}

interface SupabaseUser {
  app_metadata: {
    provider?: string,
    [key: string] : any
  },
  aud: string,
  confirmation_sent_at?: string,
  confirmed_at?: string,
  created_at: string,
  email?: string,
  email_confirmed_at?: string,
  id: string,
  last_sign_in_at?: string,
  phone?: string,
  recovery_sent_at?: string,
  role?: string,
  updated_at?: string,
  user_metadata: {
    [key: string] : any
  }
}

/** The values that can be represented in JSON */
export type JSONValue =
  | null
  | string
  | boolean
  | number
  | Array<JSONValue>
  | JSONObject;

/**
 * A JSON object. We allow undefined values because in TypeScript there is no
 * way to express optional missing properties vs properties with the value
 * `undefined`.
 */
export type JSONObject = Partial<{[key: string]: JSONValue}>;
