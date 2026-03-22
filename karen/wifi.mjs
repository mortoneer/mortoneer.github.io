export class NetworkBridgeManager {
  constructor() {
    this.url = 'http://192.168.4.1';
  }

  async autoConnect() {
    try {
      const response = await fetch(`${this.url}/status`, { signal: AbortSignal.timeout(1000) });
      return response.ok;
    } catch { return false; }
  }

  async connect() { return await this.autoConnect(); }
  async disconnect() {}

  async send(mac, eventType, data) {
    // Wire format: POST /relay  body: <mac>|<eventType>|<data>
    // e.g. aa:bb:cc:dd:ee:ff|KAREN|ACTIVATE|scene1
    const body = data ? `${mac}|${eventType}|${data}` : `${mac}|${eventType}`;
    const response = await fetch(`${this.url}/relay`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
    });
    if (!response.ok) throw new Error(`Relay failed: ${response.status}`);
  }

  async isConnected() { return await this.autoConnect(); }
}
