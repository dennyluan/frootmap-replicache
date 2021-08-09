export default function setupGeo(setVespaCoords: any) {
  if (navigator.geolocation != undefined) {
    navigator.geolocation.getCurrentPosition(
      (position: {coords:{latitude: number, longitude: number}}) => {
        setVespaCoords({lat: position.coords.latitude,lng: position.coords.longitude});
      },
      () => {
        console.log("no geo")
      }
    );
  }
}