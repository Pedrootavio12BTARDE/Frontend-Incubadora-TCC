#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <math.h>
#include <time.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/semphr.h
#include "secrets.h"
#ifndef DEVICE_API_TOKEN
#define DEVICE_API_TOKEN ""
#endif

const char* API_BASE_URL = "https://ecoincubadora-backend.onrender.com/api/v1";

constexpr uint8_t DHT_PIN = 14;
constexpr uint8_t SOIL_SENSOR_PIN = 35;
constexpr uint8_t LAMP_RELAY_PIN = 26;

// Pinos de Controle da Ponte H L9110S (Substituem o relé do motor)
constexpr uint8_t MOTOR_IN1_PIN = 23; // Ponte H B-1A
constexpr uint8_t MOTOR_IN2_PIN = 19; // Ponte H B-1B

constexpr uint8_t DHT_TYPE = DHT11;

// Calibração do Sensor de Solo (0 - 4095)
constexpr int SOIL_DRY_RAW = 3200;
constexpr int SOIL_WET_RAW = 1400;

constexpr bool RELAY_ACTIVE_LOW = true;
constexpr unsigned long SENSOR_INTERVAL_MS = 5000;
constexpr unsigned long DEVICE_HEARTBEAT_INTERVAL_MS = 15000;
constexpr unsigned long LAMP_POLL_INTERVAL_MS = 2000;
constexpr unsigned long THERMAL_CHECK_INTERVAL_MS = 1000;
constexpr float OVERHEAT_LIMIT_C = 39.5f;
constexpr float THERMAL_SAFE_LIMIT_C = 37.5f;
constexpr unsigned long THERMAL_EVENT_RETRY_INTERVAL_MS = 5000;
constexpr unsigned long MOTOR_COMMAND_POLL_INTERVAL_MS = 1000;
constexpr unsigned long MOTOR_MODE_POLL_INTERVAL_MS = 10000;
constexpr uint32_t AUTO_ROLL_INTERVAL_MS = 4UL * 60UL * 60UL * 1000UL;

// Tempo ideal de rotação da esteira para evitar queda dos ovos (1.5 segundos)
constexpr uint32_t DEFAULT_MOTOR_DURATION_MS = 1500;

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClientSecure secureClient;
StaticJsonDocument<4096> motorCommandResponse;

unsigned long lastSensorPost = 0;
unsigned long lastDeviceHeartbeat = 0;
unsigned long lastLampPoll = 0;
unsigned long lastLampSync = 0;
unsigned long lastWifiDiagnostic = 0;
unsigned long lastMotorCommandPoll = 0;
unsigned long lastMotorModePoll = 0;
unsigned long lastAutoRollAt = 0;

bool wifiStarted = false;
bool wifiWasConnected = false;
volatile bool lampIsOn = false;
volatile bool lampNeedsSync = false;
volatile bool thermalProtectionActive = false;
bool thermalSafetyNeedsSync = false;

unsigned long lastThermalSafetySync = 0;
float thermalEventTemperature = NAN;
volatile uint8_t pendingThermalTransition = 0;
volatile uint8_t queuedThermalTransition = 0;
volatile float pendingThermalTemperature = NAN;
volatile float queuedThermalTemperature = NAN;
SemaphoreHandle_t dhtMutex = nullptr;
portMUX_TYPE thermalSafetyMux = portMUX_INITIALIZER_UNLOCKED;
String thermalStateToSync;
bool motorRunning = false;
bool motorQueueInitialized = false;
bool autoModeEnabled = false;
bool timeSyncStarted = false;
bool clockWasSynchronized = false;
bool rotateClockwise = true; // Alterna entre Sentido Horário e Anti-Horário

uint32_t motorStopAt = 0;
uint32_t currentMotorCommandId = 0;
uint32_t lastProcessedMotorCommandId = 0;

int relayOnLevel() {
  return RELAY_ACTIVE_LOW ? LOW : HIGH;
}

