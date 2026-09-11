# Category tree — draft for approval

Proposed structure for Issue 3. **Nothing is re-tagged yet.** Correct this on
paper first; re-tagging 253 components is the expensive part and should only
happen once.

Built from the actual catalogue contents, not invented.

---

## Proposed depth: 2 levels

**Major → Sub → parts.**

You sketched three (Boards → Arduino → Shields → part). I am proposing two,
for a specific reason: at three levels most of the bottom groups hold only
1–3 parts. "Arduino → Shields" would contain zero items today — the catalogue
has no shields. Three levels would mean more tapping to reach a part, and
several dead-end branches.

Two levels gives 12 majors → 46 subs → 253 parts, averaging ~5 parts per sub,
which is a comfortable list on a phone.

**If you still want three**, say so and I will split the largest subs further
(Logic IC and Sensors are the only two that genuinely justify it).

---

## The tree

### Tools (23) → 4 subs
- **Soldering** — soldering iron, solder wire, flux, desoldering pump + wick, brass wool, hot air rework station
- **Measuring** — multimeter, oscilloscope, function generator, logic analyser, component tester LCR-T4, USB power meter, calipers, IR thermometer
- **Hand tools** — pliers/cutter/stripper set, screwdrivers, tweezers, IC extractor, helping hands, USB microscope
- **Bench equipment** — bench power supply, isolation transformer, ESD wrist strap + mat

### Passives (18) → 4 subs
- **Resistors** — 1/4W kit, 1/2W and 1W kit, metal film 1%, precision 0.1%, shunts
- **Capacitors** — ceramic kit, electrolytic kit, film (MKT), tantalum/low-ESR, supercapacitor
- **Inductors & magnetics** — inductor kit, ferrite beads, toroid cores + enamel wire
- **Variable & timing** — potentiometers, trimpots, crystal 16/12MHz, crystal 32.768kHz, ceramic resonator

### Discretes (29) → 4 subs
- **Diodes** — 1N4007, 1N4148, zener kit, bridge rectifier, Schottky, TVS/MOV, TL431
- **LEDs & optical** — LED 5mm assorted, RGB LED, WS2812B strip, IR LED + TSOP1738, photodiode, LDR, phototransistor, laser diode + receiver
- **Transistors** — BC547, BC557, 2N2222/3904, 2N3906, TIP122, TIP41C/42C, 2N7000, IRLZ44N, BF245/J201
- **Power switching & protection** — IGBT, SCR, TRIAC + DIAC, NTC thermistor, PTC resettable fuse

### Analog IC (16) → 4 subs
- **Op-amps** — LM741, LM358, LM324, TL072/074, MCP6002, NE5532, AD620
- **Comparators** — LM393, LM339
- **Timers & oscillators** — NE555, NE556, CD4046 PLL, XR2206
- **Audio & drivers** — LM386, LM3914, INA219

### Power IC (14) → 3 subs
- **Linear regulators** — 7805, 7809/7812, 7905/7912, LM317T, AMS1117, LM723
- **Switching modules** — LM2596 buck, MT3608 boost, MP1584 mini buck, TP4056 charger, BMS board
- **Gate drivers & thermal** — IR2110, TC4427, heat sinks + thermal paste

### Logic IC (38) → 5 subs
- **Gates** — 7400, 7402, 7404, 7408, 7432, 7486, 74266, 7410, 7411, 7420, 7421, 7427, 74HC14, 74HC132
- **Arithmetic & comparison** — 7483 adder, 7485 comparator, 74181 ALU
- **Multiplexers & decoders** — 74151, 74153, 74138, 74139, 7447, 74HC4051
- **Flip-flops & counters** — 7473/7476, 7474, 7490, 7493
- **Shift registers & buffers** — 7495/74194, 74HC595, 74HC165, 74HC245
- **CD4000 series** — CD4017, CD4511, CD4013, CD4011/4001, CD4093, CD4066, CD4060

*(that is 6 — Logic IC is the biggest category and needs them)*

### Interface IC (19) → 4 subs
- **Data conversion** — ADC0804, DAC0808, ADS1115, MCP4725
- **Isolation & drivers** — PC817, 4N35, MOC3021, ULN2803, ULN2003
- **Serial & bus** — MAX232, CH340/CP2102, PCF8574, MAX485, MCP2515, logic level shifter
- **Memory & storage** — 24LC256 EEPROM, W25Q64 flash, SD card module, DS3231 RTC

