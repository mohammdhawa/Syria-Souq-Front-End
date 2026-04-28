import Banner from "@/components/common/Banner";
import Brands from "@/components/common/Brands";
import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Syria Souq | Services",
  description: "ابحث عن أفضل عروض العقارات والسيارات للبيع وللإيجار في سوريا",
};
export default function OurServicePage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />

      <Brands />

      <Banner />
      <Footer />
    </>
  );
}
