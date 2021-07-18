import React from "react";
import { ICoords } from "../models/types";

interface VespaProps {
  // vespaCoords?: ICoords
}

const Vespa = (props: VespaProps) => {
  if (props.vespaCoords == undefined) return null

  return (
    <div
      className="vespa"
    >
      <img src="/vespa.svg" />
    </div>
  )
}

export default Vespa