import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useSelector } from "react-redux";

const AdFormContext = createContext();

const initialState = {
  category: null,
  city: null,
  adType: null,
  price: null,
  rentalPeriod: "monthly",
  isSwap: null,

  squareMeters: "",
  houseType: null,
  roomsNumber: null,
  bathsNumber: null,
  floor: null,
  buildingAge: "",

  model: null,
  brand: null,
  condition: null,
  year: null,
  fuelType: null,
  transmissionType: null,
  horsepower: "",
  engineCapacity: "",
  engineBrand: null,
  cylinders: null,
  mileage: "",
  color: null,
  carType: null,
  seatsColor: null,
  seats: null,
  doors: null,
  marineType: null,
  length: "",
  width: "",
  maxCapacity: "",
  bodyMaterial: null,
  coolingType: null,
  motorcycleType: null,
  features: [],
  title: "",
  description: "",
  location: "",
  images: [],
  videoUrl: "",
  advertiser: null,
  errors: {},
};

const ACTIONS = {
  UPDATE_FIELD: "UPDATE_FIELD",
  SET_ERRORS: "SET_ERRORS",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_CATEGORY_FIELDS: "RESET_CATEGORY_FIELDS",
};

function formReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_FIELD:
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: null,
        },
      };

    case ACTIONS.SET_ERRORS:
      return {
        ...state,
        errors: action.errors,
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: null,
        },
      };

    case ACTIONS.RESET_CATEGORY_FIELDS:
      const relevantFields = getCategorySpecificFields(action.category);
      const resetState = { ...state, category: action.category };

      relevantFields.forEach((field) => {
        resetState[field] = initialState[field];
      });

      return resetState;

    default:
      return state;
  }
}

function getCategorySpecificFields(category) {
  const commonFields = ["features", "title", "description"];

  switch (parseInt(category)) {
    case 1:
      return [...commonFields, "squareMeters"];
    case 2:
      return [
        ...commonFields,
        "squareMeters",
        "houseType",
        "roomsNumber",
        "bathsNumber",
        "floor",
        "buildingAge",
      ];
    case 3:
      return [
        ...commonFields,
        "model",
        "brand",
        "condition",
        "year",
        "fuelType",
        "transmissionType",
        "horsepower",
        "engineCapacity",
        "cylinders",
        "mileage",
        "color",
        "carType",
        "seatsColor",
        "seats",
        "doors",
      ];
    case 4:
      return [
        ...commonFields,
        "model",
        "brand",
        "condition",
        "year",
        "fuelType",
        "horsepower",
        "color",
        "marineType",
        "length",
        "maxCapacity",
        "width",
        "engineBrand",
        "bodyMaterial",
      ];
    case 5:
      return [
        ...commonFields,
        "model",
        "brand",
        "condition",
        "year",
        "fuelType",
        "transmissionType",
        "horsepower",
        "engineCapacity",
        "cylinders",
        "mileage",
        "color",
        "motorcycleType",
        "coolingType",
      ];
    default:
      return commonFields;
  }
}

function useAdForm() {
  const context = useContext(AdFormContext);
  if (!context) {
    throw new Error("useAdForm must be used within an AdFormProvider");
  }
  return context;
}

function AdFormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [showErrors, setShowErrors] = useState(false);

  const updateField = (field, value) => {
    dispatch({ type: ACTIONS.UPDATE_FIELD, field, value });

    if (field === "category") {
      dispatch({ type: ACTIONS.RESET_CATEGORY_FIELDS, category: value });
    }
  };
  useEffect(() => {
    const noErrors = Object.values(state.errors).every((value) => !value);
    if (noErrors) {
      setShowErrors(false);
    }
  }, [state.errors]);

  const validateFirstStep = () => {
    const newErrors = {};

    if (!state.category) newErrors.category = "يرجى اختيار فئة الإعلان";
    if (!state.advertiser) newErrors.advertiser = "يرجى اختيار الجهة المعلنة";
    if (!state.city) newErrors.city = "يرجى اختيار المدينة";
    if (!state.adType) newErrors.adType = "يرجى اختيار نوع العقد";
    if (!state.price || state.price === "")
      newErrors.price = "يرجى تحديد السعر";
    if (
      isNaN(state.price) ||
      parseInt(state.price) < 1 ||
      parseInt(state.price) > 100000000
    ) {
      newErrors.price = "يرجى إدخال قيمة صحيحة للسعر";
    }
    if (state.adType === "rent" && !state.rentalPeriod) {
      newErrors.rentalPeriod = "يرجى اختيار مدة الإيجار";
    }

    if (state.adType === "sale" && state.isSwap === null) {
      newErrors.isSwap = "يرجى تحديد إمكانية المقايضة";
    }

    dispatch({ type: ACTIONS.SET_ERRORS, errors: newErrors });
    setShowErrors(true);

    return Object.keys(newErrors).length === 0;
  };

  const validateSecondStep = () => {
    const newErrors = {};

    if (state.category === 1 || state.category === 2) {
      if (!state.squareMeters || state.squareMeters === "") {
        newErrors.squareMeters = "يرجى إدخال المساحة";
      } else if (
        isNaN(state.squareMeters) ||
        parseInt(state.squareMeters) < (state.category === 1 ? 1 : 20) ||
        parseInt(state.squareMeters) > (state.category === 1 ? 10000000 : 10000)
      ) {
        newErrors.squareMeters = "يرجى إدخال قيمة صحيحة للمساحة";
      }

      if (state.category === 2) {
        if (!state.houseType) newErrors.houseType = "يرجى اختيار نوع المنزل";
        if (!state.roomsNumber) newErrors.roomsNumber = "يرجى اختيار عدد الغرف";
        if (!state.bathsNumber)
          newErrors.bathsNumber = "يرجى اختيار عدد الحمامات";
        if (state.floor === null) newErrors.floor = "يرجى اختيار الطابق";
        if (!state.buildingAge || state.buildingAge === "") {
          newErrors.buildingAge = "يرجى إدخال عمر البناء";
        } else if (
          isNaN(state.buildingAge) ||
          parseInt(state.buildingAge) < 0 ||
          parseInt(state.buildingAge) > 300
        ) {
          newErrors.buildingAge = "يرجى إدخال قيمة صحيحة لعمر البناء";
        }
      }
    }

    if (state.category === 3 || state.category === 5) {
      if (!state.transmissionType)
        newErrors.transmissionType = "يرجى اختيار نوع الغيار";

      if (!state.mileage || !state.mileage === "") {
        newErrors.mileage = "يرجى إدخال الكيلومتراج";
      }
      if (
        isNaN(state.mileage) ||
        parseInt(state.mileage) < 0 ||
        parseInt(state.mileage) > 1000000
      ) {
        newErrors.mileage = "يرجى إدخال قيمة صحيحة للكيلومتراج";
      }

      if (state.fuelType && state.fuelType !== "ELECTRIC") {
        if (
          isNaN(state.engineCapacity) ||
          parseInt(state.engineCapacity) < 1 ||
          parseInt(state.engineCapacity) > 10000
        ) {
          newErrors.engineCapacity = "يرجى إدخال قيمة صحيحة لسعة المحرك";
        }
        if (parseInt(state.cylinders) < 1 || parseInt(state.cylinders) > 24) {
          newErrors.cylinders = "يرجى إدخال قيمة صحيحة لاصطوانات المحرك";
        }
      }
    }

    if (state.category === 3 || state.category === 4 || state.category === 5) {
      if (!state.brand) newErrors.brand = "يرجى اختيار العلامة التجارية";
      if (!state.model) newErrors.model = "يرجى اختيار الموديل";
      if (!state.condition) newErrors.condition = "يرجى اختيار الحالة";
      if (!state.year) newErrors.year = "يرجى اختيار سنة التصنيع";
      if (!state.fuelType) newErrors.fuelType = "يرجى اختيار نوع الوقود";
      if (!state.color) newErrors.color = "يرجى اختيار اللون الخارجي";

      if (
        isNaN(state.horsepower) ||
        parseInt(state.horsepower) < 1 ||
        parseInt(state.horsepower) > 10000
      ) {
        newErrors.horsepower = "يرجى إدخال قيمة صحيحة للقوة الحصانية";
      }

      if (state.category === 3) {
        if (!state.carType) newErrors.carType = "يرجى اختيار نوع السيارة";
        if (!state.seatsColor) newErrors.seatsColor = "يرجى اختيار لون المقاعد";
        if (!state.seats) newErrors.seats = "يرجى اختيار عدد المقاعد";
        if (!state.doors) newErrors.doors = "يرجى اختيار عدد الأبواب";
      } else if (state.category === 4) {
        if (!state.marineType) newErrors.marineType = "يرجى اختيار نوع المركبة";
        if (!state.bodyMaterial)
          newErrors.bodyMaterial = "يرجى اختيار الهيكل الخارجي";
        if (!state.engineBrand)
          newErrors.engineBrand = "يرجى اختيار العلامة التجارية للمحرك";

        if (!state.length || !state.length === "") {
          newErrors.length = "يرجى إدخال طول المركبة";
        }
        if (!state.width || !state.width === "") {
          newErrors.width = "يرجى إدخال عرض المركبة";
        }
        if (
          state.length &&
          (isNaN(state.length) ||
            parseFloat(state.length) < 1 ||
            parseFloat(state.length) > 500)
        ) {
          newErrors.length = "يرجى إدخال قيمة صحيحة لطول المركبة";
        }
        if (
          state.width &&
          (isNaN(state.width) ||
            parseFloat(state.width) < 0.5 ||
            parseFloat(state.width) > 100)
        ) {
          newErrors.width = "يرجى إدخال قيمة صحيحة لعرض المركبة";
        }

        if (
          state.maxCapacity &&
          (isNaN(state.maxCapacity) ||
            parseInt(state.maxCapacity) < 1 ||
            parseInt(state.maxCapacity) > 10000)
        ) {
          newErrors.maxCapacity = "يرجى إدخال قيمة صحيحة لسعة الركاب";
        }
      } else if (state.category === 5) {
        if (!state.motorcycleType)
          newErrors.motorcycleType = "يرجى اختيار نوع الدراجة";
        if (!state.coolingType)
          newErrors.coolingType = "يرجى اختيار نوع التبريد";
      }
    }

    dispatch({ type: ACTIONS.SET_ERRORS, errors: newErrors });
    setShowErrors(true);

    return Object.keys(newErrors).length === 0;
  };

  const validateThirdStep = () => {
    const newErrors = {};

    if (!state.title || state.title.trim() === "") {
      newErrors.title = "يرجى إدخال عنوان";
    } else if (state.title.length > 100) {
      newErrors.title = "يجب ألا يتجاوز العنوان 100 حرف";
    } else {
      const prohibitedWords = [
        "إعلان",
        "اعلان",
        "الإعلان",
        "الاعلان",
        "إعلانات",
        "اعلانات",
        "ad",
        "ads",
        "advertisement",
        "announcement",
      ];

      let foundProhibitedWord = null;
      for (const word of prohibitedWords) {
        const regex = new RegExp(word, "i");
        const match = state.title.match(regex);

        if (match) {
          foundProhibitedWord = match[0];
          break;
        }
      }
      if (foundProhibitedWord) {
        newErrors.title = `كلمة "${foundProhibitedWord}" محظورة - يرجى تغييرها لتجنب الحظر من أدوات منع الإعلانات`;
      }
    }
    if (!state.description || state.description.trim() === "")
      newErrors.description = "يرجى إدخال وصف تفصيلي للإعلان";
    if (
      state.location &&
      state.location.trim() !== "" &&
      !state.location.includes("google.com/maps")
    )
      newErrors.location = "يرجى إدخال رابط صالح من خرائط جوجل";
    dispatch({ type: ACTIONS.SET_ERRORS, errors: newErrors });
    setShowErrors(true);

    return Object.keys(newErrors).length === 0;
  };
  const validateFourthStep = () => {
    const newErrors = {};

    if (!Array.isArray(state.images) || state.images.length < 1) {
      newErrors.images = "يرجى تحميل صورة واحدة على الأقل";
    } else if (state.images.length > 10) {
      newErrors.images = "يمكنك تحميل 10 صور كحد أقصى";
    }
    if (state.videoUrl && state.videoUrl.trim() !== "") {
      const youtubeRegex =
        /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/|m\.youtube\.com\/watch\?v=)[\w-]{11}([?&][\w-]+=[\w-]*)*\/?$/;
      if (!youtubeRegex.test(state.videoUrl.trim())) {
        newErrors.videoUrl = "يرجى إدخال رابط YouTube صالح";
      }
    }
    dispatch({ type: ACTIONS.SET_ERRORS, errors: newErrors });
    setShowErrors(true);

    return Object.keys(newErrors).length === 0;
  };
  const validateStep = (step) => {
    switch (step) {
      case 0:
        return validateFirstStep();
      case 1:
        return validateSecondStep();
      case 2:
        return validateThirdStep();
      case 3:
        return validateFourthStep();
      default:
        return true;
    }
  };

  return (
    <AdFormContext.Provider
      value={{
        state,
        updateField,
        validateStep,
        showErrors,
        setShowErrors,
      }}
    >
      {children}
    </AdFormContext.Provider>
  );
}

export {
  AdFormProvider,
  useAdForm,
  getCategorySpecificFields,
  formReducer,
  ACTIONS,
  initialState,
  AdFormContext,
};
