import { useEffect, useRef, useState, useCallback } from 'react';

export function useWebSocket() {
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const messageHandlers = useRef<Map<string, Function>>(new Map());

  const connect = useCallback(() => {
    try {
      // Close any existing connection
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.close();
      }

      // Create a new connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      socket.current = new WebSocket(wsUrl);

      socket.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
      };

      socket.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      socket.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
        setIsConnected(false);
      };

      socket.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // If the message has a type, check if we have a handler for it
          if (data.type && messageHandlers.current.has(data.type)) {
            const handler = messageHandlers.current.get(data.type);
            if (handler) {
              handler(data);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socket.current) {
      socket.current.close();
      socket.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  const registerHandler = useCallback((messageType: string, handler: Function) => {
    messageHandlers.current.set(messageType, handler);
    return () => {
      messageHandlers.current.delete(messageType);
    };
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Reconnect logic
  useEffect(() => {
    let reconnectInterval: ReturnType<typeof setTimeout>;
    
    if (!isConnected && !socket.current) {
      reconnectInterval = setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        connect();
      }, 5000);
    }

    return () => {
      clearTimeout(reconnectInterval);
    };
  }, [isConnected, connect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    sendMessage,
    registerHandler
  };
}