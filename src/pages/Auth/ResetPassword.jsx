import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Alert, Form, Input, Progress } from "antd";
import axios from "axios";
import {
  LockPasswordIcon,
  PasswordValidationIcon,
  ViewIcon,
  ViewOffIcon,
} from "hugeicons-react";
import OvalLoader from "@/components/OvalLoader";

import MetaComponent from "@/components/common/MetaComponent";
import Loader from "@/components/Loader";
import { CheckmarkCircle02Icon, CancelCircleIcon } from "hugeicons-react";


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

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [invalidToken, setInvalidToken] = useState(false);
  const [success, setSuccess] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [checkingRoute, setCheckingRoute] = useState(true);
  const isMinLength = userData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(userData.password);
  const hasLowerCase = /[a-z]/.test(userData.password);
  const hasNumber = /\d/.test(userData.password);
  const hasSymbol = /[^A-Za-z0-9]/.test(userData.password);
  const passwordsMatch =
    userData.password === userData.password_confirmation &&
    userData.password_confirmation !== "";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");

    if (!urlToken) {
      navigate("/auth/login", { replace: true });
      return;
    } else {
      setToken(urlToken);
    }
    setCheckingRoute(false);
  }, [location, navigate]);

  useEffect(() => {
    if (countdown !== null) {
      if (countdown <= 0) {
        navigate("/auth/login", { replace: true });
      } else {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [countdown, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(userData.password);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "#ff4d4f";
    if (passwordStrength < 80) return "#faad14";
    return "#52c41a";
  };

  const validateField = (name, value, data = userData) => {
    if (name === "password") {
      if (!value) return "الرجاء إدخال كلمة المرور";
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
    if (name === "password_confirmation") {
      if (!value) return "الرجاء تأكيد كلمة المرور";
      if (value && data.password !== value) return "كلمات المرور غير متطابقة";
      return null;
    }
    return null;
  };

  const validateForm = (data = userData) => {
    const newErrors = {};
    const passwordError = validateField("password", data.password);
    const confirmError = validateField(
      "password_confirmation",
      data.password_confirmation,
      data
    );

    if (passwordError) newErrors.password = passwordError;
    if (confirmError) newErrors.password_confirmation = confirmError;

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...userData, [name]: value };
    setUserData(updatedData);
    setApiError(null);

    const error = validateField(name, value, updatedData);
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      const relatedField =
        name === "password" ? "password_confirmation" : "password";
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
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setApiError(null);

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://staging.syr-souq.com/api/reset-password?token=${token}`,
          {
            password: userData.password,
            password_confirmation: userData.password_confirmation,
            token: token,
          }
        );

        if (response.data && response.data.message) {
          setSuccess(
            `${response.data.message
            } سيتم توجيهك إلى صفحة تسجيل الدخول خلال ${3} ثواني...`
          );
          setCountdown(3);
        }
      } catch (error) {
        if (error.response) {
          if (
            error.response.data &&
            error.response.data.error === "رمز غير صالح أو رمز منتهي الصلاحية."
          ) {
            setInvalidToken(true);
            setApiError(`${error.response.data.error} `);
          } else if (
            error.response.data &&
            error.response.data.errors &&
            error.response.data.errors.password
          ) {
            setFormErrors((prev) => ({
              ...prev,
              password: error.response.data.errors.password[0],
            }));
          } else if (error.response.data && error.response.data.message) {
            setApiError(error.response.data.message);
          } else {
            setApiError("حدث خطأ أثناء محاولة إعادة تعيين كلمة المرور");
          }
        } else {
          setApiError("حدث خطأ في الاتصال بالخادم");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const metadata = {
    title: "Syria Souq | إعادة تعيين كلمة المرور",
    description: "إعادة تعيين كلمة المرور لحسابك في سوريا سوق",
    keywords: "سوريا سوق، إعادة تعيين كلمة المرور، حساب، تسجيل الدخول",
  };

  return checkingRoute ? (
    <Loader />
  ) : (
    <>
      <MetaComponent meta={metadata} />
      <div
        style={{ height: "100vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <div className="login-form">
          <Form className="form-account" onSubmit={handleSubmit}>
            <div style={{ padding: "25px 0" }} className="title-box">
              <Link to={"/"}>
                <img
                  alt="logo"
                  src="/images/logo/solo_logo.png"
                  width="72px"
                  className="mb-3"
                />
              </Link>
              <h4>تعيين كلمة المرور</h4>
            </div>

            <div className="box">
              <fieldset className="box-fieldset mb-3">
                <label className="mb-2 fs-6 fw-normal" htmlFor="password">
                  كلمة المرور الجديدة
                </label>
                <StyledInputPassword
                  placeholder="ادخل كلمة المرور"
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
                      <ViewOffIcon
                        size={16}
                        style={{ marginBottom: "0.1rem" }}
                      />
                    )
                  }
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  status={formErrors.password ? "error" : ""}
                  disabled={loading || success}
                />
                {formErrors.password && (
                  <div className="text-danger mt-1 small">
                    {formErrors.password}
                  </div>
                )}

                {userData.password && (
                  <>
                    <Progress
                      percent={passwordStrength}
                      showInfo={false}
                      strokeColor={getStrengthColor()}
                      className="mt-2"
                      size="small"
                    />
                    <div className="password-requirements d-flex flex-wrap gap-2 mt-2">
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
                  className="mb-2 fs-6 fw-normal"
                  htmlFor="password_confirmation"
                >
                  تأكيد كلمة المرور الجديدة
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
                  name="password_confirmation"
                  value={userData.password_confirmation}
                  onChange={handleChange}
                  status={formErrors.password_confirmation ? "error" : ""}
                  disabled={loading || success}
                />
                {formErrors.password_confirmation && (
                  <div className="text-danger mt-1 small">
                    {formErrors.password_confirmation}
                  </div>
                )}
                {userData.password_confirmation &&
                  userData.password &&
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

            {apiError && (
              <Alert
                message={apiError}
                type="error"
                showIcon
                style={{ marginBottom: "1rem", direction: "rtl" }}
                action={
                  invalidToken && (
                    <Link to="/auth/forgot-password">طلب رابط جديد</Link>
                  )
                }
              />
            )}

            {success && (
              <Alert
                message={success.replace(/\d+/, countdown)}
                type="success"
                showIcon
                style={{ marginBottom: "1rem", direction: "rtl" }}
              />
            )}

            <div className="box box-btn">
              <button
                type="submit"
                style={{ borderRadius: "0.6rem" }}
                className="tf-btn primary text-dark w-100"
                disabled={loading || success}
                onClick={handleSubmit}
              >
                {loading ? <OvalLoader /> : "تعيين كلمة المرور"}
              </button>

              <div style={{ margin: "15px 0" }} className="text text-center">
                <Link to={`/auth/login`} replace>
                  العودة الى تسجيل الدخول
                </Link>
              </div>
            </div>
          </Form>
        </div>

        {/* <div className="login-image">
          <img
            alt="banner"
            src="/images/banner/login5.jpg"
            width="100%"
            height="100%"
          />
        </div> */}
      </div>
    </>
  );
};

export default ResetPassword;
