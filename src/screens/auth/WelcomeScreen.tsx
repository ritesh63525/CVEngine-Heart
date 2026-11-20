import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenContainer
  from '../../components/ScreenContainer';

import AppButton
  from '../../components/AppButton';

import {colors}
  from '../../theme/colors';

type Props = {
  onLogin: () => void;
  onRegister: () => void;
};

export default function WelcomeScreen({
  onLogin,
  onRegister,
}: Props) {
  return (
    <ScreenContainer scroll={false}>

      {/* =====================================
          BRAND
      ====================================== */}

      <View style={styles.brandArea}>
        <View style={styles.logoBox}>
          <Text style={styles.heart}>
            ♥
          </Text>

          <View style={styles.ecgLine}>
            <Text style={styles.ecg}>
              ︿╱╲︿
            </Text>
          </View>
        </View>

        <Text style={styles.appName}>
          HEART
        </Text>

        <Text style={styles.appNameDark}>
          MONITOR
        </Text>

        <Text style={styles.tagline}>
          Smart Monitoring.
          {'\n'}
          Healthier Tomorrow.
        </Text>
      </View>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <View style={styles.content}>

        <Text style={styles.title}>
          Your Heart.
          {'\n'}
          <Text style={styles.redText}>
            Our Priority.
          </Text>
        </Text>

        <Text style={styles.description}>
          Monitor your heart health
          anytime, anywhere with
          real-time insights.
        </Text>

        {/* FEATURES */}

        <View style={styles.features}>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureSymbol}>
                ♥
              </Text>
            </View>

            <View style={styles.featureTextArea}>
              <Text style={styles.featureTitle}>
                Heart Rate
              </Text>

              <Text style={styles.featureDescription}>
                Real-time BPM monitoring
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureSymbol}>
                O₂
              </Text>
            </View>

            <View style={styles.featureTextArea}>
              <Text style={styles.featureTitle}>
                Blood Oxygen
              </Text>

              <Text style={styles.featureDescription}>
                Monitor your SpO₂ levels
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Text style={styles.bluetoothSymbol}>
                B
              </Text>
            </View>

            <View style={styles.featureTextArea}>
              <Text style={styles.featureTitle}>
                Stay Connected
              </Text>

              <Text style={styles.featureDescription}>
                Connect your heart monitor
                using Bluetooth
              </Text>
            </View>
          </View>

        </View>
      </View>

      {/* =====================================
          ACTIONS
      ====================================== */}

      <View style={styles.actions}>

        <AppButton
          title="Login"
          onPress={onLogin}
        />

        <AppButton
          title="Create Account"
          variant="secondary"
          onPress={onRegister}
        />

        <Text style={styles.company}>
          HEART MONITOR
          {'  '}
          <Text style={styles.companyLight}>
            by CVengine
          </Text>
        </Text>

      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({

  brandArea: {
    alignItems: 'center',
    paddingTop: 15,
  },

  logoBox: {
    width: 72,
    height: 72,

    borderRadius: 22,

    backgroundColor:
      colors.primary,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor:
      colors.shadow,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 5,
  },

  heart: {
    color: colors.white,
    fontSize: 43,
  },

  ecgLine: {
    position: 'absolute',
  },

  ecg: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
  },

  appName: {
    color: colors.primary,

    fontSize: 20,

    fontWeight: '900',

    letterSpacing: 1.5,

    marginTop: 10,
  },

  appNameDark: {
    color: colors.text,

    fontSize: 20,

    fontWeight: '900',

    letterSpacing: 1.5,

    marginTop: -3,
  },

  tagline: {
    color: colors.textSecondary,

    fontSize: 11,

    lineHeight: 16,

    textAlign: 'center',

    marginTop: 5,
  },

  content: {
    flex: 1,

    justifyContent: 'center',

    paddingVertical: 15,
  },

  title: {
    color: colors.text,

    fontSize: 31,

    lineHeight: 38,

    fontWeight: '900',
  },

  redText: {
    color: colors.primary,
  },

  description: {
    color: colors.textSecondary,

    fontSize: 14,

    lineHeight: 21,

    marginTop: 9,

    maxWidth: 300,
  },

  features: {
    marginTop: 22,

    backgroundColor:
      colors.white,

    borderRadius: 20,

    borderWidth: 1,

    borderColor:
      colors.border,

    paddingHorizontal: 16,

    paddingVertical: 5,
  },

  featureRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 11,
  },

  featureIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor:
      colors.primarySoft,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 13,
  },

  featureSymbol: {
    color: colors.primary,

    fontSize: 18,

    fontWeight: '900',
  },

  bluetoothSymbol: {
    color: colors.primary,

    fontSize: 17,

    fontWeight: '900',
  },

  featureTextArea: {
    flex: 1,
  },

  featureTitle: {
    color: colors.text,

    fontSize: 14,

    fontWeight: '800',
  },

  featureDescription: {
    color: colors.textSecondary,

    fontSize: 11,

    marginTop: 2,
  },

  actions: {
    paddingBottom: 5,
  },

  company: {
    color: colors.primary,

    textAlign: 'center',

    fontSize: 10,

    fontWeight: '800',

    marginTop: 5,

    letterSpacing: 0.3,
  },

  companyLight: {
    color: colors.textSecondary,

    fontWeight: '600',
  },
});