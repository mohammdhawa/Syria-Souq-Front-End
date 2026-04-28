import {
  AvalancheIcon,
  Car01Icon,
  CargoShipIcon,
  House01Icon,
  Motorbike02Icon,
} from "hugeicons-react";

const itemsPerPage = [
  {
    label: "10",
    value: 10,
  },
  {
    label: "20",
    value: 20,
  },
  {
    label: "50",
    value: 50,
  },
];

const sortOptions = [
  {
    label: "الأحدث",
    value: "activated_at_desc",
  },
  {
    label: "الأقدم",
    value: "activated_at_asc",
  },
  {
    label: "الأقل سعرًا",
    value: "price_asc",
  },
  {
    label: "الأعلى سعرًا",
    value: "price_desc",
  },
];

const sortDirectionOptions = [
  {
    label: "تصاعدياٌ",
    value: "asc",
  },
  {
    label: "تنازلياً",
    value: "desc",
  },
];
const SyriaCities = [
  { value: "DAMASCUS", label: "دمشق", image: "/images/location/loc5.png" },
  { value: "ALEPPO", label: "حلب", image: "/images/location/loc2.png" },
  { value: "HOMS", label: "حمص", image: "/images/location/loc8.png" },
  { value: "HAMA", label: "حماة", image: "/images/location/loc3.png" },
  { value: "LATAKIA", label: "اللاذقية", image: "/images/location/loc1.png" },
  { value: "TARTUS", label: "طرطوس", image: "/images/location/loc4.png" },
  { value: "RAQQA", label: "الرقة", image: "/images/location/loc7.jpg" },
  {
    value: "DEIR_EZZOR",
    label: "دير الزور",
    image: "/images/location/loc6.png",
  },
  { value: "HASAKAH", label: "الحسكة", image: "/images/location/loc14.jpg" },
  {
    value: "DAMASCUS_COUNTRYSIDE",
    label: "ريف دمشق",
    image: "/images/location/loc9.png",
  },
  { value: "DARA", label: "درعا", image: "/images/location/loc10.jpg" },
  { value: "SUWAYDA", label: "السويداء", image: "/images/location/loc11.jpg" },
  { value: "IDLIB", label: "إدلب", image: "/images/location/loc12.jpg" },
  { value: "QUNEITRA", label: "القنيطرة", image: "/images/location/loc13.jpg" },
];

const Currencies = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "TRY",
    label: "₺",
  },
  {
    value: "SYP",
    label: "ل.س",
  },
];

const Categories = [
  {
    value: 1,
    label: "أراضي",
    englishLabel: "lands",
    icon: AvalancheIcon,
  },
  {
    value: 2,
    label: "منازل",
    englishLabel: "houses",

    icon: House01Icon,
  },
  {
    value: 3,
    label: "سيارات",
    englishLabel: "cars",

    icon: Car01Icon,
  },
  {
    value: 4,
    label: "مركبات بحرية",
    englishLabel: "marines",

    icon: CargoShipIcon,
  },
  {
    value: 5,
    label: "دراجات نارية",
    englishLabel: "motorcycles",

    icon: Motorbike02Icon,
  },
];

const Categories_v2 = [
  {
    value: 1,
    label: "أرض",
    englishLabel: "lands",
    icon: AvalancheIcon,
  },
  {
    value: 2,
    label: "منزل",
    englishLabel: "houses",

    icon: House01Icon,
  },
  {
    value: 3,
    label: "سيارة",
    englishLabel: "cars",

    icon: Car01Icon,
  },
  {
    value: 4,
    label: "مركبة بحرية",
    englishLabel: "marines",

    icon: CargoShipIcon,
  },
  {
    value: 5,
    label: "دراجة نارية",
    englishLabel: "motorcycles",

    icon: Motorbike02Icon,
  },
];

const RentalPeriod = [
  {
    value: "daily",
    label: "يومياً",
  },
  {
    value: "weekly",
    label: "أسبوعياً",
  },
  {
    value: "monthly",
    label: "شهرياً",
  },
  {
    value: "yearly",
    label: "سنوياً",
  },
];

