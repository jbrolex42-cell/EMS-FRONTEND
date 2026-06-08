import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true });
    socket.on('connect', () => console.log('🔌 Socket connected'));
    socket.on('disconnect', () => console.log('🔌 Socket disconnected'));
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export const joinEmergencyRoom = (emergencyId) => {
  if (socket) socket.emit('join_emergency', emergencyId);
};

export const joinEMTRoom = (emtId) => {
  if (socket) socket.emit('join_emt', emtId);
};

export const joinAdminRoom = () => {
  if (socket) socket.emit('join_admin');
};

export const joinUserRoom = (userId) => {
  if (socket) socket.emit('join_user', userId);
};

export const onEmergencyUpdate = (callback) => {
  if (socket) socket.on('status_update', callback);
};

export const onAmbulanceMoved = (callback) => {
  if (socket) socket.on('ambulance_moved', callback);
};

export const onNewEmergency = (callback) => {
  if (socket) socket.on('new_emergency', callback);
};
