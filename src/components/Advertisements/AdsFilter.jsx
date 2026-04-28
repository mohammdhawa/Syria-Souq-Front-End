import React, { useEffect, useState } from "react";
import { Collapse } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { getFilterItems } from "./FilterCollapseItems";

const StyledCollapse = styled(Collapse)`
  border-radius: 1rem;
  .ant-collapse-content-box {
    max-height: 20rem;
    overflow-y: hidden;
    scrollbar-width: none;
    scrollbar-color: #ffe800 transparent;
    scrollbar-margin: 1rem;
    background: white;
    border: 2px solid #fbfbfb;
  }
  .ant-collapse-header {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
    background: #fbfbfb !important;
  }
`;

export default function AdsFilter({
  setCurrentPage,
  keyword,
  category,
  adType,
  setAdType,
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
  resetFilters,
  isForMobile,
}) {
  const { brands, models } = useSelector((state) => state.vehicles);
  const [activeKey, setActiveKey] = useState(["1"]);
  useEffect(() => {
    setActiveKey(["1"]);
  }, [category]);

  const filterItems = getFilterItems({
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
  });
  return (
    <div className={`flat-tab  flat-tab-form ${isForMobile && "p-0 border-0"} widget-filter-search widget-box`}>
      <ul className="nav-tab-form mb-1" role="tablist">
        <li className="nav-tab-item" role="presentation">
          <a
            style={{ color: "#1e1e1e", borderRadius: "0.6rem" }}
            href="#forAll"
            className={`nav-link-item ${adType === "all" && "active"}`}
            data-bs-toggle="tab"
            onClick={() => {
              setAdType("all");
              setCurrentPage(1);
            }}
          >
            الكل
          </a>
        </li>
        <li className="nav-tab-item" role="presentation">
          <a
            style={{ color: "#1e1e1e", borderRadius: "0.6rem" }}
            href="#forRent"
            className={`nav-link-item ${adType === "rent" && "active"}`}
            data-bs-toggle="tab"
            onClick={() => {
              setAdType("rent");
              setCurrentPage(1);
            }}
          >
            للإيجار
          </a>
        </li>
        <li className="nav-tab-item" role="presentation">
          <a
            style={{ color: "#1e1e1e", borderRadius: "0.6rem" }}
            href="#forSale"
            className={`nav-link-item ${adType === "sale" && "active"}`}
            data-bs-toggle="tab"
            onClick={() => {
              setAdType("sale");
              setCurrentPage(1);
            }}
          >
            للبيع
          </a>
        </li>
      </ul>
      <div className="tab-content">
        <div className="tab-pane fade active show" role="tabpanel">
          <div className="form-sl">
            <form>
              <div className="wd-filter-select">
                <div className="inner-group">
                  <div className="box">
                    <StyledCollapse
                      style={{
                        fontSize: "1.1rem",
                      }}
                      accordion
                      expandIconPosition="end"
                      items={filterItems}
                      bordered={false}
                      ghost
                      activeKey={activeKey}
                      onChange={(key) => setActiveKey(key)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <button
          onClick={resetFilters}
          style={{
            borderRadius: "0.6rem",
          }}
          className="tf-btn primary text-dark w-100"
        >
          إعادة تعيين
        </button>
      </div>
    </div>
  );
}