const RentalPeriod_v2 = [
  {
    value: "daily",
    label: "يوم",
  },
  {
    value: "weekly",
    label: "أسبوع",
  },
  {
    value: "monthly",
    label: "شهر",
  },
  {
    value: "yearly",
    label: "سنة",
  },
];

const transmissionTypes = [
  { value: "MANUAL", label: "يدوي" },
  { value: "AUTOMATIC", label: "أوتوماتيكي" },
  { value: "SEMI_AUTOMATIC", label: "نصف أوتوماتيكي" },
];

const fuelTypes = [
  { value: "PETROL", label: "بنزين" },
  { value: "DIESEL", label: "ديزل" },
  { value: "ELECTRIC", label: "كهربائي" },
  { value: "HYBRID", label: "هجين" },
  { value: "LPG", label: "غاز" },
];

const conditionTypes = [
  { value: "NEW", label: "جديد" },
  { value: "USED", label: "مستعمل" },
];
const colors = [
  { value: "RED", label: "أحمر" },
  { value: "BLUE", label: "أزرق" },
  { value: "GREEN", label: "أخضر" },
  { value: "BLACK", label: "أسود" },
  { value: "WHITE", label: "أبيض" },
  { value: "SILVER", label: "فضي" },
  { value: "GRAY", label: "رمادي" },
  { value: "YELLOW", label: "أصفر" },
  { value: "ORANGE", label: "برتقالي" },
  { value: "BROWN", label: "بني" },
  { value: "PURPLE", label: "بنفسجي" },
  { value: "PINK", label: "وردي" },
  { value: "CYAN", label: "سماوي" },
  { value: "MAGENTA", label: "ماجنتا" },
  { value: "TURQUOISE", label: "تركوازي" },
  { value: "LIME", label: "ليموني" },
  { value: "VIOLET", label: "أرجواني" },
  { value: "INDIGO", label: "نيلي" },
  { value: "BEIGE", label: "بيج" },
  { value: "TEAL", label: "أزرق مخضر" },
  { value: "IVORY", label: "عاجي" },
  { value: "TAN", label: "تان" },
  { value: "MAROON", label: "قرمزي" },
  { value: "PEACH", label: "خوخي" },
  { value: "MUSTARD", label: "خردلي" },
  { value: "LAVENDER", label: "لافندر" },
  { value: "GOLD", label: "ذهبي" },
  { value: "BRONZE", label: "برونزي" },
];

const coolingTypes = [
  { value: "AIR_COOLED", label: "تبريد هواء" },
  { value: "LIQUID_COOLED", label: "تبريد سائل" },
  { value: "OIL_COOLED", label: "تبريد زيت" },
  { value: "HYBRID_COOLING", label: "تبريد هجين" },
];

const motorcycleTypes = [
  { value: "CHOPPER_CRUISER", label: "شوبر / كروزر" },
  { value: "COMMUTER", label: "دراجة للتنقل" },
  { value: "CROSS_MOTOCROSS", label: "دراجة كروس / موتوكروس" },
  { value: "CUP", label: "كوب" },
  { value: "QUAD_BIKE", label: "دراجة رباعية العجلات" },
  { value: "E_PICKUP", label: "بيك أب كهربائي" },
  { value: "ENDURO_OFFROAD", label: "دراجة إندورو / طرق وعرة" },
  { value: "SNOWMOBILE", label: "دراجة ثلجية" },
  { value: "MOPED", label: "دراجة نارية صغيرة" },
  { value: "NAKED_ROADSTAR", label: "دراجة نيكيد / رودستار" },
  { value: "SCOOTER_MAXI_SCOOTER", label: "سكوتر / سكوتر ماكسي" },
  { value: "SPORT_TOURING", label: "سبورت تورينغ" },
  { value: "SUPER_SPORT", label: "سوبر سبورت" },
  { value: "TOURING", label: "تورينغ" },
  { value: "TRIAL", label: "ترايل" },
  { value: "TRIPORTER", label: "ترايبورتر" },
  { value: "THREE_WHEELER", label: "دراجة ثلاثية العجلات" },
];

