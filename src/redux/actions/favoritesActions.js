import api from "../api";

export const addFavoriteStart = () => ({ type: "ADD_FAVORITE_START" });
export const addFavoriteSuccess = (data) => ({
  type: "ADD_FAVORITE_SUCCESS",
  payload: data,
});
export const addFavoriteFailure = (error) => ({
  type: "ADD_FAVORITE_FAILURE",
  payload: error,
});

export const removeFavoriteStart = () => ({ type: "REMOVE_FAVORITE_START" });
export const removeFavoriteSuccess = (advs_id) => ({
  type: "REMOVE_FAVORITE_SUCCESS",
  payload: advs_id,
});
export const removeFavoriteFailure = (error) => ({
  type: "REMOVE_FAVORITE_FAILURE",
  payload: error,
});

export const fetchFavoritesStart = () => ({ type: "FETCH_FAVORITES_START" });
export const fetchFavoritesSuccess = (data) => ({
  type: "FETCH_FAVORITES_SUCCESS",
  payload: data,
});
export const fetchFavoritesFailure = (error) => ({
  type: "FETCH_FAVORITES_FAILURE",
  payload: error,
});

export const addFavorite = (advs_id) => async (dispatch) => {
  dispatch(addFavoriteStart());
  try {
    const response = await api.post("/favorites", { advs_id });
    dispatch(addFavoriteSuccess(response.data.data));
    localStorage.setItem("FAVORITES_UPDATED", Date.now().toString());

    return Promise.resolve();
  } catch (error) {
    dispatch(
      addFavoriteFailure(error.response?.data?.message || error.message)
    );
    return Promise.reject(error);
  }
};

export const removeFavorite = (advs_id) => async (dispatch) => {
  dispatch(removeFavoriteStart());
  try {
    const response = await api.delete(`/favorites/${advs_id}`);
    dispatch(removeFavoriteSuccess(advs_id));

    localStorage.setItem("FAVORITES_UPDATED", Date.now().toString());

    return Promise.resolve();
  } catch (error) {
    dispatch(
      removeFavoriteFailure(error.response?.data?.message || error.message)
    );
    return Promise.reject(error);
  }
};

export const fetchFavorites = () => async (dispatch) => {
  dispatch(fetchFavoritesStart());
  try {
    const response = await api.get("/favorites");
    dispatch(fetchFavoritesSuccess(response.data.data));
    return Promise.resolve();
  } catch (error) {
    dispatch(
      fetchFavoritesFailure(error.response?.data?.message || error.message)
    );
    return Promise.reject(error);
  }
};

export const synchronizeFavorites = () => (dispatch) => {
  window.addEventListener("storage", (event) => {
    if (event.key === "FAVORITES_UPDATED") {
      dispatch(fetchFavorites());
    }
  });
};
