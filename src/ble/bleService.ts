import {
  BleManager,
  Device,
  Subscription,
} from 'react-native-ble-plx';

import {
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {Buffer} from 'buffer';

import {BLE_CONFIG} from './bleConfig';

import {
  parseBLEData,
  ParsedBLEData,
} from './bleParser';

const manager = new BleManager();

let connectedDevice: Device | null = null;

let monitorSubscription: Subscription | null = null;

let disconnectSubscription: Subscription | null = null;

let noDataTimer:
  | ReturnType<typeof setTimeout>
  | null = null;

let reconnectAttempts = 0;

let shouldReconnect = true;

let scanning = false;

// ==========================================
// CALLBACK TYPES
// ==========================================

export type BLECallbacks = {
  onSearching?: () => void;

  onConnecting?: (
    device: Device,
  ) => void;

  onConnected?: (
    device: Device,
  ) => void;

  onDisconnected?: () => void;

  onReconnecting?: (
    attempt: number,
  ) => void;

  onReading?: (
    data: ParsedBLEData,
  ) => void;

  onNoContact?: () => void;

  onError?: (
    message: string,
  ) => void;

  onNoData?: () => void;
};

let callbacks: BLECallbacks = {};

// ==========================================
// SENSOR PACKET TYPE
// ==========================================

export type SensorPacket = {
  heartRate: number | null;
  spo2: number | null;

  status:
    | 'OK'
    | 'NO_CONTACT'
    | 'ERROR'
    | 'INVALID';
};

// ==========================================
// SET CALLBACKS
// ==========================================

export function setBLECallbacks(
  value: BLECallbacks,
) {
  callbacks = value;
}

// ==========================================
// ANDROID PERMISSIONS
// ==========================================

export async function requestBluetoothPermissions() {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (Platform.Version >= 31) {
    const result =
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS
          .BLUETOOTH_SCAN,

        PermissionsAndroid.PERMISSIONS
          .BLUETOOTH_CONNECT,
      ]);

    return (
      result[
        PermissionsAndroid.PERMISSIONS
          .BLUETOOTH_SCAN
      ] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      result[
        PermissionsAndroid.PERMISSIONS
          .BLUETOOTH_CONNECT
      ] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }

  const result =
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS
        .ACCESS_FINE_LOCATION,
    );

  return (
    result ===
    PermissionsAndroid.RESULTS.GRANTED
  );
}

// App.tsx compatibility name
export const requestBlePermissions =
  requestBluetoothPermissions;

// ==========================================
// NO DATA WATCHDOG
// ==========================================

function resetNoDataTimer() {
  if (noDataTimer) {
    clearTimeout(noDataTimer);
  }

  noDataTimer = setTimeout(() => {
    if (connectedDevice) {
      callbacks.onNoData?.();
    }
  }, BLE_CONFIG.NO_DATA_TIMEOUT_MS);
}

// ==========================================
// LEGACY CALLBACK MONITOR
// ==========================================

function startMonitoring(
  device: Device,
) {
  monitorSubscription?.remove();

  monitorSubscription =
    device.monitorCharacteristicForService(
      BLE_CONFIG.SERVICE_UUID,
      BLE_CONFIG.CHARACTERISTIC_UUID,

      (error, characteristic) => {
        if (error) {
          callbacks.onError?.(
            error.message,
          );
          return;
        }

        if (!characteristic?.value) {
          return;
        }

        resetNoDataTimer();

        try {
          const decoded =
            Buffer.from(
              characteristic.value,
              'base64',
            ).toString('utf8');

          const parsed =
            parseBLEData(decoded);

          if (
            parsed.status ===
            'NO_CONTACT'
          ) {
            callbacks.onNoContact?.();
            return;
          }

          if (
            parsed.status ===
              'ERROR' ||
            parsed.status ===
              'INVALID'
          ) {
            callbacks.onError?.(
              'Invalid sensor reading',
            );
            return;
          }

          callbacks.onReading?.(
            parsed,
          );
        } catch {
          callbacks.onError?.(
            'Unable to decode sensor data',
          );
        }
      },
    );
}

// ==========================================
// CONNECT DEVICE
// Used directly by App.tsx
// ==========================================

