import { SerialManager } from './serial.mjs';
import { builtInStates, characters } from './states.mjs';
import { SceneManager } from './scenes.mjs';
import { initFirebase, saveToFirebase } from './firebase.mjs';
import { createBuiltInPanel, createCharacterPanel, createScenePanel } from './ui.mjs';

const MAC_ADDRESS = '8C:4F:00:30:60:9C';
const serial = new SerialManager();
const sceneManager = new SceneManager(saveToFirebase);

// Initialize Firebase (get app from global scope)
window.addEventListener('load', async () => {
  await sceneManager.load();
  
  if (window.firebaseApp) {
    initFirebase(window.firebaseApp, sceneManager);
  }
  
  render();
  
  // Try to auto-connect to serial
  try {
    if (await serial.autoConnect()) {
      updateConnectionStatus(true);
      console.log('Auto-connected to serial port');
    }
  } catch (err) {
    console.error('Auto-connect failed:', err);
  }
});

// Connection handlers
document.getElementById('btnConnect').onclick = async () => {
  try {
    await serial.connect();
    updateConnectionStatus(true);
  } catch (err) {
    console.error('Connection failed:', err);
  }
};

document.getElementById('btnDisconnect').onclick = async () => {
  await serial.disconnect();
  updateConnectionStatus(false);
};

function updateConnectionStatus(connected) {
  const status = document.getElementById('status');
  status.className = connected ? 'status-dot connected' : 'status-dot';
}

// Command senders
async function activateState(stateName) {
  try {
    await serial.send(MAC_ADDRESS, 'KAREN', `ACTIVATE|${stateName}`);
    console.log(`Activated: ${stateName}`);
  } catch (err) {
    console.error('Send failed:', err);
  }
}

async function createState(state) {
  try {
    const cmd = `CREATE|${state.name}|${state.base}|${state.r}|${state.g}|${state.b}|${state.brightness}`;
    await serial.send(MAC_ADDRESS, 'KAREN', cmd);
    console.log(`Created: ${state.name}`);
  } catch (err) {
    console.error('Send failed:', err);
  }
}

async function activateBuiltIn(stateName) {
  activateState(stateName);
}

function addToScene(action) {
  const name = prompt('Scene name:');
  if (!name) return;
  sceneManager.create(name);
  sceneManager.addAction(name, action);
  render();
}

async function playScene(scene) {
  console.log(`[Scene] Playing: ${scene.name}`);
  for (const action of scene.actions) {
    if (action.type === 'activate') {
      await activateState(action.state);
    } else if (action.type === 'delay') {
      await new Promise(resolve => setTimeout(resolve, action.delay));
    }
  }
}

// Render UI
function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  // Scene panel with save callback
  app.appendChild(createScenePanel(sceneManager, playScene, () => sceneManager.save()));
  
  // Built-in states
  app.appendChild(createBuiltInPanel(builtInStates, activateBuiltIn, addToScene));
  
  // Character panels
  characters.forEach(char => {
    app.appendChild(createCharacterPanel(char, activateState, createState, addToScene));
  });
}

// Scene selection
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('scene-name')) {
    currentScene = sceneManager.getAll().find(s => s.name === e.target.textContent);
    document.querySelectorAll('.scene-name').forEach(el => el.classList.remove('active'));
    e.target.classList.add('active');
  }
});

// Re-render when scenes update from Firebase
window.addEventListener('scenes-updated', render);
const states = characters.flatMap(c=>c.states);
window.createAllStates = () => states.map((s,i) => setTimeout(()=>{createState(s)}, i * 500));

// function createScene(cue, stateName) {
//   const action = { type: 'activate', state: stateName };
//   sceneManager.addAction(cue, action);
// }

// createScene("Start of show", "OFF");

// // ACT I, SCENE 3: INTERCOM DEBUT
// createScene("ACT I, SC. 3: Silence as the dream ends. LINE: 'Snow White, to the Huntsman scene!' [1]", "TALKING_TO_SNOW_WHITE");
// createScene("ACT I, SC. 3: After SNOW WHITE says 'Ugh. I hate doing that scene.' [1]", "OFF");

// // ACT I, SCENE 3A: OFG INTERFERENCE
// createScene("ACT I, SC. 3A: After OFG asks '(winking) ...did I?' LINE: 'Ok, from Snow’s chase... let's really sell the terror!' [2]", "TALKING_TO_SNOW_WHITE");
// createScene("ACT I, SC. 3A: ACTION: O.F.G. turns the intercom off. [2]", "OFF");

// // ACT I, SCENE 3A: CINDERELLA SUMMONS
// createScene("ACT I, SC. 3A: After OFG says '...tough time to immigrate—' LINE: 'Cinderella, report to the work scene.' [3]", "TALKING_TO_CINDERELLA");
// createScene("ACT I, SC. 3A: After CINDERELLA says '...supposed to love housework, but...' LINE: 'Cinderella!' [3]", "YELLING_AT_CINDERELLA");
// createScene("ACT I, SC. 3A: After Narrator's yell, as Cinderella approaches intercom. LINE: 'Coming!' [4]", "LISTENING_TO_CINDERELLA");
// createScene("ACT I, SC. 3A: ACTION: CINDERELLA hurries off to work. [4]", "OFF");

// // ACT I, SCENE 5: THE INTERROGATION
// createScene("ACT I, SC. 5: After SNOW WHITE says 'Well, that’s what I call him, so—' LINE: 'Snow White?' [5]", "TALKING_TO_SNOW_WHITE");
// createScene("ACT I, SC. 5: After CINDERELLA says 'Don't!' LINE: 'Snow White!' [5]", "YELLING_AT_SNOW_WHITE");
// createScene("ACT I, SC. 5: After Narrator's yell, as SNOW WHITE panics. LINE: '...yes?' [6]", "LISTENING_TO_SNOW_WHITE");
// createScene("ACT I, SC. 5: During SNOW WHITE'S '...yes?' LINE: 'Do you know where Cinderella is?' [6]", "TALKING_TO_SNOW_WHITE");
// createScene("ACT I, SC. 5: After Narrator asks where Cin is. LINE: '...no? No.' [6]", "LISTENING_TO_SNOW_WHITE");
// createScene("ACT I, SC. 5: After Snow's lie. LINE: 'Well if you see her... Happy ever after isn’t a birthright.' [6]", "TALKING_TO_SNOW_WHITE");
// createScene("ACT I, SC. 5: After Narrator's threat. LINE: 'Got it!' [6]", "LISTENING_TO_SNOW_WHITE");
// createScene("ACT I, SC. 5: ACTION: SNOW WHITE hangs up, shaken. [6]", "OFF");

// // ACT II, SCENE 4: BANISHMENT ULTIMATUM
// createScene("ACT II, SC. 4: After CINDERELLA asks 'Where are the girls?!?' ACTION: The intercom lights up, red. LINE: 'Yes where are the girls? Where could they be...' [7]", "TALKING_GENERAL_RED");
// createScene("ACT II, SC. 4: After Narrator muses 'Where could they be...' LINE: 'Cinderella, be at the palace by — shall we say midnight?' [8]", "TALKING_TO_CINDERELLA");
// createScene("ACT II, SC. 4: After Narrator's ultimatum. SOUND FX: 'Click.' [8]", "OFF");
