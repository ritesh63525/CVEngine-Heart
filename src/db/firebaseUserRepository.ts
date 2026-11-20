import {db} from './database';

export type FirebaseLocalUser = {
  firebaseUid: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  createdAt: string;
};

async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS firebase_user_profile (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      firebase_uid TEXT NOT NULL,
      full_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      phone_number TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export async function saveFirebaseUserProfile(
  firebaseUid: string,
  fullName: string,
  age: number,
  phoneNumber: string,
) {
  await ensureTable();

  const now = new Date().toISOString();

  await db.execute(
    `
    INSERT INTO firebase_user_profile (
      id,
      firebase_uid,
      full_name,
      age,
      phone_number,
      created_at,
      updated_at
    )
    VALUES (1, ?, ?, ?, ?, ?, ?)

    ON CONFLICT(id)
    DO UPDATE SET
      firebase_uid = excluded.firebase_uid,
      full_name = excluded.full_name,
      age = excluded.age,
      phone_number = excluded.phone_number,
      updated_at = excluded.updated_at;
    `,
    [
      firebaseUid,
      fullName.trim(),
      age,
      phoneNumber,
      now,
      now,
    ],
  );
}

export async function getFirebaseUserProfile() {
  await ensureTable();

  const result = await db.execute(`
    SELECT
      firebase_uid,
      full_name,
      age,
      phone_number,
      created_at
    FROM firebase_user_profile
    WHERE id = 1
    LIMIT 1;
  `);

  const row = result.rows?.[0];

  if (!row) {
    return null;
  }

  return {
    firebaseUid: String(row.firebase_uid),
    fullName: String(row.full_name),
    age: Number(row.age),
    phoneNumber: String(row.phone_number),
    createdAt: String(row.created_at),
  } as FirebaseLocalUser;
}

export async function getProfileByPhone(
  phoneNumber: string,
) {
  await ensureTable();

  const result = await db.execute(
    `
    SELECT
      firebase_uid,
      full_name,
      age,
      phone_number,
      created_at
    FROM firebase_user_profile
    WHERE phone_number = ?
    LIMIT 1;
    `,
    [phoneNumber],
  );

  const row = result.rows?.[0];

  if (!row) {
    return null;
  }

  return {
    firebaseUid: String(row.firebase_uid),
    fullName: String(row.full_name),
    age: Number(row.age),
    phoneNumber: String(row.phone_number),
    createdAt: String(row.created_at),
  } as FirebaseLocalUser;
}