/**
 * Socket.io Client Service
 * 
 * Real-time communication with the backend using WebSockets
 * Handles events for sensor updates, actuator changes, and production changes
 * 
 * Events emitted by backend:
 * - 'welcome': Initial connection confirmation
 * - 'sensor:update': New sensor reading available
 * - 'actuator:update': Actuator state changed (lamp/fan)
 * - 'production:update': Egg count updated
 */

import io, { Socket } from 'socket.io-client';
import { getAuthToken } from './api';

class SocketIOService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private connectionPromise: Promise<void> | null = null;
  private maxReconnectAttempts = 5;

  /**
   * Initialize Socket.io connection to backend
   * Should be called once when app starts
   */
  connect(): Promise<void> {
    if (this.socket?.connected) return Promise.resolve();
    if (this.connectionPromise) return this.connectionPromise;

    const socketURL = (
      import.meta.env.VITE_BACKEND_URL ||
      (import.meta.env.DEV ? "http://localhost:3001" : window.location.origin)
    ).replace(/\/+$/, "");

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      const socket = io(socketURL, {
        auth: { token: getAuthToken() },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        transports: ["websocket", "polling"],
      });
      this.socket = socket;

      socket.on("connect", () => {
        console.log("[Socket.io] Connected to backend");
        this.reconnectAttempts = 0;
        this.connectionPromise = null;
        this.emit("connected", undefined);
        resolve();
      });

      socket.on("welcome", (data) => {
        console.log("[Socket.io] Welcome message:", data);
        this.emit("welcome", data);
      });
      socket.on("sensor:update", (data) => this.emit("sensor:update", data));
      socket.on("actuator:update", (data) => this.emit("actuator:update", data));
      socket.on('CRITICAL_OVERHEAT', (data) => this.emit('CRITICAL_OVERHEAT', data));
      socket.on('THERMAL_PROTECTION_CLEARED', (data) => this.emit('THERMAL_PROTECTION_CLEARED', data));
      socket.on("production:update", (data) => this.emit("production:update", data));
      socket.on("device:update", (data) => this.emit("device:update", data));

      socket.on("disconnect", () => {
        console.log("[Socket.io] Disconnected from backend");
        this.emit("disconnected", undefined);
      });

      socket.on("connect_error", (error) => {
        console.error("[Socket.io] Connection error:", error);
        this.reconnectAttempts++;
        if (this.connectionPromise) {
          this.connectionPromise = null;
          reject(error);
        }
      });
      socket.on("error", (error) => console.error("[Socket.io] Error:", error));
    });

    return this.connectionPromise!;
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.connectionPromise = null;
      console.log('[Socket.io] Disconnected');
    }
  }

  /** Refresh the JWT attached to the socket after login or logout. */
  refreshAuthentication(): Promise<void> {
    this.socket?.disconnect();
    this.connectionPromise = null;
    return this.connect();
  }

  /** Send a command and wait for the backend acknowledgement. */
  emitWithAck<T>(event: string, data: unknown): Promise<T> {
    const socket = this.socket;
    if (!socket?.connected) return Promise.reject(new Error("Socket.io is not connected"));
    return new Promise<T>((resolve, reject) => {
      socket.timeout(8000).emit(event, data, (error: Error | null, response: T) => {
        if (error) reject(new Error("O backend não confirmou o comando do cooler."));
        else resolve(response);
      });
    });
  }
  /**
   * Register a callback for a specific event
   * Multiple callbacks can be registered for the same event
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Unregister a callback for a specific event
   */
  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit event to all registered listeners
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[Socket.io] Error in listener for '${event}':`, error);
        }
      });
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketIOService();

// Export type definitions for events
export type SensorUpdate = {
  temperature: number;
  humidity: number;
  eggs?: number;
  fertilizer?: number;
  createdAt: string;
};

export type ActuatorUpdate = {
  actuator: 'lamp' | 'fan' | 'cooler' | 'motor_mode' | 'motor';
  state: boolean | string;
  timestamp: string;
};

export type ProductionUpdate = {
  eggsCount: number;
  color: string;
  updatedAt: string;
};
