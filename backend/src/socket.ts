import { Socket, Server } from "socket.io";
import { produceMessage } from "./helper.js";

export interface CustomSocket extends Socket {
    room?: string;
    userName?: string;
}


const roomOnlineUsers = new Map<string, Set<string>>();

export function setupSocket(io: Server) {
    
    const nsp = io.of("/");

    nsp.use((socket: CustomSocket, next) => {
        const rawRoom =
            socket.handshake.auth?.room ??
            socket.handshake.headers?.room;

        if (!rawRoom) {
            return next(new Error("invalid room: no room provided in auth or headers"));
        }

        
        socket.room = Array.isArray(rawRoom) ? rawRoom[0] : rawRoom;

        
        const rawName = socket.handshake.auth?.userName;
        socket.userName =
            typeof rawName === "string" && rawName.trim() !== "" && rawName !== "Unknown"
                ? rawName.trim()
                : undefined;

        next();
    });

    nsp.on("connection", (socket: CustomSocket) => {

        if (socket.room) {
            socket.join(socket.room);

            if (socket.userName) {
                
                if (!roomOnlineUsers.has(socket.room)) {
                    roomOnlineUsers.set(socket.room, new Set());
                }
                roomOnlineUsers.get(socket.room)!.add(socket.userName);

                
                const currentNames = Array.from(roomOnlineUsers.get(socket.room)!);
                socket.emit("onlineUsersSnapshot", { names: currentNames });

                
                socket.to(socket.room).emit("userOnline", { name: socket.userName });
            }
        }

        socket.on("message", async (data) => {
            if (socket.room) {
                await produceMessage(process.env.KAFKA_TOPIC!, data);
                io.to(socket.room).emit("message", data);
            }
        });

        // typing indicator events
        socket.on("typing", (data: { name: string }) => {
            if (socket.room) {
                socket.to(socket.room).emit("typing", data);
            }
        });

        socket.on("stopTyping", (data: { name: string }) => {
            if (socket.room) {
                socket.to(socket.room).emit("stopTyping", data);
            }
        });

        socket.on("disconnect", () => {
            console.log("a user disconnected", socket.id, socket.userName);
            
            if (socket.room && socket.userName) {
                // Remove from the room's online set
                roomOnlineUsers.get(socket.room)?.delete(socket.userName);

                // Notify room-mates that this user went offline
                socket.to(socket.room).emit("userOffline", { name: socket.userName });
                socket.to(socket.room).emit("userLeft", { id: socket.id });
            }
        });
    });
}
