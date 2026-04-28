import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import RenderAd from "@/components/Advertisements/RenderAd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import styled from "styled-components";

const StyledSwiper = styled(Swiper)`
  &.tab-content-swiper {
    .swiper-pagination:nth-child(2) {
      bottom: -0.1rem;
    }
  }
`;

const TabContent = ({ filteredAds, currentFilterConfig }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="tab-content">
      <div className="tab-pane active show" role="tabpanel">
        {filteredAds.length > 0 ? (
          isMobile ? (
            <StyledSwiper
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="tab-content-swiper"
              touchEventsTarget="container"
            >
              {filteredAds.map((ad) => (
                <SwiperSlide key={ad.id}>
                  <RenderAd ad={ad} />
                </SwiperSlide>
              ))}
            </StyledSwiper>
          ) : (
            <div className="row">
              {filteredAds.map((ad) => (
                <div key={ad.id} className="col-xl-4 col-lg-6 col-md-6">
                  <RenderAd ad={ad} />
                </div>
              ))}
            </div>
          )
        ) : (
          <p className="text-center">لا توجد إعلانات متاحة</p>
        )}
        <div className="text-center mt-3">
          <Link
            to={`/${currentFilterConfig.source.toLowerCase()}s`}
            target="_blank"
            style={{ color: "#1E1E1E" }}
            className="tf-btn m-0 btn-view primary size-1 hover-btn-view "
          >
            عرض المزيد
            <span
              style={{ color: "#1E1E1E" }}
              className="icon icon-arrow-left2"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default function AdvertisementSectionHome() {
  const { advertisements } = useSelector((state) => state.homePage);

  const filters = ["منازل", "سيارات", "دراجات نارية", "مركبات بحرية", "أراضي"];
  const filterMap = {
    منازل: { categories: [2], source: "HOUSE" },
    سيارات: { categories: [3], source: "CAR" },
    "دراجات نارية": { categories: [5], source: "MOTORCYCLE" },
    "مركبات بحرية": { categories: [4], source: "MARINE" },
    أراضي: { categories: [1], source: "LAND" },
  };

  const allAds = Object.values(filterMap)
    .map((filter) => advertisements?.[filter.source] || [])
    .flat();

  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const currentFilterConfig = filterMap[selectedFilter];
  const filteredAds = allAds.filter((ad) =>
    currentFilterConfig.categories.includes(ad.category.id)
  );

  return (
    <section className="flat-section flat-recommended pt-0">
      <div className="container">
        <div className="box-title text-center wow fadeInUp">
          <div
            style={{ color: "#A3ABB0", letterSpacing: "0px" }}
            className="text-subtitle "
          >
            الإعلانات
          </div>
          <h3 className="title mt-4">اكتشف أحدث الإعلانات</h3>
        </div>
        <div
          className="flat-tab-recommended flat-animate-tab wow  fadeInUp"
          data-wow-delay=".2s"
        >
          <ul
            style={{
              overflow: "scroll",
              scrollbarWidth: "none",
            }}
            className="nav-tab-recommended  justify-content-sm-center"
          >
            {filters.map((option, index) => (
              <li
                onClick={() => setSelectedFilter(option)}
                key={index}
                className="nav-tab-item"
              >
                <a
                  className={`nav-link-item text-dark ${
                    option === selectedFilter ? "active" : ""
                  }`}
                  style={{ color: "#1E1E1E", borderRadius: "0.6rem" }}
                >
                  {option}
                </a>
              </li>
            ))}
          </ul>
          <TabContent
            filteredAds={filteredAds}
            currentFilterConfig={currentFilterConfig}
          />
        </div>
      </div>
    </section>
  );
}
