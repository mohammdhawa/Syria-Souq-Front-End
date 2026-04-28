import React, { useEffect, useRef, useState } from "react";
import AdvanceSearch from "./AdvanceSearch";
import { Input, Select } from "antd";
import { Categories, SyriaCities } from "@/data/General";
import styled from "styled-components";
import { FilterHorizontalIcon, Search01Icon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import toastNotify from "@/utils/toast";

const StyledInput = styled(Input)`
  width: 100% !important;
  height: 2rem !important;
  font-size: 1rem !important;
  color: black !important;
  border-radius: 0rem !important;
  border-left: 0 !important;
  border-top: 0 !important;
  border-right: 0 !important;
  direction: rtl;
  text-align: right;
  font-weight: regular;
  font-size: 14px !important;
  padding: 0px !important;
  &::placeholder {
    opacity: 0.6 !important;
    padding: 0px !important;
  }
`;

export default function FilterTab({
  tabClass = "nav-tab-form style-1 justify-content-center",
  styleClass = "",
}) {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    adType: null,
    city: null,
    category: null,
    price: {
      min: "",
      max: "",
    },
    area: {
      min: "",
      max: "",
    },
    rooms: "",
    houseType: null,
    brand: null,
    model: null,
    carType: null,
    condition: null,
    year: null,
    color: null,
    fuelType: null,
    transmissionType: null,
    motorcycleType: null,
    coolingType: null,
    marineType: null,
  });

  const ddContainer = useRef();
  const advanceBtnRef = useRef();

  useEffect(() => {
    if (!filters.category) {
      ddContainer.current?.classList.remove("show");
    }
    setFilters({
      ...filters,
      price: {
        min: "",
        max: "",
      },
      area: {
        min: "",
        max: "",
      },
      rooms: "",
      houseType: null,
      brand: null,
      model: null,
      carType: null,
      condition: null,
      year: null,
      color: null,
      fuelType: null,
      transmissionType: null,
      motorcycleType: null,
      coolingType: null,
      marineType: null,
    });
  }, [filters.category]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!filters.category) {
      toastNotify("الرجاء اختيار فئة", "info");
      return;
    }
    let query_filters = {};
    if (filters.adType && filters.adType !== "all")
      query_filters.ad_type = filters.adType;
    if (filters.city) query_filters.city = filters.city;
    if (filters.keyword.trim()) query_filters.keyword = filters.keyword.trim();
    if (filters.price.min.trim())
      query_filters.min_price = filters.price.min.trim();
    if (filters.price.max.trim())
      query_filters.max_price = filters.price.max.trim();

    if (filters.area.min.trim())
      query_filters.min_area = filters.area.min.trim();

    if (filters.area.max.trim())
      query_filters.max_area = filters.area.max.trim();

    if (filters.rooms.trim())
      query_filters.number_of_rooms = filters.rooms.trim();
    if (filters.houseType) query_filters.house_type = filters.houseType;
    if (filters.condition) query_filters.condition = filters.condition;

    if (filters.carType) query_filters.car_type = filters.carType;
    if (filters.motorcycleType)
      query_filters.motorcycle_type = filters.motorcycleType;
    if (filters.brand) query_filters.brand = filters.brand;
    if (filters.model) query_filters.model = filters.model;
    if (filters.year) query_filters.year = filters.year;
    if (filters.color) query_filters.color = filters.color;
    if (filters.fuelType) query_filters.fuel_type = filters.fuelType;
    if (filters.coolingType) query_filters.cooling_type = filters.coolingType;
    if (filters.transmissionType)
      query_filters.transmission_type = filters.transmissionType;
    if (filters.marineType) query_filters.marine_type = filters.marineType;

    const query = new URLSearchParams(query_filters).toString();

    let route;
    switch (parseInt(filters.category)) {
      case 1:
        route = "/lands";
        break;
      case 2:
        route = "/houses";
        break;
      case 3:
        route = "/cars";
        break;
      case 4:
        route = "/marines";
        break;
      case 5:
        route = "/motorcycles";
        break;
      default:
        route = "/";
    }
    navigate(query ? `${route}?${query}` : route);
  };

  return (
    <div className="flat-tab  flat-tab-form ">
      <ul className={tabClass} role="tablist">
        <li className="nav-tab-item " role="presentation">
          <a
            className="nav-link-item active text-dark"
            data-bs-toggle="tab"
            onClick={() => {
              setFilters({
                ...filters,
                adType: "all",
              });
            }}
          >
            الكل
          </a>
        </li>
        <li className="nav-tab-item" role="presentation">
          <a
            className="nav-link-item text-dark"
            data-bs-toggle="tab"
            onClick={() => {
              setFilters({
                ...filters,
                adType: "sale",
              });
            }}
          >
            للبيع
          </a>
        </li>
        <li className="nav-tab-item  text-dark" role="presentation">
          <a
            className="nav-link-item "
            data-bs-toggle="tab"
            style={{ color: "#1E1E1E" }}
            onClick={() => {
              setFilters({
                ...filters,
                adType: "rent",
              });
            }}
          >
            للإيجار
          </a>
        </li>
      </ul>
      <div className="tab-content">
        <div className="tab-pane fade active show " role="tabpanel">
          <div className="form-sl">
            <form onSubmit={handleSearch}>
              <div
                style={{
                  borderRadius: "12px 0rem 12px 12px",
                  border:"1px solid #E4E7EC",
                }}
                className={`wd-find-select ${styleClass}`}
              >
                <div className="inner-group">
                  <div className="form-group-1 search-form form-style  ps-3 pe-0">
                    <label className="fw-5 text-dark fs-6">الفئة</label>
                    <div className="group-select">
                      <Select
                        allowClear
                        value={filters.category}
                        style={{ width: "100%", padding: "0 !important" }}
                        variant="underlined"
                        options={Categories}
                        placeholder={"اختر الفئة"}
                        onChange={(value) => {
                          setFilters({
                            ...filters,
                            category: value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group-2  form-style ps-3 pe-0">
                    <label className="fw-5 text-dark fs-6">المدينة</label>
                    <div className="group-select">
                      <Select
                        allowClear
                        value={filters.city}
                        onChange={(value) => {
                          setFilters({
                            ...filters,
                            city: value,
                          });
                        }}
                        style={{ width: "100%", padding: "0 !important" }}
                        variant="underlined"
                        options={SyriaCities}
                        placeholder={"اختر المدينة"}
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
                    </div>
                  </div>
                  <div className="form-group-3 form-style ps-3 pe-0">
                    <label className="fw-5 text-dark fs-6">
                      الكلمة المفتاحية
                    </label>
                    <StyledInput
                      value={filters.keyword}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          keyword: e.target.value,
                        });
                      }}
                      placeholder="ادخل الكلمة المفتاحية"
                      variant="underlined"
                    />
                  </div>
                </div>
                <div className="box-btn-advanced">
                  <button
                    type="button"
                    onClick={() => {
                      if (filters.category) {
                        ddContainer.current.classList.toggle("show");
                      } else {
                        toastNotify("الرجاء اختيار فئة", "info");
                      }
                    }}
                    ref={advanceBtnRef}
                    style={{ color: "#1E1E1E", borderRadius: "0.6rem" }}
                    className="tf-btn text-dark filter-advanced pull-right "
                  >
                    <FilterHorizontalIcon size={18} />
                    <span className="text-1 ">البحث المتقدم</span>
                  </button>
                  <button
                    type="submit"
                    className="tf-btn btn-search primary"
                    style={{ color: "#1E1E1E", borderRadius: "0.6rem" }}
                  >
                    <Search01Icon size={18} className="mb-1" />
                    <p
                      style={{
                        lineHeight: "0rem",
                      }}
                      className="text-1"
                    >
                      ابحث
                    </p>
                  </button>
                </div>
              </div>
              <div ref={ddContainer} className="wd-search-form">
                <AdvanceSearch filters={filters} setFilters={setFilters} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
