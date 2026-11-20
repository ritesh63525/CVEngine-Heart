import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {colors} from '../../theme/colors';

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({
  onFinish,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.heart}>♥</Text>
      </View>

      <Text style={styles.title}>
        HEART MONITOR
      </Text>

      <Text style={styles.tagline}>
        Smart Heart Health Monitoring
      </Text>

      <View style={styles.powered}>
        <Text style={styles.poweredText}>
          Powered by
        </Text>

        <Text style={styles.cvengine}>
          CVengine
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  logoCircle: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  heart: {
    fontSize: 58,
    color: colors.heart,
  },

  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 1,
  },

  tagline: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },

  powered: {
    position: 'absolute',
    bottom: 45,
    alignItems: 'center',
  },

  poweredText: {
    color: colors.textLight,
    fontSize: 11,
  },

  cvengine: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 3,
  },
});