import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade, EffectCoverflow, EffectCards, EffectCreative, EffectCube, Pagination, Thumbs } from "swiper/modules";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArrowLeft01Icon, ArrowRight01Icon, Location01Icon, StarIcon, FireIcon, Tag01Icon } from "hugeicons-react";
import { Currencies } from "@/data/General";
import { getCategoryUrlName } from "@/utils/categoryMapping";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-cards";
import "swiper/css/effect-creative";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// --- Shared Styles ---
const ShowcaseSection = styled.section`
  padding: 60px 0;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 100px;
`;

const VariantContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const VariantTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #161e2d;
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  span {
    background: #ffe800;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 14px;
    color: #161e2d;
  }
`;

const AdImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ViewBtn = styled(Link)`
  background: white;
  color: #161e2d;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #161e2d;
    color: white;
    transform: translateY(-2px);
  }
`;

// --- Navigation Buttons ---
const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  color: #161e2d;

  &:hover {
    background: #ffe800;
    transform: translateY(-50%) scale(1.1);
  }

  &.swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrevBtn = styled(NavBtn)`
  left: 20px;
`;

const NextBtn = styled(NavBtn)`
  right: 20px;
`;

// --- Variant 1: Modern Hero (Fade) ---
const HeroSlideContent = styled.div`
  position: relative;
  height: 500px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  z-index: 10;
  color: white;
  text-align: right;
  max-width: 600px;
`;

const ModernHeroSlider = ({ ads }) => (
    <VariantContainer>
        <VariantTitle><span>Option 1</span> Modern Immersive Hero</VariantTitle>
        <div className="position-relative">
            <Swiper
                modules={[EffectFade, Autoplay, Navigation, Pagination]}
                effect="fade"
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: '.hero-prev',
                    nextEl: '.hero-next'
                }}
                loop={true}
                className="rounded-4"
            >
                {ads.map(ad => (
                    <SwiperSlide key={ad.id}>
                        <HeroSlideContent>
                            <AdImage src={ad.images[0]?.url.replace("digitaloceanspaces.com", "cdn.digitaloceanspaces.com")} />
                            <HeroOverlay>
                                <div className="d-flex gap-2 mb-3 justify-content-end">
                                    <span className="badge bg-white text-dark fs-14 px-3 py-2 rounded-pill">{ad.category?.name}</span>
                                    <span className="badge bg-primary text-white fs-14 px-3 py-2 rounded-pill">{ad.city}</span>
                                </div>
                                <h3 className="display-5 fw-8 mb-3 text-shadow text-white">{ad.title}</h3>
                                <div className="d-flex align-items-center justify-content-end gap-3">
                                    <div className="fs-28 fw-7 text-white text-shadow">
                                        {new Intl.NumberFormat("en-US").format(ad?.price)} {Currencies.find(c => c.value === ad?.currency)?.label}
                                    </div>
                                    <ViewBtn to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`}>
                                        View Details <ArrowLeft01Icon size={18} />
                                    </ViewBtn>
                                </div>
                            </HeroOverlay>
                        </HeroSlideContent>
                    </SwiperSlide>
                ))}
            </Swiper>
            <PrevBtn className="hero-prev"><ArrowRight01Icon size={24} /></PrevBtn>
            <NextBtn className="hero-next"><ArrowLeft01Icon size={24} /></NextBtn>
        </div>
    </VariantContainer>
);

