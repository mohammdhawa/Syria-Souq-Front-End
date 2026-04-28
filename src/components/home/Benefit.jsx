import React from "react";
import { Link } from "react-router-dom";
import {
  Motorbike02Icon,
  BoatIcon,
  MapingIcon,
  House01Icon,
  Car04Icon,
} from "hugeicons-react";

export default function Benefit() {
  return (
    <section className="flat-section bg-primary-new">
      <div className="container3">
        <div className="flat-img-with-text-v2">
          <div className="content-right">
            <div className="box-title wow fadeInUp">
              <div
                style={{ color: "#1e1e1e", letterSpacing: "0px" }}
                className="text-subtitle fs-5 fw-light "
              >
                خدماتنا
              </div>
              <h3 className="title mt-4">
                منصتنا تضمن لك سهولة النشر ووضوح العرض دون وسطاء
              </h3>
              <p className="desc fs-5  text-variant-1">
                نقدم لك مساحة إعلانية مرنة وبسيطة، تساعدك على نشر إعلانك بشكل
                مباشر والوصول إلى المهتمين دون أي وساطة.
              </p>
            </div>
            <div className="flat-service wow fadeInUp" data-wow-delay=".2s">
              <Link to="/cars" className="box-benefit hover-btn-view">
                <div className="icon-box">
                  <span className="icon">
                    <Car04Icon color="#1e1e1e" size={60} />
                  </span>
                </div>
                <div className="content">
                  <h5 className="title fs-3">السيارات</h5>
                  <p className="description fs-6">
                    اكتشف مجموعة واسعة من السيارات الجديدة والمستعملة.
                  </p>
                  <span className="btn-view style-1">
                    <span className="text">استكشف الآن</span>
                    <span
                      style={{ color: "#1e1e1e" }}
                      className="icon icon-arrow-left2"
                    />
                  </span>
                </div>
              </Link>
              <Link to="/houses" className="box-benefit hover-btn-view">
                <div className="icon-box">
                  <span className="icon">
                    <House01Icon color="#1e1e1e" size={60} />
                  </span>
                </div>
                <div className="content">
                  <h5 className="title">المنازل</h5>
                  <p className="description">
                    سواء كنت تبحث عن منزل أحلامك أو ترغب في بيع أو تأجير عقارك،
                    لدينا الحلول المصممة خصيصًا لك.
                  </p>
                  <span className="btn-view style-1">
                    <span className="text">استكشف الآن</span>
                    <span
                      style={{ color: "#1e1e1e" }}
                      className="icon icon-arrow-left2"
                    />
                  </span>
                </div>
              </Link>
              <Link to="/motorcycles" className="box-benefit hover-btn-view">
                <div className="icon-box">
                  <span className="icon">
                    <Motorbike02Icon color="#1e1e1e" size={60} />
                  </span>
                </div>
                <div className="content">
                  <h5 className="title">الدراجات النارية</h5>
                  <p className="description">
                    اعرض دراجتك أو استكشف مجموعة من الدراجات المعروضة للبيع من
                    مختلف الأنواع والموديلات.
                  </p>
                  <span className="btn-view style-1">
                    <span className="text">استكشف الآن</span>
                    <span
                      style={{ color: "#1e1e1e" }}
                      className="icon icon-arrow-left2"
                    />
                  </span>
                </div>
              </Link>
              <Link to="/marines" className="box-benefit hover-btn-view">
                <div className="icon-box">
                  <span className="icon">
                    <BoatIcon color="#1e1e1e" size={60} />
                  </span>
                </div>
                <div className="content">
                  <h5 className="title">المركبات البحرية</h5>
                  <p className="description">
                    من القوارب إلى الجيت سكي، نوفر لك سوقًا متخصصًا لبيع وشراء
                    المركبات البحرية بسهولة واحترافية.
                  </p>
                  <span className="btn-view style-1">
                    <span className="text">استكشف الآن</span>
                    <span
                      style={{ color: "#1e1e1e" }}
                      className="icon icon-arrow-left2"
                    />
                  </span>
                </div>
              </Link>
              <Link to="/lands" className="box-benefit hover-btn-view">
                <div className="icon-box">
                  <span className="icon">
                    <MapingIcon color="#1e1e1e" size={60} />
                  </span>
                </div>
                <div className="content">
                  <h5 className="title">الأراضي</h5>
                  <p className="description">
                    اعثر على أراضٍ للبيع بمختلف المساحات والمواقع، أو قم بإدراج
                    أرضك لجذب المشترين المحتملين.
                  </p>
                  <span className="btn-view style-1">
                    <span className="text">استكشف الآن</span>
                    <span
                      style={{ color: "#1e1e1e" }}
                      className="icon icon-arrow-left2"
                    />
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className="content-left tf-image-box">
            <div className="grid-img-group">
              <div className="tf-image-wrap item-1">
                <div className="img-style hover-img-wrap">
                  <img
                    className="lazyload"
                    data-src="/images/service/car.jpeg"
                    alt=""
                    src="/images/service/car.jpeg"
                    width={484}
                    height={465}
                  />
                </div>
                <div className="tag-item ani5">
                  <i className="icon icon-check-circle " />
                  <span>عقارات بكل الأنواع</span>
                </div>
              </div>
              <div className="tf-image-wrap item-2">
                <div className="img-style hover-img-wrap">
                  <img
                    className="lazyload"
                    data-src="/images/service/BildingHome.jpeg"
                    alt=""
                    src="/images/service/BildingHome.jpeg"
                    width={842}
                    height={930}
                  />
                </div>
                <div className="tag-item tag-item-1 ani4">
                  <i className="icon icon-check-circle " />
                  <span>سهولة الإعلان والبحث</span>
                </div>
                <div className="tag-item tag-item-2 ani5">
                  <i className="icon icon-check-circle " />
                  <span>وصول للمهتمين فورًا</span>
                </div>
              </div>
              <div className="tf-image-wrap item-3">
                <div className="img-style hover-img-wrap">
                  <img
                    className="lazyload"
                    data-src="/images/service/motor.jpeg"
                    alt=""
                    src="/images/service/motor.jpeg"
                    width={370}
                    height={354}
                  />
                </div>
                <div className="tag-item ani4">
                  <i className="icon icon-check-circle " />
                  <span>خيارات متنوعة وسريعة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
