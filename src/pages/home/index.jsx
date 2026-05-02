import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import Categories from "@/components/home/Categories";
import Hero from "@/components/home/Hero";
import Locations from "@/components/home/Locations";
import React, { useEffect } from "react";
import MetaComponent from "@/components/common/MetaComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomePage } from "@/redux/actions/homePageActions";
import AdvertisementSectionHome from "@/components/home/AdvertisementSectionHome";
import CreativeAdSpot from "@/components/home/CreativeAdSpot";
import Loader from "@/components/Loader";
import FaqsSectionHome from "@/components/home/FaqsSectionHome";
import FeaturedAdvertisementsSection from "@/components/home/FeaturedAdvertisementsSection";
const metadata = {
  title:
    "Syria Souq | أكبر منصة في سوريا للإعلانات المبوبة لبيع وتأجير العقارات والسيارات",
  description: "ابحث عن أفضل عروض العقارات والسيارات للبيع وللإيجار في سوريا",
  keywords:
    "سوق, سوريا, إعلانات, بيع, شراء, مستعمل, جديد, سيارات, عقارات, أراضي, دراجات, موتورات, قوارب, سيارات مستعملة, سيارات للبيع, سيارات جديدة, أسعار السيارات, سوق السيارات, سيارات دمشق, سيارات حلب, سيارات حمص, سيارات اللاذقية, عقارات, شقق, شقق للبيع, شقق للإيجار, فلل, منازل, بيوت, أسعار العقارات, عقارات دمشق, عقارات حلب, عقارات حمص, عقارات اللاذقية, أراضي, أرض للبيع, شراء أرض, أسعار الأراضي, سوق الأراضي, أراضي دمشق, أراضي حلب, أراضي حمص, أراضي اللاذقية, قوارب, يخوت, قوارب مستعملة, قوارب جديدة, زوارق, سوق القوارب, قوارب صيد, قوارب دمشق, قوارب حلب, قوارب حمص, قوارب اللاذقية, دراجات, موتورات, دراجات مستعملة, دراجات للبيع, سوق الدراجات, دراجات دمشق, دراجات حلب, دراجات حمص, دراجات اللاذقية",
};
import FeaturedAdsShowcase from "@/components/home/FeaturedAdsShowcase";

export default function HomePage2() {
  const { loading } = useSelector((state) => state.homePage);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchHomePage());
  }, [dispatch]);
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  return (
    <div className="position-relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaComponent meta={metadata} />
          <Header1 />
          <Hero />
          <FeaturedAdsShowcase />
          <Categories />
          <FeaturedAdvertisementsSection />
          {/* Creative Ad spot placed between categories and locations */}
          {/* <CreativeAdSpot /> */}
          <AdvertisementSectionHome />
          <Locations />
          <FaqsSectionHome />

          <Footer />
        </>
      )}
    </div>
  );
}
