//***************** Setup *************//
#include <Arduino.h> // required before wiring_private.h
#include <avr/dtostrf.h>

char module_id[33];
char module_id_part[8];
//***************** GPS *************//
#include <Adafruit_GPS.h> // use Adafruit GPS module
#include <TinyGPS.h>
#define GPSSerial Serial1
Adafruit_GPS GPS(&GPSSerial);
TinyGPS TGPS;
bool gps_fix = 0;
int gps_satellites = 0;
float gps_lat = 0.f;
float gps_lng = 0.f;
float gps_alt = 0.f;
float gps_speed = 0.f;
float gps_angle = 0.f;

float lat_start, lat_end, lng_start, lng_end, distance, knot;
int time_start, time_end, course;
String file_name, session_id, file_data, direction, clock_start, clock_end;

//*********** Time ************* //
#include <TimeLib.h>

//************** Wifi *************** //
#define WIFI_PIN 13
#include <ArduinoHttpClient.h>
#include <WiFi101.h>
///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = "aplboi";   // your network SSID (name)
char pass[] = "97006589"; // your network password (use for WPA, or use as key for WEP)

int wifi_status = WL_IDLE_STATUS;
bool wifi_on;
#define FILENAME_LENGTH 13

// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
//IPAddress server(74,125,232,128);  // numeric IP for Google (no DNS)
char server[] = "omni2-stg.herokuapp.com"; // name address for Google (using DNS)

// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
WiFiClient wifi;
HttpClient client = HttpClient(wifi, server);

//**************** LED *********** //
#include <Adafruit_NeoPixel.h>
#define LED_CONTROL A3
#define NUMPIXELS 8
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, LED_CONTROL);

//***************** Display *************//
#include "Adafruit_EPD.h"
#define EPD_BUSY 10 // can set to -1 to not use a pin (will wait a fixed delay)
#define EPD_RESET 9 // can set to -1 and share with microcontroller Reset!
#define SD_CS 6
#define SRAM_CS 5
#define EPD_DC 21
#define EPD_CS 20
const int DW {250}, DH {122};
Adafruit_SSD1675 display(DW, DH, EPD_DC, EPD_RESET, EPD_CS, SRAM_CS, EPD_BUSY);
#include <Fonts/FreeSans9pt7b.h>
#include <Fonts/FreeSans12pt7b.h>

//******************* SD *************//
#include <SPI.h>
#include <SdFat.h>
#include <CSVFile.h>
SdFat SD;
CSVFile CSV;
//const int8_t DISABLE_CHIP_SELECT = EPD_CS;
File session_file;
#define SPI_SPEED SD_SCK_MHZ(4)

//************* Session ********//
int session_status = -1; // -1=SETUP, 0=STANDBY, 1=START, 2=STOP
bool session_first{false};
#define SESSION_PIN A5
int elapsed_time {millis()}, previous_time {millis()};

//**************** Battery ***********//
#define VBATPIN A7
#define LOW_VOLTAGE 3.3
#define MID_VOLTAGE 3.4
#define HIGH_VOLTAGE 3.5
float voltage;

//***************** Setup *************//

void setup()
{
  serial_init();
  wifi_init();
  led_init();
  led_set(1, 255, 127, 0);
  get_battery_voltage();
  need_recharge();
  display_init();
  display_text("Preparing...");
  get_module_id(module_id);
  delay(2000);
  Serial.println("setup");
  delay(100);
  gps_init();
  sd_init();
  pinMode(SESSION_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(SESSION_PIN), update_session_status, FALLING);
  pinMode(WIFI_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(WIFI_PIN), wifi_start, FALLING);
  display_text("Waiting GPS...");
    while (!gps_ready()) {
      led_set(1, 0, 0, 0);
      delay(100);
      led_set(1, 255, 127, 0);
      delay(100);
      led_set(1, 0, 0, 0);
      delay(100);
      led_set(1, 255, 127, 0);
      delay(700);
    }
  display_text("Ready to Record");
  session_status = 0;
  led_set(1, 0, 0, 255);
}

