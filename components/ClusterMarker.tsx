import React from "react";
import { IPin } from "../models/pins";

const ClusterMarker = ( cluster : any ) => {

  const clickHandler = () => {
    cluster.onClick()
  }

  return (
    <div
      style={{
        width: `${cluster.width}`,
        height: `${cluster.length}`
      }}
      className="cluster-marker"
      onClick={clickHandler}
    >
      {cluster.text}
    </div>
  );
};

export default ClusterMarker