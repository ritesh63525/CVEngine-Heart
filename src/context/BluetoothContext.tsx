import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Device,
  Subscription,
} from 'react-native-ble-plx';

import {
  connectDevice,
  disconnectDevice,
  listenForDisconnect,
  monitorSensorData,
  readDeviceRssi,
  requestBluetoothPermissions,
  scanDevices,
  setAutoReconnect,
  stopScan,
} from '../ble/bleService';

import {
  BluetoothState,
} from '../types';

import {
  useSettings,
} from './SettingsContext';

type BluetoothContextType = {
  bluetooth: BluetoothState;

  availableDevices: Device[];

  scanning: boolean;

  scan: () => Promise<void>;

  stopScanning: () => void;

  connectToDevice: (
    device: Device,
  ) => Promise<void>;

  disconnect: () => Promise<void>;
};

const initialState: BluetoothState = {
  deviceId: null,

  deviceName: null,

  connected: false,

  status: 'DISCONNECTED',

  heartRate: null,

  spo2: null,

  rssi: null,

  lastUpdated: null,
};

const BluetoothContext =
  createContext<
    BluetoothContextType | undefined
  >(undefined);

export function BluetoothProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    settings,
  } = useSettings();

  const [
    bluetooth,
    setBluetooth,
  ] = useState<BluetoothState>(
    initialState,
  );

  const [
    availableDevices,
    setAvailableDevices,
  ] = useState<Device[]>([]);

  const [
    scanning,
    setScanning,
  ] = useState(false);

  const connectedDeviceRef =
    useRef<Device | null>(null);

  const monitorSubscriptionRef =
    useRef<Subscription | null>(
      null,
    );

  const disconnectSubscriptionRef =
    useRef<Subscription | null>(
      null,
    );

  const scanTimeoutRef =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  const monitorRecoveryTimerRef =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  const recoveringMonitorRef =
    useRef(false);

  // ==========================================
  // AUTO RECONNECT SETTING
  // ==========================================

  useEffect(() => {
    setAutoReconnect(
      settings.autoReconnectEnabled,
    );
  }, [
    settings.autoReconnectEnabled,
  ]);

  // ==========================================
  // CLEAR MONITOR RECOVERY TIMER
  // ==========================================

  function clearMonitorRecoveryTimer() {
    if (
      monitorRecoveryTimerRef.current
    ) {
      clearTimeout(
        monitorRecoveryTimerRef.current,
      );

      monitorRecoveryTimerRef.current =
        null;
    }
  }

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      stopScan();

      clearMonitorRecoveryTimer();

      monitorSubscriptionRef
        .current
        ?.remove();

      disconnectSubscriptionRef
        .current
        ?.remove();

      if (
        scanTimeoutRef.current
      ) {
        clearTimeout(
          scanTimeoutRef.current,
        );
      }
    };
  }, []);

  // ==========================================
  // SCAN
  // ==========================================

  async function scan() {
    const allowed =
      await requestBluetoothPermissions();

    if (!allowed) {
      setBluetooth(
        previous => ({
          ...previous,

          status: 'ERROR',
        }),
      );

      return;
    }

    stopScan();

    setAvailableDevices([]);

    setScanning(true);

    setBluetooth(
      previous => ({
        ...previous,

        status: 'SEARCHING',

        heartRate: null,

        spo2: null,
      }),
    );

    scanDevices(
      device => {
        setAvailableDevices(
          previous => {
            const existingIndex =
              previous.findIndex(
                item =>
                  item.id ===
                  device.id,
              );

            /*
             * Device may be discovered
             * again with updated RSSI.
             *
             * Replace it instead of
             * creating duplicates.
             */

            if (
              existingIndex !== -1
            ) {
              const updated = [
                ...previous,
              ];

              updated[
                existingIndex
              ] = device;

              return updated;
            }

            return [
              ...previous,
              device,
            ];
          },
        );
      },

      message => {
        console.log(
          'BLE scan error:',
          message,
        );

        setScanning(false);

        setBluetooth(
          previous => ({
            ...previous,

            status: 'ERROR',
          }),
        );
      },
    );

    if (
      scanTimeoutRef.current
    ) {
      clearTimeout(
        scanTimeoutRef.current,
      );
    }

    scanTimeoutRef.current =
      setTimeout(() => {
        stopScanning();
      }, 15000);
  }

  // ==========================================
  // STOP SCANNING
  // ==========================================

  function stopScanning() {
    stopScan();

    setScanning(false);

    setBluetooth(
      previous => ({
        ...previous,

        status:
          previous.connected
            ? previous.status
            : 'DISCONNECTED',
      }),
    );

    if (
      scanTimeoutRef.current
    ) {
      clearTimeout(
        scanTimeoutRef.current,
      );

      scanTimeoutRef.current =
        null;
    }
  }

  // ==========================================
  // REFRESH RSSI
  // ==========================================

  async function updateRssi(
    device: Device,
  ) {
    try {
      const rssi =
        await readDeviceRssi(
          device,
        );

      setBluetooth(
        previous => ({
          ...previous,
          rssi,
        }),
      );
    } catch {
      // RSSI is optional.
    }
  }

  // ==========================================
  // SENSOR MONITORING
  // ==========================================

  async function startSensorMonitoring(
    device: Device,
  ) {
    clearMonitorRecoveryTimer();

    monitorSubscriptionRef
      .current
      ?.remove();

    monitorSubscriptionRef.current =
      null;

    monitorSubscriptionRef.current =
      await monitorSensorData(
        device,

        packet => {
          /*
           * Any new packet means BLE
           * notifications are alive.
           */

          recoveringMonitorRef.current =
            false;

          clearMonitorRecoveryTimer();

          // ----------------------------------
          // FINGER REMOVED
          // ----------------------------------

          if (
            packet.status ===
            'NO_CONTACT'
          ) {
            setBluetooth(
              previous => ({
                ...previous,

                connected: true,

                status:
                  'NO_CONTACT',

                heartRate: null,

                spo2: null,

                lastUpdated:
                  new Date()
                    .toISOString(),
              }),
            );

            /*
             * IMPORTANT:
             *
             * Do NOT stop the BLE
             * subscription here.
             *
             * We keep listening so the
             * moment the finger is placed
             * back and ESP sends OK,
             * readings resume automatically.
             */

            return;
          }

          // ----------------------------------
          // SENSOR ERROR / INVALID
          // ----------------------------------

          if (
            packet.status ===
              'ERROR' ||
            packet.status ===
              'INVALID'
          ) {
            setBluetooth(
              previous => ({
                ...previous,

                connected: true,

                status: 'ERROR',

                heartRate: null,

                spo2: null,

                lastUpdated:
                  new Date()
                    .toISOString(),
              }),
            );

            return;
          }

          // ----------------------------------
          // VALID LIVE READING
          // ----------------------------------

          if (
            packet.status ===
            'OK' &&
            packet.heartRate !==
              null &&
            packet.spo2 !==
              null
          ) {
            setBluetooth(
              previous => ({
                ...previous,

                connected: true,

                status: 'READING',

                heartRate:
                  packet.heartRate,

                spo2:
                  packet.spo2,

                lastUpdated:
                  new Date()
                    .toISOString(),
              }),
            );

            /*
             * Do not read RSSI for every
             * sensor packet. Native RSSI
             * requests can compete with the
             * live notification stream.
             */
          }
        },

        message => {
          console.log(
            'BLE monitor error:',
            message,
          );

          setBluetooth(
            previous => ({
              ...previous,

              connected: true,

              status: 'NO_DATA',

              heartRate: null,

              spo2: null,

              lastUpdated:
                new Date()
                  .toISOString(),
            }),
          );

          scheduleMonitorRecovery();
        },
      );
  }

  // ==========================================
  // MONITOR RECOVERY
  // ==========================================

  function scheduleMonitorRecovery() {
    if (
      recoveringMonitorRef.current
    ) {
      return;
    }

    const device =
      connectedDeviceRef.current;

    if (!device) {
      return;
    }

    recoveringMonitorRef.current =
      true;

    clearMonitorRecoveryTimer();

    monitorRecoveryTimerRef.current =
      setTimeout(() => {
        const currentDevice =
          connectedDeviceRef.current;

        if (!currentDevice) {
          recoveringMonitorRef.current =
            false;

          return;
        }

        void startSensorMonitoring(
          currentDevice,
        )
          .then(() => {
            recoveringMonitorRef.current =
              false;
          })
          .catch(error => {
            console.log(
              'BLE monitor recovery failed:',
              error,
            );

            recoveringMonitorRef.current =
              false;

            /*
             * Try again after another
             * short interval while device
             * remains connected.
             */

            scheduleMonitorRecovery();
          });
      }, 2000);
  }

  // ==========================================
  // NO-DATA RECOVERY
  // ==========================================

  useEffect(() => {
    if (!bluetooth.connected) {
      return;
    }

    if (
      bluetooth.status !==
      'NO_DATA'
    ) {
      return;
    }

    scheduleMonitorRecovery();
  }, [
    bluetooth.connected,
    bluetooth.status,
  ]);

  // ==========================================
  // CONNECT SELECTED DEVICE
  // ==========================================

  async function connectToDevice(
    device: Device,
  ) {
    try {
      stopScanning();

      clearMonitorRecoveryTimer();

      recoveringMonitorRef.current =
        false;

      setBluetooth(
        previous => ({
          ...previous,

          deviceId:
            device.id,

          deviceName:
            device.name ??
            device.localName ??
            'Heart Monitor',

          connected: false,

          status: 'CONNECTING',

          heartRate: null,

          spo2: null,

          lastUpdated: null,
        }),
      );

      const connected =
        await connectDevice(
          device,
        );

      connectedDeviceRef.current =
        connected;

      setBluetooth(
        previous => ({
          ...previous,

          deviceId:
            connected.id,

          deviceName:
            connected.name ??
            connected.localName ??
            device.name ??
            device.localName ??
            'Heart Monitor',

          connected: true,

          status: 'CONNECTED',

          heartRate: null,

          spo2: null,

          rssi: null,

          lastUpdated: null,
        }),
      );

      // --------------------------------------
      // DISCONNECT LISTENER
      // --------------------------------------

      disconnectSubscriptionRef
        .current
        ?.remove();

      disconnectSubscriptionRef.current =
        listenForDisconnect(
          connected,

          () => {
            clearMonitorRecoveryTimer();

            recoveringMonitorRef.current =
              false;

            connectedDeviceRef.current =
              null;

            monitorSubscriptionRef
              .current
              ?.remove();

            monitorSubscriptionRef.current =
              null;

            setBluetooth(
              previous => ({
                ...previous,

                connected: false,

                status:
                  'DISCONNECTED',

                heartRate: null,

                spo2: null,

                rssi: null,

                lastUpdated: null,
              }),
            );
          },
        );

      // --------------------------------------
      // START REAL SENSOR STREAM
      // --------------------------------------

      await startSensorMonitoring(
        connected,
      );

      /*
       * RSSI is optional. Read it only after
       * the live sensor subscription starts,
       * without blocking incoming readings.
       */
      void updateRssi(
        connected,
      );
    } catch (error) {
      console.log(
        'Bluetooth connection error:',
        error,
      );

      clearMonitorRecoveryTimer();

      recoveringMonitorRef.current =
        false;

      connectedDeviceRef.current =
        null;

      setBluetooth(
        previous => ({
          ...previous,

          connected: false,

          status: 'ERROR',

          heartRate: null,

          spo2: null,

          rssi: null,

          lastUpdated: null,
        }),
      );

      throw error;
    }
  }

  // ==========================================
  // DISCONNECT
  // ==========================================

  async function disconnect() {
    stopScanning();

    clearMonitorRecoveryTimer();

    recoveringMonitorRef.current =
      false;

    monitorSubscriptionRef
      .current
      ?.remove();

    disconnectSubscriptionRef
      .current
      ?.remove();

    monitorSubscriptionRef.current =
      null;

    disconnectSubscriptionRef.current =
      null;

    const device =
      connectedDeviceRef.current;

    if (device) {
      await disconnectDevice(
        device,
      );
    }

    connectedDeviceRef.current =
      null;

    setAvailableDevices([]);

    setBluetooth(
      initialState,
    );
  }

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <BluetoothContext.Provider
      value={{
        bluetooth,

        availableDevices,

        scanning,

        scan,

        stopScanning,

        connectToDevice,

        disconnect,
      }}>
      {children}
    </BluetoothContext.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================

export function useBluetooth() {
  const context =
    useContext(
      BluetoothContext,
    );

  if (!context) {
    throw new Error(
      'useBluetooth must be used inside BluetoothProvider',
    );
  }

  return context;
}