void loop()
{
  get_battery_voltage();
  need_recharge();
  if (wifi_on)
  {
    send_data();
    wifi_on = false;
    Serial.println("wifi_on turned off");
  }
  if (session_status == 1)
  {
    led_set(3, 0, 0, 255);
    session_first = true;
    while (session_status == 1)
    {
      gps_get();
      if (session_first)
      {
        //in order not to use previous gps data, get gps once again
        gps_get();
        record_gps_start();
        file_init();
        session_first = false;
      }
      record_gps_end();
      file_write(file_name, data_str());
      delay(10000);
    }
    led_set(3, 0, 0, 0);
    delay(200);
  }
}

void serial_init()
{
  Serial.begin(115200);
  delay(1000);
  GPS.begin(9600);
}
void wifi_init()
{
  WiFi.setPins(8, 7, 4, 2);
  if (WiFi.status() == WL_NO_SHIELD)
  {
    Serial.println("WiFi shield not present");
    // don't continue:
    while (true)
      ;
  }
};

void get_module_id(char *module_id)
{
  char buf[33];
  volatile uint32_t val1, val2, val3, val4;
  volatile uint32_t *ptr1 = (volatile uint32_t *)0x0080A00C;
  val1 = *ptr1;
  volatile uint32_t *ptr = (volatile uint32_t *)0x0080A040;
  val2 = *ptr;
  ptr++;
  val3 = *ptr;
  ptr++;
  val4 = *ptr;
  sprintf(buf, "%8x%8x%8x%8x", val1, val2, val3, val4);
  Serial.print("Module ID is :");
  Serial.println(buf);
  for (int i = 0; i < 33; ++i)
  {
    if (i < 8)
      module_id_part[i] = buf[i];
    module_id[i] = buf[i];
  }
};

void gps_init()
{
  Serial.println("Start GPS initialization.");
  // uncomment this line to turn on RMC (recommended minimum) and GGA (fix data) including altitude
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
  // Set the update rate
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ); // 1 Hz update rate
  // Request updates on antenna status, comment out to keep quiet
  GPS.sendCommand(PGCMD_ANTENNA);
  // Ask for firmware version
  GPSSerial.println(PMTK_Q_RELEASE);
  Serial.println("Finish GPS initialization.");
}

bool gps_ready()
{
  Serial.println("Try gps fetching!");
  while (!GPS.newNMEAreceived())
    GPS.read();
  GPS.parse(GPS.lastNMEA());
  if (GPS.latitudeDegrees != 0 && GPS.year > 19 && GPS.fix)
    return true;
  return false;
}

void display_init()
{
  Serial.println("Start Display initialization.");
  display.begin();
  display.clearBuffer();
  display.setFont(&FreeSans12pt7b);
  display.setTextColor(EPD_BLACK);
  Serial.println("Finish Display initialization.");
}

void sd_init()
{
  //pinMode(DISABLE_CHIP_SELECT, OUTPUT);
  //digitalWrite(DISABLE_CHIP_SELECT, HIGH);
  //digitalWrite(SD_CS, LOW);
  // see if the card is present and can be initialized:
  if (!SD.begin(SD_CS, SPI_SPEED))
    Serial.println("Card failed, or not present");
  else
    Serial.println("card detected.");
}

void led_init()
{
  pixels.begin();
  pixels.clear();
  for (int h = 0; h < 2; h++) {
    for (int i = 1; i < 8; i+=2)
      led_set(i, 0, 0, 255);
    delay(200);
    for (int i = 1; i < 8; i+=2)
      led_set(i, 0, 0, 0);
    delay(200);
  }
  delay(200);
}

