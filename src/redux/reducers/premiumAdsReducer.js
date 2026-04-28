import { PREMIUM_ADS_TYPES } from "../actions/premiumAdsActions";

const initialState = {
    loading: false,
    pricePerDay: null,
    currency: "USD",
    premiumAds: [],
    pagination: {},
    error: null,
    purchaseLoading: false,
};

const premiumAdsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PREMIUM_ADS_TYPES.GET_PRICE_REQUEST:
            return { ...state, loading: true, error: null };
        case PREMIUM_ADS_TYPES.GET_PRICE_SUCCESS:
            return {
                ...state,
                loading: false,
                pricePerDay: action.payload.price_per_day,
                currency: action.payload.currency,
            };
        case PREMIUM_ADS_TYPES.GET_PRICE_FAIL:
            return { ...state, loading: false, error: action.payload };

        case PREMIUM_ADS_TYPES.PURCHASE_PREMIUM_REQUEST:
            return { ...state, purchaseLoading: true, error: null };
        case PREMIUM_ADS_TYPES.PURCHASE_PREMIUM_SUCCESS:
            return { ...state, purchaseLoading: false };
        case PREMIUM_ADS_TYPES.PURCHASE_PREMIUM_FAIL:
            return { ...state, purchaseLoading: false, error: action.payload };

        case PREMIUM_ADS_TYPES.GET_MY_PREMIUM_ADS_REQUEST:
            return { ...state, loading: true, error: null };
        case PREMIUM_ADS_TYPES.GET_MY_PREMIUM_ADS_SUCCESS:
            return {
                ...state,
                loading: false,
                premiumAds: action.payload.premium_ads,
                pagination: {
                    current_page: action.payload.current_page,
                    per_page: action.payload.per_page,
                    total: action.payload.total,
                    total_pages: action.payload.total_pages,
                },
            };
        case PREMIUM_ADS_TYPES.GET_MY_PREMIUM_ADS_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default premiumAdsReducer;
