import React from "react";
import { ICoords } from "../models/types";

interface VespaProps {
  lat?: any
  lng?: any
}

const Vespa = (props: VespaProps) => {
  return (
    <div className="vespa">
      <img src="/vespa.svg" alt="current location" />
    </div>
  )
}

export default Vespa