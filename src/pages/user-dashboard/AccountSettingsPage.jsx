import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Divider, Alert, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  LockPasswordIcon,
  PasswordValidationIcon,
  SecurityCheckIcon,
  ViewIcon,
  ViewOffIcon,
} from "hugeicons-react";
import {
  changePassword,
  resetChangePassword,
  deleteAccount,
  resetDeleteAccount,
} from "../../redux/actions/authActions";
import toastNotify from "@/utils/toast";
import OvalLoader from "@/components/OvalLoader";
import { CheckmarkCircle02Icon, CancelCircleIcon } from "hugeicons-react";

const StyledInput = styled(Input)`
  width: 100% !important;
  height: 3.375rem !important;
  font-size: 1rem !important;
  color: black !important;
  border-radius: 0.6rem !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  direction: rtl;
  text-align: right;
  &::placeholder {
    color: black !important;
    opacity: 0.6 !important;
    font-size: 1rem !important;
  }
`;
const StyledInputPassword = styled(Input.Password)`
  width: 100% !important;
  height: 3.375rem !important;
  font-size: 1rem !important;
  color: black !important;
  border-radius: 0.6rem !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  direction: rtl;
  text-align: right;
  &::placeholder {
    color: black !important;
    opacity: 0.6 !important;
    font-size: 1rem !important;
  }
`;

const AccountSettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    changingPassword,
    changePasswordError,
    changePasswordSuccess,
    deletingAccount,
    deleteAccountError,
  } = useSelector((state) => state.auth);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [deleteForm] = Form.useForm();

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [deleteData, setDeleteData] = useState({
    password: "",
    confirmation: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [deleteFormErrors, setDeleteFormErrors] = useState({});

  // Password validation logic (unchanged)
  const isMinLength = passwordData.new_password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(passwordData.new_password);
  const hasLowerCase = /[a-z]/.test(passwordData.new_password);
  const hasNumber = /\d/.test(passwordData.new_password);
  const hasSymbol = /[^A-Za-z0-9]/.test(passwordData.new_password);
  const passwordsMatch =
    passwordData.new_password === passwordData.new_password_confirmation &&
    passwordData.new_password_confirmation !== "";
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  };
  const getStrengthColor = () => {
    const passwordStrength = calculatePasswordStrength(
      passwordData.new_password
    );
    if (passwordStrength < 40) return "#ff4d4f";
    if (passwordStrength < 80) return "#faad14";
    return "#52c41a";
  };

  useEffect(() => {
    return () => {
      dispatch(resetChangePassword());
      dispatch(resetDeleteAccount());
    };
  }, [dispatch]);

  useEffect(() => {
    if (changePasswordSuccess) {
      setPasswordModalVisible(false);
      passwordForm.resetFields();
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setFormErrors({});
    }
  }, [changePasswordSuccess, passwordForm]);

  const showPasswordModal = () => {
    dispatch(resetChangePassword());
    passwordForm.resetFields();
    setPasswordData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setFormErrors({});
    setPasswordModalVisible(true);
  };

  const handlePasswordCancel = () => {
    passwordForm.resetFields();
    setPasswordData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setFormErrors({});
    setPasswordModalVisible(false);
    dispatch(resetChangePassword());
  };

  const showDeleteModal = () => {
    dispatch(resetDeleteAccount());
    deleteForm.resetFields();
    setDeleteData({
      password: "",
      confirmation: "",
    });
    setDeleteFormErrors({});
    setDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    deleteForm.resetFields();
    setDeleteData({
      password: "",
      confirmation: "",
    });
    setDeleteFormErrors({});
    setDeleteModalVisible(false);
    dispatch(resetDeleteAccount());
  };

  const validateField = (name, value, data = passwordData) => {
    if (name === "current_password") {
      return value.trim() ? null : "الرجاء إدخال كلمة المرور الحالية";
    }
    if (name === "new_password") {
      if (!value) return "الرجاء إدخال كلمة المرور الجديدة";
      if (value.length < 8) return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
      if (!/[A-Z]/.test(value))
        return "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل";
      if (!/[a-z]/.test(value))
        return "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل";
      if (!/\d/.test(value))
        return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
      if (!/[^A-Za-z0-9]/.test(value))
        return "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل";
      return null;
    }
    if (name === "new_password_confirmation") {
      if (!value) return "الرجاء تأكيد كلمة المرور";
      if (value && data.new_password !== value)
        return "كلمات المرور غير متطابقة";
      return null;
    }
    return null;
  };

  const validateDeleteField = (name, value, data = deleteData) => {
    if (name === "password") {
      return value.trim() ? null : "الرجاء إدخال كلمة المرور للتأكيد";
    }
    if (name === "confirmation") {
      return value === "DELETE"
        ? null
        : "الرجاء كتابة DELETE بشكل صحيح للتأكيد";
    }
    return null;
  };

  const validateForm = (data = passwordData) => {
    const newErrors = {};
    const fields = [
      "current_password",
      "new_password",
      "new_password_confirmation",
    ];
    fields.forEach((field) => {
      const error = validateField(field, data[field], data);
      if (error) newErrors[field] = error;
    });

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDeleteForm = (data = deleteData) => {
    const newErrors = {};
    const fields = ["password", "confirmation"];
    fields.forEach((field) => {
      const error = validateDeleteField(field, data[field], data);
      if (error) newErrors[field] = error;
    });

    setDeleteFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...passwordData, [name]: value };
    setPasswordData(updatedData);

    const error = validateField(name, value, updatedData);
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      const relatedField =
        name === "new_password" ? "new_password_confirmation" : null;
      if (relatedField && updatedData[relatedField]) {
        const relatedError = validateField(
          relatedField,
          updatedData[relatedField],
          updatedData
        );
        if (relatedError) {
          newErrors[relatedField] = relatedError;
        } else {
          delete newErrors[relatedField];
        }
      }

      return newErrors;
    });
  };

  const handleDeleteDataChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...deleteData, [name]: value };
    setDeleteData(updatedData);

    const error = validateDeleteField(name, value, updatedData);
    setDeleteFormErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(changePassword(passwordData)).then((result) => {
        if (result?.success) {
          toastNotify(
            result.message || "تم تغيير كلمة المرور بنجاح",
            "success"
          );
        } else {
        }
      });
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();

    if (validateDeleteForm()) {
      dispatch(deleteAccount({ password: deleteData.password }, navigate)).then(
        (result) => {
          if (result?.success) {
            toastNotify(result.message || "تم حذف الحساب بنجاح", "success");
          } else {
          }
        }
      );
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between account-setting-section gap-2">
        <div>
          <p className="fs-6">كلمة المرور</p>
          <small className="text-variant-1">
            حدّث كلمة المرور الخاصة بك للحفاظ على أمان حسابك
          </small>
        </div>
        <button
          className="tf-btn change-password-button-out text-dark"
          onClick={showPasswordModal}
        >
          تغيير كلمة المرور
        </button>
      </div>
      <Modal
        open={passwordModalVisible}
        onCancel={handlePasswordCancel}
        footer={null}
        centered
      >
        <Form
          layout="vertical"
          className="py-4"
          form={passwordForm}
          onFinish={handlePasswordSubmit}
        >
          <div className="box">
            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="current_password">
                كلمة المرور الحالية
              </label>
              <StyledInputPassword
                placeholder="ادخل كلمة المرور الحالية"
                prefix={
                  <LockPasswordIcon
                    size={16}
                    style={{ marginBottom: "0.1rem" }}
                  />
                }
                iconRender={(visible) =>
                  visible ? (
                    <ViewIcon size={16} style={{ marginBottom: "0.1rem" }} />
                  ) : (
                    <ViewOffIcon size={16} style={{ marginBottom: "0.1rem" }} />
                  )
                }
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                status={formErrors.current_password ? "error" : ""}
              />
              {formErrors.current_password && (
                <div className="text-danger mt-1 small">
                  {formErrors.current_password}
                </div>
              )}
            </fieldset>

            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="new_password">
                كلمة المرور الجديدة
              </label>
              <StyledInputPassword
                placeholder="ادخل كلمة المرور الجديدة"
                prefix={
                  <LockPasswordIcon
                    size={16}
                    style={{ marginBottom: "0.1rem" }}
                  />
                }
                iconRender={(visible) =>
                  visible ? (
                    <ViewIcon size={16} style={{ marginBottom: "0.1rem" }} />
                  ) : (
                    <ViewOffIcon size={16} style={{ marginBottom: "0.1rem" }} />
                  )
                }
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                status={formErrors.new_password ? "error" : ""}
              />
              {formErrors.new_password && (
                <div className="text-danger mt-1 small">
                  {formErrors.new_password}
                </div>
              )}

              {passwordData.new_password && (
                <>
                  <Progress
                    percent={calculatePasswordStrength(
                      passwordData.new_password
                    )}
                    showInfo={false}
                    strokeColor={getStrengthColor()}
                    className="mt-2"
                    size="small"
                  />
                  <div className="password-requirements d-flex flex-wrap mt-2 gap-2">
                    <div className="small mb-1">
                      {isMinLength ? (
                        <CheckmarkCircle02Icon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-success me-1"
                        />
                      ) : (
                        <CancelCircleIcon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-danger me-1"
                        />
                      )}
                      8 أحرف على الأقل
                    </div>
                    <div className="small  mb-1">
                      {hasUpperCase ? (
                        <CheckmarkCircle02Icon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-success me-1"
                        />
                      ) : (
                        <CancelCircleIcon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-danger me-1"
                        />
                      )}
                      حرف كبير
                    </div>
                    <div className="small  mb-1">
                      {hasLowerCase ? (
                        <CheckmarkCircle02Icon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-success me-1"
                        />
                      ) : (
                        <CancelCircleIcon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-danger me-1"
                        />
                      )}
                      حرف صغير
                    </div>
                    <div className="small  mb-1">
                      {hasNumber ? (
                        <CheckmarkCircle02Icon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-success me-1"
                        />
                      ) : (
                        <CancelCircleIcon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-danger me-1"
                        />
                      )}
                      رقم
                    </div>
                    <div className="small mb-1">
                      {hasSymbol ? (
                        <CheckmarkCircle02Icon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-success me-1"
                        />
                      ) : (
                        <CancelCircleIcon
                          size={16}
                          style={{ marginBottom: "0.1rem" }}
                          className="text-danger me-1"
                        />
                      )}
                      رمز خاص
                    </div>
                  </div>
                </>
              )}
            </fieldset>

            <fieldset className="box-fieldset mb-3">
              <label
                className="mb-1 fs-6 fw-normal"
                htmlFor="new_password_confirmation"
              >
                تأكيد كلمة المرور
              </label>
              <StyledInput
                type={passwordVisible ? "text" : "password"}
                placeholder="قم بتأكيد كلمة المرور"
                prefix={
                  <PasswordValidationIcon
                    size={16}
                    style={{ marginBottom: "0.1rem" }}
                  />
                }
                name="new_password_confirmation"
                value={passwordData.new_password_confirmation}
                onChange={handlePasswordChange}
                status={formErrors.new_password_confirmation ? "error" : ""}
              />
              {formErrors.new_password_confirmation && (
                <div className="text-danger mt-1 small">
                  {formErrors.new_password_confirmation}
                </div>
              )}

              {passwordData.new_password_confirmation &&
                passwordData.new_password &&
                passwordsMatch && (
                  <div className="mt-2 small text-success">
                    <CheckmarkCircle02Icon
                      size={16}
                      style={{ marginBottom: "0.1rem" }}
                      className="me-1"
                    />
                    كلمات المرور متطابقة
                  </div>
                )}
            </fieldset>
          </div>
          {changePasswordError && (
            <Alert
              message={
                typeof changePasswordError === "object"
                  ? Object.values(changePasswordError).flat().join(", ")
                  : changePasswordError
              }
              type="error"
              showIcon
              className="mb-2"
            />
          )}
          <div className="d-flex align-items-center justify-content-end gap-2">
            <span className="cancel-password" onClick={handlePasswordCancel}>
              إلغاء
            </span>
            <button
              className="tf-btn text-dark primary change-password-button"
              type="submit"
              disabled={changingPassword}
              onClick={handlePasswordSubmit}
            >
              {changingPassword ? <OvalLoader /> : "تحديث كلمة المرور"}
            </button>
          </div>
        </Form>
      </Modal>

      <Divider />

      <div className="d-flex align-items-center justify-content-between account-setting-section gap-2">
        <div className="danger-text">
          <p className="fs-6 ">حذف الحساب</p>
          <small className="text-variant-1 ">
            احذف حسابك وجميع البيانات المرتبطة به بشكل نهائي
          </small>
        </div>
        <button
          className="tf-btn delete-account-btn-out"
          onClick={showDeleteModal}
        >
          حذف الحساب
        </button>
      </div>

      <Modal
        open={deleteModalVisible}
        onCancel={handleDeleteCancel}
        footer={null}
        centered
      >
        <Form className="py-4" form={deleteForm} layout="vertical">
          <div className="box">
            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="password">
                كلمة المرور
              </label>
              <StyledInputPassword
                placeholder="ادخل كلمة المرور للتأكيد"
                prefix={
                  <LockPasswordIcon
                    size={16}
                    style={{ marginBottom: "0.1rem" }}
                  />
                }
                iconRender={(visible) =>
                  visible ? (
                    <ViewIcon size={16} style={{ marginBottom: "0.1rem" }} />
                  ) : (
                    <ViewOffIcon size={16} style={{ marginBottom: "0.1rem" }} />
                  )
                }
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                name="password"
                value={deleteData.password}
                onChange={handleDeleteDataChange}
                status={deleteFormErrors.password ? "error" : ""}
              />
              {deleteFormErrors.password && (
                <div className="text-danger mt-1 small">
                  {deleteFormErrors.password}
                </div>
              )}
            </fieldset>
            <label className="mb-1 fs-6 fw-normal" htmlFor="confirmation">
              تأكيد الحذف
            </label>
            <fieldset className="box-fieldset mb-3">
              <StyledInput
                type="text"
                placeholder="اكتب كلمة DELETE"
                prefix={
                  <SecurityCheckIcon
                    size={16}
                    style={{ marginBottom: "0.1rem" }}
                  />
                }
                name="confirmation"
                value={deleteData.confirmation}
                onChange={handleDeleteDataChange}
                status={deleteFormErrors.confirmation ? "error" : ""}
              />

              {deleteFormErrors.confirmation && (
                <div className="text-danger mt-1 small">
                  {deleteFormErrors.confirmation}
                </div>
              )}
              {deleteData.confirmation === "DELETE" && (
                <div className="mt-2 small text-success">
                  <CheckmarkCircle02Icon
                    size={16}
                    style={{ marginBottom: "0.1rem" }}
                    className="me-1"
                  />
                  تأكيد صحيح
                </div>
              )}
            </fieldset>
          </div>
          {deleteAccountError && (
            <Alert
              message={
                typeof deleteAccountError === "object"
                  ? Object.values(deleteAccountError).flat().join(", ")
                  : deleteAccountError
              }
              type="error"
              showIcon
              className="mb-2"
            />
          )}
          <Alert
            showIcon
            message="بمجرد حذف حسابك، سيتم إزالة جميع بياناتك بشكل نهائي. يشمل ذلك ملفك الشخصي، إعلاناتك، وجميع المعلومات الأخرى المرتبطة"
            type="warning"
            className="mb-3"
          />
          <div className="d-flex align-items-center justify-content-end gap-2">
            <span className="cancel-password" onClick={handleDeleteCancel}>
              إلغاء
            </span>
            <button
              className="tf-btn text-dark primary delete-account-btn"
              type="submit"
              disabled={deletingAccount}
              onClick={handleDeleteSubmit}
            >
              {deletingAccount ? <OvalLoader /> : "حذف الحساب"}
            </button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AccountSettingsPage;
