import React, { useEffect, useState } from "react";
import { Alert, Progress, Steps, Tooltip } from "antd";
import {
  CheckmarkCircle01Icon,
  Image02Icon,
  InformationCircleIcon,
  LicenseIcon,
  Megaphone02Icon,
  StackStarIcon,
} from "hugeicons-react";
import styled from "styled-components";
import CategoryStep from "./steps/CategoryStep";
import DetailsStep from "./steps/DetailsStep";
import GalleryStep from "./steps/GalleryStep";
import FeaturesStep from "./steps/FeaturesStep";
// import { AdFormProvider, useAdForm
import { AdFormProvider, useAdForm } from "@/context/AdFormContext";

const PublishAdSection = () => {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "بيانات العرض",
      content: <CategoryStep />,
      icon: <Megaphone02Icon size={24} />,
      description: "الفئة والعقد",
    },
    {
      title: "الميزات",
      content: <FeaturesStep />,
      icon: <StackStarIcon size={24} />,
      description: "الميزات والخصائص",
    },
    {
      title: "التفاصيل",
      content: <DetailsStep />,
      icon: <LicenseIcon size={24} />,
      description: "معلومات تفصيلية",
    },
    {
      title: "المعرض",
      content: <GalleryStep />,
      icon: <Image02Icon size={24} />,
      description: "الصور والفيديو",
    },
  ];

  return (
    <AdFormProvider>
      <PublishAdContent steps={steps} initialStep={current} />
    </AdFormProvider>
  );
};

import { Link } from "react-router-dom";
import api from "@/redux/api";
import { StyledStepContent, StyledSteps } from "./styled";
import { useSelector } from "react-redux";
import RequiredPhoneModal from "@/components/modals/RequiredPhoneModal";

function createAdvertisement(formState) {
  const {
    title,
    description,
    price,
    city,
    location,
    category,
    adType,
    isSwap,
    rentalPeriod,
    images,
    features,
    squareMeters,
    houseType,
    roomsNumber,
    bathsNumber,
    buildingAge,
    floor,
    color,
    mileage,
    year,
    brand,
    model,
    fuelType,
    cylinders,
    engineCapacity,
    horsepower,
    transmissionType,
    condition,
    carType,
    seats,
    doors,
    seatsColor,
    marineType,
    length,
    maxCapacity,
    coolingType,
    motorcycleType,
    width,
    engineBrand,
    bodyMaterial,
    advertiser,
    videoUrl,
  } = formState;

  const payload = {
    title,
    description,
    price: Number(price),
    city,
    category_id: parseInt(category),
    type: adType,
    features,
    images,
    owner_type: advertiser,
  };

  if (location && location.trim() !== "") {
    payload.location = location;
  }
  if (videoUrl && videoUrl.trim() !== "") {
    payload.video_url = videoUrl;
  }

  if (adType === "sale") {
    payload.sale_details = {
      is_swap: isSwap,
    };
  } else if (adType === "rent") {
    payload.rent_details = {
      rental_period: rentalPeriod,
    };
  }

  if (parseInt(category) === 1) {
    payload.square_meters = Number(squareMeters);
  }

  if (parseInt(category) === 2) {
    payload.house_type = houseType;
    payload.number_of_rooms = parseInt(roomsNumber);
    payload.number_of_bathrooms = parseInt(bathsNumber);
    payload.building_age = parseInt(buildingAge);
    payload.square_meters = Number(squareMeters);
    payload.floor = parseInt(floor);
  }

  if ([3, 4, 5].includes(parseInt(category))) {
    payload.color = color;
    payload.year = parseInt(year);
    payload.brand_id = parseInt(brand);
    payload.model_id = parseInt(model);
    payload.fuel_type = fuelType;
    payload.condition = condition;
    if (parseInt(horsepower)) {
      payload.horsepower = parseInt(horsepower);
    }
    if (parseInt(category) === 3) {
      payload.car_type = carType;
      payload.seats = parseInt(seats);
      payload.doors = parseInt(doors);
      payload.seats_color = seatsColor;
    }
    if (parseInt(category) === 4) {
      payload.marine_type = marineType;
      payload.length = Number(length);
      payload.width = Number(width);
      payload.engine_brand = engineBrand;
      payload.body_material = bodyMaterial;
      if (parseInt(maxCapacity)) {
        payload.max_capacity = parseInt(maxCapacity);
      }
    }

    if (parseInt(category) === 5) {
      payload.cooling_type = coolingType;
      payload.motorcycle_type = motorcycleType;
    }
    if (parseInt(category) === 3 || parseInt(category) === 5) {
      payload.transmission_type = transmissionType;
      payload.mileage = Number(mileage);
      if (fuelType !== "ELECTRIC") {
        if (parseInt(cylinders)) {
          payload.cylinders = parseInt(cylinders);
        }
        if (Number(engineCapacity)) {
          payload.engine_capacity = Number(engineCapacity);
        }
      }
    }
  }

  return payload;
}

