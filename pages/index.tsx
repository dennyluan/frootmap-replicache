import React, { useEffect, useState, MouseEvent, useRef } from "react";
import { useSelector, useDispatch, connect, Provider } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import PinFormModal from "../components/PinFormModal";
import Navigation from "../components/Navigation";
import PinModal from "../components/PinModal";
import Map from "../components/Map";
import { ICoords, IPin, IPoint, JSONValue } from "../models/types";
import { useFormModal, usePinModal } from "../utils/useModal";

import { loadPins, clearPins, selectPins } from '../features/pinSlice'
import store from "./../utils/store";

import { Replicache, MutatorDefs } from 'replicache';
import * as Pusher from 'pusher-js';
import { listen } from './../utils/rep';
import { mutators } from './../features/mutators'

// import dynamic from 'next/dynamic';
// const RepContainerDynamic = dynamic(() => import('../components/RepContainer'))

function App(props: any) {
  const googleKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const [ vespaCoords, setVespaCoords ] = useState<ICoords>();
  const [ selectedViewCoords, setSelectedViewCoords ] = useState<ICoords>({ lat: 0, lng: 0 });
  const { isShown, togglePinFormModal, modalPinCoords } = useFormModal();
  const { activePin, togglePinModal } = usePinModal();
  const { map } = useSelector( ( state: { map: any } ) => state.map );
  const mapRef = useRef<any>(null);
  const [bounds, setBounds] = useState<any>(null)
  const [zoom, setZoom] = useState<number>(16);
  const [rep, setRep] = useState<Replicache<MutatorDefs>>();

  function setupGeo(){
    if (navigator.geolocation != undefined) {
      navigator.geolocation.getCurrentPosition(
        (position: {coords:{latitude: number, longitude: number}}) => {
          setVespaCoords({lat: position.coords.latitude,lng: position.coords.longitude});
        },
        () => {
          // console.log("no geo")
        }
      );
    }
  }

  useEffect(()=> {
    setupGeo()

    const isProd = location.host.indexOf("fruit.camera") > -1;

    const rep = new Replicache<MutatorDefs>({
      pushURL: '/api/push',
      pullURL: '/api/pull',
      wasmModule: isProd ? "/replicache.wasm" : "/replicache.dev.wasm",
      name: "fruit",
      mutators
    });

    listen(rep);
    setRep(rep);
  }, [])


  return (
    <div className="App">

      {rep &&

        <div className="body">
            <Navigation rep={rep} />

            <Map
              isShown={isShown}
              map={map}
              mapRef={mapRef}
              setZoom={setZoom}
              zoom={zoom}
              setSelectedViewCoords={setSelectedViewCoords}
              selectedViewCoords={selectedViewCoords}
              vespaCoords={vespaCoords}
              setBounds={setBounds}
              bounds={bounds}
              togglePinFormModal={togglePinFormModal}
              togglePinModal={togglePinModal}
              rep={rep}
            />

            <PinFormModal
              isShown={isShown}
              modalPinCoords={modalPinCoords}
              togglePinFormModal={togglePinFormModal}
              setSelectedViewCoords={setSelectedViewCoords}
              clearPins={props.clearPins}
              rep={rep}
            />

            <PinModal
              pin={activePin}
              setSelectedViewCoords={setSelectedViewCoords}
              togglePinModal={togglePinModal}
              togglePinFormModal={togglePinFormModal}
              rep={rep}
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


