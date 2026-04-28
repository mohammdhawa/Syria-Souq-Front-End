import React, { useState } from "react";
import { Space, Radio, Input, Empty } from "antd";
import {
  carTypes,
  colors,
  conditionTypes,
  coolingTypes,
  fuelTypes,
  houseTypes,
  marineTypes,
  motorcycleTypes,
  SyriaCities,
  transmissionTypes,
  yearOptions,
} from "@/data/General";

import styled from "styled-components";

import { Search01Icon, Cancel01Icon } from "hugeicons-react";

const StyledInput = styled(Input)`
  width: 100% !important;
  height: 3.375rem !important;
  font-size: 1rem !important;
  color: black !important;
  border-radius: 0.6rem !important;
  padding-left: 2rem !important;
  padding-right: 2rem !important;
  direction: rtl;
  text-align: right;
  &::placeholder {
    color: black !important;
    opacity: 0.6 !important;
    font-size: 1rem !important;
  }
`;

const StyledSearchInput = styled(Input)`
  width: 100% !important;
  height: 2.5rem !important;
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

const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  .ant-radio-label {
    font-weight: lighter;
    font-size: 1rem;
  }
  .ant-radio-wrapper {
    direction: rtl;
    margin-right: 0;
    margin-left: 1rem;
  }

  .ant-radio-checked .ant-radio-inner {
    &:after {
      background-color: #000 !important;
    }
  }
`;
const SearchableContainer = styled.div`
  position: relative;
  max-height: 300px;
  display: flex;
  flex-direction: column;
`;

const SearchInputContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  margin-bottom: 0.75rem;
`;

const OptionsContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  scrollbar-width: thin;
`;

const NoDataWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  direction: rtl;
  color: #999;
  font-size: 0.9rem;
