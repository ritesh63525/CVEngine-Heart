import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  AppSettings,
  getSettings,
  saveSettings,
} from '../db/database';

type SettingsContextType = {
  settings: AppSettings;
  loading: boolean;

  setNotifications: (
    value: boolean,
  ) => Promise<void>;

  setSound: (
    value: boolean,
  ) => Promise<void>;

  setVibration: (
    value: boolean,
  ) => Promise<void>;

  setAutoReconnect: (
    value: boolean,
  ) => Promise<void>;
};

const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  soundsEnabled: true,
  vibrationEnabled: true,
  autoReconnectEnabled: true,
};

const SettingsContext =
  createContext<
    SettingsContextType | undefined
  >(undefined);

export function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] =
    useState<AppSettings>(
      defaultSettings,
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const saved =
        await getSettings();

      setSettings(saved);
    } catch (error) {
      console.log(
        'Settings load error:',
        error,
      );

      setSettings(
        defaultSettings,
      );
    } finally {
      setLoading(false);
    }
  }

  async function save(
    next: AppSettings,
  ) {
    setSettings(next);

    try {
      await saveSettings(next);
    } catch (error) {
      console.log(
        'Settings save error:',
        error,
      );
    }
  }

  async function setNotifications(
    value: boolean,
  ) {
    await save({
      ...settings,
      notificationsEnabled:
        value,
    });
  }

  async function setSound(
    value: boolean,
  ) {
    await save({
      ...settings,
      soundsEnabled:
        value,
    });
  }

  async function setVibration(
    value: boolean,
  ) {
    await save({
      ...settings,
      vibrationEnabled:
        value,
    });
  }

  async function setAutoReconnect(
    value: boolean,
  ) {
    await save({
      ...settings,
      autoReconnectEnabled:
        value,
    });
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        setNotifications,
        setSound,
        setVibration,
        setAutoReconnect,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context =
    useContext(SettingsContext);

  if (!context) {
    throw new Error(
      'useSettings must be used inside SettingsProvider',
    );
  }

  return context;
}