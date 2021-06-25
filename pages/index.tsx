import React, { useEffect, useState, MouseEvent, useRef, createContext } from "react";
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

import { Replicache, MutatorDefs } from 'replicache';
import { useSubscribe } from 'replicache-react-util';
import * as Pusher from 'pusher-js';

import dynamic from 'next/dynamic';
const RepContainerDynamic = dynamic(() => import('../components/RepContainer'))

function App(props: any) {
  const googleKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const [ viewCoords, setViewCoords ] = useState<ICoords>({ lat: 21.284084348268202, lng: -157.7855795839304 });
  const { isShown, togglePinFormModal, modalPinCoords } = useFormModal();
  const { activePin, togglePinModal } = usePinModal();
  const { map } = useSelector( ( state: { map: any } ) => state.map );
  const mapRef = useRef<any>(null);
  const [bounds, setBounds] = useState<any>(null)
  const [zoom, setZoom] = useState<number>(16);
  const [rep, setRep] = useState<Replicache<MutatorDefs>>();

  const [ data, setData ] = useState<any>();

  let allPoints : IPoint[] = []


  // useSubscribe(rep, f, def)
  // const thing = useSubscribe(
  //   rep,
  //   async tx => {
  //     const thepins = await tx.scan({prefix: 'pin/'}).entries().toArray();
  //     thepins.sort(([, {order: a}], [, {order: b}]) => a - b);
  //     return thepins;
  //   },
  //   [],
  // );


  // console.log("props.pins", props.pins)
  if (props.pins && props.pins.length > 0) {
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
        ]
        // "coordinates": {
        //   "lng": pin.coords.lng,
        //   "lat": pin.coords.lat
        // }
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
        }
      );
    }

    // dispatch(loadPins())
    props.loadPins()
  }, []);

  // console.log("rep", rep)

  return (
    <div className="App">

      {/*
        this order matters :(
      */}
      <RepContainerDynamic setRep={setRep}/>
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
              clusters={clusters}
              supercluster={supercluster}
              allPoints={allPoints}
              togglePinFormModal={togglePinFormModal}
              togglePinModal={togglePinModal}
              rep={rep}
            />

            <PinFormModal
              isShown={isShown}
              modalPinCoords={modalPinCoords}
              togglePinFormModal={togglePinFormModal}
              clearPins={props.clearPins}
              mapRef={mapRef.current}
              rep={rep}
            />

            <PinModal
              pin={activePin}
              togglePinModal={togglePinModal}
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



