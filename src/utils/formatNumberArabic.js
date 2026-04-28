export const formatNumberArabic = (num) => {
  if (num === "" || isNaN(Number(num))) {
    return "";
  }
  const value = Number(num);
  if (value < 1000) {
    return value.toString();
  } else if (value < 1000000) {
    const thousands = value / 1000;
    if (thousands === Math.floor(thousands)) {
      return `${thousands} ألف`;
    } else {
      return `${thousands.toFixed(1)} ألف`;
    }
  } else if (value < 1000000000) {
    const millions = value / 1000000;
    if (millions === Math.floor(millions)) {
      return `${millions} مليون`;
    } else {
      return `${millions.toFixed(1)} مليون`;
    }
  } else {
    const billions = value / 1000000000;
    if (billions === Math.floor(billions)) {
      return `${billions} مليار`;
    } else {
      return `${billions.toFixed(1)} مليار`;
    }
  }
};
