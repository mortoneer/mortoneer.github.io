// UI Component builders
export function createBuiltInPanel(states, onActivate, onAddToScene) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = '<h2>Built-in States</h2>';
  
  const grid = document.createElement('div');
  grid.className = 'button-grid';
  
  states.forEach(state => {
    const wrapper = document.createElement('div');
    wrapper.className = 'state-wrapper';
    
    const btn = document.createElement('button');
    btn.className = 'btn-state';
    btn.textContent = state;
    btn.onclick = () => onActivate(state);
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add';
    addBtn.textContent = '+';
    addBtn.onclick = (e) => {
      e.stopPropagation();
      onAddToScene({ type: 'activate', state: state.toLowerCase() });
    };
    
    wrapper.appendChild(btn);
    wrapper.appendChild(addBtn);
    grid.appendChild(wrapper);
  });
  
  panel.appendChild(grid);
  return panel;
}

export function createCharacterPanel(character, onActivate, onCreate, onAddToScene) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  
  const header = document.createElement('h2');
  header.textContent = character.name;
  panel.appendChild(header);
  
  const grid = document.createElement('div');
  grid.className = 'button-grid';
  
  character.states.forEach(state => {
    const wrapper = document.createElement('div');
    wrapper.className = 'state-wrapper';
    
    const btn = document.createElement('button');
    btn.className = 'btn-state';
    btn.style.backgroundColor = state.color;
    btn.style.color = '#fff';
    btn.textContent = state.base;
    btn.onclick = () => onActivate(state.name);
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = '⚙';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      showColorPicker(state, onCreate);
    };
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add';
    addBtn.textContent = '+';
    addBtn.onclick = (e) => {
      e.stopPropagation();
      onAddToScene({ type: 'activate', state: state.name });
    };
    
    wrapper.appendChild(btn);
    wrapper.appendChild(editBtn);
    wrapper.appendChild(addBtn);
    grid.appendChild(wrapper);
  });
  
  panel.appendChild(grid);
  return panel;
}

