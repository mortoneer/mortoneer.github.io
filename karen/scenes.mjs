// Scene management with localStorage persistence
export class SceneManager {
  constructor() {
    this.scenes = this.load();
    this.currentScene = null;
  }

  load() {
    const data = localStorage.getItem('karen-scenes');
    return data ? JSON.parse(data) : [];
  }

  save() {
    localStorage.setItem('karen-scenes', JSON.stringify(this.scenes, null, 2));
  }

  saveToFirebase(firebaseSave) {
    this.save();
    return firebaseSave(this.scenes);
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

    scene.actions = [action]; // Replace with single action
    this.save();
  }

  removeAction(sceneName, index) {
    const scene = this.scenes.find(s => s.name === sceneName);
    if (scene) {
      scene.actions.splice(index, 1);
      this.save();
    }
  }

  getAll() {
    return this.scenes;
  }

  export() {
    return JSON.stringify(this.scenes, null, 2);
  }
}
