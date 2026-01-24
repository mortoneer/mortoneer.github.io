const fs = require('fs'); // Import Node.js File System module


// --- 1. CONFIGURATION & DATA ---
const ScoreboardMode = { BASKET_BALL_GAME: 0, FIREWORKS_DISPLAY: 1, CLOCK_ONLY: 2, COUNTDOWN: 3, OFF: 4, MELTDOWN: 5 };

const scenes = [
  { description: "Show Start. OFF", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": 4, "clockRunning": false }, "index": 0 },
  { description: "New Years Count Down", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 10, "mode": 2, "clockRunning": false }, "index": 1 },
  { description: "NINE", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 9, "mode": 2, "clockRunning": false }, "index": 2 },
  { description: "EIGHT", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 8, "mode": 2, "clockRunning": false }, "index": 3 },
  { description: "SEVEN", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 7, "mode": 2, "clockRunning": false }, "index": 4 },
  { description: "SIX", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 6, "mode": 2, "clockRunning": false }, "index": 5 },
  { description: "FIVE", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 5, "mode": 2, "clockRunning": false }, "index": 6 },
  { description: "FOUR", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 4, "mode": 2, "clockRunning": false }, "index": 7 },
  { description: "THREE", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 3, "mode": 2, "clockRunning": false }, "index": 8 },
  { description: "TWO", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 2, "mode": 2, "clockRunning": false }, "index": 9 },
  { description: "ONE", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 1, "mode": 2, "clockRunning": false }, "index": 10 },
  { description: "Fireworks", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": 1, "clockRunning": false }, "index": 11 },
  { description: "Off", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": 4, "clockRunning": false }, "index": 12 },

  { description: "COACH: You have 10 minutes.", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 10, "clockSeconds": 0, "mode": 2, "clockRunning": true }, "index": 13 },
  { description: "Music Starts - 3 minutes - GET YOUR HEAD IN THE GAME", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 3, "clockSeconds": 0, "mode": 2, "clockRunning": true }, "index": 13 },
  { description: "OFF", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": 4, "clockRunning": false }, "index": 14 },

  { description: "1 RYAN: Right. Umm. What are the rules again?", data: { "homeScore": 1, "awayScore": 1, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
  { description: "2 RYAN: Right. Umm. What are the rules again?", data: { "homeScore": 2, "awayScore": 2, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
  { description: "3 RYAN: Right. Umm. What are the rules again?", data: { "homeScore": 3, "awayScore": 3, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
  { description: "4 RYAN: Right. Umm. What are the rules again?", data: { "homeScore": 4, "awayScore": 4, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
  { description: "5 RYAN: Right. Umm. What are the rules again?", data: { "homeScore": 5, "awayScore": 5, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
  { description: "INTERMISSION OFF", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": ScoreboardMode.OFF, "clockRunning": false }, "index": 14 },

  // { description: "INTERMISSION", data:{"homeScore":0,"awayScore":0,"homeFouls":0,"awayFouls":0,"quarter":0,"clockMinutes":15,"clockSeconds":0,"mode":ScoreboardMode.CLOCK_ONLY,"clockRunning":true},"index":16},
  // { description: "OFF - Start of ACT 2", data:{"homeScore":0,"awayScore":0,"homeFouls":0,"awayFouls":0,"quarter":0,"clockMinutes":0,"clockSeconds":0,"mode":ScoreboardMode.OFF,"clockRunning":false},"index":14},

  { description: "See Coach - Drills - Act 2 Scene 4", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 45, "mode": ScoreboardMode.CLOCK_ONLY, "clockRunning": true }, "index": 13 },
  { description: "OFF", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": ScoreboardMode.OFF, "clockRunning": false }, "index": 14 },

  // GAME
  { description: "1. And the game is just about to begin.", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": 0, "clockRunning": true } },
  { description: "2. BABY TO BE NUMBER ONE", data: { "homeScore": 18, "awayScore": 14, "homeFouls": 1, "awayFouls": 2, "quarter": 2, "clockMinutes": 5, "clockSeconds": 25, "mode": 0, "clockRunning": true } },
  { description: "3. Take the shot, Troy, take the shot!", data: { "homeScore": 32, "awayScore": 38, "homeFouls": 3, "awayFouls": 2, "quarter": 3, "clockMinutes": 2, "clockSeconds": 20, "mode": 0, "clockRunning": true } },
  { description: "4. SLIP AND SLIDE AND RIDE THAT RHYTHM", data: { "homeScore": 48, "awayScore": 55, "homeFouls": 4, "awayFouls": 3, "quarter": 4, "clockMinutes": 3, "clockSeconds": 10, "mode": 0, "clockRunning": true } },
  { description: "5. Way to hustle, guys! Danforth, out!", data: { "homeScore": 60, "awayScore": 64, "homeFouls": 4, "awayFouls": 4, "quarter": 4, "clockMinutes": 2, "clockSeconds": 45, "mode": 0, "clockRunning": true } },
  { description: "6. Boltons in the lane. he shoots. he scores.", data: { "homeScore": 66, "awayScore": 68, "homeFouls": 4, "awayFouls": 4, "quarter": 4, "clockMinutes": 1, "clockSeconds": 30, "mode": 0, "clockRunning": true } },

  // POWER OUTAGE
  { description: "MELTDOWN", data: { "homeScore": 66, "awayScore": 68, "homeFouls": 4, "awayFouls": 4, "quarter": 4, "clockMinutes": 1, "clockSeconds": 30, "mode": 5, "clockRunning": false } },
  { description: "BLACKOUT (Power Outage)", data: { "homeScore": 66, "awayScore": 68, "homeFouls": 4, "awayFouls": 4, "quarter": 4, "clockMinutes": 1, "clockSeconds": 30, "mode": 4, "clockRunning": false } },

  // RESUME
  { description: "Lights Up: 5 Sec Left", data: { "homeScore": 74, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 5, "mode": 0, "clockRunning": false } },
  { description: "Manual Count: 4", data: { "homeScore": 74, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 4, "mode": 0, "clockRunning": false } },
  { description: "Manual Count: 3", data: { "homeScore": 74, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 3, "mode": 0, "clockRunning": false } },
  { description: "Manual Count: 2", data: { "homeScore": 74, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 2, "mode": 0, "clockRunning": false } },
  { description: "Manual Count: 1", data: { "homeScore": 74, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 1, "mode": 0, "clockRunning": false } },
  { description: "Manual Count: 0", data: { "homeScore": 77, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 0, "mode": 0, "clockRunning": false } },
  { description: "VICTORY CELEBRATION", data: { "homeScore": 77, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 0, "mode": 1, "clockRunning": false } },

  { description: "OFF", data: { "homeScore": 77, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 0, "mode": ScoreboardMode.OFF, "clockRunning": false } },
  { description: "Reset", data: { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": 0, "clockRunning": false }, "index": 15 },
  { description: "OFF", data: { "homeScore": 77, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 0, "mode": ScoreboardMode.OFF, "clockRunning": false } },

];


// --- Configuration ---
const lett = 'ijkklm';
const OUTPUT_FILENAME = 'scoreboard_serial_usb_terminal.json';

const sevenRows = {
  "package": "de.kai_morich.serial_usb_terminal",
  "date": " 20260123-221221",
  "config": {
    "pref_auto_scroll": true,
    "pref_baud_rate": "115200",
    "pref_break_duration": "100",
    "pref_char_delay": "0",
    "pref_charset": "UTF-8",
    "pref_clear_send": false,
    "pref_data_bits": "8",
    "pref_device_hash0": -790050175,
    "pref_device_hash1": -1679620153,
    "pref_device_port": 0,
    "pref_device_position": 0,
    "pref_flow_control": "None",
    "pref_font_family": "0",
    "pref_font_size": "14",
    "pref_keep_screen_on": false,
    "pref_line_delay": "0",
    "pref_macro_rows": "2",
    "pref_parity": "None",
    "pref_receive_buffer_size": "10000",
    "pref_receive_display_mode": "0",
    "pref_receive_newline": "CR+LF",
    "pref_send_display_mode": "0",
    "pref_send_newline": "Auto",
    "pref_show_control_lines": false,
    "pref_show_send": true,
    "pref_show_status": true,
    "pref_show_timestamp": true,
    "pref_stop_bits": "1",
    "pref_timestamp_format": "HH:mm:ss.SSS",
  }
}

const getMacroValues = (macroId, name, value) => {
  return {
    ["pref_" + macroId + "_action"]: 0,
    ["pref_" + macroId + "_line_delay"]: 0,
    ["pref_" + macroId + "_mode"]: 0,
    ["pref_" + macroId + "_name"]: name || 'unnamed',
    ["pref_" + macroId + "_repeat"]: false,
    ["pref_" + macroId + "_repeat_count"]: 2,
    ["pref_" + macroId + "_repeat_delay"]: 0,
    ["pref_" + macroId + "_repeat_infinite"]: false,
    ["pref_" + macroId + "_value"]: value,
  };
}

// --- Step 1: Extract Data ---
// We get the raw data payload from the scene objects
const rawScenes = scenes.map(s => s.data);

// --- Step 2: Calculate Indices & Letters ---
const scenesWithMetadata = scenes.map(({data: scene, description: sceneName}, totalIndex) => {
  // Determine which group of 7 this scene belongs to
  const groupIndex = Math.floor(totalIndex / 7);

  // Get the corresponding character from your 'lett' string ('ijkklm')
  // Group 0 -> 'i', Group 1 -> 'j', Group 2 -> 'k', etc.
  const groupLetter = lett.charAt(groupIndex);

  // Calculate the local index (1 through 7)
  const localIndex = (totalIndex % 7) + 1;

  return {
    scene,
    sceneName,
    letter: groupLetter,
    index: localIndex
  };
});

// --- Step 3: Build Command Dictionary ---
const commandDictionary = scenesWithMetadata.reduce((accumulator, item) => {
  // Create key: e.g., "pref_i1_value", "pref_j2_value"
  const macroId = `${item.letter}${item.index}`;

  // Create value: The complicated command string with nested JSON
  const jsonPayload = JSON.stringify(item.scene);
  const commandString = `RELAY|94:51:dc:32:a3:b0|SCOREBOARD|SET_FROM_JSON|${jsonPayload}`;

  const macroValues = getMacroValues(macroId, item.sceneName, commandString);

  accumulator.config = {
    ...(accumulator.config),
    ...macroValues
  }

  return accumulator;
}, sevenRows);

// --- Step 4: Convert to String & Save to File ---
const finalJsonString = JSON.stringify(commandDictionary, null, 2); // 'null, 2' creates readable indentation

try {
  fs.writeFileSync(OUTPUT_FILENAME, finalJsonString);
  console.log(`✅ Success! Data written to ${OUTPUT_FILENAME}`);
} catch (err) {
  console.error('❌ Error writing file:', err);
}