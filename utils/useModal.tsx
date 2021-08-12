import { useState } from 'react';
import { ICoords, IPin } from "../models/types";

export const useFormModal = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [modalPinCoords, setModalPinCoords] = useState<ICoords>({lat: 0, lng: 0});

  const togglePinFormModal = (coords?: ICoords, toggle?: boolean) => {
    if (coords) { setModalPinCoords(coords) }

    // hack for css clickthru on pinmarker
    if (toggle != undefined) {
      setIsShown(toggle);
    } else {
      setIsShown(!isShown);
    }
  }

  return {
    isShown,
    modalPinCoords,
    togglePinFormModal,
  };
};

export const usePinModal = () => {
  const [activePin, setIsShown] = useState<IPin | {}>({})

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