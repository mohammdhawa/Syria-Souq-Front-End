import React, { useState, useEffect, useRef } from "react";
import {
  StyledSpaceCompact,
  StyledButton,
  StyledPriceInput,
} from "@/pages/publish-ad/styled";
import { Alert, Modal } from "antd";
import { Location01Icon, Search01Icon } from "hugeicons-react";
import OvalLoader from "@/components/OvalLoader";
import toastNotify from "@/utils/toast";
import { useGoogleMaps } from "@/context/GoogleMapsContext";

export const MapSelector = ({
  onLocationSelect,
  defaultLocation,
  visible,
  onCancel,
}) => {
  const { isLoaded } = useGoogleMaps();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  
  useEffect(() => {
    if (visible && isLoaded && mapRef.current) {
      setIsMapLoading(true);
     
      mapInstanceRef.current = null;
      markerRef.current = null;
      searchBoxRef.current = null;
      initializeMap().catch((err) => {
        toastNotify("فشل تحميل الخريطة. حاول مرة أخرى.", "error");
        setIsMapLoading(false);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
      if (markerRef.current) {
        window.google.maps.event.clearInstanceListeners(markerRef.current);
      }
      if (searchBoxRef.current) {
        window.google.maps.event.clearInstanceListeners(searchBoxRef.current);
      }
    };
  }, [visible, isLoaded]);

  useEffect(() => {
    if (
      visible &&
      defaultLocation &&
      defaultLocation.lat &&
      defaultLocation.lng
    ) {
      setSelectedLocation(defaultLocation);
      setSearchInput("");
      findLocationByCoordinates(defaultLocation.lat, defaultLocation.lng);
    } else if (visible && !defaultLocation) {
      setSelectedLocation(null);
      setSearchInput("");
    }
  }, [visible, defaultLocation]);

  useEffect(() => {
    if (
      isLoaded &&
      mapInstanceRef.current &&
      markerRef.current &&
      selectedLocation &&
      selectedLocation.lat &&
      selectedLocation.lng
    ) {
      const position = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };
      mapInstanceRef.current.setCenter(position);
      mapInstanceRef.current.setZoom(15);
      markerRef.current.position = position;
    }
  }, [selectedLocation, isLoaded]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflowY = "hidden";
      document.body.style.width = "100%";
    }
    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.width = "auto";
    };
  }, [visible]);

  const getUserLocation = () => {
    setIsLocationLoading(true);
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setIsLocationLoading(false);
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            setIsLocationLoading(false);
            resolve({ lat: 24.7136, lng: 46.6753 });
          }
        );
      } else {
        setIsLocationLoading(false);
        resolve({ lat: 24.7136, lng: 46.6753 });
      }
    });
  };

  const initializeSearchBox = () => {
    const input = document.getElementById("map-search-input");
    if (input && window.google?.maps?.places) {
      searchBoxRef.current = new window.google.maps.places.Autocomplete(input, {
        fields: ["geometry", "name"],
        types: ["geocode"],
      });

      searchBoxRef.current.addListener("place_changed", () => {
        const place = searchBoxRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) {
          toastNotify("لم يتم العثور على مكان صالح", "error");
          return;
        }

        const position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setSelectedLocation(position);
        setSearchInput(place.name || "");
      });
    }
  };

  const initializeMap = async () => {
    if (!isLoaded) {
      setIsMapLoading(false);
      return;
    }

    let initialCenter = defaultLocation || (await getUserLocation());

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 15,
      mapTypeControl: false,
      mapId: "390db88f3f9beb0c249a6637",
    });

    if (
      window.google.maps.marker &&
      window.google.maps.marker.AdvancedMarkerElement
    ) {
      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: initialCenter,
        gmpDraggable: true,
      });
    } else {
      markerRef.current = new window.google.maps.Marker({
        map: mapInstanceRef.current,
        position: initialCenter,
        draggable: true,
      });
    }

    mapInstanceRef.current.addListener("click", (event) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setSelectedLocation(position);
      setSearchInput("");
    });

    markerRef.current.addListener("dragend", (event) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setSelectedLocation(position);
      setSearchInput("");
    });

    if (!selectedLocation || (defaultLocation && visible)) {
      setSelectedLocation(initialCenter);
      findLocationByCoordinates(initialCenter.lat, initialCenter.lng);
    }

    initializeSearchBox();
    setIsMapLoading(false);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onCancel();
    } else {
      toastNotify("يرجى تحديد الموقع على الخريطة", "info");
    }
  };

  const handleUserLocation = () => {
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setSelectedLocation(userLocation);
          setSearchInput("");
          setIsLocationLoading(false);
        },
        (error) => {
          setIsLocationLoading(false);
          toastNotify(
            "تعذر الحصول على الموقع. تأكد من تفعيل خدمات الموقع.",
            "error"
          );
        }
      );
    } else {
      setIsLocationLoading(false);
      toastNotify("المتصفح لا يدعم خاصية تحديد الموقع.", "error");
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const findLocationByCoordinates = (lat, lng) => {
    if (window.google?.maps?.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setSearchInput(results[0].formatted_address);
        } else {
          setSearchInput("");
        }
      });
    }
  };

  return (
    <Modal
      title="اختيار الموقع"
      open={visible}
      centered
      onCancel={handleCancel}
      width={700}
      forceRender
      destroyOnClose={false}
      footer={[
        <div
          className="d-flex align-items-center gap-2 w-100 justify-content-end"
          key="footer"
        >
          <button key="cancel" className="btn" onClick={handleCancel}>
            إلغاء
          </button>
          <button
            className="tf-btn primary text-dark"
            key="submit"
            type="primary"
            onClick={handleConfirmLocation}
          >
            تأكيد الموقع
          </button>
        </div>,
      ]}
    >
      <div className="mb-2 d-flex align-items-center gap-2 position-relative">
        <StyledSpaceCompact>
          <StyledPriceInput
            id="map-search-input"
            placeholder="ابحث عن الموقع..."
            prefix={<Search01Icon size={18} />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <StyledButton
            type="default"
            onClick={handleUserLocation}
            disabled={isLocationLoading || !isLoaded}
          >
            {isLocationLoading ? (
              <OvalLoader />
            ) : (
              <>
                <Location01Icon
                  style={{
                    marginBottom: "0.2rem",
                  }}
                  size={18}
                />
                <span className="ms-2">موقعي الحالي</span>
              </>
            )}
          </StyledButton>
        </StyledSpaceCompact>
      </div>
      <Alert
        type="info"
        className="mb-2 w-100"
        showIcon
        closable
        message="يمكنك تحديد موقعك عن طريق سحب علامة الموقع، الضغط على الخريطة، أو البحث عن الموقع المطلوب"
      />

      <div
        ref={mapRef}
        style={{ height: "400px", width: "100%", borderRadius: "0.6rem" }}
      ></div>
    </Modal>
  );
};
