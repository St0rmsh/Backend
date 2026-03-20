import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = () => {
    if (socketInstance) {
        return socketInstance;
    }

    socketInstance = io("http://localhost:3000", {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
        console.log("✓ Connected to Socket.io server");
    });

    socketInstance.on("disconnect", () => {
        console.log("✗ Disconnected from Socket.io server");
    });

    socketInstance.on("error", (error) => {
        console.error("Socket.io error:", error);
    });

    return socketInstance;
};

export const getSocket = () => {
    return socketInstance;
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};

export const sendMessage = (message) => {
    if (socketInstance && socketInstance.connected) {
        socketInstance.emit("send_message", message);
    } else {
        console.warn("Socket not connected");
    }
};