const marineTypes = [
  { value: "MOTOR_YACHT", label: "يخت بمحرك" },
  { value: "SAILBOAT", label: "قارب شراعي" },
  { value: "CATAMARAN", label: "كاتاماران" },
  { value: "SPEEDBOAT", label: "قارب سريع" },
  { value: "BOAT", label: "قارب" },
  { value: "JET_SKI", label: "جت سكي" },
  { value: "DECK_BOAT", label: "قارب سطح" },
  { value: "ROWBOAT", label: "قارب تجديف" },
  { value: "CRUISE_BOAT", label: "قارب سياحي" },
  { value: "GULET", label: "غوليت" },
  { value: "FISHING_BOAT", label: "قارب صيد" },
  { value: "PASSENGER_SHIP", label: "سفينة ركاب" },
  { value: "CARGO_SHIP_TANKER", label: "سفينة شحن / ناقلة" },
  { value: "SERVICE_BOAT", label: "قارب خدمة" },
  { value: "SUBMARINE", label: "غواصة" },
];

const carTypes = [
  { value: "SEDAN", label: "سيدان" },
  { value: "COUPE", label: "كوبيه" },
  { value: "HATCHBACK", label: "هاتشباك" },
  { value: "SPORT_CAR", label: "سيارة رياضية" },
  { value: "BOX_TRUCK", label: "شاحنة صندوقية" },
  { value: "FLATBED_TRUCK", label: "شاحنة مسطحة" },
  { value: "VAN_CAR", label: "فان" },
  { value: "TANK_TRUCK", label: "شاحنة صهريج" },
  { value: "PICKUP", label: "بيك أب" },
];

const houseTypes = [
  { value: "APARTMENT", label: "شقة" },
  { value: "FAMILY_HOUSE", label: "منزل عائلي" },
  { value: "VILLA", label: "فيلا" },
  { value: "FARMHOUSE", label: "مزرعة" },
];
const marineBodyMaterials = [
  { label: "خشب", value: "WOOD" },
  { label: "ألمنيوم", value: "ALUMINUM" },
  { label: "صاج فولاذي", value: "STEEL_SHEET" },
  { label: "فايبرجلاس", value: "FIBERGLASS" },
  { label: "ألياف الكربون", value: "CARBON_FIBER" },
  { label: "مركب صناعي", value: "COMPOSITE" },
  { label: "جلد", value: "LEATHER" },
];

const adsStatusTypes = [
  {
    label: "مقبول",
    value: "accepted",
  },
  {
    label: "قيد المراجعة",
    value: "pending",
  },
  {
    label: "مرفوض",
    value: "rejected",
  },
];

const adsAvtiveTypes = [
  {
    label: "نشط",
    value: "active",
  },
  {
    label: "غير نشط",
    value: "inactive",
  },
];

const yearOptions = (() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990;
  const result = [];

  for (let year = currentYear; year >= startYear; year--) {
    result.push({ value: year, label: year.toString() });
  }

  return result;
})();

const adTypes = [
  {
    value: "rent",
    label: "إيجار",
  },

  {
    value: "sale",
    label: "بيع",
  },
];

const swapOptions = [
  {
    value: 0,
    label: "لا",
  },
  {
    value: 1,
    label: "نعم",
  },
];

const seatsCount = Array.from({ length: 20 - 1 }, (_, index) => ({
  label: (index + 2).toString(),
  value: index + 2,
}));
const doorsCount = [
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  { label: "4", value: 4 },
  {
    label: "5",
    value: 5,
  },
];

const roomsNumbers = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  { label: "4", value: 4 },
  {
    label: "5",
    value: 5,
  },
  {
    label: "6",
    value: 6,
  },
  {
    label: "7",
    value: 7,
  },
  {
    label: "8",
    value: 8,
  },
  {
    label: "9",
    value: 9,
  },
  {
    label: "10",
    value: 10,
  },
  {
    label: "11",
    value: 11,
  },
  {
    label: "12",
    value: 12,
  },
  {
    label: "13",
    value: 13,
  },
  {
    label: "14",
    value: 14,
  },
  {
    label: "15",
    value: 15,
  },
];

