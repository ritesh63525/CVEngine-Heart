import React from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import {
  colors,
} from '../theme/colors';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;

  variant?:
    | 'primary'
    | 'secondary'
    | 'danger';

  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}: Props) {
  const secondary =
    variant === 'secondary';

  const danger =
    variant === 'danger';

  const isDisabled =
    disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,

        secondary &&
          styles.secondary,

        danger &&
          styles.danger,

        isDisabled &&
          styles.disabled,

        pressed &&
          !isDisabled &&
          styles.pressed,

        style,
      ]}>

      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            secondary
              ? colors.primary
              : colors.white
          }
        />
      ) : (
        <Text
          style={[
            styles.text,

            secondary &&
              styles.secondaryText,
          ]}>
          {title}
        </Text>
      )}

    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    button: {
      minHeight: 56,

      borderRadius: 16,

      backgroundColor:
        colors.primary,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal: 22,

      marginVertical: 6,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.12,

      shadowRadius: 10,

      elevation: 4,
    },

    secondary: {
      backgroundColor:
        colors.white,

      borderWidth: 1.5,

      borderColor:
        colors.primary,

      shadowOpacity: 0.04,

      elevation: 1,
    },

    danger: {
      backgroundColor:
        colors.danger,
    },

    disabled: {
      backgroundColor:
        colors.disabled,

      borderColor:
        colors.disabled,

      opacity: 0.7,

      shadowOpacity: 0,

      elevation: 0,
    },

    pressed: {
      transform: [
        {
          scale: 0.985,
        },
      ],

      opacity: 0.92,
    },

    text: {
      color:
        colors.white,

      fontSize: 15,

      fontWeight: '800',

      letterSpacing: 0.1,
    },

    secondaryText: {
      color:
        colors.primary,
    },
  });