/**
 * build_flags = 
    -D ARDUINO_USB_CDC_ON_BOOT=1
    -D ARDUINO_USB_MODE=1 
 */

import { serial } from 'https://cdn.jsdelivr.net/npm/web-serial-polyfill@1.0.15/dist/serial.js';

// --- 1. CONFIGURATION & DATA ---
const ScoreboardMode = { BASKET_BALL_GAME: 0, FIREWORKS_DISPLAY: 1, CLOCK_ONLY: 2, COUNTDOWN: 3, OFF: 4, MELTDOWN: 5 };

const scenes = [
    { description: "Show Start. OFF", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": 4, "clockRunning": false }, "index": 0 },
    { description: "New Years Count Down", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 10, "mode": 2, "clockRunning": false }, "index": 1 },
    { description: "NINE", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 9, "mode": 2, "clockRunning": false }, "index": 2 },
    { description: "EIGHT", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 8, "mode": 2, "clockRunning": false }, "index": 3 },
    { description: "SEVEN", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 7, "mode": 2, "clockRunning": false }, "index": 4 },
    { description: "SIX", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 6, "mode": 2, "clockRunning": false }, "index": 5 },
    { description: "FIVE", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 5, "mode": 2, "clockRunning": false }, "index": 6 },
    { description: "FOUR", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 4, "mode": 2, "clockRunning": false }, "index": 7 },
    { description: "THREE", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 3, "mode": 2, "clockRunning": false }, "index": 8 },
    { description: "TWO", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 2, "mode": 2, "clockRunning": false }, "index": 9 },
    { description: "ONE", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 1, "mode": 2, "clockRunning": false }, "index": 10 },
    { description: "Fireworks", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": 1, "clockRunning": false }, "index": 11 },
    { description: "Off", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": 4, "clockRunning": false }, "index": 12 },

    { description: "COACH: You have 10 minutes.", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 10, "clockSeconds": 0, "mode": 2, "clockRunning": true }, "index": 13 },
    { description: "Music Starts - 3 minutes - GET YOUR HEAD IN THE GAME", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 3, "clockSeconds": 0, "mode": 2, "clockRunning": true }, "index": 13 },
    { description: "OFF", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": 4, "clockRunning": false }, "index": 14 },

    { description: "1 RYAN: Right. Umm. What are the rules again?", "data": { "homeScore": 1, "awayScore": 1, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
    { description: "2 RYAN: Right. Umm. What are the rules again?", "data": { "homeScore": 2, "awayScore": 2, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
    { description: "3 RYAN: Right. Umm. What are the rules again?", "data": { "homeScore": 3, "awayScore": 3, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
    { description: "4 RYAN: Right. Umm. What are the rules again?", "data": { "homeScore": 4, "awayScore": 4, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
    { description: "5 RYAN: Right. Umm. What are the rules again?", "data": { "homeScore": 5, "awayScore": 5, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": ScoreboardMode.COUNTDOWN, "clockRunning": false }, "index": 15 },
    { description: "INTERMISSION OFF", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": ScoreboardMode.OFF, "clockRunning": false }, "index": 14 },

    // { description: "INTERMISSION", "data":{"homeScore":0,"awayScore":0,"homeFouls":0,"awayFouls":0,"quarter":0,"clockMinutes":15,"clockSeconds":0,"mode":ScoreboardMode.CLOCK_ONLY,"clockRunning":true},"index":16},
    // { description: "OFF - Start of ACT 2", "data":{"homeScore":0,"awayScore":0,"homeFouls":0,"awayFouls":0,"quarter":0,"clockMinutes":0,"clockSeconds":0,"mode":ScoreboardMode.OFF,"clockRunning":false},"index":14},

    { description: "See Coach - Drills - Act 2 Scene 4", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 45, "mode": ScoreboardMode.CLOCK_ONLY, "clockRunning": true }, "index": 13 },
    { description: "OFF", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 0, "clockMinutes": 0, "clockSeconds": 0, "mode": ScoreboardMode.OFF, "clockRunning": false }, "index": 14 },

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
    { description: "Reset", "data": { "homeScore": 0, "awayScore": 0, "homeFouls": 0, "awayFouls": 0, "quarter": 1, "clockMinutes": 8, "clockSeconds": 0, "mode": 0, "clockRunning": false }, "index": 15 },
    { description: "OFF", data: { "homeScore": 77, "awayScore": 76, "homeFouls": 5, "awayFouls": 5, "quarter": 4, "clockMinutes": 0, "clockSeconds": 0, "mode": ScoreboardMode.OFF, "clockRunning": false } },

];

// --- 2. DEVICE SELECTION LOGIC ---
function updateTargetDevice() {
    const targetId = document.getElementById('targetDevice').value;
    const macInput = document.getElementById('macAddressInput');
    const evtInput = document.getElementById('eventTypeInput');

    if (targetId === 'onAirSign') {
        macInput.value = '8c:4f:00:3c:dd:2c';
        evtInput.value = 'ON_AIR_SIGN';
    } else {
        // Default: Scoreboard
        macInput.value = '94:51:dc:32:a3:b0';
        evtInput.value = 'SCOREBOARD';
    }
}

// --- 3. SERIAL PORT VARIABLES ---
let port;
let reader;
let writer;
let keepReading = false;
const MAX_LOG_LINES = 50;
let lineBuffer = '';

// --- 4. SERIAL LOGIC ---

async function connectSerial() {
    try {
        port = await serial.requestPort();
        await port.open({ baudRate: 115200 });

        log('Port Connected');
        updateConnectionUI(true);
        keepReading = true;
        readUntilClosed();
    } catch (error) {
        log('Connect Error: ' + error.message, true);
    }
}

async function disconnectSerial() {
    keepReading = false;
    if (reader) {
        try {
            await reader.cancel();
        } catch (error) { console.error(error); }
    }
    if (port) {
        try {
            await port.close();
        } catch (e) { console.error(e); }
        port = null;
    }
    updateConnectionUI(false);
    log('Port Disconnected');
}

async function readUntilClosed() {
    const textDecoder = new TextDecoder();
    while (port.readable && keepReading) {
        reader = port.readable.getReader();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                lineBuffer += textDecoder.decode(value);
                let newlineIndex;
                while ((newlineIndex = lineBuffer.indexOf('\n')) !== -1) {
                    const line = lineBuffer.slice(0, newlineIndex).trim();
                    lineBuffer = lineBuffer.slice(newlineIndex + 1);
                    if (line) log('RX: ' + line);
                }
            }
        } catch (error) {
            log('Read Error: ' + error.message, true);
            if (error.message.includes("device has been lost")) disconnectSerial();
        } finally {
            reader.releaseLock();
        }
    }
}

function updateConnectionUI(isConnected) {
    const dot = document.getElementById('connection-status');
    const btnCon = document.getElementById('btnConnect');
    const btnDis = document.getElementById('btnDisconnect');

    if (isConnected) {
        dot.classList.add('connected');
        btnCon.style.opacity = '0.5'; btnCon.style.pointerEvents = 'none';
        btnDis.style.opacity = '1'; btnDis.style.pointerEvents = 'auto';
    } else {
        dot.classList.remove('connected');
        btnCon.style.opacity = '1'; btnCon.style.pointerEvents = 'auto';
        btnDis.style.opacity = '0.5'; btnDis.style.pointerEvents = 'none';
    }
}

function log(msg, isError = false) {
    console.log(msg);
}

// --- 5. SCENE CONTROLLER LOGIC ---
let currentIndex = -1;
const container = document.getElementById('scene-container');

function init() {
    scenes.forEach((scene, index) => {
        const el = document.createElement('div');
        el.className = `scene-card mode-${scene.data.mode}`;
        el.id = `scene-${index}`;
        const timeStr = `${scene.data.clockMinutes}:${scene.data.clockSeconds.toString().padStart(2, '0')}`;
        const modeName = Object.keys(ScoreboardMode).find(key => ScoreboardMode[key] === scene.data.mode);

        // Visual HTML Generation
        let visualHtml = '';
        switch (scene.data.mode) {
            case 4: // OFF
                visualHtml = `<div class="visual-summary mode-4"><div class="offline-text">/// SYSTEM OFFLINE ///</div></div>`;
                break;
            case 1: // FIREWORKS
                visualHtml = `<div class="visual-summary mode-1"><div class="victory-text">🎉 WILDCATS WIN! 🎉</div><div style="color:white;">${scene.data.homeScore} - ${scene.data.awayScore}</div></div>`;
                break;
            case 2: // CLOCK ONLY
                visualHtml = `<div class="visual-summary mode-2"><div class="clock-val">${timeStr}</div></div>`;
                break;
            default: // GAME
                visualHtml = `<div class="visual-summary mode-0">
                        <div style="text-align:center"><div style="font-size:0.7rem; color:#888;">HOME</div><div class="score-val" style="color:#ffcc00">${scene.data.homeScore}</div></div>
                        <div style="text-align:center"><div class="clock-val">${timeStr}</div><div style="font-size:0.7rem; color:#666;">Q${scene.data.quarter}</div></div>
                        <div style="text-align:center"><div style="font-size:0.7rem; color:#888;">AWAY</div><div class="score-val" style="color:#ff4444">${scene.data.awayScore}</div></div>
                    </div>`;
                break;
        }

        el.innerHTML = `
                <div class="scene-header"><span>CUE #${index + 1}: ${scene.description}</span><span style="font-size:0.7rem; background:#444; padding:2px 4px;">${modeName}</span></div>
                <div class="data-display"><pre class="json-block">${JSON.stringify(scene.data, null, 2)}</pre>${visualHtml}</div>
            `;

        // ADD THIS CLICK LISTENER:
        el.addEventListener('click', () => {
            currentIndex = index;
            updateUI();
        });

        container.appendChild(el);
    });

    // Initial UI State
    updateTargetDevice(); // Set initial MAC/Event values
    updateConnectionUI(false);
}

function updateUI() {
    document.querySelectorAll('.scene-card').forEach(el => el.classList.remove('active'));
    if (currentIndex >= 0 && currentIndex < scenes.length) {
        const activeEl = document.getElementById(`scene-${currentIndex}`);
        if (activeEl) {
            activeEl.classList.add('active');
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            onSceneChange(scenes[currentIndex].data);
        }
    }
}

function nextScene() {
    if (currentIndex < scenes.length - 1) { currentIndex++; updateUI(); }
}
function prevScene() {
    if (currentIndex > 0) { currentIndex--; updateUI(); }
}

document.addEventListener('keydown', (e) => {
    if (e.code === "Space" || e.code === "ArrowRight") { e.preventDefault(); nextScene(); }
    else if (e.code === "ArrowLeft") { prevScene(); }
});

// --- 6. TRIGGER LOGIC ---
function onSceneChange(newScene) {
    // Construct the JSON payload for the scoreboard
    const jsonPayload = JSON.stringify({ scene: newScene, index: -1 });

    // Send command via Serial
    sendCommand('SET_FROM_JSON', jsonPayload);
}

async function sendCommand(command, data, overrideMac = null, overrideEvent = null) {
    if (!port || !port.writable) {
        log('TX Failed: Not Connected', true);
        return;
    }

    writer = port.writable.getWriter();

    // Use overrides if provided, otherwise grab from DOM inputs
    const macAddress = overrideMac || document.getElementById('macAddressInput').value;
    const eventType = overrideEvent || document.getElementById('eventTypeInput').value;

    // Protocol: RELAY | MAC | EVENT | COMMAND | DATA
    let message = `RELAY|${macAddress}|${eventType}|${command}`;
    if (data !== undefined && data !== null && data !== '') {
        message += `|${data}`;
    }
    message += '\n';

    const textEncoder = new TextEncoder();
    try {
        await writer.write(textEncoder.encode(message));

        // Log differently if it's the On Air Sign vs Main Scoreboard
        const targetName = (overrideMac) ? "ON AIR" : "SCOREBOARD";
        log(`TX [${targetName}]: ${command}`);

    } catch (error) {
        log('TX Error: ' + error.message, true);
    } finally {
        writer.releaseLock();
    }
}

// --- ON AIR SIGN LOGIC ---
function sendOnAir(cmd) {
    // Hardcoded credentials for the On Air Sign
    const onAirMac = '8c:4f:00:3c:dd:2c';
    const onAirEvent = 'ON_AIR_SIGN';

    // Call sendCommand with specific overrides
    sendCommand(cmd, null, onAirMac, onAirEvent);
}

init();

// Dropdown
const targetSelect = document.getElementById('targetDevice');
if (targetSelect) targetSelect.addEventListener('change', updateTargetDevice);

// Connection Buttons
document.getElementById('btnConnect').addEventListener('click', connectSerial);
document.getElementById('btnDisconnect').addEventListener('click', disconnectSerial);

// Navigation Buttons
document.getElementById('btn-prev').addEventListener('click', prevScene);
document.getElementById('btn-next').addEventListener('click', nextScene);

// On Air Controls (Wrapped in arrow functions to pass arguments)
document.getElementById('onAirOn').addEventListener('click', () => sendOnAir('ON'));
document.getElementById('onAirRainbow').addEventListener('click', () => sendOnAir('ON_WITH_RAINBOW'));
document.getElementById('onAirOff').addEventListener('click', () => sendOnAir('OFF'));