import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import {colors} from '../theme/colors';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export default function AppInput({
  label,
  error,
  ...props
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        {...props}
        placeholderTextColor={
          colors.textLight
        }
        style={[
          styles.input,
          error
            ? styles.inputError
            : undefined,
        ]}
      />

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 16,
  },

  inputError: {
    borderColor: colors.error,
  },

  error: {
    color: colors.error,
    marginTop: 5,
    fontSize: 12,
  },
});