import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  finishSession,
  saveReading,
  startSession,
} from '../db/database';

import {useBluetooth} from './BluetoothContext';

type MonitoringContextType = {
  monitoring: boolean;
  sessionId: number | null;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => Promise<void>;
};

const MonitoringContext =
  createContext<MonitoringContextType | undefined>(
    undefined,
  );

const SAVE_INTERVAL_MS = 3000;

export function MonitoringProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {bluetooth} = useBluetooth();

  const [monitoring, setMonitoring] =
    useState(false);

  const [sessionId, setSessionId] =
    useState<number | null>(null);

  const lastSavedAt = useRef(0);
  const savingRef = useRef(false);

  async function startMonitoring() {
    if (monitoring) {
      return;
    }

    const id = await startSession();

    setSessionId(id);
    setMonitoring(true);

    // Session ki first valid reading
    // immediately save hogi.
    lastSavedAt.current = 0;
  }

  async function stopMonitoring() {
    if (!monitoring) {
      return;
    }

    const currentSessionId = sessionId;

    setMonitoring(false);
    setSessionId(null);
    lastSavedAt.current = 0;

    if (currentSessionId === null) {
      return;
    }

    try {
      await finishSession(currentSessionId);
    } catch (error) {
      console.warn(
        'Unable to finish monitoring session:',
        error,
      );
    }
  }

  /*
   * Invalid/no-contact packet milne par timer
   * reset hoga. Finger dobara lagane par first
   * valid reading immediately save hogi.
   */
  useEffect(() => {
    if (
      bluetooth.status === 'NO_CONTACT' ||
      bluetooth.status === 'NO_DATA' ||
      bluetooth.status === 'ERROR' ||
      bluetooth.status === 'DISCONNECTED'
    ) {
      lastSavedAt.current = 0;
    }
  }, [bluetooth.status]);

  /*
   * Valid BLE readings automatically history
   * me save hongi.
   *
   * Manual monitoring active hone par reading
   * current session ke andar save hogi.
   *
   * Manual monitoring inactive hone par reading
   * normal history reading ke roop me save hogi.
   */
  useEffect(() => {
    if (!bluetooth.connected) {
      return;
    }

    if (bluetooth.status !== 'READING') {
      return;
    }

    const heartRate = bluetooth.heartRate;
    const spo2 = bluetooth.spo2;

    if (
      heartRate === null ||
      spo2 === null ||
      !Number.isFinite(heartRate) ||
      !Number.isFinite(spo2) ||
      heartRate <= 0 ||
      heartRate > 250 ||
      spo2 <= 0 ||
      spo2 > 100
    ) {
      return;
    }

    const now = Date.now();

    if (
      lastSavedAt.current !== 0 &&
      now - lastSavedAt.current <
        SAVE_INTERVAL_MS
    ) {
      return;
    }

    if (savingRef.current) {
      return;
    }

    lastSavedAt.current = now;
    savingRef.current = true;

    /*
     * Monitoring active:
     * current session ID use hogi.
     *
     * Monitoring inactive:
     * null session ID use hogi.
     */
    const readingSessionId =
      monitoring ? sessionId : null;

    void saveReading(
      1,
      Math.round(heartRate),
      spo2,
      readingSessionId,
    )
      .catch(error => {
        /*
         * Insert fail hone par timer reset,
         * taaki next valid packet par retry ho.
         */
        lastSavedAt.current = 0;

        console.warn(
          'Unable to save reading:',
          error,
        );
      })
      .finally(() => {
        savingRef.current = false;
      });
  }, [
    bluetooth.connected,
    bluetooth.status,
    bluetooth.heartRate,
    bluetooth.spo2,
    monitoring,
    sessionId,
  ]);

  return (
    <MonitoringContext.Provider
      value={{
        monitoring,
        sessionId,
        startMonitoring,
        stopMonitoring,
      }}>
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const context =
    useContext(MonitoringContext);

  if (!context) {
    throw new Error(
      'useMonitoring must be used inside MonitoringProvider',
    );
  }

  return context;
}