"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function MobileChatSidebar({
  users,
  onlineUsers,
}: {
  users: Array<GroupChatUserType> | [];
  onlineUsers: Set<string>;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="bg-muted">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Users</SheetTitle>
        </SheetHeader>
        <div>
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
                    Joined:{" "}
                    <span>{new Date(item.created_at).toDateString()}</span>
                  </p>
                </div>
              );
            })}
        </div>
      </SheetContent>
    </Sheet>
  );
}