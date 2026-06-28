import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/App/config/env";

class SocketService {
  private socket: Socket | null = null;
  private connectionCallbacks: ((isConnected: boolean) => void)[] = [];
  private customListeners = new Set<string>();

  connect(accessToken: string) {

    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token:accessToken },
      autoConnect: true,
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on("connect", () => this.notifyConnectionChange(true));
    this.socket.on("disconnect", () => this.notifyConnectionChange(false));
    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      this.notifyConnectionChange(false);
    });
  }

  disconnect() {
    this.removeAllCustomListeners();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback); 
    this.socket.on(event, callback);
    this.customListeners.add(event);
  }

  off(event: string, callback?: (...args: unknown[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  emit(event: string, data: unknown) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  removeAllCustomListeners() {
    if (!this.socket) return;
    this.customListeners.forEach(event => {
      this.socket?.removeAllListeners(event);
    });
    this.customListeners.clear();
  }

  onConnectionChange(callback: (isConnected: boolean) => void) {
    this.connectionCallbacks.push(callback);
    if (this.socket) {
      callback(this.socket.connected);
    }
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyConnectionChange(isConnected: boolean) {
    this.connectionCallbacks.forEach(cb => cb(isConnected));
  }
}

export const socketService = new SocketService();
