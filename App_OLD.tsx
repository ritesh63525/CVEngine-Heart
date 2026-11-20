import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Image,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Device, Subscription} from 'react-native-ble-plx';
import {
  connectDevice,
  connectDeviceById,
  disconnectDevice,
  listenForDisconnect,
  monitorSensorData,
  readDeviceRssi,
  requestBlePermissions,
  scanDevices,
  stopScan,
} from './src/ble/bleService';
import {
  AppSettings,
  createPatient,
  endMonitoringSession,
  getPatient,
  getReadings,
  getSettings,
  initDatabase,
  saveReading,
  saveSettings,
  startMonitoringSession,
  updatePatient,
} from './src/db/database';
import {
  initNotificationChannels,
  notifyContactLost,
  notifyDeviceConnected,
  notifyDisconnected,
  notifyNoData,
  notifyReadingError,
  notifyReadingStarted,
  notifyReconnected,
} from './src/notifications/notificationService';

type MainScreen = 'home' | 'history' | 'profile' | 'settings';
type Screen = 'splash' | 'setup' | 'devices' | MainScreen;
type MonitorState = 'WAITING' | 'READING' | 'NO_CONTACT' | 'ERROR' | 'NO_DATA';
type HistoryFilter = 'today' | '7days' | 'all';
type Reading = {reading_id: number; patient_id: number; heart_rate: number; spo2: number; recorded_at: string};

type SessionReading = {heartRate: number; spo2: number; at: number};

const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  soundsEnabled: true,
  vibrationEnabled: true,
  autoReconnectEnabled: true,
};

