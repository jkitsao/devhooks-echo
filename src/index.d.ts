import { EventEmitter } from "events";

export interface SyncClientOptions {
  sourceId: string;
  secret?: string;
  url?: string;
}

export interface ServerMessage {
  type: string;
  data?: any;
  error?: string;
  code?: number;
}

export declare class SyncClient extends EventEmitter {
  sourceId: string;
  secret?: string;
  url: URL;
  connected: boolean;
  isAuthenticated: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;

  constructor(options: SyncClientOptions);

  connect(): void;
  send(payload: any): void;
  ping(): void;
  disconnect(code?: number, reason?: string): void;

  // Events
  on(event: "open", listener: () => void): this;
  on(event: "authenticated", listener: () => void): this;
  on(event: "event", listener: (data: any) => void): this;
  on(event: "replay", listener: (data: any) => void): this;
  on(event: "cleared", listener: (msg: ServerMessage) => void): this;
  on(event: "destroyed", listener: (msg: ServerMessage) => void): this;
  on(event: "server_message", listener: (msg: ServerMessage) => void): this;
  on(event: "server_error", listener: (error: string, code?: number) => void): this;
  on(event: "message", listener: (msg: ServerMessage) => void): this;
  on(event: "close", listener: (code: number, reason?: string) => void): this;
  on(event: "reconnect_failed", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
}
