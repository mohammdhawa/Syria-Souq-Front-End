import api from "../api";
import { AUTH_TYPES } from "../authTypes";
import { fetchFavorites } from "./favoritesActions";

// Action Creators
// Login actions
const loginStart = () => ({ type: AUTH_TYPES.LOGIN_START });
const loginSuccess = () => ({ type: AUTH_TYPES.LOGIN_SUCCESS });
const loginFailure = (error) => ({
  type: AUTH_TYPES.LOGIN_FAILURE,
  payload: error,
});

// Register actions
const registerStart = () => ({ type: AUTH_TYPES.REGISTER_START });
const registerSuccess = (user) => ({
  type: AUTH_TYPES.REGISTER_SUCCESS,
  payload: user,
});
const registerFailure = (error) => ({
  type: AUTH_TYPES.REGISTER_FAILURE,
  payload: error,
});

// Verify account actions
const verifyAccountStart = () => ({ type: AUTH_TYPES.VERIFY_ACCOUNT_START });
const verifyAccountSuccess = () => ({
  type: AUTH_TYPES.VERIFY_ACCOUNT_SUCCESS,
});
const verifyAccountFailure = (error) => ({
  type: AUTH_TYPES.VERIFY_ACCOUNT_FAILURE,
  payload: error,
});

// Resend OTP actions
const resendOtpStart = () => ({ type: AUTH_TYPES.RESEND_OTP_START });
const resendOtpSuccess = () => ({ type: AUTH_TYPES.RESEND_OTP_SUCCESS });
const resendOtpFailure = (error) => ({
  type: AUTH_TYPES.RESEND_OTP_FAILURE,
  payload: error,
});

// Profile actions
const fetchProfileStart = () => ({ type: AUTH_TYPES.FETCH_PROFILE_START });
const fetchProfileSuccess = (data) => ({
  type: AUTH_TYPES.FETCH_PROFILE_SUCCESS,
  payload: data,
});
const fetchProfileFailure = (error) => ({
  type: AUTH_TYPES.FETCH_PROFILE_FAILURE,
  payload: error,
});

// Authentication check actions
const checkAuthStart = () => ({ type: AUTH_TYPES.CHECK_AUTH_START });
const checkAuthEnd = () => ({ type: AUTH_TYPES.CHECK_AUTH_END });
const setAuthChecked = () => ({ type: AUTH_TYPES.SET_AUTH_CHECKED });

// Reset actions
export const resetLoginErrors = () => ({ type: AUTH_TYPES.RESET_LOGIN_ERRORS });
export const resetRegisterErrors = () => ({
  type: AUTH_TYPES.RESET_REGISTER_ERRORS,
});
export const resetAuthErrors = () => ({ type: AUTH_TYPES.RESET_AUTH_ERRORS });
export const clearOtpErrors = () => ({ type: AUTH_TYPES.CLEAR_OTP_ERRORS });

const updateProfileStart = () => ({ type: AUTH_TYPES.UPDATE_PROFILE_START });
const updateProfileSuccess = (user) => ({
  type: AUTH_TYPES.UPDATE_PROFILE_SUCCESS,
  payload: user,
});
const updateProfileFailure = (error) => ({
  type: AUTH_TYPES.UPDATE_PROFILE_FAILURE,
  payload: error,
});

// Action Creators for Change Password
const changePasswordStart = () => ({ type: AUTH_TYPES.CHANGE_PASSWORD_START });
const changePasswordSuccess = () => ({
  type: AUTH_TYPES.CHANGE_PASSWORD_SUCCESS,
});
const changePasswordFailure = (error) => ({
  type: AUTH_TYPES.CHANGE_PASSWORD_FAILURE,
  payload: error,
});

