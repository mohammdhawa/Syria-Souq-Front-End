import React, { useRef, useState, useEffect } from "react";
import { Alert, Input, Select, Space } from "antd";
import styled from "styled-components";
import { Call02Icon, Mail01Icon, UserIcon } from "hugeicons-react";
import {
  getCountries,
  getCountryCallingCode,
  AsYouType,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js";
import { StyledTextArea } from "@/pages/publish-ad/styled";
import api from "@/redux/api";
import OvalLoader from "../OvalLoader";
import toastNotify from "@/utils/toast";
import ReCAPTCHA from "react-google-recaptcha";
import { emailRegex } from "@/utils/emailRegex";

const StyledPhoneInput = styled(Input)`
  height: 3.375rem !important;
  font-size: 1rem !important;
  width: 100% !important;
  color: black !important;
  border-radius: 0.6rem 0 0 0.6rem !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  text-align: right;
  input {
    direction: ltr !important;
    text-align: right !important;
  }
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

const StyledSpaceCompact = styled(Space.Compact)`
  width: 100% !important;
`;

const StyledSelect = styled(Select)`
  height: 3.375rem !important;
  width: 100% !important;
  color: black !important;
  .ant-select-selector {
    border-radius: 0 0.6rem 0.6rem 0 !important;
    padding-left: 2rem !important;
    padding-right: 2rem !important;
    font-size: 1rem !important;
    background: rgba(0, 0, 0, 0.008) !important;
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

const RecaptchaContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  margin-bottom: 0.5rem;
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default function Contact() {
  const formRef = useRef();
  const recaptchaRef = useRef();
  const allCountries = getCountries();
  const defaultCountry = "SY";
  const [apiError, setApiError] = useState(null);

  const [countryCode, setCountryCode] = useState(
    `+${getCountryCallingCode(defaultCountry)}`
  );
  const [countryIso, setCountryIso] = useState(defaultCountry);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    formattedPhone: "",
    fullPhone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaError, setRecaptchaError] = useState("");

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone, countryIsoCode) => {
    if (!phone) return "الرجاء إدخال رقم الهاتف";
    const fullPhoneNumber = `${countryCode}${phone.replace(/\D/g, "")}`;

    try {
      const isValid = isValidPhoneNumber(fullPhoneNumber, countryIsoCode);
      if (!isValid) return "رقم الهاتف غير صالح";

      const phoneNumber = parsePhoneNumber(fullPhoneNumber, countryIsoCode);
      if (!phoneNumber) return "رقم الهاتف غير صالح";

      return null;
    } catch (error) {
      return "رقم الهاتف غير صالح";
    }
  };

  const validateField = (name, value) => {
    if (name === "firstName") {
      return value.trim() ? null : "الرجاء إدخال الاسم الأول";
    }
    if (name === "lastName") {
      return value.trim() ? null : "الرجاء إدخال الاسم الأخير";
    }
    if (name === "email") {
      if (!value) return "الرجاء إدخال البريد الإلكتروني";
      if (!validateEmail(value)) return "البريد الإلكتروني غير صالح";
      return null;
    }
    if (name === "phone") {
      return validatePhoneNumber(value, countryIso);
    }
    if (name === "message") {
      if (value.trim().length > 200) {
        return "الحد الأقصى لنص الرسالة هو 200 حرف";
      }
      return value.trim() ? null : "الرجاء إدخال رسالتك";
    }
    if (name === "recaptcha") {
      return value ? null : "الرجاء التحقق من أنك لست روبوتًا";
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "message",
      "recaptcha",
    ];
    fields.forEach((field) => {
      let value = field === "recaptcha" ? recaptchaToken : formData[field];
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (phoneInput) => {
    const rawPhone = phoneInput.replace(/\D/g, "");

    try {
      const formatter = new AsYouType(countryIso);
      const formattedPhone = formatter.input(rawPhone);
      const fullPhone = `${countryCode} ${rawPhone}`;

      setFormData((prev) => ({
        ...prev,
        phone: rawPhone,
        formattedPhone,
        fullPhone,
      }));

      const phoneError = validatePhoneNumber(rawPhone, countryIso);
      setFormErrors((prev) => ({
        ...prev,
        phone: phoneError || undefined,
      }));
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        phone: rawPhone,
        formattedPhone: rawPhone,
        fullPhone: `${countryCode} ${rawPhone}`,
      }));
    }
  };

  const handleCountryCodeChange = (value) => {
    setCountryIso(value);
    setCountryCode(`+${getCountryCallingCode(value)}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      formatPhoneNumber(value);
      return;
    }

    const processedValue = name === "email" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    const error = validateField(name, processedValue);
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    if (token) {
      setRecaptchaError("");
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.recaptcha;
        return newErrors;
      });
    } else {
      setRecaptchaError("الرجاء التحقق من أنك لست روبوتًا");
      setFormErrors((prev) => ({
        ...prev,
        recaptcha: "الرجاء التحقق من أنك لست روبوتًا",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!recaptchaToken) {
      setRecaptchaError("الرجاء التحقق من أنك لست روبوتًا");
      setFormErrors((prev) => ({
        ...prev,
        recaptcha: "الرجاء التحقق من أنك لست روبوتًا",
      }));
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const formattedPhoneForApi = `${countryCode} ${formData.phone.replace(
        /\D/g,
        ""
      )}`;

      try {
        const payload = {
          name: fullName,
          email: formData.email,
          phone: formattedPhoneForApi,
          message: formData.message,
        };

        const response = await api.post("/system-complaints", payload);
        if (response.status === 200 && response.data.success) {
          setSubmitSuccess(true);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            formattedPhone: "",
            fullPhone: "",
            message: "",
          });
          setRecaptchaToken("");
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
          toastNotify("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.", "success");
        } else {
          if (response.status === 429) {
            setApiError(
              "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
            );
          } else {
            setApiError("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
          }
        }
      } catch (error) {
        setApiError(
          error.response?.data?.message ||
            "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const filterOption = (input, option) => {
    const country = option.value;
    const countryName = option.children.props.children[1].props.children;
    return (
      countryName.toLowerCase().includes(input.toLowerCase()) ||
      country.toLowerCase().includes(input.toLowerCase())
    );
  };

  useEffect(() => {
    if (formData.phone) {
      formatPhoneNumber(formData.phone);
    }
  }, [countryCode, countryIso]);

  const getFlagUrl = (countryCode) => {
   
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  return (
    <>
      <section className="flat-section flat-contact">
        <div className="container ">
          <div className="row contact-row">
            <div className="col-lg-6">
              <div className="contact-info">
                <h4>معلوماتنا</h4>
                <ul>
                  <li className="box">
                    <h6 className="title">العنوان :</h6>
                    <p className="text-variant-1">
                      101 شارع 92، شرق حلب، سوريا
                    </p>
                  </li>
                  <li className="box">
                    <h6 className="title">معلومات التواصل :</h6>
                    <p className="text-variant-1">
                      +963951501948 <br />
                      info@syr-souq.com
                    </p>
                  </li>
                  <li className="box">
                    <div className="title">أوقات العمل :</div>
                    <p className="text-variant-1">
                      الأحد - الاثنين : 08:00 - 20:00 <br />
                      الثلاثاء - الأربعاء : 10:00 - 18:00
                    </p>
                  </li>
                  <li className="box">
                    <div className="title">تابعونا :</div>
                    <ul className="box-social">
                      <li>
                        <a href="https://www.facebook.com/profile.php?id=61578787598408" target="_blank" rel="noopener noreferrer" className="item">
                          <svg
                            width={10}
                            height={18}
                            viewBox="0 0 10 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.00879 10.125L9.50871 6.86742H6.38297V4.75348C6.38297 3.86227 6.81961 2.99355 8.21953 2.99355H9.64055V0.220078C9.64055 0.220078 8.35102 0 7.11809 0C4.54395 0 2.86137 1.56023 2.86137 4.38469V6.86742H0V10.125H2.86137V18H6.38297V10.125H9.00879Z"
                              fill="#161E2D"
                            />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/syriasouq_official/" target="_blank" rel="noopener noreferrer" className="item">
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.00245 4.38427C6.4484 4.38427 4.38828 6.44438 4.38828 8.99844C4.38828 11.5525 6.4484 13.6126 9.00245 13.6126C11.5565 13.6126 13.6166 11.5525 13.6166 8.99844C13.6166 6.44438 11.5565 4.38427 9.00245 4.38427ZM9.00245 11.9983C7.35195 11.9983 6.00264 10.653 6.00264 8.99844C6.00264 7.34392 7.34794 5.99862 9.00245 5.99862C10.657 5.99862 12.0023 7.34392 12.0023 8.99844C12.0023 10.653 10.653 11.9983 9.00245 11.9983ZM14.8816 4.19552C14.8816 4.79388 14.3997 5.27176 13.8054 5.27176C13.207 5.27176 12.7291 4.78986 12.7291 4.19552C12.7291 3.60118 13.211 3.11928 13.8054 3.11928C14.3997 3.11928 14.8816 3.60118 14.8816 4.19552ZM17.9376 5.28782C17.8694 3.84615 17.5401 2.56912 16.4839 1.51697C15.4318 0.46483 14.1547 0.135534 12.7131 0.0632491C11.2272 -0.021083 6.77368 -0.021083 5.28782 0.0632491C3.85016 0.131518 2.57313 0.460815 1.51697 1.51296C0.460815 2.5651 0.135534 3.84213 0.0632491 5.28381C-0.021083 6.76966 -0.021083 11.2232 0.0632491 12.7091C0.131518 14.1507 0.460815 15.4278 1.51697 16.4799C2.57313 17.532 3.84615 17.8613 5.28782 17.9336C6.77368 18.018 11.2272 18.018 12.7131 17.9336C14.1547 17.8654 15.4318 17.5361 16.4839 16.4799C17.5361 15.4278 17.8654 14.1507 17.9376 12.7091C18.022 11.2232 18.022 6.77368 17.9376 5.28782ZM16.0181 14.3033C15.7048 15.0904 15.0985 15.6968 14.3073 16.0141C13.1227 16.4839 10.3116 16.3755 9.00245 16.3755C7.6933 16.3755 4.87821 16.4799 3.69756 16.0141C2.91046 15.7008 2.30407 15.0944 1.98682 14.3033C1.51697 13.1187 1.6254 10.3076 1.6254 8.99844C1.6254 7.68928 1.52099 4.8742 1.98682 3.69355C2.30006 2.90645 2.90645 2.30006 3.69756 1.98281C4.88223 1.51296 7.6933 1.62139 9.00245 1.62139C10.3116 1.62139 13.1267 1.51697 14.3073 1.98281C15.0944 2.29604 15.7008 2.90243 16.0181 3.69355C16.4879 4.87821 16.3795 7.68928 16.3795 8.99844C16.3795 10.3076 16.4879 13.1227 16.0181 14.3033Z"
                              fill="#161E2D"
                            />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.tiktok.com/@syriasouq_official?_t=ZS-90myT93tVCB&_r=1" target="_blank" rel="noopener noreferrer" className="item">
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                              fill="#161E2D"
                            />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="box">
                    <div className="title">حمل التطبيق :</div>
                    <div className="d-flex flex-column gap-2 mt-2">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.syriasouq.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center gap-2"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="text-variant-1">Google Play</span>
                      </a>
                      <a
                        href="https://apps.apple.com/tr/app/%D8%B3%D9%88%D9%82-%D8%B3%D9%88%D8%B1%D9%8A%D8%A7/id6751295790"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center gap-2"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="text-variant-1">App Store</span>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div
              style={{
                paddingRight: "3rem",
              }}
              className="col-lg-6 contact-col"
            >
              <div className="contact-content">
                <h3 className="mb-2">تواصل معنا الـــآن</h3>
                <p className="body-2  text-variant-1">
                  للتواصل أو الإبلاغ عن مشكلة، يرجى ملء النموذج أدناه
                </p>

                <form
                  ref={formRef}
                  style={{
                    marginTop: "1.5rem",
                  }}
                  className="form-contact d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
                  <div className="d-flex gap-2 w-100 px-0">
                    <fieldset className="box-fieldset mb-3 w-100 ">
                      <label
                        className="mb-2 fs-6 fw-normal"
                        htmlFor="firstName"
                      >
                        الاسم الأول
                      </label>
                      <StyledInput
                        type="text"
                        placeholder="ادخل الاسم الأول"
                        name="firstName"
                        id="firstName"
                        prefix={<UserIcon size={16} />}
                        value={formData.firstName}
                        onChange={handleChange}
                        status={formErrors.firstName ? "error" : ""}
                      />
                      {formErrors.firstName && (
                        <div className="text-danger mt-1 small">
                          {formErrors.firstName}
                        </div>
                      )}
                    </fieldset>

                    <fieldset className="box-fieldset mb-3 w-100">
                      <label className="mb-2 fs-6 fw-normal" htmlFor="lastName">
                        الاسم الأخير
                      </label>
                      <StyledInput
                        type="text"
                        placeholder="ادخل الاسم الأخير"
                        name="lastName"
                        id="lastName"
                        prefix={<UserIcon size={16} />}
                        value={formData.lastName}
                        onChange={handleChange}
                        status={formErrors.lastName ? "error" : ""}
                      />
                      {formErrors.lastName && (
                        <div className="text-danger mt-1 small">
                          {formErrors.lastName}
                        </div>
                      )}
                    </fieldset>
                  </div>

                  <fieldset className="box-fieldset mb-3 w-100">
                    <label className="mb-2 fs-6 fw-normal" htmlFor="email">
                      البريد الإلكتروني
                    </label>
                    <StyledInput
                      type="text"
                      placeholder="ادخل بريد الالكتروني"
                      name="email"
                      id="email"
                      prefix={<Mail01Icon size={16} />}
                      value={formData.email}
                      onChange={handleChange}
                      status={formErrors.email ? "error" : ""}
                    />
                    {formErrors.email && (
                      <div className="text-danger mt-1 small">
                        {formErrors.email}
                      </div>
                    )}
                  </fieldset>

                  <fieldset className="box-fieldset mb-3 w-100">
                    <label className="mb-2 fs-6 fw-normal" htmlFor="phone">
                      رقم الهاتف
                    </label>
                    <StyledSpaceCompact
                      className="w-100 gap-0"
                      direction="horizontal"
                    >
                      <div
                        className="col-lg-3 col-sm-4 col-xs-4"
                        style={{
                          paddingLeft: "0",
                        }}
                      >
                        <StyledSelect
                          placeholder="اختر رمز الدولة"
                          filterOption={filterOption}
                          showSearch
                          optionLabelProp="label"
                          value={countryIso}
                          onChange={handleCountryCodeChange}
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
                          status={formErrors.phone ? "error" : ""}
                        >
                          {allCountries.map((country) => (
                            <Select.Option
                              key={country}
                              value={country}
                              label={
                                <OptionContainer>
                                  <img
                                    loading="lazy"
                                    src={getFlagUrl(country.toLowerCase())}
                                    alt={country}
                                    style={{
                                      width: "24px",
                                      height: "18px",
                                    }}
                                  />
                                </OptionContainer>
                              }
                            >
                              <OptionContainer>
                                <img
                                  loading="lazy"
                                  src={getFlagUrl(country.toLowerCase())}
                                  alt={country}
                                  style={{
                                    width: "24px",
                                    height: "18px",
                                    marginRight: "8px",
                                  }}
                                />
                                <span dir="ltr">{`+${getCountryCallingCode(
                                  country
                                )}`}</span>
                              </OptionContainer>
                            </Select.Option>
                          ))}
                        </StyledSelect>
                      </div>
                      <div
                        style={{
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                        className="col-lg-9 col-sm-8 col-xs-8"
                      >
                        <StyledPhoneInput
                          type="text"
                          placeholder="ادخل رقم الهاتف"
                          prefix={<Call02Icon size={16} />}
                          name="phone"
                          id="phone"
                          value={formData.formattedPhone || ""}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                name: "phone",
                                value: e.target.value,
                              },
                            });
                          }}
                          status={formErrors.phone ? "error" : ""}
                        />
                      </div>
                    </StyledSpaceCompact>
                    {formErrors.phone && (
                      <div className="text-danger mt-1 small">
                        {formErrors.phone}
                      </div>
                    )}
                  </fieldset>

                  <fieldset className="box-fieldset mb-0 w-100">
                    <label className="mb-2 fs-6 fw-normal" htmlFor="message">
                      رسالتك
                    </label>
                    <StyledTextArea
                      name="message"
                      placeholder="اترك لنا رسالة.."
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      status={formErrors.message ? "error" : ""}
                      maxLength={200}
                    />
                    <div className="w-100 d-flex align-items-center justify-content-between">
                      {formErrors.message && (
                        <div className="text-danger mt-1 w-100 small">
                          {formErrors.message}
                        </div>
                      )}
                      <span
                        style={{
                          textAlign: "end",
                        }}
                        className="mt-1 text-variant-1 w-100"
                      >
                        200 / {formData.message.length}
                      </span>
                    </div>
                  </fieldset>

                  <RecaptchaContainer>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6Ld2Fz4rAAAAAGgIFFLOWrxAYzcHWy9MafiKApfR"
                      onChange={handleRecaptchaChange}
                      hl="ar"
                    />
                  </RecaptchaContainer>
                  {recaptchaError && (
                    <div className="text-danger mb-2 w-100 small">
                      {recaptchaError}
                    </div>
                  )}

                  <button
                    className="tf-btn text-dark primary mt-0 size-1"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <OvalLoader /> : "إرسال"}
                  </button>
                  {apiError && (
                    <Alert
                      className="mt-2 w-100"
                      message={apiError}
                      type="error"
                      closable
                      showIcon
                    >
                      {apiError}
                    </Alert>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