function AppContent() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [patientId, setPatientId] = useState<number | null>(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [spo2, setSpo2] = useState<number | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoReconnecting, setIsAutoReconnecting] = useState(false);
  const [history, setHistory] = useState<Reading[]>([]);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('today');
  const [monitorState, setMonitorState] = useState<MonitorState>('WAITING');
  const [lastReadingAt, setLastReadingAt] = useState<Date | null>(null);
  const [rssi, setRssi] = useState<number | null>(null);
  const [settings, setSettingsState] = useState<AppSettings>(defaultSettings);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);

  const disconnectSub = useRef<Subscription | null>(null);
  const monitorSub = useRef<Subscription | null>(null);
  const noDataTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rssiTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const readingStarted = useRef(false);
  const previousState = useRef<MonitorState>('WAITING');
  const hasConnectedBefore = useRef(false);
  const reconnectingRef = useRef(false);
  const unmountedRef = useRef(false);
  const lastSavedAt = useRef(0);
  const sessionIdRef = useRef<number | null>(null);
  const sessionReadingsRef = useRef<SessionReading[]>([]);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startApp();
    return () => {
      unmountedRef.current = true;
      stopScan();
      disconnectSub.current?.remove();
      monitorSub.current?.remove();
      if (noDataTimer.current) clearTimeout(noDataTimer.current);
      if (scanTimer.current) clearTimeout(scanTimer.current);
      if (rssiTimer.current) clearInterval(rssiTimer.current);
    };
  }, []);

  useEffect(() => {
    if (monitorState !== 'READING') {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1.16, duration: 360, useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 1, duration: 360, useNativeDriver: true}),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [monitorState, pulse]);

  async function startApp() {
    try {
      await initDatabase();
      await initNotificationChannels();
      const storedSettings = await getSettings();
      setSettingsState(storedSettings);
      const patient = await getPatient();
      if (patient) {
        setPatientId(Number(patient.patient_id));
        setAge(String(patient.age ?? ''));
        setGender(String(patient.gender ?? ''));
      }
      setTimeout(() => setScreen(patient ? 'home' : 'setup'), 1100);
    } catch (error) {
      console.log('Startup error:', error);
      setTimeout(() => setScreen('setup'), 1100);
    }
  }

  async function saveProfile(initial = false) {
    const n = Number(age);
    if (!Number.isFinite(n) || n < 1 || n > 120 || !gender) {
      Alert.alert('Profile Required', 'Enter a valid age and select gender.');
      return;
    }
    try {
      const patient = initial ? await createPatient(n, gender) : await updatePatient(n, gender);
      setPatientId(Number(patient?.patient_id));
      setScreen('home');
      if (!initial) Alert.alert('Profile Updated', 'Your local profile has been updated.');
    } catch (error) {
      console.log(error);
      Alert.alert('Database Error', 'Unable to save profile.');
    }
  }

  async function updateSettings(next: AppSettings) {
    setSettingsState(next);
    try {
      await saveSettings(next);
    } catch (error) {
      console.log('Settings save error:', error);
    }
  }

  async function startScanning() {
    const granted = await requestBlePermissions();
    if (!granted) {
      Alert.alert('Permission Required', 'Bluetooth permission is required to connect with ESP32.');
      return;
    }
    setDevices([]);
    setIsScanning(true);
    setScreen('devices');
    scanDevices(
      device => setDevices(prev => (prev.some(x => x.id === device.id) ? prev : [...prev, device])),
      message => {
        setIsScanning(false);
        Alert.alert('Bluetooth Error', message);
      },
    );
    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => {
      stopScan();
      setIsScanning(false);
    }, 10000);
  }

  function armNoDataTimer() {
    if (noDataTimer.current) clearTimeout(noDataTimer.current);
    noDataTimer.current = setTimeout(async () => {
      if (!connectedDevice && !reconnectingRef.current) return;
      setHeartRate(null);
      setSpo2(null);
      setMonitorState('NO_DATA');
      if (previousState.current !== 'NO_DATA') {
        previousState.current = 'NO_DATA';
        await notifyNoData(settings);
      }
    }, 8000);
  }

  function beginRssiUpdates(device: Device) {
    if (rssiTimer.current) clearInterval(rssiTimer.current);
    const refresh = async () => setRssi(await readDeviceRssi(device));
    refresh();
    rssiTimer.current = setInterval(refresh, 5000);
  }

  async function attachConnectedDevice(connected: Device, isReconnect: boolean) {
    if (unmountedRef.current) return;
    setConnectedDevice(connected);
    setIsAutoReconnecting(false);
    reconnectingRef.current = false;
    setHeartRate(null);
    setSpo2(null);
    setMonitorState('WAITING');
    previousState.current = 'WAITING';
    readingStarted.current = false;
    beginRssiUpdates(connected);

    if (isReconnect || hasConnectedBefore.current) {
      await notifyReconnected(settings);
    } else {
      await notifyDeviceConnected(settings);
      hasConnectedBefore.current = true;
    }

    disconnectSub.current?.remove();
    disconnectSub.current = listenForDisconnect(connected, async () => {
      if (noDataTimer.current) clearTimeout(noDataTimer.current);
      if (rssiTimer.current) clearInterval(rssiTimer.current);
      monitorSub.current?.remove();
      setConnectedDevice(null);
      setRssi(null);
      setHeartRate(null);
      setSpo2(null);
      setMonitorState('WAITING');
      readingStarted.current = false;
      previousState.current = 'WAITING';
      await notifyDisconnected(settings);
      if (settings.autoReconnectEnabled) attemptAutoReconnect(connected.id);
    });

    armNoDataTimer();
    monitorSub.current?.remove();
    monitorSub.current = await monitorSensorData(
      connected,
      async packet => {
        armNoDataTimer();
        if (packet.status === 'NO_CONTACT') {
          setHeartRate(null);
          setSpo2(null);
          setMonitorState('NO_CONTACT');
          if (previousState.current !== 'NO_CONTACT') {
            previousState.current = 'NO_CONTACT';
            await notifyContactLost(settings);
          }
          return;
        }
        if (packet.status === 'ERROR' || packet.heartRate === null || packet.spo2 === null) {
          setHeartRate(null);
          setSpo2(null);
          setMonitorState('ERROR');
          if (previousState.current !== 'ERROR') {
            previousState.current = 'ERROR';
            await notifyReadingError(settings);
          }
          return;
        }

        setHeartRate(packet.heartRate);
        setSpo2(packet.spo2);
        setLastReadingAt(new Date());
        setMonitorState('READING');
        previousState.current = 'READING';

        if (!readingStarted.current) {
          readingStarted.current = true;
          await notifyReadingStarted(settings);
        }

        if (patientId && monitoringActive) {
          const now = Date.now();
          sessionReadingsRef.current.push({heartRate: packet.heartRate, spo2: packet.spo2, at: now});
          if (now - lastSavedAt.current >= 2000) {
            lastSavedAt.current = now;
            await saveReading(patientId, packet.heartRate, packet.spo2);
          }
        }
      },
      async message => {
        console.log('BLE monitor error:', message);
        setHeartRate(null);
        setSpo2(null);
        setMonitorState('ERROR');
        if (previousState.current !== 'ERROR') {
          previousState.current = 'ERROR';
          await notifyReadingError(settings);
        }
      },
    );
    setScreen('home');
  }

  async function connectTo(device: Device) {
    try {
      stopScan();
      setIsScanning(false);
      const connected = await connectDevice(device);
      await attachConnectedDevice(connected, false);
    } catch (error: any) {
      Alert.alert('Connection Failed', error?.message ?? 'Unable to connect to ESP32.');
    }
  }

  async function attemptAutoReconnect(deviceId: string) {
    if (reconnectingRef.current || !settings.autoReconnectEnabled) return;
    reconnectingRef.current = true;
    setIsAutoReconnecting(true);

    for (let attempt = 1; attempt <= 3; attempt++) {
      if (unmountedRef.current) return;
      await new Promise<void>(resolve => setTimeout(() => resolve(), attempt * 1800));
      try {
        const device = await connectDeviceById(deviceId);
        await attachConnectedDevice(device, true);
        return;
      } catch (error) {
        console.log(`Auto reconnect attempt ${attempt} failed`, error);
      }
    }
    reconnectingRef.current = false;
    setIsAutoReconnecting(false);
  }

  async function handleDisconnect() {
    if (!connectedDevice) return;
    await disconnectDevice(connectedDevice);
  }

  async function startSession() {
    if (!patientId) return;
    if (!connectedDevice) {
      Alert.alert('Connect Device', 'Connect your ESP32 before starting monitoring.');
      return;
    }
    try {
      const id = await startMonitoringSession(patientId);
      sessionIdRef.current = id;
      sessionReadingsRef.current = [];
      lastSavedAt.current = 0;
      setSessionStartedAt(new Date());
      setMonitoringActive(true);
    } catch {
      Alert.alert('Session Error', 'Unable to start monitoring session.');
    }
  }

  async function stopSession() {
    if (!monitoringActive) return;
    const values = sessionReadingsRef.current;
    setMonitoringActive(false);
    setSessionStartedAt(null);
    if (!values.length) {
      Alert.alert('Monitoring Stopped', 'No valid sensor readings were collected in this session.');
      return;
    }
    const hrs = values.map(x => x.heartRate);
    const ox = values.map(x => x.spo2);
    const stats = {
      count: values.length,
      avgHeartRate: hrs.reduce((a, b) => a + b, 0) / hrs.length,
      minHeartRate: Math.min(...hrs),
      maxHeartRate: Math.max(...hrs),
      avgSpo2: ox.reduce((a, b) => a + b, 0) / ox.length,
    };
    if (sessionIdRef.current) {
      await endMonitoringSession(sessionIdRef.current, stats);
    }
    sessionIdRef.current = null;
    Alert.alert(
      'Session Summary',
      `Readings: ${stats.count}\nAverage BPM: ${stats.avgHeartRate.toFixed(1)}\nMin / Max BPM: ${stats.minHeartRate.toFixed(0)} / ${stats.maxHeartRate.toFixed(0)}\nAverage SpO₂: ${stats.avgSpo2.toFixed(1)}%`,
    );
  }

  async function openHistory() {
    if (!patientId) return;
    try {
      setHistory((await getReadings(patientId)) as unknown as Reading[]);
      setScreen('history');
    } catch {
      Alert.alert('History Error', 'Unable to load saved readings.');
    }
  }

  async function exportCsv() {
    if (!history.length) {
      Alert.alert('No Data', 'There are no readings to export.');
      return;
    }
    const csv = [
      'recorded_at,heart_rate,spo2',
      ...history.map(r => `${r.recorded_at},${r.heart_rate},${r.spo2}`),
    ].join('\n');
    await Share.share({title: 'CVengine Readings', message: csv});
  }

  const filteredHistory = useMemo(() => {
    const now = Date.now();
    return history.filter(r => {
      const time = new Date(r.recorded_at).getTime();
      if (historyFilter === 'all') return true;
      if (historyFilter === '7days') return time >= now - 7 * 24 * 60 * 60 * 1000;
      const d = new Date(r.recorded_at);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    });
  }, [history, historyFilter]);

  const historyStats = useMemo(() => {
    if (!filteredHistory.length) return null;
    const hr = filteredHistory.map(r => Number(r.heart_rate));
    const ox = filteredHistory.map(r => Number(r.spo2));
    return {
      avgHr: hr.reduce((a, b) => a + b, 0) / hr.length,
      minHr: Math.min(...hr),
      maxHr: Math.max(...hr),
      avgSpo2: ox.reduce((a, b) => a + b, 0) / ox.length,
    };
  }, [filteredHistory]);

  const signalLabel = rssi === null ? '--' : rssi >= -60 ? 'Excellent' : rssi >= -75 ? 'Good' : 'Weak';
  const statusInfo = getStatusInfo(monitorState, connectedDevice !== null, isAutoReconnecting);

  if (screen === 'splash') {
    return (
      <SafeAreaView style={styles.splash} edges={['top', 'bottom']}>
        <Image source={require('./src/assets/cvengine_logo.jpg')} style={styles.splashLogo} resizeMode="contain"/>
        <Text style={styles.splashTitle}>Heart Monitor</Text>
        <Text style={styles.splashSub}>Powered by CVengine</Text>
      </SafeAreaView>
    );
  }

  if (screen === 'setup') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.setupWrap} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}><Image source={require('./src/assets/cvengine_logo.jpg')} style={styles.brandLogo} resizeMode="contain"/><View><Text style={styles.brandText}>Heart Monitor</Text><Text style={styles.poweredText}>Powered by CVengine</Text></View></View>
          <View style={styles.setupCard}>
            <Text style={styles.eyebrow}>WELCOME</Text>
            <Text style={styles.setupTitle}>Set up your profile</Text>
            <Text style={styles.muted}>Only minimal details are stored locally on this phone.</Text>
            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} placeholder="Enter age" placeholderTextColor="#98A2B3" keyboardType="numeric" value={age} onChangeText={setAge}/>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.choiceRow}>{['Male', 'Female', 'Other'].map(item => <Choice key={item} label={item} selected={gender === item} onPress={() => setGender(item)}/>)}</View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => saveProfile(true)}><Text style={styles.primaryButtonText}>Continue</Text></TouchableOpacity>
          </View>
          <Text style={styles.privacyText}>Your profile and sensor readings remain in this phone's local SQLite database.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'devices') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.page}>
          <Header title="Bluetooth Devices" subtitle={isScanning ? 'Scanning nearby BLE devices…' : 'Choose your ESP32 device'} onBack={() => {stopScan(); setScreen('home');}}/>
          {isScanning && <View style={styles.scanBanner}><Text style={styles.scanDot}>●</Text><Text style={styles.scanText}>Scanning for BLE devices</Text></View>}
          {devices.map(device => (
            <TouchableOpacity key={device.id} style={styles.deviceCard} onPress={() => connectTo(device)}>
              <View style={styles.deviceIcon}><Text style={styles.deviceIconText}>BT</Text></View>
              <View style={{flex: 1}}><Text style={styles.deviceName}>{device.name || device.localName || 'BLE Device'}</Text><Text style={styles.deviceId}>{device.id}</Text></View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
          {!isScanning && devices.length === 0 && <EmptyState title="No BLE device found" body="Make sure your ESP32 is powered on and advertising over Bluetooth."/>}
          {!isScanning && <TouchableOpacity style={styles.primaryButton} onPress={startScanning}><Text style={styles.primaryButtonText}>Scan Again</Text></TouchableOpacity>}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderMain = () => {
    if (screen === 'history') return renderHistory();
    if (screen === 'profile') return renderProfile();
    if (screen === 'settings') return renderSettings();
    return renderHome();
  };

  function renderHome() {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.topBar}>
          <View style={styles.homeBrand}><Image source={require('./src/assets/cvengine_logo.jpg')} style={styles.homeLogo} resizeMode="contain"/><View><Text style={styles.eyebrow}>HEART MONITOR</Text><Text style={styles.pageTitle}>Live Health</Text><Text style={styles.muted}>Powered by CVengine • Age {age} • {gender || 'User'}</Text></View></View>
          <View style={[styles.connectionPill, connectedDevice ? styles.connectedPill : styles.disconnectedPill]}><Text style={connectedDevice ? styles.connectedText : styles.disconnectedText}>{isAutoReconnecting ? '↻ Reconnecting' : connectedDevice ? '● Connected' : '● Disconnected'}</Text></View>
        </View>

        <View style={[styles.statusBanner, {backgroundColor: statusInfo.bg}]}>
          <View style={[styles.statusDot, {backgroundColor: statusInfo.color}]}/>
          <View style={{flex: 1}}><Text style={[styles.statusTitle, {color: statusInfo.color}]}>{statusInfo.title}</Text><Text style={styles.statusBody}>{statusInfo.body}</Text></View>
        </View>

        {!connectedDevice ? (
          <TouchableOpacity style={styles.connectButton} onPress={startScanning}><Text style={styles.connectButtonText}>Connect ESP32</Text><Text style={styles.connectButtonSub}>Scan nearby Bluetooth devices</Text></TouchableOpacity>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, monitoringActive && styles.stopButton]} onPress={monitoringActive ? stopSession : startSession}><Text style={styles.actionButtonText}>{monitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}><Text style={styles.disconnectButtonText}>Disconnect</Text></TouchableOpacity>
          </View>
        )}

        {monitoringActive && <View style={styles.sessionStrip}><Text style={styles.sessionLive}>● LIVE SESSION</Text><Text style={styles.sessionTime}>{sessionStartedAt ? `Started ${formatTime(sessionStartedAt)}` : ''}</Text></View>}

        <View style={styles.metricGrid}>
          <MetricCard title="Heart Rate" value={heartRate} unit="BPM" accent="#E5484D" icon={<Animated.Text style={[styles.heartIcon, {transform: [{scale: pulse}]}]}>♥</Animated.Text>} />
          <MetricCard title="Blood Oxygen" value={spo2} unit="SpO₂ %" accent="#2878FF" icon={<Text style={styles.dropIcon}>●</Text>} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Device & data</Text>
          <InfoRow label="Device" value={connectedDevice?.name || connectedDevice?.localName || '--'}/>
          <InfoRow label="Signal quality" value={signalLabel}/>
          <InfoRow label="Last reading" value={lastReadingAt ? formatTime(lastReadingAt) : '--'}/>
          <InfoRow label="Storage" value="Local SQLite"/>
        </View>

        {monitorState === 'NO_CONTACT' && <View style={styles.contactCard}><Text style={styles.contactTitle}>Sensor contact lost</Text><Text style={styles.contactBody}>Adjust the wearable/sensor until stable contact is restored. Bluetooth can remain connected while contact is lost.</Text></View>}

        <TouchableOpacity style={styles.secondaryLargeButton} onPress={openHistory}><Text style={styles.secondaryLargeText}>View Reading History</Text></TouchableOpacity>
      </ScrollView>
    );
  }

  function renderHistory() {
    const chartData = filteredHistory.slice(0, 30).reverse();
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.eyebrow}>LOCAL RECORDS</Text><Text style={styles.pageTitle}>Reading History</Text>
        <View style={styles.filterRow}>{(['today', '7days', 'all'] as HistoryFilter[]).map(f => <Choice key={f} label={f === 'today' ? 'Today' : f === '7days' ? '7 Days' : 'All'} selected={historyFilter === f} onPress={() => setHistoryFilter(f)}/>)}</View>

        {historyStats && <View style={styles.statsGrid}>
          <SmallStat label="Avg BPM" value={historyStats.avgHr.toFixed(1)}/><SmallStat label="Min BPM" value={historyStats.minHr.toFixed(0)}/><SmallStat label="Max BPM" value={historyStats.maxHr.toFixed(0)}/><SmallStat label="Avg SpO₂" value={`${historyStats.avgSpo2.toFixed(1)}%`}/>
        </View>}

        {chartData.length > 1 && <View style={styles.chartCard}><Text style={styles.cardTitle}>Recent heart-rate trend</Text><MiniBarChart readings={chartData}/><Text style={styles.chartCaption}>Latest {chartData.length} saved readings</Text></View>}

        {filteredHistory.length === 0 ? <EmptyState title="No readings yet" body="Start a monitoring session while the ESP32 is connected to save real sensor readings."/> : filteredHistory.slice(0, 100).map(r => (
          <View key={r.reading_id} style={styles.historyCard}>
            <View><Text style={styles.historyDate}>{formatDate(new Date(r.recorded_at))}</Text><Text style={styles.historyTime}>{formatTime(new Date(r.recorded_at))}</Text></View>
            <View style={styles.historyMetrics}><Text style={styles.historyHr}>{Number(r.heart_rate).toFixed(0)} BPM</Text><Text style={styles.historySpo2}>{Number(r.spo2).toFixed(0)}% SpO₂</Text></View>
          </View>
        ))}
        <TouchableOpacity style={styles.secondaryLargeButton} onPress={exportCsv}><Text style={styles.secondaryLargeText}>Export / Share CSV</Text></TouchableOpacity>
      </ScrollView>
    );
  }

  function renderProfile() {
    return (
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>THIS PHONE = ONE USER</Text><Text style={styles.pageTitle}>Profile</Text><Text style={styles.muted}>This profile is stored only in this phone's local database.</Text>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Age</Text><TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge}/>
          <Text style={styles.label}>Gender</Text><View style={styles.choiceRow}>{['Male', 'Female', 'Other'].map(item => <Choice key={item} label={item} selected={gender === item} onPress={() => setGender(item)}/>)}</View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => saveProfile(false)}><Text style={styles.primaryButtonText}>Save Profile</Text></TouchableOpacity>
        </View>
        <View style={styles.privacyCard}><Text style={styles.cardTitle}>Privacy by design</Text><Text style={styles.muted}>No account or cloud database is required for this version. Each phone keeps its own profile and readings separately.</Text></View>
      </ScrollView>
    );
  }

  function renderSettings() {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.eyebrow}>APP PREFERENCES</Text><Text style={styles.pageTitle}>Settings</Text>
        <View style={styles.infoCard}>
          <SettingRow label="Notifications" body="Connection, sensor and data-status alerts" value={settings.notificationsEnabled} onChange={value => updateSettings({...settings, notificationsEnabled: value})}/>
          <Divider/>
          <SettingRow label="Sound effects" body="Different sound for each major event" value={settings.soundsEnabled} onChange={value => updateSettings({...settings, soundsEnabled: value})}/>
          <Divider/>
          <SettingRow label="Vibration" body="Vibrate with important notifications" value={settings.vibrationEnabled} onChange={value => updateSettings({...settings, vibrationEnabled: value})}/>
          <Divider/>
          <SettingRow label="Auto reconnect" body="Try up to 3 times after BLE disconnect" value={settings.autoReconnectEnabled} onChange={value => updateSettings({...settings, autoReconnectEnabled: value})}/>
        </View>
        <View style={styles.infoCard}><Text style={styles.cardTitle}>CVengine device</Text><Text style={styles.muted}>BLE device: CVengine Watch</Text><Text style={styles.codeLine}>Service: 12345678-1234-1234-1234-1234567890ab</Text><Text style={styles.codeLine}>Normal: 82,97,OK</Text><Text style={styles.codeLine}>Contact lost: 0,0,NO_CONTACT</Text><Text style={styles.codeLine}>Sensor error: 0,0,ERROR</Text></View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={{flex: 1}}>{renderMain()}</View>
      <BottomNav active={screen as MainScreen} onPress={async next => {if (next === 'history') await openHistory(); else setScreen(next);}}/>
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><AppContent/></SafeAreaProvider>;
}

