export const API_CONFIG = {
  BASE_URL:
    'http://192.168.29.150:8000',

  TIMEOUT_MS: 15000,

  ENDPOINTS: {
    REGISTER:
      '/register',

    VERIFY_REGISTER:
      '/verify_register',

    LOGIN:
      '/login',

    LOGIN_OTP_SEND:
      '/login_otp_send',

    LOGIN_OTP_VERIFY:
      '/login_otp_verify',

    FORGOT_PASSWORD:
      '/forgot',

    VERIFY_OTP:
      '/otp',

    RESET_PASSWORD:
      '/otp',

    REFRESH_TOKEN:
      '/refresh',
  },
} as const;