import { Socket, Server } from "socket.io";

export interface CustomSocket extends Socket {
    room?: string;
}

export function setupSocket(io: Server) {

    // Scope middleware to the default namespace only.
    // Using io.use() would also intercept @socket.io/admin-ui connections
    // which don't send a room — causing them to be rejected.
    io.of("/").use((socket: CustomSocket, next) => {
        const room = socket.handshake.auth.room|| socket.handshake.headers.room;
        if (!room) {
            return next(new Error("invalid room"));
        }
        socket.room = room;
        next();
    });

    io.on("connection", (socket: CustomSocket) => {
        console.log(`Socket connected: ${socket.id}, room: ${socket.room}`);

        // Join the room supplied during handshake auth
        if (socket.room) {
            socket.join(socket.room);
        }

        socket.on("message", (data) => {
            console.log("server side message", data);

            if (socket.room) {
                // Enrich payload with server timestamp before broadcasting
                // so consumers get a complete MessageType-compatible object.
                const enriched = {
                    data,
                    created_at: new Date().toISOString(),
                };
                io.to(socket.room).emit("message", enriched);
            }
        });

        socket.on("disconnect", () => {
            console.log("a user disconnected", socket.id);
        });
    });
}