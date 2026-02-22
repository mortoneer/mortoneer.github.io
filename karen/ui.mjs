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
    <button id="btnSave" class="btn-save-firebase">Save to Cloud</button>
  `;
  panel.appendChild(controls);
  
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
      alert('Scenes saved to cloud!');
    } catch (err) {
      console.error('[Firebase] Save failed:', err);
      alert('Save failed: ' + err.message);
    }
  };
  
  function renderScenes() {
    list.innerHTML = '';
    sceneManager.getAll().forEach(scene => {
      const item = document.createElement('div');
      item.className = 'scene-item';
      
      const header = document.createElement('div');
      header.className = 'scene-header';
      header.innerHTML = `
        <span class="scene-name">${scene.name}</span>
        <button class="btn-play" data-scene="${scene.name}">▶</button>
        <button class="btn-delete" data-scene="${scene.name}">✕</button>
      `;
      item.appendChild(header);
      
      const actions = document.createElement('div');
      actions.className = 'scene-actions';
      scene.actions.forEach((action, i) => {
        const actionEl = document.createElement('div');
        actionEl.className = 'action-item';
        actionEl.innerHTML = `
          <span>${action.type}: ${action.state || action.delay + 'ms'}</span>
          <button class="btn-remove" data-scene="${scene.name}" data-index="${i}">✕</button>
        `;
        actions.appendChild(actionEl);
      });
      item.appendChild(actions);
      
      list.appendChild(item);
    });
  }
  
  list.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-play')) {
      const name = e.target.dataset.scene;
      onPlay(sceneManager.getAll().find(s => s.name === name));
    }
    if (e.target.classList.contains('btn-delete')) {
      const name = e.target.dataset.scene;
      if (confirm(`Delete scene "${name}"?`)) {
        sceneManager.delete(name);
        renderScenes();
      }
    }
    if (e.target.classList.contains('btn-remove')) {
      const name = e.target.dataset.scene;
      const index = parseInt(e.target.dataset.index);
      sceneManager.removeAction(name, index);
      renderScenes();
    }
  });
  
  renderScenes();
  return panel;
}