int relayOffLevel() {
  return RELAY_ACTIVE_LOW ? HIGH : LOW;
}

String apiUrl(const String& path) {
  return String(API_BASE_URL) + path;
}

bool beginRequest(HTTPClient& http, const String& path) {
  http.setTimeout(10000);
  const String url = apiUrl(path);
  if (url.startsWith("https://")) {
    secureClient.setInsecure();
    return http.begin(secureClient, url);
  }
  return http.begin(url);
}

void logHttpFailure(const char* operation, HTTPClient& http, int status) {
  if (status >= 0) return;

  char tlsError[128] = {};
  secureClient.lastError(tlsError, sizeof(tlsError));
  Serial.printf("%s falhou: HTTP %d (%s); TLS: %s\n",
                operation, status, http.errorToString(status).c_str(), tlsError);
}

void applyLamp(bool on) {
  lampIsOn = on;
  digitalWrite(LAMP_RELAY_PIN, on ? relayOnLevel() : relayOffLevel());
}

// Funções de Controle de Rotação da Ponte H
void stopMotor() {
  digitalWrite(MOTOR_IN1_PIN, LOW);
  digitalWrite(MOTOR_IN2_PIN, LOW);
}

void startMotor(bool clockwise) {
  if (clockwise) {
    // Giro para frente / Horário
    digitalWrite(MOTOR_IN1_PIN, HIGH);
    digitalWrite(MOTOR_IN2_PIN, LOW);
  } else {
    // Giro para trás / Anti-horário
    digitalWrite(MOTOR_IN1_PIN, LOW);
    digitalWrite(MOTOR_IN2_PIN, HIGH);
  }
}

float readSoilHumidityPercent(int rawValue) {
  if (SOIL_DRY_RAW == SOIL_WET_RAW) return NAN;

  const float percentage =
    (static_cast<float>(SOIL_DRY_RAW - rawValue) * 100.0f) /
    static_cast<float>(SOIL_DRY_RAW - SOIL_WET_RAW);

  return constrain(percentage, 0.0f, 100.0f);
}

bool ensureSystemTime(unsigned long now) {
  const time_t currentTime = time(nullptr);
  if (currentTime > 1700000000) {
    if (!clockWasSynchronized) {
      Serial.printf("Relogio sincronizado via NTP: %lu\n",
                    static_cast<unsigned long>(currentTime));
      clockWasSynchronized = true;
    }
    return true;
  }

  if (!timeSyncStarted) {
    configTime(0, 0, "pool.ntp.org", "time.cloudflare.com", "time.google.com");
    timeSyncStarted = true;
    Serial.println("Aguardando sincronizacao do relogio por NTP antes do HTTPS...");
  }

  if (now - lastWifiDiagnostic >= 5000) {
    lastWifiDiagnostic = now;
    Serial.println("Ainda aguardando hora NTP para validar o certificado HTTPS.");
  }
  return false;
}

bool sendLampCommand(bool on) {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  if (!beginRequest(http, "/actuators/lamp")) return false;

  StaticJsonDocument<32> request;
  request["on"] = on;
  String body;
  serializeJson(request, body);

  http.addHeader("Content-Type", "application/json");
  const int status = http.sendRequest("PATCH", body);
  logHttpFailure("Comando da lampada", http, status);
  http.end();

  Serial.printf("Comando local da lampada: HTTP %d\n", status);
  return status >= 200 && status < 300;
}

