import { SerialManager } from './serial.mjs';
import { SceneManager } from './scenes.mjs';

const MAC_ADDRESS = '8C:4F:00:30:60:9C';
const serial = new SerialManager();
const sceneManager = new SceneManager();
const scenes = sceneManager.getAll();
let currentIndex = 0;

// Connection
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

// Scene navigation
function goToScene(index) {
  if (index < 0 || index >= scenes.length) return;
  currentIndex = index;
  activateScene(scenes[currentIndex]);
  render();
}

function nextScene() {
  if (currentIndex < scenes.length - 1) {
    goToScene(currentIndex + 1);
  }
}

function prevScene() {
  if (currentIndex > 0) {
    goToScene(currentIndex - 1);
  }
}

async function activateScene(scene) {
  if (!scene.actions || scene.actions.length === 0) return;
  const action = scene.actions[0];
  
  try {
    await serial.send(MAC_ADDRESS, 'KAREN', `ACTIVATE|${action.state}`);
    console.log(`[Show] Scene ${currentIndex + 1}: ${scene.name}`);
  } catch (err) {
    console.error('Send failed:', err);
  }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextScene();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevScene();
  }
});

// Render
function render() {
  const current = scenes[currentIndex];
  const prev = scenes[currentIndex - 1];
  const next = scenes[currentIndex + 1];
  
  // Previous scene
  const prevCard = document.querySelector('.scene-card.prev');
  if (prev) {
    prevCard.style.opacity = '1';
    prevCard.style.cursor = 'pointer';
    prevCard.querySelector('.scene-name').textContent = prev.name;
    prevCard.onclick = () => prevScene();
  } else {
    prevCard.style.opacity = '0.3';
    prevCard.style.cursor = 'default';
    prevCard.querySelector('.scene-name').textContent = '—';
    prevCard.onclick = null;
  }
  
  // Current scene
  const currentCard = document.querySelector('.scene-card.current');
  currentCard.querySelector('.scene-number').textContent = `Scene ${currentIndex + 1} / ${scenes.length}`;
  currentCard.querySelector('.scene-name').textContent = current?.name || 'No scenes';
  
  // Next scene
  const nextCard = document.querySelector('.scene-card.next');
  if (next) {
    nextCard.style.opacity = '1';
    nextCard.style.cursor = 'pointer';
    nextCard.querySelector('.scene-name').textContent = next.name;
    nextCard.onclick = () => nextScene();
  } else {
    nextCard.style.opacity = '0.3';
    nextCard.style.cursor = 'default';
    nextCard.querySelector('.scene-name').textContent = '—';
    nextCard.onclick = null;
  }
  
  // Scene list
  const list = document.getElementById('sceneList');
  list.innerHTML = '';
  
  scenes.forEach((scene, i) => {
    const item = document.createElement('div');
    item.className = 'scene-item' + (i === currentIndex ? ' active' : '');
    item.innerHTML = `
      <span class="number">${i + 1}</span>
      <span class="name">${scene.name}</span>
      <span class="state">${scene.actions[0]?.state || 'empty'}</span>
    `;
    item.onclick = () => goToScene(i);
    list.appendChild(item);
  });
}

// Initialize
if (scenes.length > 0) {
  goToScene(0);
} else {
  render();
}
