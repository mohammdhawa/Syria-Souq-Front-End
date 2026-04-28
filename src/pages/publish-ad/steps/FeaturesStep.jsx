import React, { useState, useEffect } from "react";
import { Checkbox, Divider, Empty, Spin, Alert, Tooltip } from "antd";
import axios from "axios";
import styled from "styled-components";
import OvalLoader from "@/components/OvalLoader";
import { StyledInput, StyledSelect } from "../styled";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "@/redux/actions/brandsActions";
import { fetchModels } from "@/redux/actions/modelsActions";
import {
  apartmentFloorsNumbers,
  carTypes,
  colors,
  conditionTypes,
  coolingTypes,
  cylendersOptions,
  doorsCount,
  floorsNumbers,
  fuelTypes,
  houseTypes,
  marineBodyMaterials,
  marineEngineBrands,
  marineTypes,
  motorcycleTypes,
  roomsNumbers,
  seatsCount,
  transmissionTypes,
  yearOptions,
} from "@/data/General";
import { useAdForm } from "../../../context/AdFormContext";
import { InformationCircleIcon } from "hugeicons-react";
import { formatNumberArabic } from "@/utils/formatNumberArabic";

const FeaturesStep = () => {
  const { state, updateField, showErrors } = useAdForm();
  const [featureGroups, setFeatureGroups] = useState([]);
  const {
    brands,
    models,
    loading: vehicleLoader,
  } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputWarnings, setInputWarnings] = useState({});
  const {
    category,
    squareMeters,
    houseType,
    roomsNumber,
    bathsNumber,
    floor,
    buildingAge,
    brand,
    model,
    carType,
    marineType,
    motorcycleType,
    condition,
    year,
    fuelType,
    transmissionType,
    color,
    seatsColor,
    seats,
    doors,
    length,
    maxCapacity,
    coolingType,
    mileage,
    horsepower,
    engineCapacity,
    cylinders,
    features,
    errors,
    width,
    engineBrand,
    bodyMaterial,
  } = state;

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!category) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/feature-groups/${category}/category`
        );
        setFeatureGroups(response.data);
      } catch (err) {
        setError(
          "حدث خطأ أثناء تحميل الميزات، لكن لا تقلق، لا يزال بإمكانك نشر إعلانك."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, [category]);

  useEffect(() => {
    if (category === 3 || category === 4 || category === 5) {
      dispatch(fetchBrands(category));
    }
  }, [category]);

  useEffect(() => {
    if (brand) {
      dispatch(fetchModels(brand));
    }
  }, [brand]);

  const handleFeatureChange = (featureId, checked) => {
    let newFeatures = [...(features || [])];

    if (checked) {
      newFeatures.push(featureId);
    } else {
      newFeatures = newFeatures.filter((id) => id !== featureId);
    }

    updateField("features", newFeatures);
  };
  const isGroupAllSelected = (group) => {
    if (!group.features || group.features.length === 0) return false;
    return group.features.every((feature) => features?.includes(feature.id));
  };

  const isGroupPartiallySelected = (group) => {
    if (!group.features || group.features.length === 0) return false;
    const selectedCount = group.features.filter((feature) =>
      features?.includes(feature.id)
    ).length;
    return selectedCount > 0 && selectedCount < group.features.length;
  };

  const handleSelectAllFeatures = (groupId, isChecked) => {
    const group = featureGroups.find((g) => g.group_id === groupId);

    if (!group) return;

    const newFeatures = [...(features || [])];

    if (isChecked) {
      group.features.forEach((feature) => {
        if (!newFeatures.includes(feature.id)) {
          newFeatures.push(feature.id);
        }
      });
    } else {
      group.features.forEach((feature) => {
        const index = newFeatures.indexOf(feature.id);
        if (index !== -1) {
          newFeatures.splice(index, 1);
        }
      });
    }
    updateField("features", newFeatures);
  };
  const categoryTitles = {
    1: "مواصفات الأرض",
    2: "مواصفات المنزل",
    3: "مواصفات السيارة",
    4: "مواصفات المركبة",
    5: "مواصفات الدراجة",
  };

  const handleIntegerInput = (
    value,
    fieldName,
    min = 1,
    max = 100000000,
    symbol = "م²"
  ) => {
    if (value === "") {
      updateField(fieldName, value);
      updateField(`${fieldName}Formatted`, "");
      setInputWarnings((prev) => ({ ...prev, [fieldName]: null }));
      return;
    }

    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value);
      updateField(fieldName, value);
      updateField(`${fieldName}Formatted`, formatNumberArabic(value));

      if (numValue < min) {
        setInputWarnings((prev) => ({
          ...prev,
          [fieldName]: `الحد الأدنى المسموح به هو ${formatNumberArabic(
            min
          )} ${symbol}`,
        }));
      } else if (numValue > max) {
        setInputWarnings((prev) => ({
          ...prev,
          [fieldName]: `الحد الأقصى المسموح به هو ${formatNumberArabic(
            max
          )} ${symbol}`,
        }));
      } else {
        setInputWarnings((prev) => ({ ...prev, [fieldName]: null }));
      }
    }
  };
  const handleFloatInput = (
    value,
    fieldName,
    min = 0,
    max = 100000000,
    symbol = "م²"
  ) => {
    if (value === "") {
      updateField(fieldName, value);
      updateField(`${fieldName}Formatted`, "");
      setInputWarnings((prev) => ({ ...prev, [fieldName]: null }));
      return;
    }

    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (value === ".") {
        return;
      }

      const numValue = parseFloat(value);
      updateField(fieldName, value);
      updateField(`${fieldName}Formatted`, formatNumberArabic(value));

      if (!isNaN(numValue)) {
        if (numValue < min) {
          setInputWarnings((prev) => ({
            ...prev,
            [fieldName]: `الحد الأدنى المسموح به هو ${formatNumberArabic(
              min
            )} ${symbol}`,
          }));
        } else if (numValue > max) {
          setInputWarnings((prev) => ({
            ...prev,
            [fieldName]: `الحد الأقصى المسموح به هو ${formatNumberArabic(
              max
            )} ${symbol}`,
          }));
        } else {
          setInputWarnings((prev) => ({ ...prev, [fieldName]: null }));
        }
      }
    }
  };
  if (!category) {
    return (
      <Alert
        className="w-100"
        message="يرجى اختيار فئة الإعلان أولاً"
        type="info"
        showIcon
      />
    );
  }

  return (
    <div className="box w-100 d-flex flex-column gap-3">
      <div className="row g-3">
        <p className="fs-4 fw-bolder ">
          {categoryTitles[category] || "المواصفات"}
        </p>
        <span className="mt-1 fs-6 fw-normal text-variant-1 mb-3">
          إضافة المواصفات بدقة يساعد المهتمين في العثور على ما يبحثون عنه بسهولة
        </span>
        {(category === 1 || category === 2) && (
          <>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">
                المساحة{" "}
                <small className="fs-13 text-variant-1 fw-normal">
                  (متر مربع)
                </small>
              </label>
              <StyledInput
                value={squareMeters}
                placeholder={"ادخل المساحة"}
                onChange={(e) =>
                  handleIntegerInput(
                    e.target.value,
                    "squareMeters",
                    category === 1 ? 1 : 20,
                    category === 1 ? 10000000 : 10000
                  )
                }
                className="w-100"
                status={
                  showErrors && errors?.squareMeters
                    ? "error"
                    : inputWarnings.squareMeters
                      ? "warning"
                      : ""
                }
              />
              {showErrors && errors?.squareMeters && (
                <div className="error-message text-danger mt-1">
                  {errors.squareMeters}
                </div>
              )}
              {inputWarnings.squareMeters && !errors?.squareMeters && (
                <div className="warning-message text-warning mt-1">
                  {inputWarnings.squareMeters}
                </div>
              )}
            </fieldset>
          </>
        )}
        {category === 2 && (
          <>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">نوع المنزل</label>
              <StyledSelect
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
                value={houseType}
                placeholder={"اختر نوع المنزل"}
                options={houseTypes}
                onChange={(value) => updateField("houseType", value)}
                className="w-100"
                showSearch
                filterOption={(input, option) =>
                  option?.label
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                status={showErrors && errors?.houseType ? "error" : ""}
              />
              {showErrors && errors?.houseType && (
                <div className="error-message text-danger mt-1">
                  {errors.houseType}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">عدد الغرف</label>
              <StyledSelect
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
                value={roomsNumber}
                placeholder={"اختر عدد الغرف"}
                options={roomsNumbers}
                onChange={(value) => updateField("roomsNumber", value)}
                className="w-100"
                showSearch
                filterOption={(input, option) =>
                  option?.label
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                status={showErrors && errors?.roomsNumber ? "error" : ""}
              />
              {showErrors && errors?.roomsNumber && (
                <div className="error-message text-danger mt-1">
                  {errors.roomsNumber}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">عدد الحمامات</label>
              <StyledSelect
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
                value={bathsNumber}
                placeholder={"اختر عدد الحمامات"}
                options={roomsNumbers}
                onChange={(value) => updateField("bathsNumber", value)}
                className="w-100"
                showSearch
                filterOption={(input, option) =>
                  option?.label
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                status={showErrors && errors?.bathsNumber ? "error" : ""}
              />
              {showErrors && errors?.bathsNumber && (
                <div className="error-message text-danger mt-1">
                  {errors.bathsNumber}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">
                {houseType === "APARTMENT" ? "الطابق" : "عدد الطوابق"}
              </label>
              <StyledSelect
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
                value={floor}
                placeholder={
                  houseType === "APARTMENT" ? "اختر الطابق" : "اختر عدد الطوابق"
                }
                options={
                  houseType === "APARTMENT"
                    ? apartmentFloorsNumbers
                    : floorsNumbers
                }
                onChange={(value) => updateField("floor", value)}
                className="w-100"
                showSearch
                filterOption={(input, option) =>
                  option?.label
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                status={showErrors && errors?.floor ? "error" : ""}
              />
              {showErrors && errors?.floor && (
                <div className="error-message text-danger mt-1">
                  {errors.floor}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">عمر البناء</label>
              <StyledInput
                value={buildingAge}
                placeholder={"ادخل عمر البناء"}
                onChange={(e) =>
                  handleIntegerInput(
                    e.target.value,
                    "buildingAge",
                    0,
                    300,
                    "سنة"
                  )
                }
                className="w-100"
                status={
                  showErrors && errors?.buildingAge
                    ? "error"
                    : inputWarnings.buildingAge
                      ? "warning"
                      : ""
                }
              />
              {showErrors && errors?.buildingAge && (
                <div className="error-message text-danger mt-1">
                  {errors.buildingAge}
                </div>
              )}
              {inputWarnings.buildingAge && !errors?.buildingAge && (
                <div className="warning-message text-warning mt-1">
                  {inputWarnings.buildingAge}
                </div>
              )}
            </fieldset>
          </>
        )}
        {(category === 3 || category === 4 || category === 5) && (
          <>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">العلامة التجارية</label>
              <StyledSelect
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
                value={brand}
                placeholder={"اختر العلامة التجارية"}
                options={brands}
                onChange={(value) => updateField("brand", value)}
                className="w-100"
                loading={vehicleLoader}
                disabled={vehicleLoader}
                showSearch
                filterOption={(input, option) =>
                  option?.label
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                status={showErrors && errors?.brand ? "error" : ""}
              />
              {showErrors && errors?.brand && (
                <div className="error-message text-danger mt-1">
                  {errors.brand}
                </div>
              )}
            </fieldset>

            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">الموديل</label>
              <StyledSelect
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
                value={model}
                placeholder={"اختر الموديل"}
                options={models}
                onChange={(value) => updateField("model", value)}
                className="w-100"
                loading={vehicleLoader}
                disabled={vehicleLoader || !brand}
                showSearch
                filterOption={(input, option) =>
                  option?.label
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                status={showErrors && errors?.model ? "error" : ""}
              />
              {showErrors && errors?.model && (
                <div className="error-message text-danger mt-1">
                  {errors.model}
                </div>
              )}
            </fieldset>
            {category == 3 && (
              <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                <label className="mb-2 fs-6 fw-normal">نوع السيارة</label>
                <StyledSelect
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
                  value={carType}
                  placeholder={"اختر نوع السيارة"}
                  options={carTypes}
                  onChange={(value) => updateField("carType", value)}
                  className="w-100"
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                  status={showErrors && errors?.carType ? "error" : ""}
                />
                {showErrors && errors?.carType && (
                  <div className="error-message text-danger mt-1">
                    {errors.carType}
                  </div>
                )}
              </fieldset>
            )}
            {category == 4 && (
              <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                <label className="mb-2 fs-6 fw-normal">نوع المركبة</label>
                <StyledSelect
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
                  value={marineType}
                  placeholder={"اختر نوع المركبة"}
                  options={marineTypes}
                  onChange={(value) => updateField("marineType", value)}
                  className="w-100"
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                  status={showErrors && errors?.marineType ? "error" : ""}
                />
                {showErrors && errors?.marineType && (
                  <div className="error-message text-danger mt-1">
                    {errors.marineType}
                  </div>
                )}
              </fieldset>
            )}
            {category == 5 && (
              <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                <label className="mb-2 fs-6 fw-normal">نوع الدراجة</label>
                <StyledSelect
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
                  value={motorcycleType}
                  placeholder={"اختر نوع الدراجة"}
                  options={motorcycleTypes}
                  onChange={(value) => updateField("motorcycleType", value)}
                  className="w-100"
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                  status={showErrors && errors?.motorcycleType ? "error" : ""}
                />
                {showErrors && errors?.motorcycleType && (
                  <div className="error-message text-danger mt-1">
                    {errors.motorcycleType}
                  </div>
                )}
              </fieldset>
            )}
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">الحالة</label>
              <StyledSelect
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
                value={condition}
                placeholder={"اختر الحالة"}
                options={conditionTypes}
                onChange={(value) => updateField("condition", value)}
                className="w-100"
                status={showErrors && errors?.condition ? "error" : ""}
              />
              {showErrors && errors?.condition && (
                <div className="error-message text-danger mt-1">
                  {errors.condition}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">سنة التصنيع</label>
              <StyledSelect
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
                value={year}
                placeholder={"اختر سنة التصنيع"}
                options={yearOptions}
                onChange={(value) => updateField("year", value)}
                className="w-100"
                showSearch
                filterOption={(input, option) =>
                  option?.label
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                status={showErrors && errors?.year ? "error" : ""}
              />
              {showErrors && errors?.year && (
                <div className="error-message text-danger mt-1">
                  {errors.year}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">نوع الوقود</label>
              <StyledSelect
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
                value={fuelType}
                placeholder={"اختر نوع الوقود"}
                options={fuelTypes}
                onChange={(value) => updateField("fuelType", value)}
                className="w-100"
                showSearch
                filterOption={(input, option) => {
                  const label = option.label?.toString().toLowerCase() || "";
                  const value = option.value?.toString().toLowerCase() || "";
                  return (
                    label.includes(input.toLowerCase()) ||
                    value.includes(input.toLowerCase())
                  );
                }}
                status={showErrors && errors?.fuelType ? "error" : ""}
              />
              {showErrors && errors?.fuelType && (
                <div className="error-message text-danger mt-1">
                  {errors.fuelType}
                </div>
              )}
            </fieldset>
            {(category === 3 || category === 5) && (
              <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                <label className="mb-2 fs-6 fw-normal">نوع الغيار</label>
                <StyledSelect
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
                  value={transmissionType}
                  placeholder={"اختر نوع الغيار"}
                  options={transmissionTypes}
                  onChange={(value) => updateField("transmissionType", value)}
                  className="w-100"
                  showSearch
                  status={showErrors && errors?.transmissionType ? "error" : ""}
                />
                {showErrors && errors?.transmissionType && (
                  <div className="error-message text-danger mt-1">
                    {errors.transmissionType}
                  </div>
                )}
              </fieldset>
            )}
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
              <label className="mb-2 fs-6 fw-normal">اللون الخارجي</label>
              <StyledSelect
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
                value={color}
                placeholder={"اختر اللون الخارجي"}
                options={colors}
                onChange={(value) => updateField("color", value)}
                className="w-100"
                showSearch
                filterOption={(input, option) => {
                  const label = option.label?.toString().toLowerCase() || "";
                  const value = option.value?.toString().toLowerCase() || "";
                  return (
                    label.includes(input.toLowerCase()) ||
                    value.includes(input.toLowerCase())
                  );
                }}
                status={showErrors && errors?.color ? "error" : ""}
              />
              {showErrors && errors?.color && (
                <div className="error-message text-danger mt-1">
                  {errors.color}
                </div>
              )}
            </fieldset>
            {category === 3 && (
              <>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <label className="mb-2 fs-6 fw-normal">لون المقاعد</label>
                  <StyledSelect
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
                    value={seatsColor}
                    placeholder={"اختر لون المقاعد"}
                    options={colors}
                    onChange={(value) => updateField("seatsColor", value)}
                    className="w-100"
                    showSearch
                    filterOption={(input, option) => {
                      const label =
                        option.label?.toString().toLowerCase() || "";
                      const value =
                        option.value?.toString().toLowerCase() || "";
                      return (
                        label.includes(input.toLowerCase()) ||
                        value.includes(input.toLowerCase())
                      );
                    }}
                    status={showErrors && errors?.seatsColor ? "error" : ""}
                  />
                  {showErrors && errors?.seatsColor && (
                    <div className="error-message text-danger mt-1">
                      {errors.seatsColor}
                    </div>
                  )}
                </fieldset>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <label className="mb-2 fs-6 fw-normal">عدد المقاعد</label>
                  <StyledSelect
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
                    value={seats}
                    placeholder={"اختر عدد المقاعد"}
                    options={seatsCount}
                    onChange={(value) => updateField("seats", value)}
                    className="w-100"
                    showSearch
                    filterOption={(input, option) => {
                      const label =
                        option.label?.toString().toLowerCase() || "";
                      const value =
                        option.value?.toString().toLowerCase() || "";
                      return (
                        label.includes(input.toLowerCase()) ||
                        value.includes(input.toLowerCase())
                      );
                    }}
                    status={showErrors && errors?.seats ? "error" : ""}
                  />
                  {showErrors && errors?.seats && (
                    <div className="error-message text-danger mt-1">
                      {errors.seats}
                    </div>
                  )}
                </fieldset>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <label className="mb-2 fs-6 fw-normal">عدد الأبواب</label>
                  <StyledSelect
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
                    value={doors}
                    placeholder={"اختر عدد الأبواب"}
                    options={doorsCount}
                    onChange={(value) => updateField("doors", value)}
                    className="w-100"
                    showSearch
                    filterOption={(input, option) => {
                      const label =
                        option.label?.toString().toLowerCase() || "";
                      const value =
                        option.value?.toString().toLowerCase() || "";
                      return (
                        label.includes(input.toLowerCase()) ||
                        value.includes(input.toLowerCase())
                      );
                    }}
                    status={showErrors && errors?.doors ? "error" : ""}
                  />
                  {showErrors && errors?.doors && (
                    <div className="error-message text-danger mt-1">
                      {errors.doors}
                    </div>
                  )}
                </fieldset>
              </>
            )}
            {category === 4 && (
              <>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <label className="mb-2 fs-6 fw-normal">
                    العلامة التجارية للمحرك
                  </label>
                  <StyledSelect
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
                    value={engineBrand}
                    placeholder={"ادخل العلامة التجارية للمحرك"}
                    options={marineEngineBrands}
                    onChange={(value) => updateField("engineBrand", value)}
                    className="w-100"
                    showSearch
                    filterOption={(input, option) => {
                      const label =
                        option.label?.toString().toLowerCase() || "";
                      const value =
                        option.value?.toString().toLowerCase() || "";
                      return (
                        label.includes(input.toLowerCase()) ||
                        value.includes(input.toLowerCase())
                      );
                    }}
                    status={showErrors && errors?.engineBrand ? "error" : ""}
                  />
                  {showErrors && errors?.engineBrand && (
                    <div className="error-message text-danger mt-1">
                      {errors.engineBrand}
                    </div>
                  )}
                </fieldset>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <label className="mb-2 fs-6 fw-normal">نوع الجسم</label>
                  <StyledSelect
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
                    value={bodyMaterial}
                    placeholder={"ادخل نوع الجسم"}
                    options={marineBodyMaterials}
                    onChange={(value) => updateField("bodyMaterial", value)}
                    className="w-100"
                    showSearch
                    filterOption={(input, option) => {
                      const label =
                        option.label?.toString().toLowerCase() || "";
                      const value =
                        option.value?.toString().toLowerCase() || "";
                      return (
                        label.includes(input.toLowerCase()) ||
                        value.includes(input.toLowerCase())
                      );
                    }}
                    status={showErrors && errors?.bodyMaterial ? "error" : ""}
                  />
                  {showErrors && errors?.bodyMaterial && (
                    <div className="error-message text-danger mt-1">
                      {errors.bodyMaterial}
                    </div>
                  )}
                </fieldset>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <label className="mb-2 fs-6 fw-normal">
                    طول المركبة{" "}
                    <small className="fs-13 text-variant-1 fw-normal">
                      (بالمتر)
                    </small>
                  </label>
                  <StyledInput
                    value={length}
                    placeholder={"ادخل طول المركبة بالمتر"}
                    onChange={(e) =>
                      handleFloatInput(e.target.value, "length", 1, 500, "م")
                    }
                    className="w-100"
                    status={
                      showErrors && errors?.length
                        ? "error"
                        : inputWarnings.length
                          ? "warning"
                          : ""
                    }
                  />
                  {showErrors && errors?.length && (
                    <div className="error-message text-danger mt-1">
                      {errors.length}
                    </div>
                  )}
                  {inputWarnings.length && !errors?.length && (
                    <div className="warning-message text-warning mt-1">
                      {inputWarnings.length}
                    </div>
                  )}
                </fieldset>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <label className="mb-2 fs-6 fw-normal">
                    عرض المركبة{" "}
                    <small className="fs-13 text-variant-1 fw-normal">
                      (بالمتر)
                    </small>
                  </label>
                  <StyledInput
                    value={width}
                    placeholder={"ادخل عرض المركبة بالمتر"}
                    onChange={(e) =>
                      handleFloatInput(e.target.value, "width", 0.5, 100, "م")
                    }
                    className="w-100"
                    status={
                      showErrors && errors?.width
                        ? "error"
                        : inputWarnings.width
                          ? "warning"
                          : ""
                    }
                  />
                  {showErrors && errors?.width && (
                    <div className="error-message text-danger mt-1">
                      {errors.width}
                    </div>
                  )}
                  {inputWarnings.width && !errors?.width && (
                    <div className="warning-message text-warning mt-1">
                      {inputWarnings.width}
                    </div>
                  )}
                </fieldset>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <label className="mb-2 fs-6 fw-normal">
                    سعة الركاب{" "}
                    <small className="fs-13 text-variant-1 fw-normal">
                      (اختياري)
                    </small>
                  </label>
                  <StyledInput
                    value={maxCapacity}
                    placeholder={"ادخل سعة الركاب"}
                    onChange={(e) =>
                      handleIntegerInput(
                        e.target.value,
                        "maxCapacity",
                        1,
                        10000,
                        "راكب"
                      )
                    }
                    className="w-100"
                    status={
                      showErrors && errors?.maxCapacity
                        ? "error"
                        : inputWarnings.maxCapacity
                          ? "warning"
                          : ""
                    }
                  />
                  {showErrors && errors?.maxCapacity && (
                    <div className="error-message text-danger mt-1">
                      {errors.maxCapacity}
                    </div>
                  )}
                  {inputWarnings.maxCapacity && !errors?.maxCapacity && (
                    <div className="warning-message text-warning mt-1">
                      {inputWarnings.maxCapacity}
                    </div>
                  )}
                </fieldset>
              </>
            )}
            {category === 5 && (
              <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                <label className="mb-2 fs-6 fw-normal">نوع التبريد</label>
                <StyledSelect
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
                  value={coolingType}
                  placeholder={"اختر نوع التبريد"}
                  options={coolingTypes}
                  onChange={(value) => updateField("coolingType", value)}
                  className="w-100"
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                  status={showErrors && errors?.coolingType ? "error" : ""}
                />
                {showErrors && errors?.coolingType && (
                  <div className="error-message text-danger mt-1">
                    {errors.coolingType}
                  </div>
                )}
              </fieldset>
            )}

            {(category === 5 || category === 3) && (
              <>
                <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                  <div className="d-flex align-items-center w-100 gap-1">
                    <Tooltip title="المسافة المقطوعة بالكيلومتر (KM)">
                      <InformationCircleIcon
                        style={{
                          marginTop: "-0.55rem",
                        }}
                        size={16}
                      />
                    </Tooltip>
                    <label className="mb-2 fs-6 fw-normal">الكيلومتراج</label>
                  </div>

                  <StyledInput
                    value={mileage}
                    placeholder={"ادخل الكيلومتراج"}
                    onChange={(e) =>
                      handleIntegerInput(
                        e.target.value,
                        "mileage",
                        0,
                        1000000,
                        "كم"
                      )
                    }
                    className="w-100"
                    status={
                      showErrors && errors?.mileage
                        ? "error"
                        : inputWarnings.mileage
                          ? "warning"
                          : ""
                    }
                  />
                  {showErrors && errors?.mileage && (
                    <div className="error-message text-danger mt-1">
                      {errors.mileage}
                    </div>
                  )}
                  {inputWarnings.mileage && !errors?.mileage && (
                    <div className="warning-message text-warning mt-1">
                      {inputWarnings.mileage}
                    </div>
                  )}
                </fieldset>

                {fuelType !== "ELECTRIC" && (
                  <>
                    <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                      <div className="d-flex align-items-center w-100 gap-1">
                        <Tooltip title="عدد الأسطوانات وترتيبها (V)">
                          <InformationCircleIcon
                            style={{
                              marginTop: "-0.55rem",
                            }}
                            size={16}
                          />
                        </Tooltip>
                        <label className="mb-2 fs-6 fw-normal">
                          اصطوانات المحرك{" "}
                          <small className="fs-13 text-variant-1 fw-normal">
                            (اختياري)
                          </small>
                        </label>
                      </div>
                      <StyledSelect
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
                        value={cylinders}
                        allowClear
                        placeholder={"اختر اصطوانات المحرك"}
                        options={cylendersOptions}
                        onChange={(value) => updateField("cylinders", value)}
                        className="w-100"
                        showSearch
                        filterOption={(input, option) => {
                          const label =
                            option.label?.toString().toLowerCase() || "";
                          const value =
                            option.value?.toString().toLowerCase() || "";
                          return (
                            label.includes(input.toLowerCase()) ||
                            value.includes(input.toLowerCase())
                          );
                        }}
                        status={showErrors && errors?.cylinders ? "error" : ""}
                      />
                      {showErrors && errors?.cylinders && (
                        <div className="error-message text-danger mt-1">
                          {errors.cylinders}
                        </div>
                      )}
                      {inputWarnings.cylinders && (
                        <div className="warning-message text-warning mt-1">
                          {inputWarnings.cylinders}
                        </div>
                      )}
                    </fieldset>
                    <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                      <div className="d-flex align-items-center w-100 gap-1">
                        <Tooltip title="حجم المحرك بالسنتيمتر المكعب (CC)">
                          <InformationCircleIcon
                            style={{
                              marginTop: "-0.55rem",
                            }}
                            size={16}
                          />
                        </Tooltip>
                        <label className="mb-2 fs-6 fw-normal">
                          سعة المحرك{" "}
                          <small className="fs-13 text-variant-1 fw-normal">
                            (اختياري)
                          </small>
                        </label>
                      </div>

                      <StyledInput
                        value={engineCapacity}
                        placeholder={"ادخل سعة المحرك"}
                        onChange={(e) =>
                          handleIntegerInput(
                            e.target.value,
                            "engineCapacity",
                            1,
                            10000,
                            "CC"
                          )
                        }
                        className="w-100"
                        status={
                          showErrors && errors?.engineCapacity
                            ? "error"
                            : inputWarnings.engineCapacity
                              ? "warning"
                              : ""
                        }
                      />
                      {showErrors && errors?.engineCapacity && (
                        <div className="error-message text-danger mt-1">
                          {errors.engineCapacity}
                        </div>
                      )}
                      {inputWarnings.engineCapacity &&
                        !errors?.engineCapacity && (
                          <div className="warning-message text-warning mt-1">
                            {inputWarnings.engineCapacity}
                          </div>
                        )}
                    </fieldset>
                  </>
                )}
              </>
            )}
            {(category === 5 || category === 3 || category === 4) && (
              <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start col-lg-4 col-md-6">
                <div className="d-flex align-items-center w-100 gap-1">
                  <Tooltip title="القوة الحصانية للمحرك (HP)">
                    <InformationCircleIcon
                      style={{
                        marginTop: "-0.55rem",
                      }}
                      size={16}
                    />
                  </Tooltip>
                  <label className="mb-2 fs-6 fw-normal">
                    قوة المحرك{" "}
                    <small className="fs-13 text-variant-1 fw-normal">
                      (اختياري)
                    </small>
                  </label>
                </div>
                <StyledInput
                  value={horsepower}
                  placeholder={"ادخل قوة المحرك"}
                  onChange={(e) =>
                    handleIntegerInput(
                      e.target.value,
                      "horsepower",
                      1,
                      10000,
                      "حصان (HP)"
                    )
                  }
                  className="w-100"
                  status={
                    showErrors && errors?.horsepower
                      ? "error"
                      : inputWarnings.horsepower
                        ? "warning"
                        : ""
                  }
                />
                {showErrors && errors?.horsepower && (
                  <div className="error-message text-danger mt-1">
                    {errors.horsepower}
                  </div>
                )}
                {inputWarnings.horsepower && !errors?.horsepower && (
                  <div className="warning-message text-warning mt-1">
                    {inputWarnings.horsepower}
                  </div>
                )}
              </fieldset>
            )}
          </>
        )}
      </div>

      <div className="row g-3">
        <p className="fs-4 fw-bolder">
          المزايا الإضافية{" "}
          <small className="fs-12 text-variant-1 fw-normal">(اختياري)</small>
        </p>
        {error ? (
          <Alert className="w-100" message={error} type="error" showIcon />
        ) : loading ? (
          <div className="w-100 d-flex align-items-center justify-content-center">
            <OvalLoader />
          </div>
        ) : featureGroups.length > 0 ? (
          featureGroups.map((group) => (
            <div className="col-lg-3 col-sm-6 col-xs-6" key={group.group_id}>
              <div className="d-flex align-items-center mb-2">
                <Tooltip
                  title={
                    isGroupAllSelected(group)
                      ? "الغاء تحديد الكل"
                      : "تحديد الكل"
                  }
                >
                  <Checkbox
                    onChange={(e) =>
                      handleSelectAllFeatures(group.group_id, e.target.checked)
                    }
                    checked={isGroupAllSelected(group)}
                    indeterminate={isGroupPartiallySelected(group)}
                  >
                    <p className="mb-0 fs-5 ">{group.group_name}</p>
                  </Checkbox>
                </Tooltip>
              </div>
              <div className="d-flex flex-column gap-2">
                {group.features.map((feature) => (
                  <Checkbox
                    key={feature.id}
                    onChange={(e) =>
                      handleFeatureChange(feature.id, e.target.checked)
                    }
                    checked={features?.includes(feature.id)}
                  >
                    <p className="fs-6 fw-normal lh-0">{feature.name}</p>
                  </Checkbox>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Alert
            className="w-100"
            message={
              "لا توجد ميزات مضافة حاليًا لهذه الفئة. يمكنك متابعة نشر إعلانك دون مشاكل."
            }
            type="info"
            showIcon
          />
        )}
      </div>
    </div>
  );
};

export default FeaturesStep;
