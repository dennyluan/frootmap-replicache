interface PendingPinMarkerProps {
  lat?: number;
  lng?: number;
}

const PendingPinMarker = (props: PendingPinMarkerProps) => {

  return (
    <div
      className="view-marker"
    >
      <div className="arrow"></div>
      New Pin!
    </div>
  )
}

export default PendingPinMarker
