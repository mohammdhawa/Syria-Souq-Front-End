import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import RenderFeaturedAd from "@/components/Advertisements/RenderFeaturedAd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import styled, { keyframes } from "styled-components";
import { StarsIcon } from "hugeicons-react";

/* ---------- Animations ---------- */
const titleGlow = keyframes`
    0%, 100% { text-shadow: 0 0 0 rgba(255, 184, 0, 0); }
    50% { text-shadow: 0 0 18px rgba(255, 184, 0, 0.45); }
`;

const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
`;

const gradientMove = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

/* ---------- Styled wrappers ---------- */
const FeaturedSection = styled.section`
    position: relative;
    overflow: hidden;
    padding: 4rem 0 3rem;

    /* subtle ambient gradient backdrop */
    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
                radial-gradient(
                        circle at 15% 20%,
                        rgba(255, 232, 0, 0.08),
                        transparent 45%
                ),
                radial-gradient(
                        circle at 85% 80%,
                        rgba(255, 184, 0, 0.08),
                        transparent 45%
                );
        pointer-events: none;
        z-index: 0;
    }

    .container {
        position: relative;
        z-index: 1;
    }
`;

const SubtitleBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 1rem;
    border-radius: 999px;
    background: linear-gradient(
            90deg,
            rgba(255, 232, 0, 0.15),
            rgba(255, 184, 0, 0.15),
            rgba(255, 232, 0, 0.15)
    );
    background-size: 200% 200%;
    animation: ${gradientMove} 5s ease infinite;
    border: 1px solid rgba(255, 184, 0, 0.35);
    color: #8a6a00;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.5px;

    svg {
        animation: ${float} 2.4s ease-in-out infinite;
        color: #ffb800;
    }
`;

const SectionTitle = styled.h3`
    margin-top: 1rem;
    background: linear-gradient(
            90deg,
            #1e1e1e 0%,
            #ffb800 50%,
            #1e1e1e 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientMove} 6s linear infinite,
    ${titleGlow} 3s ease-in-out infinite;
    font-weight: 800;
`;

const StyledSwiper = styled(Swiper)`
    &.featured-swiper {
        padding-bottom: 3rem;

        .swiper-pagination {
            bottom: 0;
        }

        .swiper-pagination-bullet {
            background: #ffb800;
            opacity: 0.4;
        }
        .swiper-pagination-bullet-active {
            opacity: 1;
            background: #ffb800;
            width: 24px;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
    }
`;

const ViewMoreButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.6rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
    color: #ffe800 !important;
    font-weight: 700;
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 6px 18px rgba(255, 184, 0, 0.25);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(255, 184, 0, 0.4);
    }

    .icon {
        color: #ffe800 !important;
    }
`;

/* ---------- Component ---------- */
export default function FeaturedAdvertisementsSection() {
    const { featured_advertisements } = useSelector((state) => state.homePage);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const featuredAds = featured_advertisements || [];

    if (!featuredAds.length) return null;

    return (
        <FeaturedSection className="flat-section flat-featured pt-0">
            <div className="container">
                <div className="box-title text-center wow fadeInUp">
                    <SubtitleBadge>
                        <StarsIcon size={16} strokeWidth={2} />
                        <span>الإعلانات المميزة</span>
                        <StarsIcon size={16} strokeWidth={2} />
                    </SubtitleBadge>
                    <SectionTitle className="title">
                        عروض مختارة بعناية لك
                    </SectionTitle>
                </div>

                <div
                    className="flat-featured-content wow fadeInUp mt-5"
                    data-wow-delay=".2s"
                >
                    {isMobile ? (
                        <StyledSwiper
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            modules={[Pagination, Autoplay]}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            className="featured-swiper"
                            touchEventsTarget="container"
                        >
                            {featuredAds.map((ad) => (
                                <SwiperSlide key={ad.id}>
                                    <RenderFeaturedAd ad={ad} />
                                </SwiperSlide>
                            ))}
                        </StyledSwiper>
                    ) : (
                        <StyledSwiper
                            spaceBetween={24}
                            slidesPerView={3}
                            pagination={{ clickable: true }}
                            modules={[Pagination, Autoplay]}
                            autoplay={{ delay: 4500, disableOnInteraction: true }}
                            breakpoints={{
                                1200: { slidesPerView: 3 },
                                992: { slidesPerView: 2 },
                                576: { slidesPerView: 2 },
                                0: { slidesPerView: 1 },
                            }}
                            className="featured-swiper"
                        >
                            {featuredAds.map((ad) => (
                                <SwiperSlide key={ad.id}>
                                    <RenderFeaturedAd ad={ad} />
                                </SwiperSlide>
                            ))}
                        </StyledSwiper>
                    )}

                    <div className="text-center mt-4">
                        <ViewMoreButton to="/featured" target="_blank">
                            عرض جميع الإعلانات المميزة
                            <span className="icon icon-arrow-left2" />
                        </ViewMoreButton>
                    </div>
                </div>
            </div>
        </FeaturedSection>
    );
}