/*
 *  Dckuino.js, an open source project licenced under MIT License
 */

/* jshint esversion: 6 */
/* jshint laxbreak: true */

var commandMap = { // Key that can be typed
  ESCAPE:'KEY_ESC',
  ESC:'KEY_ESC',
  GUI:'MOD_GUI_LEFT',
  WINDOWS:'MOD_GUI_LEFT',
  COMMAND:'MOD_GUI_LEFT',
  MENU:'229',
  APP:'229',
  END:'KEY_END',
  SPACE:'\' \'',
  TAB:'43',
  PRINTSCREEN:'206',
  ENTER:'KEY_ENTER',
  RETURN:'KEY_ENTER',
  UPARROW:'KEY_ARROW_UP',
  DOWNARROW:'KEY_ARROW_DOWN',
  LEFTARROW:'KEY_ARROW_LEFT',
  RIGHTARROW:'KEY_ARROW_RIGHT',
  UP:'KEY_ARROW_UP',
  DOWN:'KEY_ARROW_DOWN',
  LEFT:'KEY_ARROW_LEFT',
  RIGHT:'KEY_ARROW_RIGHT',
  CAPSLOCK:'KEY_CAPS_LOCK',
  DELETE:'42',
  DEL:'42',
  F1:'KEY_F1',
  F2:'KEY_F2',
  F3:'KEY_F3',
  F4:'KEY_F4',
  F5:'KEY_F5',
  F6:'KEY_F6',
  F7:'KEY_F7',
  F8:'KEY_F8',
  F9:'KEY_F9',
  F10:'KEY_F10',
  F11:'KEY_F11',
  F12:'KEY_F12',
  PAGEUP:'75',
  PAGEDOWN:'78'
};

var comboMap = { // Key that can only be used in combos
  ALT:'MOD_ALT_LEFT',
  SHIFT:'MOD_SHIFT_LEFT',
  CTRL:'MOD_CONTROL_LEFT',
  CONTROL:'MOD_CONTROL_LEFT'
};

var keyMap = { // Normal keys
  a:'a',
  b:'b',
  c:'c',
  d:'d',
  e:'e',
  f:'f',
  g:'g',
  h:'h',
  i:'i',
  j:'j',
  k:'k',
  l:'l',
  m:'m',
  n:'n',
  o:'o',
  p:'p',
  q:'q',
  r:'r',
  s:'s',
  t:'t',
  u:'u',
  v:'v',
  w:'w',
  x:'x',
  y:'y',
  z:'z'
};

class Dckuinojs {
  constructor() {
    this.keyMap = keyMap;
    this.commandMap = commandMap;
    this.comboMap = comboMap;
  }

  toArduino(inputCode)
  {
    // Check if the parameter is empty or undefined
    if (inputCode === '' || inputCode === undefined)
    {
      console.error('Error: No ducky script was entered !');
      return false;
    }  // Parsing

    var parsedDucky = this._parse(inputCode);
    if (parsedDucky === '' || parsedDucky === undefined)
    {
      return false;
    }  // Returning the total uploadable script

    return '/*\n'
    + ' * Generated with <3 by Dckuino.js, an open source project !\n'
    + ' */\n\n'
    + '#include "DigiKeyboard.h"\n\n'
    + 'void typeKey(uint8_t key)\n'
    + '{\n'
    + '  DigiKeyboard.sendKeyStroke(key);\n'
    + '}\n\n'
    + '/* Init function */\n'
    + 'void setup()\n'
    + '{\n'
    + '  DigiKeyboard.sendKeyStroke(0);\n'
    + '\n' + parsedDucky
    + '}\n\n'
    + '/* Unused endless loop */\n'
    + 'void loop() {}';
  }

  // The parsing function
   _parse(toParse)
  {
    // Init chronometer
    var timerStart = Date.now();

    // Preset all used vars
    var parsedScript = '';
    var lastLines;
    var lastCount;
    var parsedOut = '';

    var commandKnown = false;
    var releaseAll = false;
    var noNewline = false;
    var noDelay = false;
    var nextNoDelay = false;

    var wordArray;
    var wordOne;

    // Init default delay
    var defaultDelay = 0;

    // Trim whitespaces
    toParse = toParse.replace(/^ +| +$/gm, '');

    // Remove all *ugly* tabs
    toParse = toParse.replace(/\t/g, '');

    // Cut the input in lines
    var lineArray = toParse.split('\n');

    // Loop every line
    for (var i = 0; i < lineArray.length; i++)
    {
      // Line empty, skip
      if (lineArray[i] === '' || lineArray[i] === '\n')
      {
        console.log('Info: Skipped line ' + (i + 1) + ', because was empty.');
        continue;
      }

      // Outputs, for REPLAY/REPEAT COMMANDS
      if (parsedOut !== undefined && parsedOut !== '')
      {
        lastLines = parsedOut;
        lastCount = ((lastLines.split('\n')).length + 1);
      }

      // Reset line buffer
      parsedOut = '';

      // Set to unknown command by default
      commandKnown = false;

      // releaseAll & noNewline & noDelay; *Line Modifiers*
      releaseAll = false;
      noNewline = false;
      noDelay = nextNoDelay;
      nextNoDelay = false;

      // Cut every line in words & store the first word in a var
      wordArray = lineArray[i].split(' ');
      wordOne = wordArray[0];

      // Parse commands
      switch(wordOne){
        case "STRING":
          wordArray.shift();

          var textString = wordArray.join(' ');

          // Replace all '"' by '\"' and all '\' by '\\'
          textString = textString.split('\\').join('\\\\').split('"').join('\\"');
          if (textString !== '')
          {
            parsedOut = '  DigiKeyboard.print("' + textString + '");\n';
            commandKnown = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', STRING needs a text');
            return;
          }
          break;
        case "DELAY":
          wordArray.shift();

          if(wordArray[0] === undefined || wordArray[0] === '') {
            console.error('Error: at line: ' + (i + 1) + ', DELAY needs a time');
            return;
          }

          if (! isNaN(wordArray[0]))
          {
            parsedOut = '  DigiKeyboard.delay(' + wordArray[0] + ');\n';
            commandKnown = true; noDelay = true; nextNoDelay = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', DELAY only acceptes numbers');
            return;
          }
          break;
        case "DEFAULT_DELAY":
          wordArray.shift();

          if(wordArray[0] === undefined || wordArray[0] === '') {
            console.error('Error: at line: ' + (i + 1) + ', DEFAULT_DELAY needs a time');
            return;
          }

          if (! isNaN(wordArray[0]))
          {
            defaultDelay = wordArray[0];
            commandKnown = true; noNewline = true; noDelay = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', DEFAULT_DELAY only acceptes numbers');
            return;
          }
          break;
        case "TYPE":
          wordArray.shift();

