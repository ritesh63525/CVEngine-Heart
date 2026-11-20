import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenContainer
  from '../../components/ScreenContainer';

import AppHeader
  from '../../components/AppHeader';

import AppButton
  from '../../components/AppButton';

import {
  useBluetooth,
} from '../../context/BluetoothContext';

import {
  useMonitoring,
} from '../../context/MonitoringContext';

import {
  colors,
} from '../../theme/colors';

type Props = {
  onBack: () => void;
  onConnectDevice: () => void;
};

export default function LiveMonitorScreen({
  onBack,
  onConnectDevice,
}: Props) {
  const {
    bluetooth,
  } = useBluetooth();

  const {
    monitoring,
    sessionId,
    startMonitoring,
    stopMonitoring,
  } = useMonitoring();

  // ==========================================
  // MONITORING
  // ==========================================

  async function toggleMonitoring() {
    if (!bluetooth.connected) {
      onConnectDevice();
      return;
    }

    if (monitoring) {
      await stopMonitoring();
    } else {
      await startMonitoring();
    }
  }

  // ==========================================
  // LAST UPDATED
  // ==========================================

  function formatLastUpdated() {
    if (!bluetooth.lastUpdated) {
      return 'Waiting for reading';
    }

    return new Date(
      bluetooth.lastUpdated,
    ).toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      },
    );
  }

  // ==========================================
  // VALUES
  // ==========================================

  const heartRate =
    bluetooth.heartRate ?? '--';

  const spo2 =
    bluetooth.spo2 ?? '--';

  const hasReading =
    bluetooth.heartRate !== null &&
    bluetooth.spo2 !== null;

  const sensorReady =
    bluetooth.connected &&
    bluetooth.status === 'READING' &&
    hasReading;

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <ScreenContainer>

      {/* =====================================
          HEADER
      ====================================== */}

      <AppHeader
        title="Live Monitor"
        subtitle="Real-time heart monitoring"
      />

      {/* =====================================
          DEVICE CONNECTION STATUS
      ====================================== */}

      <View style={styles.statusCard}>

        <View style={styles.statusLeft}>

          <View
            style={[
              styles.statusIcon,

              bluetooth.connected &&
                styles.statusIconConnected,
            ]}>

            <Text style={styles.statusHeart}>
              ♥
            </Text>

          </View>

          <View style={styles.statusContent}>

            <Text style={styles.statusLabel}>
              HEART MONITOR
            </Text>

            <Text style={styles.statusTitle}>
              {bluetooth.connected
                ? 'Device Connected'
                : 'Device Disconnected'}
            </Text>

            <Text style={styles.statusSubtitle}>
              {bluetooth.connected
                ? bluetooth.deviceName ??
                  'CVengine Heart Monitor'
                : 'Connect your monitor to begin'}
            </Text>

          </View>

        </View>

        <View
          style={[
            styles.liveBadge,

            !bluetooth.connected &&
              styles.offlineBadge,
          ]}>

          <View
            style={[
              styles.liveDot,

              !bluetooth.connected &&
                styles.offlineDot,
            ]}
          />

          <Text
            style={[
              styles.liveText,

              !bluetooth.connected &&
                styles.offlineText,
            ]}>
            {bluetooth.connected
              ? 'LIVE'
              : 'OFFLINE'}
          </Text>

        </View>

      </View>

      {/* =====================================
          HEART RATE HERO
      ====================================== */}

      <View style={styles.heartHero}>

        <View style={styles.heroHeader}>

          <View>
            <Text style={styles.heroLabel}>
              HEART RATE
            </Text>

            <Text style={styles.heroSubLabel}>
              Beats per minute
            </Text>
          </View>

          {/* White badge gives strong
              contrast on red background */}

          <View style={styles.heroIconOuter}>

            <View style={styles.heroIcon}>

              <Text style={styles.heroHeart}>
                ♥
              </Text>

            </View>

          </View>

        </View>

        {/* MAIN BPM */}

        <View style={styles.bigReadingRow}>

          <Text style={styles.bigReading}>
            {heartRate}
          </Text>

          <Text style={styles.bigUnit}>
            BPM
          </Text>

        </View>

        {/* SENSOR STATE */}

        <View style={styles.sensorState}>

          <View
            style={[
              styles.sensorStateDot,

              sensorReady
                ? styles.sensorStateActive
                : styles.sensorStateWaiting,
            ]}
          />

          <Text style={styles.sensorStateText}>
            {sensorReady
              ? 'Receiving live sensor data'
              : bluetooth.status ===
                'NO_CONTACT'
              ? 'Waiting for finger contact'
              : bluetooth.connected
              ? 'Waiting for sensor data'
              : 'Heart Monitor not connected'}
          </Text>

        </View>

        {/* ECG VISUAL */}

        <View style={styles.ecgArea}>

          <View style={styles.ecgLine} />

          <View style={styles.ecgPulse}>

            <View style={styles.ecgSmall} />

            <View style={styles.ecgTall} />

            <View style={styles.ecgDown} />

            <View style={styles.ecgMedium} />

          </View>

          <View style={styles.ecgLine} />

        </View>

        {/* HERO FOOTER */}

        <View style={styles.heroBottom}>

          <View>
            <Text style={styles.heroBottomLabel}>
              Reading Status
            </Text>

            <Text style={styles.heroBottomValue}>
              {sensorReady
                ? 'Live'
                : 'Waiting'}
            </Text>
          </View>

          <View style={styles.heroBottomRight}>

            <Text style={styles.heroBottomLabel}>
              Last Updated
            </Text>

            <Text style={styles.heroBottomValue}>
              {formatLastUpdated()}
            </Text>

          </View>

        </View>

      </View>

      {/* =====================================
          BLOOD OXYGEN
      ====================================== */}

      <View style={styles.oxygenCard}>

        <View style={styles.oxygenIcon}>

          <Text style={styles.oxygenIconText}>
            O₂
          </Text>

        </View>

        <View style={styles.oxygenContent}>

          <Text style={styles.oxygenLabel}>
            Blood Oxygen
          </Text>

          <Text style={styles.oxygenDescription}>
            Oxygen saturation
          </Text>

          <View style={styles.oxygenLiveRow}>

            <View
              style={[
                styles.oxygenDot,

                sensorReady &&
                  styles.oxygenDotActive,
              ]}
            />

            <Text style={styles.oxygenLiveText}>
              {sensorReady
                ? 'Live reading'
                : 'Waiting for sensor'}
            </Text>

          </View>

        </View>

        <View style={styles.oxygenReading}>

          <Text style={styles.oxygenValue}>
            {spo2}
          </Text>

          <Text style={styles.oxygenUnit}>
            %
          </Text>

        </View>

      </View>

      {/* =====================================
          SENSOR CONTACT WARNING
      ====================================== */}

      {bluetooth.status ===
      'NO_CONTACT' ? (
        <View style={styles.warningCard}>

          <View style={styles.warningIcon}>

            <Text style={styles.warningSymbol}>
              !
            </Text>

          </View>

          <View style={styles.warningContent}>

            <Text style={styles.warningTitle}>
              Sensor contact lost
            </Text>

            <Text style={styles.warningText}>
              Place your finger back on the
              sensor and keep it steady.
              Readings should resume
              automatically when contact is
              detected.
            </Text>

          </View>

        </View>
      ) : null}

      {/* =====================================
          NO DATA WARNING
      ====================================== */}

      {bluetooth.status ===
      'NO_DATA' ? (
        <View style={styles.warningCard}>

          <View style={styles.warningIcon}>

            <Text style={styles.warningSymbol}>
              !
            </Text>

          </View>

          <View style={styles.warningContent}>

            <Text style={styles.warningTitle}>
              No sensor data
            </Text>

            <Text style={styles.warningText}>
              The Heart Monitor is connected,
              but new readings are not being
              received. Check the sensor and
              device connection.
            </Text>

          </View>

        </View>
      ) : null}

      {/* =====================================
          SENSOR ERROR
      ====================================== */}

      {bluetooth.status ===
      'ERROR' ? (
        <View style={styles.errorCard}>

          <View style={styles.errorIcon}>

            <Text style={styles.errorSymbol}>
              !
            </Text>

          </View>

          <View style={styles.warningContent}>

            <Text style={styles.errorTitle}>
              Sensor error
            </Text>

            <Text style={styles.warningText}>
              Check the Heart Monitor and
              Bluetooth connection. Reconnect
              the device if the problem
              continues.
            </Text>

          </View>

        </View>
      ) : null}

      {/* =====================================
          MONITORING SESSION HEADER
      ====================================== */}

      <View style={styles.sectionHeader}>

        <View>
          <Text style={styles.sectionTitle}>
            Monitoring Session
          </Text>

          <Text style={styles.sectionSubtitle}>
            Save valid readings to your
            session history
          </Text>
        </View>

        {monitoring ? (
          <View style={styles.recordingBadge}>

            <View style={styles.recordingDot} />

            <Text style={styles.recordingText}>
              RECORDING
            </Text>

          </View>
        ) : null}

      </View>

      {/* =====================================
          SESSION CARD
      ====================================== */}

      <View style={styles.sessionCard}>

        <View style={styles.sessionRow}>

          <View style={styles.sessionIcon}>

            <Text style={styles.sessionHeart}>
              ♥
            </Text>

          </View>

          <View style={styles.sessionContent}>

            <Text style={styles.sessionLabel}>
              SESSION STATUS
            </Text>

            <Text
              style={[
                styles.sessionValue,

                monitoring &&
                  styles.sessionActive,
              ]}>
              {monitoring
                ? sensorReady
                  ? 'Recording live health data'
                  : 'Recording — waiting for valid data'
                : 'Monitoring not started'}
            </Text>

          </View>

        </View>

        <View style={styles.divider} />

        <View style={styles.sessionDetails}>

          <View style={styles.detailBlock}>

            <Text style={styles.detailLabel}>
              Session ID
            </Text>

            <Text
              numberOfLines={1}
              style={styles.detailValue}>
              {sessionId ?? '--'}
            </Text>

          </View>

          <View style={styles.detailRight}>

            <Text style={styles.detailLabel}>
              Storage
            </Text>

            <Text
              style={[
                styles.detailValue,

                monitoring &&
                  styles.storageActive,
              ]}>
              {monitoring
                ? 'Active'
                : 'Inactive'}
            </Text>

          </View>

        </View>

        <View style={styles.divider} />

        <View style={styles.databaseInfo}>

          <View style={styles.databaseIcon}>

            <Text style={styles.databaseSymbol}>
              ✓
            </Text>

          </View>

          <Text style={styles.databaseText}>
            Only valid sensor readings are
            saved during an active monitoring
            session.
          </Text>

        </View>

      </View>

      {/* =====================================
          PRIMARY ACTION
      ====================================== */}

      {!bluetooth.connected ? (
        <AppButton
          title="Connect Heart Monitor"
          onPress={onConnectDevice}
        />
      ) : (
        <AppButton
          title={
            monitoring
              ? 'Stop & Save Session'
              : 'Start Monitoring'
          }
          variant={
            monitoring
              ? 'danger'
              : 'primary'
          }
          onPress={() =>
            void toggleMonitoring()
          }
        />
      )}

      <AppButton
        title="Back to Dashboard"
        variant="secondary"
        onPress={onBack}
      />

      {/* =====================================
          MEDICAL DISCLAIMER
      ====================================== */}

      <View style={styles.disclaimerCard}>

        <View style={styles.disclaimerIconBox}>

          <Text style={styles.disclaimerIcon}>
            +
          </Text>

        </View>

        <View style={styles.disclaimerContent}>

          <Text style={styles.disclaimerTitle}>
            Medical Disclaimer
          </Text>

          <Text style={styles.disclaimerText}>
            Heart Monitor displays sensor
            measurements and is not a
            substitute for professional
            medical diagnosis or emergency
            care.
          </Text>

        </View>

      </View>

      {/* =====================================
          FOOTER
      ====================================== */}

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

