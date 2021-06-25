import { useState } from 'react';
import { ICoords, IPin } from "../models/types";

export const useFormModal = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [modalPinCoords, setModalPinCoords] = useState<ICoords>({lat: 0, lng: 0});

  const togglePinFormModal = (coords?: ICoords) => {
    if (coords) { setModalPinCoords(coords) }
    setIsShown(!isShown);
  }

  return {
    isShown,
    modalPinCoords,
    togglePinFormModal,
  };
};

export const usePinModal = () => {
  const [activePin, setIsShown] = useState<IPin | {}>();

  const togglePinModal = ( pin?: IPin ) => {
    if (pin) {
      setIsShown(pin);
    } else {
      setIsShown({});
    }
  }

  return {
    activePin,
    togglePinModal,
  };
};