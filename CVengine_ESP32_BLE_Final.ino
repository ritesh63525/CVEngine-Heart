#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "MAX30105.h"
#include "spo2_algorithm.h"

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// =====================================================
// ESP32-S3 SUPER MINI I2C
// =====================================================
#define SDA_PIN 6
#define SCL_PIN 7

// =====================================================
// OLED 128x32
// =====================================================
#define OLED_ADDR 0x3C
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32

Adafruit_SSD1306 oled(
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  &Wire,
  -1
);

// =====================================================
// MAX30102
// =====================================================
MAX30105 sensor;

// =====================================================
// BPM SETTINGS
// SAME LOGIC AS YOUR WORKING CODE
// =====================================================
#define MA_SIZE 5
#define BPM_SIZE 5

#define MIN_BPM 40
#define MAX_BPM 120

#define REFRACTORY 300

int brightness = 30;

long ir = 0;

long smooth = 0;
long previousSmooth = 0;

unsigned long previousBeat = 0;
unsigned long previousInterval = 0;

long peak = 0;
long trough = 0;
long amplitude = 0;

bool rising = false;
bool finger = false;

long ma[MA_SIZE];

int maIndex = 0;
int maCount = 0;

float bpmBuffer[BPM_SIZE];

int bpmIndex = 0;
int bpmCount = 0;

int bpm = 0;

// =====================================================
// SPO2
// =====================================================
#define SPO2_BUFFER_SIZE 100

uint32_t irBuffer[SPO2_BUFFER_SIZE];
uint32_t redBuffer[SPO2_BUFFER_SIZE];

int spo2Index = 0;

int32_t calculatedSpO2 = 0;
int8_t validSpO2 = 0;

int32_t tempHeartRate = 0;
int8_t tempHeartRateValid = 0;

int displaySpO2 = 0;

// =====================================================
// BLE
// =====================================================
#define SERVICE_UUID \
"12345678-1234-1234-1234-1234567890ab"

#define CHARACTERISTIC_UUID \
"abcdefab-1234-5678-1234-abcdefabcdef"

BLECharacteristic *pCharacteristic;
BLEServer *pServer;

bool deviceConnected = false;
unsigned long lastBleSend = 0;
#define BLE_SEND_INTERVAL 500

// =====================================================
// BLE CALLBACKS
// =====================================================
class ServerCallbacks : public BLEServerCallbacks {

  void onConnect(BLEServer *server) {

    deviceConnected = true;

    Serial.println("BLE CONNECTED");
  }

  void onDisconnect(BLEServer *server) {

    deviceConnected = false;

    Serial.println("BLE DISCONNECTED");

    delay(200);

    server->startAdvertising();

    Serial.println("BLE ADVERTISING AGAIN");
  }
};

// =====================================================
// RESET BPM
// =====================================================
void resetBPM() {

  bpm = 0;

  previousBeat = 0;
  previousInterval = 0;

  smooth = 0;
  previousSmooth = 0;

  peak = 0;
  trough = 0;
  amplitude = 0;

  rising = false;

  maIndex = 0;
  maCount = 0;

  bpmIndex = 0;
  bpmCount = 0;

  for (int i = 0; i < MA_SIZE; i++) {
    ma[i] = 0;
  }

  for (int i = 0; i < BPM_SIZE; i++) {
    bpmBuffer[i] = 0;
  }
}

// =====================================================
// RESET SPO2
// =====================================================
void resetSpO2() {

  spo2Index = 0;

  calculatedSpO2 = 0;
  displaySpO2 = 0;

  validSpO2 = 0;
}

// =====================================================
// OLED
// =====================================================
void updateOLED() {

  oled.clearDisplay();

  oled.setTextColor(SSD1306_WHITE);

  // -----------------------------
  // NO FINGER
  // -----------------------------
  if (!finger) {

    oled.setTextSize(1);

    oled.setCursor(20, 2);
    oled.print("Place finger");

    oled.setCursor(0, 20);
    oled.print("BPM:--");

    oled.setCursor(65, 20);
    oled.print("SpO2:--");

    oled.display();

    return;
  }

  // -----------------------------
  // BPM
  // -----------------------------
  oled.setTextSize(1);

  oled.setCursor(0, 0);
  oled.print("BPM");

  oled.setTextSize(2);

  oled.setCursor(0, 14);

  if (bpm > 0) {
    oled.print(bpm);
  }
  else {
    oled.print("--");
  }

  // -----------------------------
  // SPO2
  // -----------------------------
  oled.setTextSize(1);

  oled.setCursor(68, 0);
  oled.print("SpO2");

  oled.setTextSize(2);

  oled.setCursor(68, 14);

  if (displaySpO2 > 0) {

    oled.print(displaySpO2);
    oled.print("%");
  }
  else {

    oled.print("--");
  }

  oled.display();
}

