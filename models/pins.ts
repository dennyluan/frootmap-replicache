
export interface ICoords {
  lat: number,
  lng: number
}

export interface IPin {
  id: string,
  text: string,
  public?: boolean,
  coords: ICoords
}

export interface IPoint {
  type: string,
  properties: {
    cluster: boolean,
    pinId: string,
    text: string
  },
  geometry: {
    type: string,
    coordinates: number[]
  }
}

export interface IFruit {
  id: string,
  text: string
}