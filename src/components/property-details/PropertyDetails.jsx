import Description from "./Description";
import Overview from "./Overview";
import Features from "./Features";
import MapLocation from "./MapLocation";
import ContactSeller from "./ContactSeller";
import LeatestProperties from "./LeatestProperties";
import Video from "./Video";
import { useEffect, useState } from "react";
import ContactSellerMobile from "./ContactSellerMobile";
export default function PropertyDetails({ ad, similarAds }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <section className="flat-section-v3 flat-property-detail">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-7">
              <div
                className={`single-property-element single-property-desc pe-0 ps-0 ${isMobile && "mb-0 p-3"}`}
              >
                <Description description={ad?.description} />
              </div>
              {isMobile && (
                <div className="single-property-element single-property-overview pe-0 ps-0 p-3 mb-3">
                  <ContactSellerMobile seller={ad?.user} ad={ad} />
                </div>
              )}

              <div className="single-property-element single-property-overview pe-0 ps-0">
                <Overview ad={ad} />
              </div>

              {(ad?.features && ad?.features?.length) > 0 && (
                <div className="single-property-element single-property-feature pe-0 ps-0">
                  <Features features={ad?.features} category={ad?.category} />
                </div>
              )}
              {ad?.video_url && (
                <div className="single-property-element single-property-video pe-0 ps-0">
                  <Video videoUrl={ad?.video_url} />
                </div>
              )}
              {ad?.location && (
                <div className="single-property-element single-property-map pe-0 ps-0">
                  <MapLocation ad={ad} />
                </div>
              )}
            </div>

            <div className="col-xl-4 col-lg-5">
              <div className="single-sidebar fixed-sidebar">
                {!isMobile && (
                  <div className="widget-box  single-property-contact">
                    <ContactSeller seller={ad?.user} ad={ad} />
                  </div>
                )}
                <div className="box-latest-property">
                  <LeatestProperties similarAds={similarAds} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
    </>
  );
}
