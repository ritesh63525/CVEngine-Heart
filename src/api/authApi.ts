import {
  API_CONFIG,
} from './apiConfig';

import {
  ApiData,
  apiRequest,
} from './apiClient';

// ==========================================
// RESPONSE TYPES
// ==========================================

export type RegisterResponse =
  ApiData & {
    status: boolean;
    message: string;
    otp?: number | string;
    token: string;
  };

export type VerifyRegisterResponse =
  ApiData & {
    status: boolean;
    message: string;
  };

export type LoginResponse =
  ApiData & {
    status: boolean;
    message: string;
    access_token: string;
    refresh_token: string;
  };

export type LoginOtpSendResponse =
  ApiData & {
    status: boolean;
    message: string;
    otp?: number | string;
    token: string;
  };

export type LoginOtpVerifyResponse =
  ApiData & {
    status: boolean;
    message: string;
    access_token: string;
    refresh_token: string;
  };

export type ForgotPasswordResponse =
  ApiData & {
    status: boolean;
    message: string;
    otp?: number | string;
    token: string;
  };

export type VerifyOtpResponse =
  ApiData & {
    status: boolean;
    message: string;
    token: string;
  };

export type ResetPasswordResponse =
  ApiData & {
    status: boolean;
    message: string;
  };

export type RefreshTokenResponse =
  ApiData & {
    status: boolean;
    message: string;
    access_token: string;
  };

// ==========================================
// REGISTER
// ==========================================

export async function registerUser(
  fullName: string,
  age: number,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    API_CONFIG.ENDPOINTS.REGISTER,
    {
      method: 'POST',

      body: {
        'Full Name': fullName,
        age: String(age),
        phone: phoneNumber,
        password,

        confirmpassword:
          confirmPassword,
      },
    },
  );
}

// ==========================================
// VERIFY REGISTRATION OTP
// ==========================================

export async function verifyRegistration(
  token: string,
  otp: string,
): Promise<VerifyRegisterResponse> {
  return apiRequest<VerifyRegisterResponse>(
    API_CONFIG.ENDPOINTS
      .VERIFY_REGISTER,
    {
      method: 'POST',
      token,

      body: {
        otp,
      },
    },
  );
}

// ==========================================
// PASSWORD LOGIN
// ==========================================

export async function loginUser(
  phoneNumber: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    API_CONFIG.ENDPOINTS.LOGIN,
    {
      method: 'POST',

      body: {
        phone: phoneNumber,
        password,
      },
    },
  );
}

// ==========================================
// SEND LOGIN OTP
// ==========================================

export async function sendLoginOtp(
  phoneNumber: string,
): Promise<LoginOtpSendResponse> {
  return apiRequest<LoginOtpSendResponse>(
    API_CONFIG.ENDPOINTS
      .LOGIN_OTP_SEND,
    {
      method: 'POST',

      /*
       * OTP request karte waqt koi purana
       * Authorization token nahi bhejna.
       */
      body: {
        phone: phoneNumber,
      },
    },
  );
}

// ==========================================
// VERIFY LOGIN OTP
// ==========================================

export async function verifyLoginOtp(
  token: string,
  otp: string,
): Promise<LoginOtpVerifyResponse> {
  return apiRequest<LoginOtpVerifyResponse>(
    API_CONFIG.ENDPOINTS
      .LOGIN_OTP_VERIFY,
    {
      method: 'POST',

      /*
       * login_otp_send API se mila fresh
       * temporary token direct
       * Authorization header mein jayega.
       */
      token,

      body: {
        otp,
      },
    },
  );
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

export async function requestPasswordReset(
  phoneNumber: string,
): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>(
    API_CONFIG.ENDPOINTS
      .FORGOT_PASSWORD,
    {
      method: 'POST',

      body: {
        phone: phoneNumber,
      },
    },
  );
}

// ==========================================
// VERIFY PASSWORD RESET OTP
// ==========================================

export async function verifyResetOtp(
  token: string,
  otp: string,
): Promise<VerifyOtpResponse> {
  return apiRequest<VerifyOtpResponse>(
    API_CONFIG.ENDPOINTS.VERIFY_OTP,
    {
      method: 'POST',
      token,

      body: {
        otp,
      },
    },
  );
}

// ==========================================
// SET NEW PASSWORD
// ==========================================

export async function changePassword(
  token: string,
  newPassword: string,
  confirmPassword: string,
): Promise<ResetPasswordResponse> {
  return apiRequest<ResetPasswordResponse>(
    API_CONFIG.ENDPOINTS
      .RESET_PASSWORD,
    {
      method: 'PUT',
      token,

      body: {
        newpassword:
          newPassword,

        confirmpassword:
          confirmPassword,
      },
    },
  );
}

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================

export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  return apiRequest<RefreshTokenResponse>(
    API_CONFIG.ENDPOINTS
      .REFRESH_TOKEN,
    {
      method: 'POST',

      body: {
        refresh_token:
          refreshToken,
      },
    },
  );
}