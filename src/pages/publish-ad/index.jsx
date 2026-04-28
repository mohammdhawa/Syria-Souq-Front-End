import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import React, { useEffect } from "react";
import PublishAdSection from "./PublishAdSection";
import MetaComponent from "@/components/common/MetaComponent";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Syria Souq | نشر إعلان",
  description:
    "أنشر إعلانك مجانًا على Syria Souq لبيع أو تأجير العقارات (شقق، بيوت، أراضي) والمركبات (سيارات، دراجات، قوارب). منصة متخصصة لعرض إعلاناتك بسهولة وسرعة.",
  keywords:
    "Syria Souq, سوق سوريا, إعلانات, نشر إعلان, بيع, شراء, إيجار, عقارات, بيوت, شقق, فلل, أراضي, سيارات, دراجات, موتورات, قوارب, يخوت, مركبات بحرية, سيارات للبيع, عقارات للبيع, شقق للإيجار, سوق السيارات, سوق العقارات, نشر إعلان عقاري, نشر إعلان سيارة, نشر إعلان دراجة, نشر إعلان قارب, سوريا, دمشق, حلب, حمص, اللاذقية",
};

const PublishAd = () => {
  const { subscription } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!subscription?.remaining_ads) {
      navigate("/dashboard/subscription?from=publish-ad", {
        replace: true,
      });
      return;
    }
  }, [subscription]);
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <PublishAdSection />
      <Footer />
    </>
  );
};

export default PublishAd;
