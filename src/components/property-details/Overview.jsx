import React from "react";
import { GiGearStickPattern } from "react-icons/gi";

import {
  SquareArrowDiagonal01Icon,
  Time04Icon,
  GuestHouseIcon,
  FloorPlanIcon,
  BedSingle01Icon,
  Bathtub02Icon,
  ContractsIcon,
  Exchange01Icon,
  Calendar03Icon,
  Car01Icon,
  MenuSquareIcon,
  PaintBrush02Icon,
  Cylinder01Icon,
  Fuel01Icon,
  DashboardSpeed01Icon,
  CarouselHorizontal02Icon,
  Door01Icon,
  AirplaneSeatIcon,
  ColorsIcon,
  StarsIcon,
  Settings03Icon,
  ZapIcon,
  ToolsIcon,
  FerryBoatIcon,
  SquareArrowHorizontalIcon,
  UserMultipleIcon,
  Motorbike02Icon,
  DropletIcon,
  SquareArrowVerticalIcon,
  Megaphone02Icon,
  NanoTechnologyIcon,
  Agreement02Icon,
  Asteroid01Icon,
  BoatIcon,
} from "hugeicons-react";

import {
  transmissionTypes,
  fuelTypes,
  conditionTypes,
  colors,
  coolingTypes,
  motorcycleTypes,
  marineTypes,
  RentalPeriod_v2,
  houseTypes,
  carTypes,
  marineEngineBrands,
  marineBodyMaterials,
  ownerTypes,
} from "@/data/General";
const sharedProperties = {
  type: {
    label: "العقد",
    Icon: ContractsIcon,
    getValue: (ad) => {
      if (ad?.type === "rent") return "إيجار";
      if (ad?.type === "sale") return "بيع";
      return ad?.type || "غير محدد";
    },
  },
  rental_period: {
    label: "مدة العقد",
    Icon: Calendar03Icon,
    condition: (ad) =>
      ad?.type === "rent" &&
      ad?.rentDetail_details?.rental_period !== undefined,
    getValue: (ad) => {
      const period = RentalPeriod_v2.find(
        (r) => r.value === ad?.rentDetail_details?.rental_period
      );
      return period ? period.label : ad?.rentDetail_details?.rental_period;
    },
  },
  swap: {
    label: "مقايضة",
    Icon: Exchange01Icon,
    condition: (ad) =>
      ad?.type === "sale" && ad?.saleDetail_details?.is_swap !== undefined,
    getValue: (ad) => (ad?.saleDetail_details?.is_swap === 1 ? "نعم" : "لا"),
  },
  owner_type: {
    label: "الجهة المعلنة",
    Icon: Agreement02Icon,
    getValue: (ad) => {
      const owner = ownerTypes.find((r) => r.value === ad?.owner_type);
      return owner ? owner.label : ad?.owner_type;
    },
  },
};