async function submitAdvertisement(formState, onUploadProgress) {
  try {
    const payload = createAdvertisement(formState);
    const formData = new FormData();
    payload.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    Object.keys(payload).forEach((key) => {
      if (key === "images") return;

      if (key === "features" && Array.isArray(payload.features)) {
        payload.features.forEach((feature, index) => {
          formData.append(`features[${index}]`, feature);
        });
      } else if (key === "sale_details") {
        formData.append("sale_details[is_swap]", payload.sale_details.is_swap);
      } else if (key === "rent_details") {
        formData.append(
          "rent_details[rental_period]",
          payload.rent_details.rental_period
        );
      } else {
        formData.append(key, payload[key]);
      }
    });

    const response = await api.post("advertisements", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onUploadProgress,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "فشل في إنشاء الإعلان");
    } else if (error.request) {
      throw new Error(
        "لم نتمكن من الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت"
      );
    } else {
      throw new Error(error.message || "حدث خطأ أثناء إنشاء الإعلان");
    }
  }
}

const PublishAdContent = ({ steps, initialStep = 0 }) => {
  const [current, setCurrent] = useState(initialStep);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useSelector((state) => state.auth);

  const { validateStep, state, showErrors, setShowErrors } = useAdForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [adId, setAdId] = useState(null);
  const [adSlug, setAdSlug] = useState(null);
  const [showPhoneEditModal, setShowPhoneEditModal] = useState(false);
  const next = () => {
    const isValid = validateStep(current);
    if (!isValid) return;
    if (!user?.phone) {
      setShowPhoneEditModal(true);
      return;
    }
    setCurrent(current + 1);
    setShowErrors(false);
  };

  const prev = () => {
    setCurrent(current - 1);
    setShowErrors(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  const handleSubmit = async () => {
    const isValid = validateStep(current);
    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);

    try {
      const result = await submitAdvertisement(state, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });

      setSubmitSuccess(true);
      if (result.success) {
        setAdId(result.advertisement.id);
        setAdSlug(result.advertisement.slug);
      }
    } catch (error) {
      setSubmitError(
        error.message || "حدث خطأ أثناء نشر الإعلان، يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        style={{
          height: "60vh",
        }}
        className="container w-100 d-flex align-items-center justify-content-center"
      >
        <div className="text-center">
          <div className="mb-4">
            <CheckmarkCircle01Icon size={96} color="#4CAF50" />
          </div>
          <h2 className="fw-8 mb-2">تم نشر إعلانك بنجاح!</h2>
          <p className="fs-18 text-variant-1 mb-4">
            سيتم مراجعة إعلانك من قبل فريقنا وسيظهر قريباً في الموقع
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link
              to="/dashboard/my-advertisements"
              className="tf-btn primary text-dark"
              style={{ borderRadius: "0.6rem" }}
            >
              عرض إعلاناتي
            </Link>
            {adId && adSlug && (
              <Link
                to={`/dashboard/my-advertisements/${adId}/${adSlug}`}
                className="tf-btn text-dark"
                style={{ borderRadius: "0.6rem" }}
              >
                عرض الإعلان
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      style={{
        minHeight: "90vh",
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
      className="flat-section flat-recommended flat-sidebar"
    >
      <div className="container">
        <div className="box-title-listing">
          <div className="box-left d-flex flex-column align-items-start gap-2">
            <h2 className="fw-8">نشر إعلان</h2>
            <p className="fs-18 text-variant-1">
              انت على بعد خطوات قليلة من نشر إعلانك
            </p>
          </div>
          <Tooltip title="إدخال بيانات صحيحة يزيد من فرصة ظهور إعلانك ويُسهل الموافقة عليه">
            <InformationCircleIcon />
          </Tooltip>
        </div>

        <StyledSteps className="custom-steps" current={current} items={steps} />

        <StyledStepContent>{steps[current].content}</StyledStepContent>

        {showErrors && Object.keys(state.errors).length > 0 && (
          <Alert
            type="error"
            showIcon
            message="يرجى إكمال جميع الحقول المطلوبة قبل المتابعة"
            className="mt-2"
          />
        )}

        {submitError && (
          <Alert
            closeIcon
            type="error"
            showIcon
            message={submitError}
            className="mt-2"
          />
        )}

        {isSubmitting && (
          <div className="mt-3 mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span>
                {uploadProgress < 25 && "جاري تجهيز البيانات..."}
                {uploadProgress >= 25 &&
                  uploadProgress < 50 &&
                  "جاري رفع الصور..."}
                {uploadProgress >= 50 &&
                  uploadProgress < 75 &&
                  "جاري معالجة البيانات..."}
                {uploadProgress >= 75 &&
                  uploadProgress < 100 &&
                  "جاري إنشاء الإعلان..."}
              </span>
            </div>
            <Progress
              percent={uploadProgress}
              percentPosition={{ align: "end", type: "inner" }}
              size={["100%", 15]}
              strokeColor="#ffe800"
              style={{ color: "#1e1e1e" }}
            />
          </div>
        )}

        <div className="d-flex flex-row-reverse justify-content-between gap-2 align-items-center">
          {current < steps.length - 1 && (
            <button
              style={{ borderRadius: "0.6rem" }}
              className="tf-btn mt-2 primary text-dark"
              onClick={next}
            >
              التالي
            </button>
          )}

          {current === steps.length - 1 && (
            <button
              style={{ borderRadius: "0.6rem" }}
              className="tf-btn mt-2 primary text-dark"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              نشر الإعلان
            </button>
          )}

          {current > 0 && (
            <button
              style={{ borderRadius: "0.6rem" }}
              className="tf-btn mt-2 text-dark"
              onClick={prev}
            >
              تراجع
            </button>
          )}
        </div>
      </div>
      {!user?.phone && (
        <RequiredPhoneModal
          open={showPhoneEditModal}
          close={setShowPhoneEditModal}
        />
      )}
    </section>
  );
};

export default PublishAdSection;
