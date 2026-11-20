import React from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import AuthNavigator
  from './AuthNavigator';

import MainNavigator
  from './MainNavigator';

import {
  useAuth,
} from '../context/AuthContext';

import {
  colors,
} from '../theme/colors';

export default function RootNavigator() {
  const {
    authenticated,
    user,
    loading,
    onboardingCompleted,
  } = useAuth();

  /*
   * AsyncStorage se registration,
   * login session aur onboarding state
   * restore hone tak splash show hogi.
   */
  if (loading) {
    return (
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
    );
  }

  return (
    <NavigationContainer>
      {authenticated && user ? (
        /*
         * Valid saved/login session:
         * direct Main app.
         */
        <MainNavigator />
      ) : (
        /*
         * First launch:
         * Onboarding se start.
         *
         * Returning/logged-out user:
         * Welcome screen se start.
         */
        <AuthNavigator
          initialScreen={
            onboardingCompleted
              ? 'Welcome'
              : 'Onboarding'
          }
        />
      )}
    </NavigationContainer>
  );
}

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
      color: colors.heart,
      fontSize: 55,
    },

    title: {
      color: colors.text,

      fontSize: 26,

      fontWeight: '900',

      letterSpacing: 1,
    },

    powered: {
      color: colors.primary,

      fontSize: 14,

      fontWeight: '700',

      marginTop: 7,
    },

    loader: {
      marginTop: 28,
    },
  });