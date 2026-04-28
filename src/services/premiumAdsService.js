import api from "@/redux/api";

const premiumAdsService = {
  getPricePerDay: async () => {
    const response = await api.get("/premium-ads/price-per-day");
    return response.data;
  },

  purchasePremiumAd: async (data) => {
    const response = await api.post("/premium-ads/purchase", data);
    return response.data;
  },

  getMyPremiumAds: async (params) => {
    const response = await api.get("/my-premium-ads", { params });
    return response.data;
  },

  getMyPremiumAdById: async (id) => {
    const response = await api.get(`/my-premium-ads/${id}`);
    return response.data;
  },
};

export default premiumAdsService;
