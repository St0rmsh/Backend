import jwt from "jsonwebtoken";
import config from "../config/config.js";
import type { ExtendedError } from "socket.io";

export const socketAuth = (socket: any,next: (err?: ExtendedError) => void) => {

    try {

        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const decoded = jwt.verify(
            token,
            config.ACCESS_TOKEN
        ) as {
            _id: string;
        };

        socket.data.userId = decoded._id;

        next();

    } catch {

        next(new Error("Unauthorized"));

    }

};