import MetaComponent from "@/components/common/MetaComponent";
import ComponentLoader from "@/components/ComponentLoader";
import { Alert, Breadcrumb, Divider, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import SubscriptionCard from "./SubscriptionCard";
import { fetchSubscription } from "@/redux/actions/subscriptionActions";
import {  HourglassIcon } from "hugeicons-react";
import moment from "moment-timezone";
import SubRequestModal from "../../components/modals/SubRequestModal";
import { fetchPackages } from "@/redux/actions/packagesActions";
import OvalLoader from "@/components/OvalLoader";

export function formatAdCount(count) {
  if (count === 1) return "إعلان";
  if (count === 2) return "إعلان";
  if (count >= 3 && count <= 10) return `إعلانات`;
  if (count >= 11 && count <= 99) return `إعلان`;
  return `إعلان`;
}
export function formatDayCount(count) {
  if (count === 1) return "يوم";
  if (count === 2) return "يوم";
  if (count >= 3 && count <= 10) return `أيام`;
  if (count >= 11 && count <= 99) return `يوم`;
  return `يوم`;
}

const SubscriptionPage = () => {
  const [showMessage, setShowMessage] = useState(false);
  const { subscription, loading } = useSelector((state) => state.subscription);
  const [subscriptionRequestModal, setSubscriptionRequestModal] =
    useState(false);
  const { packages } = useSelector((state) => state.packages);
  const packagesLoading = useSelector((state) => state.packages.loading);

  const dispatch = useDispatch();
  const today = moment();
  const expiryDate = moment(subscription?.expiry_date);
  const daysRemaining = expiryDate.diff(today, "days");
  useEffect(() => {
    dispatch(fetchSubscription());
  }, [dispatch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get("from");

    if (fromParam === "publish-ad") {
      setShowMessage(true);
      if (fromParam === "publish-ad") {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("from");
        window.history.replaceState({}, "", newUrl.toString());
      }
    }
  }, [subscription]);
  const metadata = {
    title: `Syria Souq | إشتراكاتي`,
  };
  return (
    <>
      <MetaComponent meta={metadata} />
      {loading ? (
        <ComponentLoader />
      ) : (
        <>
          <div className="d-flex align-items-start flex-column mb-4">
            <span className="fs-4 fw-bold mb-1">إشتراكاتي</span>
            <Breadcrumb
              items={[
                {
                  title: "لوحة التحكم",
                },
                {
                  title: "إشتراكاتي",
                },
              ]}
            />
          </div>
          {!subscription?.remaining_ads ? (
            <>
              {subscription?.has_pending ? (
                <Empty
                  image={
                    <HourglassIcon
                      size={100}
                      color="#DCE0E6"
                      className="mb-5"
                    />
                  }
                  description={
                    "لديك طلب إشتراك في قائمة الإنتظار. ستتم معالجة طلبك في أسرع وقت."
                  }
                  style={{ padding: 40, borderRadius: "0.6rem" }}
                  className="d-flex m-0 bg-light flex-column align-items-center w-100"
                />
              ) : (
                <>
                  <Empty
                    description={
                      "لا يوجد لديك اشتراك نشط, اشترك الآن وابدأ بنشر إعلاناتك"
                    }
                    style={{ padding: 40, borderRadius: "0.6rem" }}
                    className="d-flex m-0 bg-light flex-column align-items-center w-100"
                  >
                    <button
                      onClick={async () => {
                        await dispatch(fetchPackages());
                        setSubscriptionRequestModal(true);
                      }}
                      className="tf-btn primary text-dark"
                      type="primary"
                      disabled={packagesLoading}
                    >
                      {packagesLoading ? <OvalLoader /> : "اشترك الآن"}
                    </button>
                  </Empty>
                  <SubRequestModal
                    open={subscriptionRequestModal}
                    close={() => {
                      setSubscriptionRequestModal(false);
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Alert
                className="mb-3"
                type="info"
                showIcon
                closable
                message="يمكنك تجديد الباقة عند نفاد عدد الإعلانات أو انتهاء مدة الاشتراك"
              />
              <div className="mb-3  statistic-cards-container status-step">
                <div className="static-card-my-ad border ">
                  <div className="static-card-title">
                    <span className="text-variant-1">رصيد الإعلانات</span>
                    <p className="fs-1 m-0 d-flex gap-1">
                      {subscription?.remaining_ads}
                      <small className="fs-5 fw-normal">
                        {formatAdCount(subscription?.remaining_ads)}
                      </small>
                    </p>
                  </div>
                </div>
                <div className="static-card-my-ad border">
                  <div className="static-card-title ">
                    <span className="text-variant-1">الأيام المتبقية</span>
                    <p className="fs-1 m-0 d-flex gap-1">
                      {daysRemaining}
                      <small className="fs-5 fw-normal">
                        {formatDayCount(daysRemaining)}
                      </small>
                    </p>
                  </div>
                </div>
                {/* <div className="static-card-my-ad border">
                  <div className="static-card-title">
                    <span className="text-variant-1">الإعلانات المستخدمة</span>
                    <p className="fs-1 m-0 d-flex gap-1">
                      {subscription?.package?.max_of_ads -
                        subscription?.remaining_ads}
                      <small className="fs-5 fw-normal">
                        {formatAdCount(
                          subscription?.package?.max_of_ads -
                            subscription?.remaining_ads
                        )}
                      </small>
                    </p>
                  </div>
                </div> */}
              </div>
              <Divider className="my-3" />
              <SubscriptionCard subscription={subscription} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default SubscriptionPage;
