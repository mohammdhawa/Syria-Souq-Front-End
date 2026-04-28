import Banner from "@/components/common/Banner";
import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import Contact from "@/components/otherPages/Contact";
import PageTitle3 from "@/components/otherPages/PageTitle3";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Syria Souq | تواصل معنا",
  description: "ابحث عن أفضل عروض العقارات والسيارات للبيع وللإيجار في سوريا",
};
export default function ContactPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      {/* <PageTitle3 /> */}
      <Contact />
      <Footer />
    </>
  );
}
