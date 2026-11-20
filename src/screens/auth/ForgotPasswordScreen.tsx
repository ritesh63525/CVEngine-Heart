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
  onDone: () => void;
};

type RecoveryStage =
  | 'phone'
  | 'otp'
  | 'password';

export default function ForgotPasswordScreen({
  onDone,
}: Props) {
  const {
    requestPasswordReset,
    verifyPasswordResetOtp,
    resetPassword,
  } = useAuth();

  const [
    stage,
    setStage,
  ] =
    useState<RecoveryStage>(
      'phone',
    );

  const [
    phone,
    setPhone,
  ] = useState('');

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
    newPassword,
    setNewPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

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

  // ========================================
  // REQUEST OTP
  // ========================================

  async function handleSendOtp() {
    if (phone.length !== 10) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter your registered 10-digit phone number.',
      );

      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setTestingOtp(null);

      const result =
        await requestPasswordReset(
          phone,
        );

      setOtp('');
      setStage('otp');

      if (result.otp) {
        /*
         * Backend abhi testing ke liye OTP
         * response mein return karta hai.
         */
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
  // VERIFY OTP
  // ========================================

  async function handleVerifyOtp() {
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

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const message =
        await verifyPasswordResetOtp(
          cleanOtp,
        );

      setStage('password');

      Alert.alert(
        'OTP Verified',
        message,
      );
    } catch (error) {
      Alert.alert(
        'OTP Verification Failed',
        getApiErrorMessage(
          error,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // RESET PASSWORD
  // ========================================

  async function handleResetPassword() {
    if (
      newPassword.length < 5
    ) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least 5 characters.',
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      Alert.alert(
        'Password Mismatch',
        'New password and confirm password do not match.',
      );

      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const message =
        await resetPassword(
          newPassword,
          confirmPassword,
        );

      Alert.alert(
        'Password Updated',
        message,
        [
          {
            text:
              'Continue to Login',

            onPress:
              onDone,
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Unable to Reset Password',
        getApiErrorMessage(
          error,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // BACK
  // ========================================

  function handleBack() {
    if (loading) {
      return;
    }

    if (stage === 'password') {
      setNewPassword('');
      setConfirmPassword('');
      setStage('otp');

      return;
    }

    if (stage === 'otp') {
      setOtp('');
      setTestingOtp(null);
      setStage('phone');

      return;
    }

    onDone();
  }

  // ========================================
  // HERO TEXT
  // ========================================

  function getTitle() {
    if (stage === 'otp') {
      return 'Verify OTP';
    }

    if (stage === 'password') {
      return 'New Password';
    }

    return 'Reset Password';
  }

  function getSubtitle() {
    if (stage === 'otp') {
      return (
        'Enter the verification code sent ' +
        'to your registered phone number.'
      );
    }

    if (stage === 'password') {
      return (
        'Create a secure new password for ' +
        'your Heart Monitor account.'
      );
    }

    return (
      'Enter your registered phone number ' +
      'to receive a verification code.'
    );
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
            Account Recovery
          </Text>
        </View>
      </View>

      {/* HERO */}

      <View style={styles.hero}>
        <View style={styles.heroOuter}>
          <View style={styles.heroInner}>
            <Text style={styles.heroHeart}>
              ♥
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          {getTitle()}
        </Text>

        <Text style={styles.subtitle}>
          {getSubtitle()}
        </Text>
      </View>

      {/* ====================================
          STAGE 1: PHONE NUMBER
      ===================================== */}

      {stage === 'phone' ? (
        <>
          <Text style={styles.label}>
            Registered Phone Number
          </Text>

          <View style={styles.phoneContainer}>
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
                  cleanPhone(
                    value,
                  ),
                )
              }
              keyboardType="phone-pad"
              maxLength={10}
              editable={!loading}
            />
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Text style={styles.statusSymbol}>
                #
              </Text>
            </View>

            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>
                OTP Verification
              </Text>

              <Text style={styles.statusText}>
                A one-time password will be
                generated for account
                verification.
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
      ) : null}

      {/* ====================================
          STAGE 2: VERIFY OTP
      ===================================== */}

      {stage === 'otp' ? (
        <>
          <View style={styles.phoneBadge}>
            <Text style={styles.phoneBadgeText}>
              OTP sent for +91 {phone}
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
          />

          <Text style={styles.otpHint}>
            {testingOtp
              ? `Testing OTP: ${testingOtp}`
              : 'Enter the OTP received on your phone.'}
          </Text>

          <AppButton
            title="Verify OTP"
            loading={loading}
            onPress={
              handleVerifyOtp
            }
          />

          <AppButton
            title="Change Phone Number"
            variant="secondary"
            onPress={handleBack}
          />
        </>
      ) : null}

      {/* ====================================
          STAGE 3: NEW PASSWORD
      ===================================== */}

      {stage === 'password' ? (
        <>
          <View style={styles.verifiedBadge}>
            <View style={styles.verifiedDot} />

            <Text style={styles.verifiedText}>
              Phone number verified
            </Text>
          </View>

          <Text style={styles.label}>
            New Password
          </Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              placeholderTextColor={
                colors.placeholder
              }
              value={newPassword}
              onChangeText={
                setNewPassword
              }
              secureTextEntry={
                !showNewPassword
              }
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Pressable
              style={styles.eyeButton}
              disabled={loading}
              onPress={() =>
                setShowNewPassword(
                  previous =>
                    !previous,
                )
              }>
              <Text style={styles.eyeText}>
                {showNewPassword
                  ? 'HIDE'
                  : 'SHOW'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.passwordHint}>
            Minimum 5 characters
          </Text>

          <Text style={styles.label}>
            Confirm New Password
          </Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Re-enter new password"
              placeholderTextColor={
                colors.placeholder
              }
              value={
                confirmPassword
              }
              onChangeText={
                setConfirmPassword
              }
              secureTextEntry={
                !showConfirmPassword
              }
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Pressable
              style={styles.eyeButton}
              disabled={loading}
              onPress={() =>
                setShowConfirmPassword(
                  previous =>
                    !previous,
                )
              }>
              <Text style={styles.eyeText}>
                {showConfirmPassword
                  ? 'HIDE'
                  : 'SHOW'}
              </Text>
            </Pressable>
          </View>

          <AppButton
            title="Confirm New Password"
            loading={loading}
            onPress={
              handleResetPassword
            }
          />
        </>
      ) : null}

      {/* BACK */}

      <Pressable
        style={styles.backArea}
        disabled={loading}
        onPress={handleBack}>
        <Text style={styles.backText}>
          ←{' '}
          {stage === 'phone'
            ? 'Back to '
            : 'Go Back'}
          {stage === 'phone' ? (
            <Text style={styles.backLink}>
              Login
            </Text>
          ) : null}
        </Text>
      </Pressable>

      {/* INFO */}

      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoHeart}>
            ♥
          </Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Protect your account
          </Text>

          <Text style={styles.infoText}>
            Never share your password,
            OTP or verification token with
            anyone.
          </Text>
        </View>
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
    marginBottom: 24,
  },

  logo: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor:
      colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 3,
  },

  heartCircle: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor:
      colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoHeart: {
    color: colors.white,
    fontSize: 23,
  },

  brandName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  brandSubtitle: {
    color:
      colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 25,
  },

  heroOuter: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor:
      colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroInner: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor:
      colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroHeart: {
    color: colors.white,
    fontSize: 27,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 15,
  },

  subtitle: {
    color:
      colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 290,
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },

  phoneContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor:
      colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
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

  statusCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 17,
  },

  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor:
      colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  statusSymbol: {
    color:
      colors.primaryDark,
    fontSize: 19,
    fontWeight: '900',
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },

  statusText: {
    color:
      colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },

  phoneBadge: {
    alignSelf: 'center',
    backgroundColor:
      colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginBottom: 20,
  },

  phoneBadgeText: {
    color:
      colors.primaryDark,
    fontSize: 10,
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

  verifiedBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.successSoft,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },

  verifiedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      colors.success,
    marginRight: 7,
  },

  verifiedText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
  },

  passwordContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor:
      colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  passwordInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 15,
  },

  eyeButton: {
    paddingHorizontal: 15,
    paddingVertical: 17,
  },

  eyeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  passwordHint: {
    color: colors.textLight,
    fontSize: 9,
    marginBottom: 17,
  },

  backArea: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  backText: {
    color:
      colors.textSecondary,
    fontSize: 13,
  },

  backLink: {
    color: colors.primary,
    fontWeight: '900',
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor:
      colors.primarySoft,
    borderRadius: 16,
    padding: 14,
    marginTop: 3,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor:
      colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  infoHeart: {
    color: colors.white,
    fontSize: 19,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },

  infoText: {
    color:
      colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },

  footer: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
    paddingVertical: 18,
  },

  footerCompany: {
    color: colors.textLight,
    fontWeight: '600',
  },
});