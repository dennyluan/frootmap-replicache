import React, { useEffect, useState, MouseEvent, useRef } from "react";
import { useSelector } from "react-redux";

import PinFormModal from "../components/PinFormModal";
import Navigation from "../components/Navigation";
import PinModal from "../components/PinModal";
import Map from "../components/Map";
import { ICoords, IPin, ISession } from "../models/types";
import { useFormModal, usePinModal } from "../utils/useModal";
import setupGeo from "../utils/geo";

import { Replicache, MutatorDefs } from 'replicache';
import * as Pusher from 'pusher-js';
import { listen } from './../utils/rep';
import { mutators } from './../features/mutators'

import { supabase } from '../utils/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'

// import dynamic from 'next/dynamic';
// const RepContainerDynamic = dynamic(() => import('../components/RepContainer'))

function App(props: any) {
  const debug = (process.env.NODE_ENV !== 'production')

  const googleKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const [session, setSession] = useState<ISession | null>(null)
  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const [ vespaCoords, setVespaCoords ] = useState<ICoords>();
  const [ selectedViewCoords, setSelectedViewCoords ] = useState<ICoords>({ lat: 0, lng: 0 });
  const { isShown, togglePinFormModal, modalPinCoords } = useFormModal();
  const { activePin, togglePinModal } = usePinModal();
  const { map } = useSelector( ( state: { map: any } ) => state.map );
  const mapRef = useRef<any>(null);
  const [bounds, setBounds] = useState<any>(null)
  const [zoom, setZoom] = useState<number>(16);
  const [rep, setRep] = useState<Replicache<MutatorDefs>>();

  useEffect(()=> {
    setupGeo(setVespaCoords)

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

    // getClientID(rep)
  }, [])

  async function getClientID(rep: Replicache<MutatorDefs>){
    console.log("hi")
    if (rep != undefined) {
      const id = await rep.clientID
      console.log("id:", id)
    }
  }

  return (
    <div className="App">

      {rep &&

        <div className="body">
            <Navigation
              rep={rep}
              debug={debug}
              navigateTo={()=> {
                if (vespaCoords) mapRef.current.panTo(vespaCoords)
              }}
            >
            </Navigation>

            <Map
              pin={activePin}
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

export default App
