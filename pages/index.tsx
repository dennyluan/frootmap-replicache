import React, { useEffect, useState, MouseEvent, useRef } from "react";
import { useSelector, useDispatch, connect, Provider } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import useSupercluster from 'use-supercluster';

import PinFormModal from "../components/PinFormModal";
import Header from "../components/Header";
import PinModal from "../components/PinModal";
import Map from "../components/Map";
import { ICoords, IPin, IPoint, JSONValue } from "../models/types";
import { useFormModal, usePinModal } from "../utils/useModal";

import { loadPins, clearPins, selectPins } from '../features/pinSlice'
import store from "./../utils/store";

import { listen } from './../utils/rep';
import { Replicache, WriteTransaction, MutatorDefs } from 'replicache';
import { useSubscribe } from 'replicache-react-util';
import * as Pusher from 'pusher-js';
import { mutators } from './../features/mutators'


function App(props: any) {
  const googleKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const [ viewCoords, setViewCoords ] = useState<ICoords>({ lat: 21.284084348268202, lng: -157.7855795839304 });
  const { isShown, toggle, modalPinCoords } = useFormModal();
  const { activePin, setPinModal } = usePinModal();
  const { map } = useSelector( ( state: { map: any } ) => state.map );
  const mapRef = useRef<any>(null);
  const [bounds, setBounds] = useState<any>(null)
  const [zoom, setZoom] = useState<number>(16);

  let allPoints : IPoint[] = []

  console.log("props.pins", props.pins)
  if (props.pins && props.pins.length > 1) {
    allPoints = props.pins.map( (pin : IPin) => ({
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
          // pin.coords[0],
          // pin.coords[1]
        ]
      }
    }))
  }

  const { clusters, supercluster } = useSupercluster({
    points: allPoints,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 20
    }
  })

  console.log("clusters", clusters)

  const [rep, setRep] = useState<Replicache>();

  useEffect(() => {
    // set the map location from browser
    if (navigator.geolocation != undefined) {
      navigator.geolocation.getCurrentPosition(
        (position: {coords:{latitude: number, longitude: number}}) => {
          setViewCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("map geo error");
        }
      );
    }

    // dispatch(loadPins())
    props.loadPins()
  }, []);

  const repConfig = {
    key: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER
  }

  useEffect(()=> {
    const isProd = location.host.indexOf(".vercel.app") > -1;
    const rep = new Replicache<MutatorDefs>({
      pushURL: '/api/push-pins',
      pullURL: '/api/pull-pins',
      wasmModule: isProd ? "/replicache.wasm" : "/replicache.dev.wasm",
      name: "fruit",
      mutators
    });
    listen(rep, repConfig);
    setRep(rep);
  }, [])

  return (
    <div className="App">

      {rep &&
        <div className="body">

          <Header
            rep={rep}
          />

          <Map
            isShown={isShown}
            map={map}
            mapRef={mapRef}
            setZoom={setZoom}
            setBounds={setBounds}
            toggle={toggle}
            clusters={clusters}
            supercluster={supercluster}
            allPoints={allPoints}
            setPinModal={setPinModal}
          />

          <PinFormModal
            isShown={isShown}
            modalPinCoords={modalPinCoords}
            hide={toggle}
            clearPins={props.clearPins}
            mapRef={mapRef.current}
            rep={rep}
          />

          <PinModal
            pin={activePin}
            hide={setPinModal}
          />

        </div>
      }

    </div>
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

