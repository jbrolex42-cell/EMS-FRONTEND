import { useEffect } from 'react';
import { getSocket } from '../services/socketService';

export const useSocket = (event, callback, deps = []) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !event) return;
    socket.on(event, callback);
    return () => socket.off(event, callback);
  }, deps);
};
