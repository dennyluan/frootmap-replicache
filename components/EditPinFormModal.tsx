import React, { useEffect, useState } from "react";

import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useSwipeable } from "react-swipeable";

import { IPin, ICoords } from "../models/types";
import { Replicache, MutatorDefs } from 'replicache';

interface IPinModalProps {
  isShown: boolean,
  modalPinCoords: ICoords,
  togglePinFormModal: () => void,
  setSelectedViewCoords: (coords: ICoords) => void,
  clearPins: () => void,
  rep: Replicache<MutatorDefs>
  pin: IPin
}
export default function EditPinFormModal(props: IPinModalProps) {

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      handleClose()
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true
  });

  function handleClose() {
    // setFruit("");
    // setError("");
    // setTitleInput("");
    props.togglePinFormModal();
    props.setSelectedViewCoords({lat: 0, lng: 0})
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
          Hello there
        </div>
      </Modal>
    </div>



  )

}