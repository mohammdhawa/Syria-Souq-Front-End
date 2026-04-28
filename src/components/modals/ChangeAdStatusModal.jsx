import OvalLoader from "@/components/OvalLoader";
import { changeAdStatus } from "@/redux/actions/myAdvertisementsActions";
import { fetchSubscription } from "@/redux/actions/subscriptionActions";
import { Alert, Form, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

const ChangeAdStatusModal = ({ open, close, ad }) => {
  const dispatch = useDispatch();
  const { changingStatusLoading } = useSelector(
    (state) => state.myAdvertisements
  );
  const { subscription } = useSelector((state) => state.subscription);

  const [adStatus, setAdStatus] = useState(ad?.active_status);

  const handleChangeStatus = async () => {
    try {
      await dispatch(changeAdStatus(ad.id, adStatus));
      handleModalClose();
    } catch (error) {}
  };

  const handleModalClose = () => {
    close();
  };

  useEffect(() => {
    dispatch(fetchSubscription());
    setAdStatus(ad?.active_status);
  }, [ad]);

  const statusTypes = [
    {
      label: "غير نشط",
      value: "inactive",
    },
    {
      label: "نشط",
      value: "active",
    },
  ];

  const getAlertMessage = () => {
    if (adStatus === "active" && ad?.active_status !== "active") {
      return "عند إعادة تفعيل هذا الإعلان، سيتم خصمه من رصيد إعلاناتك وسيكون في حالة انتظار حتى يوافق عليه مدير الموقع";
    } else if (adStatus === "inactive" && ad?.active_status !== "inactive") {
      return "عند إلغاء تفعيل هذا الإعلان، سيتم إخفاؤه من صفحة الإعلانات";
    }
    return null;
  };

  const alertMessage = getAlertMessage();

  return (
    <Modal
      forceRender
      destroyOnClose
      footer={null}
      centered
      open={open}
      onCancel={handleModalClose}
      title={"تغيير حالة الإعلان"}
    >
      <div
        style={{ gap: "1rem" }}
        className="p-2 px-0 d-flex gap-0 flex-column"
      >
        <Form layout="vertical">
          <div className="box">
            <label className="mb-1 fs-6 fw-normal" htmlFor="confirmation">
              الحالة
            </label>
            <fieldset className="box-fieldset mb-3">
              <StyledSelect
                style={{ width: "100%" }}
                options={statusTypes}
                value={adStatus}
                onChange={(value) => setAdStatus(value)}
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
              />
            </fieldset>
          </div>
        </Form>

        {adStatus === "active" &&
        ad?.active_status === "inactive" &&
        !subscription?.remaining_ads > 0 ? (
          <Alert
            message={
              <div className="d-flex align-items-center justify-content-between">
                <p>
                  لتفعيل الإعلان يجب أن يكون برصيدك الحالي إعلان واحد على الأقل
                </p>
                <Link
                  to={"/dashboard/subscription"}
                  style={{ color: "#1b82e3" }}
                >
                  اشتراكاتي
                </Link>
              </div>
            }
            type="error"
            showIcon
            style={{
              textAlign: "right",
              direction: "rtl",
              marginBottom: "1rem",
            }}
          />
        ) : (
          alertMessage && (
            <Alert
              message={alertMessage}
              type="warning"
              showIcon
              style={{
                textAlign: "right",
                direction: "rtl",
                marginBottom: "1rem",
              }}
            />
          )
        )}

        <div className="d-flex w-100 justify-content-end gap-2">
          <span onClick={handleModalClose} className="cancel-password">
            إلغاء
          </span>
          <button
            onClick={handleChangeStatus}
            className="tf-btn primary text-dark"
            disabled={
              changingStatusLoading ||
              adStatus === ad?.active_status ||
              (!subscription?.remaining_ads > 0 && adStatus === "active")
            }
          >
            {changingStatusLoading ? (
              <OvalLoader primary="#1e1e1e" />
            ) : (
              "تغيير الحالة"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeAdStatusModal;
