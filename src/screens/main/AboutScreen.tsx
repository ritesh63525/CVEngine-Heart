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

import {
  colors,
} from '../../theme/colors';

type Props = {
  onBack: () => void;
};

export default function AboutScreen({
  onBack,
}: Props) {
  return (
    <ScreenContainer>

      {/* =====================================
          HERO
      ====================================== */}

      <View style={styles.hero}>

        <View style={styles.decorationOne} />

        <View style={styles.decorationTwo} />

        <View style={styles.logoOuter}>

          <View style={styles.logo}>
            <Text style={styles.heart}>
              ♥
            </Text>
          </View>

        </View>

        <Text style={styles.brandLabel}>
          CVENGINE
        </Text>

        <Text style={styles.title}>
          Heart Monitor
        </Text>

        <Text style={styles.powered}>
          Smart Health Monitoring
        </Text>

        <View style={styles.versionBadge}>

          <View style={styles.versionDot} />

          <Text style={styles.version}>
            VERSION 1.0
          </Text>

        </View>

      </View>

      {/* =====================================
          INTRODUCTION
      ====================================== */}

      <View style={styles.introCard}>

        <View style={styles.introIcon}>

          <Text style={styles.introHeart}>
            ♥
          </Text>

        </View>

        <View style={styles.introContent}>

          <Text style={styles.introLabel}>
            ABOUT THE APP
          </Text>

          <Text style={styles.introTitle}>
            Built for Health Monitoring
          </Text>

          <Text style={styles.introText}>
            CVengine Heart Monitor connects
            with the CVengine Watch to display
            heart rate and blood oxygen
            measurements.
          </Text>

        </View>

      </View>

      {/* =====================================
          FEATURES
      ====================================== */}

      <View style={styles.sectionHeader}>

        <Text style={styles.sectionTitle}>
          Core Features
        </Text>

        <Text style={styles.sectionSubtitle}>
          What Heart Monitor provides
        </Text>

      </View>

      <View style={styles.card}>

        <InfoRow
          icon="B"
          type="blue"
          title="Bluetooth Low Energy"
          body="Connects with the CVengine Watch through Bluetooth Low Energy for wireless sensor communication."
        />

        <View style={styles.divider} />

        <InfoRow
          icon="♥"
          type="red"
          title="Heart Rate Monitoring"
          body="Displays BPM readings received from the connected CVengine sensor device."
        />

        <View style={styles.divider} />

        <InfoRow
          icon="O₂"
          type="blue"
          title="Blood Oxygen"
          body="Displays SpO₂ measurements received during active monitoring."
        />

      </View>

      {/* =====================================
          MONITORING
      ====================================== */}

      <View style={styles.sectionHeader}>

        <Text style={styles.sectionTitle}>
          Monitoring & History
        </Text>

        <Text style={styles.sectionSubtitle}>
          From live readings to saved records
        </Text>

      </View>

      <View style={styles.monitoringCard}>

        <View style={styles.monitoringTop}>

          <View style={styles.monitoringIcon}>

            <Text style={styles.monitoringIconText}>
              ♥
            </Text>

          </View>

          <View style={styles.monitoringHeading}>

            <Text style={styles.monitoringLabel}>
              SENSOR MONITORING
            </Text>

            <Text style={styles.monitoringTitle}>
              Live Health Readings
            </Text>

          </View>

        </View>

        <Text style={styles.monitoringText}>
          Valid BPM and SpO₂ readings can be
          recorded during monitoring sessions.
          Saved measurements can later be
          reviewed in Reading History and
          Health Reports.
        </Text>

        <View style={styles.metricRow}>

          <View style={styles.heartMetric}>

            <Text style={styles.metricHeart}>
              ♥
            </Text>

            <View>
              <Text style={styles.metricTitle}>
                BPM
              </Text>

              <Text style={styles.metricSubtitle}>
                Heart Rate
              </Text>
            </View>

          </View>

          <View style={styles.oxygenMetric}>

            <Text style={styles.metricOxygen}>
              O₂
            </Text>

            <View>
              <Text style={styles.metricTitle}>
                SpO₂
              </Text>

              <Text style={styles.metricSubtitle}>
                Blood Oxygen
              </Text>
            </View>

          </View>

        </View>

      </View>

      {/* =====================================
          PRIVACY
      ====================================== */}

      <View style={styles.sectionHeader}>

        <Text style={styles.sectionTitle}>
          Privacy & Data
        </Text>

        <Text style={styles.sectionSubtitle}>
          Current application storage
        </Text>

      </View>

      <View style={styles.privacyCard}>

        <View style={styles.privacyIcon}>

          <Text style={styles.privacyIconText}>
            ✓
          </Text>

        </View>

        <View style={styles.privacyContent}>

          <Text style={styles.privacyTitle}>
            Local Data Storage
          </Text>

          <Text style={styles.privacyText}>
            In this app version, account
            details, health profile information
            and saved monitoring data are
            stored locally on the phone.
          </Text>

        </View>

      </View>

      {/* =====================================
          IMPORTANT DISCLAIMER
      ====================================== */}

      <View style={styles.warning}>

        <View style={styles.warningHeader}>

          <View style={styles.warningIcon}>

            <Text style={styles.warningSymbol}>
              !
            </Text>

          </View>

          <View>

            <Text style={styles.warningLabel}>
              IMPORTANT
            </Text>

            <Text style={styles.warningTitle}>
              Medical Disclaimer
            </Text>

          </View>

        </View>

        <Text style={styles.warningText}>
          This application and connected
          sensor are intended for monitoring
          and project purposes. They should
          not be used as a substitute for
          professional medical evaluation,
          diagnosis or emergency care.
        </Text>

      </View>

      {/* =====================================
          APP INFORMATION
      ====================================== */}

      <View style={styles.appInfoCard}>

        <AppInfoRow
          label="Application"
          value="Heart Monitor"
        />

        <View style={styles.appInfoDivider} />

        <AppInfoRow
          label="Platform"
          value="CVengine"
        />

        <View style={styles.appInfoDivider} />

        <AppInfoRow
          label="Version"
          value="1.0"
        />

        <View style={styles.appInfoDivider} />

        <AppInfoRow
          label="Device"
          value="CVengine Watch"
        />

      </View>

      {/* =====================================
          BACK BUTTON
      ====================================== */}

      <AppButton
        title="Back"
        variant="secondary"
        onPress={onBack}
      />

      {/* =====================================
          FOOTER
      ====================================== */}

      <View style={styles.footer}>

        <Text style={styles.footerHeart}>
          ♥
        </Text>

        <Text style={styles.footerText}>
          HEART MONITOR
        </Text>

        <Text style={styles.footerCompany}>
          by CVengine
        </Text>

      </View>

    </ScreenContainer>
  );
}

