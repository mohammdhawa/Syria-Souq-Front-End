import MetaComponent from "@/components/common/MetaComponent";
import ComponentLoader from "@/components/ComponentLoader";
import { fetchMyAdvertisements } from "@/redux/actions/myAdvertisementsActions";
import {
  Alert,
  Breadcrumb,
  Col,
  ConfigProvider,
  Divider,
  Empty,
  Pagination,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
  Tour,
} from "antd";
import {
  Add01Icon,
  Alert01Icon,
  Clock01Icon,
  FlashIcon,
  GridViewIcon,
  HelpCircleIcon,
  HelpSquareIcon,
  ListViewIcon,
  Megaphone01Icon,
} from "hugeicons-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { columns } from "./MyAdvertisementsColumns";
import arEG from "antd/locale/ar_EG";
import OvalLoader from "@/components/OvalLoader";
import DeleteAdModal from "./DeleteAdModal";
import styled from "styled-components";
import AdGallery from "./AdGallery";
import {
  adsAvtiveTypes,
  adsStatusTypes,
  adTypes,
  Categories,
} from "@/data/General";
import ChangeAdStatusModal from "../../components/modals/ChangeAdStatusModal";
import { useTour } from "@reactour/tour";
import PurchasePremiumAdModal from "../../components/modals/PurchasePremiumAdModal";

