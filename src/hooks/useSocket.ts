/**
 * useSocket - React Hook for Socket.io Integration
 * 
 * Provides easy access to Socket.io events in React components
 * Automatically connects on mount and disconnects on unmount
 * 
 * Usage:
 * const { isConnected, data } = useSocket('sensor:update');
 */

import { useEffect, useState, useCallback } from 'react';
import { socketService } from '../services/socketio';

export interface UseSocketOptions {
  autoConnect?: boolean;
}

/**
 * Hook to listen to a specific Socket.io event
 */
export function useSocket<T = any>(
  event: string,
  options: UseSocketOptions = {}
) {
  const { autoConnect = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!autoConnect) return;

    const connectSocket = async () => {
      try {
        if (!socketService.isConnected()) {
          await socketService.connect();
        }
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsConnected(false);
      }
    };

    connectSocket();

    // Listen for specific event
    const handleEvent = (eventData: T) => {
      setData(eventData);
    };

    socketService.on(event, handleEvent);

    // Listen for connection state changes
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);

    socketService.on('connected', handleConnected);
    socketService.on('disconnected', handleDisconnected);

    // Cleanup
    return () => {
      socketService.off(event, handleEvent);
      socketService.off('connected', handleConnected);
      socketService.off('disconnected', handleDisconnected);
    };
  }, [event, autoConnect]);

  return { data, isConnected, error };
}

/**
 * Hook to connect/disconnect socket on demand
 */
export function useSocketConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    try {
      if (!socketService.isConnected()) {
        await socketService.connect();
      }
      setIsConnected(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
  }, []);

  return { isConnected, error, connect, disconnect };
}

/**
 * Hook to emit Socket.io events
 */
export function useSocketEmit() {
  const emit = useCallback((event: string, data?: any) => {
    const socket = socketService.getSocket();
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn(`[useSocketEmit] Socket not connected, cannot emit '${event}'`);
    }
  }, []);

  return { emit };
}
