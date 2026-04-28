import FilterTab from "@/components/common/FilterTab";
import TyperComponent from "@/components/common/Typer";
import { sliderImages } from "@/data/heroSlides";
import React from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Hero() {
  return (
    <section className="flat-slider home-2 ">
      <div className="container relative">
        <div className="row">
          <div className="col-xl-10 ">
            <div className="slider-content py-5 my-5">
              <div className="heading">
                <h1 className="fw-8 mb-2 title animationtext clip">
                  فرصتك متاحة الآن
                  <br />
                  <TyperComponent
                    strings={["لنشر إعلانك بثقة", "بمجرد نقرة", "مع سوق سوريا"]}
                  />
                </h1>
                <p
                  className="subtitle body-1 fw-light text-variant-1 wow fadeInUp"
                  data-wow-delay=".2s"
                >
                  منزل أحلامك، أرض لمشروعك، سيارة تنقلك، أو حتى مركبة بحرية.
                  كلّها بانتظارك هنا.
                </p>
              </div>

              <FilterTab
                tabClass="nav-tab-form  style-2"
                styleClass="style-2"
              />
              <div className="wrap-search-link">
                <p style={{ color: "#5C6368" }} className="body-2">
                  وصول سريع
                </p>
                <div className="categories-list">
                  <a href="/cars">سيارات</a>
                  <a href="/motorcycles">دراجات</a>
                  <a href="/houses">بيوت</a>
                  <a href="/lands">أراضي</a>
                  <a href="/marines">مركبات بحرية</a>
                </div>
              </div>
              <div className="w-100 d-flex flex-column gap-2   mt-5 hero-store-badges">
                <span className="fs-6">حمّل التطبيق من</span>
                <div className="d-flex  gap-2">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.syriasouq.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <img src="/images/gp_badge.png" alt="Google Play" />
                  </a>
                  <a
                    href="https://apps.apple.com/tr/app/%D8%B3%D9%88%D9%82-%D8%B3%D9%88%D8%B1%D9%8A%D8%A7/id6751295790"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <img src="/images/as_badge.png" alt="App Store" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="img-banner-left" style={{ right: "0" }}>
        <img
          alt="img"
          src="/images/slider/graplic-slider-2.png"
          width={412}
          height={187}
        />
      </div> */}
      <div className="img-banner-right" style={{ right: "50%", left: "0" }}>
        <Swiper
          effect="fade"
          modules={[EffectFade, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={500}
          className="swiper slider-sw-home2"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <div className={`slider-home2 ${image.className || ""}`}>
                <img
                  alt={image.alt}
                  src={image.src}
                  width={image.width}
                  height={image.height}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
