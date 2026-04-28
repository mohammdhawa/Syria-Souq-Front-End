import { adTypes, Categories_v2 } from "@/data/General";
import { Button, Dropdown, Image, Tag, Tooltip } from "antd";
import { getCategoryUrlName } from "@/utils/categoryMapping";
import {
  CancelCircleHalfDotIcon,
  Delete01Icon,
  FlashIcon,
  FlashOffIcon,
  Link04Icon,
  MenuSquareIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PencilEdit02Icon,
  Settings01Icon,
  SlidersHorizontalIcon,
  Tick02Icon,
  Time04Icon,
  ViewIcon,
} from "hugeicons-react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

export const getAdTypeLabel = (type) => {
  const adType = adTypes.find((item) => item.value === type);
  return adType ? adType.label : type;
};
export const getCategoryLabel = (categoryId) => {
  const category = Categories_v2.find((item) => item.value === categoryId);
  return category ? category.label : categoryId;
};

export const getCategoryIcon = (categoryId) => {
  const category = Categories_v2.find((item) => item.value === categoryId);
  return category ? category.icon : MenuSquareIcon;
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

export const getStatusIcon = (status, size = 14) => {
  switch (status) {
    case "pending":
      return <Time04Icon className="me-1" size={size} />;
    case "accepted":
      return <Tick02Icon className="me-1" size={size} />;
    case "rejected":
      return <CancelCircleHalfDotIcon className="me-1" size={size} />;
    case "active":
      return <FlashIcon className="me-1" size={size} />;
    case "inactive":
      return <FlashOffIcon className="me-1" size={size} />;
    default:
      return null;
  }
};

export const columns = (
  handleDeleteModalOpen,
  handleChangeStatusModal,
  navigate,
  handlePurchasePremiumModalOpen
) => {
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
          onClick: () => handleChangeStatusModal(ad),
        },
        ad?.ads_status === "accepted" && {
          key: "premium",
          label: "ترقية لمميز",
          icon: <FlashIcon size={16} />,
          onClick: () => handlePurchasePremiumModalOpen(ad),
        },
        {
          key: "4",
          label: "حذف",
          icon: <Delete01Icon size={16} />,
          danger: true,
          onClick: () => {
            handleDeleteModalOpen(ad?.id);
          },
        },
      ],
    };
  };
  return [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 60,
      render: (text, record) =>
        record?.ads_status === "accepted" &&
          record?.active_status === "active" ? (
          <Tooltip title={"عرض صفحة الإعلان"}>
            <Link
              to={`/${getCategoryUrlName(record.category.name)}/${record.type}/${record.id}/${record.slug}`}
            >
              {text}
            </Link>
          </Tooltip>
        ) : (
          <Tooltip title={"غير مدرج"}>{text}</Tooltip>
        ),
    },
    {
      title: "",
      dataIndex: "images",
      key: "image",
      width: 100,
      center: true,
      responsive: ["lg"],
      align: "center",
      render: (images) => {
        if (images && images.length > 0) {
          return (
            <Image.PreviewGroup>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Image
                  loading="lazy"
                  src={images[0].url}
                  alt="advertisement"
                  width={50}
                  height={50}
                  style={{ objectFit: "cover" }}
                  className="rounded-2"
                />
                {images.slice(1).map((image, index) => (
                  <div key={index} style={{ display: "none" }}>
                    <Image
                      src={image.url.replace(
                        "syr-souq.fra1.digitaloceanspaces.com",
                        "syr-souq.fra1.cdn.digitaloceanspaces.com"
                      )}
                      alt={`advertisement-${index + 2}`}
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          );
        }
        return null;
      },
    },
    {
      title: "العنوان",
      dataIndex: "title",
      key: "title",
      ellipsis: {
        showTitle: false,
      },
      width: 140,
      render: (title) => (
        <Tooltip title={title.length > 20 ? title : ""}>
          {title && title.length > 20 ? `${title.substring(0, 20)}...` : title}
        </Tooltip>
      ),
    },
    {
      title: "السعر",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${Number(price).toLocaleString()}`,
      responsive: ["xl"],
      align: "center",
    },
    {
      title: "نوع العقد",
      dataIndex: "type",
      key: "type",
      render: (type) => getAdTypeLabel(type),
      responsive: ["xl"],
      align: "center",
    },
    {
      title: "الحالة",
      dataIndex: "ads_status",
      key: "ads_status",
      render: (status) => (
        <Tag className="status-tag-myad" color={getStatusColor(status)}>
          {getStatusIcon(status)}
          {statusTranslations[status] || status}
        </Tag>
      ),
      responsive: ["xxl"],
      align: "center",
    },
    {
      title: "النشاط",
      dataIndex: "active_status",
      key: "active_status",
      render: (text, record) => (
        <Tooltip
          title={
            record.active_status === "active" &&
            `${moment(record.activated_at).format("DD/MM/YYYY - HH:mm")}`
          }
        >
          <Tag
            className="status-tag-myad"
            style={
              record.active_status === "inactive" && {
                color: "#1e1e1e",
              }
            }
            color={getStatusColor(record.active_status)}
          >
            {getStatusIcon(record.active_status)}
            {statusTranslations[record.active_status] || record.active_status}
          </Tag>
        </Tooltip>
      ),
      responsive: ["lg"],
      align: "center",
    },
    {
      title: "الفئة",
      dataIndex: "category",
      key: "category",
      render: (category) => getCategoryLabel(category?.id),
      responsive: ["xxl"],
      align: "center",
    },
    {
      title: "تاريخ الإنشاء",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => moment(date).format("DD/MM/YYYY - HH:mm"),
      responsive: ["xxl"],
      align: "center",
    },
    {
      title: "الاجراءات",
      key: "ad_actions",
      align: "center",
      width: 250,
      render: (record) => (
        <div className="d-flex align-items-center justify-content-center gap-2 h-100 actions-step">
          {/* {record?.ads_status === "accepted" && (
            <Tooltip title={"تغيير حالة الإعلان"}>
              <Button
                onClick={() => {
                  handleChangeStatusModal(record);
                }}
                variant="filled"
                color="green"
              >
                <SlidersHorizontalIcon size={16} />
              </Button>
            </Tooltip>
          )}
          <Tooltip title={"تفاصيل الإعلان"}>
            <Button
              onClick={() => {
                window.open(`my-advertisements/${record?.id}/${record?.slug}`);
              }}
              variant="filled"
              color="blue"
            >
              <ViewIcon size={16} />
            </Button>
          </Tooltip>

          <Tooltip color="red" title={"حذف الإعلان"}>
            <Button
              onClick={() => {
                handleDeleteModalOpen(record.id);
              }}
              variant="filled"
              color="danger"
            >
              <Delete01Icon size={16} />
            </Button>
          </Tooltip> */}

          <Dropdown trigger={["click"]} menu={getMenuItems(record)}>
            <button className="btn border">
              <Settings01Icon size={16} />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];
};
