import toastNotify from "@/utils/toast";
import api from "../api";

export const fetchSubscriptionStart = () => ({
  type: "FETCH_SUBSCRIPTION_START",
});
export const fetchSubscriptionSuccess = (data) => ({
  type: "FETCH_SUBSCRIPTION_SUCCESS",
  payload: data,
});
export const fetchSubscriptionFailure = (error) => ({
  type: "FETCH_SUBSCRIPTION_FAILURE",
  payload: error,
});

export const createSubscriptionRequestStart = () => ({
  type: "CREATE_SUBSCRIPTION_REQUEST_START",
});
export const createSubscriptionRequestSuccess = (data) => ({
  type: "CREATE_SUBSCRIPTION_REQUEST_SUCCESS",
  payload: data,
});
export const createSubscriptionRequestFailure = (error) => ({
  type: "CREATE_SUBSCRIPTION_REQUEST_FAILURE",
  payload: error,
});

export const fetchSubscription = () => async (dispatch) => {
  dispatch(fetchSubscriptionStart());
  try {
    const response = await api.get("/subscriptions/my-subscription");
    dispatch(fetchSubscriptionSuccess(response.data));

    return Promise.resolve();
  } catch (error) {
    dispatch(
      fetchSubscriptionFailure(error.response?.data?.message || error.message)
    );
    return Promise.reject(error);
  }
};

export const createSubscriptionRequest =
  (packageId, receipt) => async (dispatch) => {
    dispatch(createSubscriptionRequestStart());
    try {
      const formData = new FormData();
      formData.append("package_id", packageId);
      formData.append("receipt", receipt);
      const response = await api.post("/subscription-requests", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(createSubscriptionRequestSuccess(response.data));
      toastNotify("تم إرسال طلب الاشتراك بنجاح", "success");
      localStorage.setItem("SUBSCRIPTION_UPDATED", Date.now().toString());
      return Promise.resolve(response.data);
    } catch (error) {
      dispatch(
        createSubscriptionRequestFailure(
          error.response?.data?.message || error.message
        )
      );
      toastNotify("حدث خطأ أثناء إرسال طلب الاشتراك, حاول مجدداً", "error");
      return Promise.reject(error);
    }
  };

export const synchronizeSubscription = () => (dispatch) => {
  window.addEventListener("storage", (event) => {
    if (event.key === "SUBSCRIPTION_UPDATED") {
      dispatch(fetchSubscription());
    }
  });
};
