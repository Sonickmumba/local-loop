import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';

const socket = io(SOCKET_SERVER_URL, {
  withCredentials: true,
  autoConnect: true, // VERY IMPORTANT
});

export default socket;
