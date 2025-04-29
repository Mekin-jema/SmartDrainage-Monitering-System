#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
const char* mqttServer = "broker.hivemq.com";
const int mqttPort = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  client.setServer(mqttServer, mqttPort);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float waterLevel = readWaterSensor();
  float methaneLevel = readMethaneSensor();
  
  String payload = "{\"deviceId\":\"ESP32_01\",";
  payload += "\"waterLevel\":" + String(waterLevel) + ",";
  payload += "\"methaneLevel\":" + String(methaneLevel) + "}";
  
  client.publish("drainage/sensor-data", payload.c_str());
  delay(5000); // Send every 5 seconds
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32Client")) {
      Serial.println("MQTT Connected");
    } else {
      delay(5000);
    }
  }
}