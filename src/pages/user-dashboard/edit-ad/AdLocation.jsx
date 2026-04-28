import React, { useState, useEffect } from "react";
import { Alert } from "antd";
import { MapComponent } from "@/components/MapComponent";

export default function AdLocation({ ad }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!ad?.location) return;

    try {
      if (ad.location.includes("google.com/maps")) {
        const urlParams = new URL(ad.location).searchParams;
        const coordinates =
          urlParams.get("q") ||
          urlParams.get("query") ||
          urlParams.get("center");

        if (coordinates) {
          const [lat, lng] = coordinates.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setLocation({ lat, lng });
          }
        }
      } else {
        const [lat, lng] = ad.location.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          setLocation({ lat, lng });
        }
      }
    } catch (error) {
    
    }
  }, [ad]);

  return (
    <div className="d-flex flex-column gap-3">
      <h5 className="title fw-6">الموقع</h5>
      {location && location.lat && location.lng ? (
        <MapComponent location={location} />
      ) : (
        <Alert
          message={"ساعدنا في إيصال إعلانك بشكل أفضل! حدّد موقع الإعلان الآن."}
          showIcon
          type="info"
        />
      )}
    </div>
  );
}
