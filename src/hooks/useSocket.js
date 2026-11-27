
import { useEffect, useRef } from 'react';
import { getSocket } from '../services/socketService';

export const useSocket = (event, callback, deps = []) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!event) return undefined;

    const socket = getSocket();

    if (!socket) {
      console.warn(
        `[useSocket] Socket is not initialized. Cannot listen for "${event}".`
      );
      return undefined;
    }

    const handler = (...args) => {
      callbackRef.current?.(...args);
    };

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
    
  }, [event, ...deps]);
};