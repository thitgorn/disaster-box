//Connect server
#include <Wire.h>
#include <UnoWiFiDevEd.h>
//dht
#include <dht.h>

//Connect server
#define CONNECTOR     "rest"
#define SERVER_ADDR   "158.108.165.223"
//dht
#define DHT11 2
//Smoke
#define smokePIN A0
//buzzer
#define buzzerPIN 3
//LED
#define LED1 13
#define LED2 12
#define LED3 11
#define LED4 10

//Connect server
String sendData = "";
String recieveData = "";
String cmd;
CiaoData data;
//dht
dht DHT;
float temperature;
//smoke
int smokeValue;

void setup()
{
  //Serial.begin(9600);
  Ciao.begin();

  pinMode(buzzerPIN, OUTPUT);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);
}
void loop ()
{
  //dht
  DHT.read11(DHT11);
  temperature = DHT.temperature;
  //Serial.print("Temperature: ");
  //Serial.println(temperature);
  sendData = String( "/data/fukseed/temperature/set/" ) + temperature;
  Ciao.write(CONNECTOR, SERVER_ADDR, sendData);

  //smoke
  smokeValue = analogRead(smokePIN);
  //Serial.print("Smoke: ");
  //Serial.println(smokeValue);
  sendData = String( "/data/fukseed/smoke/set/" ) + smokeValue;
  Ciao.write(CONNECTOR, SERVER_ADDR, sendData);

  /*recieveData = String( "/data/fukseed/sound" );
  data = Ciao.read(CONNECTOR, SERVER_ADDR, recieveData);
  if ( !data.isEmpty() ) {
    cmd = String(data.get(2));
    if ( cmd == "on" ) {
      Serial.println("Turn On Sound!");
      analogWrite(buzzerPIN, 10);
    } else if ( cmd == "off" ) {
      Serial.println("Turn Off Sound!");
      analogWrite(buzzerPIN, 0);
    }
  }*/
  //delay(1000);
  recieveData = String( "/data/fukseed/light" );
  data = Ciao.read(CONNECTOR, SERVER_ADDR, recieveData);
  if ( !data.isEmpty() ) {
    cmd = String(data.get(2));
    if ( cmd == "on" ) {
      Serial.println("Turn On Light!");
      digitalWrite(LED1, HIGH);
      digitalWrite(LED2, HIGH);
      digitalWrite(LED3, HIGH);
      digitalWrite(LED4, HIGH);
      analogWrite(buzzerPIN, 200);
    } else if ( cmd == "off" ) {
      Serial.println("Turn Off Light!");
      digitalWrite(LED1, LOW);
      digitalWrite(LED2, LOW);
      digitalWrite(LED3, LOW);
      digitalWrite(LED4, LOW);
      analogWrite(buzzerPIN, 0);
    }
  }
}
