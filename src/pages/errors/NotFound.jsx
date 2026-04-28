import MetaComponent from "@/components/common/MetaComponent";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const metadata = {
    title: "Syria Souq | 404",
    description: "Syria Souq | 404",
  };
  return (
    <>
      <MetaComponent meta={metadata} />

      <div
        style={{ minHeight: "calc(100vh)" }}
        className="d-flex  flex-column align-items-center py-5 px-5 justify-content-center gap-3 notfound-container"
      >
        <div className="d-flex flex-column align-items-center gap-1 mb-2">
          <p className="fs-1 fw-bold">يبدو أنك ضللت الطريق!</p>
          <span className="fs-6 fw-light">
            الصفحة التي تحاول الوصول إليها غير متوفرة.{" "}
            <Link replace={true} to={"/"} className="fw-normal ">
              العودة للصفحة الرئيسية؟
            </Link>
          </span>
        </div>
        <img width={600} src="/images/404.png" alt="" />
      </div>
    </>
  );
};

export default NotFound;
