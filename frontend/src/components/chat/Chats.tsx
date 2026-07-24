import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket.config";
import FileMessage from "./FileMessage";
import Env from "@/lib/env";
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
 
  const connectedRef = useRef(false);

  
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
  useEffect(() => {
    
    if (!chatUser?.name) return;
    
    const socket = getSocket();

    if (socket.connected) {
      socket.disconnect();
    }

    socket.on("message", (data: MessageType) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    
    socket.on("onlineUsersSnapshot", ({ names }: { names: string[] }) => {
      setOnlineUsers(new Set(names));
    });

   
    socket.on("userOnline", ({ name }: { name: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(name));
    });

    
    socket.on("userOffline", ({ name }: { name: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    });

    
    socket.on("typing", (data: { name: string }) => {
      setTypingUsers((prev) => {
        if (prev.includes(data.name)) return prev;
        return [...prev, data.name];
      });
    });
    socket.on("stopTyping", (data: { name: string }) => {
      setTypingUsers((prev) => prev.filter((n) => n !== data.name));
    });

    
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
      socket.off("typing");
      socket.off("stopTyping");
      socket.disconnect();
      connectedRef.current = false;
    };
  }, [chatUser?.name, group.id]);

  // ── Typing helpers 
  const typingTimeOutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const handleTyping = () => {
    const socket = getSocket();
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", { name: chatUser?.name ?? "unknown" });
    }
    if (typingTimeOutRef.current) {
      clearTimeout(typingTimeOutRef.current);
      typingTimeOutRef.current = null;
    }
    typingTimeOutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit("stopTyping", { name: chatUser?.name ?? "unknown" });
    }, 1000);
  };

  // ── File picker 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message && !selectedFile) return;

    let fileUrl: string | undefined;
    let fileType: string | undefined;
    let fileName: string | undefined;

    if (selectedFile) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile); // must match upload.single("file")

        const res = await fetch(`${Env.BACKEND_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Upload failed:", err.message);
          setUploading(false);
          return;
        }

        const data = await res.json();
        fileUrl = data.url;
        fileType = data.type;
        fileName = data.fileName;  // original filename from backend
      } catch (err) {
        console.error("Upload error:", err);
        setUploading(false);
        return;
      } finally {
        setUploading(false);
        clearFile();
      }
    }

    const socket = getSocket();
    const payload: MessageType = {
      id: uuidv4(),
      message,
      name: chatUser?.name ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
      fileUrl,
      fileType,
      fileName,  // pass original name so download link is meaningful
    };

    socket.emit("message", payload);

    // stop typing on send
    if (typingTimeOutRef.current) {
      clearTimeout(typingTimeOutRef.current);
      typingTimeOutRef.current = null;
    }
    isTypingRef.current = false;
    socket.emit("stopTyping", { name: chatUser?.name ?? "unknown" });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] p-4 sm:p-6 bg-[#030303]">
      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse px-2 space-y-reverse space-y-3">
        <div ref={messagesEndRef} />
        <div className="flex flex-col gap-3">
          {messages.map((msg) => {
            const isSelf = msg.name === chatUser?.name;
            return (
              <div
                key={msg.id}
                className={`max-w-md sm:max-w-lg rounded-xl p-3.5 space-y-1.5 transition-all ${
                  isSelf
                    ? "bg-[#34D399] text-[#030303] self-end shadow-md shadow-[#34D399]/10"
                    : "bg-[#18181B] border border-[#27272A] text-white self-start"
                }`}
              >
                {!isSelf && (
                  <span className="block text-[11px] font-mono font-semibold text-[#60A5FA]">
                    {msg.name}
                  </span>
                )}
                {msg.message && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                )}
                {(msg.fileUrl || msg.file) && (
                  <div className="pt-1">
                    <FileMessage
                      fileUrl={(msg.fileUrl || msg.file)!}
                      fileType={msg.fileType ?? "application/octet-stream"}
                      fileName={msg.fileName}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Typing Users Bar */}
      {typingUsers.length > 0 && (
        <div className="px-3 py-1 text-xs font-mono text-[#34D399] italic animate-pulse">
          {typingUsers.length === 1
            ? `${typingUsers[0]} is typing...`
            : typingUsers.length === 2
            ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
            : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
        {/* File preview strip */}
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-[#18181B] border border-[#27272A] rounded-xl text-xs font-mono text-white">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-10 h-10 object-cover rounded-md border border-[#27272A]"
              />
            ) : (
              <span className="text-[#34D399] text-base">📎</span>
            )}
            <span className="truncate flex-1 text-[#A1A1AA]">{selectedFile.name}</span>
            <button
              type="button"
              onClick={clearFile}
              className="text-[#A1A1AA] hover:text-red-400 font-bold px-2 py-1"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 bg-[#18181B] border border-[#27272A] p-2 rounded-xl focus-within:border-[#34D399]/50 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.mp4,.docx,.xlsx,.zip"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-[#A1A1AA] hover:text-[#34D399] transition-colors rounded-lg hover:bg-[#27272A]"
            title="Attach file"
            aria-label="Attach file"
          >
            📎
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            className="flex-1 bg-transparent text-white placeholder:text-[#A1A1AA]/60 text-sm outline-none px-2"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
          />

          <button
            type="submit"
            disabled={uploading}
            className="px-5 py-2 bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium text-sm rounded-lg disabled:opacity-50 transition-all shadow-sm shadow-[#34D399]/20"
          >
            {uploading ? "Uploading…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}