void thermalSafetyTask(void* parameter) {
  (void)parameter;
  for (;;) {
    float temperature = NAN;
    if (dhtMutex && xSemaphoreTake(dhtMutex, pdMS_TO_TICKS(250)) == pdTRUE) {
      temperature = dht.readTemperature();
      xSemaphoreGive(dhtMutex);
    }

    if (isfinite(temperature) && temperature > 0) {
      bool cutLamp = false;
      uint8_t transition = 0;
      portENTER_CRITICAL(&thermalSafetyMux);
      if (!thermalProtectionActive && temperature >= OVERHEAT_LIMIT_C) {
        thermalProtectionActive = true;
        lampNeedsSync = false;
        if (pendingThermalTransition == 0) {
          pendingThermalTransition = 1;
          pendingThermalTemperature = temperature;
        } else {
          queuedThermalTransition = 1;
          queuedThermalTemperature = temperature;
        }
        transition = 1;
        cutLamp = true;
      } else if (thermalProtectionActive && temperature <= THERMAL_SAFE_LIMIT_C) {
        thermalProtectionActive = false;
        lampNeedsSync = false;
        if (pendingThermalTransition == 0) {
          pendingThermalTransition = 2;
          pendingThermalTemperature = temperature;
        } else {
          queuedThermalTransition = 2;
          queuedThermalTemperature = temperature;
        }
        transition = 2;
        cutLamp = true;
      }
      portEXIT_CRITICAL(&thermalSafetyMux);

      if (cutLamp) {
        lampIsOn = false;
        digitalWrite(LAMP_RELAY_PIN, relayOffLevel());
        Serial.printf(transition == 1
          ? "ALERTA CRITICO: %.1f C. Rele da lampada desligado.\n"
          : "Temperatura segura: %.1f C. Protecao liberada; lampada segue desligada.\n",
          temperature);
      }
    }
    if (thermalProtectionActive) {
      lampIsOn = false;
      digitalWrite(LAMP_RELAY_PIN, relayOffLevel());
    }
    vTaskDelay(pdMS_TO_TICKS(THERMAL_CHECK_INTERVAL_MS));
  }
}

void consumeThermalTransition() {
  if (thermalSafetyNeedsSync) return;
  uint8_t transition;
  float temperature;
  portENTER_CRITICAL(&thermalSafetyMux);
  transition = pendingThermalTransition;
  temperature = pendingThermalTemperature;
  pendingThermalTransition = queuedThermalTransition;
  pendingThermalTemperature = queuedThermalTemperature;
  queuedThermalTransition = 0;
  queuedThermalTemperature = NAN;
  portEXIT_CRITICAL(&thermalSafetyMux);
  if (transition == 0) return;

  thermalStateToSync = transition == 1 ? "CRITICAL_OVERHEAT" : "THERMAL_PROTECTION_CLEARED";
  thermalEventTemperature = temperature;
  thermalSafetyNeedsSync = true;
}
void syncLocalLampCommand(unsigned long now) {
  if (thermalProtectionActive || !lampNeedsSync || now - lastLampSync < 1000) return;
  lastLampSync = now;
  lampNeedsSync = !sendLampCommand(lampIsOn);
}

void pollLampState() {
  if (lampNeedsSync || WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  if (!beginRequest(http, "/actuators/state")) return;

  const int status = http.GET();
  if (status == HTTP_CODE_OK) {
    StaticJsonDocument<128> response;
    const DeserializationError error = deserializeJson(response, http.getString());

    if (!error) {
      const char* state = response["lamp"] | "off";
      const bool requestedLampState = strcmp(state, "on") == 0;
      applyLamp(thermalProtectionActive ? false : requestedLampState);
      Serial.printf("Estado recebido da API: lamp=%s; GPIO26=%s (%d)\n",
                    state,
                    requestedLampState ? "ligado" : "desligado",
                    requestedLampState ? relayOnLevel() : relayOffLevel());
    } else {
      Serial.printf("JSON invalido ao consultar lampada: %s\n", error.c_str());
    }
  } else {
    logHttpFailure("Consulta da lampada", http, status);
    Serial.printf("Consulta do estado da lampada: HTTP %d\n", status);
  }

  http.end();
}

void pollMotorMode(unsigned long now) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  if (!beginRequest(http, "/actuators/motor/mode")) return;
  const int status = http.GET();
  if (status == HTTP_CODE_OK) {
    StaticJsonDocument<128> response;
    const DeserializationError error = deserializeJson(response, http.getString());
    if (!error) {
      const bool requestedMode = response["autoRoll"] | false;
      if (requestedMode != autoModeEnabled) {
        autoModeEnabled = requestedMode;
        lastAutoRollAt = now;
        Serial.printf("Modo automatico da esteira %s; proxima rolagem em 4 horas.\n", autoModeEnabled ? "ativado" : "desativado");
      }
    } else {
      Serial.printf("JSON invalido no modo automatico: %s\n", error.c_str());
    }
  } else {
    logHttpFailure("Consulta do modo automatico", http, status);
  }
  http.end();
}
bool acknowledgeMotorCommand(uint32_t commandId) {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  const String path = "/actuators/commands/" + String(commandId) + "/ack";
  if (!beginRequest(http, path)) return false;

  http.addHeader("Content-Type", "application/json");
  const int status = http.sendRequest("PATCH", "{}");
  logHttpFailure("Confirmacao do comando do motor", http, status);
  http.end();
  Serial.printf("Confirmacao do comando do motor %lu: HTTP %d\n",
                static_cast<unsigned long>(commandId), status);
  return status >= 200 && status < 300;
}