export async function connectDevice(
  device: Device,
): Promise<Device> {
  callbacks.onConnecting?.(
    device,
  );

  try {
    shouldReconnect = true;

    const connected =
      await device.connect({
        autoConnect: false,
      });

    const discovered =
      await connected
        .discoverAllServicesAndCharacteristics();

    connectedDevice =
      discovered;

    reconnectAttempts = 0;

    callbacks.onConnected?.(
      discovered,
    );

    /*
     * IMPORTANT:
     *
     * We intentionally DO NOT call
     * startMonitoring() here.
     *
     * App.tsx calls monitorSensorData()
     * after connection, so starting another
     * characteristic monitor here would
     * create duplicate subscriptions.
     */

    disconnectSubscription?.remove();

    return discovered;
  } catch (error: any) {
    connectedDevice = null;

    callbacks.onError?.(
      error?.message ??
        'Bluetooth connection failed',
    );

    throw error;
  }
}

// ==========================================
// CONNECT DEVICE BY ID
// Used for auto reconnect
// ==========================================

export async function connectDeviceById(
  deviceId: string,
): Promise<Device> {
  try {
    const connected =
      await manager.connectToDevice(
        deviceId,
        {
          autoConnect: false,
        },
      );

    const discovered =
      await connected
        .discoverAllServicesAndCharacteristics();

    connectedDevice =
      discovered;

    reconnectAttempts = 0;

    return discovered;
  } catch (error) {
    connectedDevice = null;
    throw error;
  }
}

// ==========================================
// MANUAL DEVICE SCAN
// Used by device-selection screen
// ==========================================

export function scanDevices(
  onDevice: (
    device: Device,
  ) => void,

  onError: (
    message: string,
  ) => void,
) {
  try {
    if (scanning) {
      manager.stopDeviceScan();
    }

    scanning = true;

    manager.startDeviceScan(
      null,
      {
        allowDuplicates: false,
      },

      (error, device) => {
        if (error) {
          scanning = false;

          manager.stopDeviceScan();

          onError(
            error.message,
          );

          return;
        }

        if (!device) {
          return;
        }

        onDevice(device);
      },
    );
  } catch (error: any) {
    scanning = false;

    onError(
      error?.message ??
        'Unable to scan Bluetooth devices',
    );
  }
}

// ==========================================
// STOP SCAN
// ==========================================

export function stopScan() {
  scanning = false;

  try {
    manager.stopDeviceScan();
  } catch {
    // Scan may already be stopped.
  }
}

// ==========================================
// DIRECT CVENGINE WATCH CONNECTION
// ==========================================

export async function connectCVengineWatch() {
  if (scanning) {
    return;
  }

  const allowed =
    await requestBluetoothPermissions();

  if (!allowed) {
    callbacks.onError?.(
      'Bluetooth permission denied',
    );
    return;
  }

  shouldReconnect = true;

  scanning = true;

  callbacks.onSearching?.();

  manager.startDeviceScan(
    null,
    {
      allowDuplicates: false,
    },

    (error, device) => {
      if (error) {
        scanning = false;

        manager.stopDeviceScan();

        callbacks.onError?.(
          error.message,
        );

        return;
      }

      if (!device) {
        return;
      }

      const name =
        device.name ??
        device.localName ??
        '';

      if (
        name
          .trim()
          .toLowerCase() ===
        BLE_CONFIG.DEVICE_NAME
          .toLowerCase()
      ) {
        scanning = false;

        manager.stopDeviceScan();

        void connectDevice(
          device,
        ).catch(() => {
          if (shouldReconnect) {
            scheduleReconnect();
          }
        });
      }
    },
  );

  setTimeout(() => {
    if (!scanning) {
      return;
    }

    scanning = false;

    manager.stopDeviceScan();

    callbacks.onError?.(
      'CVengine Watch not found',
    );
  }, BLE_CONFIG.SCAN_TIMEOUT_MS);
}

// ==========================================
// AUTO RECONNECT
// ==========================================

function scheduleReconnect() {
  if (!shouldReconnect) {
    return;
  }

  if (
    reconnectAttempts >=
    BLE_CONFIG.MAX_RECONNECT_ATTEMPTS
  ) {
    callbacks.onError?.(
      'Unable to reconnect to CVengine Watch',
    );

    return;
  }

  reconnectAttempts++;

  callbacks.onReconnecting?.(
    reconnectAttempts,
  );

  setTimeout(() => {
    if (!shouldReconnect) {
      return;
    }

    void connectCVengineWatch();
  }, BLE_CONFIG.RECONNECT_DELAY_MS);
}

// ==========================================
// MONITOR SENSOR DATA
// Main App.tsx monitor
// ==========================================

