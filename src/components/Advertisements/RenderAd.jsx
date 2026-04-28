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
import { LuUserRound } from "react-icons/lu";
import { getRentalPeriodLabel } from "@/utils/getRentalPeriodLabel";
import { getArabicTimeAgo } from "@/utils/getArabicTimeAgo";
import { getCategoryUrlName } from "@/utils/categoryMapping";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "@/redux/actions/favoritesActions";
import toastNotify from "@/utils/toast";
import OvalLoader from "../OvalLoader";

const RenderAd = ({ ad, favorite = false }) => {
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
        style={{ background: "#ffe800" }}
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
    <div
      style={{
        border: isOwner ? "2px solid #ffe800" : "",
      }}
      className="syria-souq-box hover-card"
    >
      <div className="archive-top ">
        <Link
          to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`}
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

          <div className="top">
            <ul className="d-flex w-100 gap-6">
              <li className="flag-tag primary text-black px-4">
                {ad?.type === "sale" ? "للبيع" : "للإيجار"}
              </li>
              {isOwner && (
                <li
                  className="flag-tag text-dark px-4"
                  style={{ backgroundColor: "rgba(255, 255,255, 0.9)" }}
                >
                  إعلاني
                </li>
              )}
            </ul>
          </div>
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
                  background: "rgba(255,255,255, 0.8)",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  cursor: "pointer",
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
                to={`/${getCategoryUrlName(ad?.category?.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`}
                target="_blank"
                className="link fs-20 "
                title={ad?.title}
                style={{
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  textOverflow: "ellipsis",
                }}
              >
                {ad?.title?.length > 40
                  ? `${ad?.title?.substring(0, 40)}...`
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
                  {getArabicTimeAgo(ad?.activated_at || ad?.created_at || ad?.updated_at)}
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
                  slidesPerView: metaItems.length < 3 ? metaItems.length : 3,
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
                <img alt="avt" src={ad?.user?.image} width={34} height={34} />
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
          <h5
            style={{
              borderRadius: "0rem 1rem",
            }}
            className="price fw-6 px-4 py-2 bg-dark text-light"
          >
            {Currencies.find((cur) => cur.value === ad?.currency)?.label || "$"}
            {new Intl.NumberFormat("en-US").format(ad?.price)}{" "}
            <span>
              {ad?.type === "rent" && (
                <span
                  className="body-2 text-variant-2"
                  style={{ lineHeight: "0" }}
                >
                  /{" "}
                  {getRentalPeriodLabel(ad?.rentDetail_details?.rental_period)}
                </span>
              )}
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default RenderAd;
