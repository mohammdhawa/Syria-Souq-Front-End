import Brands from "@/components/common/Brands";
import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import Benefit from "@/components/home/Benefit";
import Banner from "@/components/common/Banner";
import About from "@/components/otherPages/About";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Syria Souq | About us",
  description: "ابحث عن أفضل عروض العقارات والسيارات للبيع وللإيجار في سوريا",
};
export default function AboutUsPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <About />
      <Benefit />
      <Banner />
      <Brands />
      <Footer />
    </>
  );
}