          if(wordArray[0] === undefined || wordArray[0] === '') {
            console.error('Error: at line: ' + (i + 1) + ', TYPE needs a key');
            return;
          }

          if (keyMap[wordArray[0]] !== undefined)
          {
            commandKnown = true;
            // Replace the DuckyScript key by the Arduino key name
            parsedOut = '  typeKey(\'' + keyMap[wordArray[0]] + '\');\n';
          } else {
            console.error('Error: Unknown letter \'' + wordArray[0] +'\' at line: ' + (i + 1));
            return;
          }
          break;
        case "REM":
          wordArray.shift();

          // Placing the comment to arduino code
          if (wordArray.length > 0)
          {
            commandKnown = true; noDelay= true;
            parsedOut = '  // ' + wordArray.join(' ');
            if (i == (lineArray.length - 1))
              parsedOut += '\n';
          } else {
            console.error('Error: at line: ' + (i + 1) + ', REM needs a comment');
            return;
          }
          break;
        case "REPEAT":
        case "REPLAY":
          wordArray.shift();

          if (wordArray[0] === undefined || wordArray[0] === '') {
            console.error('Error: at line: ' + (i + 1) + ', REPEAT/REPLAY needs a loop count');
            return;
          }

          if (lastLines === undefined)
          {
            console.error('Error: at line: ' + (i + 1) + ', nothing to repeat, this is the first line.');
            return;
          }

          if (! isNaN(wordArray[0]))
          {
            // Remove the lines we just created
            var linesTmp = parsedScript.split('\n');
            linesTmp.splice(-lastCount, lastCount);

            if (linesTmp.join('\n') === '')
              parsedScript = linesTmp.join('\n');
            else {
              parsedScript = linesTmp.join('\n') + '\n';
            }

            // Add two spaces at Begining
            lastLines = lastLines.replace(/^  /gm,'    ');

            // Replace them
            parsedOut = '  for(int i = 0; i < ' + wordArray[0] + '; i++) {\n';
            parsedOut += lastLines;
            parsedOut += '  }\n';

            commandKnown = true; noDelay = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', REPEAT/REPLAY only acceptes numbers');
            return;
          }
          break;
        default:
          if (wordArray.length == 1)
          {
            if (comboMap[wordArray[0]] !== undefined)
            {
              commandKnown = true;

              parsedOut = '  typeKey(' + comboMap[wordArray[0]] + ');\n';
            }else if (commandMap[wordArray[0]] !== undefined) {
              commandKnown = true;

              parsedOut = '  typeKey(' + commandMap[wordArray[0]] + ');\n';
            }else {
              commandKnown = false;
              break;
            }
            wordArray.shift();
          }
          while (wordArray.length){
            if (comboMap[wordArray[0]] !== undefined)
            {
              commandKnown = true;
              releaseAll = true;

              parsedOut += '  DigiKeyboard.sendKeyPress(' + comboMap[wordArray[0]] + ');\n';
            }else if (commandMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              releaseAll = true;

              parsedOut += '  DigiKeyboard.sendKeyPress(' + commandMap[wordArray[0]] + ');\n';
            }else if (keyMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              releaseAll = true;

              parsedOut += '  DigiKeyboard.sendKeyPress(\'' + keyMap[wordArray[0]] + '\');\n';
            }else {
              commandKnown = false;
              break;
            }
            wordArray.shift();
          }
      }

      if (!commandKnown)
      {
        console.error('Error: Unknown command or key \'' + wordArray[0] + '\' at line: ' + (i + 1) + '.');
        return;
      }

      // If we need to release keys, we do
      if (releaseAll)
        parsedOut += '  DigiKeyboard.sendKeyPress(0);\n';

      // If there is a default delay add it
      if (defaultDelay > 0 && !noDelay)
        parsedOut = '  DigiKeyboard.delay(' + defaultDelay + ');\n\n' + parsedOut;

      parsedScript += parsedOut; // Add what we parsed

      if (!noNewline)
        parsedScript += '\n'; // Add new line
    }

    var timerEnd = Date.now();
    var timePassed = new Date(timerEnd - timerStart);

    console.log('Done parsed ' + (lineArray.length) + ' lines in ' + timePassed.getMilliseconds() + 'ms');
    return parsedScript;
  }
}
