import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {
  AuthProvider,
} from './src/context/AuthContext';

import {
  SettingsProvider,
} from './src/context/SettingsContext';

import {
  BluetoothProvider,
} from './src/context/BluetoothContext';

import {
  MonitoringProvider,
} from './src/context/MonitoringContext';

import RootNavigator
  from './src/navigation/RootNavigator';

import {
  initDatabase,
} from './src/db/database';

import {
  colors,
} from './src/theme/colors';

// ==========================================
// APP
// ==========================================

export default function App() {
  const [
    databaseReady,
    setDatabaseReady,
  ] = useState(false);

  const [
    startupError,
    setStartupError,
  ] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        await initDatabase();

        setDatabaseReady(true);
      } catch (error: any) {
        console.log(
          'Database startup error:',
          error,
        );

        setStartupError(
          error?.message ??
            'Unable to initialize app database.',
        );
      }
    }

    void bootstrap();
  }, []);

  // ========================================
  // DATABASE ERROR
  // ========================================

  if (startupError) {
    return (
      <SafeAreaProvider>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Heart Monitor
          </Text>

          <Text style={styles.errorText}>
            {startupError}
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // ========================================
  // APP STARTUP
  // ========================================

  if (!databaseReady) {
    return (
      <SafeAreaProvider>
        <View style={styles.splash}>
          <View style={styles.logoCircle}>
            <Text style={styles.heart}>
              ♥
            </Text>
          </View>

          <Text style={styles.title}>
            HEART MONITOR
          </Text>

          <Text style={styles.powered}>
            Powered by CVengine
          </Text>

          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        </View>
      </SafeAreaProvider>
    );
  }

  // ========================================
  // MAIN APPLICATION
  // ========================================

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SettingsProvider>
          <BluetoothProvider>
            <MonitoringProvider>
              <RootNavigator />
            </MonitoringProvider>
          </BluetoothProvider>
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({
    splash: {
      flex: 1,

      backgroundColor:
        colors.white,

      justifyContent:
        'center',

      alignItems:
        'center',

      padding: 24,
    },

    center: {
      flex: 1,

      justifyContent:
        'center',

      alignItems:
        'center',

      padding: 25,

      backgroundColor:
        colors.white,
    },

    logoCircle: {
      width: 100,
      height: 100,

      borderRadius: 50,

      backgroundColor:
        colors.primarySoft,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 20,
    },

    heart: {
      color:
        colors.heart,

      fontSize: 55,
    },

    title: {
      color:
        colors.text,

      fontSize: 26,

      fontWeight: '900',

      letterSpacing: 1,
    },

    powered: {
      color:
        colors.primary,

      fontSize: 14,

      fontWeight: '700',

      marginTop: 7,
    },

    loader: {
      marginTop: 28,
    },

    errorTitle: {
      color:
        colors.primary,

      fontSize: 24,

      fontWeight: '800',
    },

    errorText: {
      color:
        colors.textSecondary,

      textAlign:
        'center',

      marginTop: 10,

      lineHeight: 20,
    },
  });