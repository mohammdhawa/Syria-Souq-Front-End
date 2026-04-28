import React, { useState } from "react";

export default function Description({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <h5 className="fw-6 title">وصف تفصيلي للإعلان</h5>
      <p className="text-variant-1  fs-5 fw-light">
        {isExpanded || description?.length <= maxLength
          ? description
          : `${description?.slice(0, maxLength)}...`}
      </p>
      {description?.length > maxLength && (
        <a className="btn-view" onClick={handleToggle}>
          <span className="text">{isExpanded ? "إخفاء" : "قراءة المزيد"}</span>
        </a>
      )}
    </>
  );
}