void led_set(int index, uint8_t r, uint8_t g, uint8_t b)
{
  pixels.setPixelColor(index, pixels.Color(r, g, b));
  pixels.show();
}

void gps_get()
{
  Serial.println("Start GPS getting.");
  // read data from the GPS in the 'main loop'
  while (true)
  {
    while (!GPS.newNMEAreceived())
      GPS.read();
    GPS.parse(GPS.lastNMEA());
    if ((GPS.latitudeDegrees != gps_lat || GPS.longitudeDegrees != gps_lng) && GPS.fix == 1)
    {
      setTime(GPS.hour, GPS.minute, GPS.seconds, GPS.day, GPS.month, GPS.year);
      adjustTime(9 * 3600); // increment 9 hours to change timezone from UTC to JST
      gps_fix = GPS.fix;
      gps_satellites = GPS.satellites;
      gps_lat = GPS.latitudeDegrees;
      gps_lng = GPS.longitudeDegrees;
      gps_alt = GPS.altitude;
      gps_speed = GPS.speed;
      gps_angle = GPS.angle;

      Serial.print("Date: ");
      Serial.print(year());
      Serial.print('.');
      Serial.print(month());
      Serial.print('.');
      Serial.println(day());

      Serial.print("Time: ");
      Serial.print(hour());
      Serial.print(':');
      Serial.print(minute());
      Serial.print(':');
      Serial.println(second());

      Serial.print("Satellites: ");
      Serial.println(gps_satellites);
      Serial.print("Latitude: ");
      Serial.println(gps_lat, 10);
      Serial.print("Longitude: ");
      Serial.println(gps_lng, 10);
      break;
    }
  }
};

void record_gps_start()
{
  time_start = millis();
  lat_start = gps_lat;
  lng_start = gps_lng;
  clock_start = (hour() <= 9 ? "0" : "") + String(hour()) + ":" + (minute() <= 9 ? "0" : "") + String(minute());
  session_first = false;
};

void record_gps_end()
{
  time_end = millis();
  lat_end = gps_lat;
  lng_end = gps_lng;
  clock_end = (hour() <= 9 ? "0" : "") + String(hour()) + ":" + (minute() <= 9 ? "0" : "") + String(minute());
};
float calc_knot()
{
  distance = TGPS.distance_between(lat_start, lng_start, lat_end, lng_end);
  return distance / (time_end - time_start) * 1000 * 1.94384;
};
int calc_course()
{
  return TGPS.course_to(lat_start, lng_start, lat_end, lng_end);
};

void file_init()
{
  //file_name = "05042059.csv";
  file_name = (month() <= 9 ? "0" : "") + String(month()) + (day() <= 9 ? "0" : "") + String(day()) + (hour() <= 9 ? "0" : "") + String(hour()) + (minute() <= 9 ? "0" : "") + String(minute()) + ".csv";
  session_id = String(second()) + String(minute()) + String(hour()) + String(day()) + String(month()) + String(year());
}

void file_write(String file_name, String file_data)
{
  sd_init();
  session_file = SD.open(file_name, FILE_WRITE);
  session_file.println(file_data);
  Serial.println("File:" + file_name);
  Serial.println("Add Sentence:" + file_data);
  session_file.close();
  Serial.println("The file closed");
}

String data_str()
{
  String sentence = String(module_id) + ",";
  sentence += session_id + ",";
  sentence += String(year()) + "-" + (month() <= 9 ? "0" : "") + String(month()) + "-" + (day() <= 9 ? "0" : "") + String(day()) + ",";
  sentence += (hour() <= 9 ? "0" : "") + String(hour()) + ":" + (minute() <= 9 ? "0" : "") + String(minute()) + ":" + (second() <= 9 ? "0" : "") + String(second()) + ",";
  char gps_lat_ca[16], gps_lng_ca[16];
  dtostrf(gps_lat, 0, 10, gps_lat_ca);
  dtostrf(gps_lng, 0, 10, gps_lng_ca);
  sentence += String(gps_lat_ca) + ",";
  sentence += String(gps_lng_ca) + ",";
  sentence += String(gps_alt) + ",";
  sentence += String(gps_satellites) + ",";
  sentence += String(gps_speed) + ",";
  sentence += String(gps_angle) + ",";
  sentence += String(gps_fix);
  return sentence;
}

