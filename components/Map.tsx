import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { ICoords, IPin, IPoint } from "../models/types";
import {PointFeature, ClusterProperties, AnyProps, ClusterFeature} from 'supercluster';

import PinMarker from "./../components/PinMarker";
import ClusterMarker from "../components/ClusterMarker";

import { Replicache, MutatorDefs } from 'replicache';
import { useSubscribe } from 'replicache-react-util';

interface thing {
  cluster: true | boolean
  pinId: string
  text: string
  cluster_id?: number | undefined
  point_count?: number | undefined
  point_count_abbreviated?: string | number | undefined
}

interface MapProps {
  map: any,
  mapRef: any,
  isShown: boolean,
  setZoom: (zoom: number) => void,
  setBounds: (bounds: any) => void,
  togglePinFormModal: (coords: any) => void,
  togglePinModal: (pin: IPin) => void,
  clusters: (PointFeature<thing> | PointFeature<ClusterProperties & AnyProps>)[],
  allPoints: IPoint[] | [],
  supercluster: any
  rep: Replicache<MutatorDefs>
}

const Map = (props: MapProps) => {
  const googleKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";


  const pins = useSubscribe(
    props.rep,
    tx => tx.scan({prefix: '/pins/'}).toArray(),
    [],
  );

  console.log("<<rep pins>>", pins)

  const handleMapClick = ({
    x,
    y,
    lat,
    lng,
    event,
  }: {
    x: number;
    y: number;
    lat: number;
    lng: number;
    event: React.MouseEvent<HTMLButtonElement>;
  }): any => {
    event.preventDefault();
    if (!props.isShown)
      props.togglePinFormModal({lat: lat, lng: lng})
  };

  function renderMarkers() {
    if (props.clusters == []) return

    // todo: fix any
    return props.clusters.map( (cluster: ClusterFeature<any>, index) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const {
        cluster: isCluster,
        point_count: pointCount,
        text: text,
      } = cluster.properties;

      if (isCluster) {

        return <ClusterMarker
          key={index}
          id={cluster.properties.id}
          lat={lat}
          lng={lng}
          text={pointCount}
          width={`${10 + (pointCount / props.allPoints.length ) * 20}px`}
          length={`${10 + (pointCount / props.allPoints.length ) * 20}px`}
          onClick={() => {
            const expansionZoom = Math.min(props.supercluster.getClusterExpansionZoom(cluster.id), 20);
            props.mapRef.current.setZoom(expansionZoom)
            props.mapRef.current.panTo({lat: lat, lng: lng})
          }}
        />

      } else {

        return <PinMarker
          key={index}
          lat={lat}
          lng={lng}
          text={text}
          onClick={()=>{
            const pin : IPin = {
              id: cluster.properties.pinId,
              text: cluster.properties.text,
              coords: {
                lat: cluster.properties[0],
                lng: cluster.properties[1]
              }
            }
            props.togglePinModal(pin)
          }}
        />

      }
    })
  }

  return (
    <GoogleMapReact
      yesIWantToUseGoogleMapApiInternals
      bootstrapURLKeys={{ key: googleKey }}
      center={props.map.center}
      zoom={props.map.zoom}
      onClick={handleMapClick}
      onGoogleApiLoaded={({map}) => {
        props.mapRef.current = map;
      }}
      onChange={ ( { zoom , bounds } ) => {
        props.setZoom(zoom)
        props.setBounds([
          bounds.nw.lng,
          bounds.se.lat,
          bounds.se.lng,
          bounds.nw.lat,
        ])
      }}
    >
      {renderMarkers()}
    </GoogleMapReact>
  )
}




export default Map