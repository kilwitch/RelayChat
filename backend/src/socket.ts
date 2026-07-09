import { Socket, Server } from "socket.io";
import prisma from "./config/db.config.js";

export interface CustomSocket extends Socket {
    room?: string;
}

export function setupSocket(io: Server) {
    
    const nsp = io.of("/");

    nsp.use((socket: CustomSocket, next) => {
        const rawRoom =
            socket.handshake.auth?.room ??
            socket.handshake.headers?.room;

        if (!rawRoom) {
            return next(new Error("invalid room: no room provided in auth or headers"));
        }

        // headers.room can be string | string[] — always coerce to string
        socket.room = Array.isArray(rawRoom) ? rawRoom[0] : rawRoom;
        next();
    });

    nsp.on("connection", (socket: CustomSocket) => {
        // console.log(`Socket connected: ${socket.id}, room: ${socket.room}`);

        if (socket.room) {
            socket.join(socket.room);
        }

        socket.on("message", async(data) => {
            
            if (socket.room) {
                
                await prisma.chats.create({
                    data:data
                });
                io.to(socket.room).emit("message", data);
            }
        });

        socket.on("disconnect", () => {
            console.log("a user disconnected", socket.id);
            
            if (socket.room) {
                socket.to(socket.room).emit("userLeft", { id: socket.id });
            }
        });
    });
}