const floorsNumbers = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  { label: "4", value: 4 },
  {
    label: "5",
    value: 5,
  },
  {
    label: "6",
    value: 6,
  },
  {
    label: "7",
    value: 7,
  },
  {
    label: "8",
    value: 8,
  },
  {
    label: "9",
    value: 9,
  },
  {
    label: "10",
    value: 10,
  },
  {
    label: "11",
    value: 11,
  },
  {
    label: "12",
    value: 12,
  },
  {
    label: "13",
    value: 13,
  },
  {
    label: "14",
    value: 14,
  },
  {
    label: "15",
    value: 15,
  },
];

const apartmentFloorsNumbers = [
  {
    label: "أرضي",
    value: 0,
  },
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  { label: "4", value: 4 },
  {
    label: "5",
    value: 5,
  },
  {
    label: "6",
    value: 6,
  },
  {
    label: "7",
    value: 7,
  },
  {
    label: "8",
    value: 8,
  },
  {
    label: "9",
    value: 9,
  },
  {
    label: "10",
    value: 10,
  },
  {
    label: "11",
    value: 11,
  },
  {
    label: "12",
    value: 12,
  },
  {
    label: "13",
    value: 13,
  },
  {
    label: "14",
    value: 14,
  },
  {
    label: "15",
    value: 15,
  },
];
const marineEngineBrands = [
  { label: "Albin", value: "ALBIN" },
  { label: "Arthor", value: "ARTHOR" },
  { label: "Atamarine", value: "ATAMARINE" },
  { label: "Audi", value: "AUDI" },
  { label: "BMC", value: "BMC" },
  { label: "BMW", value: "BMW" },
  { label: "Bukh", value: "BUKH" },
  { label: "Caterpillar", value: "CATERPILLAR" },
  { label: "Craftsman Marine", value: "CRAFTSMAN_MARINE" },
  { label: "Crusader", value: "CRUSADER" },
  { label: "Cummins", value: "CUMMINS" },
  { label: "Daewoo", value: "DAEWOO" },
  { label: "Daihatsu", value: "DAIHATSU" },
  { label: "Detroit Diesel", value: "DETROIT_DIESEL" },
  { label: "Deutz", value: "DEUTZ" },
  { label: "Doosan", value: "DOOSAN" },
  { label: "Evinrude", value: "EVINRUDE" },
  { label: "Fiat Tatmar", value: "FIAT_TATMAR" },
  { label: "FNM", value: "FNM" },
  { label: "Ford", value: "FORD" },
  { label: "Ford Lehman / Sabre", value: "FORD_LEHMAN_SABRE" },
  { label: "FPT", value: "FPT" },
  { label: "Gardner", value: "GARDNER" },
  { label: "General Motors", value: "GENERAL_MOTORS" },
  { label: "Hidea", value: "HIDEA" },
  { label: "Hino", value: "HINO" },
  { label: "Honda", value: "HONDA" },
  { label: "Hyundai", value: "HYUNDAI" },
  { label: "Isuzu", value: "ISUZU" },
  { label: "Iveco", value: "IVECO" },
  { label: "Jersey", value: "JERSEY" },
  { label: "John Deere", value: "JOHN_DEERE" },
  { label: "Johnson", value: "JOHNSON" },
  { label: "Katana", value: "KATANA" },
  { label: "KIA", value: "KIA" },
  { label: "Kubota", value: "KUBOTA" },
  { label: "Leyland", value: "LEYLAND" },
  { label: "Lister Petter", value: "LISTER_PETTER" },
  { label: "Lombardini", value: "LOMBARDINI" },
  { label: "Lotus", value: "LOTUS" },
  { label: "M.T.U", value: "M_T_U" },
  { label: "MAN", value: "MAN" },
  { label: "Mariner", value: "MARINER" },
  { label: "Mazda", value: "MAZDA" },
  { label: "Mercedes", value: "MERCEDES" },
  { label: "Mercruiser", value: "MERCRUISER" },
  { label: "Mercury", value: "MERCURY" },
  { label: "Mitsubishi", value: "MITSUBISHI" },
  { label: "Moteurs Baudouin", value: "MOTEURS_BAUDOUIN" },
  { label: "Nanni Diesel", value: "NANNI_DIESEL" },
  { label: "Nissan", value: "NISSAN" },
  { label: "OMC", value: "OMC" },
  { label: "Parsun", value: "PARSUN" },
  { label: "Perkins", value: "PERKINS" },
  { label: "Peugeot", value: "PEUGEOT" },
  { label: "Quanchai", value: "QUANCHAI" },
  { label: "Raywin", value: "RAYWIN" },
  { label: "Renault", value: "RENAULT" },
  { label: "Scania", value: "SCANIA" },
  { label: "Steyr", value: "STEYR" },
  { label: "Suzuki", value: "SUZUKI" },
  { label: "Tohatsu", value: "TOHATSU" },
  { label: "Torqeedo", value: "TORQEEDO" },
  { label: "Toyota Nanni", value: "TOYOTA_NANNI" },
  { label: "Vetus", value: "VETUS" },
  { label: "VM Motori", value: "VM_MOTORI" },
  { label: "Volkswagen", value: "VOLKSWAGEN" },
  { label: "Volvo Penta", value: "VOLVO_PENTA" },
  { label: "Westerbeke", value: "WESTERBEKE" },
  { label: "Yamaha", value: "YAMAHA" },
  { label: "Yangdong", value: "YANGDONG" },
  { label: "Yanmar", value: "YANMAR" },
  { label: "OTHER", value: "OTHER" },
];

