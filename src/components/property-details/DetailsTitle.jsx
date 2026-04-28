import React, { useState, useEffect } from "react";
import { Currencies, SyriaCities } from "@/data/General";
import {
  Calendar03Icon,
  FavouriteIcon,
  Location01Icon,
  WhatsappIcon,
  Facebook02Icon,
  TelegramIcon,
  Share01Icon,
  Copy01Icon,
  Flag02Icon,
  Delete01Icon,
  PencilEdit02Icon,
} from "hugeicons-react";
import { Dropdown, Tooltip } from "antd";
import moment from "moment-timezone";
import toastNotify from "@/utils/toast";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "@/redux/actions/favoritesActions";
import { getRentalPeriodLabel } from "@/utils/getRentalPeriodLabel";
import OvalLoader from "../OvalLoader";
import LoginRequireModal from "@/components/modals/LoginRequireModal";
import ReportModal from "@/components/modals/ReportModal";
import { useNavigate } from "react-router-dom";

const DetailsTitle = ({ ad, openDeleteModal }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { favorites, loading, changeFavoriteLoading } = useSelector(
    (state) => state.favorites
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const isOwner = isAuthenticated && user?.id === ad?.user?.id;

  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [warningText, setWarningText] = useState("");
  const currencySymbol =
    Currencies.find((c) => c.value === ad?.currency)?.label || "$";

  const cityData = SyriaCities.find((city) => city.value === ad?.city);
  const arabicCity = cityData ? cityData.label : ad?.city;

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(
    `${ad?.title} - تحقق من هذا! ${shareUrl}`
  );

  useEffect(() => {
    if (ad?.id && favorites) {
      const isFav = favorites.some((fav) => fav.advs_id === ad?.id);
      setIsFavorite(isFav);
    }
  }, [favorites, ad?.id]);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setWarningText(
        "تسجيل الدخول يتيح لك الوصول إلى ميزات مخصصة مثل حفظ الإعلانات"
      );
      setOpenWarningModal(true);
      return;
    }

    if (isFavorite) {
      dispatch(removeFavorite(ad?.id))
        .then(() => {
          toastNotify("تمت إزالة الإعلان من المفضلة", "success");
        })
        .catch(() => {
          toastNotify("فشل في إزالة المفضلة", "error");
        });
    } else {
      dispatch(addFavorite(ad?.id))
        .then(() => {
          toastNotify("تمت إضافة الإعلان إلى المفضلة", "success");
        })
        .catch(() => {
          toastNotify("فشل في إضافة المفضلة", "error");
        });
    }
  };
  const handleReportToggle = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setWarningText(
        "تسجيل الدخول يساعدنا على متابعة البلاغات بشكل أكثر فعالية"
      );
      setOpenWarningModal(true);
      return;
    } else if (isReported) {
      toastNotify("لقد قمت بالإبلاغ هذا الإعلان للتو", "info");
      return;
    }
    setOpenReportModal(true);
  };

  const shareMenuItems = [
    {
      key: "whatsapp",
      label: (
        <a
          className="py-2 px-2"
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappIcon size={22} color="#25D366" />
        </a>
      ),
    },
    {
      key: "facebook",
      label: (
        <a
          className="py-2 px-2"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook02Icon size={22} color="#1877F2" />
        </a>
      ),
    },
    {
      key: "telegram",
      label: (
        <a
          className="py-2 px-2"
          href={`https://t.me/share/url?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(ad?.title)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon size={22} color="#0088CC" />
        </a>
      ),
    },
    {
      key: "instagram",
      label: (
        <a
          className="py-2 px-2"
          onClick={() => {
            navigator.clipboard.writeText(`${ad?.title} - ${shareUrl}`);
            toastNotify("تم نسخ الرابط بنجاح", "success");
          }}
        >
          <Copy01Icon size={22} />
        </a>
      ),
    },
  ];

  return (
    <div className="flat-section-v4 pb-4">
      <div className="container">
        <div className="header-property-detail">
          <div className="d-flex">
            {isOwner && <p className="myad-badge fs-6 mb-2 ">إعلاني</p>}
          </div>
          <div className="content-top d-flex justify-content-between align-items-center">
            <h3
              style={{
                maxWidth: "70% !important",
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
              className="title link fw-8"
            >
              {ad?.title}
            </h3>
            <div className="box-price d-flex align-items-end gap-2">
              <h3 style={{ lineHeight: "0" }} className="fw-8">
                {currencySymbol}
                {new Intl.NumberFormat("en-US").format(ad?.price)}
              </h3>
              {ad?.type === "rent" && (
                <span
                  className="body-1 text-variant-1"
                  style={{ lineHeight: "0" }}
                >
                  /{" "}
                  {getRentalPeriodLabel(ad?.rentDetail_details?.rental_period)}
                </span>
              )}
            </div>
          </div>
          <div className="content-bottom">
            <div className="box-left">
              <div className="info-box">
                <div className="label mb-0">تاريخ النشر</div>
                <ul className="meta">
                  <li className="meta-item text-variant-1 d-flex align-items-center">
                    <Calendar03Icon size={16} />
                    <span
                      style={{ lineHeight: "auto" }}
                      className="fs-6 text-middle mt-4"
                    >
                      {moment(ad?.activated_at)
                        .tz("Europe/Istanbul")
                        .format("DD/MM/YYYY")}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="info-box">
                <div className="label mb-0">المدينة</div>
                <ul className="meta">
                  <li className="meta-item text-variant-1 d-flex align-items-center">
                    <Location01Icon size={16} />
                    <span
                      style={{ lineHeight: "auto" }}
                      className="fs-6 text-middle"
                    >
                      {arabicCity}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <ul className="icon-box gap-2">
              {!isOwner ? (
                <>
                  <li>
                    <Tooltip placement="top" title="إبلاغ">
                      <a
                        className="item report-item"
                        onClick={handleReportToggle}
                      >
                        <Flag02Icon />
                      </a>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip
                      placement="top"
                      title={
                        isFavorite ? "إزالة من المفضلة" : "إضافة الى المفضلة"
                      }
                    >
                      <a
                        aria-disabled={changeFavoriteLoading ? true : false}
                        className="item favorite-item"
                        onClick={handleFavoriteToggle}
                      >
                        {changeFavoriteLoading ? (
                          <OvalLoader />
                        ) : (
                          <FavouriteIcon
                            color={
                              isFavorite && isAuthenticated
                                ? "#ff0000"
                                : "inherit"
                            }
                            fill={
                              isFavorite && isAuthenticated
                                ? "#ff0000"
                                : "transparent"
                            }
                          />
                        )}
                      </a>
                    </Tooltip>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Tooltip placement="top" title="حذف الإعلان">
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          openDeleteModal();
                        }}
                        className="item delete-item"
                      >
                        <Delete01Icon />
                      </a>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip placement="top" title="تعديل الإعلان">
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(
                            `/dashboard/my-advertisements/${ad?.id}/${ad?.slug}`
                          );
                        }}
                        className="item edit-item"
                      >
                        <PencilEdit02Icon />
                      </a>
                    </Tooltip>
                  </li>
                </>
              )}
              <li>
                <Tooltip placement="top" title="مشاركة">
                  <Dropdown
                    menu={{ items: shareMenuItems, className: "d-flex" }}
                    arrow
                    trigger={["click"]}
                  >
                    <a
                      className="item share-item"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Share01Icon />
                    </a>
                  </Dropdown>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <LoginRequireModal
        open={openWarningModal}
        close={() => {
          setOpenWarningModal(false);
        }}
        actionName={warningText}
      />
      <ReportModal
        open={openReportModal}
        close={() => {
          setOpenReportModal(false);
        }}
        report={setIsReported}
        adId={ad?.id}
        favorite={isFavorite}
      />
    </div>
  );
};
export default DetailsTitle;
