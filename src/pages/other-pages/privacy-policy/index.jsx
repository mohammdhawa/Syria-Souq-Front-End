import Footer1 from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import PageTitle5 from "@/components/otherPages/PageTitle5";
import PrivacyPolicy from "@/components/otherPages/PrivacyPolicy";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Syria Souq || Privacy Policy",
  description: "ابحث عن أفضل عروض العقارات والسيارات للبيع وللإيجار في سوريا",
};
export default function PrivacyPolicyPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <PageTitle5 />
      <PrivacyPolicy />
      <Footer1 />
    </>
  );
}
