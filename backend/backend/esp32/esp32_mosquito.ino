#include <WiFi.h>
#include <PubSubClient.h>

// WiFi Settings - UPDATE THESE
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Settings - UPDATE TO YOUR PC's IP
const char* mqtt_server = "192.168.1.100"; // Your PC running Mosquitto
const int mqtt_port = 1883;
const char* topic = "drainage/sensor-data";

// Sensor pins - adjust based on your wiring
const int waterSensorPin = 34;
const int methaneSensorPin = 35;

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsgTime = 0;
const long interval = 5000; // 5 seconds between messages

void setupWiFi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    if (client.connect("ESP32DrainageClient")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setupWiFi();
  client.setServer(mqtt_server, mqtt_port);
  
  // Initialize sensor pins
  pinMode(waterSensorPin, INPUT);
  pinMode(methaneSensorPin, INPUT);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsgTime > interval) {
    lastMsgTime = now;
    
    // Read sensor values - adjust calculations based on your sensors
    float waterLevel = analogRead(waterSensorPin) * (3.3 / 4095.0); // Convert to voltage if needed
    float methaneLevel = analogRead(methaneSensorPin) * (3.3 / 4095.0);
    
    // Create JSON payload
    String payload = "{\"water\":" + String(waterLevel, 2) 
                   + ",\"methane\":" + String(methaneLevel, 2) + "}";
    
    // Publish message
    if (client.publish(topic, payload.c_str())) {
      Serial.println("Message published:");
      Serial.println(payload);
    } else {
      Serial.println("Message failed to publish");
    }
  }
}