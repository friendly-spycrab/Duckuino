# Duckuino
Simple DuckyScript to DigiStump Arduino converter.

  
forked from [Nurrl's Duckuino](https://github.com/Nurrl/Duckuino).

If you need to perform mouse emulation then use [d4n5h's Duckuino](https://github.com/d4n5h/Duckuino).

# Live version:
https://friendly-spycrab.github.io/Duckuino/

# Why Duckuino ?
You can compile duckyscript to arduino code directly through the [live](https://friendly-spycrab.github.io/Duckuino/ "Duckuino Live") version, or reuse <code>Dckuino.js</code> for standalone use :
```javascript
// Create the instance
Duck = new Dckuinojs();

var DuckyScript = "CTRL ALT t\n"
+ "DELAY 1000\n"
+ "STRING gedit\n"
+ "ENTER\n"
+ "DELAY 1000\n"
+ "STRING Hello World !"

var ArduinoCode = Duck.toArduino(DuckyScript);

console.log(ArduinoCode);
```
Output:

```c
/*
 * Generated with <3 by Dckuino.js, an open source project !
 */

#include "DigiKeyboard.h"

void typeKey(int key)
{
    DigiKeyboard.sendKeyStroke(key);
}

// Init function
void setup()
{
  DigiKeyboard.sendKeyStroke(0);

  
  DigiKeyboard.sendKeyStroke(KEY_D,MOD_GUI_LEFT);
  DigiKeyboard.delay(50);
  DigiKeyboard.sendKeyStroke(KEY_F4,MOD_ALT_LEFT);
  DigiKeyboard.delay(200);
  for(int i = 0; i<10;i++)
  {
    DigiKeyboard.sendKeyStroke(82);
  }
  
  DigiKeyboard.delay(10);
  
  for(int i = 0; i<3;i++)
  {
    DigiKeyboard.sendKeyStroke(81);
  }   
  DigiKeyboard.delay(10);
  DigiKeyboard.sendKeyStroke(KEY_ENTER);
}

// Unused
void loop() {}
```


