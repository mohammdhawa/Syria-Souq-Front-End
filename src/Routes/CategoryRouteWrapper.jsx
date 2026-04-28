import AdvertisementsPage from "@/pages/properties";
import { useParams, Navigate } from "react-router-dom";
import { getValidCategoryNames, getCategoryUrlName } from "@/utils/categoryMapping";

const CategoryRouteWrapper = () => {
  const { category } = useParams();
  const allowedCategories = getValidCategoryNames();
  
  // Decode and normalize the category name
  const normalizedCategory = decodeURIComponent(category || "");
  const mappedCategory = getCategoryUrlName(normalizedCategory);

  if (!allowedCategories.includes(mappedCategory)) {
    return <Navigate to="/404" replace />;
  }

  return <AdvertisementsPage key={mappedCategory} />;
};

export default CategoryRouteWrapper;
