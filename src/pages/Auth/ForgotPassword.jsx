import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Alert, Form, Input } from "antd";
import axios from "axios";
import { Mail01Icon } from "hugeicons-react";
import OvalLoader from "@/components/OvalLoader";
import MetaComponent from "@/components/common/MetaComponent";
import { emailRegex } from "@/utils/emailRegex";

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

const ForgotPassword = () => {
  const [credentials, setCredentials] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({ email: "" });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = { email: "" };
    let isValid = true;

    if (!credentials.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
      isValid = false;
    } else if (!validateEmail(credentials.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));

    if (attemptedSubmit) {
      const updatedErrors = { ...errors };

      if (name === "email") {
        if (!value) {
          updatedErrors.email = "البريد الإلكتروني مطلوب";
        } else if (!validateEmail(value)) {
          updatedErrors.email = "البريد الإلكتروني غير صالح";
        } else {
          updatedErrors.email = "";
        }
      }

      setErrors(updatedErrors);
    }

    setApiError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    setAttemptedSubmit(true);
    setApiError(null);
    setSuccess(null);

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/forgot-password",
          {
            email: credentials.email,
          }
        );

        if (response.data && response.data.message) {
          setSuccess(response.data.message);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 429) {
            setApiError(
              "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
            );
          } else if (
            error.response.data &&
            error.response.data.errors &&
            error.response.data.errors.email
          ) {
            setErrors((prev) => ({
              ...prev,
              email: error.response.data.errors.email[0],
            }));
          } else if (error.response.data && error.response.data.message) {
            setApiError(error.response.data.message);
          } else {
            setApiError("حدث خطأ أثناء محاولة استعادة كلمة المرور");
          }
        } else {
          setApiError("حدث خطأ في الاتصال بالخادم");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const renderAlert = (message, type = "error") => (
    <Alert
      message={message}
      type={type}
      showIcon
      style={{ marginBottom: "1rem", direction: "rtl" }}
    />
  );

  const metadata = {
    title: "Syria Souq | استرداد الحساب",
    description: "ابحث عن أفضل عروض العقارات والسيارات للبيع وللإيجار في سوريا",
    keywords:
      "سوق, سوريا, إعلانات, بيع, شراء, مستعمل, جديد, سيارات, عقارات, أراضي, دراجات, موتورات, قوارب, سيارات مستعملة, سيارات للبيع, سيارات جديدة, أسعار السيارات, سوق السيارات, سيارات دمشق, سيارات حلب, سيارات حمص, سيارات اللاذقية, عقارات, شقق, شقق للبيع, شقق للإيجار, فلل, منازل, بيوت, أسعار العقارات, عقارات دمشق, عقارات حلب, عقارات حمص, عقارات اللاذقية, أراضي, أرض للبيع, شراء أرض, أسعار الأراضي, سوق الأراضي, أراضي دمشق, أراضي حلب, أراضي حمص, أراضي اللاذقية, قوارب, يخوت, قوارب مستعملة, قوارب جديدة, زوارق, سوق القوارب, قوارب صيد, قوارب دمشق, قوارب حلب, قوارب حمص, قوارب اللاذقية, دراجات, موتورات, دراجات مستعملة, دراجات للبيع, سوق الدراجات, دراجات دمشق, دراجات حلب, دراجات حمص, دراجات اللاذقية",
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <div
        style={{ height: "100vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        {/* Left Side - Image */}
        {/* <div className="login-image">
          <img
            alt="banner"
            src="/images/banner/login5.jpg"
            width="100%"
            height="100%"
          />
        </div> */}
        {/* Right Side - Form */}
        <div className="login-form">
          <Form className="form-account" onFinish={handleSubmit}>
            <div className="title-box d-flex flex-column align-items-center">
              <Link to="/">
                <img
                  src="/images/logo/solo_logo.png"
                  alt="logo"
                  width="72"
                  className="mb-3"
                />
              </Link>
              <h4>استرداد الحساب</h4>
              <span className="mt-2 fw-normal fs-6 text-variant-1">
                أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
                الخاص بك.
              </span>
            </div>

            <div className="box">
              <fieldset className="box-fieldset mb-3 mt-3">
                <StyledInput
                  type="text"
                  name="email"
                  placeholder="ادخل البريد الالكتروني"
                  prefix={<Mail01Icon size={16} />}
                  value={credentials.email}
                  onChange={handleChange}
                  status={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <div className="text-danger mt-1 small">{errors.email}</div>
                )}
              </fieldset>
            </div>

            {apiError && renderAlert(apiError)}
            {success && renderAlert(success, "success")}

            <div className="box box-btn mt-0">
              <button
                type="submit"
                htmltype="submit"
                style={{ borderRadius: "0.6rem" }}
                className="tf-btn primary text-dark w-100"
                disabled={loading}
              >
                {loading ? <OvalLoader /> : "أرسل الرابط"}
              </button>

              <div style={{ margin: "15px 0" }} className="text text-center">
                <Link to={`/auth/login`}>العودة الى تسجيل الدخول</Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
