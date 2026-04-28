import { RentalPeriod } from "@/data/General";

const getRentalPeriodLabel = (value) => {
  const period = RentalPeriod.find((p) => p.value === value);
  return period ? period.label : "";
};

export { getRentalPeriodLabel };
