import React from "react";
import { Link } from "react-router-dom";
export default function PageTitle2() {
  return (
    <section
      className="flat-title-page"
      style={{ backgroundImage: "url(/images/page-title/pricing.png)" }}
    >
      <div className="container">
        <div className="breadcrumb-content">
          <h1 style={{ color: "#1e1e1e" }} className="text-center title">
            الإشتراكات
          </h1>
        </div>
      </div>
    </section>
  );
}
