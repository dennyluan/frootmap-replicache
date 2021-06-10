import React, { useEffect, useState, MouseEvent, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { useSelector, useDispatch, connect, Provider } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import useSupercluster from 'use-supercluster';

import PinMarker from "./../components/PinMarker";
import ClusterMarker from "../components/ClusterMarker";
import PinFormModal from "../components/PinFormModal";
import Header from "../components/Header";
import PinModal from "../components/PinModal";
import { ICoords, IPin, IPoint } from "../models/pins";
import { useFormModal, usePinModal } from "../utils/useModal";

import { loadPins, clearPins, selectPins } from '../features/pinSlice'
import store from "./../utils/store";


function App(props: any) {
  const googleKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const [ viewCoords, setViewCoords ] = useState<ICoords>({ lat: 21.284084348268202, lng: -157.7855795839304 });
  const { isShown, toggle, modalPinCoords } = useFormModal();
  const { activePin, setPinModal } = usePinModal();
  const { map } = useSelector( ( state: { map: any } ) => state.map );
  const mapRef = useRef<any>(null);
  const [bounds, setBounds] = useState<any>(null)
  const [zoom, setZoom] = useState<number>(16);

  let points : IPoint[] = []
  if (props.pins && props.pins.length > 1) {

    points = props.pins.map( (pin : IPin) => ({
      "type": "Feature",
      "properties": {
        "cluster": false,
        "pinId": pin.id,
        "text": pin.text
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          pin.coords.lng,
          pin.coords.lat
        ]
      }
    }))
  }

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 20
    }
  })

  // console.log("props.pins", props.pins)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: {coords:{latitude: number, longitude: number}}) => {
          setViewCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("error");
        }
      );
    }

    // dispatch(loadPins())
    props.loadPins()
  }, []);

  const handleClearPins = () : void => {
    props.clearPins()
    // toggle()
  }

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
    event: MouseEvent<HTMLButtonElement>;
  }): any => {
    event.preventDefault();
    if (!isShown)
      toggle({lat: lat, lng: lng})
  };

  function renderMarkers() {
    if (clusters == []) return

    return clusters.map( (cluster, index) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const {
        cluster: isCluster,
        point_count: pointCount,
        text: text
      } = cluster.properties;

      if (isCluster) {

        return <ClusterMarker
          key={index}
          id={cluster.properties.id}
          lat={lat}
          lng={lng}
          text={pointCount}
          width={`${10 + (pointCount / points.length ) * 20}px`}
          length={`${10 + (pointCount / points.length ) * 20}px`}
          onClick={() => {
            const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
            mapRef.current.setZoom(expansionZoom)
            mapRef.current.panTo({lat: lat, lng: lng})
          }}
        />

      } else {

        return <PinMarker
          key={index}
          id={cluster.properties.id}
          lat={lat}
          lng={lng}
          text={text}
          onClick={()=>{
            let thepin : IPin = {
              id: cluster.properties.pinId,
              text: cluster.properties.text,
              coords: cluster.geometry.coordinates
            }
            setPinModal(thepin)
            // console.log("clicked on!", cluster.properties)
          }}
        />

      }
    })
  }

  return (
    <Provider store={store}>
      <div className="App">


        <div className="body">
          <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals
            bootstrapURLKeys={{ key: googleKey }}
            center={map.center}
            zoom={map.zoom}
            onClick={handleMapClick}
            onGoogleApiLoaded={({map}) => {
              mapRef.current = map;
            }}
            onChange={ ( { zoom , bounds } ) => {
              setZoom(zoom)
              setBounds([
                bounds.nw.lng,
                bounds.se.lat,
                bounds.se.lng,
                bounds.nw.lat,
              ])
            }}
          >
            {renderMarkers()}
          </GoogleMapReact>

          <PinFormModal
            isShown={isShown}
            modalPinCoords={modalPinCoords}
            hide={toggle}
            clearPins={handleClearPins}
            mapRef={mapRef.current}
          />

          <PinModal
            pin={activePin}
            hide={setPinModal}
          />
        </div>

      </div>
    </Provider>
  );
}

const mapStateToPropsSelector = createSelector(
  ( state: {pins: IPin[]} ) => state.pins,
  pins => pins
)

const mapStateToProps = (state: any) => ({
  pins: mapStateToPropsSelector(state)
})

const mapDispatchToProps = { loadPins, clearPins }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

