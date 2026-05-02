const initialState = {
  advertisements: {
    LAND: [],
    HOUSE: [],
    CAR: [],
    MARINE: [],
    MOTORCYCLE: [],
  },
  featured_advertisements: [],
  popularQuestions: {},
  countPerCategory: {},
  countPerCity: {},
  loading: false,
  error: null,
};

const homePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_HOME_PAGE_START":
      return { ...state, loading: true, error: null };

    case "FETCH_HOME_PAGE_SUCCESS":
      return {
        ...state,
        loading: false,
        advertisements: action.payload.advertisements[0],
        featured_advertisements: action.payload.featured_advertisements || [],
        popularQuestions: action.payload.popular_questions,
        countPerCategory: action.payload.advertisement_count_per_category,
        countPerCity: action.payload.advertisement_count_per_city,
      };

    case "FETCH_HOME_PAGE_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default homePageReducer;
