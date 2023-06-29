import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "./map.styles.css";
import "leaflet/dist/leaflet.css";

const Map = ({ coordinates }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    updatePosition();
  }, [coordinates]);

  const updatePosition = (e) => {
    if (coordinates && coordinates.lat && coordinates.long) {
      setPosition(L.latLng(coordinates.lat, coordinates.long));
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (success) => {
            const { latitude, longitude } = success.coords;
            setPosition(L.latLng(latitude, longitude));
          },
          (error) => {
            console.log("Error getting current position:", error);
            setPosition(L.latLng(45.7966081, 15.911679));
            console.log(position);
          }
        );
      } else {
        setPosition(L.latLng(45.7966081, 15.911679));
        console.log(position);
      }
    }
  };

  return (
    <div className="map-container">
      {position && (
        <MapContainer key={JSON.stringify(position)} center={position} zoom={10} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
