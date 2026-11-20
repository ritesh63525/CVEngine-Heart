import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from
  '@react-native-async-storage/async-storage';

import {
  changePassword,
  loginUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset as requestPasswordResetApi,
  sendLoginOtp,
  verifyLoginOtp,
  verifyRegistration,
  verifyResetOtp,
} from '../api/authApi';

// ==========================================
// TYPES
// ==========================================

export type AppUser = {
  firebaseUid: string;
  fullName: string;
  age: number;
  phoneNumber: string;
};

type PendingRegistration = {
  fullName: string;
  age: number;
  phoneNumber: string;
};

export type AuthActionResult = {
  message: string;
  otp?: string;
};

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  authenticated: boolean;
  onboardingCompleted: boolean;
  accessToken: string | null;

  completeOnboarding:
    () => Promise<void>;

  registerAccount: (
    fullName: string,
    age: number,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
  ) => Promise<AuthActionResult>;

  verifyRegistrationOtp: (
    otp: string,
  ) => Promise<string>;

  loginWithPassword: (
    phoneNumber: string,
    password: string,
  ) => Promise<string>;

  requestLoginOtp: (
    phoneNumber: string,
  ) => Promise<AuthActionResult>;

  loginWithOtp: (
    otp: string,
  ) => Promise<string>;

  requestPasswordReset: (
    phoneNumber: string,
  ) => Promise<AuthActionResult>;

  verifyPasswordResetOtp: (
    otp: string,
  ) => Promise<string>;

  resetPassword: (
    newPassword: string,
    confirmPassword: string,
  ) => Promise<string>;

  logout: () => Promise<void>;
};

// ==========================================
// STORAGE KEYS
// ==========================================

const ACTIVE_SESSION_KEY =
  '@cvengine/active-session';

const USER_PROFILE_KEY =
  '@cvengine/user-profile';

const ACCESS_TOKEN_KEY =
  '@cvengine/access-token';

const REFRESH_TOKEN_KEY =
  '@cvengine/refresh-token';

const ONBOARDING_KEY =
  '@cvengine/onboarding-completed';

const OLD_REGISTERED_USER_KEY =
  '@cvengine/registered-user';

// ==========================================
// CONTEXT
// ==========================================

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

// ==========================================
// HELPERS
// ==========================================

function normalizePhoneNumber(
  phoneNumber: string,
): string {
  return phoneNumber
    .replace(/\s+/g, '')
    .trim();
}

function createApiUser(
  phoneNumber: string,
  savedProfile?: AppUser | null,
): AppUser {
  const cleanPhoneNumber =
    normalizePhoneNumber(
      phoneNumber,
    );

  if (
    savedProfile &&
    savedProfile.phoneNumber ===
      cleanPhoneNumber
  ) {
    return savedProfile;
  }

  /*
   * Backend login response abhi profile
   * return nahi karti. Fresh device par
   * basic fallback profile use hogi.
   */
  return {
    firebaseUid:
      `api-${cleanPhoneNumber}`,

    fullName: 'User',
    age: 0,

    phoneNumber:
      cleanPhoneNumber,
  };
}

