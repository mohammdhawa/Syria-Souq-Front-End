import React, { useState, useEffect } from "react";
import { Navigation03Icon } from "hugeicons-react";
import { MapComponent } from "../MapComponent";

export default function MapLocation({ ad }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!ad?.location) return;

    try {
      let lat, lng;
      if (ad.location.includes("google.com/maps")) {
        const urlParams = new URL(ad.location).searchParams;
        const coordinates =
          urlParams.get("q") ||
          urlParams.get("query") ||
          urlParams.get("center");

        if (coordinates) {
          [lat, lng] = coordinates.split(",").map(Number);
        }
      } else {
        [lat, lng] = ad.location.split(",").map(Number);
      }

      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation({ lat, lng });
      }
    } catch (error) {
      
    }
    
  }, [ad]);

  const handleNavigate = () => {
    if (!location || !location.lat || !location.lng) {
      
      return;
    }
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&travelmode=driving`;
    window.open(navUrl, "_blank");
  };

  return (
    <>
      <div className="w-100 d-flex justify-content-between align-items-center mb-3">
        <h5 className="title mb-0 fw-6">الموقع</h5>
        <button
          className="tf-btn d-flex align-items-center text-dark"
          onClick={handleNavigate}
          disabled={!location}
        >
          <Navigation03Icon size={20} />
          <span>اتجه الآن</span>
        </button>
      </div>
      {location && location.lat && location.lng ? (
        <MapComponent location={location} />
      ) : (
        <div>لا يوجد موقع محدد</div>
      )}
    </>
  );
}
