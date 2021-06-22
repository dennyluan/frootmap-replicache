import React from "react";
import { IPin } from "../models/types";

interface PinMarkerProps {
  // pin?: IPin,
  style?: any,
  onClick: () => void,
  text: any,
  lat: number,
  lng: number
}

const PinMarker = ( props: PinMarkerProps ) => {

  console.log("pinmarker props", props)

  const clickHandler = () => {
    props.onClick()
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