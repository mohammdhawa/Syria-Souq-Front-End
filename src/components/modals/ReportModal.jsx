import React, { useState, useEffect } from "react";
import { Modal, Radio } from "antd";
import { StyledTextArea } from "@/pages/publish-ad/styled";
import api from "@/redux/api";
import toastNotify from "@/utils/toast";
import OvalLoader from "../OvalLoader";
import { useDispatch } from "react-redux";
import { removeFavorite } from "@/redux/actions/favoritesActions";

const ReportModal = ({ open, close, report, adId, favorite }) => {
  const [reason, setReason] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      document.body.style.overflowY = "auto";
      document.body.style.width = "100%";
    }
  }, [open]);
  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setErrors((prev) => ({ ...prev, reason: null }));
  };
  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, otherReason: null }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (reason === "other" && !otherReason.trim()) {
      newErrors.otherReason = "يرجى توضيح سبب الإبلاغ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    setShowErrors(true);
    if (!validateForm()) {
      return;
    }
    try {
      setIsSubmitting(true);
      let content = reason === "other" ? otherReason : reason;
      const response = await api.post("/complaints/advertisement", {
        advs_id: adId,
        content: content,
      });

      if (response.status === 201 || response.status === 200) {
        report(true);
        resetForm();
        toastNotify(response.data.message, "success");
        close();
        if (favorite) {
          dispatch(removeFavorite(adId));
        }
      }
    } catch (error) {

      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setReason(null);
    setOtherReason("");
    setErrors({});
    setShowErrors(false);
  };

  const handleCancel = () => {
    resetForm();
    close();
  };

  const reportReasons = [
    {
      value: "إعلان مخالف",
      label: "إعلان مخالف",
      description:
        "يحتوي على محتوى ينتهك سياسات النشر أو الشروط العامة للموقع.",
    },
    {
      value: "محتوى غير لائق أو مسيء",
      label: "محتوى غير لائق أو مسيء",
      description:
        "يتضمن ألفاظًا نابية، صورًا غير لائقة، أو إساءة لأي جهة أو فرد.",
    },
    {
      value: "معلومات مضللة أو كاذبة",
      label: "معلومات مضللة أو كاذبة",
      description: "يحتوي على تفاصيل غير صحيحة بهدف خداع المستخدمين.",
    },
    {
      value: "إعلان مكرر",
      label: "إعلان مكرر",
      description: "تم نشره أكثر من مرة بشكل مكرر لنفس المحتوى.",
    },
    {
      value: "احتيال أو نشاط مشبوه",
      label: "احتيال أو نشاط مشبوه",
      description: "يشير إلى محاولة نصب أو تعامل غير آمن يثير الشكوك.",
    },
    { value: "other", label: "سبب آخر" },
  ];

  return (
    <Modal
      forceRender
      destroyOnClose
      footer={null}
      centered
      open={open}
      onCancel={handleCancel}
      direction="rtl"
      title={<p className="text-right fw-bold fs-4">يرجى اختيار سبب الإبلاغ</p>}
    >
      <div
        style={{
          gap: "1rem",
        }}
        className="gap-3 p-4 pb-0 d-flex flex-column align-items-center justify-content-center"
      >
        <div className="w-100 d-flex flex-column gap-0">
          <Radio.Group
            onChange={handleReasonChange}
            value={reason}
            className="w-100"
          >
            <div className="w-100 d-flex flex-column gap-3 align-items-start">
              {reportReasons.map((item, i) => (
                <div key={i} className="d-flex flex-column">
                  <Radio
                    key={item.value}
                    value={item.value}
                    className="text-right w-100"
                  >
                    <div className="d-flex flex-column">
                      <span className="fs-6 fw-normal">{item.label}</span>
                    </div>
                  </Radio>
                  {item.description && (
                    <span className="fs-6 text-variant-1 fw-light me-4">
                      {item.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Radio.Group>
          {reason === "other" && (
            <div className="w-100 mt-2 d-flex flex-column align-items-end">
              <StyledTextArea
                rows={4}
                value={otherReason}
                onChange={handleOtherReasonChange}
                placeholder="يرجى توضيح سبب الإبلاغ"
                maxLength={150}
                status={showErrors && errors?.otherReason ? "error" : ""}
              />
              <div className="w-100 d-flex align-items-center justify-content-between">
                {showErrors && errors?.otherReason && (
                  <div className="text-danger mt-1 w-100 small">
                    {errors.otherReason}
                  </div>
                )}
                <span
                  style={{
                    textAlign: "end",
                  }}
                  className="mt-1 text-variant-1 w-100"
                >
                  {otherReason?.length} / 150
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className={`d-flex align-items-center justify-content-between gap-2 ${
            reason !== "other" && "mt-2"
          }  w-100`}
        >
          <button className="btn" onClick={handleCancel}>
            إلغاء
          </button>
          <button
            style={{ borderRadius: "0.6rem" }}
            className="tf-btn primary text-dark"
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? <OvalLoader /> : "إرسال الإبلاغ"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ReportModal;
