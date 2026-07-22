"use client";
import React, { useState, useEffect, useMemo } from "react";
import ChatNav from "./ChatNav";
import ChatUserDialog from "./ChatUserDialog";
import ChatSidebar from "./ChatSidebar";
import Chats from "./Chats";
import { getSocket } from "@/lib/socket.config";

export default function ChatBase({
  group,
  users,
  oldMessages,
}: {
  group: GroupChatType;
  users: Array<GroupChatUserType> | [];
  oldMessages: Array<MessageType> | [];
}) {
  const [open, setOpen] = useState(true);
  const [chatUser, setChatUser] = useState<GroupChatUserType>();

  
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const data = localStorage.getItem(group.id);
    if (data) {
      const pData = JSON.parse(data);
      setChatUser(pData);
    }
  }, [group.id]);

 
  const socket = useMemo(() => {
    const s = getSocket();
    s.auth = { room: group.id };
    return s.connect();
  }, [group.id]);

  useEffect(() => {
    
    socket.on("onlineUsersSnapshot", ({ names }: { names: string[] }) => {
      setOnlineUsers(new Set(names));
    });

    socket.on("userOnline", (data: { name: string }) => {
      setOnlineUsers((prev) => new Set([...prev, data.name]));
    });

    socket.on("userOffline", (data: { name: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(data.name);
        return next;
      });
    });

    return () => {
      socket.off("onlineUsersSnapshot");
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [socket]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#030303]">
      <ChatSidebar users={users} onlineUsers={onlineUsers} />
      <div className="w-full md:flex-1 bg-[#030303] flex flex-col h-screen overflow-hidden">
        {open ? (
          <ChatUserDialog open={open} setOpen={setOpen} group={group} />
        ) : (
          <ChatNav chatGroup={group} users={users} user={chatUser} onlineUsers={onlineUsers} />
        )}

        {/* Messages */}
        <Chats
          oldMessages={oldMessages}
          group={group}
          chatUser={chatUser}
          onlineUsers={onlineUsers}
          setOnlineUsers={setOnlineUsers}
        />
      </div>
    </div>
  );
}