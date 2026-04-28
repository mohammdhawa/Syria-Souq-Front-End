import { AUTH_TYPES } from "../authTypes";

const initialState = {
  isAuthenticated: false,
  user: null,
  subscription: null,
  loading: false,
  error: null,
  profileLoading: false,
  profileUpdateLoading: false,
  profileUpdateError: null,
  profileUpdateSuccess: false,
  profileError: null,
  authChecked: false,
  registering: false,
  registerError: null,
  registeredUser: null,
  verifyingAccount: false,
  verifyError: null,
  resendingOtp: false,
  resendOtpError: null,
  redirectToVerify: false,
  redirectEmail: null,
  checkingAuth: false,
  changingPassword: false,
  changePasswordError: null,
  changePasswordSuccess: false,
  deletingAccount: false,
  deleteAccountError: null,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login cases
    case AUTH_TYPES.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
      };
    case AUTH_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message || action.payload,
        redirectToVerify: action.payload.redirectToVerify || false,
        redirectEmail: action.payload.email || null,
      };
    case AUTH_TYPES.LOGOUT:
      return {
        ...initialState,
        authChecked: true,
      };

    // Profile cases
    case AUTH_TYPES.FETCH_PROFILE_START:
      return {
        ...state,
        profileLoading: true,
        profileError: null,
      };
    case AUTH_TYPES.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        profileLoading: false,
        user: action.payload.user,
        subscription: action.payload.subscription,
      };
    case AUTH_TYPES.FETCH_PROFILE_FAILURE:
      return {
        ...state,
        profileLoading: false,
        profileError: action.payload,
      };

    // Registration cases
    case AUTH_TYPES.REGISTER_START:
      return {
        ...state,
        registering: true,
        registerError: null,
      };
    case AUTH_TYPES.REGISTER_SUCCESS:
      return {
        ...state,
        registering: false,
        registeredUser: action.payload,
      };
    case AUTH_TYPES.REGISTER_FAILURE:
      return {
        ...state,
        registering: false,
        registerError: action.payload,
      };

    // Verification cases
    case AUTH_TYPES.VERIFY_ACCOUNT_START:
      return {
        ...state,
        verifyingAccount: true,
        verifyError: null,
      };
    case AUTH_TYPES.VERIFY_ACCOUNT_SUCCESS:
      return {
        ...state,
        verifyingAccount: false,
        isAuthenticated: true,
      };
    case AUTH_TYPES.VERIFY_ACCOUNT_FAILURE:
      return {
        ...state,
        verifyingAccount: false,
        verifyError: action.payload,
      };

    // OTP cases
    case AUTH_TYPES.RESEND_OTP_START:
      return {
        ...state,
        resendingOtp: true,
        resendOtpError: null,
      };
    case AUTH_TYPES.RESEND_OTP_SUCCESS:
      return {
        ...state,
        resendingOtp: false,
      };
    case AUTH_TYPES.RESEND_OTP_FAILURE:
      return {
        ...state,
        resendingOtp: false,
        resendOtpError: action.payload,
      };
    case AUTH_TYPES.CLEAR_OTP_ERRORS:
      return {
        ...state,
        verifyError: null,
        resendOtpError: null,
      };

    // Auth status cases
    case AUTH_TYPES.SET_AUTH_CHECKED:
      return {
        ...state,
        authChecked: true,
      };
    case AUTH_TYPES.CHECK_AUTH_START:
      return {
        ...state,
        checkingAuth: true,
      };
    case AUTH_TYPES.CHECK_AUTH_END:
      return {
        ...state,
        checkingAuth: false,
      };

    case AUTH_TYPES.RESET_LOGIN_ERRORS:
      return {
        ...state,
        error: null,
        redirectToVerify: false,
        redirectEmail: null,
      };
    case AUTH_TYPES.RESET_REGISTER_ERRORS:
      return {
        ...state,
        registerError: null,
      };

    case AUTH_TYPES.UPDATE_PROFILE_START:
      return {
        ...state,
        profileUpdateLoading: true,
        profileUpdateError: null,
        profileUpdateSuccess: false,
      };
    case AUTH_TYPES.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        profileUpdateLoading: false,
        user: action.payload,
        profileUpdateSuccess: true,
        profileUpdateError: null,
      };
    case AUTH_TYPES.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        profileUpdateLoading: false,
        profileUpdateError: action.payload,
        profileUpdateSuccess: false,
      };

    case AUTH_TYPES.RESET_AUTH_ERRORS:
      return {
        ...state,
        error: null,
        registerError: null,
        verifyError: null,
        resendOtpError: null,
        redirectToVerify: false,
        redirectEmail: null,
      };

    case AUTH_TYPES.RESET_PROFILE:
      return {
        ...state,
        user: null,
        subscription: null,
        loading: false,
        error: null,
      };
    case AUTH_TYPES.CHANGE_PASSWORD_START:
      return {
        ...state,
        changingPassword: true,
        changePasswordError: null,
        changePasswordSuccess: false,
      };
    case AUTH_TYPES.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changingPassword: false,
        changePasswordSuccess: true,
      };
    case AUTH_TYPES.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changingPassword: false,
        changePasswordError: action.payload,
        changePasswordSuccess: false,
      };
    case AUTH_TYPES.RESET_CHANGE_PASSWORD:
      return {
        ...state,
        changingPassword: false,
        changePasswordError: null,
        changePasswordSuccess: false,
      };

    // Delete Account cases
    case AUTH_TYPES.DELETE_ACCOUNT_START:
      return {
        ...state,
        deletingAccount: true,
        deleteAccountError: null,
      };
    case AUTH_TYPES.DELETE_ACCOUNT_SUCCESS:
      return {
        ...state,
        deletingAccount: false,
      };
    case AUTH_TYPES.DELETE_ACCOUNT_FAILURE:
      return {
        ...state,
        deletingAccount: false,
        deleteAccountError: action.payload,
      };
    case AUTH_TYPES.RESET_DELETE_ACCOUNT:
      return {
        ...state,
        deletingAccount: false,
        deleteAccountError: null,
      };
    default:
      return state;
  }
};

export default authReducer;
