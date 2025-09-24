import { io, Socket } from "socket.io-client";

// Instância única do socket para toda a aplicação
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('iphone-api-production.up.railway.app', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('✅ Socket conectado:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Erro de conexão Socket:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconectado após', attemptNumber, 'tentativas');
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