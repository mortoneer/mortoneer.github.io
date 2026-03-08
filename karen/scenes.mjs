// Scene management with localStorage persistence
export class SceneManager {
  constructor(firebaseSave) {
    this.firebaseSave = firebaseSave;
    this.scenes = [];
    this.currentScene = null;
  }

  async load() {
    const localData = localStorage.getItem('karen-scenes');
    const local = localData ? JSON.parse(localData) : { scenes: [], timestamp: 0 };
    
    this.scenes = local.scenes;
    return local;
  }

  async save() {
    const timestamp = Date.now();
    const data = { scenes: this.scenes, timestamp };
    localStorage.setItem('karen-scenes', JSON.stringify(data, null, 2));
    
    if (this.firebaseSave) {
      try {
        await this.firebaseSave(data);
      } catch (err) {
        console.warn('[SceneManager] Firebase sync failed:', err);
      }
    }
  }

  create(name) {
    const scene = { name, actions: [] };
    this.scenes.push(scene);
    this.save();
    return scene;
  }

  delete(name) {
    this.scenes = this.scenes.filter(s => s.name !== name);
    this.save();
  }

  moveUp(name) {
    const index = this.scenes.findIndex(s => s.name === name);
    if (index > 0) {
      const scene = this.scenes.splice(index, 1)[0];
      this.scenes.splice(index - 1, 0, scene);
      this.save();
    }
  }

  moveDown(name) {
    const index = this.scenes.findIndex(s => s.name === name);
    if (index !== -1 && index < this.scenes.length - 1) {
      const scene = this.scenes.splice(index, 1)[0];
      this.scenes.splice(index + 1, 0, scene);
      this.save();
    }
  }

  /**
   * 
   * @param {string} sceneName cue You should be listening for this line or watching for this action.
   * @param {string} action Trigger this action AFTER you see or hear the cue. ie. LISTENING_TO_MERMAID
   */
  addAction(sceneName, action) {
    let scene = this.scenes.find(s => s.name === sceneName);
    if (!scene) {
      scene = this.create(sceneName);
    }

    scene.actions.push(action);
    this.save();
  }

  removeAction(sceneName, index) {
    const scene = this.scenes.find(s => s.name === sceneName);
    if (scene) {
      scene.actions.splice(index, 1);
      this.save();
    }
  }

  rename(oldName, newName) {
    const scene = this.scenes.find(s => s.name === oldName);
    if (scene) {
      scene.name = newName;
      this.save();
    }
  }

  getAll() {
    return this.scenes || [];
  }

  export() {
    return JSON.stringify(this.scenes, null, 2);
  }
}
