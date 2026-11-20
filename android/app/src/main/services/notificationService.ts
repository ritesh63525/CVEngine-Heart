import notifee, {
  AndroidImportance,
} from '@notifee/react-native';

const CHANNEL_ID = 'cvengine_monitor';

async function createChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'CVengine Heart Monitor',
    importance: AndroidImportance.HIGH,
    vibration: true,
  });
}

async function showNotification(
  title: string,
  body: string,
) {
  await createChannel();

  await notifee.displayNotification({
    title,
    body,

    android: {
      channelId: CHANNEL_ID,
      smallIcon: 'ic_launcher',

      pressAction: {
        id: 'default',
      },
    },
  });
}

export async function notifyConnected() {
  await showNotification(
    'Device Connected',
    'CVengine Heart Monitor connected successfully.',
  );
}

export async function notifyDisconnected() {
  await showNotification(
    'Device Disconnected',
    'Connection with CVengine Heart Monitor was lost.',
  );
}

export async function notifyReadingStarted() {
  await showNotification(
    'Monitoring Started',
    'Heart rate and SpO₂ monitoring has started.',
  );
}

export async function notifyContactLost() {
  await showNotification(
    'Sensor Contact Lost',
    'Place your finger correctly on the sensor.',
  );
}

export async function notifyNoData() {
  await showNotification(
    'No Sensor Data',
    'Device is connected but sensor readings are not being received.',
  );
}

export async function notifyReadingError() {
  await showNotification(
    'Reading Error',
    'Unable to receive a valid heart monitor reading.',
  );
}

export async function notifyReconnected() {
  await showNotification(
    'Device Reconnected',
    'Bluetooth connection has been restored.',
  );
}