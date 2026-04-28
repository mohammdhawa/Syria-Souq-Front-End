import React, { useEffect, useState } from "react";
import { Modal, Space, Select, Input, Form, Divider } from "antd";
import { CallDisabled02Icon, Call02Icon } from "hugeicons-react";
import styled from "styled-components";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
  AsYouType,
  isValidPhoneNumber,
} from "libphonenumber-js";
import OvalLoader from "../OvalLoader";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updateProfile } from "@/redux/actions/authActions";
import toastNotify from "@/utils/toast";

const StyledSelect = styled(Select)`
  height: 3.375rem !important;
  width: 40% !important;
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
  @media only screen and (max-width: 440px) {
    width: 40% !important;
    .ant-select-selector {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
`;

const StyledPhoneInput = styled(Input)`
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

const StyledSpaceCompact = styled(Space.Compact)`
  width: 100% !important;
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RequiredPhoneModal = ({ open, close }) => {
  const allCountries = getCountries();
  const defaultCountry = "SY";
  const [countryCode, setCountryCode] = useState("");
  const [countryIso, setCountryIso] = useState(defaultCountry);
  const { profileUpdateLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    phone: "",
    formattedPhone: "",
    fullPhone: "",
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    close(false);
  };
  useEffect(() => {
    if (open) {
      document.body.style.overflowY = "hidden";
      document.body.style.width = "100%";
      setCountryCode(`+${getCountryCallingCode(defaultCountry)}`);
      setFormData({
        phone: "",
        formattedPhone: "",
        fullPhone: "",
      });
      setFormError(null);
    }
    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.width = "auto";
    };
  }, [open]);

  const validatePhoneNumber = (phone, countryIsoCode) => {
    if (!phone) return "الرجاء إدخال رقم الهاتف";

    const fullPhoneNumber = `${countryCode}${phone.replace(/\D/g, "")}`;

    try {
      const isValid = isValidPhoneNumber(fullPhoneNumber, countryIsoCode);
      if (!isValid) return "رقم الهاتف غير صالح";
      return null;
    } catch (error) {
      return "رقم الهاتف غير صالح";
    }
  };

  const handleCountryCodeChange = (value) => {
    setCountryIso(value);
    setCountryCode(`+${getCountryCallingCode(value)}`);
    if (formData.phone) {
      formatPhoneNumber(formData.phone);
    }
  };

  const formatPhoneNumber = (phoneInput) => {
    const rawPhone = phoneInput.replace(/\D/g, "");

    try {
      const formatter = new AsYouType(countryIso);
      const formattedPhone = formatter.input(rawPhone);
      const fullPhone = `${countryCode} ${rawPhone}`;

      setFormData({
        phone: rawPhone,
        formattedPhone,
        fullPhone,
      });

      const phoneError = validatePhoneNumber(rawPhone, countryIso);
      setFormError(phoneError);
    } catch (error) {
      setFormData({
        phone: rawPhone,
        formattedPhone: rawPhone,
        fullPhone: `${countryCode} ${rawPhone}`,
      });
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    formatPhoneNumber(value);
  };

  const handleSubmit = async () => {
    const phoneError = validatePhoneNumber(formData.phone, countryIso);
    setFormError(phoneError);

    if (!phoneError) {
      setLoading(true);
      try {
        const result = await dispatch(
          updateProfile({ phone: formData.fullPhone })
        );
        if (result.success) {
          toastNotify("تم تحديث رقم الهاتف بنجاح", "success");
          handleClose();
        } else {
          setFormError(result.error || "فشل تحديث رقم الهاتف");
        }
      } catch (error) {
        setFormError("حدث خطأ أثناء تحديث رقم الهاتف");
      } finally {
        setLoading(false);
      }
    }
  };

  const getFlagUrl = (countryCode) => {
    if (countryCode?.toLowerCase() === "sy") {
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Syria_%282025-%29.svg/1920px-Flag_of_Syria_%282025-%29.svg.png";
    }
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  const filterOption = (input, option) => {
    const country = option.value;
    const countryName = option.children.props.children[1].props.children;
    return (
      countryName.toLowerCase().includes(input.toLowerCase()) ||
      country.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <Modal
      forceRender
      destroyOnClose
      footer={null}
      centered
      open={open}
      closable={true}
      maskClosable={false}
      onCancel={handleClose}
      width={450}
    >
      <div
        style={{
          gap: "1.5rem",
        }}
        className="p-2 px-0 d-flex flex-column align-items-center justify-content-center"
      >
        <div className="d-flex align-items-center flex-column gap-2">
          <CallDisabled02Icon
            size={48}
            strokeWidth={1}
            className="text-dark opacity-50"
          />
          <div className="d-flex align-items-center flex-column">
            <p className="fw-bold fs-4 text-center">رقم الهاتف مطلوب</p>
            <p className="fw-light text-variant-1 fs-6 text-center">
              يرجى إدخال رقم الهاتف لمتابعة نشر الإعلان
            </p>
          </div>
        </div>
        <Divider style={{ margin: "0" }} />
        <Form form={form} layout="vertical" style={{ width: "100%" }}>
          <div className="box">
            <fieldset className="box-fieldset">
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
                  status={formError ? "error" : ""}
                >
                  {allCountries.map((country) => (
                    <Select.Option
                      key={country}
                      value={country}
                      label={
                        <OptionContainer>
                          <img
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
                  value={formData.formattedPhone || ""}
                  onChange={handleChange}
                  status={formError ? "error" : ""}
                />
              </StyledSpaceCompact>
              {formError && (
                <div className="text-danger mt-1 small">{formError}</div>
              )}
            </fieldset>
            <button
              className="tf-btn primary text-dark w-100"
              onClick={handleSubmit}
              disabled={
                loading ||
                profileUpdateLoading ||
                !!formError ||
                !formData.phone
              }
            >
              {loading || profileUpdateLoading ? <OvalLoader /> : "حفظ"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default RequiredPhoneModal;
