import React from "react";
import MobileChatSidebar from "./MobileChatSidebar";

export default function ChatNav({
  chatGroup,
  users,
  user,
  onlineUsers,
}: {
  chatGroup: GroupChatType;
  users: Array<GroupChatUserType> | [];
  user?: GroupChatUserType;
  onlineUsers: Set<string>;
}) {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 border-b border-[#27272A] bg-[#18181B]">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <MobileChatSidebar users={users} onlineUsers={onlineUsers} />
        </div>

        <div>
          <h1 className="text-xl font-medium tracking-tight bg-gradient-to-r from-[#34D399] via-[#60A5FA] to-white text-transparent bg-clip-text">
            {chatGroup.title}
          </h1>
          <span className="text-xs font-mono text-[#A1A1AA]">ID: {chatGroup.id.slice(0, 8)}...</span>
        </div>
      </div>

      {user?.name && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#030303] border border-[#27272A]">
          <span className="w-2 h-2 rounded-full bg-[#34D399]" />
          <span className="text-xs font-mono text-[#A1A1AA] font-medium">{user.name}</span>
        </div>
      )}
    </nav>
  );
}