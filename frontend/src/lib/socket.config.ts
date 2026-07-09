import { io, Socket } from "socket.io-client";
import Env from "./env";

let socket: Socket | null = null;

/**
 * Returns a singleton socket instance.
 * Call socket.auth = { room } and socket.connect() at the use-site
 * (see ChatBase.tsx). The singleton is destroyed when the caller
 * calls socket.disconnect() — the next getSocket() call will rebuild it.
 */
export const getSocket = (): Socket => {
    if (!socket || socket.disconnected) {
        socket = io(Env.BACKEND_URL, { autoConnect: false });
    }
    return socket;
};