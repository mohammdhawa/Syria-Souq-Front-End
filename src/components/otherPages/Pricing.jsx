import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Pricing() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/available-packages")
      .then((response) => {

        setPlans(response.data.packages);
      })
      .catch((error) => {

      });
  }, []);

  return (
    <section className="flat-section flat-pricing">
      <div className="container">
        <div
          className="box-title text-center wow fadeInUpSmall"
          data-wow-delay=".2s"
          data-wow-duration="2000ms"
        >
          <div style={{ color: "#a3abb0" }} className="text-subtitle">
            قسم الإشتراكات
          </div>
          <h3 className="title mt-4">جميع الإشتراكات</h3>
        </div>
        <div className="row">
          {plans
            .filter((plan) => plan.is_active)
            .map((plan, index) => (
              <div className="box col-lg-3 col-md-6" key={index}>
                <div className={`box-pricing `}>
                  <div className="box price d-flex align-items-center justify-content-start">
                    <h3 style={{ fontSize: "25px" }}>
                      {Number(plan.price).toLocaleString()} $
                    </h3>
                    <span
                      style={{
                        fontSize: "20px",
                        color: "#5C6368",
                        marginRight: "5px",
                      }}
                      className="body-2 text-variant-1"
                    >
                      / {plan.period > 29 ? "شهر" : `${plan.period} يوم`}
                    </span>
                  </div>

                  <div className="box box-title-price">
                    <h5 className="title">{plan.name}</h5>
                    <p className="desc">{plan.properties}</p>
                  </div>
                  <ul className="box list-price">
                    <li className="item">
                      <span className="check-icon icon-tick2" />
                      عدد الإعلانات: {plan.max_of_ads}
                    </li>
                    <li className="item">
                      <span className="check-icon icon-tick2" />
                      المدة: {plan.period} يوم
                    </li>
                  </ul>
                  <div className="box">
                    <a
                      style={{ color: "#1E1E1E" }}
                      href="#"
                      className="tf-btn btn-view size-1 hover-btn-view"
                    >
                      اشترك الآن
                      <span
                        style={{ color: "#1E1E1E" }}
                        className="icon icon-arrow-left2"
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
