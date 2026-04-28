import axios from "axios";
import store from "./store";
import { AUTH_TYPES } from "./authTypes";
import { fetchProfile } from "./actions/authActions";
import authService from "../services/authService";

const api = axios.create({
  baseURL: "https://syr-souq.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

window.addEventListener("storage", (event) => {
  if (event.key === "app_logout" && event.newValue) {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (e) { }
    store.dispatch({ type: AUTH_TYPES.LOGOUT });
  }
  if (event.key === "app_login" && event.newValue) {
    store.dispatch({ type: AUTH_TYPES.LOGIN_SUCCESS });
    store.dispatch(fetchProfile());
  }
});

// Attach access token to every request if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // no-op
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Toggle state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if ((error.response?.status === 401 || error.response?.status === 419) && !originalRequest._retry) {

      // We attempt to refresh unconditionally using cookies.
      // If the cookie is missing/invalid, the refresh call itself will fail.

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authService.refreshToken();
        processQueue(null, newToken);
        isRefreshing = false;

        // Update header for the original request
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        // Update default header for future requests
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        // If refresh fails, logout
        store.dispatch({ type: AUTH_TYPES.LOGOUT });
        return Promise.reject(err);
      }
    }

    // if (error.response?.status === 429) {
    //   window.location.href = "/404";
    // }

    return Promise.reject(error);
  }
);

export default api;
