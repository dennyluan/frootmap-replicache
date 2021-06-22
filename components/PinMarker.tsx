import React from "react";
import { IPin } from "../models/types";

interface PinMarkerProps {
  pin?: IPin,
  style?: any,
  onClick: () => void,
  id: any,
  text: any,
  lat: number,
  lng: number
}

const PinMarker = ( props: PinMarkerProps ) => {

  const clickHandler = () => {
    props.onClick()
    // console.log("clicked on pin")
  }

  return (
    <div
      style={props.style}
      className="pin-marker"
      onClick={clickHandler}
    >
      <div className="arrow"/>
      {props.text}
    </div>
  );
};

export default PinMarker