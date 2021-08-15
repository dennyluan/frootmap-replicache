import React, { useEffect, useState, useRef } from "react";
import { ICoords } from "../models/types";

interface VespaProps {
  lat?: any
  lng?: any
}

const Vespa = (props: VespaProps) => {
  const vespaRef = useRef<HTMLDivElement>(null)

  useEffect(()=> {
    jiggle()
  }, [])

  function jiggle() {
    if (vespaRef.current) {
      vespaRef.current.classList.toggle("animate__bounce")
    }
  }

  return (
    <div
      className="vespa animate__animated "
      onClick={()=>{
        jiggle()
      }}
      ref={vespaRef}
    >
      <img
        src="/vespa.svg"
        alt="current location" />
    </div>
  )
}

export default Vespa