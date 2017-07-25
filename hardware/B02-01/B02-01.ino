#include <UnoWiFiDevEd.h>

//BMP085
#include <Wire.h>
#include <Adafruit_BMP085.h>

//Soil Moisture
#define soilPIN A2
#define minSoilValue 212
#define maxSoilValue 1023
//Water flow
#define flowPIN 2
#define flowInterrupt 0
//Connect server
#define CONNECTOR     "rest"
#define SERVER_ADDR   "158.108.165.223"

//BMP085
unsigned long pressure = 0;
Adafruit_BMP085 bmp;
//soil
int soilValue, soil;
//Water flow
float calibrationFactor = 4.5;
volatile byte pulseCount;
float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;

unsigned long oldTime;
//connect server
String sendData = "";


void flow() {
  pulseCount++;
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  
  pinMode(flowPIN, INPUT);

  pulseCount        = 0;
  flowRate          = 0.0;
  flowMilliLitres   = 0;
  totalMilliLitres  = 0;
  oldTime           = 0;
  attachInterrupt(flowInterrupt, flow, FALLING);

  /*if (!bmp.begin()) {
  Serial.println("Could not find a valid BMP085 sensor, check wiring!");
  while (1) {}
  }*/
  bmp.begin();
  Ciao.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  //BMP085
  pressure = bmp.readPressure();
  sendData = "/data/fukseed/air/set/" + String(pressure);
  Ciao.write(CONNECTOR, SERVER_ADDR, sendData);
  //Serial.print("Pressure: ");
  //Serial.println(pressure);

  //Soil
  soilValue = analogRead(soilPIN);
  soilValue = constrain(soilValue, minSoilValue, maxSoilValue);
  soil = map(soilValue, minSoilValue, maxSoilValue, 100, 0);
  sendData = "/data/fukseed/soilmosture/set/" + String(soil);
  Ciao.write(CONNECTOR, SERVER_ADDR, sendData);
  //Serial.println(soilValue);
  //Serial.print(soil);
  //Serial.println("%");

  //Water flow
  if ((millis() - 100) > 1000) {
    detachInterrupt(flowInterrupt);
    flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / calibrationFactor;
    oldTime = millis();
    flowMilliLitres = (flowRate / 60) * 1000;
    //Serial.print("Flow rate: ");
    //Serial.print((int)flowRate);
    //Serial.println(" L/min");
    //Serial.println(pulseCount);

    pulseCount = 0;
    attachInterrupt(flowInterrupt, flow, FALLING);
    sendData = "/data/fukseed/waterflow/set/" + String(flowRate);
    Ciao.write(CONNECTOR, SERVER_ADDR, sendData);
  }
}
