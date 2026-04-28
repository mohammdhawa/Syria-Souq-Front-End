import {
  GoogleMap,
  OverlayView,
  useLoadScript,
  InfoWindow,
  OverlayViewF,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";

const contactItems = [
  {
    lat: 33.5138,
    long: 36.2765,
    title: "مكتب دمشق",
    imageSrc: "/images/page-title/contactMap.png",
    info: [
      {
        iconClass: "icon icon-map-trifold",
        text: "باب توما, دمشق, سوريا",
      },
      {
        iconClass: "icon icon-phone-line",
        text: "+963951501948",
      },
      {
        iconClass: "icon icon-mail-line",
        text: "info@syr-souq.com",
      },
    ],
  },
  {
    lat: 35.5236,
    long: 35.7916,
    title: "مكتب اللاذقية",
    imageSrc: "/images/page-title/contactMap.png",
    info: [
      {
        iconClass: "icon icon-map-trifold",
        text: "الطريق الرئيسي في اللاذقية, سوريا",
      },
      {
        iconClass: "icon icon-phone-line",
        text: "+963951501948",
      },
      {
        iconClass: "icon icon-mail-line",
        text: "info@syr-souq.com",
      },
    ],
  },
];

const option = {
  zoomControl: true,
  disableDefaultUI: true,
  scrollwheel: false,
  styles: [],
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function ContactMap() {
  const [getLocation, setLocation] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCHOnjP0Er0vnUivcjxKeQEw-mcumwz-Wk",
  });

  const center = useMemo(() => ({ lat: 33.5138, lng: 36.2765 }), []);

  const CustomMarker = ({ elm }) => {
    return (
      <div className="marker-container" onClick={() => setLocation(elm)}>
        <div className="marker-card">
          <div className="front face">
            <div />
          </div>
          <div className="back face">
            <div />
          </div>
          <div className="marker-arrow" />
        </div>
      </div>
    );
  };

  const closeCardHandler = () => {
    setLocation(null);
  };

  return (
    <>
      {!isLoaded ? (
        <p>Loading...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={6.5}
          options={option}
        >
          {contactItems.map((marker, i) => (
            <OverlayViewF
              key={i}
              position={{ lat: marker.lat, lng: marker.long }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <CustomMarker elm={marker} />
            </OverlayViewF>
          ))}
          {getLocation && (
            <InfoWindow
              position={{ lat: getLocation.lat, lng: getLocation.long }}
              onCloseClick={closeCardHandler}
            >
              <div className="map-box">
                <div className="contact-map-item">
                  <div className="inner-box">
                    <div className="image-box">
                      <img src={getLocation.imageSrc} alt="" />
                    </div>
                    <div className="content">
                      <div className="title">{getLocation.title}</div>
                      <ul className="list-info">
                        {getLocation.info.map((item, index) => (
                          <li key={index}>
                            <span className={item.iconClass} />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </>
  );
}
