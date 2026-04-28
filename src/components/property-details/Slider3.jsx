import { useState, useEffect } from "react";
import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
  Thumbs,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import FullScreenIcon from "../icons/FullScreenIcon";
import { Image, Tooltip } from "antd";

export default function Slider3({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainSwiper, setMainSwiper] = useState(null);

  const thumbProps = {
    spaceBetween: 14,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      375: { slidesPerView: 3, spaceBetween: 14 },
      500: { slidesPerView: "auto" },
    },
    onSlideChange: (swiper) => {
      setSelectedIndex(swiper.realIndex);
    },
    onClick: (swiper) => {
      setSelectedIndex(swiper.clickedIndex);
      mainSwiper?.slideTo(swiper.clickedIndex);
    },
  };

  const mainSwiperProps = {
    spaceBetween: 16,
    navigation: true,
    pagination: true,
    onSlideChange: (swiper) => {
      setSelectedIndex(swiper.realIndex);
    },
  };

  const handleFullscreenOpen = () => {
    setShowGallery(true);
  };

  useEffect(() => {
    if (mainSwiper) {
      mainSwiper.slideTo(selectedIndex);
    }
  }, [selectedIndex, mainSwiper]);

  return (
    <div>
      <div className="container">
        <div className="single-property-gallery">
          <div className="position-relative">
            <Swiper
              modules={[Thumbs, Autoplay, EffectFade, Navigation, Pagination]}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              className="swiper sw-single"
              {...mainSwiperProps}
              onSwiper={setMainSwiper}
              lazy={"true"}
            >
              {images?.map((image, index) => (
                <div key={index}>
                  <SwiperSlide style={{ cursor: "default" }} key={index}>
                    <div className="image-sw-single">
                      <img
                        style={{ objectFit: "cover", aspectRatio: "16/9" }}
                        alt={image?.id}
                        src={image?.url.replace(
                          "syr-souq.fra1.digitaloceanspaces.com",
                          "syr-souq.fra1.cdn.digitaloceanspaces.com"
                        )}
                        width={1290}
                        className="swiper-lazy"
                        loading="lazy"
                      />
                    </div>
                  </SwiperSlide>
                  <div className="swiper-lazy-preloader"></div>
                </div>
              ))}
            </Swiper>

            <Tooltip title={"ملء الشاشة"}>
              <div
                onClick={handleFullscreenOpen}
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  zIndex: "1",
                  cursor: "pointer",
                  padding: "0.5rem",
                  background: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "0.7rem",
                }}
              >
                <span className="text-white">
                  <FullScreenIcon />
                </span>
              </div>
            </Tooltip>
          </div>

          {images?.length > 1 && (
            <Swiper
              {...thumbProps}
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              className="swiper thumbs-sw-pagi"
              lazy={"true"}
            >
              {images?.map((thumb, index) => (
                <SwiperSlide key={index}>
                  <div className="img-thumb-pagi">
                    <img
                      style={{ objectFit: "cover" }}
                      alt={thumb.id}
                      src={thumb.url.replace(
                        "syr-souq.fra1.digitaloceanspaces.com",
                        "syr-souq.fra1.cdn.digitaloceanspaces.com"
                      )}
                      width={200}
                      height={111}
                      className="swiper-lazy"
                      loading="lazy"
                    />
                  </div>
                  <div className="swiper-lazy-preloader"></div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {showGallery && (
        <Image.PreviewGroup
          preview={{
            visible: showGallery,
            onVisibleChange: (value) => setShowGallery(value),
            current: selectedIndex,
            onChange: (currentIndex) => setSelectedIndex(currentIndex),
            scaleStep: 0.5,
            forceRender: true,
          }}
        >
          {images?.map((img, index) => (
            <Image key={index} src={img.url} style={{ display: "none" }} />
          ))}
        </Image.PreviewGroup>
      )}
    </div>
  );
}
