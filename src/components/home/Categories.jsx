import { useSelector } from "react-redux";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Categories as AdsCategories } from "@/data/General";
import Marquee from "react-fast-marquee";

const getArabicCategoryLabel = (count, category) => {
  if (category.label === "سيارات") {
    if (count === 1) return `${count} سيارة`;
    if (count === 2) return `${count} سيارتين`;
    if (count > 2 && count <= 10) return `${count} سيارات`;
    return `${count} سيارة`;
  }

  if (category.label === "منازل") {
    if (count === 1) return `${count} منزل`;
    if (count === 2) return `${count} منزلين`;
    if (count > 2 && count <= 10) return `${count} منازل`;
    return `${count} منزل`;
  }

  if (category.label === "أراضي") {
    if (count === 1) return `${count} أرض`;
    if (count === 2) return `${count} أرضين`;
    if (count > 2 && count <= 10) return `${count} أراضي`;
    return `${count} أرض`;
  }

  if (category.label === "مركبات بحرية") {
    if (count === 1) return `${count} مركبة`;
    if (count === 2) return `${count} مركبتين`;
    if (count > 2 && count <= 10) return `${count} مركبات`;
    return `${count} مركبة`;
  }

  if (category.label === "دراجات نارية") {
    if (count === 1) return `${count} دراجة`;
    if (count === 2) return `${count} دراجتين`;
    if (count > 2 && count <= 10) return `${count} دراجات`;
    return `${count} دراجة`;
  }
  return `${count} ${category.label}`;
};

export default function Categories() {
  const { countPerCategory } = useSelector((state) => state.homePage);

  const categorizedData = Object.keys(countPerCategory).map((key) => {
    const category = AdsCategories.find((cat) => cat.value === Number(key));
    return {
      ...category,
      count: countPerCategory[key],
    };
  });

  return (
    <section className="flat-section flat-categories pb-5">
      <div className="container">
        <div
          style={{ width: "100%", textAlign: "center" }}
          className="box-title style-1 wow fadeInUp"
        >
          <div style={{ color: "#A3ABB0" }} className="text-subtitle">
            كل الفئات في مكان واحد
          </div>
          <h3 className="title mt-4">اختر ما يناسبك بسهولة وسرعة</h3>
        </div>

        <Marquee
          style={{
            direction: "ltr",
          }}
          pauseOnHover
          autoFill={true}
          speed={100}
          gradient={true}
          className="pb-5"
        >
          {categorizedData.map((category, index) => (
            <div
              style={{
                padding: "0 1.5rem",
              }}
              key={index}
            >
              <a
                href={category.englishLabel}
                target="_blank"
                className="syria-souq-categories gap-2"
                style={{ width: "250px" }}
              >
                <div className="">
                  {category.icon && <category.icon size={60} strokeWidth={1} />}
                </div>
                <div className="content text-center">
                  <h6>{category.label}</h6>
                  <p className="mt-1 text-variant-2">
                    {getArabicCategoryLabel(category.count, category)}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