const categoryConfigs = {
  1: {
    detailsKey: "landAdvertisement_details",
    properties: [
      {
        key: "square_meters",
        label: "المساحة",
        Icon: SquareArrowDiagonal01Icon,
        format: (value) => `${parseInt(value)} م²`,
      },
    ],
  },
  2: {
    detailsKey: "houseAdvertisement_details",
    properties: [
      {
        key: "building_age",
        label: "عمر المبنى",
        Icon: Time04Icon,
        format: (value) => `${value} سنة`,
      },
      {
        key: "house_type",
        label: "نوع المنزل",
        Icon: GuestHouseIcon,
        format: (value) => {
          const type = houseTypes.find((c) => c.value === value);
          return type ? type.label : value;
        },
      },
      {
        key: "floor",
        label: "الطابق",
        Icon: FloorPlanIcon,
      },
      {
        key: "square_meters",
        label: "المساحة",
        Icon: SquareArrowDiagonal01Icon,
        format: (value) => `${parseInt(value)} م²`,
      },
      {
        key: "number_of_rooms",
        label: "عدد الغرف",
        Icon: BedSingle01Icon,
      },
      {
        key: "number_of_bathrooms",
        label: "عدد الحمامات",
        Icon: Bathtub02Icon,
      },
    ],
  },
  3: {
    detailsKeys: [
      "vehicleAdvertisement_details",
      "carAdvertisement_details",
      "landVehicleAttributes_details",
    ],
    properties: [
      {
        key: "brand.name",
        label: "الماركة",
        Icon: Car01Icon,
        detailsKeyIndex: 0,
      },

      {
        key: "model.name",
        label: "الموديل",
        Icon: MenuSquareIcon,
        detailsKeyIndex: 0,
      },
      {
        key: "year",
        label: "سنة التصنيع",
        Icon: ToolsIcon,
        detailsKeyIndex: 0,
      },
      {
        key: "color",
        label: "اللون",
        Icon: PaintBrush02Icon,
        detailsKeyIndex: 0,
        format: (value) => {
          const color = colors.find((c) => c.value === value);
          return color ? color.label : value;
        },
      },
      {
        key: "condition",
        label: "الحالة",
        Icon: StarsIcon,
        detailsKeyIndex: 0,
        format: (value) => {
          const condition = conditionTypes.find((c) => c.value === value);
          return condition ? condition.label : value;
        },
      },
      {
        key: "transmission_type",
        label: "نوع الغيار",
        Icon: GiGearStickPattern,
        detailsKeyIndex: 2,
        format: (value) => {
          const type = transmissionTypes.find((t) => t.value === value);
          return type ? type.label : value;
        },
      },
      {
        key: "cylinders",
        label: "الأسطوانات",
        Icon: Cylinder01Icon,
        detailsKeyIndex: 2,
        format: (value) => `V${value}`,
      },

      {
        key: "engine_capacity",
        label: "سعة المحرك",
        Icon: Settings03Icon,
        detailsKeyIndex: 2,
        format: (value) => `${parseInt(value)}${"CC"}`,
      },
      {
        key: "fuel_type",
        label: "نوع الوقود",
        Icon: Fuel01Icon,
        detailsKeyIndex: 0,
        format: (value) => {
          const fuel = fuelTypes.find((f) => f.value === value);
          return fuel ? fuel.label : value;
        },
      },
      {
        key: "horsepower",
        label: "قوة المحرك",
        Icon: ZapIcon,
        detailsKeyIndex: 0,
        format: (value) => `${value} حصان`,
      },
      {
        key: "mileage",
        label: "الكيلومتراج",
        Icon: DashboardSpeed01Icon,
        detailsKeyIndex: 2,
        format: (value) => `${value} كم`,
      },

      {
        key: "car_type",
        label: "نوع السيارة",
        Icon: CarouselHorizontal02Icon,
        detailsKeyIndex: 1,
        format: (value) => {
          const type = carTypes.find(
            (c) => c.value.toLowerCase() === value.toLowerCase()
          );
          return type ? type.label : value;
        },
      },

      {
        key: "doors",
        label: "الأبواب",
        Icon: Door01Icon,
        detailsKeyIndex: 1,
      },
      {
        key: "seats",
        label: "المقاعد",
        Icon: AirplaneSeatIcon,
        detailsKeyIndex: 1,
      },
      {
        key: "seats_color",
        label: "لون المقاعد",
        Icon: ColorsIcon,
        detailsKeyIndex: 1,
        format: (value) => {
          const color = colors.find((c) => c.value === value);
          return color ? color.label : value;
        },
      },
    ],
  },
  4: {
    detailsKeys: [
      "vehicleAdvertisement_details",
      "marineAdvertisement_details",
    ],
    properties: [
      {
        key: "brand.name",
        label: "الماركة",
        Icon: FerryBoatIcon,
        detailsKeyIndex: 0,
      },
      {
        key: "model.name",
        label: "الموديل",
        Icon: MenuSquareIcon,
        detailsKeyIndex: 0,
      },
      {
        key: "year",
        label: "سنة التصنيع",
        Icon: ToolsIcon,
        detailsKeyIndex: 0,
      },
      {
        key: "color",
        label: "اللون",
        Icon: PaintBrush02Icon,
        detailsKeyIndex: 0,
        format: (value) => {
          const color = colors.find((c) => c.value === value);
          return color ? color.label : value;
        },
      },
      {
        key: "condition",
        label: "الحالة",
        Icon: StarsIcon,
        detailsKeyIndex: 0,
        format: (value) => {
          const condition = conditionTypes.find((c) => c.value === value);
          return condition ? condition.label : value;
        },
      },

      {
        key: "fuel_type",
        label: "نوع الوقود",
        Icon: Fuel01Icon,
        detailsKeyIndex: 0,
        format: (value) => {
          const fuel = fuelTypes.find((f) => f.value === value);
          return fuel ? fuel.label : value;
        },
      },
      {
        key: "horsepower",
        label: "قوة المحرك",
        Icon: ZapIcon,
        detailsKeyIndex: 0,
        format: (value) => `${value} حصان`,
      },
      {
        key: "length",
        label: "الطول",
        Icon: SquareArrowVerticalIcon,
        detailsKeyIndex: 1,
        format: (value) => `${value} م`,
      },
      {
        key: "width",
        label: "العرض",
        Icon: SquareArrowHorizontalIcon,
        detailsKeyIndex: 1,
        format: (value) => `${value} م`,
      },

      {
        key: "marine_type",
        label: "نوع المركبة البحرية",
        Icon: BoatIcon,
        detailsKeyIndex: 1,
        format: (value) => {
          const type = marineTypes.find((t) => t.value === value);
          return type ? type.label : value;
        },
      },
      {
        key: "engine_brand",
        label: "ماركة المحرك",
        Icon: NanoTechnologyIcon,
        detailsKeyIndex: 1,
        format: (value) => {
          const type = marineEngineBrands.find((t) => t.value === value);
          return type ? type.label : value;
        },
      },
      {
        key: "body_material",
        label: "نوع الجسم",
        Icon: Asteroid01Icon,
        detailsKeyIndex: 1,
        format: (value) => {
          const type = marineBodyMaterials.find((t) => t.value === value);
          return type ? type.label : value;
        },
      },
      {
        key: "max_capacity",
        label: "السعة القصوى",
        Icon: UserMultipleIcon,
        detailsKeyIndex: 1,
        format: (value) => `${value} شخص`,
      },
    ],
  },
  5: {
    detailsKeys: [
      "vehicleAdvertisement_details",
      "motorcycleAdvertisement_details",
      "landVehicleAttributes_details",
    ],
    properties: [
      {
        key: "brand.name",
        label: "الماركة",
        Icon: Motorbike02Icon,
        detailsKeyIndex: 0,
      },
      {
        key: "model.name",
        label: "الموديل",
        Icon: MenuSquareIcon,
        detailsKeyIndex: 0,
      },
      {
        key: "year",
        label: "سنة التصنيع",
        Icon: ToolsIcon,
        detailsKeyIndex: 0,
      },
      {
        key: "color",
        label: "اللون",
        Icon: PaintBrush02Icon,
        detailsKeyIndex: 0,
        format: (value) => {
          const color = colors.find((c) => c.value === value);
          return color ? color.label : value;
        },
      },
      {
        key: "condition",
        label: "الحالة",
        Icon: StarsIcon,
        detailsKeyIndex: 0,
        format: (value) => {
          const condition = conditionTypes.find((c) => c.value === value);
          return condition ? condition.label : value;
        },
      },
      {
        key: "transmission_type",
        label: "نوع الغيار",
        Icon: GiGearStickPattern,
        detailsKeyIndex: 2,
        format: (value) => {
          const type = transmissionTypes.find((t) => t.value === value);
          return type ? type.label : value;
        },
      },
      {
        key: "cylinders",
        label: "الأسطوانات",
        Icon: Cylinder01Icon,
        detailsKeyIndex: 2,
        format: (value) => `V${value}`,
      },
      {
        key: "engine_capacity",
        label: "سعة المحرك",
        Icon: Settings03Icon,
        detailsKeyIndex: 2,
        format: (value) => `${parseInt(value)}${"CC"}`,
      },
      {
        key: "fuel_type",
        label: "نوع الوقود",
        Icon: Fuel01Icon,
        detailsKeyIndex: 0,
        format: (value) => {
          const fuel = fuelTypes.find((f) => f.value === value);
          return fuel ? fuel.label : value;
        },
      },
      {
        key: "horsepower",
        label: "قوة المحرك",
        Icon: ZapIcon,
        detailsKeyIndex: 0,
        format: (value) => `${value} حصان`,
      },
      {
        key: "mileage",
        label: "الكيلومتراج",
        Icon: DashboardSpeed01Icon,
        detailsKeyIndex: 2,
        format: (value) => `${value} كم`,
      },

      {
        key: "cooling_type",
        label: "توع التبريد",
        Icon: DropletIcon,
        detailsKeyIndex: 1,
        format: (value) => {
          const cooling = coolingTypes.find((c) => c.value === value);
          return cooling ? cooling.label : value;
        },
      },
      {
        key: "motorcycle_type",
        label: "نوع الدراجة",
        Icon: CarouselHorizontal02Icon,
        detailsKeyIndex: 1,
        format: (value) => {
          const motorcycle = motorcycleTypes.find((m) => m.value === value);
          return motorcycle ? motorcycle.label : value;
        },
      },
    ],
  },
};

