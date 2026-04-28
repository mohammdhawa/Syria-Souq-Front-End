import api from "../api";

export const fetchBrandsStart = () => ({ type: "FETCH_BRANDS_START" });
export const fetchBrandsSuccess = (data) => ({
  type: "FETCH_BRANDS_SUCCESS",
  payload: data,
});
export const fetchBrandsFailure = (error) => ({
  type: "FETCH_BRANDS_FAILURE",
  payload: error,
});

export const fetchBrands = (category_id) => async (dispatch) => {
  dispatch(fetchBrandsStart());
  try {
    const response = await api.get(`/brands?category_id=${category_id}`);
    const transformedData = response.data.data.map((brand) => ({
      label: brand.name,
      value: brand.id,
    }));
    dispatch(fetchBrandsSuccess(transformedData));
    return Promise.resolve();
  } catch (error) {
    dispatch(
      fetchBrandsFailure(error.response?.data?.message || error.message)
    );
    return Promise.reject(error);
  }
};