void finishMotorRotation() {
  stopMotor(); // Para a Ponte H
  motorRunning = false;
  
  // Inverte o sentido para a próxima rolagem de ovos
  rotateClockwise = !rotateClockwise; 
  
  Serial.printf("Motor desligado (Ponte H); comando %lu concluido. Proximo sentido: %s\n",
                static_cast<unsigned long>(currentMotorCommandId),
                rotateClockwise ? "Frente (IN1)" : "Trás (IN2)");

  if (currentMotorCommandId != 0 && autoModeEnabled) lastAutoRollAt = millis();
  if (currentMotorCommandId != 0 && acknowledgeMotorCommand(currentMotorCommandId)) {
    currentMotorCommandId = 0;
  }
}

void serviceMotorTimer() {
  if (motorRunning && static_cast<int32_t>(millis() - motorStopAt) >= 0) {
    finishMotorRotation();
  }
}

void serviceAutomaticRoll(unsigned long now) {
  if (!autoModeEnabled || motorRunning || now - lastAutoRollAt < AUTO_ROLL_INTERVAL_MS) return;
  lastAutoRollAt = now;
  currentMotorCommandId = 0;
  motorStopAt = now + DEFAULT_MOTOR_DURATION_MS;
  motorRunning = true;
  startMotor(rotateClockwise);
  Serial.printf("Rolagem automatica iniciada por %lu ms no sentido: %s\n", static_cast<unsigned long>(DEFAULT_MOTOR_DURATION_MS), rotateClockwise ? "Frente" : "Tras");
}
void pollMotorCommands() {
  if (WiFi.status() != WL_CONNECTED || motorRunning) return;

  HTTPClient http;
  if (!beginRequest(http, "/actuators/commands/pending")) return;

  const int status = http.GET();
  if (status != HTTP_CODE_OK) {
    logHttpFailure("Consulta dos comandos do motor", http, status);
    Serial.printf("Consulta dos comandos do motor: HTTP %d\n", status);
    http.end();
    return;
  }

  motorCommandResponse.clear();
  const DeserializationError error = deserializeJson(motorCommandResponse, http.getString());
  http.end();
  if (error) {
    Serial.printf("JSON invalido na fila do motor: %s\n", error.c_str());
    return;
  }

  JsonArray commands = motorCommandResponse["commands"].as<JsonArray>();

  if (!motorQueueInitialized) {
    uint32_t highestExistingCommandId = 0;
    uint8_t discardedCommands = 0;

    for (JsonObject command : commands) {
      const uint32_t commandId = command["id"] | 0;
      const char* actuator = command["actuator"] | "";
      const char* action = command["action"] | "";
      if (commandId == 0 || strcmp(actuator, "motor") != 0 || strcmp(action, "rotate") != 0) {
        continue;
      }

      if (commandId > highestExistingCommandId) highestExistingCommandId = commandId;
      if (acknowledgeMotorCommand(commandId)) discardedCommands++;
    }

    lastProcessedMotorCommandId = highestExistingCommandId;
    motorQueueInitialized = true;
    Serial.printf("Fila inicial pronta; %u comandos antigos descartados. Clique em Ativar Rolagem para testar.\n",
                  discardedCommands);
    return;
  }

  for (JsonObject command : commands) {
    const uint32_t commandId = command["id"] | 0;
    const char* actuator = command["actuator"] | "";
    const char* action = command["action"] | "";
    if (commandId == 0 || strcmp(actuator, "motor") != 0 || strcmp(action, "rotate") != 0) {
      continue;
    }

    if (commandId <= lastProcessedMotorCommandId) {
      acknowledgeMotorCommand(commandId);
      continue;
    }

    // Se o backend não definir o tempo, usa o padrão seguro de 1500 ms (1.5s)
    uint32_t durationMs = command["durationMs"] | DEFAULT_MOTOR_DURATION_MS;
    durationMs = constrain(durationMs, 500U, 4000U);

    lastProcessedMotorCommandId = commandId;
    currentMotorCommandId = commandId;
    motorStopAt = millis() + durationMs;
    motorRunning = true;
    
    // Aciona a Ponte H no sentido atual
    startMotor(rotateClockwise);
    
    Serial.printf("Motor Ponte H ligado por %lu ms no sentido: %s; comando %lu\n",
                  static_cast<unsigned long>(durationMs),
                  rotateClockwise ? "Frente" : "Trás",
                  static_cast<unsigned long>(commandId));
    break;
  }
}

