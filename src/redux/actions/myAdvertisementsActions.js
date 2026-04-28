import toastNotify from "@/utils/toast";
import api from "../api";
import { replace } from "react-router-dom";

export const fetchMyAdvertisementsStart = () => ({
  type: "FETCH_MY_ADVERTISEMENTS_START",
});
export const fetchMyAdvertisementsSuccess = (data) => ({
  type: "FETCH_MY_ADVERTISEMENTS_SUCCESS",
  payload: data,
});
export const fetchMyAdvertisementsFailure = (error) => ({
  type: "FETCH_MY_ADVERTISEMENTS_FAILURE",
  payload: error,
});

export const deleteAdvertisementStart = () => ({
  type: "DELETE_ADVERTISEMENT_START",
});
export const deleteAdvertisementSuccess = (id) => ({
  type: "DELETE_ADVERTISEMENT_SUCCESS",
  payload: id,
});
export const deleteAdvertisementFailure = (error) => ({
  type: "DELETE_ADVERTISEMENT_FAILURE",
  payload: error,
});

export const changeAdStatusStart = () => ({
  type: "CHANGE_AD_STATUS_START",
});
export const changeAdStatusSuccess = (id, status) => ({
  type: "CHANGE_AD_STATUS_SUCCESS",
  payload: { id, status },
});
export const changeAdStatusFailure = (error) => ({
  type: "CHANGE_AD_STATUS_FAILURE",
  payload: error,
});

export const fetchSingleAdvertisementStart = () => ({
  type: "FETCH_SINGLE_ADVERTISEMENT_START",
});

export const fetchSingleAdvertisementSuccess = (data) => ({
  type: "FETCH_SINGLE_ADVERTISEMENT_SUCCESS",
  payload: data,
});

export const fetchSingleAdvertisementFailure = (error) => ({
  type: "FETCH_SINGLE_ADVERTISEMENT_FAILURE",
  payload: error,
});

export const resetSingleAdvertisement = () => ({
  type: "RESET_SINGLE_ADVERTISEMENT",
});

export const updateAdvertisementStart = () => ({
  type: "UPDATE_ADVERTISEMENT_START",
});

export const updateAdvertisementSuccess = (data) => ({
  type: "UPDATE_ADVERTISEMENT_SUCCESS",
  payload: data,
});

export const updateAdvertisementFailure = (error) => ({
  type: "UPDATE_ADVERTISEMENT_FAILURE",
  payload: error,
});
export const fetchMyAdvertisements =
  (
    page = 1,
    perPage = 5,
    activeStatus = null,
    adsStatus = null,
    category = null,
    adType = null
  ) =>
  async (dispatch) => {
    dispatch(fetchMyAdvertisementsStart());
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("per_page", perPage);
    if (activeStatus) params.append("active_status", activeStatus);
    if (adsStatus) params.append("ads_status", adsStatus);
    if (category) params.append("category_id", category);
    if (adType) params.append("type", adType);

    try {
      const response = await api.get(
        `/advertisements/my-ads?${params.toString()}`
      );
      dispatch(fetchMyAdvertisementsSuccess(response.data));
      return Promise.resolve();
    } catch (error) {
      dispatch(
        fetchMyAdvertisementsFailure(
          error.response?.data?.message || error.message
        )
      );
      return Promise.reject(error);
    }
  };

export const deleteAdvertisement = (id) => async (dispatch) => {
  dispatch(deleteAdvertisementStart());
  try {
    await api.delete(`/advertisements/${id}`);
    dispatch(deleteAdvertisementSuccess(id));
    toastNotify("تم حذف الإعلان بنجاح", "success");
    notifyAdvertisementChange();
    return Promise.resolve();
  } catch (error) {
    dispatch(
      deleteAdvertisementFailure(error.response?.data?.message || error.message)
    );
    toastNotify(
      "حدث خطأ أثناء حذف الإعلان" ||
        error.response?.data?.message ||
        error.message,
      "error"
    );

    return Promise.reject(error);
  }
};

export const changeAdStatus = (id, status) => async (dispatch) => {
  dispatch(changeAdStatusStart());
  try {
    const endpoint =
      status === "active"
        ? `/advertisements/activate/${id}`
        : `/advertisements/deactivate/${id}`;

    await api.put(endpoint);
    dispatch(changeAdStatusSuccess(id, status));
    if (status === "active") {
      toastNotify("تم إرسال طلب التنشيط بنجاح", "success");
    } else {
      toastNotify(`تم إلغاء تفعيل الإعلان بنجاح`, "success");
    }
    notifyAdvertisementChange();
    return Promise.resolve();
  } catch (error) {
    dispatch(
      changeAdStatusFailure(error.response?.data?.message || error.message)
    );
    toastNotify(
      "حدث خطأ أثناء تغيير حالة الإعلان" ||
        error.response?.data?.message ||
        error.message,
      "error"
    );

    return Promise.reject(error);
  }
};

export const fetchSingleAdvertisement =
  (id, slug, navigate) => async (dispatch) => {
    dispatch(fetchSingleAdvertisementStart());
    try {
      const response = await api.get(`/advertisements/my-ads/${id}/${slug}`);
      dispatch(fetchSingleAdvertisementSuccess(response.data));
      return Promise.resolve(response.data);
    } catch (error) {
      dispatch(
        fetchSingleAdvertisementFailure(
          error.response?.data?.message || error.message
        )
      );
      if (error.response && error.response.status === 404 && navigate) {
        navigate("/404");
      } else {
        toastNotify(
          "حدث خطأ أثناء تحميل الإعلان" ||
            error.response?.data?.message ||
            error.message,
          "error"
        );
      }

      return Promise.reject(error);
    }
  };

export const updateAdvertisement =
  (id, adData, navigate) => async (dispatch) => {
    dispatch(updateAdvertisementStart());

    try {
      let response = await api.post(
        `/advertisements/${id}?_method=PUT`,
        adData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const advertisement = response.data.advertisement;
      dispatch(updateAdvertisementSuccess(advertisement));
      toastNotify("تم تحديث الإعلان بنجاح", "success");

      if (navigate) {
        navigate(`/dashboard/my-advertisements`, {
          replace: true,
        });
      }

      return Promise.resolve(response.data);
    } catch (error) {
    
      dispatch(
        updateAdvertisementFailure(
          error.response?.data?.message || error.message
        )
      );

      toastNotify(
        error.response?.data?.message || "حدث خطأ أثناء تحديث الإعلان",
        "error"
      );

      return Promise.reject(error);
    }
  };
export const synchronizeMyAdvertisements = () => (dispatch) => {
  window.addEventListener("storage", (event) => {
    if (event.key === "MY_ADVERTISEMENTS_UPDATED") {
      dispatch(fetchMyAdvertisements());
    }
  });
};

export const notifyAdvertisementChange = () => {
  localStorage.setItem("MY_ADVERTISEMENTS_UPDATED", Date.now().toString());
};
