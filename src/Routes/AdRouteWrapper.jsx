import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdDetailsPage from "@/pages/addetails";
import { getValidCategoryNames, getCategoryUrlName } from "@/utils/categoryMapping";

const AdRouteWrapper = () => {
  const { category, type, id, slug } = useParams();
  const navigate = useNavigate();

  const allowedCategories = getValidCategoryNames();
  
  // Decode and normalize the category name
  const normalizedCategory = decodeURIComponent(category || "");
  const mappedCategory = getCategoryUrlName(normalizedCategory);
  const allowedTypes = ["rent", "sale"];

  const isInvalid =
    !category ||
    !type ||
    !allowedCategories.includes(mappedCategory) ||
    !allowedTypes.includes(type) ||
    !id ||
    id.trim() === "" ||
    !slug ||
    slug.trim() === "";

  useEffect(() => {
    if (isInvalid) {
      navigate("/404", { replace: true });
    }
  }, [isInvalid, navigate]);

  if (isInvalid) {
    return null;
  }

  return <AdDetailsPage key={`${category}-${id}`} />;
};

export default AdRouteWrapper;
