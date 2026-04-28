import OvalLoader from "@/components/OvalLoader";
import { Modal, Form, Upload, Row, Col, Divider, Alert } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSubscriptionRequest } from "@/redux/actions/subscriptionActions";
import {
  formatAdCount,
  formatDayCount,
} from "../../pages/user-dashboard/SubscriptionPage";
import { Upload04Icon } from "hugeicons-react";

const SubRequestModal = ({ open, close }) => {
  const { requestLoading } = useSelector((state) => state.subscription);
  const { packages } = useSelector((state) => state.packages);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setSelectedPackage(null);
      setReceipt(null);
      setFileList([]);
      setFormErrors({});
    }
  }, [open, form]);

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
    setFormErrors((prev) => ({ ...prev, package: null }));
  };

  const handleFileChange = (info) => {
    setFileList(info.fileList.slice(-1));

    if (info.file.status === "done") {
      setReceipt(info.file.originFileObj);
      setFormErrors((prev) => ({ ...prev, receipt: null }));
    } else if (info.file.status === "error") {
      setFormErrors((prev) => ({
        ...prev,
        receipt: `${info.file.name} فشل في التحميل.`,
      }));
    }
  };

  const handleSubmitRequest = () => {
    const newErrors = {};

    if (!selectedPackage) {
      newErrors.package = "يرجى اختيار باقة";
    }

    if (!receipt) {
      newErrors.receipt = "يرجى إرفاق إيصال الدفع";
    }

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      dispatch(createSubscriptionRequest(selectedPackage, receipt))
        .then(() => {
          form.resetFields();
          setFileList([]);
          close();
        })
        .catch((error) => {
          const errorMessage = error.message || "حدث خطأ في إرسال الطلب";
          if (typeof errorMessage === "object") {
            const apiErrors = {};
            Object.entries(errorMessage).forEach(([key, value]) => {
              apiErrors[key.toLowerCase()] = value;
            });
            setFormErrors(apiErrors);
          } else {
            setFormErrors({ general: errorMessage });
          }
        });
    }
  };

  const handleRequestCancel = () => {
    setReceipt(null);
    setFileList([]);
    setFormErrors({});
    close();
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        setFormErrors((prev) => ({
          ...prev,
          receipt: "يمكنك فقط تحميل ملفات الصور!",
        }));
        return false;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        setFormErrors((prev) => ({
          ...prev,
          receipt: "يجب أن يكون حجم الصورة أقل من 2 ميجابايت!",
        }));
        return false;
      }

      return isImage && isLt2M;
    },
    onChange: handleFileChange,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onRemove: () => {
      setReceipt(null);
      setFileList([]);
      setFormErrors((prev) => ({
        ...prev,
        receipt: "يرجى إرفاق إيصال الدفع",
      }));
      return true;
    },
    fileList: fileList,
  };

  return (
    <Modal
      open={open}
      onCancel={handleRequestCancel}
      footer={null}
      centered
      title={"طلب اشتراك"}
      forceRender
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <div className="box">
          <div>
            <>
              <p className="mb-1 fs-6">اختر الباقة المناسبة لك</p>
              {packages && packages.length > 0 ? (
                <Row gutter={[8, 8]}>
                  {packages.map((pkg) => (
                    <Col xs={24} key={pkg.id}>
                      <div
                        className={`package-card-mysub  ${
                          selectedPackage === pkg.id ? "selected" : ""
                        }`}
                        onClick={() => handlePackageSelect(pkg.id)}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex flex-column align-items-start">
                            <p className="fs-5 fw-bolder m-0">{pkg?.name}</p>
                            <span className=" fw-light text-variant-1">
                              {pkg?.max_of_ads} {formatAdCount(pkg?.max_of_ads)}{" "}
                              + {pkg?.period} {formatDayCount(pkg?.period)}
                            </span>
                          </div>
                          <span className="fs-4 fw-bolder">${pkg?.price}</span>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-3">لا توجد باقات متاحة</div>
              )}
            </>
          </div>
          {formErrors.package && (
            <div className="text-danger mt-1 small">{formErrors.package}</div>
          )}

          <Divider className="my-3" />

          <Upload.Dragger
            {...uploadProps}
            maxCount={1}
            listType="picture"
            accept="image/jpeg,image/png,image/jpg,image/gif"
          >
            <span className="d-flex w-100 justify-content-center py-2 align-items-center gap-1">
              <Upload04Icon size={16} /> <p>قم بإرفاق إيصال الدفع</p>
            </span>
          </Upload.Dragger>
          {formErrors.receipt && (
            <div className="text-danger mt-1 small">{formErrors.receipt}</div>
          )}
        </div>

        {formErrors.general && (
          <Alert
            message={formErrors.general}
            type="error"
            showIcon
            closable
            className="mt-3"
            onClose={() =>
              setFormErrors((prev) => ({ ...prev, general: null }))
            }
          />
        )}
        <Alert
          type="info"
          closable
          className="mt-2"
          showIcon
          message="سيتم إرسال طلبك إلى إدارة الموقع. في حال الموافقة، سيظهر الاشتراك ضمن صفحة اشتراكاتي"
        />
        <div className="d-flex align-items-center justify-content-end gap-2 mt-3">
          <span className="cancel-password" onClick={handleRequestCancel}>
            إلغاء
          </span>
          <button
            className="tf-btn text-dark primary"
            type="button"
            disabled={requestLoading || !selectedPackage || !receipt}
            onClick={handleSubmitRequest}
          >
            {requestLoading ? <OvalLoader /> : "إرسال الطلب"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default SubRequestModal;
