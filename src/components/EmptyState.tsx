import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {colors} from '../theme/colors';

type Props = {
  title: string;
  message: string;
};

export default function EmptyState({
  title,
  message,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>
        ♡
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  icon: {
    fontSize: 42,
    color: colors.primary,
    marginBottom: 12,
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  message: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});