String currentDeviceId() {
  String mac = WiFi.macAddress();
  mac.replace(":", "");
  mac.toUpperCase();
  return "ESP32-" + mac;
}

void syncThermalSafetyEvent(unsigned long now) {
  if (!thermalSafetyNeedsSync || WiFi.status() != WL_CONNECTED ||
      now - lastThermalSafetySync < THERMAL_EVENT_RETRY_INTERVAL_MS) return;
  lastThermalSafetySync = now;

  HTTPClient http;
  if (!beginRequest(http, "/devices/thermal-alert")) return;
  StaticJsonDocument<192> request;
  request["deviceId"] = currentDeviceId();
  request["temperature"] = thermalEventTemperature;
  request["state"] = thermalStateToSync;
  String body;
  serializeJson(request, body);

  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-token", DEVICE_API_TOKEN);
  const int status = http.POST(body);
  logHttpFailure("Envio do alerta termico", http, status);
  http.end();
  if (status >= 200 && status < 300) thermalSafetyNeedsSync = false;
}
void sendDeviceHeartbeat() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  if (!beginRequest(http, "/devices/heartbeat")) return;

  StaticJsonDocument<96> request;
  request["deviceId"] = currentDeviceId();
  String body;
  serializeJson(request, body);

  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-token", DEVICE_API_TOKEN);
  const int status = http.POST(body);
  logHttpFailure("Heartbeat do ESP32", http, status);
  Serial.printf("Heartbeat %s: HTTP %d\n", currentDeviceId().c_str(), status);
  http.end();
}
void postSensorReadings() {
  if (WiFi.status() != WL_CONNECTED) return;

  float temperature = NAN;
  float humidity = NAN;
  if (dhtMutex && xSemaphoreTake(dhtMutex, pdMS_TO_TICKS(250)) == pdTRUE) {
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
    xSemaphoreGive(dhtMutex);
  }
  const int soilRaw = analogRead(SOIL_SENSOR_PIN);
  const float soilHumidity = readSoilHumidityPercent(soilRaw);

  StaticJsonDocument<160> readings;
  if (isfinite(temperature) && temperature > 0) readings["temperature"] = temperature;
  if (isfinite(humidity) && humidity > 0) readings["humidity"] = humidity;
  if (isfinite(soilHumidity)) readings["soilHumidity"] = soilHumidity;

  if (readings.size() == 0) {
    Serial.println("Nenhuma leitura valida para enviar.");
    return;
  }

  String body;
  serializeJson(readings, body);

  HTTPClient http;
  if (!beginRequest(http, "/sensors/data")) return;

  http.addHeader("Content-Type", "application/json");
  const int status = http.POST(body);
  logHttpFailure("Envio das leituras", http, status);

  Serial.printf("Leitura ADC solo: %d, umidade calculada: %.1f%%, HTTP: %d\n",
                soilRaw, soilHumidity, status);
  http.end();
}

