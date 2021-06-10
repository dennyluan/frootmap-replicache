import React, { useEffect, useState } from "react";
import { connect } from 'react-redux'

import Modal, { Styles } from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";

import { ICoords } from "../models/pins";
import { createPin } from "../features/pinSlice";
import { setMap } from "../features/mapSlice";

Modal.setAppElement("#root");

interface IPinModalProps {
  isShown: boolean,
  modalPinCoords: ICoords,
  mapRef: any,
  hide: () => void,
  clearPins: () => void
}

const PinFormModal = (props: IPinModalProps) => {
  const [fruit, setFruit] = useState<string>("");
  const [titleInput, setTitleInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const dispatch = useDispatch()

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

  function handleClose() {
    setFruit("");
    setError("");
    setTitleInput("");
    props.hide();
  }

  function handleClick() {
    let value = fruit || titleInput || null
    if (value) {
      // createPin(fruit);

      const payload = {
        pinCoords: props.modalPinCoords,
        text: value
      }
      dispatch(createPin(payload))

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
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Choose a fruit:</h5>
              <FontAwesomeIcon
                icon={faTimesCircle}
                onClick={props.hide}
                aria-label="Close"
                className="btn-close"
              />
              <br/>
              <p className="muted">
                Coordinates:
                <span className="mr-3">Lat: {props.modalPinCoords.lat}</span>
                <span>Lng: {props.modalPinCoords.lng}</span>
              </p>
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
                onClick={props.clearPins}
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
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PinFormModal

// const mapDispatch = { createPin }

// export default connect(
//   null,
//   mapDispatch)
// (PinFormModal)
