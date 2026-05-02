import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Currencies, SyriaCities } from "@/data/General";
import {
    Exchange01Icon,
    Triangle03Icon,
    MeetingRoomIcon,
    Bathtub02Icon,
    Car03Icon,
    Motorbike02Icon,
    FerryBoatIcon,
    CellsIcon,
    StarsIcon,
    PackageOpenIcon,
    Location01Icon,
    Clock01Icon,
    FavouriteIcon,
} from "hugeicons-react";
import { Autoplay, Pagination } from "swiper/modules";
import { getRentalPeriodLabel } from "@/utils/getRentalPeriodLabel";
import { getArabicTimeAgo } from "@/utils/getArabicTimeAgo";
import { getCategoryUrlName } from "@/utils/categoryMapping";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "antd";
import { addFavorite, removeFavorite } from "@/redux/actions/favoritesActions";
import toastNotify from "@/utils/toast";
import OvalLoader from "../OvalLoader";
import styled, { keyframes, css } from "styled-components";

/* ---------- Animations ---------- */
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const borderFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.05); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const slideShine = keyframes`
  0% { left: -100%; }
  100% { left: 200%; }
`;

/* ---------- Styled Wrapper ---------- */
const FeaturedCard = styled.div`
  position: relative;
  border-radius: 1rem;
  padding: 3px;
  background: linear-gradient(
    270deg,
    #ffe800,
    #ffb800,
    #ff8a00,
    #ffe800,
    #ffd700
  );
  background-size: 300% 300%;
  animation: ${borderFlow} 6s ease infinite;
  box-shadow: 0 8px 24px rgba(255, 184, 0, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.35s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 40px rgba(255, 184, 0, 0.32),
      0 6px 14px rgba(0, 0, 0, 0.08);
  }

  /* Inner sliding shine */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.35) 50%,
      transparent 100%
    );
    transform: skewX(-20deg);
    animation: ${slideShine} 3.5s ease-in-out infinite;
    pointer-events: none;
    z-index: 3;
  }

  ${(props) =>
    props.$isOwner &&
    css`
      background: linear-gradient(
        270deg,
        #1e1e1e,
        #ffe800,
        #1e1e1e,
        #ffe800
      );
      background-size: 300% 300%;
      animation: ${borderFlow} 5s ease infinite;
    `}
`;

const InnerCard = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 0.85rem;
  overflow: hidden;
  z-index: 2;
`;

/* Glowing badge in the top-right corner */
const FeaturedBadge = styled.div`
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
  color: #ffe800;
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: 999px;
  border: 1.5px solid #ffe800;
  box-shadow: 0 0 0 0 rgba(255, 232, 0, 0.7);
  animation: ${pulse} 2.4s ease-in-out infinite;

  svg {
    animation: ${float} 2.6s ease-in-out infinite;
  }
`;

/* Tiny twinkling sparkles around the card */
const Sparkle = styled.span`
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px 2px #ffe800;
  pointer-events: none;
  z-index: 4;
  animation: ${sparkle} 2.8s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay || "0s"};
  top: ${(p) => p.$top || "10%"};
  left: ${(p) => p.$left || "10%"};
`;

/* Premium price tag with shimmer */
const PremiumPrice = styled.h5`
  position: relative;
  border-radius: 0 1rem 0 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(
    90deg,
    #1e1e1e 0%,
    #2a2a2a 50%,
    #1e1e1e 100%
  );
  color: #ffe800;
  font-weight: 700;
  overflow: hidden;
  margin: 0;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 232, 0, 0.25),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2.5s linear infinite;
  }

  span.rent-period {
    color: #ffffffaa;
    font-weight: 400;
  }