function showColorPicker(state, onCreate) {
  const existing = document.getElementById('color-picker-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'color-picker-modal';
  modal.className = 'modal';
  
  const content = document.createElement('div');
  content.className = 'modal-content';
  
  const currentState = { ...state };
  
  content.innerHTML = `
    <h3>${state.name}</h3>
    <label>R: <input type="range" min="0" max="255" value="${state.r}" data-channel="r"><span>${state.r}</span></label>
    <label>G: <input type="range" min="0" max="255" value="${state.g}" data-channel="g"><span>${state.g}</span></label>
    <label>B: <input type="range" min="0" max="255" value="${state.b}" data-channel="b"><span>${state.b}</span></label>
    <label>Brightness: <input type="range" min="0" max="255" value="${state.brightness}" data-channel="brightness"><span>${state.brightness}</span></label>
    <div class="preview" style="background: rgb(${state.r}, ${state.g}, ${state.b})"></div>
    <div class="modal-buttons">
      <button class="btn-save">Save & Send</button>
      <button class="btn-cancel">Cancel</button>
    </div>
  `;
  
  const preview = content.querySelector('.preview');
  
  content.querySelectorAll('input[type="range"]').forEach(input => {
    input.oninput = (e) => {
      const channel = e.target.dataset.channel;
      const value = parseInt(e.target.value);
      currentState[channel] = value;
      e.target.nextElementSibling.textContent = value;
      preview.style.background = `rgb(${currentState.r}, ${currentState.g}, ${currentState.b})`;
    };
  });
  
  content.querySelector('.btn-save').onclick = () => {
    Object.assign(state, currentState);
    onCreate(currentState);
    modal.remove();
  };
  
  content.querySelector('.btn-cancel').onclick = () => modal.remove();
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

export function createScenePanel(sceneManager, onPlay, onSave) {
  const panel = document.createElement('div');
  panel.className = 'panel scene-panel';
  panel.innerHTML = '<h2>Scenes</h2>';
  
  const controls = document.createElement('div');
  controls.className = 'scene-controls';
  controls.innerHTML = `
    <input type="text" id="newSceneName" placeholder="Scene name">
    <button id="btnCreateScene" class="btn-create">Create Scene</button>
    <button id="btnSave" class="btn-save-firebase">Save <span id="syncStatus"></span></button>
  `;
  panel.appendChild(controls);
  
  const syncStatus = controls.querySelector('#syncStatus');
  
  const updateSyncStatus = (status) => {
    if (status === 'synced') {
      syncStatus.textContent = '☁️';
      syncStatus.title = 'Synced to cloud';
    } else if (status === 'offline') {
      syncStatus.textContent = '📴';
      syncStatus.title = 'Offline - saved locally';
    } else {
      syncStatus.textContent = '';
    }
  };
  
  window.addEventListener('online', () => updateSyncStatus('synced'));
  window.addEventListener('offline', () => updateSyncStatus('offline'));
  window.addEventListener('firebase-synced', () => updateSyncStatus('synced'));
  updateSyncStatus(navigator.onLine ? 'synced' : 'offline');
  
  const list = document.createElement('div');
  list.className = 'scene-list';
  list.id = 'sceneList';
  panel.appendChild(list);
  
  controls.querySelector('#btnCreateScene').onclick = () => {
    const name = document.getElementById('newSceneName').value.trim();
    if (name) {
      sceneManager.create(name);
      document.getElementById('newSceneName').value = '';
      renderScenes();
    }
  };
  
  controls.querySelector('#btnSave').onclick = async () => {
    try {
      await onSave();
      updateSyncStatus(navigator.onLine ? 'synced' : 'offline');
      alert('Saved!');
    } catch (err) {
      console.error('[Save] Failed:', err);
      alert('Save failed: ' + err.message);
    }
  };
  
  function renderScenes() {
    list.innerHTML = '';
    sceneManager.getAll().forEach((scene, index) => {
      const item = document.createElement('div');
      item.className = 'scene-item';
      item.draggable = true;
      item.dataset.index = index;
      
      const header = document.createElement('div');
      header.className = 'scene-header';
      header.innerHTML = `
        <span class="scene-name">${scene.name}</span>
        <button class="btn-rename" data-index="${index}">✎</button>
        <button class="btn-up" data-index="${index}">↑</button>
        <button class="btn-down" data-index="${index}">↓</button>
        <button class="btn-play" data-index="${index}">▶</button>
        <button class="btn-delete" data-index="${index}">✕</button>
      `;
      item.appendChild(header);
      
      const actions = document.createElement('div');
      actions.className = 'scene-actions';
      scene.actions.forEach((action, i) => {
        const actionEl = document.createElement('div');
        actionEl.className = 'action-item';
        actionEl.innerHTML = `
          <span>${action.type}: ${action.state || action.delay + 'ms'}</span>
          <button class="btn-remove" data-index="${index}" data-action="${i}">✕</button>
        `;
        actions.appendChild(actionEl);
      });
      item.appendChild(actions);
      
      list.appendChild(item);
    });
  }
  
  list.addEventListener('click', (e) => {
    const scenes = sceneManager.getAll();
    const index = parseInt(e.target.dataset.index);
    
    if (e.target.classList.contains('btn-up')) {
      sceneManager.moveUp(scenes[index].name);
      renderScenes();
    }
    if (e.target.classList.contains('btn-down')) {
      sceneManager.moveDown(scenes[index].name);
      renderScenes();
    }
    if (e.target.classList.contains('btn-rename')) {
      const oldName = scenes[index].name;
      const newName = prompt('Rename scene:', oldName);
      if (newName && newName !== oldName) {
        sceneManager.rename(oldName, newName);
        renderScenes();
      }
    }
    if (e.target.classList.contains('btn-play')) {
      onPlay(scenes[index]);
    }
    if (e.target.classList.contains('btn-delete')) {
      const name = scenes[index].name;
      if (confirm(`Delete scene "${name}"?`)) {
        sceneManager.delete(name);
        renderScenes();
      }
    }
    if (e.target.classList.contains('btn-remove')) {
      const actionIndex = parseInt(e.target.dataset.action);
      sceneManager.removeAction(scenes[index].name, actionIndex);
      renderScenes();
    }
  });

  let draggedIndex = null;
  
  list.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('scene-item')) {
      draggedIndex = parseInt(e.target.dataset.index);
      e.target.style.opacity = '0.5';
    }
  });
  
  list.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('scene-item')) {
      e.target.style.opacity = '';
    }
  });
  
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
  list.addEventListener('drop', (e) => {
    e.preventDefault();
    const dropTarget = e.target.closest('.scene-item');
    if (dropTarget && draggedIndex !== null) {
      const dropIndex = parseInt(dropTarget.dataset.index);
      if (draggedIndex !== dropIndex) {
        const scenes = sceneManager.scenes;
        const [moved] = scenes.splice(draggedIndex, 1);
        scenes.splice(dropIndex, 0, moved);
        sceneManager.save();
        renderScenes();
      }
    }
  });
  
  renderScenes();
  return panel;
}