`;
const SearchableRadioGroup = ({
  value,
  onChange,
  options,
  placeholder = "ابحث",
  noDataText = "لا توجد نتائج",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    searchTerm
      ? String(option.label).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(option.value).toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const showSearch = options.length > 5;

  return (
    <SearchableContainer>
      {showSearch && (
        <SearchInputContainer>
          <StyledSearchInput
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            prefix={<Search01Icon size={12} />}
          />
        </SearchInputContainer>
      )}

      <OptionsContainer>
        {filteredOptions.length > 0 ? (
          <StyledRadioGroup value={value} onChange={onChange}>
            <Space direction="vertical">
              {filteredOptions.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Space>
          </StyledRadioGroup>
        ) : (
          <NoDataWrapper>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={noDataText}
            />
          </NoDataWrapper>
        )}
      </OptionsContainer>
    </SearchableContainer>
  );
};
const formatPrice = (value) => {
  const numericValue = value.replace(/[^\d]/g, "");
  const number = Math.abs(parseInt(numericValue) || 0);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parsePrice = (value) => {
  return value.replace(/,/g, "");
};

export const getFilterItems = ({
  setCurrentPage,
  keyword,
  category,
  city,
  brand,
  model,
  color,
  fuelType,
  transmissionType,
  condition,
  carType,
  motorcycleType,
  coolingType,
  minPrice,
  maxPrice,
  rooms,
  houseType,
  marineType,
  year,
  minMeterSquare,
  maxMeterSquare,
  brands,
  models,
}) => [
  {
    key: "1",
    label: "الكلمة المفتاحية",
    children: (
      <StyledInput
        value={keyword.keyword}
        onChange={(e) => keyword.setKeyword(e.target.value)}
        type="text"
        placeholder="الكلمة المفتاحية"
      />
    ),
    extra: keyword.keyword ? (
      <Cancel01Icon
        size={16}
        onClick={(event) => {
          event.stopPropagation();
          keyword.setKeyword("");
        }}
        style={{ cursor: "pointer", marginBottom: "0.24rem" }}
      />
    ) : null,
  },
  {
    key: "2",
    label: "المدينة",
    children: (
      <SearchableRadioGroup
        value={city.city}
        onChange={(e) => {
          city.setCity(e.target.value);
        }}
        options={SyriaCities}
        placeholder="ابحث عن مدينة"
      />
    ),
    extra: city.city ? (
      <Cancel01Icon
        size={16}
        onClick={(event) => {
          event.stopPropagation();
          city.setCity(undefined);
        }}
        style={{ cursor: "pointer", marginBottom: "0.24rem" }}
      />
    ) : null,
  },
  ...(category === "cars"
    ? [
        {
          key: "3",
          label: "نوع السيارة",
          children: (
            <SearchableRadioGroup
              value={carType.carType}
              onChange={(e) => {
                carType.setCarType(e.target.value);
              }}
              options={carTypes}
              placeholder="ابحث عن نوع السيارة"
            />
          ),
          extra: carType.carType ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                carType.setCarType(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
      ]
    : []),
  ...(category === "motorcycles"
    ? [
        {
          key: "4",
          label: "نوع الدراجة",
          children: (
            <SearchableRadioGroup
              value={motorcycleType.motorcycleType}
              onChange={(e) => {
                motorcycleType.setMotorcycleType(e.target.value);
              }}
              options={motorcycleTypes}
              placeholder="ابحث عن نوع الدراجة"
            />
          ),
          extra: motorcycleType.motorcycleType ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                motorcycleType.setMotorcycleType(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
      ]
    : []),
  ...(category === "marines"
    ? [
        {
          key: "5",
          label: "نوع المركبة",
          children: (
            <SearchableRadioGroup
              value={marineType.marineType}
              onChange={(e) => {
                marineType.setMarineType(e.target.value);
              }}
              options={marineTypes}
              placeholder="ابحث عن نوع المركبة"
            />
          ),
          extra: marineType.marineType ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                marineType.setMarineType(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
      ]
    : []),
  ...(["cars", "marines", "motorcycles"].includes(category)
    ? [
        {
          key: "6",
          label: "العلامة التجارية",
          children: (
            <SearchableRadioGroup
              value={brand.brand}
              onChange={(e) => {
                brand.setBrand(e.target.value);
              }}
              options={brands}
              placeholder="ابحث عن العلامة التجارية"
            />
          ),
          extra: brand.brand ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                brand.setBrand(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
        ...(brand.brand
          ? [
              {
                key: "7",
                label: "الموديل",
                children: (
                  <SearchableRadioGroup
                    value={model.model}
                    onChange={(e) => {
                      model.setModel(e.target.value);
                    }}
                    options={models}
                    placeholder="ابحث عن الموديل"
                  />
                ),
                extra: model.model ? (
                  <Cancel01Icon
                    size={16}
                    onClick={(event) => {
                      event.stopPropagation();
                      model.setModel(undefined);
                    }}
                    style={{ cursor: "pointer", marginBottom: "0.24rem" }}
                  />
                ) : null,
              },
            ]
          : []),
        {
          key: "8",
          label: "سنة التصنيع",
          children: (
            <SearchableRadioGroup
              value={year.year}
              onChange={(e) => {
                year.setYear(e.target.value);
              }}
              options={yearOptions}
              placeholder="ابحث عن السنة"
            />
          ),
          extra: year.year ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                year.setYear(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
        {
          key: "9",
          label: "الحالة",
          children: (
            <SearchableRadioGroup
              value={condition.condition}
              onChange={(e) => {
                condition.setCondition(e.target.value);
              }}
              options={conditionTypes}
              placeholder="ابحث عن الحالة"
            />
          ),
          extra: condition.condition ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                condition.setCondition(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
        {
          key: "10",
          label: "اللون",
          children: (
            <SearchableRadioGroup
              value={color.color}
              onChange={(e) => {
                color.setColor(e.target.value);
              }}
              options={colors}
              placeholder="ابحث عن اللون"
            />
          ),
          extra: color.color ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                color.setColor(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
        {
          key: "11",
          label: "نوع الوقود",
          children: (
            <SearchableRadioGroup
              value={fuelType.fuelType}
              onChange={(e) => {
                fuelType.setFuelType(e.target.value);
              }}
              options={fuelTypes}
              placeholder="ابحث عن نوع الوقود"
            />
          ),
          extra: fuelType.fuelType ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                fuelType.setFuelType(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
      ]
    : []),
  ...(["cars", "motorcycles"].includes(category)
    ? [
        {
          key: "12",
          label: "الغيار",
          children: (
            <SearchableRadioGroup
              value={transmissionType.transmissionType}
              onChange={(e) => {
                transmissionType.setTransmissionType(e.target.value);
              }}
              options={transmissionTypes}
              placeholder="ابحث عن نوع الغيار"
            />
          ),
          extra: transmissionType.transmissionType ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                transmissionType.setTransmissionType(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
      ]
    : []),
  ...(category === "motorcycles"
    ? [
        {
          key: "13",
          label: "نوع التبريد",
          children: (
            <SearchableRadioGroup
              value={coolingType.coolingType}
              onChange={(e) => {
                coolingType.setCoolingType(e.target.value);
              }}
              options={coolingTypes}
              placeholder="ابحث عن نوع التبريد"
            />
          ),
          extra: coolingType.coolingType ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                coolingType.setCoolingType(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
      ]
    : []),
  ...(category === "houses"
    ? [
        {
          key: "14",
          label: "نوع المنزل",
          children: (
            <SearchableRadioGroup
              value={houseType.houseType}
              onChange={(e) => {
                houseType.setHouseType(e.target.value);
              }}
              options={houseTypes}
              placeholder="ابحث عن نوع المنزل"
            />
          ),
          extra: houseType.houseType ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                houseType.setHouseType(undefined);
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
        {
          key: "15",
          label: "عدد الغرف",
          children: (
            <StyledInput
              value={rooms.rooms}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  (/^\d*$/.test(value) && parseInt(value) >= 0)
                ) {
                  rooms.setRooms(value);
                }
              }}
              type="text"
              placeholder="عدد الغرف"
              variant="borderless"
            />
          ),
          extra: rooms.rooms ? (
            <Cancel01Icon
              size={16}
              onClick={(event) => {
                event.stopPropagation();
                rooms.setRooms("");
              }}
              style={{ cursor: "pointer", marginBottom: "0.24rem" }}
            />
          ) : null,
        },
      ]
    : []),
  ...(category === "lands" || category === "houses"
    ? [
        {
          key: "16",
          label: "المساحة",
          children: (
            <div className="d-flex gap-2 justify-content-between">
              <StyledInput
                value={minMeterSquare.minMeterSquare}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (/^\d*$/.test(value) && parseInt(value) >= 0)
                  ) {
                    minMeterSquare.setMinMeterSquare(value);
                  }
                }}
                type="text"
                placeholder="أقل مساحة"
                variant="borderless"
              />
              <StyledInput
                value={maxMeterSquare.maxMeterSquare}
                onChange={(e) => {
                  const value = e.target.value;

                  if (
                    value === "" ||
                    (/^\d*$/.test(value) && parseInt(value) >= 0)
                  ) {
                    maxMeterSquare.setMaxMeterSquare(value);
                  }
                }}
                type="text"
                placeholder="أعلى مساحة"
                variant="borderless"
              />
            </div>
          ),
          extra:
            minMeterSquare.minMeterSquare || maxMeterSquare.maxMeterSquare ? (
              <Cancel01Icon
                size={16}
                onClick={(event) => {
                  event.stopPropagation();
                  minMeterSquare.setMinMeterSquare("");
                  maxMeterSquare.setMaxMeterSquare("");
                }}
                style={{ cursor: "pointer", marginBottom: "0.24rem" }}
              />
            ) : null,
        },
      ]
    : []),
  {
    key: "17",
    label: "السعر",
    children: (
      <div className="d-flex gap-2 justify-content-between">
        <StyledInput
          value={minPrice.minPrice ? formatPrice(minPrice.minPrice) : ""}
          onChange={(e) => {
            const rawValue = parsePrice(e.target.value);
            if (
              rawValue === "" ||
              (!isNaN(rawValue) && parseInt(rawValue) >= 0)
            ) {
              minPrice.setMinPrice(rawValue);
            }
          }}
          type="text"
          placeholder="أقل سعر"
          variant="borderless"
        />
        <StyledInput
          value={maxPrice.maxPrice ? formatPrice(maxPrice.maxPrice) : ""}
          onChange={(e) => {
            const rawValue = parsePrice(e.target.value);
            if (
              rawValue === "" ||
              (!isNaN(rawValue) && parseInt(rawValue) >= 0)
            ) {
              maxPrice.setMaxPrice(rawValue);
            }
          }}
          type="text"
          placeholder="أعلى سعر"
          variant="borderless"
        />
      </div>
    ),
    extra:
      minPrice.minPrice || maxPrice.maxPrice ? (
        <Cancel01Icon
          size={16}
          onClick={(event) => {
            event.stopPropagation();
            minPrice.setMinPrice("");
            maxPrice.setMaxPrice("");
          }}
          style={{ cursor: "pointer", marginBottom: "0.24rem" }}
        />
      ) : null,
  },
];
