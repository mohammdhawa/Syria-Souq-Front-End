import RenderAd from "@/components/Advertisements/RenderAd";
import MetaComponent from "@/components/common/MetaComponent";
import ComponentLoader from "@/components/ComponentLoader";
import { adTypes, Categories, ownerTypes, SyriaCities } from "@/data/General";
import { fetchFavorites } from "@/redux/actions/favoritesActions";
import { Breadcrumb, Col, Empty, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
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
const { Option } = Select;

const FavoritesPage = () => {
  const { favorites, loading } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedOwnerType, setSelectedOwnerType] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);
  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setFilteredFavorites([]);
      return;
    }

    let filtered = [...favorites];
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.advertisement.title.toLowerCase().includes(searchLower) ||
          item.advertisement.description.toLowerCase().includes(searchLower)
      );
    }
    if (selectedCategories) {
      filtered = filtered.filter(
        (item) => item.advertisement.category.id === selectedCategories
      );
    }
    if (selectedCity) {
      filtered = filtered.filter(
        (item) => item.advertisement.city === selectedCity
      );
    }
    if (selectedOwnerType) {
      filtered = filtered.filter(
        (item) => item.advertisement.owner_type === selectedOwnerType
      );
    }
    if (selectedType) {
      filtered = filtered.filter(
        (item) => item.advertisement.type === selectedType
      );
    }

    setFilteredFavorites(filtered);
  }, [
    favorites,
    searchTerm,
    selectedCategories,
    selectedCity,
    selectedOwnerType,
    selectedType,
  ]);

  const metadata = {
    title: `Syria Souq | الإعلانات المفضلة`,
  };

  return (
    <>
      <MetaComponent meta={metadata} />

      {loading ? (
        <ComponentLoader />
      ) : (
        <>
          <div className="d-flex align-items-start flex-column mb-4">
            <span className="fs-4 fw-bold mb-1">الإعلانات المفضلة</span>
            <Breadcrumb
              items={[
                {
                  title: "لوحة التحكم",
                },
                {
                  title: "الإعلانات المفضلة",
                },
              ]}
            />
          </div>
          {favorites.length > 0 ? (
            <>
              {/* <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={6}>
                  <span className="title-price fw-5 fs-6 mb-1">الفئة</span>
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
                    placeholder="اختر الفئة"
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                    allowClear
                    style={{ width: "100%" }}
                    optionLabelProp="label"
                    options={Categories}
                  />
                </Col>

                <Col xs={24} sm={24} md={12} lg={6}>
                  <span className="title-price fw-5 fs-6 mb-1">المدينة</span>
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
                    placeholder="اختر المدينة"
                    value={selectedCity}
                    onChange={setSelectedCity}
                    allowClear
                  >
                    {SyriaCities.map((city) => (
                      <Option key={city.value} value={city.value}>
                        {city.label}
                      </Option>
                    ))}
                  </StyledSelect>
                </Col>
                <Col xs={24} sm={24} md={12} lg={6}>
                  <span className="title-price fw-5 fs-6 mb-1">
                    الجهة المعلنة
                  </span>
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
                    placeholder="اختر الجهة المعلنة"
                    value={selectedOwnerType}
                    onChange={setSelectedOwnerType}
                    allowClear
                  >
                    {ownerTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </StyledSelect>
                </Col>

                <Col xs={24} sm={24} md={12} lg={6}>
                  <span className="title-price fw-5 fs-6 mb-1">نوع العقد</span>
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
                    placeholder="اختر نوع العقد"
                    value={selectedType}
                    onChange={setSelectedType}
                    allowClear
                  >
                    {adTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </StyledSelect>
                </Col>
              </Row> */}

              {filteredFavorites.length > 0 ? (
                <div className="favorite-gallery mt-3">
                  {filteredFavorites.map((ad, index) => (
                    <div key={index} className="favorite-gallery-item">
                      <RenderAd favorite={true} ad={ad?.advertisement} />
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  description="لا توجد إعلانات مفضلة تطابق معايير البحث"
                  style={{ padding: 40 }}
                />
              )}
            </>
          ) : (
            <Empty
              description={"لم تقم بإضافة أي إعلان الى المفضلة"}
              style={{ padding: 40, borderRadius: "0.6rem" }}
              className="d-flex m-0 bg-light flex-column align-items-center  w-100"
            >
              <button
                className="tf-btn primary text-dark "
                type="primary"
                onClick={() => (window.location.href = "/")}
              >
                تصفح الإعلانات الآن
              </button>
            </Empty>
          )}
        </>
      )}
    </>
  );
};

export default FavoritesPage;
