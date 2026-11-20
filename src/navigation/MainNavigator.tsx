import React from 'react';

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen
  from '../screens/main/HomeScreen';

import HistoryScreen
  from '../screens/main/HistoryScreen';

import ProfileScreen
  from '../screens/main/ProfileScreen';

import LiveMonitorScreen
  from '../screens/main/LiveMonitorScreen';

import DeviceConnectionScreen
  from '../screens/device/DeviceConnectionScreen';

import EditProfileScreen
  from '../screens/main/EditProfileScreen';

import SettingsScreen
  from '../screens/main/SettingsScreen';

import AboutScreen
  from '../screens/main/AboutScreen';

import {
  colors,
} from '../theme/colors';

// ======================================================
// TYPES
// ======================================================

export type MainStackParamList = {
  MainTabs: undefined;
  LiveMonitor: undefined;
  EditProfile: undefined;
  Settings: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Device: undefined;
  Profile: undefined;
};

const Stack =
  createNativeStackNavigator<
    MainStackParamList
  >();

const Tab =
  createBottomTabNavigator<
    MainTabParamList
  >();

// ======================================================
// TAB ICON
// ======================================================

type TabIconProps = {
  routeName: keyof MainTabParamList;
  focused: boolean;
};

function TabIcon({
  routeName,
  focused,
}: TabIconProps) {
  let symbol = '●';

  if (routeName === 'Home') {
    symbol = '⌂';
  }

  if (routeName === 'History') {
    symbol = '≡';
  }

  if (routeName === 'Device') {
    symbol = '♥';
  }

  if (routeName === 'Profile') {
    symbol = '●';
  }

  return (
    <View
      style={[
        styles.iconContainer,
        focused &&
          styles.activeIconContainer,
      ]}>
      <Text
        style={[
          styles.icon,
          focused &&
            styles.activeIcon,
        ]}>
        {symbol}
      </Text>
    </View>
  );
}

// ======================================================
// BOTTOM TABS
// ======================================================

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"

      screenOptions={({
        route,
      }) => ({
        headerShown: false,

        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor:
          colors.primary,

        tabBarInactiveTintColor:
          colors.textLight,

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 1,
          marginBottom: 4,
        },

        tabBarStyle: {
          height: 68,

          backgroundColor:
            colors.white,

          borderTopWidth: 1,

          borderTopColor:
            colors.border,

          paddingTop: 6,

          paddingBottom: 5,

          elevation: 15,

          shadowOpacity: 0.08,

          shadowRadius: 10,

          shadowOffset: {
            width: 0,
            height: -3,
          },
        },

        tabBarIcon: ({
          focused,
        }) => (
          <TabIcon
            routeName={
              route.name
            }
            focused={focused}
          />
        ),
      })}>

      {/* ==========================================
          HOME
      ========================================== */}

      <Tab.Screen name="Home">
        {({navigation}) => (
          <HomeScreen
            onOpenLiveMonitor={() =>
              navigation
                .getParent()
                ?.navigate(
                  'LiveMonitor',
                )
            }

            onOpenDevice={() =>
              navigation.navigate(
                'Device',
              )
            }
          />
        )}
      </Tab.Screen>

      {/* ==========================================
          HISTORY
      ========================================== */}

      <Tab.Screen
        name="History"
        component={HistoryScreen}
      />

      {/* ==========================================
          DEVICE
      ========================================== */}

      <Tab.Screen name="Device">
        {({navigation}) => (
          <DeviceConnectionScreen
            onConnected={() =>
              navigation.navigate(
                'Home',
              )
            }
          />
        )}
      </Tab.Screen>

      {/* ==========================================
          PROFILE
      ========================================== */}

      <Tab.Screen name="Profile">
        {({navigation}) => (
          <ProfileScreen
            onEditProfile={() =>
              navigation
                .getParent()
                ?.navigate(
                  'EditProfile',
                )
            }

            onSettings={() =>
              navigation
                .getParent()
                ?.navigate(
                  'Settings',
                )
            }

            onAbout={() =>
              navigation
                .getParent()
                ?.navigate(
                  'About',
                )
            }
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

// ======================================================
// MAIN NAVIGATOR
// ======================================================

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"

      screenOptions={{
        headerShown: false,
        animation:
          'slide_from_right',
      }}>

      {/* MAIN APP */}

      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
      />

      {/* LIVE MONITOR */}

      <Stack.Screen name="LiveMonitor">
        {({navigation}) => (
          <LiveMonitorScreen
            onBack={() =>
              navigation.goBack()
            }

            onConnectDevice={() => {
              navigation.goBack();

              setTimeout(() => {
                navigation.navigate(
                  'MainTabs',
                  {
                    screen:
                      'Device',
                  } as never,
                );
              }, 50);
            }}
          />
        )}
      </Stack.Screen>

      {/* EDIT PROFILE */}

      <Stack.Screen name="EditProfile">
        {({navigation}) => (
          <EditProfileScreen
            onDone={() =>
              navigation.goBack()
            }
          />
        )}
      </Stack.Screen>

      {/* SETTINGS */}

      <Stack.Screen name="Settings">
        {({navigation}) => (
          <SettingsScreen
            onBack={() =>
              navigation.goBack()
            }
          />
        )}
      </Stack.Screen>

      {/* ABOUT */}

      <Stack.Screen name="About">
        {({navigation}) => (
          <AboutScreen
            onBack={() =>
              navigation.goBack()
            }
          />
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles =
  StyleSheet.create({
    iconContainer: {
      width: 30,
      height: 27,

      borderRadius: 9,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    activeIconContainer: {
      backgroundColor:
        colors.primarySoft,
    },

    icon: {
      color:
        colors.textLight,

      fontSize: 17,

      fontWeight:
        '900',
    },

    activeIcon: {
      color:
        colors.primary,
    },
  });