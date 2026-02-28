// Serial communication module
export class SerialManager {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
  }

  async connect() {
    this.port = await navigator.serial.requestPort();
    await this.open();
    return true;
  }

  async autoConnect() {
    const ports = await navigator.serial.getPorts();
    if (ports.length > 0) {
      this.port = ports[0];
      await this.open();
      return true;
    }
    return false;
  }

  async open() {
    await this.port.open({ baudRate: 115200 });
    this.writer = this.port.writable.getWriter();
  }

  async disconnect() {
    if (this.reader) {
      await this.reader.cancel();
      this.reader = null;
    }
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
  }

  async send(mac, eventType, data) {
    const message = `RELAY|${mac}|${eventType}|${data}\n`;
    console.log('[Serial TX]', message.trim());
    if (!this.writer) throw new Error('Not connected');
    await this.writer.write(new TextEncoder().encode(message));
  }

  isConnected() {
    return this.port !== null;
  }
}
