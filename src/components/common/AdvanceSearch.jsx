import { useEffect } from "react";
import styled from "styled-components";
import { Input, Select } from "antd";
import {
  carTypes,
  colors,
  conditionTypes,
  coolingTypes,
  fuelTypes,
  houseTypes,
  marineTypes,
  motorcycleTypes,
  transmissionTypes,
  yearOptions,
} from "@/data/General";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "@/redux/actions/brandsActions";
import { fetchModels } from "@/redux/actions/modelsActions";

const StyledInput = styled(Input)`
  width: 100% !important;
  height: 3rem !important;
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

const StyledSelect = styled(Select)`
  width: 100% !important;
  height: 3rem !important;
  color: black !important;
  .ant-select-selector {
    border-radius: 0.6rem !important;
    padding-left: 2rem !important;
    padding-right: 2rem !important;
    font-size: 1rem !important;
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

const formatPrice = (value) => {
  const numericValue = value.replace(/[^\d]/g, "");
  const number = Math.abs(parseInt(numericValue) || 0);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parsePrice = (value) => {
  return value.replace(/,/g, "");
};

export default function AdvanceSearch({ filters, setFilters }) {
  const { brands, models, loading } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      filters.category === 3 ||
      filters.category === 4 ||
      filters.category === 5
    ) {
      dispatch(fetchBrands(filters.category));
    }
  }, [dispatch, filters.category]);

  useEffect(() => {
    if (filters.brand) {
      dispatch(fetchModels(filters.brand));
    }
  }, [dispatch, filters.brand]);

  return (
    <div
      className="grid-2 mb-0 group-box group-price"
      style={{
        gap: "1.5rem 1.5rem",
      }}
    >
      {/* Area Filter (Lands and Houses) */}
      {(filters.category === 1 || filters.category === 2) && (
        <>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">
                المساحة{" "}
                <small className="fw-normal text-variant-1">(متر مربع)</small>
              </span>

              <div className="w-100 d-flex gap-2">
                <StyledInput
                  value={filters.area.min}
                  type="text"
                  placeholder="أدنى مساحة"
                  onChange={(e) => {
                    const rawValue = parsePrice(e.target.value);
                    if (
                      rawValue === "" ||
                      (!isNaN(rawValue) && parseInt(rawValue) >= 0)
                    ) {
                      setFilters({
                        ...filters,
                        area: {
                          ...filters.area,
                          min: rawValue,
                        },
                      });
                    }
                  }}
                />
                <StyledInput
                  value={filters.area.max}
                  type="text"
                  placeholder="أقصى مساحة"
                  onChange={(e) => {
                    const rawValue = parsePrice(e.target.value);
                    if (
                      rawValue === "" ||
                      (!isNaN(rawValue) && parseInt(rawValue) >= 0)
                    ) {
                      setFilters({
                        ...filters,
                        area: {
                          ...filters.area,
                          max: rawValue,
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* House Filters (Houses) */}
      {filters.category === 2 && (
        <>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">نوع المنزل</span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={houseTypes}
                  value={filters?.houseType}
                  placeholder={"اختر نوع المنزل"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      houseType: value,
                    });
                  }}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">عدد الغرف</span>

              <div className="w-100 d-flex gap-2">
                <StyledInput
                  value={filters.rooms}
                  type="text"
                  placeholder="ادخل عدد الغرف"
                  onChange={(e) => {
                    const rawValue = parsePrice(e.target.value);
                    if (
                      rawValue === "" ||
                      (!isNaN(rawValue) && parseInt(rawValue) >= 0)
                    ) {
                      setFilters({
                        ...filters,
                        rooms: rawValue,
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Vehicle Filters (Cars, Marines, Motorcycles) */}
      {(filters.category === 3 ||
        filters.category === 4 ||
        filters.category === 5) && (
        <>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">
                العلامة التجارية
              </span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={brands}
                  value={filters?.brand}
                  placeholder={"اختر العلامة التجارية"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      brand: value,
                      model: null,
                    });
                  }}
                  showSearch
                  allowClear
                  loading={loading}
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";

                    return label.includes(input.toLowerCase());
                  }}
                />
              </div>
            </div>
          </div>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">الموديل</span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={models}
                  value={filters?.model}
                  placeholder={"اختر الموديل"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      model: value,
                    });
                  }}
                  showSearch
                  allowClear
                  disabled={!filters.brand || loading}
                  loading={loading}
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";

                    return label.includes(input.toLowerCase());
                  }}
                />
              </div>
            </div>
          </div>

          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">سنة التصنيع</span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={yearOptions}
                  value={filters?.year}
                  placeholder={"اختر سنة التصنيع"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      year: value,
                    });
                  }}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">الحالة</span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={conditionTypes}
                  value={filters?.condition}
                  placeholder={"اختر الحالة"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      condition: value,
                    });
                  }}
                  allowClear
                />
              </div>
            </div>
          </div>

          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">اللون الخارجي</span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={colors}
                  value={filters?.color}
                  placeholder={"اختر اللون الخارجي"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      color: value,
                    });
                  }}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">نوع الوقود</span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={fuelTypes}
                  value={filters?.fuelType}
                  placeholder={"اختر نوع الوقود"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      fuelType: value,
                    });
                  }}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {(filters.category === 3 || filters.category === 5) && (
        <div className="widget-price">
          <div className="box-title-price d-flex flex-column align-items-start">
            <span className="title-price fw-5 fs-6 mb-1">نوع الغيار</span>

            <div className="w-100 d-flex gap-2">
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
                style={{ width: "100%" }}
                options={transmissionTypes}
                value={filters?.transmissionType}
                placeholder={"اختر نوع الغيار"}
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    transmissionType: value,
                  });
                }}
                allowClear
              />
            </div>
          </div>
        </div>
      )}
      {/* Car Filter (Cars) */}
      {filters.category === 3 && (
        <div className="widget-price">
          <div className="box-title-price d-flex flex-column align-items-start">
            <span className="title-price fw-5 fs-6 mb-1">نوع السيارة</span>

            <div className="w-100 d-flex gap-2">
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
                style={{ width: "100%" }}
                options={carTypes}
                value={filters?.carType}
                placeholder={"اختر نوع السيارة"}
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    carType: value,
                  });
                }}
                allowClear
                showSearch
                filterOption={(input, option) => {
                  const label = option.label?.toString().toLowerCase() || "";
                  const value = option.value?.toString().toLowerCase() || "";
                  return (
                    label.includes(input.toLowerCase()) ||
                    value.includes(input.toLowerCase())
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Motorcycle Filter (Motorcycles) */}
      {filters.category === 5 && (
        <>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">نوع الدراجة</span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={motorcycleTypes}
                  value={filters?.motorcycleType}
                  placeholder={"اختر نوع الدراجة"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      motorcycleType: value,
                    });
                  }}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">نوع التبريد</span>

              <div className="w-100 d-flex gap-2">
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
                  style={{ width: "100%" }}
                  options={coolingTypes}
                  value={filters?.coolingType}
                  placeholder={"اختر نوع التبريد"}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      coolingType: value,
                    });
                  }}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label?.toString().toLowerCase() || "";
                    const value = option.value?.toString().toLowerCase() || "";
                    return (
                      label.includes(input.toLowerCase()) ||
                      value.includes(input.toLowerCase())
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Marine Filter (Marines) */}
      {filters.category === 4 && (
        <div className="widget-price">
          <div className="box-title-price d-flex flex-column align-items-start">
            <span className="title-price fw-5 fs-6 mb-1">نوع المركبة</span>

            <div className="w-100 d-flex gap-2">
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
                style={{ width: "100%" }}
                options={marineTypes}
                value={filters?.marineType}
                placeholder={"اختر نوع المركبة"}
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    marineType: value,
                  });
                }}
                allowClear
                showSearch
                filterOption={(input, option) => {
                  const label = option.label?.toString().toLowerCase() || "";
                  const value = option.value?.toString().toLowerCase() || "";
                  return (
                    label.includes(input.toLowerCase()) ||
                    value.includes(input.toLowerCase())
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Price Filter (Common for all categories) */}
      {(filters.category === 1 ||
        filters.category === 2 ||
        filters.category === 3 ||
        filters.category === 4 ||
        filters.category === 5) && (
        <>
          <div className="widget-price">
            <div className="box-title-price d-flex flex-column align-items-start">
              <span className="title-price fw-5 fs-6 mb-1">السعر</span>

              <div className="w-100 d-flex gap-2">
                <StyledInput
                  value={
                    filters.price.min ? formatPrice(filters.price.min) : ""
                  }
                  type="text"
                  placeholder="أدنى سعر"
                  onChange={(e) => {
                    const rawValue = parsePrice(e.target.value);
                    if (
                      rawValue === "" ||
                      (!isNaN(rawValue) && parseInt(rawValue) >= 0)
                    ) {
                      setFilters({
                        ...filters,
                        price: {
                          ...filters.price,
                          min: rawValue,
                        },
                      });
                    }
                  }}
                />
                <StyledInput
                  value={
                    filters.price.max ? formatPrice(filters.price.max) : ""
                  }
                  type="text"
                  placeholder="أقصى سعر"
                  onChange={(e) => {
                    const rawValue = parsePrice(e.target.value);
                    if (
                      rawValue === "" ||
                      (!isNaN(rawValue) && parseInt(rawValue) >= 0)
                    ) {
                      setFilters({
                        ...filters,
                        price: {
                          ...filters.price,
                          max: rawValue,
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
