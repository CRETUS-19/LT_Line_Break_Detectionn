import React from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const style = { width: "100%", height: "400px" };

function MapView({ poles }) {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={style} center={{ lat: 20.5937, lng: 78.9629 }} zoom={6}>
        {Object.keys(poles).map(id => (
          <Marker
            key={id}
            position={{ lat: poles[id].lat, lng: poles[id].lng }}
            icon={{
              url: poles[id].status === "FAULT"
                ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapView;