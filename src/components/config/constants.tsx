export const API_BASE_URL = 'http://127.0.0.1:8000';


export const API_ENDPOINTS = {
  LOGIN: 'api/login/',
  SIGNUP: 'api/signup/',
  FORGOT_PASSWORD:'api/forgot-password/',
  FORGOT_PASSWORD_VERIFY_OTP:'api/verify-otp/',
  SATELLITE_REQUEST: 'api/request-satellite-image/',
  GET_USER: 'api/get-user/',  
  UPDATE_PROFILE: 'api/update-profile/',
  CHANGE_PASSWORD: 'api/change-password/',
  USER_FEEDBACK: 'api/submit-feedback/',
  SUBSCRIPTION_STATUS: 'api/payment-history/',
  PAYMENT_STATUS: 'api/payment-status/',
  CREATE_ADVANCE_PAYMENT: 'api/create-advance-payment/',
  VERIFY_ADVANCE_PAYMENT: 'api/verify-advance-payment/',
  CREATE_FINAL_PAYMENT: 'api/create-final-payment/',
  VERIFY_FINAL_PAYMENT: 'api/verify-final-payment/',
  GET_SAT_IMAGES:'api/satellite-images/'



};

export const GOOGLE_MAP_API_KEY =import.meta.env.VITE_GOOGLE_MAP_API_KEY;
