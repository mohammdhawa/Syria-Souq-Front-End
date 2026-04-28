import React from "react";
import {
  CancelCircleHalfDotIcon,
  Clock01Icon,
  Delete01Icon,
  FlashIcon,
  FlashOffIcon,
  Link04Icon,
  MoreVerticalIcon,
  PencilEdit02Icon,
  SlidersHorizontalIcon,
  Tick02Icon,
  Time04Icon,
  ViewIcon,
} from "hugeicons-react";
import { Dropdown, Empty, Tag, Tooltip } from "antd";
import moment from "moment-timezone";
import { adTypes, Categories_v2 } from "@/data/General";
import OvalLoader from "@/components/OvalLoader";
import { useNavigate } from "react-router-dom";
import { getCategoryUrlName } from "@/utils/categoryMapping";
export const getAdTypeLabel = (type) => {
  const adType = adTypes.find((item) => item.value === type);
  return adType ? adType.label : type;
};
export const getCategoryLabel = (categoryId) => {
  const category = Categories_v2.find((item) => item.value === categoryId);
  return category ? category.label : categoryId;
};
export const getStatusColor = (status) => {
  switch (status) {
    case "accepted":
      return "green";
    case "active":
      return "purple";
    case "rejected":
      return "red";
    case "inactive":
      return "gray-2";
    case "pending":
      return "gold";
    default:
      return "default";
  }
};

export const statusTranslations = {
  accepted: "مقبول",
  active: "نشط",
  rejected: "مرفوض",
  inactive: "غير نشط",
  pending: "قيد المراجعة",
};

export const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <Time04Icon className="me-1" size={14} />;
    case "accepted":
      return <Tick02Icon className="me-1" size={14} />;
    case "rejected":
      return <CancelCircleHalfDotIcon className="me-1" size={14} />;
    case "active":
      return <FlashIcon className="me-1" size={14} />;
    case "inactive":
      return <FlashOffIcon className="me-1" size={14} />;
    default:
      return null;
  }
};
const AdGallery = ({ advertisements, loading, deletModal, statusModal }) => {
  const navigate = useNavigate();
  const getMenuItems = (ad) => {
    return {
      items: [
        {
          key: "1",
          label: "التفاصيل",
          icon: <ViewIcon size={16} />,
          onClick: () => {
            navigate(`/dashboard/my-advertisements/${ad?.id}/${ad?.slug}`);
          },
        },
        ad?.ads_status === "accepted" &&
          ad?.active_status === "active" && {
            key: "3",
            label: "صفحة الإعلان",
            icon: <Link04Icon size={16} />,
            onClick: () => {
              navigate(
                `/${getCategoryUrlName(ad?.category.name)}/${ad?.type}/${ad?.id}/${ad?.slug}`
              );
            },
          },
        ad?.ads_status === "accepted" && {
          key: "2",
          label: "تغيير الحالة",
          icon: <SlidersHorizontalIcon size={16} />,
          onClick: () => statusModal(ad),
        },
        {
          key: "4",
          label: "حذف",
          icon: <Delete01Icon size={16} />,
          danger: true,
          onClick: () => {
            deletModal(ad?.id);
          },
        },
      ],
    };
  };
  return (
    <div className="adgallery-container card-view-step">
      {loading && (
        <div className="adgallery-loader-container">
          <OvalLoader primary="#ffe800" />
        </div>
      )}
      {advertisements.length > 0 ? (
        <div className="adgallery-grid">
          {advertisements.map((ad) => (
            <div key={ad.id} className="adgallery-card">
              <div className="adgallery-image-container">
                <img
                  alt="Property"
                  src={ad?.images[0]?.url.replace(
                    "syr-souq.fra1.digitaloceanspaces.com",
                    "syr-souq.fra1.cdn.digitaloceanspaces.com"
                  )}
                  className="adgallery-image"
                />
                <div className="adgallery-tag-container">
                  <span
                    className={
                      ad?.type === "sale"
                        ? "adgallery-sale-tag"
                        : "adgallery-rent-tag"
                    }
                  >
                    {ad?.type === "sale" ? "للبيع" : "للإيجار"}
                  </span>
                </div>
              </div>
              <div className="adgallery-content">
                <div className="adgallery-header-section">
                  <h3 className="adgallery-title d-flex align-items-center justify-content-between">
                    <Tooltip title={ad?.title}>
                      {ad?.title?.length > 20
                        ? `${ad?.title?.substring(0, 20)}...`
                        : ad?.title}
                    </Tooltip>
                    <div className="adgallery-header-more more-options-step">
                      <Tooltip title={"الاجراءات"}>
                        <Dropdown trigger={["click"]} menu={getMenuItems(ad)}>
                          <MoreVerticalIcon size={24} />
                        </Dropdown>
                      </Tooltip>
                    </div>
                  </h3>

                  <div className="adgallery-info-container mt-1">
                    <div className="adgallery-info-item">
                      <Clock01Icon size={16} />
                      <span className="adgallery-info-text">
                        {moment(ad?.created_at).format("DD/MM/YYYY - HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="adgallery-footer">
                  <div className="adgallery-price-container">
                    <span className="adgallery-price">
                      ${new Intl.NumberFormat("en-US").format(ad?.price)}
                    </span>
                  </div>
                  <div className="adgallery-footer-tags">
                    <Tooltip
                      title={
                        ad?.active_status === "active" &&
                        `${moment(ad?.activated_at).format(
                          "DD/MM/YYYY - HH:mm"
                        )}`
                      }
                    >
                      <Tag
                        className="status-tag-myad"
                        style={
                          ad?.active_status === "inactive" && {
                            color: "#1e1e1e",
                          }
                        }
                        color={getStatusColor(ad?.active_status)}
                      >
                        {getStatusIcon(ad?.active_status)}
                        {statusTranslations[ad?.active_status] ||
                          ad?.active_status}
                      </Tag>
                    </Tooltip>
                    <Tag
                      className="status-tag-myad"
                      color={getStatusColor(ad?.ads_status)}
                    >
                      {getStatusIcon(ad?.ads_status)}
                      {statusTranslations[ad?.ads_status] || ad?.ads_status}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          style={{ padding: "4rem" }}
          description="لا توجد إعلانات متطابقة مع البحث"
        />
      )}
    </div>
  );
};

export default AdGallery;
