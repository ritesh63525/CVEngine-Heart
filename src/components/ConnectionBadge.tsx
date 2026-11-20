import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {SensorStatus} from '../types';
import {colors} from '../theme/colors';

type Props = {
  status: SensorStatus;
};

export default function ConnectionBadge({
  status,
}: Props) {
  let label = 'Disconnected';
  let background =
    colors.errorSoft;
  let foreground =
    colors.error;

  switch (status) {
    case 'SEARCHING':
      label = 'Searching for CVengine Watch';
      background = colors.infoSoft;
      foreground = colors.info;
      break;

    case 'CONNECTING':
      label = 'Connecting...';
      background = colors.infoSoft;
      foreground = colors.info;
      break;

    case 'CONNECTED':
      label = 'Device Connected';
      background = colors.successSoft;
      foreground = colors.success;
      break;

    case 'READING':
      label = 'Live Monitoring';
      background = colors.successSoft;
      foreground = colors.success;
      break;

    case 'NO_CONTACT':
      label = 'Sensor Contact Lost';
      background = colors.warningSoft;
      foreground = colors.warning;
      break;

    case 'NO_DATA':
      label = 'No Sensor Data';
      background = colors.warningSoft;
      foreground = colors.warning;
      break;

    case 'ERROR':
      label = 'Sensor Error';
      break;

    default:
      label = 'Device Disconnected';
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: background},
      ]}>
      <View
        style={[
          styles.dot,
          {backgroundColor: foreground},
        ]}
      />

      <Text
        style={[
          styles.text,
          {color: foreground},
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});