// Action Creators for Delete Account
const deleteAccountStart = () => ({ type: AUTH_TYPES.DELETE_ACCOUNT_START });
const deleteAccountSuccess = () => ({
  type: AUTH_TYPES.DELETE_ACCOUNT_SUCCESS,
});
const deleteAccountFailure = (error) => ({
  type: AUTH_TYPES.DELETE_ACCOUNT_FAILURE,
  payload: error,
});
export const resetChangePassword = () => ({
  type: AUTH_TYPES.RESET_CHANGE_PASSWORD,
});
export const resetDeleteAccount = () => ({
  type: AUTH_TYPES.RESET_DELETE_ACCOUNT,
});
// Thunks
export const fetchProfile = () => async (dispatch) => {
  console.log('🔍 Redux: fetchProfile starting...');
  dispatch(fetchProfileStart());
  try {
    console.log('🔍 Redux: Making API call to /profile');
    const response = await api.get("/profile");
    console.log('🔍 Redux: Profile API response status:', response.status);
    console.log('🔍 Redux: Profile API response data:', response.data);
    dispatch(fetchProfileSuccess(response.data));
    console.log('✅ Redux: Profile fetched successfully');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Redux: fetchProfile error:', error);
    console.error('❌ Redux: Profile error response:', error.response);
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(fetchProfileFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};
export const updateProfile = (profileData) => async (dispatch) => {
  dispatch(updateProfileStart());
  try {
    const hasChanges = Object.keys(profileData).length > 0;

    if (!hasChanges) {
      return { success: true, message: "No changes detected" };
    }

    const formData = new FormData();
    if (profileData.name) formData.append("name", profileData.name);
    if (profileData.phone) formData.append("phone", profileData.phone);
    if (
      profileData.image &&
      profileData.image instanceof File &&
      !profileData?.deleteImage
    ) {
      formData.append("image", profileData.image);
    }
    if (profileData?.deleteImage) {
      formData.append("image", "");
    }

    const response = await api.post("/profile?_method=PUT", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data) {
      dispatch(updateProfileSuccess(response.data.data));
      localStorage.setItem("PROFILE_UPDATED", Date.now().toString());
      return {
        success: true,
        data: response.data,
        message: "تم تحديث الملف الشخصي بنجاح",
      };
    } else {
      dispatch(updateProfileFailure("فشل تحديث الملف الشخصي"));
      return { success: false, error: "فشل تحديث الملف الشخصي" };
    }
  } catch (error) {
    const errorPayload =
      error.response?.status === 429
        ? "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
        : error.response?.data?.errors
        ? error.response.data.errors
        : error.response?.data?.error || error.message;

    dispatch(updateProfileFailure(errorPayload));
    return { success: false, error: errorPayload };
  }
};

export const changePassword = (passwordData) => async (dispatch) => {
  dispatch(changePasswordStart());
  try {
    const response = await api.post("/change-password", passwordData);
    if (response.data.message) {
      dispatch(changePasswordSuccess());
      return {
        success: true,
        message: response.data.message || "تم تغيير كلمة المرور بنجاح",
      };
    } else {
      dispatch(changePasswordFailure("فشل تغيير كلمة المرور"));
      return { success: false, error: "فشل تغيير كلمة المرور" };
    }
  } catch (error) {
    const errorPayload =
      error.response?.status === 429
        ? "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
        : error.response?.data?.errors
        ? error.response.data.errors
        : error.response?.data?.error || error.message;

    dispatch(changePasswordFailure(errorPayload));
    return { success: false, error: errorPayload };
  }
};
export const deleteAccount = (passwordData, navigate) => async (dispatch) => {
  dispatch(deleteAccountStart());
  try {
    const response = await api.post("/delete-my-account", passwordData);
    if (response.data.message) {
      dispatch(deleteAccountSuccess());
      localStorage.setItem("app_logout", Date.now().toString());
      setTimeout(() => localStorage.removeItem("app_logout"), 50);
      dispatch({ type: AUTH_TYPES.RESET_FAVORITES });
      dispatch({ type: AUTH_TYPES.RESET_PROFILE });
      dispatch({ type: AUTH_TYPES.RESET_MY_ADVERTISEMENTS });
      dispatch({ type: AUTH_TYPES.RESET_SUBSCRIPTION });
      dispatch({ type: AUTH_TYPES.LOGOUT });

      if (navigate) {
        navigate("/", { replace: true });
      }

      return {
        success: true,
        message: response.data.message || "تم حذف الحساب بنجاح",
      };
    } else {
      dispatch(deleteAccountFailure("فشل حذف الحساب"));
      return { success: false, error: "فشل حذف الحساب" };
    }
  } catch (error) {
    const errorPayload =
      error.response?.status === 429
        ? "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
        : error.response?.data?.errors
        ? error.response.data.errors
        : error.response?.data?.error || error.message;

    dispatch(deleteAccountFailure(errorPayload));
    return { success: false, error: errorPayload };
  }
};
export const login = (login_input, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await api.post("/login", { login_input, password });
    if (response.data.message === "Login successful") {
      dispatch(loginSuccess());
      await dispatch(fetchProfile());
      await dispatch(fetchFavorites());
      localStorage.setItem("app_login", Date.now().toString());
      setTimeout(() => localStorage.removeItem("app_login"), 50);

      return { success: true };
    } else {
      dispatch(loginFailure("Login failed"));
      return { success: false, error: "Login failed" };
    }
  } catch (error) {
    const errorPayload =
      error.response?.status === 429
        ? "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
        : error.response?.data?.error ||
          (error.response?.data?.errors?.password &&
            error.response?.data?.errors?.password[0]) ||
          (error.response?.data?.errors?.login_input &&
            error.response?.data?.errors?.login_input[0]) ||
          error.message;

    if (errorPayload === "هذا الحساب غير مؤكد يرجى تأكيده") {
      try {
        await dispatch(resendOtp({ email: login_input }));
        dispatch(
          loginFailure({
            message: errorPayload,
            redirectToVerify: true,
            email: login_input,
          })
        );
        return { success: false, redirectToVerify: true, email: login_input };
      } catch (resendError) {
        const resendErrorPayload =
          resendError.response?.status === 429
            ? "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
            : resendError.response?.data?.error || resendError.message;
        dispatch(
          loginFailure({
            message: errorPayload,
            resendError: resendErrorPayload,
          })
        );
        return { success: false, error: resendErrorPayload };
      }
    }

    dispatch(loginFailure(errorPayload));
    return { success: false, error: errorPayload };
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch(registerStart());
  try {
    const response = await api.post("/register", userData);
    if (response.data.message === "OTP sent to your email") {
      dispatch(registerSuccess(response.data.user));
      return { success: true, data: response.data };
    } else {
      dispatch(registerFailure("Registration failed"));
      return { success: false, error: "Registration failed" };
    }
  } catch (error) {
    const errorPayload =
      error.response?.status === 429
        ? "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
        : error.response?.data?.errors
        ? error.response.data.errors
        : error.response?.data?.error || error.message;

    dispatch(registerFailure(errorPayload));
    return { success: false, error: errorPayload };
  }
};

export const verifyAccount = (verifyData) => async (dispatch) => {
  dispatch(verifyAccountStart());
  try {
    const response = await api.post("/verify-account", verifyData);
    if (response.data.message === "Email verified successfully") {
      dispatch(verifyAccountSuccess());
      dispatch(setAuthChecked());
      dispatch(loginSuccess());
      await dispatch(fetchProfile());
      await dispatch(fetchFavorites());
      localStorage.setItem("app_login", Date.now().toString());
      setTimeout(() => localStorage.removeItem("app_login"), 50);
      return { success: true, data: response.data };
    } else {
      dispatch(verifyAccountFailure("Verification failed"));
      return { success: false, error: "Verification failed" };
    }
  } catch (error) {
    const errorPayload =
      error.response?.status === 429
        ? "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
        : error.response?.data?.errors
        ? error.response.data.errors
        : error.response?.data?.error || error.message;

    dispatch(verifyAccountFailure(errorPayload));
    return { success: false, error: errorPayload };
  }
};
export const resendOtp = (emailData) => async (dispatch) => {
  dispatch(resendOtpStart());
  try {
    const response = await api.post("/resend-otp", emailData);
    if (response.data.message === ".تم ارسال رمز تحقق جديد") {
      dispatch(resendOtpSuccess());
      return { success: true, data: response.data };
    } else {
      dispatch(resendOtpFailure("Failed to resend OTP"));
      return { success: false, error: "Failed to resend OTP" };
    }
  } catch (error) {
    const errorPayload =
      error.response?.status === 429
        ? "لقد تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا"
        : error.response?.data?.errors
        ? error.response.data.errors
        : error.response?.data?.error || error.message;

    dispatch(resendOtpFailure(errorPayload));
    return { success: false, error: errorPayload };
  }
};

export const checkAuthStatus = () => async (dispatch) => {
  console.log('🔍 Redux: checkAuthStatus starting...');
  console.log('🔍 Redux: Checking localStorage for tokens...');
  
  // Check if we have tokens in localStorage first
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const user = localStorage.getItem('user');
  
  console.log('🔍 Redux: Access token exists:', !!accessToken);
  console.log('🔍 Redux: Refresh token exists:', !!refreshToken);
  console.log('🔍 Redux: User data exists:', !!user);
  
  dispatch(checkAuthStart());
  
  // If we have tokens, set authenticated state immediately
  if (accessToken && user) {
    console.log('✅ Redux: Tokens found in localStorage, setting authenticated state...');
    try {
      const userData = JSON.parse(user);
      dispatch(loginSuccess(userData));
      dispatch(setAuthChecked());
      dispatch(checkAuthEnd());
      
      // Still fetch profile to ensure data is up to date
      try {
        await dispatch(fetchProfile());
        await dispatch(fetchFavorites());
        console.log('✅ Redux: Profile and favorites fetched successfully');
      } catch (profileError) {
        console.warn('⚠️ Redux: Profile fetch failed, but user is still authenticated:', profileError);
      }
      
      return;
    } catch (parseError) {
      console.error('❌ Redux: Error parsing user data:', parseError);
      // Continue with API check
    }
  }
  
  try {
    console.log('🔍 Redux: Making API call to /check-auth');
    const response = await api.get("/check-auth");
    console.log('🔍 Redux: API response status:', response.status);
    console.log('🔍 Redux: API response data:', response.data);
    
    if (response.data.authenticated) {
      console.log('✅ Redux: User is authenticated via API, updating state...');
      dispatch(loginSuccess());
      await dispatch(fetchProfile());
      await dispatch(fetchFavorites());
      console.log('✅ Redux: Auth state updated successfully');
    } else {
      console.log('❌ Redux: User not authenticated, logging out...');
      localStorage.setItem("app_logout", Date.now().toString());
      setTimeout(() => localStorage.removeItem("app_logout"), 50);
      dispatch({ type: AUTH_TYPES.RESET_FAVORITES });
      dispatch({ type: AUTH_TYPES.RESET_PROFILE });
      dispatch({ type: AUTH_TYPES.RESET_MY_ADVERTISEMENTS });
      dispatch({ type: AUTH_TYPES.RESET_SUBSCRIPTION });
      dispatch({ type: AUTH_TYPES.LOGOUT });
    }
  } catch (error) {
    console.error('❌ Redux: checkAuthStatus error:', error);
    console.error('❌ Redux: Error response:', error.response);
    
    // If we have tokens but API fails, still consider user authenticated
    if (accessToken && user) {
      console.log('⚠️ Redux: API failed but tokens exist, keeping user authenticated');
      try {
        const userData = JSON.parse(user);
        dispatch(loginSuccess(userData));
        dispatch(setAuthChecked());
        dispatch(checkAuthEnd());
        return;
      } catch (parseError) {
        console.error('❌ Redux: Error parsing user data on API failure:', parseError);
      }
    }
    
    localStorage.setItem("app_logout", Date.now().toString());
    setTimeout(() => localStorage.removeItem("app_logout"), 50);
    dispatch({ type: AUTH_TYPES.RESET_FAVORITES });
    dispatch({ type: AUTH_TYPES.RESET_PROFILE });
    dispatch({ type: AUTH_TYPES.RESET_MY_ADVERTISEMENTS });
    dispatch({ type: AUTH_TYPES.RESET_SUBSCRIPTION });
    dispatch({ type: AUTH_TYPES.LOGOUT });
  } finally {
    console.log('🔍 Redux: checkAuthStatus completed');
    dispatch(setAuthChecked());
    dispatch(checkAuthEnd());
  }
};

export const logout = (navigate) => async (dispatch) => {
  try {
    await api.post("/logout");
    // Clear tokens and user data locally
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (e) {}
    localStorage.setItem("app_logout", Date.now().toString());
    setTimeout(() => localStorage.removeItem("app_logout"), 50);
    dispatch({ type: AUTH_TYPES.RESET_FAVORITES });
    dispatch({ type: AUTH_TYPES.RESET_PROFILE });
    dispatch({ type: AUTH_TYPES.RESET_MY_ADVERTISEMENTS });
    dispatch({ type: AUTH_TYPES.RESET_SUBSCRIPTION });
    dispatch({ type: AUTH_TYPES.LOGOUT });
    if (navigate) {
      navigate("/", { replace: true });
    }
  } catch (error) {
    // Ensure local cleanup even if server logout fails
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (e) {}
    localStorage.setItem("app_logout", Date.now().toString());
    setTimeout(() => localStorage.removeItem("app_logout"), 50);
    dispatch({ type: AUTH_TYPES.RESET_FAVORITES });
    dispatch({ type: AUTH_TYPES.RESET_PROFILE });
    dispatch({ type: AUTH_TYPES.RESET_MY_ADVERTISEMENTS });
    dispatch({ type: AUTH_TYPES.RESET_SUBSCRIPTION });
    dispatch({ type: AUTH_TYPES.LOGOUT });

    if (navigate) {
      navigate("/", { replace: true });
    }
  }
};

export const synchronizeProfile = () => (dispatch) => {
  window.addEventListener("storage", (event) => {
    if (event.key === "PROFILE_UPDATED") {
      dispatch(fetchProfile());
    }
  });
};
