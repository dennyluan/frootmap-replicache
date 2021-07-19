import { ICoords, IPin, IPoint } from "../models/types";
import { ClusterFeature } from 'supercluster';

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

export function deserializeFromCluster(cluster: ClusterFeature<any>) {
  const pin : IPin = {
    id: cluster.properties.pinId,
    text: cluster.properties.text,
    created_at: cluster.properties.created_at,
    updated_at: cluster.properties.updated_at,
    description: cluster.properties.description,
    coords: {
      lat: cluster.properties[0],
      lng: cluster.properties[1]
    }
  }
  return pin
}