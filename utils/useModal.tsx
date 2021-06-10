import { useState } from 'react';
import { ICoords, IPin } from "../models/pins";

export const useFormModal = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [modalPinCoords, setModalPinCoords] = useState<ICoords>({lat: 0, lng: 0});

  const toggle = (coords?: ICoords) => {
    if (coords) { setModalPinCoords(coords) }
    setIsShown(!isShown);
  }

  return {
    isShown,
    modalPinCoords,
    toggle,
  };
};

export const usePinModal = () => {
  const [activePin, setIsShown] = useState<IPin | {}>();

  const setPinModal = ( pin?: IPin ) => {
    if (pin) {
      setIsShown(pin);
    } else {
      setIsShown({});
    }
  }

  return {
    activePin,
    setPinModal,
  };
};