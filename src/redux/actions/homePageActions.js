import api from "../api";

export const fetchHomePageStart = () => ({ type: "FETCH_HOME_PAGE_START" });
export const fetchHomePageSuccess = (data) => ({
  type: "FETCH_HOME_PAGE_SUCCESS",
  payload: data,
});
export const fetchHomePageFailure = (error) => ({
  type: "FETCH_HOME_PAGE_FAILURE",
  payload: error,
});

export const fetchHomePage = () => async (dispatch) => {
  dispatch(fetchHomePageStart());
  try {
    const response = await api.get("/home-page");
    dispatch(fetchHomePageSuccess(response.data));
  } catch (error) {
    dispatch(
      fetchHomePageFailure(error.response?.data?.message || error.message)
    );
  }
};
