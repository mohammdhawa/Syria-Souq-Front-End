import api from "../api";

export const fetchModelsStart = () => ({ type: "FETCH_MODELS_START" });
export const fetchModelsSuccess = (data) => ({
  type: "FETCH_MODELS_SUCCESS",
  payload: data,
});
export const fetchModelsFailure = (error) => ({
  type: "FETCH_MODELS_FAILURE",
  payload: error,
});

export const fetchModels = (brand_id) => async (dispatch) => {
  dispatch(fetchModelsStart());
  try {
    const response = await api.get(`/brand/${brand_id}/models`);
    const transformedData = response.data.data.map((model) => ({
      label: model.name,
      value: model.id,
    }));
    dispatch(fetchModelsSuccess(transformedData));
    return Promise.resolve();
  } catch (error) {
    dispatch(
      fetchModelsFailure(error.response?.data?.message || error.message)
    );
    return Promise.reject(error);
  }
};
