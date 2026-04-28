import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearOtpErrors } from "@/redux/actions/authActions";
import styled from "styled-components";
import { Alert, Form, Input, Button } from "antd";
import {
  verifyAccount,
  resendOtp,
  resetAuthErrors,
} from "@/redux/actions/authActions";
import OvalLoader from "@/components/OvalLoader";
import toastNotify from "@/utils/toast";
import MetaComponent from "@/components/common/MetaComponent";
import Loader from "@/components/Loader";

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

const OTP_TIMEOUT = 180;

export default function Otp() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(() => {
    const savedTimer = localStorage.getItem("otpTimer");
    return savedTimer ? parseInt(savedTimer, 10) : 0;
  });
  const [isTimerActive, setIsTimerActive] = useState(() => {
    const savedTimer = localStorage.getItem("otpTimer");
    return savedTimer && parseInt(savedTimer, 10) > 0;
  });
  const [hasResentOnce, setHasResentOnce] = useState(() => {
    return localStorage.getItem("hasResentOnce") === "true";
  });
  const [checkingRoute, setCheckingRoute] = useState(true);
  const { verifyingAccount, verifyError, resendingOtp, resendOtpError } =
    useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetAuthErrors());
  }, [dispatch]);

  useEffect(() => {
    const emailFromLocation = location?.state?.email;
    const fromRoute = location?.state?.from;
    if (!emailFromLocation || !["login", "signup"].includes(fromRoute)) {
      navigate("/auth/login", { replace: true });
      return;
    }
    setEmail(emailFromLocation);
    setCheckingRoute(false);
  }, [location, navigate]);

  useEffect(() => {
    if (!isTimerActive || timer <= 0) {
      localStorage.removeItem("otpTimer");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTimer = prev - 1;
        localStorage.setItem("otpTimer", newTimer);
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  useEffect(() => {
    if (timer === 0) {
      setIsTimerActive(false);
      localStorage.removeItem("otpTimer");
    }
  }, [timer]);

  useEffect(() => {
    localStorage.setItem("hasResentOnce", hasResentOnce);
  }, [hasResentOnce]);

  const handleVerify = async (values) => {
    try {
      await form.validateFields(["otp"]);
      dispatch(resetAuthErrors());
      const result = await dispatch(verifyAccount({ email, otp: values.otp }));
      if (result?.success) {
        toastNotify("تم التحقق من الحساب بنجاح", "success");
        localStorage.removeItem("otpTimer");
        localStorage.removeItem("hasResentOnce");
        navigate("/");
      }
    } catch (error) {
      toastNotify(
        "حدث خطأ أثناء التحقق من الرمز. يرجى المحاولة مرة أخرى.",
        "error"
      );
      form.setFieldsValue({ otp: "" });
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (resendingOtp || (hasResentOnce && timer > 0)) return;

    try {
      const result = await dispatch(resendOtp({ email }));
      if (result?.success) {
        dispatch(clearOtpErrors());
        form.setFieldsValue({ otp: "" });
        toastNotify(
          "تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح.",
          "success",
          "bottom-right"
        );
        setHasResentOnce(true);
        setTimer(OTP_TIMEOUT);
        setIsTimerActive(true);
        localStorage.setItem("otpTimer", OTP_TIMEOUT);
      }
    } catch (error) {
      toastNotify(
        "فشل في إعادة إرسال رمز التحقق. يرجى المحاولة مرة أخرى لاحقًا.",
        "error",
        "top-right"
      );
    }
  }, [dispatch, email, form, timer, hasResentOnce, resendingOtp]);

  const handleOtpChange = async (value) => {
    dispatch(clearOtpErrors());
    form.setFieldsValue({ otp: value });
    if (value.length === 6) {
      try {
        await form.validateFields(["otp"]);
        form.submit();
      } catch (e) {}
    }
  };

  const renderAlert = (message, type = "error") => (
    <Alert
      message={
        typeof message === "string"
          ? message
          : message?.email?.[0] || message?.message || "حدث خطأ"
      }
      type={type}
      showIcon
      style={{ marginBottom: "1rem", direction: "rtl" }}
    />
  );

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getResendButtonText = () => {
    if (resendingOtp) {
      return <OvalLoader />;
    } else if (!hasResentOnce) {
      return "لم يصلك رمز التحقق؟ أعد إرسال الرمز";
    } else if (timer > 0) {
      return `إعادة إرسال رمز التحقق (${formatTimer(timer)})`;
    } else {
      return "إعادة إرسال رمز التحقق";
    }
  };

  const metadata = {
    title: "Syria Souq | تأكيد الحساب",
    description: "ابحث عن أفضل عروض العقارات والسيارات للبيع وللإيجار في سوريا",
    keywords:
      "سوق, سوريا, إعلانات, بيع, شراء, مستعمل, جديد, سيارات, عقارات, أراضي, دراجات, موتورات, قوارب, سيارات مستعملة, سيارات للبيع, سيارات جديدة, أسعار السيارات, سوق السيارات, سيارات دمشق, سيارات حلب, سيارات حمص, سيارات اللاذقية, عقارات, شقق, شقق للبيع, شقق للإيجار, فلل, منازل, بيوت, أسعار العقارات, عقارات دمشق, عقارات حلب, عقارات حمص, عقارات اللاذقية, أراضي, أرض للبيع, شراء أرض, أسعار الأراضي, سوق الأراضي, أراضي دمشق, أراضي حلب, أراضي حمص, أراضي اللاذقية, قوارب, يخوت, قوارب مستعملة, قوارب جديدة, زوارق, سوق القوارب, قوارب صيد, قوارب دمشق, قوارب حلب, قوارب حمص, قوارب اللاذقية, دراجات, موتورات, دراجات مستعملة, دراجات للبيع, سوق الدراجات, دراجات دمشق, دراجات حلب, دراجات حمص, دراجات اللاذقية",
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
        <div className="login-form h-100 d-flex flex-column justify-content-center align-items-center">
          <Form form={form} className="form-account" onFinish={handleVerify}>
            <div className="title-box d-flex flex-column align-items-center">
              <Link to="/">
                <img
                  src="/images/logo/solo_logo.png"
                  alt="logo"
                  width="72"
                  className="mb-3"
                />
              </Link>
              <h4>تأكيد رمز التحقق</h4>
              <span className="mt-3 fw-normal fs-6 text-variant-1">
                لقد أرسلنا رمز تحقق مكون من 6 أرقام إلى بريدك الإلكتروني{" "}
                <strong>{email}</strong>. يرجى إدخاله أدناه لمتابعة عملية
                التسجيل.
              </span>
            </div>

            <Form.Item
              name="otp"
              validateTrigger="onFinish"
              rules={[
                { len: 6, message: "رمز التحقق يجب أن يكون 6 أرقام" },
                { required: true, message: "يرجى إدخال رمز التحقق" },
                {
                  pattern: /^\d{6}$/,
                  message: "يجب أن يتكون الرمز من أرقام فقط!",
                },
              ]}
            >
              <Input.OTP
                size="large"
                inputType="number"
                style={{ width: "100%", direction: "ltr", marginTop: "2rem" }}
                onChange={handleOtpChange}
                length={6}
              />
            </Form.Item>

            {verifyError && renderAlert(verifyError)}
            {resendOtpError && renderAlert(resendOtpError)}

            <Form.Item>
              <button
                type="submit"
                className="tf-btn primary text-dark w-100"
                style={{ borderRadius: "0.6rem" }}
                disabled={verifyingAccount}
              >
                {verifyingAccount ? (
                  <span>
                    <OvalLoader />
                  </span>
                ) : (
                  "تأكيد"
                )}
              </button>
            </Form.Item>

            <Button
              type="link"
              className={`w-100 text-center text-dark fs-16`}
              onClick={handleResendOtp}
              disabled={resendingOtp || (hasResentOnce && timer > 0)}
            >
              {getResendButtonText()}
            </Button>
          </Form>
        </div>

        {/* <div className="login-image">
          <img
            src="/images/banner/login5.jpg"
            alt="banner"
            width="100%"
            height="100%"
          />
        </div> */}
      </div>
    </>
  );
}
