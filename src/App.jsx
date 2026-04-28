import "../public/scss/styles.scss";
import "photoswipe/dist/photoswipe.css";
import "react-modal-video/scss/modal-video.scss";
import "rc-slider/assets/index.css";
import WOW from "./utlis/wow";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HomePage2 from "./pages/home";
import { useEffect } from "react";
import BackToTop from "./components/common/BackToTop";
import ScrollTopBehaviour from "./components/common/ScrollTopBehaviour";

import AdDetailsPage from "./pages/addetails";
import AboutUsPage from "./pages/other-pages/about-us";
import OurServicePage from "./pages/other-pages/our-service";
import PricingPage from "./pages/other-pages/pricing";
import ContactPage from "./pages/other-pages/contact";
import FaqPage from "./pages/other-pages/faq";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import PrivacyPolicyPage from "./pages/other-pages/privacy-policy";
import { Slide, ToastContainer } from "react-toastify";
import PublicRoute from "./Routes/PublicRoute";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthStatus,
  synchronizeProfile,
} from "./redux/actions/authActions";
import CategoryRouteWrapper from "./Routes/CategoryRouteWrapper";
import Otp from "./pages/auth/Otp";
import PrivateRoute from "./Routes/PrivateRoute";
import Loader from "./components/Loader";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PublishAd from "./pages/publish-ad";

import NotFound from "./pages/errors/NotFound";
import toastNotify from "./utils/toast";
import AdRouteWrapper from "./Routes/AdRouteWrapper";
import DashboardLayout from "./pages/user-dashboard/DashboardLayout";
import DashboardIndexRedirect from "./components/DashboardIndexRedirect";
import ProfilePage from "./pages/user-dashboard/ProfilePage";
import AccountSettingsPage from "./pages/user-dashboard/AccountSettingsPage";
import MyAdvertisementsPage from "./pages/user-dashboard/MyAdvertisementsPage";
import MyPremiumAdsPage from "./pages/user-dashboard/MyPremiumAdsPage";
import FavoritesPage from "./pages/user-dashboard/FavoritesPage";
import SubscriptionPage from "./pages/user-dashboard/SubscriptionPage";
import { synchronizeFavorites } from "./redux/actions/favoritesActions";
import { synchronizeMyAdvertisements } from "./redux/actions/myAdvertisementsActions";
import ShowAd from "./pages/user-dashboard/edit-ad/ShowAd";
import GoogleCallback from "./components/GoogleCallback";
import OAuthCallbackHandler from "./components/OAuthCallbackHandler";
import HomePageWrapper from "./components/HomePageWrapper";

const App = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.homePage);

  console.log('🔍 App: Current pathname:', pathname);
  console.log('🔍 App: Current search:', search);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.style.setProperty("color-scheme", "light");
  }, []);
  useEffect(() => {
    dispatch(checkAuthStatus());
    const handleRouteChange = () => {
      dispatch(checkAuthStatus());
    };
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(synchronizeFavorites());
    dispatch(synchronizeProfile());
    // dispatch(synchronizeMyAdvertisements());
  }, [dispatch]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => { });
    }
  }, []);

  useEffect(() => {
    const wow = new WOW({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname, loading]);

  return (
    <>
      <div id="wrapper">
        <div id="pagee" className="clearfix">
          <Routes>
            <Route path="/">
              <Route index element={<HomePageWrapper />} />
              <Route path=":category" element={<CategoryRouteWrapper />} />
              <Route
                path=":category/:type/:id/:slug"
                element={<AdRouteWrapper />}
              />
              <Route path="/auth" element={<PublicRoute />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="verify-otp" element={<Otp />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="google/callback" element={<GoogleCallback />} />
              </Route>

              <Route path="/publish-ad" element={<PrivateRoute />}>
                <Route index element={<PublishAd />} />
              </Route>

              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<DashboardIndexRedirect />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route
                    path="account-settings"
                    element={<AccountSettingsPage />}
                  />
                  <Route
                    path="my-advertisements"
                    element={<MyAdvertisementsPage />}
                  />
                  <Route
                    path="my-premium-ads"
                    element={<MyPremiumAdsPage />}
                  />
                  <Route path="subscription" element={<SubscriptionPage />} />
                  <Route path="favorite-ads" element={<FavoritesPage />} />
                  <Route
                    path="my-advertisements/:id/:slug"
                    element={<ShowAd />}
                  />
                </Route>
              </Route>

              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="contact-us" element={<ContactPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              {/*<Route path="our-service" element={<OurServicePage />} />
              <Route path="our-service" element={<OurServicePage />} />
              
           */}
            </Route>
          </Routes>
        </div>
      </div>

      <BackToTop />
      <ScrollTopBehaviour />
      <ToastContainer
        rtl
        autoClose={2000}
        limit={5}
        theme={"light"}
        position="bottom-left"
        closeOnClick
        transition={Slide}
        pauseOnHover
        toastStyle={{
          fontFamily: "zain",
          fontSize: "1rem",
        }}
      />
    </>
  );
};

export default App;
