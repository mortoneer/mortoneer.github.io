import { SerialManager } from './serial.mjs';
import { builtInStates, characters } from './states.mjs';
import { SceneManager } from './scenes.mjs';
import { initFirebase, saveToFirebase } from './firebase.mjs';
import { createBuiltInPanel, createCharacterPanel, createScenePanel } from './ui.mjs';

const MAC_ADDRESS = '8C:4F:00:30:60:9C'; // Replace with actual Karen LED MAC
const serial = new SerialManager();
const sceneManager = new SceneManager();

// Initialize Firebase (get app from global scope)
window.addEventListener('load', () => {
  if (window.firebaseApp) {
    initFirebase(window.firebaseApp);
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
  try {
    await serial.send(MAC_ADDRESS, 'KAREN', stateName.toLowerCase());
    console.log(`Built-in: ${stateName}`);
  } catch (err) {
    console.error('Send failed:', err);
  }
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
  app.appendChild(createScenePanel(sceneManager, playScene, () => sceneManager.saveToFirebase(saveToFirebase)));
  
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

render();
