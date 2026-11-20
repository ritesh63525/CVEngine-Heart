import notifee, {AndroidImportance} from '@notifee/react-native';

export type NotificationPreferences = {
  notificationsEnabled: boolean;
  soundsEnabled: boolean;
  vibrationEnabled: boolean;
};

type EventConfig = {
  id: string;
  name: string;
  sound: string;
  title: string;
  body: string;
};

const events: Record<string, EventConfig> = {
  connected: {
    id: 'device_connected',
    name: 'Device Connected',
    sound: 'connected',
    title: 'Device Connected',
    body: 'ESP32 connected successfully.',
  },
  readingStarted: {
    id: 'reading_started',
    name: 'Reading Started',
    sound: 'reading_started',
    title: 'Monitoring Started',
    body: 'Live BPM and SpO₂ readings have started.',
  },
  contactLost: {
    id: 'contact_lost',
    name: 'Sensor Contact Lost',
    sound: 'contact_lost',
    title: 'Sensor Contact Lost',
    body: 'Sensor contact was lost. Adjust the sensor.',
  },
  readingError: {
    id: 'reading_error',
    name: 'Reading Error',
    sound: 'reading_error',
    title: 'Reading Error',
    body: 'Invalid or interrupted sensor data was received.',
  },
  disconnected: {
    id: 'device_disconnected',
    name: 'Device Disconnected',
    sound: 'disconnected',
    title: 'Device Disconnected',
    body: 'Bluetooth connection with ESP32 was lost.',
  },
  noData: {
    id: 'no_sensor_data',
    name: 'No Sensor Data',
    sound: 'no_data',
    title: 'No Sensor Data',
    body: 'ESP32 is connected but no sensor data is arriving.',
  },
  reconnected: {
    id: 'device_reconnected',
    name: 'Device Reconnected',
    sound: 'reconnected',
    title: 'Device Reconnected',
    body: 'Bluetooth connection has been restored.',
  },
};

function channelId(event: EventConfig, sound: boolean, vibration: boolean) {
  return `${event.id}_${sound ? 'sound' : 'silent'}_${vibration ? 'vib' : 'novib'}`;
}

export async function initNotificationChannels() {
  await notifee.requestPermission();

  for (const event of Object.values(events)) {
    for (const sound of [true, false]) {
      for (const vibration of [true, false]) {
        await notifee.createChannel({
          id: channelId(event, sound, vibration),
          name: `${event.name}${sound ? '' : ' (Silent)'}${vibration ? '' : ' (No vibration)'}`,
          importance: AndroidImportance.HIGH,
          sound: sound ? event.sound : undefined,
          vibration,
        });
      }
    }
  }
}

async function show(event: EventConfig, prefs: NotificationPreferences) {
  if (!prefs.notificationsEnabled) {
    return;
  }

  await notifee.displayNotification({
    title: event.title,
    body: event.body,
    android: {
      channelId: channelId(event, prefs.soundsEnabled, prefs.vibrationEnabled),
      smallIcon: 'ic_launcher',
      pressAction: {id: 'default'},
    },
  });
}

export const notifyDeviceConnected = (prefs: NotificationPreferences) => show(events.connected, prefs);
export const notifyReadingStarted = (prefs: NotificationPreferences) => show(events.readingStarted, prefs);
export const notifyContactLost = (prefs: NotificationPreferences) => show(events.contactLost, prefs);
export const notifyReadingError = (prefs: NotificationPreferences) => show(events.readingError, prefs);
export const notifyDisconnected = (prefs: NotificationPreferences) => show(events.disconnected, prefs);
export const notifyNoData = (prefs: NotificationPreferences) => show(events.noData, prefs);
export const notifyReconnected = (prefs: NotificationPreferences) => show(events.reconnected, prefs);
