function formatArabicAdsCount(count) {
  const singular = "إعلان";
  const dual = "إعلانان";
  const plural = "إعلانات";

  if (count === 0) return `لا يوجد ${plural}`;
  if (count === 1) return `إعلان واحد`;
  if (count === 2) return `${dual}`;
  if (count >= 3 && count <= 10) return `${count} ${plural}`;
  return `${count} ${singular}`;
}

export default formatArabicAdsCount;
