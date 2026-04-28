import React from "react";
import { Link } from "react-router-dom";
export default function PageTitle3() {
  return (
    <section
      className="flat-title-page"
      style={{ backgroundImage: "url(/images/page-title/contact.png)" }}
    >
      <div className="container">
        <div className="breadcrumb-content">
          <h1 style={{ color: "#1E1E1E" }} className="text-center title">
            تواصلوا معنا
          </h1>
        </div>
      </div>
    </section>
  );
}
