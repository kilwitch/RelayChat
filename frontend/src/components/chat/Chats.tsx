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
    
    if (connectedRef.current) return;

    const socket = getSocket();

    

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
              {msg.message && <p>{msg.message}</p>}
              {(msg.fileUrl || msg.file) && (
                <FileMessage
                  fileUrl={(msg.fileUrl || msg.file)!}
                  fileType={msg.fileType ?? "application/octet-stream"}
                  fileName={msg.fileName}  // show real filename on the download link
                />
              )}
            </div>
          ))}
        </div>
      </div>

      
      {typingUsers.length > 0 && (
        <div className="px-4 py-1 text-sm text-gray-500 italic animate-pulse">
          {typingUsers.length === 1
            ? `${typingUsers[0]} is typing...`
            : typingUsers.length === 2
            ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
            : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`}
        </div>
      )}

      
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
        {/* File preview strip */}
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg text-sm">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <span>📎</span>
            )}
            <span className="truncate flex-1">{selectedFile.name}</span>
            <button
              type="button"
              onClick={clearFile}
              className="text-red-500 font-bold"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          
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
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            title="Attach file"
            aria-label="Attach file"
          >
            📎
          </button>

          
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
          />

         
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            {uploading ? "Uploading…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}