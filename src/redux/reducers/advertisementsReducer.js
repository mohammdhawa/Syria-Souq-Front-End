const initialState = {
  advertisements: [],
  pagination: {
    current_page: null,
    per_page: null,
    total: 0,
    total_pages: 0,
    next_page: null,
  },
  advertisementLoadding: false,
  error: null,
};

const advertisementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ADVERTISEMENTS_START":
      return { ...state, advertisementLoading: true, error: null };

    case "FETCH_ADVERTISEMENTS_SUCCESS":
      return {
        ...state,
        advertisementLoading: false,
        advertisements: action.payload.advertisements,
        pagination: {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          total_pages: action.payload.total_pages,
          next_page: action.payload.next_page,
        },
      };

    case "FETCH_ADVERTISEMENTS_FAILURE":
      return {
        ...state,
        advertisements: [],
        pagination: {
          current_page: null,
          per_page: null,
          total: 0,
          total_pages: 0,
          next_page: null,
        },
        advertisementLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default advertisementsReducer;
