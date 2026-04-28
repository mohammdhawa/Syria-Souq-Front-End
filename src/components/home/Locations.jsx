import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { locations } from "@/data/locations";
import { useSelector } from "react-redux";
import { Categories, SyriaCities } from "@/data/General";
import { Popover, Select } from "antd";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const StyledSelect = styled(Select)`
  width: 100% !important;
  height: 3.375rem !important;
  color: black !important;
  .ant-select-selector {
    border-radius: 0.6rem !important;
    padding-left: 2rem !important;
    padding-right: 2rem !important;
    font-size: 1rem !important;
  }
  .ant-select-arrow {
    color: black !important;
    margin-left: 1rem;
  }
  .ant-select-clear {
    margin-left: 1rem;
  }
  .ant-select-selection-placeholder {
    color: black !important;
    opacity: 0.6 !important;
  }
`;

const StyledSwiper = styled(Swiper)`
  &.locations-swiper {
    .swiper-pagination:nth-child(2) {
      bottom: rem;
    }
  }
`;

export default function Locations() {
  const { countPerCity } = useSelector((state) => state.homePage);
  const [category, setCategory] = useState(null);
  const [topCities, setTopCities] = useState([]);
  const [count, setCount] = useState(8);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (countPerCity) {
      const mergedCities = SyriaCities.map((city) => ({
        ...city,
        count: countPerCity[city.value] || 0,
      }));
      const sortedCities = mergedCities
        .sort((a, b) => b.count - a.count)
        .slice(0, isMobile ? mergedCities.length : count);

      setTopCities(sortedCities);
    }
  }, [countPerCity, count, isMobile]);

  const renderCityCard = (city, index) => {
    const { value, label, image, count } = city;
    return (
      <div
        key={value}
        className={`${isMobile ? "box-location " : "box-location-v2"}`}
      >
        <div className="box-img  img-style">
          <Popover
            style={{
              width: "10rem",
            }}
            onOpenChange={() => {
              setCategory(null);
            }}
            content={
              <>
                <StyledSelect
                  style={{ minWidth: "10rem" }}
                  options={Categories}
                  value={category}
                  placeholder={"اختر الفئة"}
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  dropdownRender={(menu) => (
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => {
                        e.stopPropagation();
                      }}
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                      }}
                    >
                      {menu}
                    </div>
                  )}
                />
                <Link
                  to={`/${
                    Categories.find((cat) => cat.value === category)
                      ?.englishLabel
                  }?city=${value}`}
                  target="_blank"
                  disabled={!category}
                  style={{
                    borderRadius: "0.6rem",
                  }}
                  className="tf-btn primary w-100 mt-2 text-dark"
                >
                  ابحث
                </Link>
              </>
            }
            trigger="click"
          >
            <img
              style={{ borderRadius: "16px", objectFit: "cover" }}
              className="lazyload top-city w-100"
              data-src={image}
              alt={label}
              src={image}
              height={300}
            />
          </Popover>
        </div>
        <div className="content ">
          <h6 className="link">{label}</h6>
          <p className="mt-4 text-variant-1">{count} إعلان</p>
        </div>
      </div>
    );
  };

  return (
    <section className="flat-section flat-location-v2">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            minWidth: "100%",
          }}
          className="box-title text-center wow fadeInUp"
        >
          <div>
            <div
              style={{ color: "#A3ABB0", textAlign: "right" }}
              className="text-subtitle"
            >
              اكتشف المدن
            </div>
            <h3 className="title mt-4">أكثر المدن إعلاناً</h3>
          </div>
        </div>

        <div dir="rtl" className="wow fadeInUp" data-wow-delay=".2s">
          {isMobile ? (
            <StyledSwiper
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="locations-swiper pb-5"
            >
              {topCities.map((city, index) => (
                <SwiperSlide key={city.value}>
                  {renderCityCard(city, index)}
                </SwiperSlide>
              ))}
            </StyledSwiper>
          ) : (
            <div className="row g-4">
              {topCities.map((city, index) => (
                <div key={city.value} className="col-md-6 col-lg-3">
                  {renderCityCard(city, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {!isMobile && (
        <div
          className="text-center"
          style={{
            marginTop: "2rem",
          }}
        >
          <button
            onClick={() => {
              if (count === 8) {
                setCount(16);
              } else {
                setCount(8);
              }
            }}
            style={{ color: "#1E1E1E", borderRadius: "0.6rem" }}
            className="tf-btn btn-view primary size-1 hover-btn-view"
          >
            {count === 8 ? "عرض المزيد" : "عرض أقل"}
          </button>
        </div>
      )}
    </section>
  );
}
