import {
  adTypes,
  Categories_v2,
  conditionTypes,
  ownerTypes,
  RentalPeriod,
  swapOptions,
  SyriaCities,
} from "@/data/General";
import { Alert} from "antd";
import { DollarCircleIcon } from "hugeicons-react";
import React, { useState } from "react";
import { StyledPriceInput, StyledSelect, StyledSpaceCompact } from "../styled";
import { useAdForm } from "../../../context/AdFormContext";
import { formatNumberArabic } from "@/utils/formatNumberArabic";

const formatPrice = (value) => {
  const numericValue = value.replace(/[^\d]/g, "");
  const number = Math.abs(parseInt(numericValue) || 0);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parsePrice = (value) => {
  return value.replace(/,/g, "");
};

const CategoryStep = () => {
  const { state, updateField, showErrors } = useAdForm();
  const {
    category,
    city,
    adType,
    price,
    rentalPeriod,
    isSwap,
    advertiser,
    errors,
  } = state;
  const [inputWarnings, setInputWarnings] = useState({});

  const handlePriceChange = (e) => {
    const rawValue = parsePrice(e.target.value);

    handleIntegerInput(rawValue, "price", 1, 100000000);
  };

  const handleIntegerInput = (
    value,
    fieldName,
    min = 1,
    max = 100000000,
    symbol = "دولار"
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
  return (
    <div className="box w-100 d-flex flex-column gap-2">
      <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
        <label className="mb-2 fs-6 fw-normal">ما الذي تود الإعلان عنه؟</label>
        <StyledSelect
          value={category}
          placeholder={"اختر فئة الإعلان"}
          options={Categories_v2}
          onChange={(value) => updateField("category", value)}
          className="w-100"
          status={showErrors && errors?.category ? "error" : ""}
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
        />
        {showErrors && errors?.category && (
          <div className="error-message text-danger mt-1">
            {errors.category}
          </div>
        )}
      </fieldset>
      <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
        <label className="mb-2 fs-6 fw-normal">الجهة المعلنة</label>
        <StyledSelect
          value={advertiser}
          placeholder={"اختر الجهة المعلنة"}
          options={ownerTypes}
          onChange={(value) => updateField("advertiser", value)}
          className="w-100"
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
          status={showErrors && errors?.advertiser ? "error" : ""}
        />
        {showErrors && errors?.advertiser && (
          <div className="error-message text-danger mt-1">
            {errors.advertiser}
          </div>
        )}
      </fieldset>
      <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
        <label className="mb-2 fs-6 fw-normal">
          ما هي المدينة التي تتواجد فيها؟
        </label>
        <StyledSelect
          showSearch
          value={city}
          placeholder={"اختر المدينة"}
          options={SyriaCities}
          onChange={(value) => updateField("city", value)}
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
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase()) ||
            (option?.value ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          className="w-100"
          status={showErrors && errors?.city ? "error" : ""}
        />
        {showErrors && errors?.city && (
          <div className="error-message text-danger mt-1">{errors.city}</div>
        )}
      </fieldset>
      <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
        <label className="mb-2 fs-6 fw-normal">نوع العقد</label>
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
          value={adType}
          placeholder={"اختر نوع العقد"}
          options={adTypes}
          onChange={(value) => updateField("adType", value)}
          className="w-100"
          status={showErrors && errors?.adType ? "error" : ""}
        />
        {showErrors && errors?.adType && (
          <div className="error-message text-danger mt-1">{errors.adType}</div>
        )}
      </fieldset>
      <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
        <label className="mb-2 fs-6 fw-normal">حدد السعر المطلوب</label>
        {adType === "sale" || !adType ? (
          <>
            <StyledPriceInput
              placeholder={"ادخل السعر"}
              value={price ? formatPrice(price) : ""}
              onChange={handlePriceChange}
              className="w-100"
              type="text"
              prefix={<DollarCircleIcon />}
              status={
                showErrors && errors?.price
                  ? "error"
                  : inputWarnings.price
                  ? "warning"
                  : ""
              }
            />
            {showErrors && errors?.price && (
              <div className="error-message text-danger mt-1">
                {errors.price}
              </div>
            )}
            {inputWarnings.price && !errors?.price && (
              <div className="warning-message text-warning mt-1">
                {inputWarnings.price}
              </div>
            )}
          </>
        ) : (
          <>
            <StyledSpaceCompact direction="horizontal">
              <StyledPriceInput
                placeholder={"ادخل السعر"}
                value={price ? formatPrice(price) : ""}
                onChange={handlePriceChange}
                className="w-100"
                type="text"
                prefix={<DollarCircleIcon />}
                status={
                  showErrors && errors?.price
                    ? "error"
                    : inputWarnings.price
                    ? "warning"
                    : ""
                }
              />
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
                value={rentalPeriod}
                placeholder={"مدة الايجار"}
                options={RentalPeriod}
                onChange={(value) => updateField("rentalPeriod", value)}
                status={showErrors && errors?.rentalPeriod ? "error" : ""}
              />
            </StyledSpaceCompact>
            {showErrors && errors?.price && (
              <div className="error-message text-danger mt-1">
                {errors.price}
              </div>
            )}
            {inputWarnings.price && !errors?.price && (
              <div className="warning-message text-warning mt-1">
                {inputWarnings.price}
              </div>
            )}
            {showErrors && errors?.rentalPeriod && (
              <div className="error-message text-danger mt-1">
                {errors.rentalPeriod}
              </div>
            )}
          </>
        )}
        <Alert
          type="info"
          className="mt-2 w-100"
          showIcon
          closable
          message="أدخل سعراً منطقياً (بالدولار الأمريكي) يعكس قيمة الإعلان ويساعدك في جذب المهتمين بشكل أكبر"
        />
      </fieldset>
      {adType === "sale" && (
        <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
          <label className="mb-2 fs-6 fw-normal">قابل للمقايضة؟</label>
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
            value={isSwap}
            placeholder={"اختر إمكانية المقايضة"}
            options={swapOptions}
            onChange={(value) => updateField("isSwap", value)}
            className="w-100"
            status={showErrors && errors?.isSwap ? "error" : ""}
          />
          {showErrors && errors?.isSwap && (
            <div className="error-message text-danger mt-1">
              {errors.isSwap}
            </div>
          )}
        </fieldset>
      )}
    </div>
  );
};

export default CategoryStep;
