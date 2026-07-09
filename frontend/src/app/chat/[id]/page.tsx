import ChatBase from "@/components/chat/ChatBase";
import { fetchChats } from "@/fetch/chatsFetch";
import { fetchChatGroup, fetchChatUsers } from "@/fetch/groupFetch";
import { notFound } from "next/navigation";
import React from "react";


export default async function chat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

 
  if (id.length !== 36) {
    return notFound();
  }

  const group: GroupChatType | null = await fetchChatGroup(id);
  if (group === null) {
    return notFound();
  }

 
  let users: Array<GroupChatUserType> = [];
  try {
    users = await fetchChatUsers(id);
  } catch {
    
    console.error("[chat page] fetchChatUsers failed — rendering without users");
  }


  let chats: Array<MessageType> = [];
  try {
    chats = await fetchChats(id);
  } catch {
    console.error("[chat page] fetchChats failed — rendering without chat history");
  }
  return (
    <div>
      <ChatBase group={group} users={users} oldMessages={chats}/>
    </div>
  );
}