`;

const RenderFeaturedAd = ({ ad, favorite = false }) => {
    const city = SyriaCities.find((c) => c.value === ad?.city);
    const cityLabel = city ? city.label : ad?.city;
    const isSwap = ad?.type === "sale" ? ad?.saleDetail_details?.is_swap : null;
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const isOwner = isAuthenticated && user?.id === ad?.user?.id;
    const dispatch = useDispatch();
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const limitedImages = ad?.images?.slice(0, 5) || [];
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        let initialX = null;
        let currentX = null;
        const sensitivityThreshold = 40;

        const handleMouseMove = (e) => {
            if (!swiperRef.current?.swiper) return;
            currentX = e.clientX;
            if (initialX === null) {
                initialX = currentX;
                return;
            }
            const diffX = currentX - initialX;
            if (Math.abs(diffX) > sensitivityThreshold) {
                if (diffX > 0) {
                    swiperRef.current.swiper.slidePrev();
                } else {
                    swiperRef.current.swiper.slideNext();
                }
                initialX = currentX;
            }
        };

        const handleMouseEnter = () => {
            initialX = null;
        };
        const handleMouseLeave = () => {
            initialX = null;
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const handleFavoriteToggle = (e) => {
        e.preventDefault();
        setLocalLoading(true);

        if (favorite) {
            dispatch(removeFavorite(ad?.id))
                .then(() => {
                    toastNotify("تمت إزالة الإعلان من المفضلة", "success");
                    setLocalLoading(false);
                })
                .catch(() => {
                    toastNotify("فشل في إزالة المفضلة", "error");
                    setLocalLoading(false);
                });
        } else {
            dispatch(addFavorite(ad?.id))
                .then(() => {
                    toastNotify("تمت إضافة الإعلان إلى المفضلة", "success");
                    setLocalLoading(false);
                })
                .catch(() => {
                    toastNotify("فشل في إضافة المفضلة", "error");
                    setLocalLoading(false);
                });
        }
    };

    const createMetaItem = (key, Icon, label, value) => (
        <SwiperSlide className="item" key={key}>
      <span
          style={{
              background: "linear-gradient(135deg, #ffe800 0%, #ffb800 100%)",
              boxShadow: "0 2px 6px rgba(255, 184, 0, 0.35)",
          }}
          className="p-2 text-dark rounded-2"
      >
        <Icon size={20} strokeWidth={1.5} />
      </span>
            <span className="d-flex flex-column">
        <span title={label} className="text-variant-3 fs-12">
          {window.innerWidth < 480
              ? label && label.length > 10
                  ? `${label.substring(0, 10)}...`
                  : label
              : label}
        </span>
        <span className="fw-6 fs-18 text-truncate" title={value}>
          {window.innerWidth > 480
              ? value && value.length > 8
                  ? `${value.substring(0, 8)}...`
                  : value
              : value.length > 6
                  ? `${value.substring(0, 6)}...`
                  : value}
        </span>
      </span>
        </SwiperSlide>
    );

    const metaItems = [];

    if (ad?.type === "sale" && isSwap !== null) {
        metaItems.push(
            createMetaItem(
                "swap",
                Exchange01Icon,
                "قابل للمقايضة",
                isSwap === 1 ? "نعم" : "لا"
            )
        );
    }

    if (ad?.category?.id === 1) {
        const squareMeters = ad?.landAdvertisement_details?.square_meters;
        if (squareMeters) {
            metaItems.push(
                createMetaItem(
                    "square_meters",
                    Triangle03Icon,
                    "المساحة",
                    `${Math.floor(squareMeters)} م²`
                )
            );
        }
    } else if (ad?.category?.id === 2) {
        const squareMeters = ad?.houseAdvertisement_details?.square_meters;
        const numberOfRooms = ad?.houseAdvertisement_details?.number_of_rooms;
        const numberOfBathrooms =
            ad?.houseAdvertisement_details?.number_of_bathrooms;

        if (squareMeters) {
            metaItems.push(
                createMetaItem(
                    "square_meters",
                    Triangle03Icon,
                    "المساحة",
                    `${Math.floor(squareMeters)} م²`
                )
            );
        }
        if (numberOfRooms) {
            metaItems.push(
                createMetaItem(
                    "number_of_rooms",
                    MeetingRoomIcon,
                    "عدد الغرف",
                    numberOfRooms
                )
            );
        }
        if (numberOfBathrooms) {
            metaItems.push(
                createMetaItem(
                    "number_of_bathrooms",
                    Bathtub02Icon,
                    "عدد الحمامات",
                    numberOfBathrooms
                )
            );
        }
    } else if ([3, 4, 5].includes(ad?.category?.id)) {
        const brand = ad?.vehicleAdvertisement_details?.brand?.name;
        const model = ad?.vehicleAdvertisement_details?.model?.name;
        const condition = ad?.vehicleAdvertisement_details?.condition;

        let BrandIcon;
        switch (ad?.category.id) {
            case 3:
                BrandIcon = Car03Icon;
                break;
            case 4:
                BrandIcon = FerryBoatIcon;
                break;
            case 5:
                BrandIcon = Motorbike02Icon;
                break;
            default:
                BrandIcon = null;
        }

        if (brand && BrandIcon) {
            metaItems.push(
                createMetaItem("brand", BrandIcon, "العلامة التجارية", brand)
            );
        }
        if (model) {
            metaItems.push(createMetaItem("model", CellsIcon, "الموديل", model));
        }
        if (condition) {
            const conditionText = condition === "NEW" ? "جديد" : "مستعمل";
            const ConditionIcon = condition === "NEW" ? StarsIcon : PackageOpenIcon;
            metaItems.push(
                createMetaItem("condition", ConditionIcon, "الحالة", conditionText)
            );
        }
    }

    return (
        <FeaturedCard $isOwner={isOwner} className="hover-card mb-4">
            {/* Decorative sparkles */}
            <Sparkle $top="8%" $left="6%" $delay="0s" />
            <Sparkle $top="15%" $left="92%" $delay="0.6s" />
            <Sparkle $top="55%" $left="3%" $delay="1.2s" />
            <Sparkle $top="78%" $left="95%" $delay="1.8s" />

            <InnerCard className="syria-souq-box">
                {/* Featured badge */}
                <FeaturedBadge>
                    <StarsIcon size={14} strokeWidth={2} />
                    <span>مميز</span>
                </FeaturedBadge>

                <div className="archive-top">
                    <Link
                        to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${
                            ad?.id
                        }/${ad?.slug}`}
                        target="_blank"
                        className="images-group"
                        ref={containerRef}
                    >
                        <Swiper
                            ref={swiperRef}
                            slidesPerView={1}
                            spaceBetween={0}
                            modules={[Pagination]}
                            className="mySwiper"
                            pagination={{ clickable: true }}
                            lazy={"true"}
                            nested={true}
                            onClick={(swiper, event) => {
                                event.stopPropagation();
                            }}
                            onTouchStart={(swiper, event) => {
                                event.stopPropagation();
                            }}
                        >
                            {limitedImages.map((image, index) => (
                                <SwiperSlide key={image.id || index} virtualIndex={index}>
                                    <img
                                        data-src={image?.url?.replace(
                                            "syr-souq.fra1.digitaloceanspaces.com",
                                            "syr-souq.fra1.cdn.digitaloceanspaces.com"
                                        )}
                                        alt={ad?.title}
                                        src={image?.url?.replace(
                                            "syr-souq.fra1.digitaloceanspaces.com",
                                            "syr-souq.fra1.cdn.digitaloceanspaces.com"
                                        )}
                                        className="swiper-lazy"
                                        style={{
                                            objectFit: "cover",
                                            aspectRatio: "16/9",
                                            width: "100%",
                                        }}
                                    />
                                    <div className="swiper-lazy-preloader"></div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {isOwner && (
                            <div className="top">
                                <ul className="d-flex w-100 gap-6">
                                    <li
                                        className="flag-tag text-dark px-4"
                                        style={{
                                            backgroundColor: "rgba(255, 255,255, 0.9)",
                                        }}
                                    >
                                        إعلاني
                                    </li>
                                </ul>
                            </div>
                        )}

                        {favorite && (
                            <Tooltip
                                placement="top"
                                title={favorite ? "إزالة من المفضلة" : "إضافة الى المفضلة"}
                            >
                <span
                    aria-disabled={localLoading ? true : false}
                    onClick={handleFavoriteToggle}
                    style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        zIndex: "4",
                        background: "rgba(255,255,255, 0.85)",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        cursor: "pointer",
                        backdropFilter: "blur(4px)",
                    }}
                    className="text-dark"
                >
                  {localLoading ? (
                      <OvalLoader />
                  ) : (
                      <FavouriteIcon
                          size={22}
                          color={favorite ? "#ff0000" : "inherit"}
                          fill={favorite ? "#ff0000" : "transparent"}
                      />
                  )}
                </span>
                            </Tooltip>
                        )}
                    </Link>
                </div>

                <div className="archive-bottom">
                    <div className="content-top">
                        <div className="d-flex flex-column gap-1 mb-4">
                            <h6>
                                <Link
                                    to={`/${getCategoryUrlName(ad?.category?.name)}/${
                                        ad?.type
                                    }/${ad?.id}/${ad?.slug}`}
                                    target="_blank"
                                    className="link fs-20"
                                    title={ad?.title}
                                    style={{
                                        maxWidth: "100%",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {ad?.title?.length > 35
                                        ? `${ad?.title?.substring(0, 35)}...`
                                        : ad?.title}
                                </Link>
                            </h6>
                            <span className="text-variant-1 d-flex gap-2 align-items-center">
                <span className="d-flex align-items-center gap-1">
                  <Location01Icon size={16} />
                  <p style={{ lineHeight: "0rem" }}>{cityLabel}</p>
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Clock01Icon size={16} />
                  <p style={{ lineHeight: "0rem" }}>
                    {getArabicTimeAgo(
                        ad?.activated_at || ad?.created_at || ad?.updated_at
                    )}
                  </p>
                </span>
              </span>
                        </div>

                        <ul className="meta-list">
                            <Swiper
                                slidesPerView={metaItems.length < 3 ? metaItems.length : 3}
                                spaceBetween={5}
                                breakpoints={{
                                    480: {
                                        slidesPerView:
                                            metaItems.length < 3 ? metaItems.length : 3,
                                    },
                                    0: {
                                        slidesPerView: 2,
                                    },
                                }}
                                loop={metaItems.length >= 4}
                                autoplay={
                                    metaItems.length >= 3
                                        ? { delay: 1500, disableOnInteraction: true }
                                        : false
                                }
                                modules={[Pagination, Autoplay]}
                                className="mySwiper"
                                centeredSlides={false}
                                nested={true}
                                onClick={(swiper, event) => {
                                    if (metaItems.length > 3) {
                                        event.stopPropagation();
                                    }
                                }}
                                onTouchStart={(swiper, event) => {
                                    if (metaItems.length > 3) {
                                        event.stopPropagation();
                                    }
                                }}
                            >
                                {metaItems}
                            </Swiper>
                        </ul>
                    </div>

                    <div className="content-bottom">
                        <div className="d-flex gap-8 align-items-center">
                            <div className="avatar bg-light avt-40 round d-flex align-items-center justify-content-center">
                                {ad?.user?.image ? (
                                    <img
                                        alt="avt"
                                        src={ad?.user?.image}
                                        width={34}
                                        height={34}
                                    />
                                ) : (
                                    <img
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            transform: "scale(1.3)",
                                        }}
                                        src="/images/no_profile.png"
                                        alt="No profile image"
                                    />
                                )}
                            </div>
                            <span>{ad?.user?.name}</span>
                        </div>

                        <PremiumPrice>
                            {Currencies.find((cur) => cur.value === ad?.currency)?.label ||
                                "$"}
                            {new Intl.NumberFormat("en-US").format(ad?.price)}{" "}
                            {ad?.type === "rent" && (
                                <span className="rent-period body-2">
                  /{" "}
                                    {getRentalPeriodLabel(
                                        ad?.rentDetail_details?.rental_period
                                    )}
                </span>
                            )}
                        </PremiumPrice>
                    </div>
                </div>
            </InnerCard>
        </FeaturedCard>
    );
};

export default RenderFeaturedAd;