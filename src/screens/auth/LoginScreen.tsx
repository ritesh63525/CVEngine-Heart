
import React, { useState } from 'react';

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

import { useAuth } from '../../context/AuthContext';

import { colors } from '../../theme/colors';

type Props = {
  onRegister: () => void;
  onLoggedIn: () => void;
  onForgotPassword: () => void;
};

export default function LoginScreen({
  onRegister,
  onLoggedIn,
  onForgotPassword,
}: Props) {
  const { loginWithDemo } = useAuth();

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ========================================
  // DEMO LOGIN
  // ========================================

  async function handleLogin() {
    if (loading) {
      return;
    }

    if (!username.trim() || !password) {
      Alert.alert(
        'Missing Details',
        'Please enter username and password.',
      );

      return;
    }

    try {
      setLoading(true);

      await loginWithDemo(
        username,
        password,
      );

      onLoggedIn();
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error?.message ||
          'Invalid username or password.',
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // UI
  // ========================================

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

      {/* DEMO LOGIN INFO */}

      <View style={styles.demoCard}>
        <Text style={styles.demoTitle}>
          Demo Login
        </Text>

        <Text style={styles.demoText}>
          Enter your demo username and password
          to access the application.
        </Text>
      </View>

      {/* USERNAME */}

      <Text style={styles.label}>
        Username
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter username"
          placeholderTextColor={
            colors.placeholder
          }
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          returnKeyType="next"
        />
      </View>

      {/* PASSWORD */}

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
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <Pressable
          style={styles.eyeButton}
          disabled={loading}
          onPress={() =>
            setShowPassword(
              previous => !previous,
            )
          }
        >
          <Text style={styles.eyeText}>
            {showPassword ? 'HIDE' : 'SHOW'}
          </Text>
        </Pressable>
      </View>

      {/* FORGOT PASSWORD */}

      <Pressable
        style={styles.forgotButton}
        disabled={loading}
        onPress={onForgotPassword}
      >
        <Text style={styles.forgotText}>
          Forgot Password?
        </Text>
      </Pressable>

      {/* LOGIN BUTTON */}

      <AppButton
        title="Login"
        loading={loading}
        onPress={handleLogin}
      />

      {/* REGISTER */}

      <Pressable
        style={styles.register}
        disabled={loading}
        onPress={onRegister}
      >
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
          Development Demo Mode
        </Text>

        <Text style={styles.securityText}>
          This login is for testing only.
          It does not verify users through
          the CVengine server.
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

// ==========================================
// STYLES
// ==========================================

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
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.shadow,

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
    backgroundColor: colors.primaryDark,
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
    color: colors.textSecondary,
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
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    maxWidth: 310,
  },

  demoCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
  },

  demoTitle: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '900',
  },

  demoText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
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
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 15,
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

  register: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  registerText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  registerLink: {
    color: colors.primary,
    fontWeight: '900',
  },

  securityCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },

  securityTitle: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '900',
  },

  securityText: {
    color: colors.textSecondary,
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
