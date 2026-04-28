import premiumAdsService from "@/services/premiumAdsService";
import { toast } from "react-toastify";

export const PREMIUM_ADS_TYPES = {
    GET_PRICE_REQUEST: "GET_PRICE_REQUEST",
    GET_PRICE_SUCCESS: "GET_PRICE_SUCCESS",
    GET_PRICE_FAIL: "GET_PRICE_FAIL",

    PURCHASE_PREMIUM_REQUEST: "PURCHASE_PREMIUM_REQUEST",
    PURCHASE_PREMIUM_SUCCESS: "PURCHASE_PREMIUM_SUCCESS",
    PURCHASE_PREMIUM_FAIL: "PURCHASE_PREMIUM_FAIL",

    GET_MY_PREMIUM_ADS_REQUEST: "GET_MY_PREMIUM_ADS_REQUEST",
    GET_MY_PREMIUM_ADS_SUCCESS: "GET_MY_PREMIUM_ADS_SUCCESS",
    GET_MY_PREMIUM_ADS_FAIL: "GET_MY_PREMIUM_ADS_FAIL",
};

export const getPricePerDay = () => async (dispatch) => {
    try {
        dispatch({ type: PREMIUM_ADS_TYPES.GET_PRICE_REQUEST });
        const data = await premiumAdsService.getPricePerDay();
        dispatch({
            type: PREMIUM_ADS_TYPES.GET_PRICE_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: PREMIUM_ADS_TYPES.GET_PRICE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const purchasePremiumAd = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: PREMIUM_ADS_TYPES.PURCHASE_PREMIUM_REQUEST });
        const response = await premiumAdsService.purchasePremiumAd(data);
        dispatch({
            type: PREMIUM_ADS_TYPES.PURCHASE_PREMIUM_SUCCESS,
            payload: response.data,
        });
        toast.success(response.message || "Premium ad purchased successfully");
        if (navigate) navigate("/dashboard/my-premium-ads");
        return response;
    } catch (error) {
        dispatch({
            type: PREMIUM_ADS_TYPES.PURCHASE_PREMIUM_FAIL,
            payload: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message || "Failed to purchase premium ad");
        throw error;
    }
};

export const getMyPremiumAds = (page = 1, params = {}) => async (dispatch) => {
    try {
        dispatch({ type: PREMIUM_ADS_TYPES.GET_MY_PREMIUM_ADS_REQUEST });
        const response = await premiumAdsService.getMyPremiumAds({ page, ...params });
        dispatch({
            type: PREMIUM_ADS_TYPES.GET_MY_PREMIUM_ADS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: PREMIUM_ADS_TYPES.GET_MY_PREMIUM_ADS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};
