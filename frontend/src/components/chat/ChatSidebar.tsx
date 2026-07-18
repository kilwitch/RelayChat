import React from "react";

export default function ChatSidebar({
  users,
  onlineUsers,
}: {
  users: Array<GroupChatUserType> | [];
  onlineUsers: Set<string>;
}) {
  return (
    <div className="hidden md:block h-screen overflow-y-scroll w-1/5 bg-muted px-2">
      <h1 className="text-2xl font-extrabold py-4">Users</h1>
      {users.length > 0 &&
        users.map((item, index) => {
          const isOnline = onlineUsers.has(item.name);
          return (
            <div key={index} className="bg-white rounded-md p-2 mt-2">
              <div className="flex items-center gap-2">
                {/* Online/offline presence dot */}
                <span
                  title={isOnline ? "Online" : "Offline"}
                  className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p className="font-bold truncate">{item.name}</p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 pl-4">
                Joined: <span>{new Date(item.created_at).toDateString()}</span>
              </p>
            </div>
          );
        })}
    </div>
  );
}