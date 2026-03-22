export class NetworkBridgeManager {
  constructor() {
    this.ws = null;
    this.url = 'ws://192.168.4.1/ws';
  }

  async autoConnect() {
    try {
      const response = await fetch('http://192.168.4.1/status', { signal: AbortSignal.timeout(1000) });
      if (response.ok) return await this.open();
    } catch { return false; }
    return false;
  }

  async connect() { return await this.open(); }

  async open() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => resolve(true);
      this.ws.onerror = () => reject(false);
    });
  }

  async disconnect() {
    if (this.ws) { this.ws.close(); this.ws = null; }
  }

  async send(mac, eventType, data) {
    // 1. Check if the WebSocket is actually ready
    if (!this.isConnected()) {
      throw new Error('Not connected');
    }

    // 2. Wrap in a try-catch to catch abrupt failures
    try {
      // Wire format: RELAY|<mac>|<eventType>|<data>
      // e.g. RELAY|aa:bb:cc:dd:ee:ff|KAREN|ACTIVATE|scene1
      this.ws.send(`RELAY|${mac}|${eventType}|${data}`);
    } catch (error) {
      console.error('Send failed, cleaning up...', error);
      this.disconnect();
      throw error;
    }
  }

  isConnected() {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}