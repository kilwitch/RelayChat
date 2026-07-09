import ChatBase from "@/components/chat/ChatBase";
import { fetchChats } from "@/fetch/chatsFetch";
import { fetchChatGroup, fetchChatUsers } from "@/fetch/groupFetch";
import { notFound } from "next/navigation";
import React from "react";

// Next.js 15+ — params is a Promise and must be awaited
export default async function chat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Validate UUID length before hitting the API
  if (id.length !== 36) {
    return notFound();
  }

  const group: GroupChatType | null = await fetchChatGroup(id);
  if (group === null) {
    return notFound();
  }

  // Fetch users independently — fall back to empty array on error
  let users: Array<GroupChatUserType> = [];
  try {
    users = await fetchChatUsers(id);
  } catch {
    // Non-fatal: page still renders without the user list
    console.error("[chat page] fetchChatUsers failed — rendering without users");
  }

  const chats:Array<MessageType>|[]= await fetchChats();
  return (
    <div>
      <ChatBase group={group} users={users} oldMessages={chats}/>
    </div>
  );
}
