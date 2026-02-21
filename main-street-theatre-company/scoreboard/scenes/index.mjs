import { scenes, ScoreboardMode } from './scenes.mjs';

document.getElementById('targetDevice').addEventListener('change', () => updateTargetDevice());
document.getElementById('btnConnect').addEventListener('click', () => connectSerial());
document.getElementById('btnDisconnect').addEventListener('click', () => disconnectSerial());
document.getElementById('btn-prev').addEventListener('click', () => prevScene());
document.getElementById('btn-next').addEventListener('click', () => nextScene());
document.getElementById('sendOnAirOn').addEventListener('click', () => sendOnAir('ON'));
document.getElementById('sendOnAirRainbow').addEventListener('click', () => sendOnAir('ON_WITH_RAINBOW'));
document.getElementById('sendOnAirOff').addEventListener('click', () => sendOnAir('OFF'));

const list = document.querySelectorAll('.sender');
for (const sender of list) {
    sender.addEventListener('click', (event) => {
        const macAddress = event.target.getAttribute('data-mac');
        const eventType = event.target.getAttribute('data-event');
        const command = event.target.getAttribute('data-data');
        console.log(`RELAY|${macAddress}|${eventType}|${command}`);
        sendCommand(command, undefined, macAddress, eventType);
    });
}

document.getElementById('fiftyfiftygo').addEventListener('click', () => {
    const data = {
        "homeScore": 50,
        "awayScore": 50,
        "homeFouls": 0,
        "awayFouls": 0,
        "quarter": 0,
        "clockMinutes": Number(document.getElementById('fiftyfifty').value),
        "clockSeconds": 0,
        "mode": ScoreboardMode.BASKET_BALL_GAME,
        "clockRunning": false
    };

    onSceneChange(data);
});

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
    if (!('serial' in navigator)) {
        alert('Web Serial API not supported. Use Chrome or Edge.');
        return;
    }
    try {
        port = await navigator.serial.requestPort();
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
