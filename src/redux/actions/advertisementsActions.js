import api from "../api";

export const FETCH_ADVERTISEMENTS_START = "FETCH_ADVERTISEMENTS_START";
export const FETCH_ADVERTISEMENTS_SUCCESS = "FETCH_ADVERTISEMENTS_SUCCESS";
export const FETCH_ADVERTISEMENTS_FAILURE = "FETCH_ADVERTISEMENTS_FAILURE";

export const fetchAdvertisementsStart = () => ({
  type: FETCH_ADVERTISEMENTS_START,
});

export const fetchAdvertisementsSuccess = (data) => ({
  type: FETCH_ADVERTISEMENTS_SUCCESS,
  payload: data,
});

export const fetchAdvertisementsFailure = (error) => ({
  type: FETCH_ADVERTISEMENTS_FAILURE,
  payload: error,
});

export const fetchAdvertisements =
  (
    perPage,
    currentPage,
    category,
    sortValue = "",
    adType,
    keyword,
    minPrice,
    maxPrice,
    city,
    color,
    fuelType,
    transmissionType,
    condition,
    carType,
    motorcycleType,
    coolingType,
    brand,
    model,
    rooms,
    houseType,
    marineType,
    year,
    minSquareMeter,
    maxSquareMeter
  ) =>
  async (dispatch) => {
    dispatch(fetchAdvertisementsStart());
    try {
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", currentPage);

      if (adType !== "all" && adType !== null && adType !== undefined) {
        params.append("type", adType);
      }
      if (category !== null && category !== undefined) {
        params.append("category", category);
      }
      if (city !== null && city !== undefined) {
        params.append("city", city);
      }
      if (carType !== null && carType !== undefined) {
        params.append("car_type", carType);
      }
      if (marineType !== null && marineType !== undefined) {
        params.append("marine_type", marineType);
      }
      if (motorcycleType !== null && motorcycleType !== undefined) {
        params.append("motorcycle_type", motorcycleType);
      }
      if (brand !== null && brand !== undefined) {
        params.append("brand", brand);
      }
      if (model !== null && model !== undefined) {
        params.append("model", model);
      }
      if (year !== null && year !== undefined) {
        params.append("year", year);
      }
      if (coolingType !== null && coolingType !== undefined) {
        params.append("cooling_type", coolingType);
      }
      if (color !== null && color !== undefined) {
        params.append("color", color);
      }
      if (fuelType !== null && fuelType !== undefined) {
        params.append("fuel_type", fuelType);
      }
      if (transmissionType !== null && transmissionType !== undefined) {
        params.append("transmission_type", transmissionType);
      }
      if (condition !== null && condition !== undefined) {
        params.append("condition", condition);
      }
      if (keyword !== "" && keyword !== null && keyword !== undefined) {
        params.append("search", keyword);
      }
      if (
        minSquareMeter !== "" &&
        minSquareMeter !== null &&
        minSquareMeter !== undefined
      ) {
        params.append("min_square_meters", minSquareMeter);
      }
      if (
        maxSquareMeter !== "" &&
        maxSquareMeter !== null &&
        maxSquareMeter !== undefined
      ) {
        params.append("max_square_meters", maxSquareMeter);
      }
      if (minPrice !== "" && minPrice !== null && minPrice !== undefined) {
        params.append("minPrice", minPrice);
      }
      if (rooms !== "" && rooms !== null && rooms !== undefined) {
        params.append("number_of_rooms", rooms);
      }
      if (houseType !== null && houseType !== undefined) {
        params.append("house_type", houseType);
      }
      if (maxPrice !== "" && maxPrice !== null && maxPrice !== undefined) {
        params.append("maxPrice", maxPrice);
      }
      if (sortValue) {
        const underscoreIndex = sortValue.lastIndexOf("_");
        const sortBy = sortValue.substring(0, underscoreIndex);
        const sortDirection = sortValue.substring(underscoreIndex + 1);

        const validSortBy = ["price", "activated_at"];
        const validSortDirection = ["asc", "desc"];

        if (
          validSortBy.includes(sortBy) &&
          validSortDirection.includes(sortDirection)
        ) {
          params.append("sort_by", sortBy);
          params.append("sort_direction", sortDirection);
        }
      }

      const response = await api.get(
        `/all-advertisements?${params.toString()}`
      );
      dispatch(fetchAdvertisementsSuccess(response.data.data));
    } catch (error) {
      dispatch(
        fetchAdvertisementsFailure(
          error.response?.data?.message || error.message
        )
      );
    }
  };
