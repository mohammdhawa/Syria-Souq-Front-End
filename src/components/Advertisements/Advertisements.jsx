import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Pagination from "../common/Pagination";
import AdsFilter from "./AdsFilter";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdvertisements } from "@/redux/actions/advertisementsActions";
import RenderAd from "./RenderAd";
import { ListViewIcon, MenuSquareIcon } from "hugeicons-react";
import { Drawer, Dropdown, Select } from "antd";
import { itemsPerPage, sortOptions } from "@/data/General";
import MetaComponent from "../common/MetaComponent";
import { fetchBrands } from "@/redux/actions/brandsActions";
import { fetchModels } from "@/redux/actions/modelsActions";
import RenderAdLine from "./RenderAdLine";
import useDebounce from "@/hooks/useDebounce";
import formatArabicAdsCount from "@/utils/formatArabicAdsCount";
import OvalLoader from "../OvalLoader";
import Loader from "../Loader";
import SkeletonCard from "../SkeletonCard";

export default function Advertisements() {
  const dispatch = useDispatch();
  const { advertisements, pagination, advertisementLoading } = useSelector(
    (state) => state.advertisements
  );
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [viewMode, setViewMode] = useState("grid");
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortingOption, setSortingOption] = useState("activated_at_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [adType, setAdType] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState(null);
  // Vehicle filters
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [color, setColor] = useState(null);
  const [fuelType, setFuelType] = useState(null);
  const [transmissionType, setTransmissionType] = useState(null);
  const [condition, setCondition] = useState(null);
  const [year, setYear] = useState(null);
  // Car-specific filter
  const [carType, setCarType] = useState(null);
  const [initialPageTitle, setInitialPageTitle] = useState("");
  // Motorcycles filters
  const [motorcycleType, setMotorcycleType] = useState(null);
  const [coolingType, setCoolingType] = useState(null);
  // Houses filters
  const [rooms, setRooms] = useState("");
  const [houseType, setHouseType] = useState(null);
  // Marines filters
  const [marineType, setMarineType] = useState(null);
  // Land and house filters
  const [minMeterSquare, setMinMeterSquare] = useState("");
  const [maxMeterSquare, setMaxMeterSquare] = useState("");
  const [isFirstCategoryLoad, setIsFirstCategoryLoad] = useState(true);
  const [isParamsParsed, setIsParamsParsed] = useState(false);
  const [resettingFilters, setResettingFilters] = useState(false);

  // Debounced values
  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);
  const debouncedRooms = useDebounce(rooms, 500);
  const debouncedMinMeterSquare = useDebounce(minMeterSquare, 500);
  const debouncedMaxMeterSquare = useDebounce(maxMeterSquare, 500);

  useEffect(() => {
    if (resettingFilters) {
      setResettingFilters(false);
      return;
    }
    const params = Object.fromEntries(searchParams);
    setKeyword(params.keyword || "");
    setAdType(params.ad_type || "all");
    setCity(params.city || null);
    setMinPrice(params.min_price || "");
    setMaxPrice(params.max_price || "");
    setMinMeterSquare(params.min_area || "");
    setMaxMeterSquare(params.max_area || "");
    setRooms(params.number_of_rooms || "");
    setHouseType(params.house_type || null);
    setCarType(params.car_type || null);
    setBrand(Number(params.brand) || null);
    setModel(Number(params.model) || null);
    setCondition(params.condition || null);
    setYear(Number(params.year) || null);
    setColor(params.color || null);
    setFuelType(params.fuel_type || null);
    setTransmissionType(params.transmission_type || null);
    setMotorcycleType(params.motorcycle_type || null);
    setCoolingType(params.cooling_type || null);
    setMarineType(params.marine_type || null);
    setCurrentPage(1);
    setIsParamsParsed(true);
  }, [searchParams]);
  useEffect(() => {
    if (filterDrawerOpen) {
      document.body.style.overflowY = "auto";
      document.body.style.width = "100%";
    }
  }, [filterDrawerOpen]);
  useEffect(() => {
    if (!isParamsParsed || isFirstCategoryLoad || advertisementLoading) return;
    const newParams = {};
    if (adType && adType !== "all") newParams.ad_type = adType;
    if (keyword) newParams.keyword = keyword;
    if (city) newParams.city = city;
    if (minPrice) newParams.min_price = minPrice;
    if (maxPrice) newParams.max_price = maxPrice;
    if (minMeterSquare) newParams.min_area = minMeterSquare;
    if (maxMeterSquare) newParams.max_area = maxMeterSquare;
    if (rooms) newParams.number_of_rooms = rooms;
    if (houseType) newParams.house_type = houseType;
    if (carType) newParams.car_type = carType;
    if (brand) newParams.brand = brand;
    if (model) newParams.model = model;
    if (condition) newParams.condition = condition;
    if (year) newParams.year = year;
    if (color) newParams.color = color;
    if (fuelType) newParams.fuel_type = fuelType;
    if (transmissionType) newParams.transmission_type = transmissionType;
    if (motorcycleType) newParams.motorcycle_type = motorcycleType;
    if (coolingType) newParams.cooling_type = coolingType;
    if (marineType) newParams.marine_type = marineType;

    const currentParams = Object.fromEntries(searchParams);
    const hasChanges =
      Object.keys(newParams).some(
        (key) => newParams[key] !== currentParams[key]
      ) ||
      Object.keys(currentParams).some(
        (key) => !newParams[key] && currentParams[key] !== undefined
      );

    if (hasChanges) {
      setSearchParams(newParams, { replace: true });
    }
  }, [
    isParamsParsed,
    adType,
    debouncedKeyword,
    city,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedMinMeterSquare,
    debouncedMaxMeterSquare,
    debouncedRooms,
    houseType,
    carType,
    brand,
    model,
    condition,
    year,
    color,
    fuelType,
    motorcycleType,
    transmissionType,
    coolingType,
    marineType,
    advertisementLoading,
  ]);

  useEffect(() => {
    setIsFirstCategoryLoad(true);
    setViewMode("grid");
    setInitialPageTitle(categoryMap().title);
  }, [category]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setFilterDrawerOpen(false);
      }
      if (window.innerWidth < 991) {
        setViewMode("grid");
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (filterDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterDrawerOpen]);
  useEffect(() => {
    if (advertisementLoading) return;
    if (isFirstCategoryLoad) {
      setTimeout(() => {
        setIsFirstCategoryLoad(false);
      }, 1000);
    }
  }, [advertisementLoading, isFirstCategoryLoad]);

  const resetFilters = () => {
    setResettingFilters(true);
    setMinPrice("");
    setMaxPrice("");
    setBrand(null);
    setModel(null);
    setColor(null);
    setFuelType(null);
    setTransmissionType(null);
    setCondition(null);
    setCarType(null);
    setMotorcycleType(null);
    setCoolingType(null);
    setRooms("");
    setHouseType(null);
    setMarineType(null);
    setYear(null);
    setMinMeterSquare("");
    setMaxMeterSquare("");
    setCity(null);
    setKeyword("");
    setAdType("all");
    setCurrentPage(1);
  };

  const categoryMap = () => {
    switch (category) {
      case "lands":
        return { id: 1, title: "الأراضي" };
      case "houses":
        return { id: 2, title: "المنازل" };
      case "cars":
        return { id: 3, title: "السيارات" };
      case "marines":
        return { id: 4, title: "المركبات البحرية" };
      case "motorcycles":
        return { id: 5, title: "الدراجات النارية" };
      default:
        return { id: null, title: "الإعلانات" };
    }
  };

  const { id: categoryId, title: pageTitle } = categoryMap();

  useEffect(() => {
    if (["cars", "marines", "motorcycles"].includes(category)) {
      dispatch(fetchBrands(categoryId));
    }
  }, [category, dispatch, categoryId]);

  useEffect(() => {
    if (brand) {
      dispatch(fetchModels(brand));
    }
  }, [brand, dispatch]);
  useEffect(() => {
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);
  useEffect(() => {
    if (window.innerWidth > 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (!isParamsParsed || isFirstCategoryLoad) return;

    const params = Object.fromEntries(searchParams);

    dispatch(
      fetchAdvertisements(
        itemPerPage,
        currentPage,
        categoryId,
        sortingOption,
        params.ad_type || "all",
        params.keyword || "",
        params.min_price || "",
        params.max_price || "",
        params.city || null,
        params.color || null,
        params.fuel_type || null,
        params.transmission_type || null,
        params.condition || null,
        params.car_type || null,
        params.motorcycle_type || null,
        params.cooling_type || null,
        Number(params.brand) || null,
        Number(params.model) || null,
        params.number_of_rooms || "",
        params.house_type || null,
        params.marine_type || null,
        Number(params.year) || null,
        params.min_area || "",
        params.max_area || ""
      )
    );
  }, [
    searchParams,
    dispatch,
    isParamsParsed,
    isFirstCategoryLoad,
    categoryId,
    itemPerPage,
    currentPage,
    sortingOption,
  ]);

  const metadata = {
    title: `سوق سوريا | ${initialPageTitle}`,
    description: `سوق سوريا - جميع ${initialPageTitle}`,
  };

  return isFirstCategoryLoad ? (
    <Loader />
  ) : (
    <>
      <MetaComponent meta={metadata} />
      <section className="flat-section flat-recommended flat-sidebar">
        <div className="container">
          <div className="box-title-listing">
            <div className="box-left gap-3">
              <h3 className="fw-8">لائحة {initialPageTitle}</h3>
              <span style={{ color: "#3A3A3C" }} className="text">
                {advertisementLoading ? (
                  <OvalLoader />
                ) : (
                  <>{formatArabicAdsCount(pagination.total)}</>
                )}
              </span>
            </div>
            <div className="box-filter-tab d-flex align-items-center justify-content-between gap-2">
              <ul className="nav-tab-filter gap-2" role="tablist">
                <li className="nav-tab-item" role="presentation">
                  <button
                    className={`nav-link-item ${
                      viewMode === "grid" ? "active" : ""
                    } bg-white ${viewMode === "grid" ? "border-dark" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <MenuSquareIcon size={20} />
                  </button>
                </li>
                <li className="nav-tab-item" role="presentation">
                  <button
                    className={`nav-link-item ${
                      viewMode === "list" ? "active" : ""
                    } bg-white ${viewMode === "list" ? "border-dark" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <ListViewIcon size={20} />
                  </button>
                </li>
              </ul>
              <div className="d-flex gap-2 sorting-filters">
                <Select
                  value={itemPerPage}
                  style={{ width: 120 }}
                  size="large"
                  onChange={(value) => {
                    setItemPerPage(value);
                    setCurrentPage(1);
                  }}
                  options={itemsPerPage}
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
                <Select
                  value={sortingOption}
                  placeholder="ترتيب حسب"
                  style={{ width: 200 }}
                  size="large"
                  onChange={(value) => {
                    setSortingOption(value);
                    setCurrentPage(1);
                  }}
                  options={sortOptions}
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
          </div>
          <div className="mobile-advanced-filter mb-3">
            <button
              onClick={() => {
                setFilterDrawerOpen(true);
              }}
              className="tf-btn primary text-dark w-100"
            >
              البحث المتقدم
            </button>
          </div>
          <div className="row">
            <div className="col-xl-4 col-lg-5 advanced-filters">
              <div className="widget-sidebar fixed-sidebar">
                <AdsFilter
                  isForMobile={false}
                  setCurrentPage={setCurrentPage}
                  keyword={{ keyword, setKeyword }}
                  minPrice={{ minPrice, setMinPrice }}
                  maxPrice={{ maxPrice, setMaxPrice }}
                  category={category}
                  adType={adType}
                  setAdType={setAdType}
                  city={{ city, setCity }}
                  brand={{ brand, setBrand }}
                  model={{ model, setModel }}
                  color={{ color, setColor }}
                  fuelType={{ fuelType, setFuelType }}
                  transmissionType={{ transmissionType, setTransmissionType }}
                  condition={{ condition, setCondition }}
                  carType={{ carType, setCarType }}
                  motorcycleType={{ motorcycleType, setMotorcycleType }}
                  coolingType={{ coolingType, setCoolingType }}
                  rooms={{ rooms, setRooms }}
                  houseType={{ houseType, setHouseType }}
                  marineType={{ marineType, setMarineType }}
                  year={{ year, setYear }}
                  minMeterSquare={{ minMeterSquare, setMinMeterSquare }}
                  maxMeterSquare={{ maxMeterSquare, setMaxMeterSquare }}
                  resetFilters={resetFilters}
                />
              </div>
            </div>
            <div className="col-xl-8 col-lg-7 flat-animate-tab">
              <div className="tab-content">
                <div
                  className="tab-pane active show"
                  id={viewMode === "grid" ? "gridLayout" : "listLayout"}
                  role="tabpanel"
                >
                  {advertisementLoading ? (
                    <div className="w-100">
                      <div className="row">
                        {Array.from({ length: itemPerPage }).map((_, i) =>
                          viewMode === "grid" ? (
                            <div key={i} className="col-md-12 col-xl-6 mb-4">
                              <SkeletonCard />
                            </div>
                          ) : (
                            <div key={i} className="col-lg-12">
                              <SkeletonCard />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : advertisements.length > 0 ? (
                    <>
                      <div className="row">
                        {advertisements.map((ad, i) =>
                          viewMode === "grid" ? (
                            <div
                              key={i}
                              className="col-sm-12 col-md-6 col-lg-12 col-xl-6"
                            >
                              <RenderAd key={ad.id} ad={ad} />
                            </div>
                          ) : (
                            <div key={i} className="col-lg-12">
                              <RenderAdLine key={ad.id} ad={ad} />
                            </div>
                          )
                        )}
                      </div>
                      <ul className="wd-navigation mt-20">
                        <Pagination
                          currentPage={currentPage}
                          setPage={setCurrentPage}
                          itemLength={pagination.total}
                          itemPerPage={itemPerPage}
                        />
                      </ul>
                    </>
                  ) : (
                    <div className="w-100 text-center">
                      <p className="fs-4">لا يوجد إعلانات لعرضها</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Drawer
          size="large"
          title="البحث المتقدم"
          onClose={() => {
            setFilterDrawerOpen(false);
          }}
          open={filterDrawerOpen}
          className="mobile-filter-drawer"
          forceRender
          destroyOnClose
        >
          <AdsFilter
            isForMobile={true}
            setCurrentPage={setCurrentPage}
            keyword={{ keyword, setKeyword }}
            minPrice={{ minPrice, setMinPrice }}
            maxPrice={{ maxPrice, setMaxPrice }}
            category={category}
            adType={adType}
            setAdType={setAdType}
            city={{ city, setCity }}
            brand={{ brand, setBrand }}
            model={{ model, setModel }}
            color={{ color, setColor }}
            fuelType={{ fuelType, setFuelType }}
            transmissionType={{ transmissionType, setTransmissionType }}
            condition={{ condition, setCondition }}
            carType={{ carType, setCarType }}
            motorcycleType={{ motorcycleType, setMotorcycleType }}
            coolingType={{ coolingType, setCoolingType }}
            rooms={{ rooms, setRooms }}
            houseType={{ houseType, setHouseType }}
            marineType={{ marineType, setMarineType }}
            year={{ year, setYear }}
            minMeterSquare={{ minMeterSquare, setMinMeterSquare }}
            maxMeterSquare={{ maxMeterSquare, setMaxMeterSquare }}
            resetFilters={resetFilters}
          />
        </Drawer>
      </section>
    </>
  );
}