// --- Variant 2: 3D Coverflow ---
const CoverflowCard = styled.div`
  height: 420px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

const CoverflowContent = styled.div`
  padding: 20px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CoverflowSlider = ({ ads }) => (
    <VariantContainer>
        <VariantTitle><span>Option 2</span> 3D Coverflow Gallery</VariantTitle>
        <div className="position-relative">
            <Swiper
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                    rotate: 40,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={true}
                navigation={{
                    prevEl: '.cover-prev',
                    nextEl: '.cover-next'
                }}
                loop={true}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                style={{ paddingBottom: '50px' }}
            >
                {ads.map(ad => (
                    <SwiperSlide key={ad.id} style={{ width: '320px' }}>
                        <CoverflowCard>
                            <div style={{ height: '220px', position: 'relative' }}>
                                <AdImage src={ad.images[0]?.url.replace("digitaloceanspaces.com", "cdn.digitaloceanspaces.com")} />
                                <div className="position-absolute top-0 end-0 m-3">
                                    <span className="badge bg-dark text-white">{ad.category?.name}</span>
                                </div>
                            </div>
                            <CoverflowContent>
                                <div>
                                    <h4 className="fs-18 fw-7 mb-1 text-truncate text-dark" title={ad.title}>{ad.title}</h4>
                                    <div className="text-muted fs-14 mb-2"><Location01Icon size={14} className="me-1" />{ad.city}</div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div className="text-primary fw-8 fs-20">
                                        {new Intl.NumberFormat("en-US").format(ad?.price)} <small>{Currencies.find(c => c.value === ad?.currency)?.label}</small>
                                    </div>
                                    <Link to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`} className="btn btn-sm btn-outline-dark rounded-pill">
                                        Details
                                    </Link>
                                </div>
                            </CoverflowContent>
                        </CoverflowCard>
                    </SwiperSlide>
                ))}
            </Swiper>
            <PrevBtn className="cover-prev" style={{ left: '10px' }}><ArrowRight01Icon size={24} /></PrevBtn>
            <NextBtn className="cover-next" style={{ right: '10px' }}><ArrowLeft01Icon size={24} /></NextBtn>
        </div>
    </VariantContainer>
);

// --- Variant 3: Creative Parallax ---
const CreativeCard = styled.div`
  height: 480px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 40px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
    z-index: 1;
  }
`;

const CreativeContent = styled.div`
  position: relative;
  z-index: 2;
  color: white;
  width: 100%;
`;

const CreativeSlider = ({ ads }) => (
    <VariantContainer>
        <VariantTitle><span>Option 3</span> Creative Parallax</VariantTitle>
        <div className="position-relative">
            <Swiper
                modules={[EffectCreative, Autoplay, Navigation]}
                effect="creative"
                creativeEffect={{
                    prev: { shadow: true, translate: [0, 0, -400] },
                    next: { translate: ["100%", 0, 0] },
                }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                navigation={{
                    prevEl: '.creative-prev',
                    nextEl: '.creative-next'
                }}
                loop={true}
                className="rounded-5"
            >
                {ads.map(ad => (
                    <SwiperSlide key={ad.id}>
                        <CreativeCard>
                            <div style={{ position: 'absolute', inset: 0 }}>
                                <AdImage src={ad.images[0]?.url.replace("digitaloceanspaces.com", "cdn.digitaloceanspaces.com")} />
                            </div>
                            <CreativeContent>
                                <div className="row align-items-end">
                                    <div className="col-md-8">
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <FireIcon size={20} color="#ffe800" variant="solid" />
                                            <span className="text-uppercase tracking-widest fs-12 fw-7 text-warning">Featured Ad</span>
                                        </div>
                                        <h2 className="display-5 fw-8 mb-3 text-shadow text-white">{ad.title}</h2>
                                        <div className="d-flex align-items-center gap-3 text-white">
                                            <span><Location01Icon size={16} /> {ad.city}</span>
                                            <span>•</span>
                                            <span>{ad.category?.name}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <div className="fs-30 fw-8 text-white mb-3">
                                            {new Intl.NumberFormat("en-US").format(ad?.price)} <span className="fs-16 text-white">{Currencies.find(c => c.value === ad?.currency)?.label}</span>
                                        </div>
                                        <ViewBtn to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`}>
                                            View Details <ArrowLeft01Icon size={18} />
                                        </ViewBtn>
                                    </div>
                                </div>
                            </CreativeContent>
                        </CreativeCard>
                    </SwiperSlide>
                ))}
            </Swiper>
            <PrevBtn className="creative-prev"><ArrowRight01Icon size={24} /></PrevBtn>
            <NextBtn className="creative-next"><ArrowLeft01Icon size={24} /></NextBtn>
        </div>
    </VariantContainer>
);

