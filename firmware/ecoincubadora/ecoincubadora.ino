#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <Preferences.h>
#include <math.h>

const char* WIFI_SSID = "Isadireito 2.4Ghz";
const char* WIFI_PASSWORD = "pedrocas88";

// Use o IP do computador na rede local durante os testes.
const char* API_BASE_URL = "http://192.168.18.238:3001/api/v1";

constexpr uint8_t DHT_PIN = 26;
constexpr uint8_t SOIL_SENSOR_PIN = 35;
constexpr uint8_t LAMP_RELAY_PIN = 14;
constexpr uint8_t MOTOR_RELAY_PIN = 23;
constexpr uint8_t BUTTON_PIN = 32;
constexpr uint8_t DHT_TYPE = DHT11;

// Calibre lendo o ADC com o sensor seco e depois na umidade de referencia.
// GPIO35 retorna normalmente valores entre 0 e 4095.
constexpr int SOIL_DRY_RAW = 3200;
constexpr int SOIL_WET_RAW = 1400;

constexpr bool RELAY_ACTIVE_LOW = true;
constexpr bool MOTOR_RELAY_ACTIVE_LOW = true;
constexpr unsigned long SENSOR_INTERVAL_MS = 5000;
constexpr unsigned long LAMP_POLL_INTERVAL_MS = 2000;
constexpr unsigned long MOTOR_COMMAND_POLL_INTERVAL_MS = 1000;
constexpr unsigned long BUTTON_DEBOUNCE_MS = 50;

DHT dht(DHT_PIN, DHT_TYPE);
Preferences preferences;

unsigned long lastSensorPost = 0;
unsigned long lastLampPoll = 0;
unsigned long lastLampSync = 0;
unsigned long lastWifiDiagnostic = 0;
unsigned long lastMotorCommandPoll = 0;
unsigned long lastButtonChange = 0;

bool wifiStarted = false;
bool wifiWasConnected = false;
bool lampIsOn = false;
bool lampNeedsSync = false;
bool motorRunning = false;
uint32_t motorStopAt = 0;
uint32_t currentMotorCommandId = 0;
uint32_t lastProcessedMotorCommandId = 0;
int lastButtonReading = HIGH;
int stableButtonState = HIGH;

int relayOnLevel() {
  return RELAY_ACTIVE_LOW ? LOW : HIGH;
}

int relayOffLevel() {
  return RELAY_ACTIVE_LOW ? HIGH : LOW;
}

int motorRelayOnLevel() {
  return MOTOR_RELAY_ACTIVE_LOW ? LOW : HIGH;
}

int motorRelayOffLevel() {
  return MOTOR_RELAY_ACTIVE_LOW ? HIGH : LOW;
}

String apiUrl(const String& path) {
  return String(API_BASE_URL) + path;
}

bool beginRequest(HTTPClient& http, const String& path) {
  http.setTimeout(2500);
  return http.begin(apiUrl(path));
}

void applyLamp(bool on) {
  lampIsOn = on;
  digitalWrite(LAMP_RELAY_PIN, on ? relayOnLevel() : relayOffLevel());
}

float readSoilHumidityPercent(int rawValue) {
  if (SOIL_DRY_RAW == SOIL_WET_RAW) return NAN;

  const float percentage =
    (static_cast<float>(SOIL_DRY_RAW - rawValue) * 100.0f) /
    static_cast<float>(SOIL_DRY_RAW - SOIL_WET_RAW);

  return constrain(percentage, 0.0f, 100.0f);
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
  http.end();

  Serial.printf("Comando local da lampada: HTTP %d\n", status);
  return status >= 200 && status < 300;
}

void syncLocalLampCommand(unsigned long now) {
  if (!lampNeedsSync || now - lastLampSync < 1000) return;
  lastLampSync = now;
  lampNeedsSync = !sendLampCommand(lampIsOn);
}