void update_session_status()
{
  const int max_elapsed{2000}, record_elapsed{10000};
  elapsed_time = millis() - previous_time;

  if (elapsed_time < max_elapsed) //   ALL too soon cases are handled here
    return;
  else // ALL cases left (timeout) are handled here
  {
    Serial.println("Session Button is pushed");
    if (!(session_status >= 1 && elapsed_time <= record_elapsed))
      previous_time = millis();
    if (session_status >= 0)
    {
      if (session_status == 0)
      {
        session_status = 1;
        display_text("Recording");
      }
      else if (session_status == 1 && elapsed_time > record_elapsed)
      {
        session_status = 2;
        display_result();
      }
      else if (session_status == 2 && elapsed_time > record_elapsed)
      {
        session_status = 0;
        display_text("Ready to record");
      }
      Serial.print("Session has updated to: ");
      Serial.println(session_status);
    }
  }
}

void wifi_start()
{
  Serial.println("Wifi Button is pushed");
  wifi_on = true;
}
void send_data()
{
  led_set(5, 255, 127, 0);
  display_text("Connecting Wifi");
  if (!connect_wifi())
  {
    led_set(5, 255, 0, 0);
    Serial.println("Could not connect WiFi.");
    display_text("Wifi Connection Failed");
    delay(5000);
    led_set(5, 0, 0, 0);
    display_text("Ready to record");
    return;
  }
  if (client.connect(server, 80))
  {
    led_set(5, 0, 0, 255);
    Serial.println("connected to server");
    display_text("Sending Data...");
    send_query();
  }
  return;
}

bool connect_wifi()
{
  if (wifi_status != WL_CONNECTED)
  {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    wifi_status = WiFi.begin(ssid, pass);

    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    // wait 10 seconds for connection:
    delay(10000);
  }
  return (wifi_status == WL_CONNECTED);
}

void send_query() {
  sd_init();
  String contentType = " text/csv";
  File root = SD.open("/", FILE_READ);
  root.rewindDirectory();
  while (true) {
    File session_file = root.openNextFile();
    if (!session_file) {
      session_file.close();
      break;
    };
    if (session_file.isDirectory()) {
      session_file.close();
      continue;
    };
    char filename2[FILENAME_LENGTH + 1];
    session_file.getName(filename2, FILENAME_LENGTH);
    filename2[FILENAME_LENGTH] = 0;
    Serial.print("File: ");
    Serial.println(filename2);
    String postData = "csv=";
    while (session_file.available()) {
      postData += (char)session_file.read();
    }
    postData += "\r\n";
    Serial.println(postData);

    client.beginRequest();
    client.post("/API/1.0/sendcsv/");
    client.sendHeader("Content-Type", contentType);
    client.sendHeader("Content-Length", postData.length());
    client.beginBody();
    for (int i = 0; i < postData.length(); i += 1250) {
      if (i + 1250 < postData.length())
        client.print(postData.substring(i, i + 1250));
      else
        client.print(postData.substring(i));
    }
    client.endRequest();

    session_file.close();
    // read the status code and body of the response
    int statusCode = client.responseStatusCode();
    String response = client.responseBody();
    Serial.print("Status code: ");
    Serial.println(statusCode);
    Serial.print("Response: ");
    Serial.println(response);
    if (statusCode == 200) {
      SD.remove(filename2);
      Serial.print("Delete: ");
      Serial.println(filename2);
    }
  }
  display_text("Finished Sending data");
  delay(5000);
  led_set(5, 0, 0, 0);
  display_text("Ready to record");

}


