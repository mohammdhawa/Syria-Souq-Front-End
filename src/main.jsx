import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import arEG from "antd/lib/locale/ar_EG";
import { TourProvider } from "@reactour/tour";
import { GoogleMapsProvider } from "./context/GoogleMapsContext.jsx";

const tourSteps = [];
const googleMapsApiKey = "AIzaSyCHOnjP0Er0vnUivcjxKeQEw-mcumwz-Wk";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleMapsProvider apiKey={googleMapsApiKey}>
      <ConfigProvider
        locale={arEG}
        theme={{
          token: {
            fontFamily: "zain",
            direction: "rtl",
            colorPrimary: "#ffe800",
          },
          components: {
            Checkbox: {
              colorPrimary: "#25d366",
              colorPrimaryHover: "#25d355",
            },
          },
        }}
      >
        <BrowserRouter>
          <TourProvider steps={tourSteps}>
            <App />
          </TourProvider>
        </BrowserRouter>
      </ConfigProvider>
    </GoogleMapsProvider>
  </Provider>
);
