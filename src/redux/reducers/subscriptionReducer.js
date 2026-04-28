import { message } from "antd";
import { AUTH_TYPES } from "../authTypes";

const initialState = {
  subscription: null,
  loading: false,
  requestLoading: false,
  error: null,
  requestError: null,
  requestSuccess: false,
  requestData: null,
};

const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SUBSCRIPTION_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUBSCRIPTION_SUCCESS":
      return {
        ...state,
        loading: false,
        subscription: action.payload,
      };

    case "FETCH_SUBSCRIPTION_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_SUBSCRIPTION_REQUEST_START":
      return {
        ...state,
        requestLoading: true,
        requestError: null,
        requestSuccess: false,
      };

    case "CREATE_SUBSCRIPTION_REQUEST_SUCCESS":
      return {
        ...state,
        requestLoading: false,
        requestSuccess: true,
        requestData: action.payload,
        requestError: null,
        subscription: {
          has_pending: true,
        },
      };

    case "CREATE_SUBSCRIPTION_REQUEST_FAILURE":
      return {
        ...state,
        requestLoading: false,
        requestSuccess: false,
        requestError: action.payload,
      };

    case AUTH_TYPES.RESET_SUBSCRIPTION:
      return {
        ...state,
        subscription: null,
        loading: false,
        requestLoading: false,
        error: null,
        requestError: null,
        requestSuccess: false,
        requestData: null,
      };

    default:
      return state;
  }
};

export default subscriptionReducer;
