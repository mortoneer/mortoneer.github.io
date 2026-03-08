export class SoundManager {
  constructor() {
    this.audio = new Audio();
    this.onEnded = null;
    this.onTimeUpdate = null;
  }

  async play(url) {
    return new Promise((resolve, reject) => {
      this.audio.src = url;
      this.audio.onended = () => {
        if (this.onEnded) this.onEnded();
        resolve();
      };
      this.audio.ontimeupdate = () => {
        if (this.onTimeUpdate) this.onTimeUpdate(this.audio.currentTime);
      };
      this.audio.onerror = reject;
      this.audio.play().catch(reject);
    });
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
