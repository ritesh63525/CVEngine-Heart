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
  type: 'heart' | 'oxygen';
  value: number | null;
};

export default function ReadingCard({
  type,
  value,
}: Props) {
  const isHeart =
    type === 'heart';

  const accentColor =
    isHeart
      ? colors.bpm
      : colors.oxygen;

  const softColor =
    isHeart
      ? colors.bpmSoft
      : colors.oxygenSoft;

  return (
    <View style={styles.card}>

      {/* =====================================
          TOP
      ====================================== */}

      <View style={styles.topRow}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor:
                softColor,
            },
          ]}>
          <Text
            style={[
              styles.icon,
              {
                color:
                  accentColor,
              },
            ]}>
            {isHeart
              ? '♥'
              : 'O₂'}
          </Text>
        </View>

        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                value !== null
                  ? colors.success
                  : colors.disabled,
            },
          ]}
        />
      </View>

      {/* =====================================
          LABEL
      ====================================== */}

      <Text style={styles.label}>
        {isHeart
          ? 'Heart Rate'
          : 'Blood Oxygen'}
      </Text>

      {/* =====================================
          VALUE
      ====================================== */}

      <View style={styles.valueRow}>
        <Text
          style={[
            styles.value,
            value !== null && {
              color:
                accentColor,
            },
          ]}>
          {value ?? '--'}
        </Text>

        <Text style={styles.unit}>
          {isHeart
            ? 'BPM'
            : '%'}
        </Text>
      </View>

      {/* =====================================
          FOOTER
      ====================================== */}

      <View style={styles.footer}>
        <View
          style={[
            styles.footerLine,
            {
              backgroundColor:
                accentColor,
            },
          ]}
        />

        <Text style={styles.footerText}>
          {value !== null
            ? 'Live reading'
            : 'Waiting for sensor'}
        </Text>
      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      flex: 1,

      minHeight: 164,

      backgroundColor:
        colors.white,

      borderRadius: 20,

      padding: 17,

      borderWidth: 1,

      borderColor:
        colors.border,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.05,

      shadowRadius: 9,

      elevation: 2,
    },

    // ========================================
    // TOP
    // ========================================

    topRow: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      marginBottom: 13,
    },

    iconBox: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',

      justifyContent: 'center',
    },

    icon: {
      fontSize: 22,

      fontWeight: '900',
    },

    statusDot: {
      width: 7,
      height: 7,

      borderRadius: 4,
    },

    // ========================================
    // LABEL
    // ========================================

    label: {
      color:
        colors.textSecondary,

      fontSize: 12,

      fontWeight: '700',
    },

    // ========================================
    // VALUE
    // ========================================

    valueRow: {
      flexDirection: 'row',

      alignItems: 'baseline',

      marginTop: 5,
    },

    value: {
      color: colors.text,

      fontSize: 34,

      lineHeight: 40,

      fontWeight: '900',

      letterSpacing: -0.8,
    },

    unit: {
      color:
        colors.textSecondary,

      marginLeft: 5,

      fontSize: 11,

      fontWeight: '700',
    },

    // ========================================
    // FOOTER
    // ========================================

    footer: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 8,
    },

    footerLine: {
      width: 15,

      height: 3,

      borderRadius: 2,

      marginRight: 6,
    },

    footerText: {
      color:
        colors.textLight,

      fontSize: 9,

      fontWeight: '600',
    },
  });