function getStatusInfo(state: MonitorState, connected: boolean, reconnecting: boolean) {
  if (reconnecting) return {title: 'Reconnecting…', body: 'Trying to restore Bluetooth connection automatically.', color: '#9A6700', bg: '#FFF8E1'};
  if (!connected) return {title: 'Device disconnected', body: 'Connect your ESP32 to receive live sensor readings.', color: '#B42318', bg: '#FEECEB'};
  if (state === 'READING') return {title: 'Live readings active', body: 'Real-time BPM and SpO₂ data is being received.', color: '#16794B', bg: '#EAF7EF'};
  if (state === 'NO_CONTACT') return {title: 'Sensor contact lost', body: 'Bluetooth is connected, but sensor contact needs adjustment.', color: '#B54708', bg: '#FFF4E5'};
  if (state === 'ERROR') return {title: 'Reading error', body: 'The last sensor packet was invalid or interrupted.', color: '#B42318', bg: '#FEECEB'};
  if (state === 'NO_DATA') return {title: 'No sensor data', body: 'ESP32 is connected, but no packet arrived for 8 seconds.', color: '#B54708', bg: '#FFF4E5'};
  return {title: 'Connected', body: 'Waiting for the first valid sensor reading.', color: '#175CD3', bg: '#EAF2FF'};
}

