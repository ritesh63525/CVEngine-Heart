import React from 'react';

import {
  Alert,
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

import SettingRow
  from '../../components/SettingRow';

import {
  useSettings,
} from '../../context/SettingsContext';

import {
  useBluetooth,
} from '../../context/BluetoothContext';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  colors,
} from '../../theme/colors';

type Props = {
  onBack: () => void;
};

export default function SettingsScreen({
  onBack,
}: Props) {
  const {
    settings,
    setNotifications,
    setSound,
    setVibration,
    setAutoReconnect,
  } = useSettings();

  const {
    bluetooth,
    disconnect,
  } = useBluetooth();

  const {
    logout,
  } = useAuth();

  // ==========================================
  // LOGOUT
  // ==========================================

  async function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',

          onPress: async () => {
            try {
              if (
                bluetooth.connected
              ) {
                await disconnect();
              }

              await logout();
            } catch (error) {
              console.log(
                'Logout error:',
                error,
              );

              Alert.alert(
                'Logout Error',
                'Unable to logout. Please try again.',
              );
            }
          },
        },
      ],
    );
  }

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <ScreenContainer>

      <AppHeader
        title="Settings"
        subtitle="App preferences & device settings"
      />

      {/* =====================================
          HERO
      ====================================== */}

      <View style={styles.heroCard}>

        <View style={styles.heroDecorationOne} />

        <View style={styles.heroDecorationTwo} />

        <View style={styles.heroIconOuter}>

          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>
              ⚙
            </Text>
          </View>

        </View>

        <View style={styles.heroContent}>

          <Text style={styles.heroLabel}>
            APP SETTINGS
          </Text>

          <Text style={styles.heroTitle}>
            Personalize Heart Monitor
          </Text>

          <Text style={styles.heroDescription}>
            Manage alerts, Bluetooth
            preferences and your account.
          </Text>

        </View>

      </View>

      {/* =====================================
          ALERT SETTINGS
      ====================================== */}

      <SectionHeader
        number="1"
        title="Alerts"
        subtitle="Control monitoring notifications"
      />

      <View style={styles.card}>

        <SettingRow
          title="Notifications"
          subtitle="Connection and monitoring alerts"
          value={
            settings.notificationsEnabled
          }
          onValueChange={
            setNotifications
          }
        />

        <SettingRow
          title="Sound Effects"
          subtitle="Play sounds for important events"
          value={
            settings.soundsEnabled
          }
          onValueChange={
            setSound
          }
        />

        <SettingRow
          title="Vibration"
          subtitle="Vibrate for important device events"
          value={
            settings.vibrationEnabled
          }
          onValueChange={
            setVibration
          }
        />

      </View>

      {/* =====================================
          BLUETOOTH SETTINGS
      ====================================== */}

      <SectionHeader
        number="2"
        title="Bluetooth & Device"
        subtitle="Manage your CVengine device"
      />

      <View style={styles.card}>

        <SettingRow
          title="Auto Reconnect"
          subtitle="Automatically reconnect CVengine Watch"
          value={
            settings.autoReconnectEnabled
          }
          onValueChange={
            setAutoReconnect
          }
        />

        <View style={styles.deviceRow}>

          <View
            style={[
              styles.deviceIcon,

              bluetooth.connected
                ? styles.deviceIconConnected
                : styles.deviceIconOffline,
            ]}>

            <Text
              style={[
                styles.bluetoothSymbol,

                bluetooth.connected
                  ? styles.bluetoothConnected
                  : styles.bluetoothOffline,
              ]}>
              B
            </Text>

          </View>

          <View style={styles.deviceInfo}>

            <Text style={styles.deviceLabel}>
              Connected Device
            </Text>

            <Text style={styles.deviceName}>
              {bluetooth.connected
                ? bluetooth.deviceName ??
                  'CVengine Watch'
                : 'No device connected'}
            </Text>

          </View>

          <View
            style={[
              styles.statusBadge,

              bluetooth.connected
                ? styles.connectedBadge
                : styles.offlineBadge,
            ]}>

            <View
              style={[
                styles.statusDot,

                bluetooth.connected
                  ? styles.connectedDot
                  : styles.offlineDot,
              ]}
            />

            <Text
              style={[
                styles.deviceStatus,

                bluetooth.connected
                  ? styles.connected
                  : styles.offline,
              ]}>
              {bluetooth.connected
                ? 'CONNECTED'
                : 'OFFLINE'}
            </Text>

          </View>

        </View>

      </View>

      {/* =====================================
          CONNECTION STATUS
      ====================================== */}

      <View
        style={[
          styles.connectionCard,

          bluetooth.connected
            ? styles.connectionCardConnected
            : styles.connectionCardOffline,
        ]}>

        <View
          style={[
            styles.connectionIcon,

            bluetooth.connected
              ? styles.connectionIconConnected
              : styles.connectionIconOffline,
          ]}>

          <Text
            style={[
              styles.connectionIconText,

              bluetooth.connected
                ? styles.connectionTextConnected
                : styles.connectionTextOffline,
            ]}>
            {bluetooth.connected
              ? '✓'
              : '!'}
          </Text>

        </View>

        <View style={styles.connectionContent}>

          <Text style={styles.connectionTitle}>
            {bluetooth.connected
              ? 'Device Connected'
              : 'Device Not Connected'}
          </Text>

          <Text style={styles.connectionDescription}>
            {bluetooth.connected
              ? 'Your CVengine device is currently connected and ready for monitoring.'
              : 'Connect your CVengine device before starting live monitoring.'}
          </Text>

        </View>

      </View>

      {/* =====================================
          ACCOUNT
      ====================================== */}

      <SectionHeader
        number="3"
        title="Account & Data"
        subtitle="Information about local app storage"
      />

      <View style={styles.infoCard}>

        <View style={styles.infoIcon}>

          <Text style={styles.infoIconText}>
            i
          </Text>

        </View>

        <View style={styles.infoContent}>

          <Text style={styles.infoTitle}>
            Local Data Storage
          </Text>

          <Text style={styles.infoText}>
            Your profile and saved sensor
            readings are stored locally on
            this phone in the current app
            version.
          </Text>

        </View>

      </View>

      {/* =====================================
          LOGOUT AREA
      ====================================== */}

      <View style={styles.accountCard}>

        <View style={styles.accountHeader}>

          <View style={styles.accountIcon}>

            <Text style={styles.accountIconText}>
              ↪
            </Text>

          </View>

          <View style={styles.accountContent}>

            <Text style={styles.accountTitle}>
              Account Session
            </Text>

            <Text style={styles.accountDescription}>
              Logout from Heart Monitor on
              this device.
            </Text>

          </View>

        </View>

        <View style={styles.accountDivider} />

        <Text style={styles.logoutNote}>
          If a Bluetooth device is connected,
          it will be disconnected before
          logout.
        </Text>

      </View>

      {/* =====================================
          BUTTONS
      ====================================== */}

      <AppButton
        title="Logout"
        variant="danger"
        onPress={handleLogout}
      />

      <AppButton
        title="Back"
        variant="secondary"
        onPress={onBack}
      />

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

