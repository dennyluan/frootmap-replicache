import React from "react";
import { IPin } from "../models/pins";

interface PinMarkerProps {
  pin?: IPin,
  style?: any,
  onClick: () => void,
  id: any,
  text: any,
  lat: string,
  lng: string
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