void handlePhysicalButton(unsigned long now) {
  const int reading = digitalRead(BUTTON_PIN);

  if (reading != lastButtonReading) {
    lastButtonChange = now;
    lastButtonReading = reading;
  }

  if (now - lastButtonChange < BUTTON_DEBOUNCE_MS ||
      reading == stableButtonState) {
    return;
  }

  stableButtonState = reading;
  if (stableButtonState == LOW) {
    applyLamp(!lampIsOn);
    lampNeedsSync = true;
    lastLampSync = 0;
    Serial.printf("Botao fisico: lampada %s\n", lampIsOn ? "ligada" : "desligada");
  }
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
      applyLamp(requestedLampState);
      Serial.printf("Estado recebido da API: lamp=%s; GPIO14=%s (%d)\n",
                    state,
                    requestedLampState ? "ligado" : "desligado",
                    requestedLampState ? relayOnLevel() : relayOffLevel());
    } else {
      Serial.printf("JSON invalido ao consultar lampada: %s\n", error.c_str());
    }
  } else {
    Serial.printf("Consulta do estado da lampada: HTTP %d\n", status);
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
  http.end();
  Serial.printf("Confirmacao do comando do motor %lu: HTTP %d\n",
                static_cast<unsigned long>(commandId), status);
  return status >= 200 && status < 300;
}

void finishMotorRotation() {
  digitalWrite(MOTOR_RELAY_PIN, motorRelayOffLevel());
  motorRunning = false;
  Serial.printf("Motor desligado; comando %lu concluido.\n",
                static_cast<unsigned long>(currentMotorCommandId));

  if (currentMotorCommandId != 0 && acknowledgeMotorCommand(currentMotorCommandId)) {
    currentMotorCommandId = 0;
  }
}

void serviceMotorTimer() {
  if (motorRunning && static_cast<int32_t>(millis() - motorStopAt) >= 0) {
    finishMotorRotation();
  }
}

void pollMotorCommands() {
  if (WiFi.status() != WL_CONNECTED || motorRunning) return;

  HTTPClient http;
  if (!beginRequest(http, "/actuators/commands/pending")) return;

  const int status = http.GET();
  if (status != HTTP_CODE_OK) {
    Serial.printf("Consulta dos comandos do motor: HTTP %d\n", status);
    http.end();
    return;
  }

  StaticJsonDocument<4096> response;
  const DeserializationError error = deserializeJson(response, http.getString());
  http.end();
  if (error) {
    Serial.printf("JSON invalido na fila do motor: %s\n", error.c_str());
    return;
  }

  JsonArray commands = response["commands"].as<JsonArray>();
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

    uint32_t durationMs = command["durationMs"] | 3000;
    durationMs = constrain(durationMs, 100U, 10000U);

    // Persistir antes de energizar evita repetir uma rolagem após reinicialização.
    lastProcessedMotorCommandId = commandId;
    preferences.putUInt("lastMotorCmd", lastProcessedMotorCommandId);
    currentMotorCommandId = commandId;
    motorStopAt = millis() + durationMs;
    motorRunning = true;
    digitalWrite(MOTOR_RELAY_PIN, motorRelayOnLevel());
    Serial.printf("Motor ligado por %lu ms; comando %lu; GPIO23=%d\n",
                  static_cast<unsigned long>(durationMs),
                  static_cast<unsigned long>(commandId),
                  motorRelayOnLevel());
    break;
  }
}

void postSensorReadings() {
  if (WiFi.status() != WL_CONNECTED) return;

  const float temperature = dht.readTemperature();
  const float humidity = dht.readHumidity();
  const int soilRaw = analogRead(SOIL_SENSOR_PIN);
  const float soilHumidity = readSoilHumidityPercent(soilRaw);

  StaticJsonDocument<160> readings;
  if (isfinite(temperature)) readings["temperature"] = temperature;
  if (isfinite(humidity)) readings["humidity"] = humidity;
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

  Serial.printf("Leitura ADC solo: %d, umidade calculada: %.1f%%, HTTP: %d\n",
                soilRaw, soilHumidity, status);
  http.end();
}

void setup() {
  Serial.begin(115200);

  pinMode(LAMP_RELAY_PIN, OUTPUT);
  digitalWrite(LAMP_RELAY_PIN, relayOffLevel());
  pinMode(MOTOR_RELAY_PIN, OUTPUT);
  digitalWrite(MOTOR_RELAY_PIN, motorRelayOffLevel());

  // Ligue o botao entre GPIO32 e GND.
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  analogReadResolution(12);
  dht.begin();
  preferences.begin("ecoincubadora", false);
  lastProcessedMotorCommandId = preferences.getUInt("lastMotorCmd", 0);

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  wifiStarted = true;

  Serial.println("Conectando ao Wi-Fi...");
  Serial.println("EcoIncubadora ESP32 iniciada.");
}

void loop() {
  const unsigned long now = millis();

  handlePhysicalButton(now);
  serviceMotorTimer();

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