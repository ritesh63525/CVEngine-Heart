import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  colors,
} from '../theme/colors';

type Props = {
  title?: string;
  subtitle?: string;
};

export default function AppHeader({
  title = 'Heart Monitor',
  subtitle = 'Smart Heart Monitoring',
}: Props) {
  return (
    <View style={styles.container}>

      {/* BRAND ICON */}

      <View style={styles.iconOuter}>
        <View style={styles.iconInner}>
          <Text style={styles.heart}>
            ♥
          </Text>

          <View style={styles.pulseLine}>
            <View style={styles.pulseBarSmall} />
            <View style={styles.pulseBarTall} />
            <View style={styles.pulseBarSmall} />
          </View>
        </View>
      </View>

      {/* TITLE */}

      <View style={styles.content}>
        <Text style={styles.title}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 24,
    },

    // ========================================
    // LOGO
    // ========================================

    iconOuter: {
      width: 52,
      height: 52,

      borderRadius: 16,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',
      alignItems: 'center',

      marginRight: 13,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    iconInner: {
      width: 40,
      height: 40,

      borderRadius: 13,

      backgroundColor:
        colors.primary,

      justifyContent: 'center',
      alignItems: 'center',

      position: 'relative',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.18,

      shadowRadius: 5,

      elevation: 3,
    },

    heart: {
      color: colors.white,

      fontSize: 25,

      lineHeight: 29,
    },

    // Small ECG detail over heart

    pulseLine: {
      position: 'absolute',

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'center',

      bottom: 16,
    },

    pulseBarSmall: {
      width: 5,
      height: 1.5,

      backgroundColor:
        colors.primary,
    },

    pulseBarTall: {
      width: 2,
      height: 7,

      marginHorizontal: 1,

      backgroundColor:
        colors.primary,
    },

    // ========================================
    // TEXT
    // ========================================

    content: {
      flex: 1,
    },

    title: {
      color: colors.text,

      fontSize: 21,

      fontWeight: '900',

      letterSpacing: -0.25,
    },

    subtitle: {
      color:
        colors.textSecondary,

      fontSize: 11,

      lineHeight: 16,

      marginTop: 2,

      fontWeight: '500',
    },
  });