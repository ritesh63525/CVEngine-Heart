import React, {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Device,
} from 'react-native-ble-plx';

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
  colors,
} from '../../theme/colors';

type Props = {
  onConnected: () => void;
};

export default function DeviceConnectionScreen({
  onConnected,
}: Props) {
  const {
    bluetooth,
    availableDevices,
    scanning,
    scan,
    stopScanning,
    connectToDevice,
    disconnect,
  } = useBluetooth();

  const [
    connectingId,
    setConnectingId,
  ] = useState<string | null>(null);

  // ==========================================
  // AUTO SCAN
  // ==========================================

  useEffect(() => {
    if (!bluetooth.connected) {
      void scan();
    }

    return () => {
      stopScanning();
    };
  }, []);

  // ==========================================
  // DEVICE HELPERS
  // ==========================================

  function getDeviceName(
    device: Device,
  ) {
    return (
      device.name ??
      device.localName ??
      'Unnamed BLE Device'
    );
  }

  function getSignalText(
    rssi: number | null,
  ) {
    if (rssi === null) {
      return 'Signal unavailable';
    }

    if (rssi >= -60) {
      return 'Excellent signal';
    }

    if (rssi >= -70) {
      return 'Good signal';
    }

    if (rssi >= -80) {
      return 'Fair signal';
    }

    return 'Weak signal';
  }

  function getSignalBars(
    rssi: number | null,
  ) {
    if (rssi === null) {
      return 0;
    }

    if (rssi >= -60) {
      return 4;
    }

    if (rssi >= -70) {
      return 3;
    }

    if (rssi >= -80) {
      return 2;
    }

    return 1;
  }

  // ==========================================
  // CONNECT
  // ==========================================

  async function handleDevicePress(
    device: Device,
  ) {
    try {
      setConnectingId(
        device.id,
      );

      await connectToDevice(
        device,
      );

      setConnectingId(null);
    } catch (error: any) {
      setConnectingId(null);

      Alert.alert(
        'Connection Failed',
        error?.message ??
          'Unable to connect to this Bluetooth device.',
      );
    }
  }

  // ==========================================
  // DISCONNECT
  // ==========================================

  async function handleDisconnect() {
    try {
      await disconnect();

      Alert.alert(
        'Device Disconnected',
        'Your Heart Monitor has been disconnected.',
      );
    } catch (error: any) {
      Alert.alert(
        'Disconnect Failed',
        error?.message ??
          'Unable to disconnect the device.',
      );
    }
  }

  // ==========================================
  // CONNECTED SCREEN
  // ==========================================

  if (bluetooth.connected) {
    return (
      <ScreenContainer>

        <AppHeader
          title="Heart Monitor"
          subtitle="Bluetooth device connection"
        />

        {/* ===================================
            SUCCESS HERO
        ==================================== */}

        <View style={styles.connectedHero}>

          <View style={styles.connectedIconOuter}>

            <View style={styles.connectedIcon}>
              <Text style={styles.connectedHeart}>
                ♥
              </Text>
            </View>

            <View style={styles.connectedCheck}>
              <Text style={styles.checkText}>
                ✓
              </Text>
            </View>

          </View>

          <Text style={styles.connectedTitle}>
            Device Connected
          </Text>

          <Text style={styles.connectedSubtitle}>
            Your Heart Monitor is connected
            and ready to receive live sensor
            readings.
          </Text>

          <View style={styles.successPill}>
            <View style={styles.successDot} />

            <Text style={styles.successPillText}>
              CONNECTION ACTIVE
            </Text>
          </View>

        </View>

        {/* ===================================
            DEVICE INFORMATION
        ==================================== */}

        <Text style={styles.sectionTitle}>
          Connected Device
        </Text>

        <View style={styles.connectedCard}>

          <View style={styles.connectedCardTop}>

            <View style={styles.btBadge}>
              <Text style={styles.btBadgeText}>
                B
              </Text>
            </View>

            <View style={styles.connectedInfo}>

              <Text style={styles.deviceSmallLabel}>
                BLUETOOTH LE
              </Text>

              <Text
                numberOfLines={1}
                style={styles.connectedDeviceName}>
                {bluetooth.deviceName ??
                  'Heart Monitor'}
              </Text>

            </View>

            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />

              <Text style={styles.onlineText}>
                ONLINE
              </Text>
            </View>

          </View>

          <View style={styles.line} />

          <View style={styles.infoRow}>

            <View>
              <Text style={styles.infoLabel}>
                Device Status
              </Text>

              <Text style={styles.infoValue}>
                Ready
              </Text>
            </View>

            <View style={styles.rightInfo}>
              <Text style={styles.infoLabel}>
                Connection
              </Text>

              <Text style={styles.infoValueBlue}>
                Bluetooth LE
              </Text>
            </View>

          </View>

        </View>

        {/* ===================================
            READY CARD
        ==================================== */}

        <View style={styles.readyCard}>

          <View style={styles.readyIconBox}>
            <Text style={styles.readyHeart}>
              ♥
            </Text>
          </View>

          <View style={styles.readyContent}>

            <Text style={styles.readyTitle}>
              Ready to monitor
            </Text>

            <Text style={styles.readyText}>
              Continue to the dashboard to
              view your live heart rate and
              blood oxygen readings.
            </Text>

          </View>

        </View>

        {/* ===================================
            ACTIONS
        ==================================== */}

        <AppButton
          title="Continue to Dashboard"
          onPress={onConnected}
        />

        <AppButton
          title="Disconnect Device"
          variant="secondary"
          onPress={() =>
            void handleDisconnect()
          }
        />

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
  // SCANNING SCREEN
  // ==========================================

  return (
    <ScreenContainer>

      <AppHeader
        title="Connect Device"
        subtitle="Bluetooth Heart Monitor setup"
      />

      {/* =====================================
          BLUETOOTH HERO
      ====================================== */}

      <View style={styles.heroArea}>

        <View style={styles.bluetoothOuter}>

          <View style={styles.bluetoothCircle}>
            <Text style={styles.bluetoothBig}>
              B
            </Text>
          </View>

        </View>

        <Text style={styles.title}>
          Find Your Heart Monitor
        </Text>

        <Text style={styles.description}>
          Keep your Heart Monitor powered on
          and close to your phone while
          connecting.
        </Text>

      </View>

      {/* =====================================
          SCAN STATUS
      ====================================== */}

      <View style={styles.scanStatusCard}>

        <View
          style={[
            styles.scanStatusIcon,

            scanning &&
              styles.scanStatusIconActive,
          ]}>

          <Text style={styles.scanStatusSymbol}>
            B
          </Text>

        </View>

        <View style={styles.scanStatusContent}>

          <Text style={styles.scanStatusTitle}>
            {scanning
              ? 'Scanning nearby devices'
              : 'Bluetooth scan ready'}
          </Text>

          <Text style={styles.scanStatusText}>
            {scanning
              ? 'Nearby Bluetooth LE devices will appear below.'
              : `${availableDevices.length} device${
                  availableDevices.length === 1
                    ? ''
                    : 's'
                } found`}
          </Text>

        </View>

        {scanning ? (
          <View style={styles.scanningBadge}>

            <View style={styles.scanningDot} />

            <Text style={styles.scanningText}>
              SCANNING
            </Text>

          </View>
        ) : null}

      </View>

      {/* =====================================
          DEVICE HEADER
      ====================================== */}

      <View style={styles.listHeader}>

        <Text style={styles.listTitle}>
          Nearby Devices
        </Text>

        <View style={styles.deviceCountBadge}>
          <Text style={styles.deviceCount}>
            {availableDevices.length} found
          </Text>
        </View>

      </View>

      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {availableDevices.length === 0 ? (
        <View style={styles.emptyCard}>

          <View style={styles.emptyIcon}>
            <Text style={styles.emptyBluetooth}>
              B
            </Text>
          </View>

          <Text style={styles.emptyTitle}>
            {scanning
              ? 'Looking for devices...'
              : 'No devices found'}
          </Text>

          <Text style={styles.emptyText}>
            Make sure Bluetooth is enabled
            and your Heart Monitor is powered
            on and nearby.
          </Text>

          {scanning ? (
            <View style={styles.searchingLine}>
              <View style={styles.searchingLineActive} />
            </View>
          ) : null}

        </View>
      ) : (
        <View>

          {availableDevices.map(
            device => {
              const connecting =
                connectingId ===
                device.id;

              const name =
                getDeviceName(
                  device,
                );

              const normalizedName =
                name.toLowerCase();

              const recommended =
                normalizedName.includes(
                  'cvengine',
                ) ||
                normalizedName.includes(
                  'heart',
                );

              const signalBars =
                getSignalBars(
                  device.rssi,
                );

              return (
                <View
                  key={device.id}
                  style={[
                    styles.deviceCard,

                    recommended &&
                      styles.recommendedCard,
                  ]}>

                  {/* DEVICE TOP */}

                  <View style={styles.deviceTop}>

                    <View
                      style={[
                        styles.deviceBadge,

                        recommended &&
                          styles.monitorDeviceBadge,
                      ]}>

                      <Text
                        style={[
                          styles.deviceBadgeText,

                          recommended &&
                            styles.monitorDeviceBadgeText,
                        ]}>
                        {recommended
                          ? '♥'
                          : 'B'}
                      </Text>

                    </View>

                    <View style={styles.deviceInfo}>

                      <View style={styles.nameRow}>

                        <Text
                          numberOfLines={1}
                          style={styles.deviceName}>
                          {name}
                        </Text>

                        {recommended ? (
                          <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedText}>
                              HEART MONITOR
                            </Text>
                          </View>
                        ) : null}

                      </View>

                      <Text
                        numberOfLines={1}
                        style={styles.deviceId}>
                        {device.id}
                      </Text>

                    </View>

                  </View>

                  {/* SIGNAL */}

                  <View style={styles.signalRow}>

                    <View>

                      <Text style={styles.signalLabel}>
                        Signal Strength
                      </Text>

                      <Text style={styles.signalValue}>
                        {getSignalText(
                          device.rssi,
                        )}
                      </Text>

                    </View>

                    <View style={styles.signalRight}>

                      <View style={styles.signalBars}>

                        {[1, 2, 3, 4].map(
                          bar => (
                            <View
                              key={bar}
                              style={[
                                styles.signalBar,

                                {
                                  height:
                                    5 +
                                    bar * 3,
                                },

                                bar <= signalBars
                                  ? styles.signalBarActive
                                  : styles.signalBarInactive,
                              ]}
                            />
                          ),
                        )}

                      </View>

                      <Text style={styles.rssi}>
                        {device.rssi !== null
                          ? `${device.rssi} dBm`
                          : '-- dBm'}
                      </Text>

                    </View>

                  </View>

                  {/* CONNECT */}

                  <Pressable
                    disabled={
                      connectingId !== null
                    }
                    style={({pressed}) => [
                      styles.connectButton,

                      recommended &&
                        styles.monitorConnectButton,

                      connecting &&
                        styles.connectButtonDisabled,

                      pressed &&
                        !connecting &&
                        styles.connectButtonPressed,
                    ]}
                    onPress={() =>
                      void handleDevicePress(
                        device,
                      )
                    }>

                    <Text style={styles.connectButtonText}>
                      {connecting
                        ? 'Connecting...'
                        : recommended
                        ? 'Connect Heart Monitor'
                        : 'Connect Device'}
                    </Text>

                  </Pressable>

                </View>
              );
            },
          )}

        </View>
      )}

      {/* =====================================
          SCAN CONTROLS
      ====================================== */}

      <View style={styles.controls}>

        <AppButton
          title={
            scanning
              ? 'Scanning...'
              : 'Scan Nearby Devices'
          }
          disabled={scanning}
          onPress={() =>
            void scan()
          }
        />

        {scanning ? (
          <AppButton
            title="Stop Scan"
            variant="secondary"
            onPress={stopScanning}
          />
        ) : null}

      </View>

      {/* =====================================
          CONNECTION TIP
      ====================================== */}

      <View style={styles.tipCard}>

        <View style={styles.tipIconBox}>
          <Text style={styles.tipIcon}>
            B
          </Text>
        </View>

        <View style={styles.tipContent}>

          <Text style={styles.tipTitle}>
            Bluetooth Connection Tip
          </Text>

          <Text style={styles.tipText}>
            Keep the monitor close to your
            phone while connecting for a
            stronger and more stable signal.
          </Text>

        </View>

      </View>

      {/* =====================================
          PRIVACY / SENSOR NOTE
      ====================================== */}

      <View style={styles.sensorInfoCard}>

        <View style={styles.sensorInfoIcon}>
          <Text style={styles.sensorInfoHeart}>
            ♥
          </Text>
        </View>

        <View style={styles.sensorInfoContent}>

          <Text style={styles.sensorInfoTitle}>
            Heart Monitor
          </Text>

          <Text style={styles.sensorInfoText}>
            After connection, live BPM and
            SpO₂ readings will appear
            automatically when your finger is
            correctly placed on the sensor.
          </Text>

        </View>

      </View>

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
    // SCAN HERO
    // ========================================

    heroArea: {
      alignItems: 'center',

      paddingTop: 12,

      paddingBottom: 24,
    },

    bluetoothOuter: {
      width: 88,
      height: 88,

      borderRadius: 29,

      backgroundColor:
        colors.bluetoothSoft,

      justifyContent: 'center',
      alignItems: 'center',

      marginBottom: 17,
    },

    bluetoothCircle: {
      width: 66,
      height: 66,

      borderRadius: 22,

      backgroundColor:
        colors.bluetooth,

      justifyContent: 'center',
      alignItems: 'center',

      shadowColor:
        colors.bluetoothDark,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.18,

      shadowRadius: 8,

      elevation: 4,
    },

    bluetoothBig: {
      color: colors.white,

      fontSize: 28,

      fontWeight: '900',
    },

    title: {
      color: colors.text,

      fontSize: 24,

      fontWeight: '900',

      textAlign: 'center',

      letterSpacing: -0.4,
    },

    description: {
      color:
        colors.textSecondary,

      fontSize: 11,

      lineHeight: 17,

      textAlign: 'center',

      marginTop: 6,

      maxWidth: 300,
    },

    // ========================================
    // SCAN STATUS
    // ========================================

    scanStatusCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 19,

      padding: 14,

      marginBottom: 23,

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

    scanStatusIcon: {
      width: 43,
      height: 43,

      borderRadius: 13,

      backgroundColor:
        colors.bluetoothSoft,

      justifyContent: 'center',
      alignItems: 'center',

      marginRight: 11,
    },

    scanStatusIconActive: {
      borderWidth: 1,

      borderColor:
        colors.bluetooth,
    },

    scanStatusSymbol: {
      color:
        colors.bluetooth,

      fontSize: 17,

      fontWeight: '900',
    },

    scanStatusContent: {
      flex: 1,
    },

    scanStatusTitle: {
      color: colors.text,

      fontSize: 12,

      fontWeight: '900',
    },

    scanStatusText: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 12,

      marginTop: 3,
    },

    scanningBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.bluetoothSoft,

      borderRadius: 11,

      paddingHorizontal: 8,

      paddingVertical: 6,
    },

    scanningDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      backgroundColor:
        colors.bluetooth,

      marginRight: 5,
    },

    scanningText: {
      color:
        colors.bluetooth,

      fontSize: 7,

      fontWeight: '900',
    },

    // ========================================
    // DEVICE LIST
    // ========================================

    listHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      marginBottom: 11,
    },

    listTitle: {
      color: colors.text,

      fontSize: 16,

      fontWeight: '900',
    },

    deviceCountBadge: {
      backgroundColor:
        colors.cardSoft,

      borderRadius: 10,

      paddingHorizontal: 8,

      paddingVertical: 5,
    },

    deviceCount: {
      color:
        colors.textSecondary,

      fontSize: 8,

      fontWeight: '700',
    },

    // ========================================
    // EMPTY
    // ========================================

    emptyCard: {
      alignItems: 'center',

      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 21,

      padding: 26,

      marginBottom: 18,
    },

    emptyIcon: {
      width: 50,
      height: 50,

      borderRadius: 16,

      backgroundColor:
        colors.bluetoothSoft,

      justifyContent: 'center',

      alignItems: 'center',
    },

    emptyBluetooth: {
      color:
        colors.bluetooth,

      fontSize: 19,

      fontWeight: '900',
    },

    emptyTitle: {
      color: colors.text,

      fontSize: 14,

      fontWeight: '900',

      marginTop: 13,
    },

    emptyText: {
      color:
        colors.textSecondary,

      fontSize: 10,

      lineHeight: 16,

      textAlign: 'center',

      marginTop: 5,

      maxWidth: 255,
    },

    searchingLine: {
      width: 120,

      height: 4,

      borderRadius: 2,

      backgroundColor:
        colors.border,

      marginTop: 17,

      overflow: 'hidden',
    },

    searchingLineActive: {
      width: 70,

      height: 4,

      borderRadius: 2,

      backgroundColor:
        colors.bluetooth,
    },

    // ========================================
    // DEVICE CARD
    // ========================================

    deviceCard: {
      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 20,

      padding: 15,

      marginBottom: 12,

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

    recommendedCard: {
      borderWidth: 1.5,

      borderColor:
        colors.primary,
    },

    deviceTop: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    deviceBadge: {
      width: 45,
      height: 45,

      borderRadius: 14,

      backgroundColor:
        colors.bluetoothSoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 11,
    },

    monitorDeviceBadge: {
      backgroundColor:
        colors.primarySoft,
    },

    deviceBadgeText: {
      color:
        colors.bluetooth,

      fontSize: 16,

      fontWeight: '900',
    },

    monitorDeviceBadgeText: {
      color:
        colors.primary,

      fontSize: 22,
    },

    deviceInfo: {
      flex: 1,
    },

    nameRow: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    deviceName: {
      color: colors.text,

      fontSize: 13,

      fontWeight: '900',

      maxWidth: '62%',
    },

    recommendedBadge: {
      backgroundColor:
        colors.primarySoft,

      borderRadius: 8,

      paddingHorizontal: 6,

      paddingVertical: 3,

      marginLeft: 7,
    },

    recommendedText: {
      color:
        colors.primary,

      fontSize: 6,

      fontWeight: '900',
    },

    deviceId: {
      color:
        colors.textLight,

      fontSize: 8,

      marginTop: 3,
    },

    // ========================================
    // SIGNAL
    // ========================================

    signalRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      backgroundColor:
        colors.background,

      borderRadius: 13,

      padding: 11,

      marginTop: 13,
    },

    signalLabel: {
      color:
        colors.textLight,

      fontSize: 8,
    },

    signalValue: {
      color: colors.text,

      fontSize: 10,

      fontWeight: '800',

      marginTop: 2,
    },

    signalRight: {
      alignItems: 'flex-end',
    },

    signalBars: {
      height: 20,

      flexDirection: 'row',

      alignItems: 'flex-end',

      marginBottom: 3,
    },

    signalBar: {
      width: 3,

      borderRadius: 2,

      marginLeft: 2,
    },

    signalBarActive: {
      backgroundColor:
        colors.bluetooth,
    },

    signalBarInactive: {
      backgroundColor:
        colors.borderDark,
    },

    rssi: {
      color:
        colors.textSecondary,

      fontSize: 8,

      fontWeight: '700',
    },

    // ========================================
    // CONNECT BUTTON
    // ========================================

    connectButton: {
      minHeight: 43,

      backgroundColor:
        colors.bluetooth,

      borderRadius: 13,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginTop: 12,
    },

    monitorConnectButton: {
      backgroundColor:
        colors.primary,
    },

    connectButtonDisabled: {
      opacity: 0.55,
    },

    connectButtonPressed: {
      opacity: 0.88,

      transform: [
        {
          scale: 0.99,
        },
      ],
    },

    connectButtonText: {
      color:
        colors.white,

      fontSize: 11,

      fontWeight: '900',
    },

    controls: {
      marginTop: 4,
    },

    // ========================================
    // TIP
    // ========================================

    tipCard: {
      flexDirection: 'row',

      backgroundColor:
        colors.infoSoft,

      borderWidth: 1,

      borderColor:
        '#D9E9FF',

      borderRadius: 17,

      padding: 14,

      marginTop: 17,
    },

    tipIconBox: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },

    tipIcon: {
      color:
        colors.bluetooth,

      fontSize: 16,

      fontWeight: '900',
    },

    tipContent: {
      flex: 1,
    },

    tipTitle: {
      color: colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    tipText: {
      color:
        colors.textSecondary,

      fontSize: 9,

      lineHeight: 14,

      marginTop: 3,
    },

    // ========================================
    // SENSOR INFO
    // ========================================

    sensorInfoCard: {
      flexDirection: 'row',

      backgroundColor:
        colors.primarySoft,

      borderRadius: 17,

      padding: 14,

      marginTop: 12,

      borderWidth: 1,

      borderColor:
        colors.heartSoft,
    },

    sensorInfoIcon: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },

    sensorInfoHeart: {
      color:
        colors.primary,

      fontSize: 20,
    },

    sensorInfoContent: {
      flex: 1,
    },

    sensorInfoTitle: {
      color: colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    sensorInfoText: {
      color:
        colors.textSecondary,

      fontSize: 9,

      lineHeight: 14,

      marginTop: 3,
    },

    // ========================================
    // CONNECTED HERO
    // ========================================

    connectedHero: {
      alignItems: 'center',

      paddingTop: 17,

      paddingBottom: 28,
    },

    connectedIconOuter: {
      width: 92,
      height: 92,

      borderRadius: 30,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',

      alignItems: 'center',

      position: 'relative',
    },

    connectedIcon: {
      width: 70,
      height: 70,

      borderRadius: 23,

      backgroundColor:
        colors.primary,

      justifyContent: 'center',

      alignItems: 'center',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.18,

      shadowRadius: 8,

      elevation: 4,
    },

    connectedHeart: {
      color:
        colors.white,

      fontSize: 37,

      lineHeight: 42,
    },

    connectedCheck: {
      position: 'absolute',

      right: -2,

      bottom: -2,

      width: 29,
      height: 29,

      borderRadius: 15,

      backgroundColor:
        colors.success,

      borderWidth: 3,

      borderColor:
        colors.background,

      justifyContent: 'center',

      alignItems: 'center',
    },

    checkText: {
      color:
        colors.white,

      fontSize: 12,

      fontWeight: '900',
    },

    connectedTitle: {
      color: colors.text,

      fontSize: 24,

      fontWeight: '900',

      marginTop: 17,

      letterSpacing: -0.4,
    },

    connectedSubtitle: {
      color:
        colors.textSecondary,

      fontSize: 10,

      lineHeight: 16,

      marginTop: 5,

      textAlign: 'center',

      maxWidth: 285,
    },

    successPill: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.successSoft,

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 14,

      marginTop: 13,
    },

    successDot: {
      width: 6,
      height: 6,

      borderRadius: 3,

      backgroundColor:
        colors.success,

      marginRight: 6,
    },

    successPillText: {
      color:
        colors.success,

      fontSize: 7,

      fontWeight: '900',
    },

    // ========================================
    // CONNECTED CARD
    // ========================================

    sectionTitle: {
      color: colors.text,

      fontSize: 16,

      fontWeight: '900',

      marginBottom: 10,
    },

    connectedCard: {
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

    connectedCardTop: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    btBadge: {
      width: 44,
      height: 44,

      borderRadius: 14,

      backgroundColor:
        colors.bluetoothSoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 11,
    },

    btBadgeText: {
      color:
        colors.bluetooth,

      fontSize: 16,

      fontWeight: '900',
    },

    connectedInfo: {
      flex: 1,
    },

    deviceSmallLabel: {
      color:
        colors.textLight,

      fontSize: 7,

      fontWeight: '800',

      letterSpacing: 0.6,
    },

    connectedDeviceName: {
      color:
        colors.text,

      fontSize: 13,

      fontWeight: '900',

      marginTop: 3,
    },

    onlineBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.successSoft,

      borderRadius: 11,

      paddingHorizontal: 8,

      paddingVertical: 6,
    },

    onlineDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      backgroundColor:
        colors.success,

      marginRight: 5,
    },

    onlineText: {
      color:
        colors.success,

      fontSize: 7,

      fontWeight: '900',
    },

    line: {
      height: 1,

      backgroundColor:
        colors.border,

      marginVertical: 14,
    },

    infoRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',
    },

    rightInfo: {
      alignItems: 'flex-end',
    },

    infoLabel: {
      color:
        colors.textLight,

      fontSize: 8,
    },

    infoValue: {
      color: colors.text,

      fontSize: 10,

      fontWeight: '800',

      marginTop: 3,
    },

    infoValueBlue: {
      color:
        colors.bluetooth,

      fontSize: 10,

      fontWeight: '800',

      marginTop: 3,
    },

    // ========================================
    // READY CARD
    // ========================================

    readyCard: {
      flexDirection: 'row',

      backgroundColor:
        colors.primarySoft,

      borderRadius: 18,

      padding: 14,

      marginBottom: 18,

      borderWidth: 1,

      borderColor:
        colors.heartSoft,
    },

    readyIconBox: {
      width: 40,
      height: 40,

      borderRadius: 13,

      backgroundColor:
        colors.white,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 11,
    },

    readyHeart: {
      color:
        colors.primary,

      fontSize: 21,
    },

    readyContent: {
      flex: 1,
    },

    readyTitle: {
      color:
        colors.text,

      fontSize: 12,

      fontWeight: '900',
    },

    readyText: {
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