export async function monitorSensorData(
  device: Device,

  onData: (
    packet: SensorPacket,
  ) => void | Promise<void>,

  onError: (
    message: string,
  ) => void | Promise<void>,
): Promise<Subscription> {
  monitorSubscription?.remove();

  const subscription =
    device.monitorCharacteristicForService(
      BLE_CONFIG.SERVICE_UUID,
      BLE_CONFIG.CHARACTERISTIC_UUID,

      (error, characteristic) => {
        if (error) {
          void onError(
            error.message,
          );
          return;
        }

        if (!characteristic?.value) {
          return;
        }

        resetNoDataTimer();

        try {
          const decoded =
            Buffer.from(
              characteristic.value,
              'base64',
            ).toString('utf8');

          const parsed =
            parseBLEData(decoded);

          const packet: SensorPacket = {
            heartRate:
              parsed.heartRate ??
              null,

            spo2:
              parsed.spo2 ??
              null,

            status:
              parsed.status,
          };

          void onData(packet);
        } catch {
          void onError(
            'Unable to decode sensor data',
          );
        }
      },
    );

  monitorSubscription =
    subscription;

  resetNoDataTimer();

  return subscription;
}

// ==========================================
// LISTEN FOR DISCONNECT
// ==========================================

export function listenForDisconnect(
  device: Device,
  onDisconnect: () => void,
): Subscription {
  disconnectSubscription?.remove();

  const subscription =
    manager.onDeviceDisconnected(
      device.id,

      () => {
        if (
          connectedDevice?.id ===
          device.id
        ) {
          connectedDevice =
            null;
        }

        monitorSubscription?.remove();

        monitorSubscription =
          null;

        if (noDataTimer) {
          clearTimeout(
            noDataTimer,
          );

          noDataTimer = null;
        }

        onDisconnect();
      },
    );

  disconnectSubscription =
    subscription;

  return subscription;
}

// ==========================================
// RSSI / SIGNAL STRENGTH
// ==========================================

export async function readDeviceRssi(
  device: Device,
): Promise<number | null> {
  try {
    const updated =
      await device.readRSSI();

    return (
      updated.rssi ?? null
    );
  } catch {
    return null;
  }
}

// ==========================================
// DISCONNECT DEVICE
// Used by App.tsx
// ==========================================

export async function disconnectDevice(
  device: Device,
) {
  shouldReconnect = false;

  scanning = false;

  try {
    manager.stopDeviceScan();
  } catch {
    // Scan may already be stopped.
  }

  if (noDataTimer) {
    clearTimeout(
      noDataTimer,
    );

    noDataTimer = null;
  }

  monitorSubscription?.remove();

  disconnectSubscription?.remove();

  monitorSubscription =
    null;

  disconnectSubscription =
    null;

  try {
    const isConnected =
      await device.isConnected();

    if (isConnected) {
      await manager
        .cancelDeviceConnection(
          device.id,
        );
    }
  } catch {
    // Device may already be disconnected.
  }

  if (
    connectedDevice?.id ===
    device.id
  ) {
    connectedDevice = null;
  }
}

// ==========================================
// LEGACY MANUAL DISCONNECT
// ==========================================

export async function disconnectCVengineWatch() {
  shouldReconnect = false;

  scanning = false;

  try {
    manager.stopDeviceScan();
  } catch {
    // Scan may already be stopped.
  }

  if (noDataTimer) {
    clearTimeout(
      noDataTimer,
    );

    noDataTimer = null;
  }

  monitorSubscription?.remove();

  disconnectSubscription?.remove();

  monitorSubscription =
    null;

  disconnectSubscription =
    null;

  if (connectedDevice) {
    try {
      await manager
        .cancelDeviceConnection(
          connectedDevice.id,
        );
    } catch {
      // Device may already be disconnected.
    }
  }

  connectedDevice = null;
}

// ==========================================
// AUTO RECONNECT SETTING
// ==========================================

export function setAutoReconnect(
  enabled: boolean,
) {
  shouldReconnect =
    enabled;
}

// ==========================================
// CURRENT DEVICE
// ==========================================

export function getConnectedDevice() {
  return connectedDevice;
}

// ==========================================
// CLEANUP
// ==========================================

export function destroyBLEService() {
  shouldReconnect = false;

  scanning = false;

  try {
    manager.stopDeviceScan();
  } catch {
    // Scan may already be stopped.
  }

  monitorSubscription?.remove();

  disconnectSubscription?.remove();

  monitorSubscription =
    null;

  disconnectSubscription =
    null;

  if (noDataTimer) {
    clearTimeout(
      noDataTimer,
    );

    noDataTimer = null;
  }

  connectedDevice = null;

  manager.destroy();
}