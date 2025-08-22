import EventEmitter from "events";

let WSImpl;
if (typeof window === "undefined") {
  // Node.js environment → use `ws`
  WSImpl = (await import("ws")).default;
} else {
  // Browser / Next.js client → use native WebSocket
  WSImpl = WebSocket;
}

export class SyncClient extends EventEmitter {
  constructor({
    sourceId,
    secret,
    url = "wss://devhooks-sync.kitsao.workers.dev/ws",
  }) {
    super();
    this.sourceId = sourceId;
    this.secret = secret;
    this.url = new URL(url);
    this.url.searchParams.set("source_id", sourceId);

    this.ws = null;
    this.connected = false;
    this.isAuthenticated = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (
      this.ws &&
      (this.ws.readyState === WSImpl.OPEN ||
        this.ws.readyState === WSImpl.CONNECTING)
    ) {
      return;
    }

    this.ws = new WSImpl(this.url.toString());

    this.ws.onopen = () => {
      this.emit("open");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (msg) => this._onMessage(msg);
    this.ws.onclose = (e) => this._onClose(e.code, e.reason);
    this.ws.onerror = (err) => this._onError(err);
  }

  _onMessage(msg) {
    let data;
    try {
      // msg.data in browser, msg in Node.js
      const raw = msg.data || msg;
      data = JSON.parse(raw.toString());
    } catch (err) {
      this.emit("error", new Error(`Invalid JSON: ${msg.toString()}`));
      return;
    }

    this.emit("server_message", data);

    switch (data.type) {
      case "auth_required":
        this._authenticate();
        break;
      case "connected":
      case "auth_success":
        this.connected = true;
        this.isAuthenticated = true;
        this.emit("authenticated");
        break;
      case "event":
        this.emit("event", data.data);
        break;
      case "replay":
        this.emit("replay", data.data);
        break;
      case "cleared":
        this.emit("cleared", data);
        break;
      case "destroyed":
        this.emit("destroyed", data);
        break;
      case "error":
        this.emit("server_error", data.error, data.code);
        break;
      default:
        this.emit("message", data);
    }
  }

  _onClose(code, reason) {
    this.connected = false;
    this.isAuthenticated = false;
    this.emit("close", code, reason?.toString());

    if (code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    } else if (code !== 1000) {
      this.emit("reconnect_failed");
    }
  }

  _onError(err) {
    this.emit("error", err);
  }

  _authenticate() {
    if (this.secret) {
      this.ws.send(JSON.stringify({ type: "auth", secret: this.secret }));
    } else {
      this.disconnect(1008, "Authentication failed: No secret provided");
    }
  }

  send(payload) {
    if (!this.ws || this.ws.readyState !== WSImpl.OPEN) {
      throw new Error("WebSocket not open");
    }
    if (!this.isAuthenticated) {
      throw new Error("Client not authenticated");
    }
    this.ws.send(JSON.stringify(payload));
  }

  ping() {
    if (!this.ws || this.ws.readyState !== WSImpl.OPEN) {
      throw new Error("WebSocket not open");
    }
    this.ws.send(JSON.stringify({ type: "ping" }));
  }

  disconnect(code = 1000, reason = "Client disconnected") {
    if (this.ws && this.ws.readyState === WSImpl.OPEN) {
      this.ws.close(code, reason);
    }
  }
}
