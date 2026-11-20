export type ParsedBLEData = {
  heartRate: number | null;
  spo2: number | null;

  status:
    | 'OK'
    | 'NO_CONTACT'
    | 'ERROR'
    | 'INVALID';
};

// ==========================================
// BASIC SENSOR VALUE CHECK
// ==========================================

function validHeartRate(
  value: number,
) {
  return (
    Number.isFinite(value) &&
    value > 0 &&
    value <= 250
  );
}

function validSpo2(
  value: number,
) {
  return (
    Number.isFinite(value) &&
    value > 0 &&
    value <= 100
  );
}

// ==========================================
// PARSER
// ==========================================

export function parseBLEData(
  rawData: string,
): ParsedBLEData {
  const raw =
    rawData.trim();

  // Empty BLE packet.

  if (!raw) {
    return {
      heartRate: null,
      spo2: null,
      status: 'INVALID',
    };
  }

  // ========================================
  // CURRENT ESP32 FORMAT
  //
  // 82,97,OK
  // 0,0,NO_CONTACT
  // 0,0,ERROR
  // ========================================

  const parts =
    raw.split(',');

  if (parts.length >= 3) {
    const heartRate =
      Number(
        parts[0].trim(),
      );

    const spo2 =
      Number(
        parts[1].trim(),
      );

    const status =
      parts[2]
        .trim()
        .toUpperCase();

    // --------------------------------------
    // FINGER REMOVED
    // --------------------------------------

    if (
      status ===
      'NO_CONTACT'
    ) {
      return {
        heartRate: null,
        spo2: null,
        status: 'NO_CONTACT',
      };
    }

    // --------------------------------------
    // SENSOR ERROR
    // --------------------------------------

    if (
      status ===
      'ERROR'
    ) {
      return {
        heartRate: null,
        spo2: null,
        status: 'ERROR',
      };
    }

    // --------------------------------------
    // VALID LIVE READING
    // --------------------------------------

    if (status === 'OK') {
      /*
       * Some sensor firmware may briefly
       * send zero values while the finger
       * is being removed.
       *
       * Do not display/save these as real
       * health readings.
       */

      if (
        heartRate <= 0 ||
        spo2 <= 0
      ) {
        return {
          heartRate: null,
          spo2: null,
          status: 'NO_CONTACT',
        };
      }

      if (
        validHeartRate(
          heartRate,
        ) &&
        validSpo2(
          spo2,
        )
      ) {
        return {
          heartRate,
          spo2,
          status: 'OK',
        };
      }

      return {
        heartRate: null,
        spo2: null,
        status: 'INVALID',
      };
    }
  }

  // ========================================
  // OLD ESP32 FORMAT SUPPORT
  //
  // BPM:82,SpO2:97
  // BPM:--,SpO2:--
  // ========================================

  const oldMatch =
    raw.match(
      /BPM:\s*(\d+|--)\s*,\s*SpO2:\s*(\d+|--)/i,
    );

  if (oldMatch) {
    if (
      oldMatch[1] === '--' ||
      oldMatch[2] === '--'
    ) {
      return {
        heartRate: null,
        spo2: null,
        status: 'NO_CONTACT',
      };
    }

    const heartRate =
      Number(oldMatch[1]);

    const spo2 =
      Number(oldMatch[2]);

    if (
      heartRate <= 0 ||
      spo2 <= 0
    ) {
      return {
        heartRate: null,
        spo2: null,
        status: 'NO_CONTACT',
      };
    }

    if (
      validHeartRate(
        heartRate,
      ) &&
      validSpo2(
        spo2,
      )
    ) {
      return {
        heartRate,
        spo2,
        status: 'OK',
      };
    }

    return {
      heartRate: null,
      spo2: null,
      status: 'INVALID',
    };
  }

  // ========================================
  // UNKNOWN PACKET
  // ========================================

  return {
    heartRate: null,
    spo2: null,
    status: 'INVALID',
  };
}