// --- Variant 4: Stacked Cards ---
const StackCard = styled.div`
  height: 450px;
  border-radius: 24px;
  background: #fff;
  color: #161e2d;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;

const StackImage = styled.div`
  height: 65%;
  position: relative;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  ${StackCard}:hover img {
    transform: scale(1.1);
  }
`;

const StackContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
`;

const StackedSlider = ({ ads }) => (
    <VariantContainer>
        <VariantTitle><span>Option 4</span> Stacked Cards Deck</VariantTitle>
        <div className="d-flex justify-content-center position-relative">
            <Swiper
                modules={[EffectCards, Autoplay, Navigation]}
                effect="cards"
                grabCursor={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                navigation={{
                    prevEl: '.stack-prev',
                    nextEl: '.stack-next'
                }}
                className="w-100"
                style={{ maxWidth: '320px' }}
            >
                {ads.map(ad => (
                    <SwiperSlide key={ad.id}>
                        <StackCard>
                            <StackImage>
                                <AdImage src={ad.images[0]?.url.replace("digitaloceanspaces.com", "cdn.digitaloceanspaces.com")} />
                                <div className="position-absolute top-0 start-0 m-3">
                                    <span className="badge bg-warning text-dark fw-7">Special Offer</span>
                                </div>
                            </StackImage>
                            <StackContent>
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted fs-12"><Location01Icon size={12} /> {ad.city}</span>
                                        <StarIcon size={16} color="#ffe800" variant="solid" />
                                    </div>
                                    <h4 className="fs-18 fw-7 mb-0 text-dark">{ad.title}</h4>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="fs-22 fw-8 text-primary">
                                        {new Intl.NumberFormat("en-US").format(ad?.price)}
                                    </span>
                                    <Link to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`} className="btn btn-dark btn-sm rounded-pill px-3">
                                        View
                                    </Link>
                                </div>
                            </StackContent>
                        </StackCard>
                    </SwiperSlide>
                ))}
            </Swiper>
            <PrevBtn className="stack-prev" style={{ left: '30%', zIndex: 0 }}><ArrowRight01Icon size={24} /></PrevBtn>
            <NextBtn className="stack-next" style={{ right: '30%', zIndex: 0 }}><ArrowLeft01Icon size={24} /></NextBtn>
        </div>
    </VariantContainer>
);

// --- Variant 5: 3D Cube ---
const CubeSlider = ({ ads }) => (
    <VariantContainer>
        <VariantTitle><span>Option 5</span> 3D Cube Rotation</VariantTitle>
        <div className="d-flex justify-content-center position-relative">
            <Swiper
                modules={[EffectCube, Autoplay, Pagination, Navigation]}
                effect="cube"
                grabCursor={true}
                cubeEffect={{
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={true}
                navigation={{
                    prevEl: '.cube-prev',
                    nextEl: '.cube-next'
                }}
                loop={true}
                style={{ width: '350px', height: '450px' }}
            >
                {ads.map(ad => (
                    <SwiperSlide key={ad.id}>
                        <div className="h-100 w-100 position-relative bg-white">
                            <AdImage src={ad.images[0]?.url.replace("digitaloceanspaces.com", "cdn.digitaloceanspaces.com")} />
                            <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                                <h4 className="fw-7 mb-1 text-white">{ad.title}</h4>
                                <div className="fw-7 text-white fs-18">
                                    {new Intl.NumberFormat("en-US").format(ad?.price)} {Currencies.find(c => c.value === ad?.currency)?.label}
                                </div>
                                <Link to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`} className="btn btn-light btn-sm w-100 mt-3 fw-7">
                                    Check Details
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <PrevBtn className="cube-prev" style={{ left: '30%' }}><ArrowRight01Icon size={24} /></PrevBtn>
            <NextBtn className="cube-next" style={{ right: '30%' }}><ArrowLeft01Icon size={24} /></NextBtn>
        </div>
    </VariantContainer>
);

// --- Variant 6: Thumbs Gallery ---
const ThumbsSlider = ({ ads }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <VariantContainer>
            <VariantTitle><span>Option 6</span> Interactive Thumbs Gallery</VariantTitle>
            <div className="position-relative">
                <Swiper
                    style={{ height: '400px', borderRadius: '20px', marginBottom: '10px' }}
                    modules={[Navigation, Thumbs, Autoplay, EffectFade]}
                    effect="fade"
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    navigation={{
                        prevEl: '.thumbs-prev',
                        nextEl: '.thumbs-next'
                    }}
                    loop={true}
                    className="mb-3"
                >
                    {ads.map(ad => (
                        <SwiperSlide key={ad.id}>
                            <div className="position-relative w-100 h-100">
                                <AdImage src={ad.images[0]?.url.replace("digitaloceanspaces.com", "cdn.digitaloceanspaces.com")} />
                                <div className="position-absolute top-50 start-0 translate-middle-y p-5 text-white d-none d-md-block" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)', width: '60%', color: 'white' }}>
                                    <span className="badge bg-warning text-dark mb-3">Featured</span>
                                    <h2 className="display-5 fw-8 mb-3 text-white">{ad.title}</h2>
                                    <p className="fs-18 mb-4 opacity-75 text-white"><Location01Icon size={18} className="me-2" />{ad.city} • {ad.category?.name}</p>
                                    <div className="d-flex align-items-center gap-4">
                                        <span className="fs-30 fw-7 text-white">
                                            {new Intl.NumberFormat("en-US").format(ad?.price)} <small className="fs-16 text-white">{Currencies.find(c => c.value === ad?.currency)?.label}</small>
                                        </span>
                                        <ViewBtn to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`}>
                                            View Ad
                                        </ViewBtn>
                                    </div>
                                </div>
                                {/* Mobile Overlay */}
                                <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white d-md-none" style={{ background: 'rgba(0,0,0,0.7)' }}>
                                    <h5 className="mb-1 text-white">{ad.title}</h5>
                                    <div className="fw-7 text-white">{new Intl.NumberFormat("en-US").format(ad?.price)}</div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <PrevBtn className="thumbs-prev"><ArrowRight01Icon size={24} /></PrevBtn>
                <NextBtn className="thumbs-next"><ArrowLeft01Icon size={24} /></NextBtn>
            </div>

            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                className="thumbs-swiper"
                breakpoints={{
                    640: { slidesPerView: 5 },
                    1024: { slidesPerView: 6 },
                }}
            >
                {ads.map(ad => (
                    <SwiperSlide key={ad.id} style={{ opacity: 0.6, transition: 'opacity 0.3s' }}>
                        <div style={{ height: '80px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}>
                            <AdImage src={ad.images[0]?.url.replace("digitaloceanspaces.com", "cdn.digitaloceanspaces.com")} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </VariantContainer>
    );
};

// --- Main Showcase Component ---
const FeaturedAdsShowcase = () => {
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

        return adsWithImages.slice(0, 10);
    }, [advertisements]);

    if (randomAds.length === 0) return null;

    return (
        <ShowcaseSection>
            {/* <div className="container text-center mb-5">
                <h2 className="display-6 fw-8">Featured Slider Concepts (2026)</h2>
                <p className="text-muted">Presenting 6 distinct modern slider interactions with autoplay</p>
            </div> */}

            {/* <ModernHeroSlider ads={randomAds} />
            <CoverflowSlider ads={randomAds} />
            <CreativeSlider ads={randomAds} />
            <StackedSlider ads={randomAds} />
            <CubeSlider ads={randomAds} />
            <ThumbsSlider ads={randomAds} /> */}

        </ShowcaseSection>
    );
};

export default FeaturedAdsShowcase;
