import { io } from "socket.io-client";

const SOCKET_URL = "https://api.bookmyevent.ae"; 
// OR http://localhost:5000 for local

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false // important
});
