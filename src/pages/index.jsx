import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import Benefit from "@/components/common/Benefit";
import Brands from "@/components/common/Brands";
import Locations from "@/components/common/Locations";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Syria Souq",
  description: "Syria Souq - Real Estate Reactjs Template",
};
export default function Home() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <Hero />
      <Properties />
      <Locations />
      <Services />
      <Benefit />
      <Brands />
      <Blogs />
      <Footer />
    </>
  );
}
