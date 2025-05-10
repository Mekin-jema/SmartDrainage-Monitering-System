#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// MQTT broker configuration
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const int connection_timeout = 10000;

// Topics
const char* publish_topic = "manhole/sensor_readings";
const char* subscribe_topic = "manhole/commands";

// Sensor pins
#define echoPin 12    // For sewage level
#define trigPin 13
#define METHANE_PIN 34
#define FLOW_SENSOR_PIN 35
#define BATTERY_PIN 36

// Thresholds
const float MAX_DISTANCE = 100.0;  // cm
const float MAX_GAS = 500.0;       // ppm
const float MIN_FLOW = 5.0;        // cm/s

WiFiClient espClient;
PubSubClient mqttClient(espClient);
unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 5000;
const unsigned long sensorUpdateInterval = 5000;
unsigned long lastSensorUpdate = 0;
String manholeId = "65d3a1b1a8b9c4e7f0a1b2c3"; // Replace with your actual ID

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

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");
  
  String messageTemp;
  for (int i = 0; i < length; i++) {
    messageTemp += (char)message[i];
  }
  Serial.println(messageTemp);

  // Process commands here if needed
}

bool connectToMQTT() {
  Serial.print("Attempting MQTT connection to ");
  Serial.print(mqtt_server);
  Serial.println("...");

  String clientId = "ManholeSensor-";
  clientId += String(random(0xffff), HEX);

  if (mqttClient.connect(clientId.c_str())) {
    Serial.println("Connected to MQTT broker!");
    if (mqttClient.subscribe(subscribe_topic)) {
      Serial.print("Subscribed to ");
      Serial.println(subscribe_topic);
    } else {
      Serial.println("Subscribe failed!");
    }
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

float readHumidity() {
  // Simulating humidity - replace with actual sensor reading
  return 50.0 + random(-20, 20); // 30-70% range
}

float readBatteryLevel() {
  int sensorValue = analogRead(BATTERY_PIN);
  return map(sensorValue, 0, 4095, 0, 100); // Percentage
}

String determineStatus(float sewageLevel, float methaneLevel, float flowRate) {
  if (sewageLevel < 0 || sewageLevel > MAX_DISTANCE || 
      methaneLevel > MAX_GAS || flowRate < MIN_FLOW) {
    return "critical";
  } else if (sewageLevel > MAX_DISTANCE * 0.8 || 
             methaneLevel > MAX_GAS * 0.7 || 
             flowRate < MIN_FLOW * 1.5) {
    return "warning";
  }
  return "normal";
}

String getAlertTypes(float sewageLevel, float methaneLevel, float flowRate) {
  String alerts = "[";
  bool firstAlert = true;

  if (sewageLevel < 0) {
    alerts += "\"sensor_error\"";
    firstAlert = false;
  } else if (sewageLevel > MAX_DISTANCE) {
    if (!firstAlert) alerts += ",";
    alerts += "\"high_sewage_level\"";
    firstAlert = false;
  }

  if (methaneLevel > MAX_GAS) {
    if (!firstAlert) alerts += ",";
    alerts += "\"high_methane\"";
    firstAlert = false;
  }

  if (flowRate < MIN_FLOW) {
    if (!firstAlert) alerts += ",";
    alerts += "\"low_flow\"";
  }

  alerts += "]";
  return alerts;
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
  float humidity = readHumidity();
  float batteryLevel = readBatteryLevel();
  String status = determineStatus(sewageLevel, methaneLevel, flowRate);
  String alertTypes = getAlertTypes(sewageLevel, methaneLevel, flowRate);

  // Create JSON payload
  String payload = "{";
  payload += "\"manholeId\":\"" + manholeId + "\",";
  payload += "\"sensors\":{";
  payload += "\"sewageLevel\":" + String(sewageLevel) + ",";
  payload += "\"methaneLevel\":" + String(methaneLevel) + ",";
  payload += "\"flowRate\":" + String(flowRate) + ",";
  payload += "\"temperature\":" + String(temperature) + ",";
  payload += "\"humidity\":" + String(humidity) + ",";
  payload += "\"batteryLevel\":" + String(batteryLevel);
  payload += "},";
  payload += "\"thresholds\":{";
  payload += "\"maxDistance\":" + String(MAX_DISTANCE) + ",";
  payload += "\"maxGas\":" + String(MAX_GAS) + ",";
  payload += "\"minFlow\":" + String(MIN_FLOW);
  payload += "},";
  payload += "\"status\":\"" + status + "\",";
  payload += "\"alertTypes\":" + alertTypes;
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
  pinMode(BATTERY_PIN, INPUT);
  
  setup_wifi();
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(callback);
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