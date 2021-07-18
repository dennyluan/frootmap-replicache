import { ICoords, IPin, IPoint } from "../models/types";

// todo: turn pin into ipin first? then remove any into IPin
export function deserialize(data: any) {
  return data.map( (pin: any ) => ({
    "type": "Feature",
    "properties": {
      "cluster": false,
      "pinId": pin[1].id,
      "created_at": pin[1].created_at,
      "updated_at": pin[1].updated_at,
      "description": pin[1].description,
      "text": pin[1].text,
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        pin[1].lng,
        pin[1].lat
      ]
    }
  }))
}
