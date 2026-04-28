import api from "../api";

export const fetchPackagesStart = () => ({ type: "FETCH_PACKAGES_START" });
export const fetchPackagesSuccess = (data) => ({
  type: "FETCH_PACKAGES_SUCCESS",
  payload: data,
});
export const fetchPackagesFailure = (error) => ({
  type: "FETCH_PACKAGES_FAILURE",
  payload: error,
});

export const fetchPackages = () => async (dispatch) => {
  dispatch(fetchPackagesStart());
  try {
    const response = await api.get("/available-packages");
    dispatch(fetchPackagesSuccess(response.data.packages));
    return Promise.resolve();
  } catch (error) {
    dispatch(
      fetchPackagesFailure(error.response?.data?.message || error.message)
    );
    return Promise.reject(error);
  }
};

export const synchronizePackages = () => (dispatch) => {
  window.addEventListener("storage", (event) => {
    if (event.key === "PACKAGES_UPDATED") {
      dispatch(fetchPackages());
    }
  });
};