void setup() {
  Serial.begin(115200);

  // Configuração do Relé da Lâmpada
  pinMode(LAMP_RELAY_PIN, OUTPUT);
  digitalWrite(LAMP_RELAY_PIN, relayOffLevel());

  // Configuração da Ponte H (L9110S)
  pinMode(MOTOR_IN1_PIN, OUTPUT);
  pinMode(MOTOR_IN2_PIN, OUTPUT);
  stopMotor();

  analogReadResolution(12);
  dht.begin();
  dhtMutex = xSemaphoreCreateMutex();
  if (dhtMutex) {
    const BaseType_t taskCreated = xTaskCreatePinnedToCore(thermalSafetyTask, "ThermalSafety", 4096, nullptr, 2, nullptr, 1);
    if (taskCreated != pdPASS) dhtMutex = nullptr;
  }
  if (!dhtMutex) {
    thermalProtectionActive = true;
    applyLamp(false);
    Serial.println("Falha ao iniciar protecao termica do DHT; lampada bloqueada por seguranca.");
  }
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  wifiStarted = true;

  Serial.println("Conectando ao Wi-Fi...");
  Serial.println("EcoIncubadora ESP32 iniciada.");
}

void loop() {
  const unsigned long now = millis();

  serviceMotorTimer();
  consumeThermalTransition();
  serviceAutomaticRoll(now);

  const bool wifiConnected = WiFi.status() == WL_CONNECTED;
  if (wifiConnected && !wifiWasConnected) {
    Serial.printf("Wi-Fi conectado. IP do ESP32: %s\n", WiFi.localIP().toString().c_str());
  } else if (!wifiConnected && wifiWasConnected) {
    Serial.println("Wi-Fi desconectado.");
  }
  wifiWasConnected = wifiConnected;

  if (!wifiConnected) {
    if (now - lastWifiDiagnostic >= 5000) {
      lastWifiDiagnostic = now;
      Serial.printf("Wi-Fi ainda desconectado: status=%d, SSID=%s\n",
                    static_cast<int>(WiFi.status()), WIFI_SSID);
    }
    return;
  }

  if (!ensureSystemTime(now)) return;

  syncThermalSafetyEvent(now);

  if (lastDeviceHeartbeat == 0 || now - lastDeviceHeartbeat >= DEVICE_HEARTBEAT_INTERVAL_MS) {
    lastDeviceHeartbeat = now;
    sendDeviceHeartbeat();
  }

  if (now - lastMotorModePoll >= MOTOR_MODE_POLL_INTERVAL_MS) {
    lastMotorModePoll = now;
    pollMotorMode(now);
  }

  if (!motorRunning) {
    syncLocalLampCommand(now);
  }

  if (!motorRunning && now - lastMotorCommandPoll >= MOTOR_COMMAND_POLL_INTERVAL_MS) {
    lastMotorCommandPoll = now;
    pollMotorCommands();
  }

  if (!motorRunning && now - lastSensorPost >= SENSOR_INTERVAL_MS) {
    lastSensorPost = now;
    postSensorReadings();
  }

  if (!motorRunning && !lampNeedsSync && now - lastLampPoll >= LAMP_POLL_INTERVAL_MS) {
    lastLampPoll = now;
    pollLampState();
  }
}

}