function formatTime(date: Date) {return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});}
function formatDate(date: Date) {return date.toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'});}

function Choice({label, selected, onPress}: {label: string; selected: boolean; onPress: () => void}) {
  return <TouchableOpacity onPress={onPress} style={[styles.choice, selected && styles.choiceSelected]}><Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text></TouchableOpacity>;
}

function Header({title, subtitle, onBack}: {title: string; subtitle: string; onBack: () => void}) {
  return <View style={styles.headerRow}><TouchableOpacity onPress={onBack} style={styles.backButton}><Text style={styles.backText}>‹</Text></TouchableOpacity><View><Text style={styles.pageTitle}>{title}</Text><Text style={styles.muted}>{subtitle}</Text></View></View>;
}

function MetricCard({title, value, unit, accent, icon}: {title: string; value: number | null; unit: string; accent: string; icon: React.ReactNode}) {
  return <View style={styles.metricCard}><View style={styles.metricTop}><View style={[styles.metricIconWrap, {backgroundColor: `${accent}15`}]}>{icon}</View><Text style={styles.metricTitle}>{title}</Text></View><Text style={[styles.metricValue, {color: accent}]}>{value ?? '--'}</Text><Text style={styles.metricUnit}>{unit}</Text></View>;
}

function InfoRow({label, value}: {label: string; value: string}) {return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;}
function Divider() {return <View style={styles.divider}/>;}

function SmallStat({label, value}: {label: string; value: string}) {return <View style={styles.smallStat}><Text style={styles.smallStatValue}>{value}</Text><Text style={styles.smallStatLabel}>{label}</Text></View>;}

function SettingRow({label, body, value, onChange}: {label: string; body: string; value: boolean; onChange: (value: boolean) => void}) {
  return <View style={styles.settingRow}><View style={{flex: 1, paddingRight: 16}}><Text style={styles.settingTitle}>{label}</Text><Text style={styles.settingBody}>{body}</Text></View><TouchableOpacity onPress={() => onChange(!value)} style={[styles.toggle, value && styles.toggleOn]}><View style={[styles.toggleKnob, value && styles.toggleKnobOn]}/></TouchableOpacity></View>;
}

function EmptyState({title, body}: {title: string; body: string}) {return <View style={styles.emptyState}><Text style={styles.emptyIcon}>○</Text><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyBody}>{body}</Text></View>;}

