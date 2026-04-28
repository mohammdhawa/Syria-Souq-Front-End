import { Typography } from "antd";
import React, { useState } from "react";

export default function AdDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="d-flex flex-column gap-3">
      <h5 className="fw-6 title">وصف تفصيلي للإعلان</h5>
      <Typography.Text className="text-variant-1  fs-5 fw-light">
        {isExpanded || description?.length <= maxLength
          ? description
          : `${description?.slice(0, maxLength)}...`}
      </Typography.Text>
      {description?.length > maxLength && (
        <a className="btn-view" onClick={handleToggle}>
          <span className="text">{isExpanded ? "إخفاء" : "قراءة المزيد"}</span>
        </a>
      )}
    </div>
  );
}
