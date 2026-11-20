import React, {
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ScreenContainer
  from '../../components/ScreenContainer';

import AppButton
  from '../../components/AppButton';

import {
  getApiErrorMessage,
} from '../../api/apiClient';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  colors,
} from '../../theme/colors';

type Props = {
  onRegister: () => void;
  onLoggedIn: () => void;
  onForgotPassword: () => void;
};

type LoginMode =
  | 'password'
  | 'otp';

export default function LoginScreen({
  onRegister,
  onLoggedIn,
  onForgotPassword,
}: Props) {
  const {
    loginWithPassword,
    requestLoginOtp,
    loginWithOtp,
  } = useAuth();

  const [
    phone,
    setPhone,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loginMode,
    setLoginMode,
  ] =
    useState<LoginMode>(
      'password',
    );

  const [
    otpSent,
    setOtpSent,
  ] = useState(false);

  const [
    otp,
    setOtp,
  ] = useState('');

  const [
    testingOtp,
    setTestingOtp,
  ] =
    useState<string | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  // ========================================
  // PHONE
  // ========================================

  function cleanPhone(
    value: string,
  ) {
    return value
      .replace(/\D/g, '')
      .slice(0, 10);
  }

  function validPhone() {
    if (phone.length !== 10) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number.',
      );

      return false;
    }

    return true;
  }

  // ========================================
  // PASSWORD LOGIN
  // ========================================

  async function handlePasswordLogin() {
    if (
      loading ||
      !validPhone()
    ) {
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        'Password Required',
        'Please enter your password.',
      );

      return;
    }

    try {
      setLoading(true);

      await loginWithPassword(
        phone,
        password,
      );

      onLoggedIn();
    } catch (error) {
      Alert.alert(
        'Login Failed',
        getApiErrorMessage(
          error,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // SEND REAL LOGIN OTP
  // ========================================

  async function handleSendOtp() {
    if (
      loading ||
      !validPhone()
    ) {
      return;
    }

    try {
      setLoading(true);
      setTestingOtp(null);

      const result =
        await requestLoginOtp(
          phone,
        );

      setOtp('');
      setOtpSent(true);

      if (result.otp) {
        setTestingOtp(
          result.otp,
        );

        Alert.alert(
          'OTP Sent',
          `${result.message}\n\nTesting OTP: ${result.otp}`,
        );
      } else {
        Alert.alert(
          'OTP Sent',
          result.message,
        );
      }
    } catch (error) {
      Alert.alert(
        'Unable to Send OTP',
        getApiErrorMessage(
          error,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // VERIFY OTP + LOGIN
  // ========================================

  async function handleOtpLogin() {
    if (
      loading ||
      !validPhone()
    ) {
      return;
    }

    const cleanOtp =
      otp.replace(/\D/g, '');

    if (
      cleanOtp.length < 4 ||
      cleanOtp.length > 6
    ) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the valid OTP sent to your phone.',
      );

      return;
    }

    try {
      setLoading(true);

      await loginWithOtp(
        cleanOtp,
      );

      onLoggedIn();
    } catch (error) {
      Alert.alert(
        'OTP Login Failed',
        getApiErrorMessage(
          error,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // LOGIN MODE
  // ========================================

  function switchToPassword() {
    if (loading) {
      return;
    }

    setLoginMode('password');
    setOtpSent(false);
    setOtp('');
    setTestingOtp(null);
  }

  function switchToOtp() {
    if (loading) {
      return;
    }

    setLoginMode('otp');
    setOtpSent(false);
    setOtp('');
    setTestingOtp(null);
  }

  function handleChangeNumber() {
    if (loading) {
      return;
    }

    setOtpSent(false);
    setOtp('');
    setTestingOtp(null);
  }

  return (
    <ScreenContainer>

      {/* BRAND */}

      <View style={styles.brandArea}>
        <View style={styles.logo}>
          <View style={styles.heartCircle}>
            <Text style={styles.logoHeart}>
              ♥
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.brandName}>
            HEART MONITOR
          </Text>

          <Text style={styles.brandSubtitle}>
            Smart Heart Monitoring
          </Text>
        </View>
      </View>

      {/* HEADING */}

      <View style={styles.headingArea}>
        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue monitoring
          your heart health.
        </Text>
      </View>

      {/* PASSWORD / OTP TABS */}

      <View style={styles.modeContainer}>
        <Pressable
          style={[
            styles.modeButton,

            loginMode ===
              'password' &&
              styles.modeButtonActive,
          ]}
          disabled={loading}
          onPress={
            switchToPassword
          }>
          <Text
            style={[
              styles.modeText,

              loginMode ===
                'password' &&
                styles.modeTextActive,
            ]}>
            Password
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.modeButton,

            loginMode ===
              'otp' &&
              styles.modeButtonActive,
          ]}
          disabled={loading}
          onPress={
            switchToOtp
          }>
          <Text
            style={[
              styles.modeText,

              loginMode ===
                'otp' &&
                styles.modeTextActive,
            ]}>
            OTP
          </Text>
        </Pressable>
      </View>

      {/* PHONE NUMBER */}

      <Text style={styles.label}>
        Phone Number
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryText}>
            +91
          </Text>
        </View>

        <TextInput
          style={styles.phoneInput}
          placeholder="Enter 10-digit phone number"
          placeholderTextColor={
            colors.placeholder
          }
          value={phone}
          onChangeText={value =>
            setPhone(
              cleanPhone(value),
            )
          }
          keyboardType="phone-pad"
          maxLength={10}
          editable={
            !loading &&
            !otpSent
          }
        />
      </View>

      {/* PASSWORD LOGIN */}

      {loginMode ===
      'password' ? (
        <>
          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password"
              placeholderTextColor={
                colors.placeholder
              }
              value={password}
              onChangeText={
                setPassword
              }
              secureTextEntry={
                !showPassword
              }
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              onSubmitEditing={
                handlePasswordLogin
              }
            />

            <Pressable
              style={styles.eyeButton}
              disabled={loading}
              onPress={() =>
                setShowPassword(
                  previous =>
                    !previous,
                )
              }>
              <Text style={styles.eyeText}>
                {showPassword
                  ? 'HIDE'
                  : 'SHOW'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.forgotButton}
            disabled={loading}
            onPress={
              onForgotPassword
            }>
            <Text style={styles.forgotText}>
              Forgot Password?
            </Text>
          </Pressable>

          <AppButton
            title="Login"
            loading={loading}
            onPress={
              handlePasswordLogin
            }
          />
        </>
      ) : null}

      {/* OTP LOGIN */}

      {loginMode === 'otp' ? (
        <>
          {!otpSent ? (
            <>
              <View style={styles.otpInfo}>
                <View style={styles.otpIcon}>
                  <Text style={styles.otpIconText}>
                    #
                  </Text>
                </View>

                <View style={styles.otpInfoContent}>
                  <Text style={styles.otpInfoTitle}>
                    Login using OTP
                  </Text>

                  <Text style={styles.otpInfoText}>
                    A secure one-time
                    password will be sent
                    for login verification.
                  </Text>
                </View>
              </View>

              <AppButton
                title="Send OTP"
                loading={loading}
                onPress={
                  handleSendOtp
                }
              />
            </>
          ) : (
            <>
              <View style={styles.sentBadge}>
                <View style={styles.sentDot} />

                <Text style={styles.sentText}>
                  OTP sent successfully
                </Text>
              </View>

              <Text style={styles.label}>
                Verification Code
              </Text>

              <TextInput
                style={styles.otpInput}
                placeholder="Enter OTP"
                placeholderTextColor={
                  colors.placeholder
                }
                value={otp}
                onChangeText={value =>
                  setOtp(
                    value
                      .replace(
                        /\D/g,
                        '',
                      )
                      .slice(
                        0,
                        6,
                      ),
                  )
                }
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                editable={!loading}
                onSubmitEditing={
                  handleOtpLogin
                }
              />

              <Text style={styles.otpHint}>
                {testingOtp
                  ? `Testing OTP: ${testingOtp}`
                  : 'Enter the OTP received on your phone.'}
              </Text>

              <AppButton
                title="Verify & Login"
                loading={loading}
                onPress={
                  handleOtpLogin
                }
              />

              <AppButton
                title="Change Number"
                variant="secondary"
                onPress={
                  handleChangeNumber
                }
              />
            </>
          )}
        </>
      ) : null}

      {/* DIVIDER */}

      <View style={styles.dividerArea}>
        <View style={styles.divider} />

        <Text style={styles.orText}>
          OR
        </Text>

        <View style={styles.divider} />
      </View>

      {/* ALTERNATIVE LOGIN METHOD */}

      <Pressable
        style={styles.alternativeButton}
        disabled={loading}
        onPress={
          loginMode ===
          'password'
            ? switchToOtp
            : switchToPassword
        }>
        <View style={styles.alternativeIcon}>
          <Text style={styles.alternativeSymbol}>
            {loginMode ===
            'password'
              ? '#'
              : '••'}
          </Text>
        </View>

        <Text style={styles.alternativeText}>
          {loginMode ===
          'password'
            ? 'Login with OTP'
            : 'Login with Password'}
        </Text>
      </Pressable>

      {/* REGISTER */}

      <Pressable
        style={styles.register}
        disabled={loading}
        onPress={onRegister}>
        <Text style={styles.registerText}>
          Don't have an account?{' '}
          <Text style={styles.registerLink}>
            Create Account
          </Text>
        </Text>
      </Pressable>

      {/* SECURITY NOTICE */}

      <View style={styles.securityCard}>
        <Text style={styles.securityTitle}>
          Secure Authentication
        </Text>

        <Text style={styles.securityText}>
          Password and OTP login are
          verified securely through the
          CVengine server.
        </Text>
      </View>

      {/* FOOTER */}

      <Text style={styles.footer}>
        HEART MONITOR
        {'  '}
        <Text style={styles.footerCompany}>
          by CVengine
        </Text>
      </Text>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brandArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },

  logo: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor:
      colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor:
      colors.shadow,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  heartCircle: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor:
      colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoHeart: {
    color: colors.white,
    fontSize: 23,
  },

  brandName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  brandSubtitle: {
    color:
      colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  headingArea: {
    marginBottom: 25,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },

  subtitle: {
    color:
      colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    maxWidth: 310,
  },

  modeContainer: {
    flexDirection: 'row',
    backgroundColor:
      colors.primarySoft,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },

  modeButton: {
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
  },

  modeButtonActive: {
    backgroundColor:
      colors.white,

    shadowColor:
      colors.shadow,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  modeText: {
    color:
      colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },

  modeTextActive: {
    color: colors.primary,
    fontWeight: '900',
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 55,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor:
      colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  countryCode: {
    height: 31,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor:
      colors.border,
  },

  countryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  phoneInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 14,
  },

  passwordInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 15,
  },

  eyeButton: {
    paddingHorizontal: 15,
    paddingVertical: 18,
  },

  eyeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 18,
  },

  forgotText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  otpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.primarySoft,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  otpIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  otpIconText: {
    color:
      colors.primaryDark,
    fontSize: 20,
    fontWeight: '900',
  },

  otpInfoContent: {
    flex: 1,
  },

  otpInfoTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },

  otpInfoText: {
    color:
      colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  sentBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.successSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 17,
  },

  sentDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      colors.success,
    marginRight: 7,
  },

  sentText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '800',
  },

  otpInput: {
    height: 57,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor:
      colors.white,
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 7,
    marginBottom: 7,
    paddingHorizontal: 15,
  },

  otpHint: {
    color: colors.textLight,
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 17,
  },

  dividerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor:
      colors.border,
  },

  orText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: '700',
    marginHorizontal: 12,
  },

  alternativeButton: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor:
      colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  alternativeIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor:
      colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  alternativeSymbol: {
    color:
      colors.primaryDark,
    fontSize: 14,
    fontWeight: '900',
  },

  alternativeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },

  register: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  registerText: {
    color:
      colors.textSecondary,
    fontSize: 13,
  },

  registerLink: {
    color: colors.primary,
    fontWeight: '900',
  },

  securityCard: {
    backgroundColor:
      colors.primarySoft,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },

  securityTitle: {
    color:
      colors.primaryDark,
    fontSize: 10,
    fontWeight: '900',
  },

  securityText: {
    color:
      colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  footer: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
    paddingBottom: 5,
  },

  footerCompany: {
    color: colors.textLight,
    fontWeight: '600',
  },
});