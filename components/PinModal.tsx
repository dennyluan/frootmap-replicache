import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Modal, { Styles } from "react-modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useSwipeable } from "react-swipeable";

import { IPin, ICoords } from "../models/types"

import { deletePin } from '../features/pinSlice'
import { Replicache, MutatorDefs } from 'replicache';

Modal.setAppElement("#root");

interface ModalProps {
  // pin?: IPin,
  pin?: any,
  togglePinModal: () => void,
  togglePinFormModal: (coords: any, toggle: any) => void,
  setSelectedViewCoords: (coords: ICoords) => void,
  rep: Replicache<MutatorDefs>,
}

const PinModal = ( props: ModalProps ) => {

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      handleClose()
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true
  });

  const { pin } = props;

  let open = (pin && pin.id != undefined) || false

  function handleClose() {
    props.togglePinFormModal({}, false);
    props.togglePinModal();
    props.setSelectedViewCoords({lat: 0, lng: 0})
  }

  function handleDelete() {
    props.rep.mutate.deletePin({id: pin.id})
    props.togglePinModal()
  }

  return <Modal
    isOpen={open}
    className="modal modal.shown animate__animated animate__slideInUp animate__faster"
    contentLabel="About this pin"
    onRequestClose={() => handleClose()}
    shouldCloseOnOverlayClick={true}
  >
    <div
      className="modal-dialog"
      {...handlers}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3>{pin && pin.text}</h3>
          <FontAwesomeIcon
            icon={faTimesCircle}
            onClick={() => handleClose()}
            aria-label="Close"
            className="close"
          />
        </div>
        <div className="modal-body">

          <p>About this pin:</p>
          <h4>{pin && pin.text}</h4>
          <button
            className="btn btn-danger mv-3"
            onClick={() => handleDelete()}
          >
            Delete this pin
          </button>


          <div className="admin">
            <h4>Admin:</h4>
            <p><label>ID:</label> {pin && pin.id}</p>
          </div>
        </div>
      </div>
    </div>

  </Modal>
}

export default PinModal
