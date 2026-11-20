export type User = {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
};

export type UserProfile = {
  age: number | null;
  gender: string;
  diabetes: boolean;
  hypertension: boolean;
  previousHeartAttack: boolean;
};

export type SensorReading = {
  id?: number;
  sessionId?: number | null;
  heartRate: number;
  spo2: number;
  recordedAt: string;
};

export type SensorStatus =
  | 'DISCONNECTED'
  | 'SEARCHING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'READING'
  | 'NO_CONTACT'
  | 'NO_DATA'
  | 'ERROR';

export type BluetoothState = {
  deviceId: string | null;
  deviceName: string | null;
  connected: boolean;
  status: SensorStatus;
  heartRate: number | null;
  spo2: number | null;
  rssi: number | null;
  lastUpdated: string | null;
};

export type AppSettings = {
  notifications: boolean;
  sound: boolean;
  vibration: boolean;
  autoReconnect: boolean;
};

export type MonitoringSession = {
  sessionId: number;
  startedAt: string;
  endedAt?: string | null;
  avgBpm?: number | null;
  minBpm?: number | null;
  maxBpm?: number | null;
  avgSpo2?: number | null;
};