#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <SimpleDHT.h>

int pinLED = 25;

// DHT22
int pinDHT22 = 17;
SimpleDHT22 dht22(pinDHT22);

// OLED
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(128, 32, new MbedI2C(14, 15), OLED_RESET);

void drawGradeSymbol() {
  uint16_t gap = 4;
  uint16_t radius = 3;
  uint16_t x = display.getCursorX() + gap;
  uint16_t y = display.getCursorY();

  display.drawCircle(x, y + radius, radius, SSD1306_WHITE);
  display.drawCircle(x, y + radius, radius - 1, SSD1306_WHITE);

  display.setCursor(x + 3 + gap, y);
}

void printTempAndHumidity(float temperature, float humidity) {
  display.clearDisplay();

  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);

  display.print(F("H: "));
  display.print(humidity);
  display.println(F("%"));

  display.print(F("T: "));
  display.print(temperature);
  drawGradeSymbol();
  display.println(F("C"));

  display.display();
  delay(2000);
}

void setup() {
  Serial.begin(9600);
  pinMode(pinLED, OUTPUT);
  digitalWrite(pinLED, HIGH);

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;) {
      digitalWrite(pinLED, LOW);
      delay(500);
      digitalWrite(pinLED, HIGH);
      delay(500);
    } // Don't proceed, loop forever
  }
  display.dim(true);

  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 8);
  display.println("Reading...");
  display.display();
}

void loop() {
  // read without samples.
  // @remark We use read2 to get a float data, such as 10.1*C
  //    if user doesn't care about the accurate data, use read to get a byte data, such as 10*C.
  float temperature = 0;
  float humidity = 0;
  int err = dht22.read2(&temperature, &humidity, NULL);
  if (err != SimpleDHTErrSuccess) {
    Serial.print("E");
    Serial.print(SimpleDHTErrCode(err));
    Serial.print(" D");
    Serial.println(SimpleDHTErrDuration(err));
    delay(2000);
    return;
  }

  Serial.print("T");
  Serial.print(temperature);
  Serial.print(" H");
  Serial.println(humidity);

  digitalWrite(LED_BUILTIN, humidity > 60);
  printTempAndHumidity(temperature, humidity);

  // DHT22 sampling rate is 0.5HZ.
  for (int i = 0; i < 2; i++)
    delay(30 /*sec*/ * 1000 /* mills */);
}