// ==========================================
// PROVIDER
// ==========================================

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    user,
    setUser,
  ] =
    useState<AppUser | null>(
      null,
    );

  const [
    savedProfile,
    setSavedProfile,
  ] =
    useState<AppUser | null>(
      null,
    );

  const [
    accessToken,
    setAccessToken,
  ] =
    useState<string | null>(
      null,
    );

  const [
    refreshToken,
    setRefreshToken,
  ] =
    useState<string | null>(
      null,
    );

  const [
    onboardingCompleted,
    setOnboardingCompleted,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  /*
   * Registration verification state.
   */
  const [
    registrationToken,
    setRegistrationToken,
  ] =
    useState<string | null>(
      null,
    );

  const [
    pendingRegistration,
    setPendingRegistration,
  ] =
    useState<PendingRegistration | null>(
      null,
    );

  /*
   * OTP login temporary state.
   */
  const [
    loginOtpToken,
    setLoginOtpToken,
  ] =
    useState<string | null>(
      null,
    );

  const [
    loginOtpPhone,
    setLoginOtpPhone,
  ] =
    useState<string | null>(
      null,
    );

  /*
   * Forgot-password temporary state.
   */
  const [
    passwordResetToken,
    setPasswordResetToken,
  ] =
    useState<string | null>(
      null,
    );

  // ========================================
  // RESTORE SESSION
  // ========================================

  useEffect(() => {
    void restoreAuthentication();
  }, []);

  async function restoreAuthentication() {
    try {
      const [
        savedSessionText,
        savedProfileText,
        savedAccessToken,
        savedRefreshToken,
        savedOnboarding,
      ] = await Promise.all([
        AsyncStorage.getItem(
          ACTIVE_SESSION_KEY,
        ),

        AsyncStorage.getItem(
          USER_PROFILE_KEY,
        ),

        AsyncStorage.getItem(
          ACCESS_TOKEN_KEY,
        ),

        AsyncStorage.getItem(
          REFRESH_TOKEN_KEY,
        ),

        AsyncStorage.getItem(
          ONBOARDING_KEY,
        ),
      ]);

      if (savedProfileText) {
        const restoredProfile =
          JSON.parse(
            savedProfileText,
          ) as AppUser;

        setSavedProfile(
          restoredProfile,
        );
      }

      if (
        savedSessionText &&
        savedAccessToken &&
        savedRefreshToken
      ) {
        const restoredSession =
          JSON.parse(
            savedSessionText,
          ) as AppUser;

        setUser(
          restoredSession,
        );

        setAccessToken(
          savedAccessToken,
        );

        setRefreshToken(
          savedRefreshToken,
        );

        /*
         * App start par access token
         * background mein refresh hoga.
         * Network unavailable hone par
         * local session logout nahi hogi.
         */
        void refreshAccessToken(
          savedRefreshToken,
        )
          .then(
            async response => {
              if (
                response.access_token
              ) {
                setAccessToken(
                  response.access_token,
                );

                await AsyncStorage.setItem(
                  ACCESS_TOKEN_KEY,
                  response.access_token,
                );
              }
            },
          )
          .catch(error => {
            console.warn(
              'Token refresh skipped:',
              error,
            );
          });
      }

      setOnboardingCompleted(
        savedOnboarding === 'true',
      );

      /*
       * Purane demo password data ko
       * remove karna hai.
       */
      await AsyncStorage.removeItem(
        OLD_REGISTERED_USER_KEY,
      );
    } catch (error) {
      console.warn(
        'Unable to restore authentication:',
        error,
      );

      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // SAVE AUTHENTICATED SESSION
  // ========================================

  async function saveAuthenticatedSession(
    phoneNumber: string,
    newAccessToken: string,
    newRefreshToken: string,
  ) {
    const authenticatedUser =
      createApiUser(
        phoneNumber,
        savedProfile,
      );

    await Promise.all([
      AsyncStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify(
          authenticatedUser,
        ),
      ),

      AsyncStorage.setItem(
        ACCESS_TOKEN_KEY,
        newAccessToken,
      ),

      AsyncStorage.setItem(
        REFRESH_TOKEN_KEY,
        newRefreshToken,
      ),
    ]);

    setUser(
      authenticatedUser,
    );

    setAccessToken(
      newAccessToken,
    );

    setRefreshToken(
      newRefreshToken,
    );
  }

  // ========================================
  // COMPLETE ONBOARDING
  // ========================================

  async function completeOnboarding() {
    setOnboardingCompleted(true);

    await AsyncStorage.setItem(
      ONBOARDING_KEY,
      'true',
    );
  }

  // ========================================
  // REGISTER
  // ========================================

  async function registerAccount(
    fullName: string,
    age: number,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
  ): Promise<AuthActionResult> {
    const cleanPhoneNumber =
      normalizePhoneNumber(
        phoneNumber,
      );

    const response =
      await registerUser(
        fullName.trim(),
        age,
        cleanPhoneNumber,
        password,
        confirmPassword,
      );

    if (!response.token) {
      throw new Error(
        'Registration token server se nahi mila.',
      );
    }

    setRegistrationToken(
      response.token,
    );

    setPendingRegistration({
      fullName:
        fullName.trim() ||
        'User',

      age,

      phoneNumber:
        cleanPhoneNumber,
    });

    return {
      message:
        response.message,

      otp:
        response.otp !== undefined
          ? String(response.otp)
          : undefined,
    };
  }

  // ========================================
  // VERIFY REGISTRATION OTP
  // ========================================

  async function verifyRegistrationOtp(
    otp: string,
  ): Promise<string> {
    if (!registrationToken) {
      throw new Error(
        'Registration session expire ho gayi. Dobara register karein.',
      );
    }

    const response =
      await verifyRegistration(
        registrationToken,
        otp.trim(),
      );

    /*
     * Password locally store nahi hoga.
     * Sirf verified profile save hogi.
     */
    if (pendingRegistration) {
      const verifiedProfile:
        AppUser = {
          firebaseUid:
            `api-${pendingRegistration.phoneNumber}`,

          fullName:
            pendingRegistration.fullName,

          age:
            pendingRegistration.age,

          phoneNumber:
            pendingRegistration.phoneNumber,
        };

      setSavedProfile(
        verifiedProfile,
      );

      await AsyncStorage.setItem(
        USER_PROFILE_KEY,
        JSON.stringify(
          verifiedProfile,
        ),
      );
    }

    setRegistrationToken(
      null,
    );

    setPendingRegistration(
      null,
    );

    return response.message;
  }

  // ========================================
  // PASSWORD LOGIN
  // ========================================

  async function loginWithPassword(
    phoneNumber: string,
    password: string,
  ): Promise<string> {
    const cleanPhoneNumber =
      normalizePhoneNumber(
        phoneNumber,
      );

    const response =
      await loginUser(
        cleanPhoneNumber,
        password,
      );

    if (
      !response.access_token ||
      !response.refresh_token
    ) {
      throw new Error(
        'Login tokens server se nahi mile.',
      );
    }

    await saveAuthenticatedSession(
      cleanPhoneNumber,
      response.access_token,
      response.refresh_token,
    );

    return response.message;
  }

  // ========================================
  // SEND LOGIN OTP
  // ========================================

  async function requestLoginOtp(
    phoneNumber: string,
  ): Promise<AuthActionResult> {
    const cleanPhoneNumber =
      normalizePhoneNumber(
        phoneNumber,
      );

    const response =
      await sendLoginOtp(
        cleanPhoneNumber,
      );

    if (!response.token) {
      throw new Error(
        'OTP login token server se nahi mila.',
      );
    }

    setLoginOtpToken(
      response.token,
    );

    setLoginOtpPhone(
      cleanPhoneNumber,
    );

    return {
      message:
        response.message,

      otp:
        response.otp !== undefined
          ? String(response.otp)
          : undefined,
    };
  }

  // ========================================
  // VERIFY OTP + LOGIN
  // ========================================

  async function loginWithOtp(
    otp: string,
  ): Promise<string> {
    if (
      !loginOtpToken ||
      !loginOtpPhone
    ) {
      throw new Error(
        'OTP login session expire ho gayi. Dobara OTP mangayein.',
      );
    }

    const response =
      await verifyLoginOtp(
        loginOtpToken,
        otp.trim(),
      );

    if (
      !response.access_token ||
      !response.refresh_token
    ) {
      throw new Error(
        'Login tokens server se nahi mile.',
      );
    }

    await saveAuthenticatedSession(
      loginOtpPhone,
      response.access_token,
      response.refresh_token,
    );

    setLoginOtpToken(
      null,
    );

    setLoginOtpPhone(
      null,
    );

    return response.message;
  }

  // ========================================
  // REQUEST PASSWORD RESET OTP
  // ========================================

  async function requestPasswordReset(
    phoneNumber: string,
  ): Promise<AuthActionResult> {
    const cleanPhoneNumber =
      normalizePhoneNumber(
        phoneNumber,
      );

    const response =
      await requestPasswordResetApi(
        cleanPhoneNumber,
      );

    if (!response.token) {
      throw new Error(
        'Password reset token server se nahi mila.',
      );
    }

    setPasswordResetToken(
      response.token,
    );

    return {
      message:
        response.message,

      otp:
        response.otp !== undefined
          ? String(response.otp)
          : undefined,
    };
  }

  // ========================================
  // VERIFY PASSWORD RESET OTP
  // ========================================

  async function verifyPasswordResetOtp(
    otp: string,
  ): Promise<string> {
    if (!passwordResetToken) {
      throw new Error(
        'OTP session expire ho gayi. Dobara OTP mangayein.',
      );
    }

    const response =
      await verifyResetOtp(
        passwordResetToken,
        otp.trim(),
      );

    if (!response.token) {
      throw new Error(
        'Password reset verification token nahi mila.',
      );
    }

    setPasswordResetToken(
      response.token,
    );

    return response.message;
  }

  // ========================================
  // RESET PASSWORD
  // ========================================

  async function resetPassword(
    newPassword: string,
    confirmPassword: string,
  ): Promise<string> {
    if (!passwordResetToken) {
      throw new Error(
        'Password reset session expire ho gayi. Dobara process start karein.',
      );
    }

    const response =
      await changePassword(
        passwordResetToken,
        newPassword,
        confirmPassword,
      );

    setPasswordResetToken(
      null,
    );

    return response.message;
  }

  // ========================================
  // LOGOUT
  // ========================================

  async function logout() {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    setRegistrationToken(
      null,
    );

    setPendingRegistration(
      null,
    );

    setLoginOtpToken(
      null,
    );

    setLoginOtpPhone(
      null,
    );

    setPasswordResetToken(
      null,
    );

    /*
     * Verified local profile preserve hogi.
     * Active session and tokens remove honge.
     */
    await Promise.all([
      AsyncStorage.removeItem(
        ACTIVE_SESSION_KEY,
      ),

      AsyncStorage.removeItem(
        ACCESS_TOKEN_KEY,
      ),

      AsyncStorage.removeItem(
        REFRESH_TOKEN_KEY,
      ),
    ]);
  }

  // ========================================
  // PROVIDER
  // ========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        authenticated:
          user !== null,

        onboardingCompleted,
        accessToken,

        completeOnboarding,
        registerAccount,
        verifyRegistrationOtp,
        loginWithPassword,
        requestLoginOtp,
        loginWithOtp,
        requestPasswordReset,
        verifyPasswordResetOtp,
        resetPassword,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================

export function useAuth() {
  const context =
    useContext(
      AuthContext,
    );

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}