export default function Overview({ ad }) {
  const categoryId = ad?.category?.id;
  const config = categoryConfigs[categoryId];

  const categoryTitles = {
    1: "خصائص الأرض",
    2: "خصائص المنزل",
    3: "خصائص السيارة",
    4: "خصائص المركبة",
    5: "خصائص الدراجة",
  };
  const sectionTitle = categoryTitles[categoryId] || "الخصائص";
  const renderSharedProperties = () => {
    return Object.entries(sharedProperties).map(
      ([key, { label, Icon, getValue, condition }]) => {
        if (condition && !condition(ad)) return null;
        const value = getValue(ad);
        if (value === undefined || value === null) return null;

        return (
          <li
            key={key}
            className="item col-xl-3 col-md-4 col-sm-6 col-xs-6 d-flex align-items-center gap-3"
          >
            <a className="box-icon border rounded-3 w-52">
              <Icon />
            </a>
            <div className="d-flex flex-column">
              <span className="label text-variant-1">{label}</span>
              <span className="fw-bold fs-16">{value}</span>
            </div>
          </li>
        );
      }
    );
  };

  const renderCategoryProperties = () => {
    if (!config) return null;

    const detailsArray = Array.isArray(config.detailsKeys)
      ? config.detailsKeys.map((key) => ad?.[key] || {})
      : [ad?.[config.detailsKey] || {}];

    return config.properties.map(
      ({ key, label, Icon, format, detailsKeyIndex = 0 }) => {
        const details = detailsArray[detailsKeyIndex];
        const value = key.includes(".")
          ? key.split(".").reduce((obj, k) => obj?.[k], details)
          : details[key];

        if (value === undefined || value === null) return null;
        const displayValue = format ? format(value) : value;

        return (
          <li
            key={key}
            className="item col-xl-3 col-md-4 col-sm-6 col-xs-6 d-flex align-items-center gap-3"
          >
            <a className="box-icon border rounded-3 p-2 w-52">
              <Icon />
            </a>
            <div className="d-flex flex-column">
              <span className="label text-variant-1">{label}</span>
              <span className="fw-bold fs-16">{displayValue}</span>
            </div>
          </li>
        );
      }
    );
  };

  return (
    <>
      <h5 className="title fw-6">{sectionTitle}</h5>
      <ul className=" row g-4 ">
        {renderSharedProperties()}
        {renderCategoryProperties()}
      </ul>
    </>
  );
}