void display_text(String text)
{
  display.clearBuffer();
  display.setCursor(0, 80);
  display.print(text);
  display_draw_line();
  display_draw_battery();
  display.display();
  Serial.println(text);
}

void display_result()
{
  led_set(3, 0, 0, 0);
  display.clearBuffer();
  display_draw_compass();
  display_draw_line();
  display_draw_battery();
  display.setFont(&FreeSans9pt7b);
  display.setCursor(5, 15);
  display.print("Result " + clock_start + " - " + clock_end);
  display.setFont(&FreeSans12pt7b);
  display.setCursor(5, 48);
  display.print("Knot: " + String(calc_knot()));
  //display.print("Knot: " + String(1.32));
  display.setCursor(5, 80);
  int course = calc_course();
  if (338 < course || course <= 23)
    direction = "N";
  else if (23 < course && course <= 58)
    direction = "NE";
  else if (58 < course && course <= 113)
    direction = "E";
  else if (113 < course && course <= 158)
    direction = "SE";
  else if (158 < course && course <= 203)
    direction = "S";
  else if (203 < course && course <= 258)
    direction = "SW";
  else if (258 < course && course <= 293)
    direction = "W";
  else if (293 < course && course <= 338)
    direction = "NW";
  display.print("Direction: " + direction);
  display.setCursor(5, 112);
  display.print("Angle: " + String(course));
  //display.print("Angle: " + String(322));
  display.display();
  Serial.println();
}

void display_draw_compass()
{
  int center_x = 200;
  int center_y = 70;
  int radius = 40;
  double rad1, rad2, rad3;
  int x, y;
  int i = 0;
  for (int i = 0; i < 360; i++)
  {
    rad1 = i * PI / 180;
    x = center_x + (int)(radius * cos(rad1));
    y = center_y + (int)(radius * sin(rad1));
    display.drawPixel(x, y, EPD_BLACK);
  }
  rad1 = (calc_course() - 90) * PI / 180;
  rad2 = (calc_course() - 240) * PI / 180;
  rad3 = (calc_course() - 300) * PI / 180;
  display.fillTriangle(center_x + (int)(radius * cos(rad1)), center_y + (int)(radius * sin(rad1)),
                       center_x + (int)(radius * cos(rad2)), center_y + (int)(radius * sin(rad2)),
                       center_x + (int)(radius * cos(rad3)), center_y + (int)(radius * sin(rad3)), EPD_BLACK);
}

void display_draw_line()
{
  display.drawFastHLine(0, 20, 250, EPD_BLACK);
}

void display_draw_battery()
{
  int base_x = 220;
  int base_y = 3;
  display.drawRect(base_x, base_y, 24, 14, EPD_BLACK);

  if (voltage > LOW_VOLTAGE)
    display.fillRect(base_x + 2, base_y + 2, 6, 10, EPD_BLACK);
  if (voltage > MID_VOLTAGE)
    display.fillRect(base_x + 9, base_y + 2, 6, 10, EPD_BLACK);
  if (voltage > HIGH_VOLTAGE)
    display.fillRect(base_x + 16, base_y + 2, 6, 10, EPD_BLACK);
  display.fillRect(base_x + 24, base_y + 4, 2, 6, EPD_BLACK);
}

void get_battery_voltage()
{
  voltage = analogRead(VBATPIN) * 2 * 3.3 / 1024;
}

void need_recharge()
{
  if (voltage < LOW_VOLTAGE)
  {
    Serial.print("Battery: ");
    Serial.print(voltage);
    Serial.println("V");
    for (int i = 0; i < 10; i++)
    {
      led_set(7, 255, 0, 0);
      delay(200);
      led_set(7, 0, 0, 0);
      delay(200);
    }
    led_set(7, 255, 0, 0);
  }
  else
  {
    led_set(7, 0, 0, 0);
  }
}
