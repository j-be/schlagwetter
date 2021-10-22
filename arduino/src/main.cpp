#include <SimpleDHT.h>

// for DHT22,
//      VCC: 5V or 3V
//      GND: GND
//      DATA: 2

int pinDHT22 = 2;
SimpleDHT22 dht22(pinDHT22);

void setup() {
  Serial.begin(9600);
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
  Serial.print((float)temperature);
  Serial.print(" H");
  Serial.println((float)humidity);

  // DHT22 sampling rate is 0.5HZ.
  for (int i = 0; i < 10; i++)
    delay(30 /*sec*/ * 1000 /* mills */);
}
