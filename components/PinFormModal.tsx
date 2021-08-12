import React, { useEffect, useState } from "react";
import { connect } from 'react-redux'

import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useSwipeable } from "react-swipeable";

import { ICoords } from "../models/types";
import { setMap } from "../features/mapSlice";

import { useSubscribe } from 'replicache-react';
import { Replicache, MutatorDefs } from 'replicache';

import {supabase} from '../utils/supabase.js';


Modal.setAppElement("#root");

interface IPinModalProps {
  isShown: boolean,
  modalPinCoords: ICoords,
  togglePinFormModal: () => void,
  setSelectedViewCoords: (coords: ICoords) => void,
  clearPins: () => void,
  rep: Replicache<MutatorDefs>
}

const PinFormModal = (props: IPinModalProps) => {
  const [fruit, setFruit] = useState<string>("");
  const [titleInput, setTitleInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      handleClose()
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true
  });

  const FRUITS = [
    "Mango",
    "Pineapple",
    "Lemon",
    "Lime",
    "Orange",
    "Coconut",
    "Pomegranate",
    "Pomelo",
    "Eggplant",
  ];

  // const onKeyDown = (event: Event;) => {
  //   console.log('event', event)
  //   if (event.keyCode === 27 && isShown) {
  //     hide();
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('keydown', onKeyDown, false);
  //   return () => {
  //     document.removeEventListener('keydown', onKeyDown, false);
  //   };
  // }, [isShown]);

  const handleClearPins = () : void => {
    props.rep.mutate.clearPins();
    handleClose()

    // props.clearPins()
  }

  function renderFruits() {
    return FRUITS.map((f, i) => {
      return renderButton(f, i);
    });
  }

  function renderButton(f: string, i: number) {
    const classes =
      fruit === f ? "btn btn-dark m-2" : "btn btn-outline-dark m-2";

    return (
      <button className={classes} onClick={() => setFruit(f)} key={i}>
        {f}
      </button>
    );
  }

  const pins = useSubscribe(
    props.rep,
    async tx => {
      const thepins : any = await tx.scan({prefix: 'pin/'}).entries().toArray();
      console.log("thepins", thepins)
      return thepins;
    },
    [],
  );

  function handleClose() {
    setFruit("");
    setError("");
    setTitleInput("");
    props.togglePinFormModal();
    props.setSelectedViewCoords({lat: 0, lng: 0})
  }

  // this function gets the global atomic timestamp
  async function getVersion() {

    // 1. get the "select currval('vesion')"
    // 2. set a lock
    // later. release the lock when the push is registered?

    // alt strategy: try 2! sequence columns
      // version and lock_version

    const { data, error } = await supabase
      .from('version')
      .select('last_value')
      // .then(resp => {
      //   console.log("resp", resp.body[0].last_value)
      //   return resp.body[0].last_value
      // })
    let value = data[0].last_value
    return value
  }

  // todo: form payload
  function repCreatePin(payload: any) {

    let order;

    const last = pins.length && pins[pins.length - 1][1];
    // order = (last?.order ?? 0) + 1;

    let id = Math.random().toString(32).substr(2)

    let {lat, lng} = props.modalPinCoords
    let value = fruit || titleInput || null

    const time = new Date().toISOString()

    const version = getVersion()
    console.log('()()(version', version)

    const newpayload = {
      id: id,
      sender: "Denny",
      description: "A fruit",
      text: value,
      lat: lat,
      lng: lng,
      created_at: time,
      updated_at: time,
      version: version
    }

    // console.log("[pinformmodal] payload", newpayload)

    props.rep.mutate.createPin({...newpayload});
  }

  function handleClick() {
    let value = fruit || titleInput || null
    if (value) {

      const payload = {
        pinCoords: props.modalPinCoords,
        text: value
      }

      repCreatePin(payload)

      handleClose();
    } else {
      setError("Please select a fruit!");
    }
  }

  function handleInputChange(event: any) {
    setTitleInput(event.target.value);
    setFruit("");
  }

  return (
    <div>
      <Modal
        isOpen={props.isShown}
        className="modal modal.shown animate__animated animate__slideInUp animate__faster"
        contentLabel="Create a pin modal"
        onRequestClose={() => handleClose()}
        shouldCloseOnOverlayClick={true}
      >
        <div {...handlers} className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Choose a fruit:</h5>
              <FontAwesomeIcon
                icon={faTimesCircle}
                onClick={() => handleClose()}
                aria-label="Close"
                className="close"
              />
            </div>

            <div className="modal-body">
              {error && <p className="alert alert-danger">{error}</p>}

              <div className="input-group input-group-lg mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-lg">
                    What kind of fruit?
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Fruit Name"
                  placeholder="Add a fruit..."
                  value={titleInput}
                  onChange={handleInputChange}
                />
              </div>

              {renderFruits()}

            </div>

            <div className="modal-footer">

              {/*
              <button
                className="btn btn-danger ml-3"
                onClick={()=>dispatch(setMap({lat: 47.608013, lng: -122.335167, map: mapRef}))}
              >
                Go to Seattle
              </button>
              */}

              <button
                className="btn btn-danger ml-3"
                onClick={handleClearPins}
              >
                Clear pins
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleClose()}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleClick()}
              >
                Save changes
              </button>

              <button onClick={()=>getVersion()}>get version</button>

            </div>
          </div>
        </div>




        <p className="muted mt-5 position-absolute text-center w-100">
          Coordinates:
          <span className="mr-3">Lat: {props.modalPinCoords.lat}</span>
          <span>Lng: {props.modalPinCoords.lng}</span>
        </p>

      </Modal>
    </div>
  );
};

export default PinFormModal
