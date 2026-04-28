import { AUTH_TYPES } from "../authTypes";

const initialState = {
  advertisements: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    next_page: null,
  },
  stats: {
    total_count: 0,
    pending_count: 0,
    accepted_active_count: 0,
    accepted_inactive_count: 0,
    rejected_count: 0,
    most_used_category_id: 0,
  },
  loading: false,
  deletingLoading: false,
  changingStatusLoading: false,
  updatingLoading: false,
  error: null,

  singleAdvertisement: null,
  singleAdvertisementLoading: false,
  singleAdvertisementError: null,
};

const myAdvertisementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_MY_ADVERTISEMENTS_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_MY_ADVERTISEMENTS_SUCCESS":
      return {
        ...state,
        loading: false,
        advertisements: action.payload.data.advertisements,
        pagination: {
          current_page: action.payload.data.current_page,
          per_page: action.payload.data.per_page,
          total: action.payload.data.total,
          total_pages: action.payload.data.total_pages,
          next_page: action.payload.data.next_page,
        },
        stats: {
          total_count: action.payload.stats.total_count,
          pending_count: action.payload.stats.pending_count,
          accepted_active_count: action.payload.stats.accepted_active_count,
          accepted_inactive_count: action.payload.stats.accepted_inactive_count,
          rejected_count: action.payload.stats.rejected_count,
          most_used_category_id: action.payload.stats.most_used_category_id,
        },
      };

    case "FETCH_MY_ADVERTISEMENTS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "DELETE_ADVERTISEMENT_START":
      return {
        ...state,
        deletingLoading: true,
        error: null,
      };

    case "DELETE_ADVERTISEMENT_SUCCESS":
      return {
        ...state,
        deletingLoading: false,
        advertisements: state.advertisements.filter(
          (ad) => ad.id !== action.payload
        ),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
          total_pages: Math.ceil(
            (state.pagination.total - 1) / state.pagination.per_page
          ),
        },
      };

    case "DELETE_ADVERTISEMENT_FAILURE":
      return {
        ...state,
        deletingLoading: false,
        error: action.payload.error,
      };

    case "CHANGE_AD_STATUS_START":
      return {
        ...state,
        changingStatusLoading: true,
        error: null,
      };

    case "CHANGE_AD_STATUS_SUCCESS":
      return {
        ...state,
        changingStatusLoading: false,
        advertisements: state.advertisements.map((ad) =>
          ad.id === action.payload.id
            ? {
                ...ad,
                ads_status:
                  action.payload.status === "active"
                    ? "pending"
                    : ad.ads_status,

                active_status: "inactive",
              }
            : ad
        ),
      };

    case "CHANGE_AD_STATUS_FAILURE":
      return {
        ...state,
        changingStatusLoading: false,
        error: action.payload,
      };

    case "UPDATE_ADVERTISEMENT_START":
      return {
        ...state,
        updatingLoading: true,
        error: null,
      };

    case "UPDATE_ADVERTISEMENT_SUCCESS":
      return {
        ...state,
        updatingLoading: false,
        advertisements: state.advertisements.map((ad) =>
          ad.id === action.payload.id ? { ...ad, ...action.payload.data } : ad
        ),
        // singleAdvertisement:
        //   state.singleAdvertisement &&
        //   state.singleAdvertisement.id === action.payload.id
        //     ? { ...state.singleAdvertisement, ...action.payload }
        //     : state.singleAdvertisement,
      };

    case "UPDATE_ADVERTISEMENT_FAILURE":
      return {
        ...state,
        updatingLoading: false,
        error: action.payload,
      };

    case "FETCH_SINGLE_ADVERTISEMENT_START":
      return {
        ...state,
        singleAdvertisementLoading: true,
        singleAdvertisementError: null,
      };

    case "FETCH_SINGLE_ADVERTISEMENT_SUCCESS":
      return {
        ...state,
        singleAdvertisementLoading: false,
        singleAdvertisement: action.payload.data,
      };

    case "FETCH_SINGLE_ADVERTISEMENT_FAILURE":
      return {
        ...state,
        singleAdvertisementLoading: false,
        singleAdvertisementError: action.payload,
      };

    case "RESET_SINGLE_ADVERTISEMENT":
      return {
        ...state,
        singleAdvertisement: null,
        singleAdvertisementLoading: false,
        singleAdvertisementError: null,
      };

    case AUTH_TYPES.RESET_MY_ADVERTISEMENTS:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default myAdvertisementsReducer;
