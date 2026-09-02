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

class SocketIOService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Initialize Socket.io connection to backend
   * Should be called once when app starts
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      const socketURL =
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_BACKEND_URL || window.location.origin
          : 'http://localhost:3001';

      this.socket = io(socketURL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('[Socket.io] Connected to backend');
        this.reconnectAttempts = 0;
        this.emit('connected', undefined);
        resolve();
      });

      this.socket.on('welcome', (data) => {
        console.log('[Socket.io] Welcome message:', data);
        this.emit('welcome', data);
      });

      this.socket.on('sensor:update', (data) => {
        console.log('[Socket.io] Sensor update:', data);
        this.emit('sensor:update', data);
      });

      this.socket.on('actuator:update', (data) => {
        console.log('[Socket.io] Actuator update:', data);
        this.emit('actuator:update', data);
      });

      this.socket.on('production:update', (data) => {
        console.log('[Socket.io] Production update:', data);
        this.emit('production:update', data);
      });

      this.socket.on('disconnect', () => {
        console.log('[Socket.io] Disconnected from backend');
        this.emit('disconnected', undefined);
      });

      this.socket.on('connect_error', (error) => {
        console.error('[Socket.io] Connection error:', error);
        this.reconnectAttempts++;
        reject(error);
      });

      this.socket.on('error', (error) => {
        console.error('[Socket.io] Error:', error);
      });
    });
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
      console.log('[Socket.io] Disconnected');
    }
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
  actuator: 'lamp' | 'fan';
  state: boolean | string;
  timestamp: string;
};

export type ProductionUpdate = {
  eggsCount: number;
  color: string;
  updatedAt: string;
};
