import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {colors} from '../theme/colors';

type Props = {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (
    value: boolean,
  ) => void;
};

export default function SettingRow({
  title,
  subtitle,
  value,
  onValueChange,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textArea}>
        <Text style={styles.title}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
  },

  textArea: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
});