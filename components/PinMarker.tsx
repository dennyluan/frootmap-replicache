import React from "react";
import { IPin } from "../models/types";

interface PinMarkerProps {
  // pin?: IPin,
  style?: any,
  onClick: () => void,
  lat: number,
  lng: number,
  pin: IPin
}

const PinMarker = ( props: PinMarkerProps ) => {

  const clickHandler = () => {
    props.onClick()
  }

  const time = new Date(props.pin.created_at)

  return (
    <div
      style={props.style}
      className="pin-marker"
      onClick={clickHandler}
    >
      <div className="arrow"></div>
      <h2>{props.pin.text}</h2>
      {/*<h4 className="muted">{props.pin.id}</h4>*/}
      {/*<h4 className="muted">{time.toLocaleTimeString()} {time.toLocaleDateString()}</h4>*/}
      {/*<h4 className="muted">lat: {props.lat}</h4>
      <h4 className="muted">lng: {props.lng}</h4>*/}
    </div>
  );
};

export default PinMarker