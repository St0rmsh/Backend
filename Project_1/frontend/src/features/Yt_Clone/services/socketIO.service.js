import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true
    });
  }
  return socket;
};
