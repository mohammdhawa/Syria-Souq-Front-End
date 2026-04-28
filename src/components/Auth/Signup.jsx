import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Alert, Form, Input, Progress, Checkbox, Select, Space } from "antd";
import {
  Call02Icon,
  LockPasswordIcon,
  Mail01Icon,
  PasswordValidationIcon,
  UserIcon,
  ViewIcon,
  ViewOffIcon,
} from "hugeicons-react";
import OvalLoader from "../OvalLoader";
import { register, resetRegisterErrors } from "@/redux/actions/authActions";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
  AsYouType,
  isValidPhoneNumber,
} from "libphonenumber-js";
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

const StyledPhoneInput = styled(Input)`
  width: 100% !important;
  height: 3.375rem !important;
  font-size: 1rem !important;
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

const StyledSpaceCompact = styled(Space.Compact)`
  width: 100% !important;
`;

const StyledCheckbox = styled(Checkbox)`
  direction: rtl;
  text-align: right;
  display: flex;
  align-items: center;
  .ant-checkbox {
    margin-right: 0;
  }
  .ant-checkbox-label {
    line-height: 0 !important;
  }
  .ant-checkbox + span {
    padding-right: 8px;
    padding-left: 0;
  }
`;

const StyledSelect = styled(Select)`
  width: 40% !important;
  height: 3.375rem !important;
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
  @media only screen and (max-width: 1920px) {
    width: 30% !important;
  }
  @media only screen and (max-width: 1300px) {
    width: 40% !important;
  }
  @media only screen and (max-width: 1199px) {
    width: 50% !important;
  }
  @media only screen and (max-width: 1000px) {
    width: 55% !important;
  }
  @media only screen and (max-width: 991px) {
    width: 40% !important;
  }
  @media only screen and (max-width: 850px) {
    width: 60% !important;
  }
  @media only screen and (max-width: 600px) {
    width: 50% !important;
  }
  @media only screen and (max-width: 440px) {
    width: 80% !important;
    .ant-select-selector {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
  @media only screen and (max-width: 360px) {
    width: 100% !important;
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SignupSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registering, registerError } = useSelector((state) => state.auth);

  const allCountries = getCountries();
  const defaultCountry = "SY";

  const [countryCode, setCountryCode] = useState(
    `+${getCountryCallingCode(defaultCountry)}`
  );
  const [countryIso, setCountryIso] = useState(defaultCountry);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    formattedPhone: "",
    fullPhone: "",
    password: "",
    confirm_password: "",
    acceptTerms: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const isMinLength = userData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(userData.password);
  const hasLowerCase = /[a-z]/.test(userData.password);
  const hasNumber = /\d/.test(userData.password);
  const hasSymbol = /[^A-Za-z0-9]/.test(userData.password);
  const passwordsMatch =
    userData.password === userData.confirm_password &&
    userData.confirm_password !== "";

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  };

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone, countryIsoCode) => {
    if (!phone) return null; // Allow empty phone number
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

  const validateField = (name, value, data = userData) => {
    if (name === "name") {
      return value.trim() ? null : "الرجاء إدخال اسم المستخدم";
    }
    if (name === "email") {
      if (!value) return "الرجاء إدخال البريد الإلكتروني";
      if (!validateEmail(value)) return "البريد الإلكتروني غير صالح";
      return null;
    }
    if (name === "phone") {
      return validatePhoneNumber(value, countryIso);
    }
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
    if (name === "confirm_password") {
      if (!value) return "الرجاء تأكيد كلمة المرور";
      if (value && data.password !== value) return "كلمات المرور غير متطابقة";
      return null;
    }
    if (name === "acceptTerms") {
      return value
        ? null
        : "يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة";
    }
    return null;
  };

  const validateForm = (data = userData) => {
    const newErrors = {};
    const fields = [
      "name",
      "email",
      "password",
      "confirm_password",
      "acceptTerms",
    ];
    fields.forEach((field) => {
      const error = validateField(
        field,
        field === "acceptTerms" ? data.acceptTerms : data[field],
        data
      );
      if (error) newErrors[field] = error;
    });

    // Validate phone only if provided
    if (data.phone) {
      const phoneError = validateField("phone", data.phone, data);
      if (phoneError) newErrors.phone = phoneError;
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filterOption = (input, option) => {
    const country = option.value;
    const countryName = option.children.props.children[1].props.children;
    return (
      countryName.toLowerCase().includes(input.toLowerCase()) ||
      country.toLowerCase().includes(input.toLowerCase())
    );
  };

  const passwordStrength = calculatePasswordStrength(userData.password);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "#ff4d4f";
    if (passwordStrength < 80) return "#faad14";
    return "#52c41a";
  };

  useEffect(() => {
    dispatch(resetRegisterErrors());
    setFormErrors({});
    return () => {
      dispatch(resetRegisterErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    if (registerError && typeof registerError === "object") {
      const backendErrors = {};
      if (registerError.email) backendErrors.email = registerError.email[0];
      if (registerError.phone) backendErrors.phone = registerError.phone[0];
      if (registerError.password)
        backendErrors.password = registerError.password[0];
      if (registerError.confirm_password)
        backendErrors.confirm_password = registerError.confirm_password[0];
      setFormErrors((prev) => ({ ...prev, ...backendErrors }));
    }
  }, [registerError]);

  useEffect(() => {
    if (userData.phone) {
      formatPhoneNumber(userData.phone);
    }
  }, [countryCode, countryIso]);

  const formatPhoneNumber = (phoneInput) => {
    const rawPhone = phoneInput.replace(/\D/g, "");

    try {
      const formatter = new AsYouType(countryIso);
      const formattedPhone = formatter.input(rawPhone);
      const fullPhone = `${countryCode} ${rawPhone}`;

      setUserData((prev) => ({
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
      setUserData((prev) => ({
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
    const updatedData = { ...userData, [name]: processedValue };
    setUserData(updatedData);

    const error = validateField(name, processedValue, updatedData);
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      const relatedField =
        name === "password"
          ? "confirm_password"
          : name === "confirm_password"
            ? "password"
            : null;
      if (relatedField) {
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

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setUserData((prev) => ({ ...prev, acceptTerms: checked }));
    const error = validateField("acceptTerms", checked);
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors.acceptTerms = error;
      } else {
        delete newErrors.acceptTerms;
      }
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (validateForm()) {
      const submitData = {
        ...userData,
      };

      // Only include phone if it's provided
      if (userData.fullPhone) {
        submitData.phone = userData.fullPhone;
      } else {
        delete submitData.phone;
      }

      delete submitData.formattedPhone;
      delete submitData.fullPhone;

      const result = await dispatch(register(submitData));

      if (result?.success) {
        navigate("/auth/verify-otp", {
          state: { email: userData.email, from: "signup" },
        });
      }
    }
  };

  const getFlagUrl = (countryCode) => {

    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };
  const handleFacebookLogin = () => {
    window.open(
      "https://www.facebook.com/v3.3/dialog/oauth?client_id=1358995048639085&redirect_uri=https%3A%2F%2Fstaging.syr-souq.com%2Fapi%2Fauth%2Ffacebook%2Fcallback&scope=email&response_type=code",
      "_self"
    );
  };

  const handleGoogleLogin = () => {
    window.open(
      "https://accounts.google.com/o/oauth2/auth?client_id=971561545305-hkrgn54vmh4nk3a3bnf94c98pj1e1dk3.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fstaging.syr-souq.com%2Fapi%2Fauth%2Fgoogle%2Fcallback&scope=openid+profile+email&response_type=code",
      "_self"
    );
  };

  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex align-items-center justify-content-center"
    >
      <div className="login-form">
        <Form className="form-account" onSubmit={handleSubmit}>
          <div style={{ padding: "0px 0px 25px 0px" }} className="title-box">
            <Link to={"/"}>
              <img
                alt="logo"
                src="/images/logo/solo_logo.png"
                width="72px"
                className="mb-3"
              />
            </Link>
            <h4>تسجيل حساب جديد</h4>
          </div>

          <div className="box">
            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="name">
                اسم المستخدم
              </label>
              <StyledInput
                type="text"
                placeholder="ادخل الاسم الكامل"
                prefix={<UserIcon size={16} />}
                name="name"
                value={userData.name}
                onChange={handleChange}
                status={formErrors.name ? "error" : ""}
              />
              {formErrors.name && (
                <div className="text-danger mt-1 small">{formErrors.name}</div>
              )}
            </fieldset>

            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="email">
                البريد الالكتروني
              </label>
              <StyledInput
                type="text"
                placeholder="ادخل البريد الالكتروني"
                prefix={<Mail01Icon size={16} />}
                name="email"
                value={userData.email}
                onChange={handleChange}
                status={formErrors.email ? "error" : ""}
              />
              {formErrors.email && (
                <div className="text-danger mt-1 small">{formErrors.email}</div>
              )}
            </fieldset>

            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="phone">
                رقم الهاتف (اختياري)
              </label>
              <StyledSpaceCompact direction="horizontal">
                <StyledSelect
                  placeholder="اختر رمز الدولة"
                  style={{ width: "100%" }}
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

                <StyledPhoneInput
                  type="text"
                  placeholder="ادخل رقم الهاتف"
                  prefix={<Call02Icon size={16} />}
                  name="phone"
                  value={userData.formattedPhone || ""}
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
              </StyledSpaceCompact>
              {formErrors.phone && (
                <div className="text-danger mt-1 small">{formErrors.phone}</div>
              )}
            </fieldset>

            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="password">
                كلمة المرور
              </label>
              <StyledInputPassword
                placeholder="ادخل كلمة المرور"
                prefix={<LockPasswordIcon size={16} />}
                iconRender={(visible) =>
                  visible ? <ViewIcon size={16} /> : <ViewOffIcon size={16} />
                }
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                name="password"
                value={userData.password}
                onChange={handleChange}
                status={formErrors.password ? "error" : ""}
              />
              {formErrors.password && (
                <div className="text-danger mt-1 small">
                  {formErrors.password}
                </div>
              )}

              {/* {userData.password && (
                <>
                  <Progress
                    percent={passwordStrength}
                    showInfo={false}
                    strokeColor={getStrengthColor()}
                    className="mt-2"
                    size="small"
                  />
                  <div className="password-requirements d-flex flex-wrap mt-2">
                    <div className="small mb-1">
                      {isMinLength ? (
                        <CheckCircleOutlined className="text-success me-1" />
                      ) : (
                        <CloseCircleOutlined className="text-danger me-1" />
                      )}
                      8 أحرف على الأقل
                    </div>
                    <div className="small me-3 mb-1">
                      {hasUpperCase ? (
                        <CheckCircleOutlined className="text-success me-1" />
                      ) : (
                        <CloseCircleOutlined className="text-danger me-1" />
                      )}
                      حرف كبير
                    </div>
                    <div className="small me-3 mb-1">
                      {hasLowerCase ? (
                        <CheckCircleOutlined className="text-success me-1" />
                      ) : (
                        <CloseCircleOutlined className="text-danger me-1" />
                      )}
                      حرف صغير
                    </div>
                    <div className="small me-3 mb-1">
                      {hasNumber ? (
                        <CheckCircleOutlined className="text-success me-1" />
                      ) : (
                        <CloseCircleOutlined className="text-danger me-1" />
                      )}
                      رقم
                    </div>
                    <div className="small mb-1">
                      {hasSymbol ? (
                        <CheckCircleOutlined className="text-success me-1" />
                      ) : (
                        <CloseCircleOutlined className="text-danger me-1" />
                      )}
                      رمز خاص
                    </div>
                  </div>
                </>
              )} */}
            </fieldset>

            <fieldset className="box-fieldset mb-3">
              <label className="mb-1 fs-6 fw-normal" htmlFor="confirm_password">
                تأكيد كلمة المرور
              </label>
              <StyledInput
                type={passwordVisible ? "text" : "password"}
                placeholder="قم بتأكيد كلمة المرور"
                prefix={<PasswordValidationIcon size={16} />}
                name="confirm_password"
                value={userData.confirm_password}
                onChange={handleChange}
                status={formErrors.confirm_password ? "error" : ""}
              />
              {formErrors.confirm_password && (
                <div className="text-danger mt-1 small">
                  {formErrors.confirm_password}
                </div>
              )}
              {/* {userData.confirm_password &&
                userData.password &&
                passwordsMatch && (
                  <div className="mt-2 small text-success">
                    <CheckCircleOutlined className="me-1" />
                    كلمات المرور متطابقة
                  </div>
                )} */}
            </fieldset>

            <fieldset className="box-fieldset mb-3">
              <div className="d-flex justify-content-start">
                <StyledCheckbox
                  checked={userData.acceptTerms}
                  onChange={handleCheckboxChange}
                  className="fw-normal"
                >
                  أوافق على <Link to="/terms">شروط الاستخدام</Link> و{" "}
                  <Link to="/privacy-policy">سياسة الخصوصية</Link>
                </StyledCheckbox>
              </div>
              {formErrors.acceptTerms && (
                <div className="text-danger mt-1 small text-end">
                  {formErrors.acceptTerms}
                </div>
              )}
            </fieldset>
          </div>

          {registerError && typeof registerError === "string" && (
            <Alert
              message={registerError}
              type="error"
              showIcon
              className="mb-3"
            />
          )}

          <div className="box box-btn">
            <button
              type="submit"
              style={{ borderRadius: "0.6rem" }}
              className="tf-btn primary text-dark w-100"
              disabled={registering}
              onClick={handleSubmit}
            >
              {registering ? <OvalLoader /> : "تسجيل الحساب"}
            </button>

            <div style={{ margin: "15px 0" }} className="text text-center">
              هل لديك حساب بالفعل؟{" "}
              <Link to={`/auth/login`} className="img-style">
                تسجيل الدخول
              </Link>
            </div>
          </div>

          <div className="d-flex align-items-center text-center">
            <hr className="flex-grow-1 border-secondary" />
            <span className="px-3 text-muted">أو سجل عن طريق</span>
            <hr className="flex-grow-1 border-secondary" />
          </div>
          <div className="group-btn mt-1">
            <a
              onClick={handleGoogleLogin}
              style={{ borderRadius: "0.6rem" }}
              className="btn-social"
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

      {/* <div className="login-image">
        <img
          alt="banner"
          src="/images/banner/login5.jpg"
          width="100%"
          height="100%"
        />
      </div> */}
    </div>
  );
};

export default SignupSection;
