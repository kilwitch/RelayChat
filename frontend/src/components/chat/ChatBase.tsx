"use client";
import React, { useState, useEffect } from "react";
import ChatNav from "./ChatNav";
import ChatUserDialog from "./ChatUserDialog";
import ChatSidebar from "./ChatSidebar";
import Chats from "./Chats";

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



  return (
    <div className="flex h-screen overflow-hidden bg-[#030303]">
      <ChatSidebar users={users} onlineUsers={onlineUsers} />
      <div className="w-full md:flex-1 bg-[#030303] flex flex-col h-screen overflow-hidden">
        {open ? (
          <ChatUserDialog open={open} setOpen={setOpen} group={group}
          setChatUser={setChatUser} />
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