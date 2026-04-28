import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Avatar,
  Alert,
  Breadcrumb,
  Select,
  Input,
  Space,
  Divider,
  Dropdown,
  Menu,
} from "antd";
import { useDispatch } from "react-redux";
import { fetchProfile, updateProfile } from "@/redux/actions/authActions";
import { useSelector } from "react-redux";
import MetaComponent from "@/components/common/MetaComponent";
import styled from "styled-components";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
  AsYouType,
  isValidPhoneNumber,
} from "libphonenumber-js";
import OvalLoader from "@/components/OvalLoader";
import {
  Call02Icon,
  Delete01Icon,
  Edit02Icon,
  Mail01Icon,
  Camera02Icon,
  UserIcon,
  Upload05Icon,
} from "hugeicons-react";
import AccountSettingsPage from "./AccountSettingsPage";
import toastNotify from "@/utils/toast";
import ComponentLoader from "@/components/ComponentLoader";
import imageCompression from "browser-image-compression";
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
const StyledSelect = styled(Select)`
  height: 3.375rem !important;
  width: 15% !important;
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
    width: 20% !important;
  }
  @media only screen and (max-width: 850px) {
    width: 30% !important;
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

const ReadOnlyField = styled.div`
  padding: 0.8rem 1rem;
  border-radius: 0.6rem;
  background: rgba(0, 0, 0, 0.02);
  min-height: 3.375rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, profileUpdateLoading, profileUpdateError, profileLoading } =
    useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    formattedPhone: "",
    fullPhone: "",
    image: null,
    deleteImage: false, // Added default value to track image deletion state
  });
  const [formErrors, setFormErrors] = useState({});
  const [imageLoading, setImageLoading] = useState(false);

  const allCountries = getCountries();
  const defaultCountry = "SY";
  const [countryCode, setCountryCode] = useState("");
  const [countryIso, setCountryIso] = useState(defaultCountry);
  const [initialCountryIso, setInitialCountryIso] = useState(defaultCountry);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        phone: "",
        formattedPhone: "",
        fullPhone: user.phone || "",
        image: null,
        deleteImage: false, 
      };

      if (user.phone) {
        try {
          const phoneObj = parsePhoneNumber(user.phone);
          if (phoneObj) {
            const countryIsoCode = phoneObj.country || defaultCountry;
            const nationalNumber = phoneObj.nationalNumber;

            setCountryIso(countryIsoCode);
            setInitialCountryIso(countryIsoCode);
            setCountryCode(`+${getCountryCallingCode(countryIsoCode)}`);
            const formatter = new AsYouType(countryIsoCode);
            const formattedPhone = formatter.input(nationalNumber);

            userData.phone = nationalNumber;
            userData.formattedPhone = formattedPhone;
          }
        } catch (error) {
          const phoneNumberParts = user.phone.split(" ");
          if (phoneNumberParts.length > 1) {
            const code = phoneNumberParts[0];
            const number = phoneNumberParts.slice(1).join("");
            for (const country of allCountries) {
              if (code === `+${getCountryCallingCode(country)}`) {
                setCountryIso(country);
                setInitialCountryIso(country);
                setCountryCode(code);

                userData.phone = number;
                userData.formattedPhone = number;
                break;
              }
            }
          }
        }
      } else {
        setCountryCode(`+${getCountryCallingCode(defaultCountry)}`);
      }

      setFormData(userData);
      setInitialFormData(JSON.parse(JSON.stringify(userData)));
    }
  }, [user]);

  const getAuthMethodTag = (user) => {
    if (user?.facebook_id) {
      return (
        <div className="account-type-badge">
          <img alt="facebook" src="/images/logo/fb.jpg" width={28} />
          <p>حساب فيسبوك</p>
        </div>
      );
    } else if (user?.google_id) {
      return (
        <div className="account-type-badge">
          <img alt="google" src="/images/logo/google.jpg" width={28} />
          <p>حساب جوجل</p>
        </div>
      );
    } else {
      return (
        <div className="account-type-badge">
          <Mail01Icon size={28} />
          <p>البريد الالكتروني</p>
        </div>
      );
    }
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
    if (name === "name") {
      return value.trim() ? null : "الرجاء إدخال اسم المستخدم";
    }
    if (name === "phone") {
      return validatePhoneNumber(value, countryIso);
    }
    return null;
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      formatPhoneNumber(value);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
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

  const isValidImageType = (file) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(file.type)) {
      toastNotify("الرجاء تحميل صورة بتنسيق PNG أو JPG أو JPEG", "error");
      return false;
    }
    return true;
  };
  const compressImage = async (file) => {
    if (!file) return null;

    if (!isValidImageType(file)) {
      return null;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      initialQuality: 0.9,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, { type: file.type });
    } catch (error) {
      toastNotify("حدث خطأ أثناء معالجة الصورة", "error");
      return null;
    }
  };

  const handleImageUpload = async (file) => {
    setImageLoading(true);
    try {
      if (!isValidImageType(file)) {
        setImageLoading(false);
        return;
      }
      let imageToUse = file;
      try {
        const compressedImage = await compressImage(file);
        if (compressedImage) {
          imageToUse = compressedImage;
        }
      } catch (compressionError) {}
      setFormData((prev) => ({
        ...prev,
        image: imageToUse,
        deleteImage: false,
      }));
    } catch (error) {
      toastNotify("حدث خطأ أثناء تحميل الصورة", "error");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      deleteImage: true,
    }));
  };

  const handleEditClick = () => {
    setEditMode(true);
    setInitialFormData(JSON.parse(JSON.stringify(formData)));
    setInitialCountryIso(countryIso);
  };

  const handleCancelEdit = () => {
    setFormData(JSON.parse(JSON.stringify(initialFormData)));
    setCountryIso(initialCountryIso);
    setCountryCode(`+${getCountryCallingCode(initialCountryIso)}`);
    setFormErrors({});
    setEditMode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameError = validateField("name", formData.name);
    const phoneError = validateField("phone", formData.phone);

    const newErrors = {};
    if (nameError) newErrors.name = nameError;
    if (phoneError) newErrors.phone = phoneError;

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const updateData = {};

      if (formData.name !== user.name) {
        updateData.name = formData.name;
      }
      if (formData.fullPhone && formData.fullPhone !== user.phone) {
        updateData.phone = formData.fullPhone;
      }
      if (formData.image) {
        updateData.image = formData.image;
      }
      if (formData.deleteImage) {
        updateData.deleteImage = true;
      }

      if (Object.keys(updateData).length > 0) {
        dispatch(updateProfile(updateData)).then((result) => {
          if (result?.success) {
            toastNotify(
              result.message || "تم تحديث الملف الشخصي بنجاح",
              "success"
            );
            setEditMode(false);
            setInitialFormData({ ...formData });
            setInitialCountryIso(countryIso);
          }
        });
      } else {
        setEditMode(false);
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

  const getFlagUrl = (countryCode) => {
  
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  const shouldScaleImage = () => {
    return !(formData.image || (user?.image && !formData.deleteImage));
  };

  const metadata = {
    title: `Syria Souq | الملف الشخصي`,
  };

  return profileLoading ? (
    <ComponentLoader />
  ) : (
    <>
      <MetaComponent meta={metadata} />

      <div className="d-flex align-items-start flex-column mb-4">
        <span className="fs-4 fw-bold mb-1">الملف الشخصي</span>
        <Breadcrumb
          items={[
            {
              title: "لوحة التحكم",
            },
            {
              title: "الملف الشخصي",
            },
          ]}
        />
      </div>

      <div className="row profile-layout">
        <div className="col-lg-6 col-md-12">
          <Card
            title={
              !editMode && (
                <span className="edit-account-span" onClick={handleEditClick}>
                  <Edit02Icon size={14} />
                  <p className="fw-normal">تعديل الملف الشخصي</p>
                </span>
              )
            }
          >
            <div className="d-flex align-items-center justify-content-center mb-2 position-relative">
              {editMode ? (
                <div className="position-relative">
                  <div
                    style={{
                      width: "6.25rem",
                      height: "6.25rem",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                    className="d-flex align-items-center justify-content-center bg-light"
                  >
                    {imageLoading ? (
                      <OvalLoader />
                    ) : (
                      <Avatar
                        src={
                          formData.image
                            ? URL.createObjectURL(formData.image)
                            : user?.image && !formData.deleteImage
                            ? user?.image
                            : "/images/no_profile.png"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: shouldScaleImage() ? "scale(1.3)" : "",
                        }}
                      />
                    )}
                  </div>

                  {!imageLoading && (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "upload",
                            label: (
                              <label
                                htmlFor="avatar-upload"
                                style={{
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                className="fw-normal"
                              >
                                <Upload05Icon
                                  size={16}
                                  style={{ marginLeft: 8 }}
                                />
                                رفع صورة
                              </label>
                            ),
                          },
                          ...(formData.image ||
                          (user?.image && !formData.deleteImage)
                            ? [
                                {
                                  key: "delete",
                                  label: (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                      className="fw-normal"
                                      onClick={handleDeleteImage}
                                    >
                                      <Delete01Icon
                                        size={16}
                                        style={{ marginLeft: 8 }}
                                      />
                                      حذف الصورة
                                    </div>
                                  ),
                                },
                              ]
                            : []),
                        ],
                      }}
                      placement="bottomRight"
                      trigger={["click"]}
                    >
                      <div
                        className="avatar-edit-dropdown"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          background: "#ffe800",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          zIndex: 10,
                        }}
                      >
                        <Camera02Icon size={16} color="black" />
                      </div>
                    </Dropdown>
                  )}

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                      e.target.value = "";
                    }}
                    style={{ display: "none" }}
                  />
                </div>
              ) : user?.image ? (
                <Avatar
                  src={user?.image}
                  alt="avatar"
                  size={100}
                  style={{ width: "6.25rem", height: "6.25rem" }}
                />
              ) : (
                <div
                  style={{
                    width: "6.25rem",
                    height: "6.25rem",
                    overflow: "hidden",
                  }}
                  className="bg-light rounded-pill"
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "scale(1.3)",
                    }}
                    src="/images/no_profile.png"
                    alt="No profile image"
                  />
                </div>
              )}
            </div>

            <div className="d-flex flex-column align-items-center w-100 mb-4">
              <p className="fs-5 fw-bolder mb-0">{user?.name}</p>
              <p className="text-variant-1">{user?.email}</p>
            </div>

            {editMode ? (
              <Form form={form} layout="vertical" onSubmit={handleSubmit}>
                <div className="box">
                  <fieldset className="box-fieldset mb-3">
                    <label className="mb-1 fs-6 fw-normal" htmlFor="name">
                      الاسم الكامل
                    </label>
                    <StyledInput
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="ادخل اسمك الكامل"
                      prefix={<UserIcon size={16} />}
                      status={formErrors.name ? "error" : ""}
                    />
                    {formErrors.name && (
                      <div className="text-danger mt-1 small">
                        {formErrors.name}
                      </div>
                    )}
                  </fieldset>
                  <fieldset className="box-fieldset mb-3">
                    <label className="mb-1 fs-6 fw-normal" htmlFor="email">
                      البريد الالكتروني
                    </label>
                    <StyledInput
                      type="text"
                      name="email"
                      value={user?.email}
                      placeholder="ادخل البريد الالكتروني"
                      disabled
                      prefix={<Mail01Icon size={16} />}
                    />
                    <Alert
                      message={"لا يمكنك التعديل على البريد الالكتروني"}
                      showIcon
                      type="warning"
                      className="mt-2"
                    />
                  </fieldset>
                  <fieldset className="box-fieldset mb-3">
                    <label className="mb-1 fs-6 fw-normal" htmlFor="phone">
                      رقم الهاتف
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
                        name="phone"
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
                    </StyledSpaceCompact>
                    {formErrors.phone && (
                      <div className="text-danger mt-1 small">
                        {formErrors.phone}
                      </div>
                    )}
                  </fieldset>
                </div>

                <div className="update-profile-footer">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={handleCancelEdit}
                  >
                    إلغاء
                  </span>
                  <button
                    onClick={handleSubmit}
                    className="tf-btn primary text-dark"
                    disabled={profileUpdateLoading || imageLoading}
                  >
                    {profileUpdateLoading ? <OvalLoader /> : "حفظ التغييرات"}
                  </button>
                </div>
              </Form>
            ) : (
              <div className="box">
                <fieldset className="box-fieldset mb-3">
                  <label className="mb-1 fs-6 fw-normal">الاسم الكامل</label>
                  <ReadOnlyField>
                    <UserIcon size={16} />
                    <span>{user?.name}</span>
                  </ReadOnlyField>
                </fieldset>
                <fieldset className="box-fieldset mb-3">
                  <label className="mb-1 fs-6 fw-normal">
                    البريد الالكتروني
                  </label>
                  <ReadOnlyField>
                    <Mail01Icon size={16} />
                    <span>{user?.email}</span>
                  </ReadOnlyField>
                </fieldset>
                <fieldset className="box-fieldset mb-3">
                  <label className="mb-1 fs-6 fw-normal">رقم الهاتف</label>
                  <ReadOnlyField>
                    <Call02Icon size={16} />
                    <span dir="ltr">
                      {user?.phone || "لم يتم تحديد رقم هاتف"}
                    </span>
                  </ReadOnlyField>
                </fieldset>
              </div>
            )}
            {profileUpdateError && (
              <Alert
                message={
                  typeof profileUpdateError === "object"
                    ? Object.values(profileUpdateError).join(", ")
                    : profileUpdateError
                }
                type="error"
                showIcon
                closable
                className="mt-2"
              />
            )}
          </Card>
        </div>

        <div className="col-lg-6 col-md-12">
          <Card title={<p className="m-0 fs-5">إعدادات الحساب</p>}>
            <div className="d-flex gap-2 flex-column ">
              <span className="text-text-variant-1">تم التحقق بواسطة</span>
              <div className="d-flex">{getAuthMethodTag(user)}</div>
            </div>
            <Divider />
            <AccountSettingsPage />
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
