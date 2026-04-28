import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArrowLeft01Icon, ArrowRight01Icon, Location01Icon } from "hugeicons-react";
import { Currencies } from "@/data/General";
import { getCategoryUrlName } from "@/utils/categoryMapping";

const SliderSection = styled.section`
  padding: 40px 0;
  background-color: #fff;
  position: relative;
`;

const SliderContainer = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  background: #f8f9fa;
  height: 500px; 
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const SlideContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoOverlay = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  z-index: 2;
  color: white;
  max-width: 600px;
  text-align: right;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    left: 20px;
  }
`;

const AdTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const AdPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffe800;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const AdLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 20px;
`;

const ViewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #ffe800;
  color: #161e2d;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 232, 0, 0.4);
    color: #161e2d;
  }
`;

const NavigationWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 10;
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    display: none; 
  }
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;

  &:hover {
    background: #ffe800;
    border-color: #ffe800;
    color: #161e2d;
  }
`;

const FeaturedAdsSlider = () => {
  const { advertisements } = useSelector((state) => state.homePage);

  const randomAds = useMemo(() => {
    if (!advertisements) return [];

    const allAds = [
      ...(advertisements.LAND || []),
      ...(advertisements.HOUSE || []),
      ...(advertisements.CAR || []),
      ...(advertisements.MARINE || []),
      ...(advertisements.MOTORCYCLE || []),
    ];

    // Filter ads that have images
    const adsWithImages = allAds.filter(ad => ad.images && ad.images.length > 0);

    // Shuffle
    for (let i = adsWithImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [adsWithImages[i], adsWithImages[j]] = [adsWithImages[j], adsWithImages[i]];
    }

    return adsWithImages.slice(0, 8);
  }, [advertisements]);

  if (randomAds.length === 0) return null;

  return (
    <SliderSection>
      <div className="container">
        {/* <div className="box-title text-center wow fadeInUp mb-4">
                    <h3 className="title">إعلانات مميزة</h3>
                </div> */}

        <SliderContainer>
          <Swiper
            modules={[Navigation, Autoplay, EffectFade]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: ".hero-prev-button",
              nextEl: ".hero-next-button",
            }}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="featured-hero-swiper"
            style={{ height: '100%' }}
          >
            {randomAds.map((ad) => (
              <SwiperSlide key={ad.id}>
                <SlideContent>
                  <ImageContainer>
                    <img
                      src={ad.images[0].url.replace(
                        "syr-souq.fra1.digitaloceanspaces.com",
                        "syr-souq.fra1.cdn.digitaloceanspaces.com"
                      )}
                      alt={ad.title}
                    />
                  </ImageContainer>
                  <InfoOverlay>
                    <AdTitle>{ad.title}</AdTitle>
                    <AdPrice>
                      {Currencies.find((cur) => cur.value === ad?.currency)?.label || "$"}
                      {new Intl.NumberFormat("en-US").format(ad?.price)}
                    </AdPrice>
                    <AdLocation>
                      <Location01Icon size={20} />
                      {ad.city}
                    </AdLocation>
                    <ViewButton
                      to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`}
                    >
                      عرض التفاصيل
                      <ArrowLeft01Icon size={20} />
                    </ViewButton>
                  </InfoOverlay>
                </SlideContent>
              </SwiperSlide>
            ))}
          </Swiper>

          <NavigationWrapper>
            <NavButton className="hero-prev-button">
              <ArrowRight01Icon size={24} />
            </NavButton>
            <NavButton className="hero-next-button">
              <ArrowLeft01Icon size={24} />
            </NavButton>
          </NavigationWrapper>
        </SliderContainer>
      </div>
    </SliderSection>
  );
};

export default FeaturedAdsSlider;