### Motors & Drive (11) → 3 subs
- **Motors** — SG90 servo, MG996R servo, 28BYJ-48 stepper, N20/BO gear motors, BLDC + ESC
- **Drivers** — L293D, L298N, TB6612FNG, A4988/DRV8825
- **Actuators & switching** — 5V relay module, solenoid / linear actuator

### Boards & MCU (22) → 6 subs
- **Arduino** — Uno R3, Nano, ATmega328P bare chip + crystal
- **ESP** — ESP32 DevKit, ESP32-S3, ESP32-C3/C6, NodeMCU ESP8266
- **Raspberry Pi** — Pico / Pico W, Pico 2 / 2W, Zero 2 W, Pi 4 / 5
- **STM32** — Blue Pill F103, Black Pill F411, Nucleo, ST-Link V2 programmer
- **Other MCU** — ATtiny85 + USBasp, AT89S52 + programmer, Teensy 4.x, nRF52840, CH32V003
- **Programmable logic** — FPGA Tang Nano 9K, CPLD EPM240

### Sensors (32) → 6 subs
- **Temperature & humidity** — DHT11, DHT22/AM2302, LM35, DS18B20, MLX90614
- **Environment** — BMP280, BME280, MQ-2/MQ-135 gas, soil moisture, rain/water level, flame + UV
- **Distance & presence** — HC-SR04 ultrasonic, PIR HC-SR501, IR obstacle/line, VL53L0X laser
- **Motion & position** — MPU6050, MPU9250, rotary encoder, Hall A3144
- **Light, colour & sound** — TCS3200 colour, sound/MAX9814
- **Measurement** — load cell + HX711, ACS712 current

### Display & Input (11) → 3 subs
- **Displays** — 7-segment CC/CA, TM1637 4-digit, 16x2 LCD, 0.96" OLED, 8x8 matrix MAX7219, 2.4" TFT, e-paper
- **Input** — 4x4 keypad, tactile buttons, 8-way DIP switch
- **Audio out** — buzzer active + passive

### Wires & Parts (20) → 5 subs
- **Prototyping** — breadboard 830, breadboard power module, zero PCB/perfboard, SMD component book
- **Wires & connectors** — jumper wire kit, Dupont wires, header pins, IC sockets, hookup wire, screw terminals, JST/barrel connectors
- **Power supply** — 9V/12V adapter, battery holders + 9V snap, transformer 12-0-12, 18650 cells + holder + BMS
- **Mechanical** — standoffs/M3/spacers, enclosure boxes, heat shrink kit
- **Consumables** — isopropyl alcohol, solder paste + stencil

---

## Proposed 13th major: Wireless & Comms (8 parts)

Eight parts currently sit in **Sensors** but are not sensors — they are radios
and network interfaces:

RFID RC522 · HC-05 Bluetooth · nRF24L01+ · 433MHz RF pair · LoRa SX1278 ·
SIM800L GSM · W5500 Ethernet · NEO-6M GPS

Grouping them under Sensors makes that category 32 items and mixes two
unrelated ideas. As their own major they form a clean group, and Sensors drops
to 24.

**Your call** — keep them in Sensors, or promote to their own category?

---

## Other misfiled parts worth moving

| Part | Today | Suggested |
|---|---|---|
| **ESP32-CAM** | Sensors | Boards & MCU → ESP (it is a dev board) |
| **DS3231 RTC** | Interface IC | stays, under Memory & storage — or its own "Timing" sub |
| **BMS battery protection board** | Power IC | duplicated with 18650 BMS in Wires — worth merging |
| **Heat sinks + thermal paste** | Power IC | arguably Wires & Parts → Mechanical |
| **TL431 shunt reference** | Discretes | could sit under Power IC → Linear regulators |

---

## What I need from you

1. **Two levels, or three?** (I recommend two — reasons at the top.)
2. **Promote "Wireless & Comms" to its own major?** (I recommend yes.)
3. **Any sub-category names you want changed** — these are my wording, not
   fixed.
4. **The misfiled parts above** — move them, or leave them where they are?
5. Anything grouped in a way that does not match how you actually think about
   your parts. This is the moment to say so.

Once approved, re-tagging is mechanical: each catalogue row gains a `sub`
field, and the All tab becomes major → sub → parts.
