import { SerialManager } from './serial.mjs';
import { NetworkBridgeManager } from './wifi.mjs';
import { SceneManager } from './scenes.mjs';
import { SoundManager } from './sounds.mjs';

const MAC_ADDRESS = '8C:4F:00:30:60:9C';
let manager;

// Manager switch
const useWifi = localStorage.getItem('useWifi') === 'true';
document.getElementById('managerSwitch').checked = useWifi;
manager = useWifi ? new NetworkBridgeManager() : new SerialManager();

document.getElementById('managerSwitch').onchange = (e) => {
  localStorage.setItem('useWifi', e.target.checked);
  location.reload();
};

const sceneManager = new SceneManager();
const soundManager = new SoundManager();
let scenes = [];
let currentIndex = 0;

// Auto-connect
window.addEventListener('load', async () => {
  await sceneManager.load();
  scenes = sceneManager.getAll();
  
  // Preload sounds
  const soundUrls = scenes.flatMap(s => s.actions || [])
    .filter(a => a.type === 'playSound' && a.url)
    .map(a => a.url);
  
  if (soundUrls.length > 0 && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_SOUNDS',
      urls: soundUrls
    });
  }
  
  if (scenes.length > 0) {
    goToScene(0);
  } else {
    render();
  }
  
  try {
    if (await manager.autoConnect()) {
      updateConnectionStatus(true);
      console.log('Auto-connected to serial port');
    }
  } catch (err) {
    console.error('Auto-connect failed:', err);
  }
});

// Fullscreen
document.getElementById('btnFullscreen').onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.getElementById('btnFullscreen').textContent = 'Exit Full Screen';
  } else {
    document.exitFullscreen();
    document.getElementById('btnFullscreen').textContent = 'Enter Full Screen';
  }
};

// Connection
document.getElementById('btnConnect').onclick = async () => {
  try {
    await manager.connect();
    updateConnectionStatus(true);
  } catch (err) {
    console.error('Connection failed:', err);
  }
};

document.getElementById('btnDisconnect').onclick = async () => {
  await manager.disconnect();
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
  
  for (const action of scene.actions) {
    if (action.type === 'activate') {
      try {
        await manager.send(MAC_ADDRESS, 'KAREN', `ACTIVATE|${action.state}`);
        console.log(`[Show] Scene ${currentIndex + 1}: ${scene.name}`);
      } catch (err) {
        console.error('Send failed:', err);
      }
    } else if (action.type === 'playSound') {
      try {
        const cues = action.cues || [];
        let cueIndex = 0;
        
        soundManager.onTimeUpdate = (time) => {
          if (cueIndex < cues.length && time >= cues[cueIndex]) {
            cueIndex++;
            nextScene();
          }
        };
        
        soundManager.onEnded = () => nextScene();
        await soundManager.play(action.url);
      } catch (err) {
        console.error('Sound playback failed:', err);
      }
    }
  }
}

async function retriggerScene() {
  const scene = scenes[currentIndex];
  if (!scene?.actions) return;
  for (const action of scene.actions) {
    if (action.type === 'activate') {
      try {
        await manager.send(MAC_ADDRESS, 'KAREN', `ACTIVATE|${action.state}`);
      } catch (err) {
        console.error('Retrigger failed:', err);
      }
    }
  }
}


document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextScene();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    retriggerScene();
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
  currentCard.style.cursor = 'pointer';
  currentCard.onclick = () => retriggerScene();
  
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
