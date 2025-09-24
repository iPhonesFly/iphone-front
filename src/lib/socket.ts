import { io, Socket } from "socket.io-client";

// Instância única do socket para toda a aplicação
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('https://iphone-api-production.up.railway.app/', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default getSocket;