import { configureStore } from "@reduxjs/toolkit";

import homePageReducer from "./reducers/homePageReducer";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import favoritesReducer from "./reducers/favoritesReducer";
import advertisementsReducer from "./reducers/advertisementsReducer";
import vehicleReducer from "./reducers/vehicleReducer";
import myAdvertisementsReducer from "./reducers/myAdvertisementsReducer";
import subscriptionReducer from "./reducers/subscriptionReducer";
import packagesReducer from "./reducers/packagesReducer";
import premiumAdsReducer from "./reducers/premiumAdsReducer";

const store = configureStore({
  reducer: {
    homePage: homePageReducer,
    auth: authReducer,
    favorites: favoritesReducer,
    advertisements: advertisementsReducer,
    vehicles: vehicleReducer,
    myAdvertisements: myAdvertisementsReducer,
    subscription: subscriptionReducer,
    packages: packagesReducer,
    premiumAds: premiumAdsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: true,
});

export default store;