// ==========================================
// SECTION HEADER
// ==========================================

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>

      <View style={styles.sectionNumber}>
        <Text style={styles.sectionNumberText}>
          {number}
        </Text>
      </View>

      <View style={styles.sectionContent}>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Text style={styles.sectionSubtitle}>
          {subtitle}
        </Text>

      </View>

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

    heroCard: {
      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor:
        colors.primary,

      borderRadius: 23,

      padding: 18,

      marginBottom: 23,

      overflow: 'hidden',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.15,

      shadowRadius: 9,

      elevation: 3,
    },

    heroDecorationOne: {
      position: 'absolute',

      width: 95,
      height: 95,

      borderRadius: 48,

      backgroundColor:
        'rgba(255,255,255,0.08)',

      right: -28,

      top: -38,
    },

    heroDecorationTwo: {
      position: 'absolute',

      width: 65,
      height: 65,

      borderRadius: 33,

      backgroundColor:
        'rgba(255,255,255,0.06)',

      left: -20,

      bottom: -30,
    },

    heroIconOuter: {
      width: 61,
      height: 61,

      borderRadius: 20,

      backgroundColor:
        'rgba(255,255,255,0.16)',

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 13,
    },

    heroIcon: {
      width: 47,
      height: 47,

      borderRadius: 15,

      backgroundColor:
        colors.white,

      alignItems: 'center',

      justifyContent: 'center',
    },

    heroIconText: {
      color:
        colors.primary,

      fontSize: 22,

      fontWeight: '900',
    },

    heroContent: {
      flex: 1,
    },

    heroLabel: {
      color:
        'rgba(255,255,255,0.70)',

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.9,
    },

    heroTitle: {
      color:
        colors.white,

      fontSize: 16,

      fontWeight: '900',

      marginTop: 3,
    },

    heroDescription: {
      color:
        'rgba(255,255,255,0.78)',

      fontSize: 8,

      lineHeight: 13,

      marginTop: 4,
    },

    // ========================================
    // SECTION
    // ========================================

    sectionHeader: {
      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 10,

      marginTop: 2,
    },

    sectionNumber: {
      width: 30,
      height: 30,

      borderRadius: 10,

      backgroundColor:
        colors.primarySoft,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 9,
    },

    sectionNumberText: {
      color:
        colors.primary,

      fontSize: 11,

      fontWeight: '900',
    },

    sectionContent: {
      flex: 1,
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

      marginTop: 1,
    },

    // ========================================
    // SETTINGS CARD
    // ========================================

    card: {
      backgroundColor:
        colors.white,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        colors.border,

      overflow: 'hidden',

      marginBottom: 20,

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

    // ========================================
    // DEVICE
    // ========================================

    deviceRow: {
      minHeight: 76,

      paddingHorizontal: 14,

      paddingVertical: 12,

      flexDirection: 'row',

      alignItems: 'center',

      borderTopWidth: 1,

      borderTopColor:
        colors.border,
    },

    deviceIcon: {
      width: 40,
      height: 40,

      borderRadius: 13,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    deviceIconConnected: {
      backgroundColor:
        colors.oxygenSoft,
    },

    deviceIconOffline: {
      backgroundColor:
        '#F2F4F7',
    },

    bluetoothSymbol: {
      fontSize: 14,

      fontWeight: '900',
    },

    bluetoothConnected: {
      color:
        colors.oxygen,
    },

    bluetoothOffline: {
      color:
        colors.textLight,
    },

    deviceInfo: {
      flex: 1,

      paddingRight: 8,
    },

    deviceLabel: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    deviceName: {
      color:
        colors.textSecondary,

      fontSize: 8,

      marginTop: 3,
    },

    statusBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingHorizontal: 8,

      paddingVertical: 6,

      borderRadius: 10,
    },

    connectedBadge: {
      backgroundColor:
        colors.successSoft,
    },

    offlineBadge: {
      backgroundColor:
        '#F2F4F7',
    },

    statusDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      marginRight: 5,
    },

    connectedDot: {
      backgroundColor:
        colors.success,
    },

    offlineDot: {
      backgroundColor:
        colors.textLight,
    },

    deviceStatus: {
      fontSize: 6,

      fontWeight: '900',
    },

    connected: {
      color:
        colors.success,
    },

    offline: {
      color:
        colors.textSecondary,
    },

    // ========================================
    // CONNECTION CARD
    // ========================================

    connectionCard: {
      flexDirection: 'row',

      alignItems: 'center',

      borderRadius: 17,

      borderWidth: 1,

      padding: 13,

      marginTop: -7,

      marginBottom: 20,
    },

    connectionCardConnected: {
      backgroundColor:
        colors.successSoft,

      borderColor:
        '#D2F2E2',
    },

    connectionCardOffline: {
      backgroundColor:
        colors.warningSoft,

      borderColor:
        '#FDE7B2',
    },

    connectionIcon: {
      width: 36,
      height: 36,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    connectionIconConnected: {},

    connectionIconOffline: {},

    connectionIconText: {
      fontSize: 14,

      fontWeight: '900',
    },

    connectionTextConnected: {
      color:
        colors.success,
    },

    connectionTextOffline: {
      color:
        colors.warning,
    },

    connectionContent: {
      flex: 1,
    },

    connectionTitle: {
      color:
        colors.text,

      fontSize: 10,

      fontWeight: '900',
    },

    connectionDescription: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 13,

      marginTop: 2,
    },

    // ========================================
    // INFO CARD
    // ========================================

    infoCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.oxygenSoft,

      borderRadius: 17,

      borderWidth: 1,

      borderColor:
        '#D9E9FF',

      padding: 14,

      marginBottom: 13,
    },

    infoIcon: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    infoIconText: {
      color:
        colors.oxygen,

      fontSize: 15,

      fontWeight: '900',
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

    infoText: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 13,

      marginTop: 3,
    },

    // ========================================
    // ACCOUNT
    // ========================================

    accountCard: {
      backgroundColor:
        colors.white,

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        colors.border,

      padding: 14,

      marginBottom: 14,
    },

    accountHeader: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    accountIcon: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.primarySoft,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    accountIconText: {
      color:
        colors.primary,

      fontSize: 17,

      fontWeight: '900',
    },

    accountContent: {
      flex: 1,
    },

    accountTitle: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    accountDescription: {
      color:
        colors.textSecondary,

      fontSize: 8,

      marginTop: 2,
    },

    accountDivider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginVertical: 11,
    },

    logoutNote: {
      color:
        colors.textLight,

      fontSize: 8,

      lineHeight: 13,
    },

    // ========================================
    // FOOTER
    // ========================================

    footer: {
      color:
        colors.primary,

      textAlign: 'center',

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