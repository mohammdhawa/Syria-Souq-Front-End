import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import Faqs from "@/components/otherPages/Faqs";
import PageTitle4 from "@/components/otherPages/PageTitle4";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "سوق سوريا | الأسئلة الشائعة",
  description: "سوق سوريا | الأسئلة الشائعة",
};
export default function FaqPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <PageTitle4 />
      <Faqs />
      <Footer />
    </>
  );
}
