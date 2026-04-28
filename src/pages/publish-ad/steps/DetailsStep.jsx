import React, { useState, useEffect } from "react";
import { StyledInput, StyledTextArea } from "../styled";
import { Tooltip, Button } from "antd";
import {
  AiMagicIcon,
  AlertDiamondIcon,
  MapsLocation01Icon,
} from "hugeicons-react";
import { generateAdDescription } from "@/utlis/generateDescription";
import OvalLoader from "@/components/OvalLoader";
import toastNotify from "@/utils/toast";
import { useAdForm } from "../../../context/AdFormContext";
import { MapSelector } from "@/components/MapSelector";

const DetailsStep = () => {
  const { state, updateField, showErrors } = useAdForm();
  const { title, description, location, errors } = state;

  const [mapVisible, setMapVisible] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (location) {
      try {
        const locationUrl = new URL(location);
        const params = locationUrl.searchParams.get("q");
        if (params) {
          setLocationText(`تم تحديد الموقع على الخريطة بنجاح`);

          const coordinates = params.split(",");
          if (coordinates.length === 2) {
            const lat = parseFloat(coordinates[0]);
            const lng = parseFloat(coordinates[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
              setSelectedMapLocation({ lat, lng });
            }
          }
        } else {
          setLocationText("تم تحديد الموقع");
        }
      } catch (e) {
        setLocationText(location);
      }
    } else {
      setLocationText("");
      setSelectedMapLocation(null);
    }
  }, [location]);

  const handleShowMap = () => {
    setIsLoadingLocation(true);
    setMapVisible(true);
    setTimeout(() => {
      setIsLoadingLocation(false);
    }, 500);
  };

  const handleLocationSelect = (position) => {
    setIsLoadingLocation(true);
    const { lat, lng } = position;
    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    updateField("location", googleMapsLink);
    setSelectedMapLocation(position);
    setIsLoadingLocation(false);
  };

  const handleAiGenerate = async () => {
    if (!title) {
      toastNotify("يرجى إدخال العنوان أولاً", "info");
      document.getElementById("title").focus();
      return;
    }
    if (!description) {
      toastNotify("يرجى إدخال الوصف أولاً", "info");
      document.getElementById("description").focus();
      return;
    }
    if (description.length < 50) {
      toastNotify("قم بتزويدنا بمعلومات اكثر كي نستطيع مساعدك", "info");
      document.getElementById("description").focus();
      return;
    }
    updateField("description", "");
    setGenerating(true);
    const aiText = await generateAdDescription({
      description,
      title,
    });
    updateField("description", aiText);
    setGenerating(false);
  };

  return (
    <div className="box w-100 d-flex flex-column gap-2">
      <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
        <label className="fs-6 mb-0 fw-normal">عنوان الإعلان</label>
        <small className="mb-2 text-variant-1">
          اكتب عنوانًا جذابًا ومختصرًا، فهو أول ما يراه الزوار
        </small>
        <StyledInput
          value={title}
          onChange={(e) => {
            updateField("title", e.target.value);
          }}
          maxLength={100}
          showCount
          placeholder="ادخل عنوان الإعلان"
          id="title"
          status={showErrors && errors?.title ? "error" : ""}
        />
        {showErrors && errors?.title && (
          <div className="error-message text-danger mt-1">{errors.title}</div>
        )}
      </fieldset>

      <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
        <label className="fs-6 mb-0 fw-normal">معلومات تفصيلية</label>
        <small className="mb-2 text-variant-1">
          استخدم هذا الحقل لإضافة ملاحظات أو بيانات غير موجودة ضمن الخيارات
        </small>
        <StyledTextArea
          maxLength={300}
          showCount
          rows={4}
          value={description}
          onChange={(e) => {
            updateField("description", e.target.value);
          }}
          placeholder={
            generating
              ? "يتم الان توليد الوصف من قبل الذكاء الاصطناعي.."
              : "ادخل تفاصيل الإعلان"
          }
          name="description"
          status={showErrors && errors?.description ? "error" : ""}
        />
        {showErrors && errors?.description && (
          <div className="error-message text-danger mt-1">
            {errors.description}
          </div>
        )}
        <div className="d-flex align-items-center justify-content-end gap-2 w-100">
          <Tooltip title="الذكاء الاصطناعي قد يخطئ أحيانًا">
            <AlertDiamondIcon
              className="text-variant-2"
              style={{ marginTop: "0.6rem" }}
            />
          </Tooltip>
          <button
            type="default"
            onClick={handleAiGenerate}
            className="tf-btn primary text-dark mt-2 gradient-btn-ai"
          >
            {generating ? (
              <OvalLoader />
            ) : (
              <>
                <AiMagicIcon size={23} style={{ marginBottom: "0.3rem" }} />
                تحسين بالـ AI
              </>
            )}
          </button>
        </div>
      </fieldset>

      <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
        <label className="fs-6 fw-normal mb-0">
          الموقع الجغرافي{" "}
          <small className="fs-13 text-variant-1 fw-normal">(اختياري)</small>
        </label>

        <div className="d-flex flex-column w-100">
          {locationText ? (
            <div className="d-flex gap-2 justify-content-between align-items-center w-100">
              <div className="text-success">
                <span>{locationText}</span>
              </div>
              <Button
                type="text"
                danger
                size="large"
                onClick={() => updateField("location", "")}
              >
                إلغاء تحديد الموقع
              </Button>
            </div>
          ) : null}

          <Button
            type="primary"
            size="large"
            className="text-dark mt-2"
            disabled={isLoadingLocation}
            icon={
              isLoadingLocation ? null : (
                <MapsLocation01Icon
                  size={20}
                  style={{
                    marginTop: "0.4rem",
                  }}
                />
              )
            }
            onClick={handleShowMap}
          >
            {isLoadingLocation ? (
              <OvalLoader />
            ) : locationText ? (
              "عرض الموقع على الخريطة"
            ) : (
              "حدد الموقع على الخريطة"
            )}
          </Button>
        </div>

        {showErrors && errors?.location && (
          <div className="error-message text-danger mt-1">
            {errors.location}
          </div>
        )}
      </fieldset>

      <MapSelector
        visible={mapVisible}
        onCancel={() => setMapVisible(false)}
        onLocationSelect={handleLocationSelect}
        defaultLocation={selectedMapLocation}
      />
    </div>
  );
};

export default DetailsStep;