// ============================================
// STYLES
// ============================================

const styles =
  StyleSheet.create({
    // ========================================
    // DEVICE STATUS
    // ========================================

    statusCard: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 20,

      padding: 15,

      marginTop: 2,

      marginBottom: 18,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.04,

      shadowRadius: 8,

      elevation: 1,
    },

    statusLeft: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      paddingRight: 8,
    },

    statusIcon: {
      width: 46,
      height: 46,

      borderRadius: 15,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 11,
    },

    statusIconConnected: {
      backgroundColor:
        colors.successSoft,

      borderWidth: 1,

      borderColor:
        colors.success,
    },

    statusHeart: {
      color:
        colors.primary,

      fontSize: 23,

      lineHeight: 27,
    },

    statusContent: {
      flex: 1,
    },

    statusLabel: {
      color:
        colors.textLight,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.9,
    },

    statusTitle: {
      color:
        colors.text,

      fontSize: 12,

      fontWeight: '900',

      marginTop: 2,
    },

    statusSubtitle: {
      color:
        colors.textSecondary,

      fontSize: 8,

      marginTop: 2,
    },

    liveBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.successSoft,

      paddingHorizontal: 9,

      paddingVertical: 6,

      borderRadius: 12,
    },

    offlineBadge: {
      backgroundColor:
        colors.primarySoft,
    },

    liveDot: {
      width: 6,
      height: 6,

      borderRadius: 3,

      backgroundColor:
        colors.success,

      marginRight: 5,
    },

    offlineDot: {
      backgroundColor:
        colors.primary,
    },

    liveText: {
      color:
        colors.success,

      fontSize: 8,

      fontWeight: '900',
    },

    offlineText: {
      color:
        colors.primary,
    },

    // ========================================
    // HEART HERO
    // ========================================

    heartHero: {
      backgroundColor:
        colors.primary,

      borderRadius: 26,

      padding: 20,

      marginBottom: 14,

      overflow: 'hidden',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 7,
      },

      shadowOpacity: 0.18,

      shadowRadius: 12,

      elevation: 5,
    },

    heroHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    heroLabel: {
      color:
        colors.white,

      fontSize: 11,

      fontWeight: '900',

      letterSpacing: 1.2,
    },

    heroSubLabel: {
      color:
        'rgba(255,255,255,0.70)',

      fontSize: 9,

      marginTop: 3,
    },

    heroIconOuter: {
      width: 58,
      height: 58,

      borderRadius: 19,

      backgroundColor:
        'rgba(255,255,255,0.18)',

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    heroIcon: {
      width: 46,
      height: 46,

      borderRadius: 15,

      backgroundColor:
        colors.white,

      justifyContent:
        'center',

      alignItems:
        'center',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.15,

      shadowRadius: 6,

      elevation: 3,
    },

    heroHeart: {
      color:
        colors.primary,

      fontSize: 27,

      lineHeight: 31,
    },

    bigReadingRow: {
      flexDirection: 'row',

      alignItems: 'baseline',

      marginTop: 10,
    },

    bigReading: {
      color:
        colors.white,

      fontSize: 60,

      lineHeight: 69,

      fontWeight: '900',

      letterSpacing: -1.5,
    },

    bigUnit: {
      color:
        'rgba(255,255,255,0.78)',

      fontSize: 13,

      fontWeight: '800',

      marginLeft: 7,
    },

    sensorState: {
      alignSelf:
        'flex-start',

      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        'rgba(255,255,255,0.14)',

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 14,

      marginTop: 2,
    },

    sensorStateDot: {
      width: 6,
      height: 6,

      borderRadius: 3,

      marginRight: 6,
    },

    sensorStateActive: {
      backgroundColor:
        '#6EE7B7',
    },

    sensorStateWaiting: {
      backgroundColor:
        colors.white,
    },

    sensorStateText: {
      color:
        colors.white,

      fontSize: 8,

      fontWeight: '700',
    },

    // ========================================
    // ECG
    // ========================================

    ecgArea: {
      height: 50,

      flexDirection: 'row',

      alignItems: 'center',

      overflow: 'hidden',

      marginVertical: 8,
    },

    ecgLine: {
      flex: 1,

      height: 2,

      backgroundColor:
        'rgba(255,255,255,0.55)',
    },

    ecgPulse: {
      width: 75,

      height: 45,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',
    },

    ecgSmall: {
      width: 13,

      height: 2,

      backgroundColor:
        colors.white,

      transform: [
        {
          rotate: '-35deg',
        },
      ],
    },

    ecgTall: {
      width: 2,

      height: 36,

      backgroundColor:
        colors.white,

      transform: [
        {
          rotate: '15deg',
        },
      ],
    },

    ecgDown: {
      width: 2,

      height: 26,

      backgroundColor:
        colors.white,

      transform: [
        {
          rotate: '-25deg',
        },
      ],
    },

    ecgMedium: {
      width: 20,

      height: 2,

      backgroundColor:
        colors.white,

      transform: [
        {
          rotate: '25deg',
        },
      ],
    },

    // ========================================
    // HERO FOOTER
    // ========================================

    heroBottom: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      borderTopWidth: 1,

      borderTopColor:
        'rgba(255,255,255,0.18)',

      paddingTop: 13,
    },

    heroBottomRight: {
      alignItems:
        'flex-end',
    },

    heroBottomLabel: {
      color:
        'rgba(255,255,255,0.58)',

      fontSize: 8,
    },

    heroBottomValue: {
      color:
        colors.white,

      fontSize: 9,

      fontWeight: '800',

      marginTop: 2,
    },

    // ========================================
    // OXYGEN
    // ========================================

    oxygenCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 20,

      padding: 15,

      marginBottom: 17,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.04,

      shadowRadius: 8,

      elevation: 1,
    },

    oxygenIcon: {
      width: 48,
      height: 48,

      borderRadius: 15,

      backgroundColor:
        colors.oxygenSoft,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 12,
    },

    oxygenIconText: {
      color:
        colors.oxygen,

      fontSize: 17,

      fontWeight: '900',
    },

    oxygenContent: {
      flex: 1,
    },

    oxygenLabel: {
      color:
        colors.text,

      fontSize: 13,

      fontWeight: '900',
    },

    oxygenDescription: {
      color:
        colors.textSecondary,

      fontSize: 9,

      marginTop: 2,
    },

    oxygenLiveRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop: 6,
    },

    oxygenDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      backgroundColor:
        colors.disabled,

      marginRight: 5,
    },

    oxygenDotActive: {
      backgroundColor:
        colors.success,
    },

    oxygenLiveText: {
      color:
        colors.textLight,

      fontSize: 8,

      fontWeight: '600',
    },

    oxygenReading: {
      flexDirection:
        'row',

      alignItems:
        'baseline',
    },

    oxygenValue: {
      color:
        colors.oxygen,

      fontSize: 32,

      fontWeight: '900',

      letterSpacing: -0.5,
    },

    oxygenUnit: {
      color:
        colors.textSecondary,

      fontSize: 10,

      fontWeight: '800',

      marginLeft: 3,
    },

    // ========================================
    // WARNING
    // ========================================

    warningCard: {
      flexDirection: 'row',

      backgroundColor:
        colors.warningSoft,

      borderWidth: 1,

      borderColor:
        '#F5D89A',

      borderRadius: 17,

      padding: 14,

      marginBottom: 15,
    },

    warningIcon: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 10,
    },

    warningSymbol: {
      color:
        colors.warning,

      fontSize: 18,

      fontWeight: '900',
    },

    warningContent: {
      flex: 1,
    },

    warningTitle: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    warningText: {
      color:
        colors.textSecondary,

      fontSize: 9,

      lineHeight: 14,

      marginTop: 3,
    },

    // ========================================
    // ERROR
    // ========================================

    errorCard: {
      flexDirection: 'row',

      backgroundColor:
        colors.errorSoft,

      borderWidth: 1,

      borderColor:
        '#F5C7D0',

      borderRadius: 17,

      padding: 14,

      marginBottom: 15,
    },

    errorIcon: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 10,
    },

    errorSymbol: {
      color:
        colors.error,

      fontSize: 18,

      fontWeight: '900',
    },

    errorTitle: {
      color:
        colors.error,

      fontSize: 11,

      fontWeight: '900',
    },

    // ========================================
    // SECTION
    // ========================================

    sectionHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      marginTop: 5,

      marginBottom: 11,
    },

    sectionTitle: {
      color:
        colors.text,

      fontSize: 16,

      fontWeight: '900',
    },

    sectionSubtitle: {
      color:
        colors.textLight,

      fontSize: 8,

      marginTop: 2,
    },

    recordingBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.primarySoft,

      borderRadius: 11,

      paddingHorizontal: 8,

      paddingVertical: 6,
    },

    recordingDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      backgroundColor:
        colors.primary,

      marginRight: 5,
    },

    recordingText: {
      color:
        colors.primary,

      fontSize: 7,

      fontWeight: '900',
    },

    // ========================================
    // SESSION
    // ========================================

    sessionCard: {
      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 20,

      padding: 16,

      marginBottom: 18,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.04,

      shadowRadius: 8,

      elevation: 1,
    },

    sessionRow: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    sessionIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      backgroundColor:
        colors.primarySoft,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 11,
    },

    sessionHeart: {
      color:
        colors.primary,

      fontSize: 21,
    },

    sessionContent: {
      flex: 1,
    },

    sessionLabel: {
      color:
        colors.textLight,

      fontSize: 7,

      fontWeight: '800',

      letterSpacing: 0.6,
    },

    sessionValue: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '800',

      marginTop: 3,
    },

    sessionActive: {
      color:
        colors.success,
    },

    divider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginVertical: 14,
    },

    sessionDetails: {
      flexDirection: 'row',

      justifyContent:
        'space-between',
    },

    detailBlock: {
      flex: 1,
    },

    detailRight: {
      flex: 1,

      alignItems:
        'flex-end',
    },

    detailLabel: {
      color:
        colors.textLight,

      fontSize: 8,
    },

    detailValue: {
      color:
        colors.text,

      fontSize: 10,

      fontWeight: '800',

      marginTop: 3,

      maxWidth: 160,
    },

    storageActive: {
      color:
        colors.success,
    },

    databaseInfo: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    databaseIcon: {
      width: 26,
      height: 26,

      borderRadius: 8,

      backgroundColor:
        colors.successSoft,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 8,
    },

    databaseSymbol: {
      color:
        colors.success,

      fontSize: 12,

      fontWeight: '900',
    },

    databaseText: {
      flex: 1,

      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 13,
    },

    // ========================================
    // DISCLAIMER
    // ========================================

    disclaimerCard: {
      flexDirection: 'row',

      backgroundColor:
        colors.infoSoft,

      borderRadius: 17,

      padding: 14,

      marginTop: 17,

      borderWidth: 1,

      borderColor:
        '#D9E9FF',
    },

    disclaimerIconBox: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 11,
    },

    disclaimerIcon: {
      color:
        colors.info,

      fontSize: 22,

      fontWeight: '900',
    },

    disclaimerContent: {
      flex: 1,
    },

    disclaimerTitle: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    disclaimerText: {
      color:
        colors.textSecondary,

      fontSize: 9,

      lineHeight: 14,

      marginTop: 3,
    },

    // ========================================
    // FOOTER
    // ========================================

    footer: {
      color:
        colors.primary,

      textAlign:
        'center',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 0.4,

      paddingVertical: 18,
    },

    footerCompany: {
      color:
        colors.textLight,

      fontWeight: '600',
    },
  });