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
  onLogin: () => void;
  onRegistered: () => void;
};

export default function RegisterScreen({
  onLogin,
  onRegistered,
}: Props) {
  const {
    registerAccount,
    verifyRegistrationOtp,
  } = useAuth();

  const [
    fullName,
    setFullName,
  ] = useState('');

  const [
    age,
    setAge,
  ] = useState('');

  const [
    phone,
    setPhone,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

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

  // ========================================
  // VALIDATE DETAILS
  // ========================================

  function validateDetails() {
    if (
      fullName.trim().length < 2
    ) {
      Alert.alert(
        'Name Required',
        'Please enter your full name.',
      );

      return false;
    }

    const numericAge =
      Number(age);

    if (
      !Number.isFinite(
        numericAge,
      ) ||
      numericAge < 1 ||
      numericAge > 120
    ) {
      Alert.alert(
        'Invalid Age',
        'Please enter a valid age.',
      );

      return false;
    }

    if (phone.length !== 10) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number.',
      );

      return false;
    }

    if (password.length < 5) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least 5 characters.',
      );

      return false;
    }

    if (
      password !==
      confirmPassword
    ) {
      Alert.alert(
        'Password Mismatch',
        'Password and confirm password do not match.',
      );

      return false;
    }

    return true;
  }

  // ========================================
  // REGISTER + SEND OTP
  // ========================================

  async function handleCreateAccount() {
    if (
      loading ||
      !validateDetails()
    ) {
      return;
    }

    try {
      setLoading(true);
      setTestingOtp(null);

      const result =
        await registerAccount(
          fullName.trim(),
          Number(age),
          phone,
          password,
          confirmPassword,
        );

      setOtp('');
      setOtpSent(true);

      if (result.otp) {
        /*
         * Backend testing ke liye OTP
         * response mein bhej raha hai.
         * SMS service lagne ke baad OTP
         * response mein nahi aana chahiye.
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
        'Registration Failed',
        getApiErrorMessage(
          error,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // VERIFY REGISTRATION OTP
  // ========================================

  async function handleRegister() {
    const cleanOtp =
      otp.replace(/\D/g, '');

    if (
      cleanOtp.length < 4 ||
      cleanOtp.length > 6
    ) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the valid OTP sent for registration.',
      );

      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const message =
        await verifyRegistrationOtp(
          cleanOtp,
        );

      Alert.alert(
        'Account Created',
        message,
        [
          {
            text:
              'Continue to Login',

            onPress:
              onRegistered,
          },
        ],
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
  // CHANGE DETAILS
  // ========================================

  function handleChangeDetails() {
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
            Create your health profile
          </Text>
        </View>
      </View>

      {!otpSent ? (
        <>
          {/* DETAILS STAGE */}

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Create your account and start
            monitoring your heart health.
          </Text>

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={
              colors.placeholder
            }
            value={fullName}
            onChangeText={
              setFullName
            }
            autoCapitalize="words"
            editable={!loading}
          />

          <Text style={styles.label}>
            Age
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor={
              colors.placeholder
            }
            value={age}
            onChangeText={value =>
              setAge(
                value
                  .replace(
                    /\D/g,
                    '',
                  )
                  .slice(
                    0,
                    3,
                  ),
              )
            }
            keyboardType="number-pad"
            maxLength={3}
            editable={!loading}
          />

          <Text style={styles.label}>
            Phone Number
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

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create password"
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
              editable={!loading}
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

          <Text style={styles.passwordHint}>
            Minimum 5 characters
          </Text>

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Re-enter password"
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

          <View style={styles.secureCard}>
            <View style={styles.secureIconWrap}>
              <Text style={styles.secureIcon}>
                ✓
              </Text>
            </View>

            <View style={styles.secureContent}>
              <Text style={styles.secureTitle}>
                Secure Registration
              </Text>

              <Text style={styles.secureSubtitle}>
                Your number will be verified
                using a one-time password.
              </Text>
            </View>
          </View>

          <AppButton
            title="Create Account"
            loading={loading}
            onPress={
              handleCreateAccount
            }
          />

          <Pressable
            style={styles.loginArea}
            disabled={loading}
            onPress={onLogin}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink}>
                Login
              </Text>
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          {/* OTP STAGE */}

          <View style={styles.verifyArea}>
            <View style={styles.verifyOuter}>
              <View style={styles.verifyInner}>
                <Text style={styles.verifyHeart}>
                  ♥
                </Text>
              </View>
            </View>

            <Text style={styles.verifyTitle}>
              Verify Your Number
            </Text>

            <Text style={styles.verifyDescription}>
              Enter the verification code
              sent to your registered phone
              number.
            </Text>

            <View style={styles.phoneBadge}>
              <Text style={styles.phoneBadgeText}>
                +91 {phone}
              </Text>
            </View>
          </View>

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
          />

          <Text style={styles.otpHint}>
            {testingOtp
              ? `Testing OTP: ${testingOtp}`
              : 'Enter the OTP received on your phone.'}
          </Text>

          <AppButton
            title="Verify & Create Account"
            loading={loading}
            onPress={
              handleRegister
            }
          />

          <AppButton
            title="Change Details"
            variant="secondary"
            onPress={
              handleChangeDetails
            }
          />
        </>
      )}

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
    marginBottom: 27,
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

  title: {
    color: colors.text,
    fontSize: 29,
    fontWeight: '900',
  },

  subtitle: {
    color:
      colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 24,
    maxWidth: 310,
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
    color: colors.text,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 17,
  },

  phoneContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  countryCode: {
    height: 31,
    paddingHorizontal: 14,
    justifyContent: 'center',
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

  passwordContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
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

  secureCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.successSoft,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginTop: 17,
    marginBottom: 14,
  },

  secureIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor:
      colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  secureIcon: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },

  secureContent: {
    flex: 1,
  },

  secureTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },

  secureSubtitle: {
    color:
      colors.textSecondary,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 2,
  },

  loginArea: {
    alignItems: 'center',
    paddingVertical: 19,
  },

  loginText: {
    color:
      colors.textSecondary,
    fontSize: 13,
  },

  loginLink: {
    color: colors.primary,
    fontWeight: '900',
  },

  verifyArea: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },

  verifyOuter: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor:
      colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifyInner: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor:
      colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifyHeart: {
    color: colors.white,
    fontSize: 29,
  },

  verifyTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 16,
  },

  verifyDescription: {
    color:
      colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 6,
  },

  phoneBadge: {
    backgroundColor:
      colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 12,
  },

  phoneBadgeText: {
    color:
      colors.primaryDark,
    fontSize: 10,
    fontWeight: '800',
  },

  sentBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.successSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },

  sentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      colors.success,
    marginRight: 7,
  },

  sentText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
  },

  otpInput: {
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 7,
    paddingHorizontal: 15,
    marginBottom: 7,
  },

  otpHint: {
    color: colors.textLight,
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 17,
  },

  footer: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
    paddingVertical: 15,
  },

  footerCompany: {
    color: colors.textLight,
    fontWeight: '600',
  },
});