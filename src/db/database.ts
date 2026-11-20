import {open} from '@op-engineering/op-sqlite';

export const db = open({
  name: 'cvengine.db',
});

// ======================================================
// TYPES
// ======================================================

export type AppSettings = {
  notificationsEnabled: boolean;
  soundsEnabled: boolean;
  vibrationEnabled: boolean;
  autoReconnectEnabled: boolean;
};

export type Patient = {
  patient_id: number;
  age: number | null;
  gender: string | null;
  diabetes: boolean;
  hypertension: boolean;
  previousHeartAttack: boolean;
};

export type SessionStats = {
  count: number;
  avgHeartRate: number;
  minHeartRate: number;
  maxHeartRate: number;
  avgSpo2: number;
};

export type MonitoringSession = {
  session_id: number;
  patient_id: number;
  started_at: string;
  ended_at: string | null;
  reading_count: number;
  avg_bpm: number;
  min_bpm: number;
  max_bpm: number;
  avg_spo2: number;
};

// ======================================================
// DATABASE INITIALIZATION
// ======================================================

export async function initDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS app_account (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      recovery_pin TEXT NOT NULL,
      logged_in INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS patient_profile (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      age INTEGER,
      gender TEXT,
      diabetes INTEGER DEFAULT 0,
      hypertension INTEGER DEFAULT 0,
      previous_heart_attack INTEGER DEFAULT 0,
      updated_at TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS monitoring_sessions (
      session_id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL DEFAULT 1,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      reading_count INTEGER DEFAULT 0,
      avg_bpm REAL,
      min_bpm INTEGER,
      max_bpm INTEGER,
      avg_spo2 REAL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS sensor_readings (
      reading_id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL DEFAULT 1,
      session_id INTEGER,
      heart_rate INTEGER NOT NULL,
      spo2 REAL NOT NULL,
      recorded_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      notifications INTEGER DEFAULT 1,
      sound INTEGER DEFAULT 1,
      vibration INTEGER DEFAULT 1,
      auto_reconnect INTEGER DEFAULT 1
    );
  `);

  await db.execute(`
    INSERT OR IGNORE INTO app_settings
    (
      id,
      notifications,
      sound,
      vibration,
      auto_reconnect
    )
    VALUES (1,1,1,1,1);
  `);
}

// ======================================================
// ACCOUNT
// ======================================================

export async function hasAccount() {
  const result = await db.execute(
    `
    SELECT id
    FROM app_account
    WHERE id = 1
    LIMIT 1;
    `,
  );

  return (result.rows?.length ?? 0) > 0;
}

export async function registerAccount(
  fullName: string,
  email: string,
  password: string,
  recoveryPin: string,
) {
  await db.execute(
    `
    INSERT INTO app_account
    (
      id,
      full_name,
      email,
      password,
      recovery_pin,
      logged_in,
      created_at
    )
    VALUES (1,?,?,?,?,1,?);
    `,
    [
      fullName.trim(),
      email.trim().toLowerCase(),
      password,
      recoveryPin,
      new Date().toISOString(),
    ],
  );
}

export async function loginAccount(
  email: string,
  password: string,
) {
  const result = await db.execute(
    `
    SELECT id
    FROM app_account
    WHERE id = 1
      AND LOWER(email) = LOWER(?)
      AND password = ?
    LIMIT 1;
    `,
    [
      email.trim(),
      password,
    ],
  );

  if (!result.rows?.length) {
    return false;
  }

  await db.execute(
    `
    UPDATE app_account
    SET logged_in = 1
    WHERE id = 1;
    `,
  );

  return true;
}

export async function logoutAccount() {
  await db.execute(
    `
    UPDATE app_account
    SET logged_in = 0
    WHERE id = 1;
    `,
  );
}

export async function isLoggedIn() {
  const result = await db.execute(
    `
    SELECT logged_in
    FROM app_account
    WHERE id = 1
    LIMIT 1;
    `,
  );

  return (
    Number(
      result.rows?.[0]?.logged_in ?? 0,
    ) === 1
  );
}

export async function getUser() {
  const result = await db.execute(`
    SELECT
      id,
      full_name,
      email,
      created_at
    FROM app_account
    WHERE id = 1
    LIMIT 1;
  `);

  const row = result.rows?.[0];

  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),

    fullName:
      String(row.full_name),

    email:
      String(row.email),

    createdAt:
      String(row.created_at),
  };
}

// ======================================================
// PASSWORD RESET
// ======================================================

export async function resetPassword(
  email: string,
  recoveryPin: string,
  newPassword: string,
) {
  const result = await db.execute(
    `
    SELECT id
    FROM app_account
    WHERE id = 1
      AND LOWER(email) = LOWER(?)
      AND recovery_pin = ?
    LIMIT 1;
    `,
    [
      email.trim(),
      recoveryPin,
    ],
  );

  if (!result.rows?.length) {
    return false;
  }

  await db.execute(
    `
    UPDATE app_account
    SET password = ?
    WHERE id = 1;
    `,
    [newPassword],
  );

  return true;
}

// ======================================================
// PROFILE
// ======================================================

export async function saveProfile(
  age: number,
  gender: string,
  diabetes = false,
  hypertension = false,
  previousHeartAttack = false,
) {
  await db.execute(
    `
    INSERT INTO patient_profile
    (
      id,
      age,
      gender,
      diabetes,
      hypertension,
      previous_heart_attack,
      updated_at
    )
    VALUES (1,?,?,?,?,?,?)

    ON CONFLICT(id)
    DO UPDATE SET
      age = excluded.age,
      gender = excluded.gender,
      diabetes = excluded.diabetes,
      hypertension = excluded.hypertension,
      previous_heart_attack =
        excluded.previous_heart_attack,
      updated_at = excluded.updated_at;
    `,
    [
      age,
      gender,
      diabetes ? 1 : 0,
      hypertension ? 1 : 0,
      previousHeartAttack ? 1 : 0,
      new Date().toISOString(),
    ],
  );
}

export async function getProfile() {
  const result = await db.execute(
    `
    SELECT *
    FROM patient_profile
    WHERE id = 1
    LIMIT 1;
    `,
  );

  return result.rows?.[0] ?? null;
}

// ======================================================
// PATIENT COMPATIBILITY API
// ======================================================

export async function createPatient(
  age: number,
  gender: string,
): Promise<Patient> {
  await saveProfile(
    age,
    gender,
    false,
    false,
    false,
  );

  return {
    patient_id: 1,
    age,
    gender,
    diabetes: false,
    hypertension: false,
    previousHeartAttack: false,
  };
}

export async function updatePatient(
  age: number,
  gender: string,
): Promise<Patient> {
  const existing =
    await getProfile();

  const diabetes =
    Number(
      existing?.diabetes ?? 0,
    ) === 1;

  const hypertension =
    Number(
      existing?.hypertension ?? 0,
    ) === 1;

  const previousHeartAttack =
    Number(
      existing?.previous_heart_attack ??
        0,
    ) === 1;

  await saveProfile(
    age,
    gender,
    diabetes,
    hypertension,
    previousHeartAttack,
  );

  return {
    patient_id: 1,
    age,
    gender,
    diabetes,
    hypertension,
    previousHeartAttack,
  };
}

export async function getPatient():
  Promise<Patient | null> {
  const row =
    await getProfile();

  if (!row) {
    return null;
  }

  return {
    patient_id: 1,

    age:
      row.age === null ||
      row.age === undefined
        ? null
        : Number(row.age),

    gender:
      row.gender === null ||
      row.gender === undefined
        ? null
        : String(row.gender),

    diabetes:
      Number(
        row.diabetes ?? 0,
      ) === 1,

    hypertension:
      Number(
        row.hypertension ?? 0,
      ) === 1,

    previousHeartAttack:
      Number(
        row.previous_heart_attack ??
          0,
      ) === 1,
  };
}

// ======================================================
// MONITORING SESSION - ORIGINAL API
// ======================================================

export async function startSession() {
  const result = await db.execute(
    `
    INSERT INTO monitoring_sessions
    (
      patient_id,
      started_at
    )
    VALUES (?,?);
    `,
    [
      1,
      new Date().toISOString(),
    ],
  );

  return Number(
    result.insertId,
  );
}

export async function finishSession(
  sessionId: number,
) {
  const summary =
    await db.execute(
      `
      SELECT
        COUNT(*) AS reading_count,
        AVG(heart_rate) AS avg_bpm,
        MIN(heart_rate) AS min_bpm,
        MAX(heart_rate) AS max_bpm,
        AVG(spo2) AS avg_spo2
      FROM sensor_readings
      WHERE session_id = ?;
      `,
      [sessionId],
    );

  const row =
    summary.rows?.[0];

  await db.execute(
    `
    UPDATE monitoring_sessions
    SET
      ended_at = ?,
      reading_count = ?,
      avg_bpm = ?,
      min_bpm = ?,
      max_bpm = ?,
      avg_spo2 = ?
    WHERE session_id = ?;
    `,
    [
      new Date().toISOString(),

      Number(
        row?.reading_count ?? 0,
      ),

      Number(
        row?.avg_bpm ?? 0,
      ),

      Number(
        row?.min_bpm ?? 0,
      ),

      Number(
        row?.max_bpm ?? 0,
      ),

      Number(
        row?.avg_spo2 ?? 0,
      ),

      sessionId,
    ],
  );
}

// ======================================================
// MONITORING SESSION API
// ======================================================

export async function startMonitoringSession(
  patientId: number,
): Promise<number> {
  const result = await db.execute(
    `
    INSERT INTO monitoring_sessions
    (
      patient_id,
      started_at
    )
    VALUES (?,?);
    `,
    [
      patientId,
      new Date().toISOString(),
    ],
  );

  return Number(
    result.insertId,
  );
}

export async function endMonitoringSession(
  sessionId: number,
  stats: SessionStats,
) {
  await db.execute(
    `
    UPDATE monitoring_sessions
    SET
      ended_at = ?,
      reading_count = ?,
      avg_bpm = ?,
      min_bpm = ?,
      max_bpm = ?,
      avg_spo2 = ?
    WHERE session_id = ?;
    `,
    [
      new Date().toISOString(),
      stats.count,
      stats.avgHeartRate,
      stats.minHeartRate,
      stats.maxHeartRate,
      stats.avgSpo2,
      sessionId,
    ],
  );
}

// ======================================================
// MONITORING HISTORY
// ======================================================

export async function getMonitoringSessions(
  patientId?: number,
): Promise<MonitoringSession[]> {
  let result;

  if (patientId !== undefined) {
    result = await db.execute(
      `
      SELECT
        session_id,
        patient_id,
        started_at,
        ended_at,
        reading_count,
        avg_bpm,
        min_bpm,
        max_bpm,
        avg_spo2
      FROM monitoring_sessions
      WHERE patient_id = ?
      ORDER BY started_at DESC;
      `,
      [patientId],
    );
  } else {
    result = await db.execute(
      `
      SELECT
        session_id,
        patient_id,
        started_at,
        ended_at,
        reading_count,
        avg_bpm,
        min_bpm,
        max_bpm,
        avg_spo2
      FROM monitoring_sessions
      ORDER BY started_at DESC;
      `,
    );
  }

  return (result.rows ?? []).map(
    row => ({
      session_id:
        Number(row.session_id),

      patient_id:
        Number(row.patient_id),

      started_at:
        String(row.started_at),

      ended_at:
        row.ended_at === null ||
        row.ended_at === undefined
          ? null
          : String(row.ended_at),

      reading_count:
        Number(
          row.reading_count ?? 0,
        ),

      avg_bpm:
        Number(
          row.avg_bpm ?? 0,
        ),

      min_bpm:
        Number(
          row.min_bpm ?? 0,
        ),

      max_bpm:
        Number(
          row.max_bpm ?? 0,
        ),

      avg_spo2:
        Number(
          row.avg_spo2 ?? 0,
        ),
    }),
  );
}

// ======================================================
// REAL SENSOR DATA
// ======================================================

export async function saveReading(
  patientId: number,
  heartRate: number,
  spo2: number,
  sessionId: number | null = null,
) {
  await db.execute(
    `
    INSERT INTO sensor_readings
    (
      patient_id,
      session_id,
      heart_rate,
      spo2,
      recorded_at
    )
    VALUES (?,?,?,?,?);
    `,
    [
      patientId,
      sessionId,
      heartRate,
      spo2,
      new Date().toISOString(),
    ],
  );
}

export async function getReadings(
  patientId?: number,
) {
  if (
    patientId !== undefined
  ) {
    const result =
      await db.execute(
        `
        SELECT *
        FROM sensor_readings
        WHERE patient_id = ?
        ORDER BY recorded_at DESC;
        `,
        [patientId],
      );

    return result.rows ?? [];
  }

  const result =
    await db.execute(
      `
      SELECT *
      FROM sensor_readings
      ORDER BY recorded_at DESC;
      `,
    );

  return result.rows ?? [];
}

// ======================================================
// SETTINGS
// ======================================================

export async function getSettings():
  Promise<AppSettings> {
  const result =
    await db.execute(
      `
      SELECT *
      FROM app_settings
      WHERE id = 1
      LIMIT 1;
      `,
    );

  const row =
    result.rows?.[0];

  return {
    notificationsEnabled:
      Number(
        row?.notifications ?? 1,
      ) === 1,

    soundsEnabled:
      Number(
        row?.sound ?? 1,
      ) === 1,

    vibrationEnabled:
      Number(
        row?.vibration ?? 1,
      ) === 1,

    autoReconnectEnabled:
      Number(
        row?.auto_reconnect ?? 1,
      ) === 1,
  };
}

export async function saveSettings(
  settings: AppSettings,
) {
  await db.execute(
    `
    INSERT INTO app_settings
    (
      id,
      notifications,
      sound,
      vibration,
      auto_reconnect
    )
    VALUES (1,?,?,?,?)

    ON CONFLICT(id)
    DO UPDATE SET
      notifications =
        excluded.notifications,
      sound =
        excluded.sound,
      vibration =
        excluded.vibration,
      auto_reconnect =
        excluded.auto_reconnect;
    `,
    [
      settings.notificationsEnabled
        ? 1
        : 0,

      settings.soundsEnabled
        ? 1
        : 0,

      settings.vibrationEnabled
        ? 1
        : 0,

      settings.autoReconnectEnabled
        ? 1
        : 0,
    ],
  );
}

// ======================================================
// OLD SETTINGS API COMPATIBILITY
// ======================================================

export async function updateSettings(
  notifications: boolean,
  sound: boolean,
  vibration: boolean,
  autoReconnect: boolean,
) {
  await saveSettings({
    notificationsEnabled:
      notifications,

    soundsEnabled:
      sound,

    vibrationEnabled:
      vibration,

    autoReconnectEnabled:
      autoReconnect,
  });
}