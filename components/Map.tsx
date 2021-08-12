import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import { ICoords, IPin, IPoint } from "../models/types";
import { PointFeature, ClusterProperties, AnyProps, ClusterFeature } from 'supercluster';

import PinMarker from "./../components/PinMarker";
import ClusterMarker from "../components/ClusterMarker";
import Vespa from "../components/Vespa";
import PendingPinMarker from "../components/PendingPinMarker"

import { Replicache, MutatorDefs } from 'replicache';
import { useSubscribe } from 'replicache-react';

import useSupercluster from 'use-supercluster';

import { deserialize, deserializeFromCluster } from './../features/serializer'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    lat?: number;
    lng?: number;
  }
}

interface ClusterData {
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
  zoom: any,
  bounds: any,
  setZoom: (zoom: number) => void,
  setBounds: (bounds: any) => void,
  togglePinFormModal: (coords: any) => void,
  togglePinModal: (pin: IPin) => void,
  setSelectedViewCoords: (coords: ICoords) => void,
  selectedViewCoords: ICoords,
  // clusters: (PointFeature<ClusterData> | PointFeature<ClusterProperties & AnyProps>)[],
  // allPoints: IPoint[] | [],
  rep: Replicache<MutatorDefs>
  vespaCoords?: ICoords,
}

const Map = (props: MapProps) => {
  const googleKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const pins = useSubscribe(
    props.rep,
    async tx => {
      const data : any = await tx.scan({prefix: 'pin/'}).entries().toArray();
      const pins = deserialize(data)
      return pins
    },
    [],
  );

  const {
    clusters,
    supercluster
  } : {
    clusters: any,
    supercluster: any
  } = useSupercluster({
    points: pins,
    bounds: props.bounds,
    zoom: props.zoom,
    options: {
      radius: 75,
      maxZoom: 20
    }
  })

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

    // console.log('>>> MAP props', props)
    if (!props.isShown)
      // if (props.pin == {}) {
      // }
      props.togglePinFormModal({lat: lat, lng: lng})

      props.setSelectedViewCoords({lat: lat, lng: lng})

      // offset for repositioning map modal
      let vertOffset = 0.004 // this needs to be dynamically calculated based on zoom

      if (props.zoom < 16) {
        props.mapRef.current.setZoom(16)
      }

      if (props.zoom > 16) {
        vertOffset = 0.0002
      }

      props.mapRef.current.panTo({lat: (lat - vertOffset), lng: (lng)})
  };

  function renderSelectedViewPin() {
    // console.log("props.zoom", props.zoom)
    // console.log("props.selectedViewCoords", props.selectedViewCoords)
    if (props.selectedViewCoords == undefined) return

    let vertOffset = 0.0005; // needs to be recalced based on zoom

    if (props.zoom > 16) {
      // vertOffset = -0.005;
    }
    return <PendingPinMarker
      lat={(props.selectedViewCoords.lat + vertOffset)}
      lng={props.selectedViewCoords.lng}
    />
  }

  function renderMarkers() {
    if (clusters == []) return

    // todo: fix any
    return clusters.map( (cluster: ClusterFeature<any>, index: number) => {
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
          width={`${10 + (pointCount / pins.length ) * 20}px`}
          length={`${10 + (pointCount / pins.length ) * 20}px`}
          onClick={() => {
            const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
            props.mapRef.current.setZoom(expansionZoom)
            props.mapRef.current.panTo({lat: lat, lng: lng})
          }}
        />

      } else {

        const pin : IPin = deserializeFromCluster(cluster)

        return <PinMarker
          key={index}
          lat={lat}
          lng={lng}
          pin={pin}
          onClick={() => {
            props.togglePinModal(pin)
          }}
        />

      }
    })
  }

  console.log(">> some pins", pins)

  return (
    <div style={{ height: '100vh', width: '100%' }}>

      {/*
        <pre style={{
          fontSize: '10px',
          textAlign: 'left',
          paddingTop: '60px'
        }}>
        {JSON.stringify(pins, "", 1)}
        </pre>
      */}

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
        {props.vespaCoords &&
          <Vespa
            lat={props.vespaCoords.lat}
            lng={props.vespaCoords.lng}
          />
        }

        {renderSelectedViewPin()}
        {renderMarkers()}

      </GoogleMapReact>
    </div>
  )
}




export default Map