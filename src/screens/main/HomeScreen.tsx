import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenContainer
  from '../../components/ScreenContainer';

import AppButton
  from '../../components/AppButton';

import ReadingCard
  from '../../components/ReadingCard';

import LiveHeartWave
  from '../../components/LiveHeartWave';

import {useAuth}
  from '../../context/AuthContext';

import {useBluetooth}
  from '../../context/BluetoothContext';

import {useMonitoring}
  from '../../context/MonitoringContext';

import {colors}
  from '../../theme/colors';

type Props = {
  onOpenLiveMonitor: () => void;
  onOpenDevice: () => void;
};

export default function HomeScreen({
  onOpenLiveMonitor,
  onOpenDevice,
}: Props) {
  const {user} = useAuth();

  const {bluetooth} =
    useBluetooth();

  const {
    monitoring,
    startMonitoring,
    stopMonitoring,
  } = useMonitoring();

  const firstName =
    user?.fullName
      ?.trim()
      .split(/\s+/)[0] ??
    'User';

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
      },
    );
  }

  async function handleMonitoring() {
    if (!bluetooth.connected) {
      onOpenDevice();
      return;
    }

    if (monitoring) {
      await stopMonitoring();
      return;
    }

    await startMonitoring();
  }

  return (
    <ScreenContainer>

      {/* =====================================
          HEADER
      ====================================== */}

      <View style={styles.header}>

        <View style={styles.headerContent}>
          <Text style={styles.welcomeLabel}>
            WELCOME BACK
          </Text>

          <Text style={styles.hello}>
            Hello, {firstName}
          </Text>

          <Text style={styles.headerSubtitle}>
            Keep track of your heart health
            today.
          </Text>
        </View>

        <View style={styles.profile}>
          <Text style={styles.profileText}>
            {firstName
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>

      </View>

      {/* =====================================
          HERO CARD
      ====================================== */}

      <View style={styles.heroCard}>

        <View style={styles.heroTop}>

          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>
              HEART MONITOR
            </Text>

            <Text style={styles.heroTitle}>
              Heart Health
            </Text>
          </View>

          {/* HIGH-CONTRAST HEART */}

          <View style={styles.heroHeartOuter}>
            <View style={styles.heroHeartInner}>
              <Text style={styles.heroHeartText}>
                ♥
              </Text>
            </View>
          </View>

        </View>

        <Text style={styles.heroDescription}>
          {bluetooth.connected
            ? monitoring
              ? 'Your monitoring session is active and receiving live heart data.'
              : 'Your heart monitor is connected and ready to start.'
            : 'Connect your Heart Monitor to start receiving live health readings.'}
        </Text>

        <View style={styles.connectionPill}>

          <View
            style={[
              styles.statusDot,

              bluetooth.connected
                ? styles.statusConnected
                : styles.statusDisconnected,
            ]}
          />

          <Text style={styles.connectionText}>
            {bluetooth.connected
              ? 'Device Connected'
              : 'Device Disconnected'}
          </Text>

        </View>

        {/* LIVE HEART WAVE */}

        <View style={styles.liveWaveArea}>
          <LiveHeartWave
            bpm={bluetooth.heartRate}
            isConnected={bluetooth.connected}
            hasValidReading={
              bluetooth.status === 'READING' &&
              bluetooth.heartRate !== null &&
              bluetooth.spo2 !== null
            }
            width={280}
            height={92}
          />
        </View>

      </View>

      {/* =====================================
          LIVE VITALS
      ====================================== */}

      <View style={styles.sectionHeader}>

        <View>
          <Text style={styles.sectionTitle}>
            Live Vitals
          </Text>

          <Text style={styles.sectionSubtitle}>
            Real-time sensor measurements
          </Text>
        </View>

        <Text style={styles.updated}>
          {formatLastUpdated()}
        </Text>

      </View>

      <View style={styles.vitalRow}>

        <ReadingCard
          type="heart"
          value={
            bluetooth.heartRate
          }
        />

        <View style={styles.vitalGap} />

        <ReadingCard
          type="oxygen"
          value={
            bluetooth.spo2
          }
        />

      </View>

      {/* =====================================
          SENSOR WARNING
      ====================================== */}

      {bluetooth.connected &&
      bluetooth.status ===
        'NO_CONTACT' ? (
        <View style={styles.warningCard}>

          <View style={styles.warningIcon}>
            <Text style={styles.warningHeart}>
              ♥
            </Text>
          </View>

          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>
              Sensor contact lost
            </Text>

            <Text style={styles.warningText}>
              Place your finger back on the
              sensor and keep it steady.
              Readings will resume
              automatically.
            </Text>
          </View>

        </View>
      ) : null}

      {/* =====================================
          QUICK ACTIONS
      ====================================== */}

      <View style={styles.quickHeading}>
        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>
      </View>

      <View style={styles.quickRow}>

        {/* BLUETOOTH */}

        <Pressable
          style={({pressed}) => [
            styles.quickCard,
            pressed &&
              styles.cardPressed,
          ]}
          onPress={onOpenDevice}>

          <View style={styles.bluetoothIcon}>
            <Text style={styles.bluetoothSymbol}>
              B
            </Text>
          </View>

          <Text style={styles.quickTitle}>
            Bluetooth
          </Text>

          <Text style={styles.quickDescription}>
            {bluetooth.connected
              ? 'Manage connected device'
              : 'Connect heart monitor'}
          </Text>

          <Text style={styles.quickArrowBlue}>
            →
          </Text>

        </Pressable>

        <View style={styles.quickGap} />

        {/* LIVE MONITOR */}

        <Pressable
          style={({pressed}) => [
            styles.quickCard,
            pressed &&
              styles.cardPressed,
          ]}
          onPress={
            onOpenLiveMonitor
          }>

          <View style={styles.monitorIcon}>
            <Text style={styles.monitorHeart}>
              ♥
            </Text>
          </View>

          <Text style={styles.quickTitle}>
            Live Monitor
          </Text>

          <Text style={styles.quickDescription}>
            View live BPM and oxygen
          </Text>

          <Text style={styles.quickArrowRed}>
            →
          </Text>

        </Pressable>

      </View>

      {/* =====================================
          DEVICE STATUS
      ====================================== */}

      <Text style={styles.sectionTitle}>
        Device Status
      </Text>

      <View style={styles.deviceCard}>

        <View style={styles.deviceHeader}>

          <View style={styles.deviceIcon}>
            <Text style={styles.deviceHeart}>
              ♥
            </Text>
          </View>

          <View style={styles.deviceContent}>

            <Text style={styles.deviceLabel}>
              HEART MONITOR
            </Text>

            <Text style={styles.deviceName}>
              {bluetooth.deviceName ??
                'No device connected'}
            </Text>

          </View>

          <View
            style={[
              styles.statusBadge,

              bluetooth.connected
                ? styles.onlineBadge
                : styles.offlineBadge,
            ]}>

            <View
              style={[
                styles.badgeDot,

                bluetooth.connected
                  ? styles.badgeDotOnline
                  : styles.badgeDotOffline,
              ]}
            />

            <Text
              style={[
                styles.statusBadgeText,

                bluetooth.connected
                  ? styles.onlineText
                  : styles.offlineText,
              ]}>
              {bluetooth.connected
                ? 'ONLINE'
                : 'OFFLINE'}
            </Text>

          </View>

        </View>

        <View style={styles.deviceDivider} />

        <View style={styles.deviceBottom}>

          <View>
            <Text style={styles.deviceBottomLabel}>
              Monitoring
            </Text>

            <Text
              style={[
                styles.deviceBottomValue,

                monitoring &&
                  styles.recordingText,
              ]}>
              {monitoring
                ? '● Recording'
                : 'Not recording'}
            </Text>
          </View>

          <View style={styles.deviceRight}>
            <Text style={styles.deviceBottomLabel}>
              Last Update
            </Text>

            <Text style={styles.deviceBottomValue}>
              {formatLastUpdated()}
            </Text>
          </View>

        </View>

      </View>

      {/* =====================================
          PRIMARY ACTION
      ====================================== */}

      {!bluetooth.connected ? (
        <AppButton
          title="Connect Heart Monitor"
          onPress={onOpenDevice}
        />
      ) : (
        <>
          <AppButton
            title={
              monitoring
                ? 'Stop Monitoring'
                : 'Start Monitoring'
            }
            variant={
              monitoring
                ? 'danger'
                : 'primary'
            }
            onPress={
              handleMonitoring
            }
          />

          <AppButton
            title="Open Live Monitor"
            variant="secondary"
            onPress={
              onOpenLiveMonitor
            }
          />
        </>
      )}

      {/* =====================================
          PRIVACY
      ====================================== */}

      <View style={styles.privacyCard}>

        <View style={styles.privacyIcon}>
          <Text style={styles.privacySymbol}>
            ✓
          </Text>
        </View>

        <View style={styles.privacyContent}>
          <Text style={styles.privacyTitle}>
            Your health. Your privacy.
          </Text>

          <Text style={styles.privacyText}>
            Monitoring readings are securely
            stored on your device.
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

const styles =
  StyleSheet.create({
    // ========================================
    // HEADER
    // ========================================

    header: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 23,
    },

    headerContent: {
      flex: 1,
      paddingRight: 12,
    },

    welcomeLabel: {
      color: colors.primary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.3,
      marginBottom: 4,
    },

    hello: {
      color: colors.text,
      fontSize: 26,
      fontWeight: '900',
      letterSpacing: -0.5,
    },

    headerSubtitle: {
      color:
        colors.textSecondary,
      fontSize: 11,
      lineHeight: 16,
      marginTop: 4,
    },

    profile: {
      width: 48,
      height: 48,
      borderRadius: 16,

      backgroundColor:
        colors.primary,

      justifyContent: 'center',
      alignItems: 'center',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.16,
      shadowRadius: 7,

      elevation: 3,
    },

    profileText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: '900',
    },

    // ========================================
    // HERO
    // ========================================

    heroCard: {
      backgroundColor:
        colors.primary,

      borderRadius: 26,

      padding: 20,

      marginBottom: 26,

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

    heroTop: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    heroContent: {
      flex: 1,
      paddingRight: 15,
    },

    heroLabel: {
      color:
        'rgba(255,255,255,0.76)',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.5,
    },

    heroTitle: {
      color: colors.white,

      fontSize: 25,

      fontWeight: '900',

      letterSpacing: -0.5,

      marginTop: 3,
    },

    /*
     * Main fix:
     * red card -> WHITE tile -> RED heart.
     * Heart can no longer disappear.
     */

    heroHeartOuter: {
      width: 58,
      height: 58,

      borderRadius: 19,

      backgroundColor:
        'rgba(255,255,255,0.18)',

      justifyContent: 'center',
      alignItems: 'center',
    },

    heroHeartInner: {
      width: 46,
      height: 46,

      borderRadius: 15,

      backgroundColor:
        colors.white,

      justifyContent: 'center',
      alignItems: 'center',
    },

    heroHeartText: {
      color: colors.primary,

      fontSize: 27,

      lineHeight: 31,
    },

    heroDescription: {
      color:
        'rgba(255,255,255,0.88)',

      fontSize: 11,

      lineHeight: 17,

      marginTop: 15,

      maxWidth: 285,
    },

    connectionPill: {
      alignSelf:
        'flex-start',

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.white,

      paddingHorizontal: 11,

      paddingVertical: 7,

      borderRadius: 20,

      marginTop: 15,
    },

    statusDot: {
      width: 7,
      height: 7,

      borderRadius: 4,

      marginRight: 7,
    },

    statusConnected: {
      backgroundColor:
        colors.success,
    },

    statusDisconnected: {
      backgroundColor:
        colors.primary,
    },

    connectionText: {
      color: colors.text,

      fontSize: 9,

      fontWeight: '900',
    },

    liveWaveArea: {
      width: '100%',
      alignItems: 'center',
      marginTop: 12,
    },

    // ========================================
    // SECTIONS
    // ========================================

    sectionHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'flex-end',

      marginBottom: 12,
    },

    sectionTitle: {
      color: colors.text,

      fontSize: 17,

      fontWeight: '900',
    },

    sectionSubtitle: {
      color:
        colors.textLight,

      fontSize: 9,

      marginTop: 2,
    },

    updated: {
      color:
        colors.textLight,

      fontSize: 9,
    },

    // ========================================
    // VITALS
    // ========================================

    vitalRow: {
      flexDirection: 'row',

      marginBottom: 25,
    },

    vitalGap: {
      width: 10,
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

      marginTop: -10,

      marginBottom: 23,
    },

    warningIcon: {
      width: 40,
      height: 40,

      borderRadius: 13,

      backgroundColor:
        colors.white,

      justifyContent: 'center',
      alignItems: 'center',

      marginRight: 11,
    },

    warningHeart: {
      color: colors.warning,
      fontSize: 20,
    },

    warningContent: {
      flex: 1,
    },

    warningTitle: {
      color: colors.text,

      fontSize: 12,

      fontWeight: '900',
    },

    warningText: {
      color:
        colors.textSecondary,

      fontSize: 10,

      lineHeight: 15,

      marginTop: 3,
    },

    // ========================================
    // QUICK ACTIONS
    // ========================================

    quickHeading: {
      marginBottom: 11,
    },

    quickRow: {
      flexDirection: 'row',

      marginBottom: 26,
    },

    quickGap: {
      width: 10,
    },

    quickCard: {
      flex: 1,

      minHeight: 145,

      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 20,

      padding: 15,

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

    cardPressed: {
      opacity: 0.88,

      transform: [
        {
          scale: 0.985,
        },
      ],
    },

    bluetoothIcon: {
      width: 39,
      height: 39,

      borderRadius: 13,

      backgroundColor:
        colors.bluetoothSoft,

      justifyContent: 'center',
      alignItems: 'center',

      marginBottom: 12,
    },

    bluetoothSymbol: {
      color:
        colors.bluetooth,

      fontSize: 16,

      fontWeight: '900',
    },

    monitorIcon: {
      width: 39,
      height: 39,

      borderRadius: 13,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',
      alignItems: 'center',

      marginBottom: 12,
    },

    monitorHeart: {
      color: colors.primary,

      fontSize: 21,
    },

    quickTitle: {
      color: colors.text,

      fontSize: 13,

      fontWeight: '900',
    },

    quickDescription: {
      color:
        colors.textSecondary,

      fontSize: 9,

      lineHeight: 13,

      marginTop: 4,
    },

    quickArrowBlue: {
      color:
        colors.bluetooth,

      fontSize: 17,

      fontWeight: '900',

      marginTop: 8,
    },

    quickArrowRed: {
      color:
        colors.primary,

      fontSize: 17,

      fontWeight: '900',

      marginTop: 8,
    },

    // ========================================
    // DEVICE
    // ========================================

    deviceCard: {
      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 21,

      padding: 16,

      marginTop: 11,

      marginBottom: 20,

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

    deviceHeader: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    deviceIcon: {
      width: 44,
      height: 44,

      borderRadius: 14,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',
      alignItems: 'center',

      marginRight: 11,
    },

    deviceHeart: {
      color: colors.primary,

      fontSize: 22,
    },

    deviceContent: {
      flex: 1,
    },

    deviceLabel: {
      color:
        colors.textLight,

      fontSize: 8,

      fontWeight: '800',

      letterSpacing: 0.7,
    },

    deviceName: {
      color: colors.text,

      fontSize: 12,

      fontWeight: '900',

      marginTop: 3,
    },

    statusBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      borderRadius: 14,

      paddingHorizontal: 8,

      paddingVertical: 6,
    },

    onlineBadge: {
      backgroundColor:
        colors.successSoft,
    },

    offlineBadge: {
      backgroundColor:
        colors.primarySoft,
    },

    badgeDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      marginRight: 5,
    },

    badgeDotOnline: {
      backgroundColor:
        colors.success,
    },

    badgeDotOffline: {
      backgroundColor:
        colors.primary,
    },

    statusBadgeText: {
      fontSize: 7,

      fontWeight: '900',
    },

    onlineText: {
      color: colors.success,
    },

    offlineText: {
      color: colors.primary,
    },

    deviceDivider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginVertical: 14,
    },

    deviceBottom: {
      flexDirection: 'row',

      justifyContent:
        'space-between',
    },

    deviceRight: {
      alignItems: 'flex-end',
    },

    deviceBottomLabel: {
      color:
        colors.textLight,

      fontSize: 9,
    },

    deviceBottomValue: {
      color: colors.text,

      fontSize: 11,

      fontWeight: '800',

      marginTop: 3,
    },

    recordingText: {
      color: colors.primary,
    },

    // ========================================
    // PRIVACY
    // ========================================

    privacyCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.infoSoft,

      borderRadius: 17,

      padding: 14,

      marginTop: 17,

      borderWidth: 1,

      borderColor:
        '#D9E9FF',
    },

    privacyIcon: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      justifyContent: 'center',
      alignItems: 'center',

      marginRight: 11,
    },

    privacySymbol: {
      color: colors.info,

      fontSize: 18,

      fontWeight: '900',
    },

    privacyContent: {
      flex: 1,
    },

    privacyTitle: {
      color: colors.text,

      fontSize: 12,

      fontWeight: '900',
    },

    privacyText: {
      color:
        colors.textSecondary,

      fontSize: 9,

      lineHeight: 14,

      marginTop: 2,
    },

    // ========================================
    // FOOTER
    // ========================================

    footer: {
      color: colors.primary,

      textAlign: 'center',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 0.5,

      paddingVertical: 20,
    },

    footerCompany: {
      color:
        colors.textLight,

      fontWeight: '600',
    },
  });
