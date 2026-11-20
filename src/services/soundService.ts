import {Vibration} from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export type SoundName =
  | 'connected'
  | 'contact_lost'
  | 'disconnected'
  | 'no_data'
  | 'reading_error'
  | 'reading_started'
  | 'reconnected';

const SOUND_FILES: Record<SoundName, string> = {
  connected: 'connected.wav',
  contact_lost: 'contact_lost.wav',
  disconnected: 'disconnected.wav',
  no_data: 'no_data.wav',
  reading_error: 'reading_error.wav',
  reading_started: 'reading_started.wav',
  reconnected: 'reconnected.wav',
};

export function playAppSound(name: SoundName) {
  const file = SOUND_FILES[name];

  const sound = new Sound(
    file,
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.warn('Sound load error:', file, error);
        return;
      }

      sound.setVolume(1);

      sound.play(success => {
        if (!success) {
          console.warn('Sound playback failed:', file);
        }

        sound.release();
      });
    },
  );
}

export function vibrateShort() {
  Vibration.vibrate(150);
}

export function vibrateWarning() {
  Vibration.vibrate([0, 250, 150, 250]);
}

export function vibrateSuccess() {
  Vibration.vibrate([0, 100, 80, 100]);
}

export function stopVibration() {
  Vibration.cancel();
}