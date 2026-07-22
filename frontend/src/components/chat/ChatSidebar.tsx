import React from "react";

export default function ChatSidebar({
  users,
  onlineUsers,
}: {
  users: Array<GroupChatUserType> | [];
  onlineUsers: Set<string>;
}) {
  return (
    <aside className="hidden md:flex flex-col h-screen w-1/5 min-w-[240px] bg-[#18181B] border-r border-[#27272A] p-4 text-white">
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#27272A]">
        <h2 className="text-xs font-mono text-[#34D399] tracking-wider uppercase">
          Active Members ({users.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {users.length > 0 ? (
          users.map((item, index) => {
            const isOnline = onlineUsers.has(item.name);
            return (
              <div
                key={index}
                className="bg-[#030303] border border-[#27272A] rounded-lg p-3 transition-colors hover:border-[#34D399]/40"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    title={isOnline ? "Online" : "Offline"}
                    className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                      isOnline
                        ? "bg-[#34D399] shadow-sm shadow-[#34D399]/50 animate-pulse"
                        : "bg-[#27272A]"
                    }`}
                  />
                  <p className="font-medium text-sm text-white truncate">{item.name}</p>
                </div>
                <p className="text-[11px] font-mono text-[#A1A1AA] mt-1 pl-4">
                  Joined {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-[#A1A1AA] italic pt-2">No members registered yet.</p>
        )}
      </div>
    </aside>
  );
}