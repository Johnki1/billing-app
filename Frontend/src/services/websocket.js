import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = `${import.meta.env.VITE_API_URL}/ws`;

let client = null;

const connect = (onNotification, onDashboardUpdate) => {
  const token = localStorage.getItem('jwtToken');

  console.log('[WebSocket] 🔐 Usando token JWT:', token);

  client = new Client({
    webSocketFactory: () => {
      console.log('[WebSocket] 🧪 Creando conexión SockJS a', SOCKET_URL);
      return new SockJS(SOCKET_URL);
    },
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => console.log('[WebSocket DEBUG]', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    onConnect: (frame) => {
      console.log('✅ Conectado al WebSocket vía SockJS. Frame:', frame);

      client.subscribe('/topic/notificaciones', (message) => {
        console.log('[WebSocket] 📩 Notificación recibida:', message.body);
        onNotification(JSON.parse(message.body));
      });

      client.subscribe('/topic/dashboard', (message) => {
        console.log('[WebSocket] 📊 Actualización dashboard recibida:', message.body);
        onDashboardUpdate(JSON.parse(message.body));
      });
    },

    onStompError: (frame) => {
      console.error('❌ STOMP Error:', frame.headers['message'], frame.body);
    },

    onWebSocketError: (error) => {
      console.error('🚫 WebSocket Error:', error);
    },

    onDisconnect: () => {
      console.log('[WebSocket] 🔌 Desconectado del servidor');
    }
  });

  client.activate();
};

const disconnect = () => {
  if (client && client.active) {
    console.log('[WebSocket] 📴 Cerrando conexión...');
    client.deactivate();
  }
};

export default {
  connect,
  disconnect
};
