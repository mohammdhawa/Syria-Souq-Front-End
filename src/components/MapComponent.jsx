import React, { useEffect, useState, useRef } from "react";
import { Alert } from "antd";
import { useGoogleMaps } from "@/context/GoogleMapsContext";
import OvalLoader from "./OvalLoader";

export const MapComponent = ({ location, height = "400px", zoom = 15 }) => {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !location || !location.lat || !location.lng) return;
    try {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({
          lat: location.lat,
          lng: location.lng,
        });

        if (markerRef.current) {
          markerRef.current.setPosition({
            lat: location.lat,
            lng: location.lng,
          });
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapInstanceRef.current,
          });
        }
        return;
      }
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: location.lat, lng: location.lng },
        zoom: zoom,
        mapTypeControl: false,
      });

      markerRef.current = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstanceRef.current,
      });
    } catch (error) {
      setMapError(true);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [isLoaded, location, zoom]);

  if (loadError || mapError) {
    return (
      <Alert
        message={"عذراً، حدث خطأ في تحميل الخريطة"}
        showIcon
        type="error"
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading d-flex flex-column align-items-center gap-3 w-100 justify-content-center p-3 ">
        <OvalLoader />
        <p>جارٍ تحميل الخريطة...</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: height,
        borderRadius: "0.875rem",
      }}
    />
  );
};
