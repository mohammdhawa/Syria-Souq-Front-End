import React, { useState } from "react";
import { Row, Col, Tooltip, Collapse, Alert } from "antd";

import moment from "moment";
import "moment/locale/ar";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Calendar04Icon,
  DollarSquareIcon,
  Invoice02Icon,
  Megaphone02Icon,
  PackageIcon,
  TimeQuarterPassIcon,
} from "hugeicons-react";

const SubscriptionCard = ({ subscription }) => {
  if (!subscription) return null;
  const today = moment();
  const expiryDate = moment(subscription?.expiry_date);
  const daysRemaining = expiryDate.diff(today, "days");

  const totalDays = subscription?.package?.period;
  const daysUsed = totalDays - daysRemaining;
  const percentRemaining = Math.max(
    0,
    Math.min(100, Math.round((daysRemaining / totalDays) * 100))
  );

  const totalAds = subscription?.package?.max_of_ads;
  const adsRemaining = subscription?.remaining_ads;
  const percentAdsRemaining = Math.max(
    0,
    Math.min(100, Math.round((adsRemaining / totalAds) * 100))
  );

  const packageProperties = subscription?.package?.properties?.split(",") || [];
  const [openDetail, setOpenDetail] = useState("1");

  function formatAdCount(count) {
    if (count === 1) return "إعلان";
    if (count === 2) return "إعلانان";
    if (count >= 3 && count <= 10) return `${count} إعلانات`;
    if (count >= 11 && count <= 99) return `${count} إعلان`;
    return `${count} إعلان`;
  }

  const items = [
    {
      key: "1",
      label: (
        <div
          className={`d-flex active-plan-header w-100 align-items-center justify-content-between p-3 py-4 ${
            subscription?.package?.max_of_ads < 10
              ? "basic-plan"
              : subscription?.package?.max_of_ads >= 10 &&
                subscription?.package?.max_of_ads <= 20
              ? "pro-plan"
              : subscription?.package?.max_of_ads > 20
              ? "diamond-plan"
              : ""
          }`}
        >
          <div>
            <p className="fs-3 mb-0 fw-bold">{subscription?.package?.name}</p>
            <div className="mb-0 text-variant-1 plan-message">
              انشر {formatAdCount(subscription?.package?.max_of_ads)} خلال{" "}
              {subscription?.package?.period} يوم مع{" "}
              {subscription?.package?.name} وحقق وصولًا أسرع للمهتمين
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-2">
              {openDetail === "" ? (
                <Tooltip title={"تفاصيل الباقة"}>
                  <ArrowDown01Icon
                    onClick={() => setOpenDetail("1")}
                    size={24}
                    className="open-package-collapse"
                  />
                </Tooltip>
              ) : (
                <Tooltip title={"إخفاء تفاصيل الباقة"}>
                  <ArrowUp01Icon
                    onClick={() => setOpenDetail("")}
                    size={24}
                    className="open-package-collapse"
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      ),
      children: (
        <>
          <div className="mt-3">
            <Row gutter={[100, 24]}>
              <Col xs={24} sm={12} md={12}>
                <div className="d-flex align-items-center gap-2">
                  <div className="active-plan-icon bg-light">
                    <PackageIcon size={24} />
                  </div>
                  <div className="d-flex align-items-center w-100 justify-content-between flex-row gap-0 active-plan-item">
                    <div className="fs-6">الباقة</div>
                    <span className="fs-6 fw-bold">
                      {subscription?.package?.name}
                    </span>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <div className="d-flex align-items-center gap-2">
                  <div className="active-plan-icon bg-light">
                    <Invoice02Icon size={24} />
                  </div>
                  <div className="d-flex align-items-center w-100 justify-content-between flex-row gap-0 active-plan-item">
                    <div className="fs-6">تاريخ الاشتراك</div>
                    <span className="fs-6 fw-bold">
                      {moment(subscription?.created_at).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <div className="d-flex align-items-center gap-2">
                  <div className="active-plan-icon bg-light">
                    <Calendar04Icon size={24} />
                  </div>
                  <div className="d-flex align-items-center w-100 justify-content-between flex-row gap-0 active-plan-item">
                    <div className="fs-6">مدة الباقة</div>
                    <span className="fs-6 fw-bold">
                      {subscription?.package?.period} يوم
                    </span>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <div className="d-flex align-items-center gap-2">
                  <div className="active-plan-icon bg-light">
                    <TimeQuarterPassIcon size={24} />
                  </div>
                  <div className="d-flex align-items-center w-100 justify-content-between flex-row gap-0 active-plan-item">
                    <div className="fs-6">تاريخ الانتهاء</div>
                    <span className="fs-6 fw-bold">
                      {moment(subscription?.expiry_date).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <div className="d-flex align-items-center gap-2">
                  <div className="active-plan-icon bg-light">
                    <Megaphone02Icon size={24} />
                  </div>
                  <div className="d-flex align-items-center w-100 justify-content-between flex-row gap-0 active-plan-item">
                    <div className="fs-6">رصيد الإعلانات</div>
                    <span className="fs-6 fw-bold">
                      {subscription?.package?.max_of_ads ===
                      subscription?.remaining_ads ? (
                        <>{formatAdCount(subscription?.package?.max_of_ads)} </>
                      ) : (
                        <>
                          {subscription?.remaining_ads} /{" "}
                          {formatAdCount(subscription?.package?.max_of_ads)}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <div className="d-flex align-items-center gap-2">
                  <div className="active-plan-icon bg-light">
                    <DollarSquareIcon size={24} />
                  </div>
                  <div className="d-flex align-items-center w-100 justify-content-between flex-row gap-0 active-plan-item">
                    <div className="fs-6">سعر الباقة</div>
                    <span className="fs-6 fw-bold">
                      ${subscription?.package?.price}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Collapse
        bordered={false}
        className="active-package-collapse"
        items={items}
        activeKey={openDetail}
      />
    </>
  );
};

export default SubscriptionCard;
