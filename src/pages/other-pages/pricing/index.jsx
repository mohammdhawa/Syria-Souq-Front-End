import Banner from "@/components/common/Banner";
import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import PageTitle2 from "@/components/otherPages/PageTitle2";
import Pricing from "@/components/otherPages/Pricing";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Syria Souq | Pricing",
  description: "ابحث عن أفضل عروض العقارات والسيارات للبيع وللإيجار في سوريا",
};
export default function PricingPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <PageTitle2 />
      <Pricing />
      <Banner />
      <Footer />
    </>
  );
}
