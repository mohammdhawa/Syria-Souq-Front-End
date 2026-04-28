import React, { createContext, useContext, useState, useEffect } from "react";

const GoogleMapsContext = createContext(null);

export const GoogleMapsProvider = ({ children, apiKey }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    );

    if (existingScript) {
      if (!window.google || !window.google.maps) {
        existingScript.addEventListener("load", () => {
          setIsLoaded(true);
        });
        existingScript.addEventListener("error", () => {
          setLoadError(new Error("Google Maps failed to load"));
        });
      } else {
        setIsLoaded(true);
      }
      return;
    }

    const googleMapScript = document.createElement("script");
    const actualApiKey = apiKey || "AIzaSyCHOnjP0Er0vnUivcjxKeQEw-mcumwz-Wk";
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${actualApiKey}&libraries=places,marker&loading=async`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    googleMapScript.id = "google-maps-script";

    googleMapScript.addEventListener("load", () => {
      setIsLoaded(true);
    });

    googleMapScript.addEventListener("error", () => {
      setLoadError(new Error("Google Maps failed to load"));
    });

    document.head.appendChild(googleMapScript);

    return () => {
      // Optional: Cleanup script if component unmounts
      // document.head.removeChild(googleMapScript);
    };
  }, [apiKey]);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === null) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};
