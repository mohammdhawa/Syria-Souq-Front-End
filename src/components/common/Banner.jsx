import React from "react";
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <section className="flat-section  flat-banner">
      <div className="container">
        <div className="wrap-banner bg-primary-new">
          <div style={{
            paddingRight:"5rem"
          }} className="box-left ">
            <div className="box-title">
              <div className="fw-bold  fs-5 text-variant-1 ">
                فرصتك للبيع أسرع
              </div>
              <h3 className="mt-2 fw-8">
                انشر إعلانك على سوق سوريا وابدأ بجذب العملاء اليوم!
              </h3>
            </div>
            <Link to={`/publish-ad`} className="tf-btn text-dark   primary">
              انشر إعلانك الـــآن
            </Link>
          </div>
          <div className="box-right">
            <img alt="image" src="/images/banner/home_banner.png" width={748} />
          </div>
        </div>
      </div>
    </section>
  );
}