// ==========================================
// INFO ROW
// ==========================================

function InfoRow({
  icon,
  type,
  title,
  body,
}: {
  icon: string;
  type: 'red' | 'blue';
  title: string;
  body: string;
}) {
  return (
    <View style={styles.infoRow}>

      <View
        style={[
          styles.infoIcon,

          type === 'red'
            ? styles.infoIconRed
            : styles.infoIconBlue,
        ]}>

        <Text
          style={[
            styles.infoIconText,

            type === 'red'
              ? styles.infoIconTextRed
              : styles.infoIconTextBlue,
          ]}>
          {icon}
        </Text>

      </View>

      <View style={styles.infoContent}>

        <Text style={styles.infoTitle}>
          {title}
        </Text>

        <Text style={styles.infoBody}>
          {body}
        </Text>

      </View>

    </View>
  );
}

// ==========================================
// APP INFO ROW
// ==========================================

function AppInfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.appInfoRow}>

      <Text style={styles.appInfoLabel}>
        {label}
      </Text>

      <Text style={styles.appInfoValue}>
        {value}
      </Text>

    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({
    // ========================================
    // HERO
    // ========================================

    hero: {
      alignItems: 'center',

      backgroundColor:
        colors.primary,

      borderRadius: 27,

      paddingVertical: 27,

      paddingHorizontal: 20,

      marginBottom: 23,

      overflow: 'hidden',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.17,

      shadowRadius: 10,

      elevation: 4,
    },

    decorationOne: {
      position: 'absolute',

      width: 130,
      height: 130,

      borderRadius: 65,

      backgroundColor:
        'rgba(255,255,255,0.08)',

      top: -65,

      right: -35,
    },

    decorationTwo: {
      position: 'absolute',

      width: 90,
      height: 90,

      borderRadius: 45,

      backgroundColor:
        'rgba(255,255,255,0.06)',

      bottom: -45,

      left: -25,
    },

    logoOuter: {
      width: 92,
      height: 92,

      borderRadius: 31,

      backgroundColor:
        'rgba(255,255,255,0.17)',

      alignItems: 'center',

      justifyContent: 'center',
    },

    logo: {
      width: 73,
      height: 73,

      borderRadius: 24,

      backgroundColor:
        colors.white,

      alignItems: 'center',

      justifyContent: 'center',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.14,

      shadowRadius: 7,

      elevation: 3,
    },

    heart: {
      color:
        colors.primary,

      fontSize: 39,

      lineHeight: 45,
    },

    brandLabel: {
      color:
        'rgba(255,255,255,0.66)',

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 2,

      marginTop: 15,
    },

    title: {
      color:
        colors.white,

      fontSize: 24,

      fontWeight: '900',

      marginTop: 3,
    },

    powered: {
      color:
        'rgba(255,255,255,0.78)',

      fontSize: 10,

      fontWeight: '600',

      marginTop: 4,
    },

    versionBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        'rgba(255,255,255,0.15)',

      borderRadius: 12,

      paddingHorizontal: 9,

      paddingVertical: 6,

      marginTop: 13,
    },

    versionDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      backgroundColor:
        colors.white,

      marginRight: 5,
    },

    version: {
      color:
        colors.white,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.5,
    },

    // ========================================
    // INTRO
    // ========================================

    introCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.white,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        colors.border,

      padding: 15,

      marginBottom: 22,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.03,

      shadowRadius: 7,

      elevation: 1,
    },

    introIcon: {
      width: 47,
      height: 47,

      borderRadius: 15,

      backgroundColor:
        colors.primarySoft,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 11,
    },

    introHeart: {
      color:
        colors.primary,

      fontSize: 22,
    },

    introContent: {
      flex: 1,
    },

    introLabel: {
      color:
        colors.primary,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.6,
    },

    introTitle: {
      color:
        colors.text,

      fontSize: 13,

      fontWeight: '900',

      marginTop: 2,
    },

    introText: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 13,

      marginTop: 4,
    },

    // ========================================
    // SECTION
    // ========================================

    sectionHeader: {
      marginBottom: 10,
    },

    sectionTitle: {
      color:
        colors.text,

      fontSize: 15,

      fontWeight: '900',
    },

    sectionSubtitle: {
      color:
        colors.textLight,

      fontSize: 8,

      marginTop: 2,
    },

    // ========================================
    // FEATURE CARD
    // ========================================

    card: {
      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 20,

      paddingHorizontal: 14,

      marginBottom: 21,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.03,

      shadowRadius: 7,

      elevation: 1,
    },

    infoRow: {
      flexDirection: 'row',

      alignItems: 'center',

      minHeight: 78,

      paddingVertical: 12,
    },

    infoIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 11,
    },

    infoIconRed: {
      backgroundColor:
        colors.primarySoft,
    },

    infoIconBlue: {
      backgroundColor:
        colors.oxygenSoft,
    },

    infoIconText: {
      fontWeight: '900',
    },

    infoIconTextRed: {
      color:
        colors.primary,

      fontSize: 18,
    },

    infoIconTextBlue: {
      color:
        colors.oxygen,

      fontSize: 13,
    },

    infoContent: {
      flex: 1,
    },

    infoTitle: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    infoBody: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 13,

      marginTop: 3,
    },

    divider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginLeft: 53,
    },

    // ========================================
    // MONITORING
    // ========================================

    monitoringCard: {
      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 20,

      padding: 15,

      marginBottom: 21,
    },

    monitoringTop: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    monitoringIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      backgroundColor:
        colors.primarySoft,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    monitoringIconText: {
      color:
        colors.primary,

      fontSize: 19,
    },

    monitoringHeading: {
      flex: 1,
    },

    monitoringLabel: {
      color:
        colors.primary,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.5,
    },

    monitoringTitle: {
      color:
        colors.text,

      fontSize: 12,

      fontWeight: '900',

      marginTop: 2,
    },

    monitoringText: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 14,

      marginTop: 12,
    },

    metricRow: {
      flexDirection: 'row',

      gap: 9,

      marginTop: 13,
    },

    heartMetric: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.primarySoft,

      borderRadius: 13,

      padding: 10,
    },

    oxygenMetric: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.oxygenSoft,

      borderRadius: 13,

      padding: 10,
    },

    metricHeart: {
      color:
        colors.primary,

      fontSize: 17,

      marginRight: 8,
    },

    metricOxygen: {
      color:
        colors.oxygen,

      fontSize: 11,

      fontWeight: '900',

      marginRight: 8,
    },

    metricTitle: {
      color:
        colors.text,

      fontSize: 9,

      fontWeight: '900',
    },

    metricSubtitle: {
      color:
        colors.textSecondary,

      fontSize: 7,

      marginTop: 1,
    },

    // ========================================
    // PRIVACY
    // ========================================

    privacyCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.oxygenSoft,

      borderWidth: 1,

      borderColor:
        '#D9E9FF',

      borderRadius: 17,

      padding: 14,

      marginBottom: 18,
    },

    privacyIcon: {
      width: 39,
      height: 39,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    privacyIconText: {
      color:
        colors.oxygen,

      fontSize: 14,

      fontWeight: '900',
    },

    privacyContent: {
      flex: 1,
    },

    privacyTitle: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    privacyText: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 13,

      marginTop: 3,
    },

    // ========================================
    // WARNING
    // ========================================

    warning: {
      backgroundColor:
        colors.warningSoft,

      borderWidth: 1,

      borderColor:
        '#FDE7B2',

      borderRadius: 18,

      padding: 15,

      marginBottom: 18,
    },

    warningHeader: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    warningIcon: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    warningSymbol: {
      color:
        colors.warning,

      fontSize: 16,

      fontWeight: '900',
    },

    warningLabel: {
      color:
        colors.warning,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.6,
    },

    warningTitle: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '900',

      marginTop: 2,
    },

    warningText: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 14,

      marginTop: 10,
    },

    // ========================================
    // APP INFO
    // ========================================

    appInfoCard: {
      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 18,

      paddingHorizontal: 14,

      marginBottom: 16,
    },

    appInfoRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      minHeight: 46,
    },

    appInfoLabel: {
      color:
        colors.textSecondary,

      fontSize: 9,
    },

    appInfoValue: {
      color:
        colors.text,

      fontSize: 9,

      fontWeight: '900',
    },

    appInfoDivider: {
      height: 1,

      backgroundColor:
        colors.border,
    },

    // ========================================
    // FOOTER
    // ========================================

    footer: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'center',

      paddingVertical: 20,
    },

    footerHeart: {
      color:
        colors.primary,

      fontSize: 11,

      marginRight: 5,
    },

    footerText: {
      color:
        colors.primary,

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 0.4,
    },

    footerCompany: {
      color:
        colors.textLight,

      fontSize: 9,

      marginLeft: 5,
    },
  });