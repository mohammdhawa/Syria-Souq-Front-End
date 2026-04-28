import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Alert, Form, Input } from "antd";
import {
  Mail01Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffIcon,
} from "hugeicons-react";
import OvalLoader from "../OvalLoader";
import { login, resetLoginErrors } from "@/redux/actions/authActions";
import { emailRegex } from "@/utils/emailRegex";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

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

const LoginSection = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, redirectToVerify, redirectEmail } = useSelector(
    (state) => state.auth
  );
  const { handleGoogleLogin, isLoading: googleLoading, error: googleError } = useGoogleAuth();

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!credentials.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
      isValid = false;
    } else if (!validateEmail(credentials.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
      isValid = false;
    }

    if (!credentials.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      isValid = false;
    }
    if (credentials.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    dispatch(resetLoginErrors());
    return () => {
      dispatch(resetLoginErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    if (redirectToVerify && redirectEmail) {
      navigate("/auth/verify-otp", {
        state: { email: redirectEmail, from: "login" },
      });
    }
  }, [redirectToVerify, redirectEmail, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === "email" ? value.toLowerCase() : value;

    setCredentials((prev) => ({ ...prev, [name]: processedValue }));

    if (attemptedSubmit) {
      const updatedErrors = { ...errors };

      if (name === "email") {
        if (!processedValue) {
          updatedErrors.email = "البريد الإلكتروني مطلوب";
        } else if (!validateEmail(processedValue)) {
          updatedErrors.email = "البريد الإلكتروني غير صالح";
        } else {
          updatedErrors.email = "";
        }
      }

      if (name === "password") {
        updatedErrors.password = !processedValue ? "كلمة المرور مطلوبة" : "";
      }

      setErrors(updatedErrors);
    }
  };

  const handleSubmit = async (e) => {
    setAttemptedSubmit(true);

    if (validateForm()) {
      const result = await dispatch(
        login(credentials.email, credentials.password)
      );
      if (result?.success) {
      }
    }
  };
  const handleFacebookLogin = () => {
    window.open(
      "https://www.facebook.com/v3.3/dialog/oauth?client_id=1358995048639085&redirect_uri=https%3A%2F%2Fstaging.syr-souq.com%2Fapi%2Fauth%2Ffacebook%2Fcallback&scope=email&response_type=code",
      "_self"
    );
  };

  const handleGoogleLoginClick = async () => {
    try {
      await handleGoogleLogin();
    } catch (err) {
      console.error('Google login error:', err);
    }
  };
  return (
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
      <div className="login-form ">
        <Form className="form-account" onFinish={handleSubmit}>
          <div style={{ padding: "25px 0" }} className="title-box">
            <Link to={"/"}>
              <img
                alt="logo"
                src="/images/logo/solo_logo.png"
                width="72px"
                className="mb-3"
              />
            </Link>
            <h4>تسجيل الدخول</h4>
          </div>

          <div className="box">
            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="email">
                البريد الالكتروني
              </label>
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

            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="password">
                كلمة المرور
              </label>
              <StyledInputPassword
                name="password"
                placeholder="ادخل كلمة المرور"
                prefix={<LockPasswordIcon size={16} />}
                iconRender={(visible) =>
                  visible ? <ViewIcon size={16} /> : <ViewOffIcon size={16} />
                }
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                value={credentials.password}
                onChange={handleChange}
                status={errors.password ? "error" : ""}
              />
              {errors.password && (
                <div className="text-danger mt-1 small">{errors.password}</div>
              )}
              <div className="text-forgot text-start mt-2">
                <Link to="/auth/forgot-password">نسيت كلمة المرور؟</Link>
              </div>
            </fieldset>
          </div>

          {error && typeof error === "string" && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: "1rem", direction: "rtl" }}
            />
          )}

          {googleError && (
            <Alert
              message={googleError}
              type="error"
              showIcon
              style={{ marginBottom: "1rem", direction: "rtl" }}
            />
          )}

          <div className="box box-btn">
            <button
              type="submit"
              htmltype="submit"
              style={{ borderRadius: "0.6rem" }}
              className="tf-btn primary text-dark w-100"
              disabled={loading}
            >
              {loading ? <OvalLoader /> : "تسجيل الدخول"}
            </button>

            <div style={{ margin: "15px 0" }} className="text text-center">
              ليس لديك حساب؟ <Link to={`/auth/signup`}>انشاء حساب جديد</Link>
            </div>
          </div>

          {/* Social Login */}
          <div className="d-flex align-items-center text-center">
            <hr className="flex-grow-1 border-secondary" />
            <span className="px-3 text-muted">أو سجل عن طريق</span>
            <hr className="flex-grow-1 border-secondary" />
          </div>
          <div className="group-btn mt-1">
            <a
              onClick={handleGoogleLoginClick}
              style={{ borderRadius: "0.6rem" }}
              className="btn-social"
              disabled={googleLoading}
            >
              <img
                alt="google"
                src="/images/logo/google.jpg"
                width={37}
                height={36}
              />
            </a>
            <a
              onClick={handleFacebookLogin}
              style={{ borderRadius: "0.6rem" }}
              className="btn-social"
            >
              <img
                alt="facebook"
                src="/images/logo/fb.jpg"
                width={31}
                height={30}
              />
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginSection;
