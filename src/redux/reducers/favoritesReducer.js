import { AUTH_TYPES } from "../authTypes";
const initialState = {
  favorites: [],
  loading: false,
  changeFavoriteLoading: false,
  error: null,
};

const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FAVORITE_START":
      return { ...state, changeFavoriteLoading: true, error: null };

    case "REMOVE_FAVORITE_START":
      return { ...state, changeFavoriteLoading: true, error: null };

    case "FETCH_FAVORITES_START":
      return { ...state, loading: true, error: null };

    case "ADD_FAVORITE_SUCCESS":
      return {
        ...state,
        changeFavoriteLoading: false,
        favorites: [...state.favorites, action.payload],
      };

    case "REMOVE_FAVORITE_SUCCESS":
      return {
        ...state,
        changeFavoriteLoading: false,
        favorites: state.favorites.filter(
          (fav) => fav.advs_id !== action.payload
        ),
      };

    case "FETCH_FAVORITES_SUCCESS":
      return {
        ...state,
        loading: false,
        favorites: action.payload,
      };

    case "ADD_FAVORITE_FAILURE":
      return { ...state, changeFavoriteLoading: false, error: action.payload };

    case "REMOVE_FAVORITE_FAILURE":
      return { ...state, changeFavoriteLoading: false, error: action.payload };

    case "FETCH_FAVORITES_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case AUTH_TYPES.RESET_FAVORITES:
      return {
        ...state,
        favorites: [],
        loading: false,
        changeFavoriteLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

export default favoritesReducer;