const cylendersOptions = [
  { value: 1, label: "V1" },
  { value: 2, label: "V2" },
  { value: 3, label: "V3" },
  { value: 4, label: "V4" },
  { value: 5, label: "V5" },
  { value: 6, label: "V6" },
  { value: 7, label: "V7" },
  { value: 8, label: "V8" },
  { value: 9, label: "V9" },
  { value: 10, label: "V10" },
  { value: 11, label: "V11" },
  { value: 12, label: "V12" },
  { value: 13, label: "V13" },
  { value: 14, label: "V14" },
  { value: 15, label: "V15" },
  { value: 16, label: "V16" },
  { value: 17, label: "V17" },
  { value: 18, label: "V18" },
  { value: 19, label: "V19" },
  { value: 20, label: "V20" },
  { value: 21, label: "V21" },
  { value: 22, label: "V22" },
  { value: 23, label: "V23" },
  { value: 24, label: "V24" },
];

const ownerTypes = [
  { label: "المالك", value: "OWNER" },
  { label: "مكتب", value: "OFICE" },
  { label: "شركة", value: "COMPANY" },
];

const faqsCategories = [
  { value: "Payment", label: "المدفوعات" },
  { value: "Subscribtion", label: "الاشتراكات" },
  { value: "Ad", label: "الإعلانات" },
  { value: "System", label: "النظام" },
  { value: "General", label: "عام" },
];

export {
  itemsPerPage,
  sortOptions,
  sortDirectionOptions,
  SyriaCities,
  Currencies,
  Categories,
  Categories_v2,
  RentalPeriod,
  transmissionTypes,
  fuelTypes,
  conditionTypes,
  colors,
  coolingTypes,
  motorcycleTypes,
  marineTypes,
  RentalPeriod_v2,
  carTypes,
  houseTypes,
  yearOptions,
  adTypes,
  swapOptions,
  seatsCount,
  doorsCount,
  roomsNumbers,
  floorsNumbers,
  apartmentFloorsNumbers,
  marineBodyMaterials,
  marineEngineBrands,
  cylendersOptions,
  ownerTypes,
  adsStatusTypes,
  adsAvtiveTypes,
  faqsCategories,
};
