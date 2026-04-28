const initialState = {
  brands: [],
  models: [],
  loading: false,
  error: null,
};

const vehicleReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_BRANDS_START":
    case "FETCH_MODELS_START":
      return { ...state, loading: true, error: null };

    case "FETCH_BRANDS_SUCCESS":
      return {
        ...state,
        loading: false,
        brands: action.payload,
      };

    case "FETCH_MODELS_SUCCESS":
      return {
        ...state,
        loading: false,
        models: action.payload,
      };

    case "FETCH_BRANDS_FAILURE":
    case "FETCH_MODELS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default vehicleReducer;
