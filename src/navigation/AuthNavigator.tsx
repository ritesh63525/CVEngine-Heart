import React, {
  useEffect,
} from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import OnboardingScreen
  from '../screens/onboarding/OnboardingScreen';

import WelcomeScreen
  from '../screens/auth/WelcomeScreen';

import LoginScreen
  from '../screens/auth/LoginScreen';

import RegisterScreen
  from '../screens/auth/RegisterScreen';

import ForgotPasswordScreen
  from '../screens/auth/ForgotPasswordScreen';

import {
  useAuth,
} from '../context/AuthContext';

export type AuthStackParamList = {
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type Props = {
  initialScreen?:
    | 'Onboarding'
    | 'Welcome';
};

const Stack =
  createNativeStackNavigator<
    AuthStackParamList
  >();

function WelcomeRoute({
  navigation,
}: {
  navigation: any;
}) {
  const {
    completeOnboarding,
  } = useAuth();

  useEffect(() => {
    /*
     * Welcome screen tak pahunchne ka matlab
     * onboarding complete ho chuki hai.
     */
    void completeOnboarding();

    // Sirf screen mount hone par run karna hai.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WelcomeScreen
      onLogin={() =>
        navigation.navigate('Login')
      }
      onRegister={() =>
        navigation.navigate('Register')
      }
    />
  );
}

export default function AuthNavigator({
  initialScreen = 'Onboarding',
}: Props) {
  return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />

      <Stack.Screen
        name="Welcome"
        component={WelcomeRoute}
      />

      <Stack.Screen name="Login">
        {({navigation}) => (
          <LoginScreen
            onRegister={() =>
              navigation.navigate(
                'Register',
              )
            }

            onForgotPassword={() =>
              navigation.navigate(
                'ForgotPassword',
              )
            }

            onLoggedIn={() => {
              /*
               * AuthContext me user set hoga.
               * RootNavigator automatically
               * MainNavigator open karega.
               */
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Register">
        {({navigation}) => (
          <RegisterScreen
            onLogin={() =>
              navigation.navigate(
                'Login',
              )
            }

            onRegistered={() =>
              navigation.replace(
                'Login',
              )
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="ForgotPassword">
        {({navigation}) => (
          <ForgotPasswordScreen
            onDone={() =>
              navigation.goBack()
            }
          />
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
}