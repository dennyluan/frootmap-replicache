import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Modal, { Styles } from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useSwipeable } from "react-swipeable";
import { IPin, ICoords } from "../models/types"
import { Replicache, MutatorDefs } from 'replicache';

Modal.setAppElement("#root");

interface ModalProps {
  pin?: any,
  togglePinModal: () => void,
  togglePinFormModal: (coords: any, toggle: any) => void,
  setSelectedViewCoords: (coords: ICoords) => void,
  rep: Replicache<MutatorDefs>,
}

const PinModal = ( props: ModalProps ) => {
  const { pin } = props;
  let open = (pin && pin.id != undefined) || false

  const [isEditingPin, toggleEdit] = useState(true)
  const [editingPinData, setEditPinData] = useState<IPin>({text: '', description: ''})

  useEffect( () => {
    props.togglePinFormModal({}, false);
  }, [])

  useEffect( () => {
    if (props.pin && props.pin.text) { setEditPinData(props.pin) }
  }, [props])

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      handleClose()
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true
  });

  function handleClose() {
    toggleEdit(false)
    props.togglePinFormModal({}, false);
    props.togglePinModal(null);
    props.setSelectedViewCoords({lat: 0, lng: 0})
  }

  function handleDelete() {
    props.rep.mutate.deletePin({id: pin.id})
    handleClose()
  }

  // console.log("props.pin", props.pin)
  // console.log("editingPinData", editingPinData)

  function handleUpdate(e) {
    e.preventDefault()
    console.log("saving")

    let id = Math.random().toString(32).substr(2)

    // let {lat, lng} = props.modalPinCoords
    // let value = fruit || titleInput || null

    // const time = new Date().toISOString()

    console.log("{existing} pin", pin)

    // increment the version by one
    const version = parseInt(pin.version) + 1

    // const newpayload = {
    //   id: id,
    //   sender: "Denny",
    //   description: "A fruit",
    //   text: value,
    //   lat: lat,
    //   lng: lng,
    //   version: version,
    //   created_at: time,
    //   updated_at: time
    // }


    // const newPin = {...pin, version: version}

    // TODO: serialize pin function
    // todo: make a type for the supabase column type e.g. ISPin
    const time = new Date().toISOString()

    const newPin = {
      // ...pin,
      id: pin.id,
      text: editingPinData.text,
      description: editingPinData.description,
      lat: parseFloat(pin.coords[1]),
      lng: parseFloat(pin.coords[0]),
      created_at: pin.created_at,
      updated_at: time,
      version: version,
    }

    console.log("newPin", newPin)

    props.rep.mutate.updatePin(newPin);

    handleClose();

    // hook into mutate call here with editingPinData
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

          {isEditingPin == false &&
            <div>
              <p>About this pin:</p>
              <p>{pin && pin.description}</p>
              <p>{pin && JSON.stringify(pin.version)}</p>

              <button
                className="mt-l me-1 btn btn-secondary btn-sm"
                onClick={()=> toggleEdit(!isEditingPin)}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{'height': '1em'}}
                  className="mx-1"
                />
                Edit
              </button>
            </div>
          }

          {isEditingPin &&
            <div className="form border p-3 mt-4 rounded-3">
              <h4>Edit this pin</h4>

              <form className="form form-inline" onSubmit={(e) => handleUpdate(e)}>

                <div className="form-group col-5">
                  <label>Text</label>
                  <input name="text"
                    type="text"
                    className='form-control'
                    value={editingPinData.text}
                    onChange={ (e) => setEditPinData({...editingPinData, "text": e.target.value}) }
                    placeholder="Name of fruit"
                    />
                </div>

                <div className="form-group col-5">
                  <label>Description</label>
                  <textarea name="description"
                    className='form-control'
                    onChange={ (e) => setEditPinData({...editingPinData, "description": e.target.value}) }
                    value={editingPinData.description}
                    placeholder="Description"
                  />
                </div>

                <button
                  className="btn btn-sm btn-success mt-2 me-2"
                  type="submit"
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-danger mt-2 me-3"
                  onClick={() => handleDelete()}
                >
                  Delete this pin
                </button>

                <span className="mt-1 me-3 fs-4 lh-lg">|</span>

                <button
                  className="btn btn-sm btn-danger mt-2"
                  onClick={() => handleDelete()}
                >
                  Cancel
                </button>
              </form>
            </div>
          }
        </div>
      </div>
    </div>
  </Modal>
}

export default PinModal