// =====================================================
// BLE SEND
// =====================================================
void sendBLE() {

  // Keep BLE traffic controlled: 2 packets/second is enough for the app.
  if (millis() - lastBleSend < BLE_SEND_INTERVAL) return;
  lastBleSend = millis();

  String data;

  if (!finger) {
    data = "0,0,NO_CONTACT";
  }
  else if (bpm > 0 && displaySpO2 > 0) {
    data = String(bpm) + "," + String(displaySpO2) + ",OK";
  }
  else {
    // Finger is present, but validated BPM/SpO2 are still settling.
    // Wait instead of generating a false error notification.
    return;
  }

  pCharacteristic->setValue(data.c_str());

  if (deviceConnected) {
    pCharacteristic->notify();
  }

  Serial.println(data);
}

// =====================================================
// SETUP
// =====================================================
void setup() {

  Serial.begin(115200);

  delay(1000);

  // ===================================================
  // I2C
  // ===================================================
  Wire.begin(SDA_PIN, SCL_PIN);

  Wire.setClock(400000);

  // ===================================================
  // OLED
  // ===================================================
  if (!oled.begin(
        SSD1306_SWITCHCAPVCC,
        OLED_ADDR)) {

    Serial.println("OLED ERROR");

    while (1);
  }

  oled.clearDisplay();

  oled.setTextColor(SSD1306_WHITE);

  oled.setTextSize(1);

  oled.setCursor(20, 10);

  oled.print("Starting...");

  oled.display();

  // ===================================================
  // MAX30102
  // ===================================================
  if (!sensor.begin(
        Wire,
        I2C_SPEED_FAST,
        0x57)) {

    Serial.println("MAX30102 ERROR");

    oled.clearDisplay();

    oled.setCursor(10, 10);

    oled.print("MAX30102 ERROR");

    oled.display();

    while (1);
  }

  // ===================================================
  // SENSOR SETTINGS
  // ===================================================
  sensor.setup(
    brightness,
    4,
    2,
    100,
    411,
    4096
  );

  // RED + IR both required for SpO2
  sensor.setPulseAmplitudeRed(brightness);
  sensor.setPulseAmplitudeIR(brightness);

  // ===================================================
  // BLE
  // ===================================================
  BLEDevice::init("CVengine Watch");

  pServer =
    BLEDevice::createServer();

  pServer->setCallbacks(
    new ServerCallbacks()
  );

  BLEService *pService =
    pServer->createService(
      SERVICE_UUID
    );

  pCharacteristic =
    pService->createCharacteristic(
      CHARACTERISTIC_UUID,

      BLECharacteristic::PROPERTY_READ |
      BLECharacteristic::PROPERTY_NOTIFY
    );

  pCharacteristic->addDescriptor(
    new BLE2902()
  );

  pCharacteristic->setValue(
    "BPM:--,SpO2:--"
  );

  pService->start();

  // ===================================================
  // ADVERTISING
  // ===================================================
  BLEAdvertising *pAdvertising =
    BLEDevice::getAdvertising();

  pAdvertising->addServiceUUID(
    SERVICE_UUID
  );

  pAdvertising->setScanResponse(true);

  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);

  BLEDevice::startAdvertising();

  Serial.println();
  Serial.println("BLE Started");
  Serial.println("Device name: CVengine Watch");

  updateOLED();
}

