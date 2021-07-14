import React from "react";
import { ICoords } from "../models/types";

interface VespaProps {
  vespaCoords?: ICoords
}

const Vespa = (props: VespaProps) => {

  return (
    <div>
      {  props.vespaCoords &&
        <div
          lat={props.vespaCoords.lat}
          lng={props.vespaCoords.lng}
        >
          <img src="/vespa.svg" />
        </div>
      }
    </div>
  )
}

export default Vespa