function MiniBarChart({readings}: {readings: Reading[]}) {
  const hrs = readings.map(r => Number(r.heart_rate));
  const min = Math.min(...hrs);
  const max = Math.max(...hrs);
  const range = Math.max(1, max - min);
  return <View style={styles.chart}><View style={styles.chartBars}>{hrs.map((hr, index) => {const height = 18 + ((hr - min) / range) * 62; return <View key={`${index}-${hr}`} style={[styles.chartBar, {height}]}/>;})}</View><View style={styles.chartScale}><Text style={styles.chartScaleText}>{min.toFixed(0)} BPM</Text><Text style={styles.chartScaleText}>{max.toFixed(0)} BPM</Text></View></View>;
}

function BottomNav({active, onPress}: {active: MainScreen; onPress: (screen: MainScreen) => void}) {
  const items: Array<{id: MainScreen; icon: string; label: string}> = [
    {id: 'home', icon: '⌂', label: 'Home'},
    {id: 'history', icon: '≋', label: 'History'},
    {id: 'profile', icon: '○', label: 'Profile'},
    {id: 'settings', icon: '⚙', label: 'Settings'},
  ];
  return <View style={styles.bottomNav}>{items.map(item => <TouchableOpacity key={item.id} style={styles.navItem} onPress={() => onPress(item.id)}><Text style={[styles.navIcon, active === item.id && styles.navActive]}>{item.icon}</Text><Text style={[styles.navLabel, active === item.id && styles.navActive]}>{item.label}</Text></TouchableOpacity>)}</View>;
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#F6F8FB'},
  splash:{flex:1,backgroundColor:'#143A67',alignItems:'center',justifyContent:'center'},
  splashLogo:{width:210,height:150,borderRadius:22,marginBottom:18},
  splashTitle:{fontSize:38,fontWeight:'900',color:'#FFF'},splashSub:{fontSize:15,color:'#D4E2F4',marginTop:7},
  page:{padding:20,paddingBottom:32},setupWrap:{padding:22,paddingTop:48,paddingBottom:30},
  brandRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:30},brandLogo:{width:84,height:72,borderRadius:12,marginRight:12},brandText:{fontSize:26,fontWeight:'900',color:'#143A67'},poweredText:{fontSize:11,fontWeight:'700',color:'#667085',marginTop:2},homeBrand:{flexDirection:'row',alignItems:'center',flex:1},homeLogo:{width:52,height:46,borderRadius:9,marginRight:10},
  setupCard:{backgroundColor:'#FFF',borderRadius:26,padding:24,elevation:3,shadowColor:'#000',shadowOpacity:.06,shadowRadius:12,shadowOffset:{width:0,height:4}},
  eyebrow:{fontSize:11,fontWeight:'800',letterSpacing:1.2,color:'#667085',marginBottom:5},setupTitle:{fontSize:27,fontWeight:'900',color:'#172B4D',marginBottom:7},pageTitle:{fontSize:29,fontWeight:'900',color:'#172B4D'},muted:{color:'#667085',lineHeight:20},label:{fontSize:14,fontWeight:'700',color:'#344054',marginTop:20,marginBottom:8},
  input:{height:50,borderWidth:1,borderColor:'#D0D5DD',borderRadius:14,paddingHorizontal:15,color:'#101828',backgroundColor:'#FFF'},choiceRow:{flexDirection:'row',gap:8},choice:{flex:1,borderWidth:1,borderColor:'#D0D5DD',paddingVertical:12,borderRadius:13,alignItems:'center',backgroundColor:'#FFF'},choiceSelected:{backgroundColor:'#143A67',borderColor:'#143A67'},choiceText:{fontWeight:'700',color:'#475467'},choiceTextSelected:{color:'#FFF'},
  primaryButton:{backgroundColor:'#143A67',paddingVertical:15,borderRadius:14,alignItems:'center',marginTop:22},primaryButtonText:{color:'#FFF',fontWeight:'800',fontSize:16},privacyText:{textAlign:'center',color:'#98A2B3',fontSize:12,lineHeight:18,marginTop:18,paddingHorizontal:18},
  topBar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18},connectionPill:{paddingHorizontal:12,paddingVertical:8,borderRadius:999},connectedPill:{backgroundColor:'#E8F7EE'},disconnectedPill:{backgroundColor:'#FDECEC'},connectedText:{color:'#16794B',fontWeight:'800',fontSize:12},disconnectedText:{color:'#B42318',fontWeight:'800',fontSize:12},
  statusBanner:{flexDirection:'row',alignItems:'center',borderRadius:17,padding:15,marginBottom:16},statusDot:{width:10,height:10,borderRadius:5,marginRight:12},statusTitle:{fontWeight:'900',fontSize:15},statusBody:{color:'#475467',fontSize:12,marginTop:2,lineHeight:17},
  connectButton:{backgroundColor:'#16794B',borderRadius:18,padding:17,marginBottom:16},connectButtonText:{color:'#FFF',fontWeight:'900',fontSize:17},connectButtonSub:{color:'#D8F3E4',fontSize:12,marginTop:3},actionRow:{flexDirection:'row',gap:10,marginBottom:14},actionButton:{flex:1,backgroundColor:'#143A67',borderRadius:14,padding:15,alignItems:'center'},stopButton:{backgroundColor:'#B42318'},actionButtonText:{color:'#FFF',fontWeight:'800'},disconnectButton:{borderWidth:1,borderColor:'#D0D5DD',borderRadius:14,paddingHorizontal:18,justifyContent:'center',backgroundColor:'#FFF'},disconnectButtonText:{color:'#475467',fontWeight:'800'},sessionStrip:{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#FFF1F0',borderRadius:12,padding:11,marginBottom:14},sessionLive:{color:'#B42318',fontWeight:'900',fontSize:11},sessionTime:{color:'#667085',fontSize:11},
  metricGrid:{flexDirection:'row',gap:12,marginBottom:16},metricCard:{flex:1,backgroundColor:'#FFF',borderRadius:22,padding:18,elevation:2,shadowColor:'#000',shadowOpacity:.04,shadowRadius:8},metricTop:{flexDirection:'row',alignItems:'center'},metricIconWrap:{width:34,height:34,borderRadius:11,alignItems:'center',justifyContent:'center',marginRight:8},heartIcon:{fontSize:22,color:'#E5484D'},dropIcon:{fontSize:19,color:'#2878FF'},metricTitle:{fontSize:12,fontWeight:'700',color:'#667085',flex:1},metricValue:{fontSize:39,fontWeight:'900',marginTop:17},metricUnit:{color:'#98A2B3',fontWeight:'700',fontSize:12},
  infoCard:{backgroundColor:'#FFF',borderRadius:20,padding:18,marginBottom:16,elevation:1},cardTitle:{fontSize:17,fontWeight:'900',color:'#172B4D',marginBottom:12},infoRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8},infoLabel:{color:'#667085'},infoValue:{color:'#344054',fontWeight:'800',maxWidth:'60%',textAlign:'right'},contactCard:{backgroundColor:'#FFF4E5',borderRadius:17,padding:16,marginBottom:16,borderWidth:1,borderColor:'#FEDF89'},contactTitle:{fontWeight:'900',color:'#B54708'},contactBody:{color:'#7A2E0E',lineHeight:19,marginTop:4,fontSize:13},secondaryLargeButton:{borderWidth:1,borderColor:'#B8C2D1',borderRadius:14,padding:15,alignItems:'center',backgroundColor:'#FFF',marginTop:2},secondaryLargeText:{fontWeight:'800',color:'#143A67'},
  headerRow:{flexDirection:'row',alignItems:'center',marginBottom:22},backButton:{width:42,height:42,borderRadius:13,backgroundColor:'#FFF',alignItems:'center',justifyContent:'center',marginRight:12},backText:{fontSize:30,color:'#143A67',marginTop:-3},scanBanner:{flexDirection:'row',alignItems:'center',backgroundColor:'#EAF2FF',borderRadius:14,padding:13,marginBottom:12},scanDot:{color:'#175CD3',marginRight:9},scanText:{color:'#175CD3',fontWeight:'800'},deviceCard:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',borderRadius:17,padding:15,marginBottom:10},deviceIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#EAF2FF',alignItems:'center',justifyContent:'center',marginRight:12},deviceIconText:{fontWeight:'900',color:'#175CD3'},deviceName:{fontWeight:'900',color:'#172B4D',fontSize:16},deviceId:{color:'#98A2B3',fontSize:11,marginTop:3},chevron:{fontSize:30,color:'#98A2B3'},
  filterRow:{flexDirection:'row',gap:8,marginTop:16,marginBottom:15},statsGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:15},smallStat:{width:'47.5%',backgroundColor:'#FFF',borderRadius:16,padding:15},smallStatValue:{fontSize:22,fontWeight:'900',color:'#143A67'},smallStatLabel:{fontSize:11,color:'#667085',marginTop:3},chartCard:{backgroundColor:'#FFF',borderRadius:20,padding:17,marginBottom:15},chart:{height:120},chartBars:{height:88,flexDirection:'row',alignItems:'flex-end',gap:3},chartBar:{flex:1,minWidth:2,maxWidth:12,backgroundColor:'#6D9FE8',borderRadius:4},chartScale:{flexDirection:'row',justifyContent:'space-between',marginTop:6},chartScaleText:{fontSize:10,color:'#98A2B3'},chartCaption:{fontSize:11,color:'#98A2B3',marginTop:5},historyCard:{backgroundColor:'#FFF',borderRadius:16,padding:15,marginBottom:9,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},historyDate:{fontWeight:'800',color:'#344054'},historyTime:{color:'#98A2B3',fontSize:11,marginTop:3},historyMetrics:{alignItems:'flex-end'},historyHr:{fontWeight:'900',color:'#E5484D'},historySpo2:{fontWeight:'800',color:'#2878FF',fontSize:12,marginTop:4},
  privacyCard:{backgroundColor:'#EDF4FF',borderRadius:20,padding:18},settingRow:{flexDirection:'row',alignItems:'center',paddingVertical:8},settingTitle:{fontWeight:'900',color:'#344054'},settingBody:{color:'#667085',fontSize:12,lineHeight:17,marginTop:3},divider:{height:1,backgroundColor:'#EAECF0',marginVertical:10},toggle:{width:48,height:28,borderRadius:14,backgroundColor:'#D0D5DD',padding:3},toggleOn:{backgroundColor:'#16794B'},toggleKnob:{width:22,height:22,borderRadius:11,backgroundColor:'#FFF'},toggleKnobOn:{transform:[{translateX:20}]},codeLine:{fontFamily:'monospace',fontSize:12,color:'#475467',backgroundColor:'#F7F8FA',padding:8,borderRadius:8,marginBottom:7},
  emptyState:{alignItems:'center',paddingVertical:44,paddingHorizontal:24},emptyIcon:{fontSize:46,color:'#B8C2D1'},emptyTitle:{fontSize:18,fontWeight:'900',color:'#344054',marginTop:8},emptyBody:{color:'#667085',textAlign:'center',lineHeight:20,marginTop:6},
  bottomNav:{height:68,borderTopWidth:1,borderTopColor:'#EAECF0',backgroundColor:'#FFF',flexDirection:'row',paddingHorizontal:8,paddingTop:7},navItem:{flex:1,alignItems:'center'},navIcon:{fontSize:21,color:'#98A2B3',height:27},navLabel:{fontSize:10,fontWeight:'700',color:'#98A2B3'},navActive:{color:'#143A67'},
});