// =====================================================
// LOOP
// =====================================================
void loop() {

  // ---------------------------------------------------
  // READ MAX30102
  // ---------------------------------------------------
  ir = sensor.getIR();

  uint32_t red =
    sensor.getRed();

  // ===================================================
  // FINGER DETECTION
  // SAME THRESHOLD FROM YOUR WORKING BPM CODE
  // ===================================================
  finger = ir > 10000;

  // ===================================================
  // NO FINGER
  // ===================================================
  if (!finger) {

    resetBPM();

    resetSpO2();

    updateOLED();

    sendBLE();

    delay(100);

    return;
  }

  // ===================================================
  // BPM ALGORITHM
  // YOUR ORIGINAL WORKING LOGIC
  // ===================================================

  ma[maIndex] = ir;

  maIndex =
    (maIndex + 1) % MA_SIZE;

  if (maCount < MA_SIZE) {
    maCount++;
  }

  long total = 0;

  for (int i = 0; i < maCount; i++) {

    total += ma[i];
  }

  smooth =
    total / maCount;

  // ---------------------------------------------------
  // DERIVATIVE
  // ---------------------------------------------------
  long derivative =
    smooth - previousSmooth;

  // ---------------------------------------------------
  // RISING EDGE
  // ---------------------------------------------------
  if (derivative > 0) {

    if (!rising) {

      rising = true;

      trough = smooth;

      peak = smooth;
    }

    if (smooth > peak) {

      peak = smooth;
    }
  }

  // ---------------------------------------------------
  // FALLING EDGE = PEAK
  // ---------------------------------------------------
  if (
    derivative < 0 &&
    rising
  ) {

    rising = false;

    amplitude =
      peak - trough;

    // -------------------------------------------------
    // MINIMUM PULSE AMPLITUDE
    // -------------------------------------------------
    if (amplitude > 100) {

      unsigned long now =
        millis();

      // -----------------------------------------------
      // REFRACTORY
      // -----------------------------------------------
      if (
        previousBeat == 0 ||
        now - previousBeat >= REFRACTORY
      ) {

        if (previousBeat > 0) {

          unsigned long interval =
            now - previousBeat;

          int currentBPM =
            60000UL / interval;

          // -------------------------------------------
          // VALID BPM RANGE
          // -------------------------------------------
          if (
            currentBPM >= MIN_BPM &&
            currentBPM <= MAX_BPM
          ) {

            bool valid = true;

            // -----------------------------------------
            // REJECT >20% INTERVAL CHANGE
            // -----------------------------------------
            if (previousInterval > 0) {

              unsigned long difference;

              if (
                interval >
                previousInterval
              ) {

                difference =
                  interval -
                  previousInterval;
              }

              else {

                difference =
                  previousInterval -
                  interval;
              }

              if (
                difference >
                previousInterval * 0.20
              ) {

                valid = false;
              }
            }

            // -----------------------------------------
            // ACCEPT BPM
            // -----------------------------------------
            if (valid) {

              previousInterval =
                interval;

              bpmBuffer[bpmIndex] =
                currentBPM;

              bpmIndex =
                (bpmIndex + 1)
                % BPM_SIZE;

              if (
                bpmCount <
                BPM_SIZE
              ) {

                bpmCount++;
              }

              float totalBPM = 0;

              for (
                int i = 0;
                i < bpmCount;
                i++
              ) {

                totalBPM +=
                  bpmBuffer[i];
              }

              bpm =
                round(
                  totalBPM /
                  bpmCount
                );
            }
          }
        }

        previousBeat = now;
      }
    }

    peak = smooth;

    trough = smooth;
  }

  previousSmooth = smooth;

  // ===================================================
  // SPO2 BUFFER
  // ===================================================
  irBuffer[spo2Index] =
    (uint32_t)ir;

  redBuffer[spo2Index] =
    red;

  spo2Index++;

  // ===================================================
  // CALCULATE SPO2
  // ===================================================
  if (
    spo2Index >=
    SPO2_BUFFER_SIZE
  ) {

    maxim_heart_rate_and_oxygen_saturation(

      irBuffer,
      SPO2_BUFFER_SIZE,

      redBuffer,

      &calculatedSpO2,
      &validSpO2,

      &tempHeartRate,
      &tempHeartRateValid
    );

    // -----------------------------------------------
    // ONLY VALID SPO2
    // -----------------------------------------------
    if (
      validSpO2 &&
      calculatedSpO2 >= 70 &&
      calculatedSpO2 <= 100
    ) {

      if (displaySpO2 == 0) {

        displaySpO2 =
          calculatedSpO2;
      }

      else {

        // Light smoothing
        displaySpO2 =
          (
            displaySpO2 * 2 +
            calculatedSpO2
          ) / 3;
      }
    }

    spo2Index = 0;
  }

  // ===================================================
  // OLED
  // ===================================================
  updateOLED();

  // ===================================================
  // BLE
  // ===================================================
  sendBLE();

  // Approximately 100 Hz
  delay(10);
}