const itemsoptions = [
  {
    value: 5,
    label: "5",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
];

const StyledSelect = styled(Select)`
  width: 100% !important;
  height: 3rem !important;
  color: black !important;
  .ant-select-selector {
    border-radius: 0.6rem !important;
    padding-left: 2rem !important;
    padding-right: 2rem !important;
    font-size: 1rem !important;
  }
  .ant-select-arrow {
    color: black !important;
    margin-left: 1rem;
  }
  .ant-select-clear {
    margin-left: 1rem;
  }
  .ant-select-selection-placeholder {
    color: black !important;
    opacity: 0.6 !important;
  }
`;

const MyAdvertisementsPage = () => {
  const { advertisements, pagination, stats, loading } = useSelector(
    (state) => state.myAdvertisements
  );
  const navigate = useNavigate();
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const dispatch = useDispatch();
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [willBeDelete, setWillBeDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [adType, setAdType] = useState(null);
  const [category, setCategory] = useState(null);
  const [adsStatus, setAdsStatus] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1350);
  const [openChangeStatusModal, setOpenChangeStatusModal] = useState(false);
  const [willBeChangeStatus, setWillBeChangeStatus] = useState(null);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [willBePurchase, setWillBePurchase] = useState(null);
  const filterRowRef = useRef(null);
  const isFilterChange = useRef(false);

  const checkScreenWidth = () => {
    const isLarge = window.innerWidth >= 1350;
    setIsLargeScreen(isLarge);
    if (!isLarge && viewMode === "table") {
      setViewMode("card");
    }
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  useEffect(() => {
    dispatch(
      fetchMyAdvertisements(
        currentPage,
        itemsPerPage,
        activeStatus,
        adsStatus,
        category,
        adType
      )
    )
      .then(() => {
        setInitialLoading(false);
        isFilterChange.current = false;
      })
      .catch(() => {
        setInitialLoading(false);
        isFilterChange.current = false;
      });
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    viewMode,
    activeStatus,
    adsStatus,
    category,
    adType,
  ]);

  const handleFilterChange = (type, value) => {
    isFilterChange.current = true;
    switch (type) {
      case "itemsPerPage":
        setItemsPerPage(value);
        break;
      case "adType":
        setAdType(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "adsStatus":
        setAdsStatus(value);
        break;
      case "activeStatus":
        setActiveStatus(value);
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  const handleDeleteSuccess = () => {
    if (advertisements.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    dispatch(
      fetchMyAdvertisements(
        currentPage,
        itemsPerPage,
        activeStatus,
        adsStatus,
        category,
        adType
      )
    );
  };

  useEffect(() => {
    if (window.innerWidth > 768) {
      window.scroll({ top: 0, behavior: "smooth" });
    } else if (filterRowRef.current && window.innerWidth < 768) {
      const element = filterRowRef.current;
      const rect = element.getBoundingClientRect();
      const extraSpace = 6 * 16;
      const scrollPosition = window.scrollY + rect.top - extraSpace;
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  const handleDeleteModalOpen = (adId) => {
    setWillBeDelete(adId);
    setOpenDeleteModal(true);
  };

  const handleChangeStatusModal = (ad) => {
    setWillBeChangeStatus(ad);
    setOpenChangeStatusModal(true);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setWillBeDelete(null);
  };

  const handleChangeStatusModalClose = () => {
    setOpenChangeStatusModal(false);
    setWillBeChangeStatus(null);
  };

  const handlePurchasePremiumModalOpen = (ad) => {
    setWillBePurchase(ad);
    setOpenPurchaseModal(true);
  };

  const handlePurchasePremiumModalClose = () => {
    setOpenPurchaseModal(false);
    setWillBePurchase(null);
  };

  const handleChange = (page) => {
    setCurrentPage(page);
  };

  const handlePublishAd = () => {
    navigate("/publish-ad");
  };

  const tableColumns = columns(
    handleDeleteModalOpen,
    handleChangeStatusModal,
    navigate,
    handlePurchasePremiumModalOpen
  );

  useEffect(() => {
    const steps = [
      {
        selector: ".status-step",
        content: (
          <div>
            <h6>إحصائيات الإعلانات</h6>
            <p className="fs-6 mt-1">
              تعرض لك نظرة سريعة على حالة إعلاناتك مثل عدد الإعلانات النشطة.
            </p>
          </div>
        ),
      },
      {
        selector: ".filters-step",
        content: (
          <div>
            <h6>الفلاتر</h6>
            <p className="fs-6 mt-1">
              استخدم الفلاتر لتصفية إعلاناتك والوصول السريع لما تبحث عنه.
            </p>
          </div>
        ),
      },
      ...(isLargeScreen
        ? [
          {
            selector: ".view-mode-step",
            content: (
              <div>
                <h6>طريقة العرض</h6>
                <p className="fs-6 mt-1">
                  يمكنك اختيار عرض الإعلانات على شكل جدول أو كروت حسب تفضيلك.
                </p>
              </div>
            ),
          },
        ]
        : []),
      {
        selector: ".page-size-step",
        content: (
          <div>
            <h6>عدد العناصر في الصفحة</h6>
            <p className="fs-6 mt-1">
              اختر عدد الإعلانات المعروضة في كل صفحة، مثل 5 أو 10.
            </p>
          </div>
        ),
      },
      ...(viewMode === "table"
        ? [
          {
            selector: ".table-view-step",
            content: (
              <div>
                <h6>عرض الجدول</h6>
                <p className="fs-6 mt-1">
                  يعرض الإعلانات بشكل منظم مع تفاصيل أكثر لكل إعلان.
                </p>
              </div>
            ),
          },
          {
            selector: ".actions-step",
            content: (
              <div>
                <h6>التحكم بالإعلانات</h6>
                <p className="fs-6 mt-1">
                  قم بتعديل، حذف أو تغيير حالة الإعلان بسهولة من هنا.
                </p>
              </div>
            ),
          },
        ]
        : []),
      ...(viewMode === "card"
        ? [
          {
            selector: ".card-view-step",
            content: (
              <div>
                <h6>عرض الكروت</h6>
                <p className="fs-6 mt-1">
                  طريقة عرض مناسبة للشاشات الصغيرة، تعرض أهم تفاصيل الإعلان.
                </p>
              </div>
            ),
          },
          {
            selector: ".more-options-step",
            content: (
              <div>
                <h6>خيارات إضافية</h6>
                <p className="fs-6 mt-1">
                  اضغط على أيقونة الثلاث نقاط للوصول إلى إعدادات إضافية
                  للإعلان.
                </p>
              </div>
            ),
          },
        ]
        : []),
      {
        selector: ".pagination-step",
        content: (
          <div>
            <h6>التنقل بين الصفحات</h6>
            <p className="fs-6 mt-1">
              استخدم أزرار التنقل للانتقال بين صفحات الإعلانات بسهولة.
            </p>
          </div>
        ),
      },
    ];

    setSteps(steps);
  }, [advertisements, viewMode]);

  const metadata = {
    title: `Syria Souq | إعلاناتي`,
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      {initialLoading ? (
        <ComponentLoader />
      ) : (
        <>
          <div className="w-100 mb-4 d-flex align-items-center justify-content-between myads-page-header gap-3">
            <div className="d-flex align-items-start flex-column">
              <span className="fs-4 fw-bold mb-1">إعلانــاتـــي</span>
              <Breadcrumb
                items={[{ title: "لوحة التحكم" }, { title: "إعلاناتي" }]}
              />
            </div>

            {stats.total_count > 0 && (
              <div className="d-flex gap-3 align-items-center myads-header">
                <Tooltip title={"ابدأ رحلة التعرف على صفحة إعلاناتي"}>
                  <span
                    onClick={() => {
                      setCurrentStep(0);
                      setIsOpen(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <HelpCircleIcon size={24} />
                  </span>
                </Tooltip>
                <button
                  onClick={handlePublishAd}
                  className="tf-btn d-flex align-items-center gap-2 justify-content-center primary text-dark"
                >
                  <Add01Icon />
                  <p>إعلان جديد</p>
                </button>
              </div>
            )}
          </div>

          {stats.total_count > 0 ? (
            <>
              <Alert
                type="info"
                message={
                  "أي تعديل أو تغيير في حالة الإعلان بعد الموافقة يُخضعه للمراجعة من جديد"
                }
                showIcon
                closable
                className="mb-3"
              />
              <div className="mb-3 statistic-cards-container status-step">
                <div className="static-card-my-ad border count-card" sm={6}>
                  <div className="static-card-icon">
                    <Megaphone01Icon size={80} />
                  </div>
                  <div className="static-card-title">
                    <span className="text-variant-1">عدد الإعلانات</span>
                    <p className="fs-1 m-0">{stats.total_count}</p>
                  </div>
                </div>
                <div className="static-card-my-ad border active-card" sm={6}>
                  <div className="static-card-icon">
                    <FlashIcon size={80} />
                  </div>
                  <div className="static-card-title">
                    <span className="text-variant-1">الإعلانات النشطة</span>
                    <p className="fs-1 m-0">{stats.accepted_active_count}</p>
                  </div>
                </div>
                <div className="static-card-my-ad border pending-card" sm={6}>
                  <div className="static-card-icon">
                    <Clock01Icon size={80} />
                  </div>
                  <div className="static-card-title">
                    <span className="text-variant-1">
                      الإعلانات قيد المراجعة
                    </span>
                    <p className="fs-1 m-0">{stats.pending_count}</p>
                  </div>
                </div>
                <div className="static-card-my-ad border rejected-card" sm={6}>
                  <div className="static-card-icon">
                    <Alert01Icon size={80} />
                  </div>
                  <div className="static-card-title">
                    <span className="text-variant-1">الإعلانات المرفوضة</span>
                    <p className="fs-1 m-0"> {stats.rejected_count}</p>
                  </div>
                </div>
              </div>
              <Divider />

              <Row
                ref={filterRowRef}
                justify={"space-between"}
                className="mb-4 "
                gutter={[16, 16]}
              >
                <Col className="filters-step" xs={24} xxl={16}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12} lg={12} xl={6}>
                      <StyledSelect
                        dropdownRender={(menu) => (
                          <div
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              scrollbarWidth: "none",
                            }}
                          >
                            {menu}
                          </div>
                        )}
                        value={category}
                        placeholder={"اختر الفئة"}
                        allowClear
                        style={{ width: "100%" }}
                        options={Categories}
                        onChange={(value) =>
                          handleFilterChange("category", value)
                        }
                      />
                    </Col>
                    <Col xs={24} md={12} lg={12} xl={6}>
                      <StyledSelect
                        dropdownRender={(menu) => (
                          <div
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              scrollbarWidth: "none",
                            }}
                          >
                            {menu}
                          </div>
                        )}
                        value={adType}
                        placeholder={"اختر نوع العقد"}
                        allowClear
                        style={{ width: "100%" }}
                        options={adTypes}
                        onChange={(value) =>
                          handleFilterChange("adType", value)
                        }
                      />
                    </Col>
                    <Col xs={24} md={12} lg={12} xl={6}>
                      <StyledSelect
                        dropdownRender={(menu) => (
                          <div
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              scrollbarWidth: "none",
                            }}
                          >
                            {menu}
                          </div>
                        )}
                        value={adsStatus}
                        placeholder={"اختر حالة الإعلان"}
                        allowClear
                        style={{ width: "100%" }}
                        options={adsStatusTypes}
                        onChange={(value) => {
                          handleFilterChange("adsStatus", value);
                          handleFilterChange("activeStatus", null);
                        }}
                      />
                    </Col>

                    <Col xs={24} md={12} lg={12} xl={6}>
                      <Tooltip
                        title={
                          adsStatus !== "accepted"
                            ? "متاح فقط للإعلانات المقبولة"
                            : ""
                        }
                      >
                        <StyledSelect
                          dropdownRender={(menu) => (
                            <div
                              onWheel={(e) => e.stopPropagation()}
                              onTouchMove={(e) => {
                                e.stopPropagation();
                              }}
                              style={{
                                maxHeight: "200px",
                                overflowY: "auto",
                                scrollbarWidth: "none",
                              }}
                            >
                              {menu}
                            </div>
                          )}
                          value={activeStatus}
                          placeholder={"اختر حالة النشاط"}
                          allowClear
                          style={{ width: "100%" }}
                          options={adsAvtiveTypes}
                          onChange={(value) =>
                            handleFilterChange("activeStatus", value)
                          }
                          disabled={adsStatus !== "accepted"}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} xxl={8}>
                  <Row gutter={[16, 16]} justify={"end"}>
                    {isLargeScreen && (
                      <Col className="view-mode-step">
                        <Radio.Group
                          className="view-mode-myads"
                          value={viewMode}
                          onChange={(e) => setViewMode(e.target.value)}
                          size="large"
                          options={[
                            {
                              value: "table",
                              label: <ListViewIcon size={20} />,
                            },
                            {
                              value: "card",
                              label: <GridViewIcon size={20} />,
                            },
                          ]}
                          optionType="button"
                          buttonStyle="solid"
                        />
                      </Col>
                    )}
                    <Col className="page-size-step" xs={24} xl={6}>
                      <StyledSelect
                        dropdownRender={(menu) => (
                          <div
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              scrollbarWidth: "none",
                            }}
                          >
                            {menu}
                          </div>
                        )}
                        value={itemsPerPage}
                        style={{ width: "100%" }}
                        options={itemsoptions}
                        onChange={(value) =>
                          handleFilterChange("itemsPerPage", value)
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {isLargeScreen && viewMode === "table" ? (
                <Table
                  className="table-view-step"
                  columns={tableColumns}
                  dataSource={advertisements}
                  rowKey="id"
                  loading={{
                    spinning: loading,
                    indicator: (
                      <div>
                        <OvalLoader height={100} primary="#ffe800" />
                      </div>
                    ),
                  }}
                  locale={{
                    emptyText: (
                      <Empty
                        description="لا توجد إعلانات متطابقة مع البحث"
                        className="my-3"
                      />
                    ),
                  }}
                  pagination={false}
                  scroll={{ x: 1000 }}
                />
              ) : (
                <AdGallery
                  deletModal={handleDeleteModalOpen}
                  statusModal={handleChangeStatusModal}
                  advertisements={advertisements}
                  loading={loading}
                />
              )}
              {advertisements.length > 0 && (
                <div className="d-flex flex-column mt-2 justify-content-center align-items-center w-100">
                  <ConfigProvider locale={arEG} direction="rtl">
                    <Pagination
                      className="pagination-step"
                      style={{ padding: "1.5rem" }}
                      current={currentPage}
                      defaultCurrent={1}
                      total={pagination.total}
                      pageSize={itemsPerPage}
                      onChange={handleChange}
                      showSizeChanger={false}
                      size="default"
                    />
                  </ConfigProvider>
                </div>
              )}

              <DeleteAdModal
                open={openDeleteModal}
                close={handleDeleteModalClose}
                adId={willBeDelete}
                onDeleteSuccess={handleDeleteSuccess}
              />
              <ChangeAdStatusModal
                open={openChangeStatusModal}
                close={handleChangeStatusModalClose}
                ad={willBeChangeStatus}
              />
              <PurchasePremiumAdModal
                open={openPurchaseModal}
                close={handlePurchasePremiumModalClose}
                ad={willBePurchase}
                navigate={navigate}
              />
            </>
          ) : (
            <Empty
              description={"لم تقم بنشر أي إعلان"}
              style={{ padding: 40, borderRadius: "0.6rem" }}
              className="d-flex m-0 bg-light flex-column align-items-center w-100"
            >
              <button
                className="tf-btn primary text-dark"
                type="primary"
                onClick={handlePublishAd}
              >
                انشر إعلانك الآن
              </button>
            </Empty>
          )}
        </>
      )}
    </>
  );
};

export default MyAdvertisementsPage;
