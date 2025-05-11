#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "Abdu";
const char* password = "12345678";

// MQTT broker configuration
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const int connection_timeout = 10000;

// Topics
const char* publish_topic = "drainage/sensor-data";

// Sensor pins
#define echoPin 34    // For sewage level
#define trigPin 32
#define METHANE_PIN 12
#define FLOW_SENSOR_PIN 35

WiFiClient espClient;
PubSubClient mqttClient(espClient);
unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 5000;
const unsigned long sensorUpdateInterval = 5000;
unsigned long lastSensorUpdate = 0;
const String manholeId = "manhole-1";  // Added missing manholeId

void setup_wifi() {
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED && 
         millis() - startAttemptTime < connection_timeout) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nFailed to connect to WiFi!");
    ESP.restart();
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

bool connectToMQTT() {
  Serial.print("Attempting MQTT connection to ");
  Serial.print(mqtt_server);
  Serial.println("...");

  String clientId = "ManholeSensor-";
  clientId += String(random(0xffff), HEX);

  if (mqttClient.connect(clientId.c_str())) {
    Serial.println("Connected to MQTT broker!");
    return true;
  } else {
    Serial.print("Failed to connect, rc=");
    Serial.print(mqttClient.state());
    Serial.println();
    return false;
  }
}

float readSewageLevel() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  int duration = pulseIn(echoPin, HIGH, 30000);
  if (duration == 0) return -1;
  return duration / 58.0; // Convert to cm
}

float readMethaneLevel() {
  int sensorValue = analogRead(METHANE_PIN);
  return map(sensorValue, 0, 4095, 0, 1000); // Map to 0-1000 ppm range
}

float readFlowRate() {
  // Simulating flow rate - replace with actual sensor reading
  return random(0, 20); // cm/s
}

float readTemperature() {
  // Simulating temperature - replace with actual sensor reading
  return 25.0 + random(-5, 5)/10.0; // 20-30°C range
}

void sendSensorData() {
  if (!mqttClient.connected()) {
    Serial.println("MQTT not connected, can't send data");
    return;
  }

  // Read sensor values
  float sewageLevel = readSewageLevel();
  float methaneLevel = readMethaneLevel();
  float flowRate = readFlowRate();
  float temperature = readTemperature();

  // Create JSON payload
  String payload = "{";
  payload += "\"manholeId\":\"" + manholeId + "\",";
  payload += "\"sensors\":{";
  payload += "\"sewageLevel\":" + String(sewageLevel) + ",";
  payload += "\"methaneLevel\":" + String(methaneLevel) + ",";
  payload += "\"flowRate\":" + String(flowRate) + ",";
  payload += "\"temperature\":" + String(temperature);
  payload += "}";
  payload += "}";

  if (mqttClient.publish(publish_topic, payload.c_str())) {
    Serial.println("Published: " + payload);
  } else {
    Serial.println("Publish failed");
  }
}

void setup() {
  Serial.begin(115200);
  randomSeed(analogRead(0));

  // Initialize sensor pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(METHANE_PIN, INPUT);
  pinMode(FLOW_SENSOR_PIN, INPUT);
  
  setup_wifi();
  mqttClient.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!mqttClient.connected()) {
    unsigned long now = millis();
    if (now - lastReconnectAttempt > reconnectInterval) {
      lastReconnectAttempt = now;
      if (connectToMQTT()) {
        lastReconnectAttempt = 0;
      }
    }
  } else {
    // Regular sensor updates
    if (millis() - lastSensorUpdate >= sensorUpdateInterval) {
      lastSensorUpdate = millis();
      sendSensorData();
    }
  }

  mqttClient.loop();
  
  // Maintain WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, reconnecting...");
    setup_wifi();
  }
}