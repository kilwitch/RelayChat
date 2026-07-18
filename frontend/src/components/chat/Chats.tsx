import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket.config";
import { v4 as uuidv4 } from "uuid";

export default function Chats({
  group,
  oldMessages,
  chatUser,
  onlineUsers,
  setOnlineUsers,
}: {
  group: GroupChatType;
  oldMessages: Array<MessageType> | [];
  chatUser?: GroupChatUserType;
  onlineUsers: Set<string>;
  setOnlineUsers: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessageType>>(oldMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Track whether we have already connected for this chatUser+room pair
  const connectedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Don't connect until we know the real user name
    if (!chatUser?.name) return;
    // Don't reconnect if already connected for this session
    if (connectedRef.current) return;

    const socket = getSocket();

    // --- Register ALL listeners BEFORE connecting ---
    // so we never miss an event fired immediately on connection.

    socket.on("message", (data: MessageType) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    // Snapshot of who is already online when we first join
    socket.on("onlineUsersSnapshot", ({ names }: { names: string[] }) => {
      setOnlineUsers(new Set(names));
    });

    // Someone else came online after we joined
    socket.on("userOnline", ({ name }: { name: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(name));
    });

    // Someone went offline
    socket.on("userOffline", ({ name }: { name: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    });

    // NOW connect — after all listeners are in place
    socket.auth = {
      room: group.id,
      userName: chatUser.name,
    };
    socket.connect();
    connectedRef.current = true;

    return () => {
      socket.off("message");
      socket.off("onlineUsersSnapshot");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.disconnect();
      connectedRef.current = false;
    };
  }, [chatUser?.name, group.id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const socket = getSocket();
    const payload: MessageType = {
      id: uuidv4(),
      message: message,
      name: chatUser?.name ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
    };
    socket.emit("message", payload);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[94vh] p-4">
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        <div className="flex flex-col gap-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-sm rounded-lg p-2 ${
                msg.name === chatUser?.name
                  ? "bg-linear-to-r from-blue-400 to-blue-600 text-white self-end"
                  : "bg-linear-to-r from-gray-200 to-gray-300 text-black self-start"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}