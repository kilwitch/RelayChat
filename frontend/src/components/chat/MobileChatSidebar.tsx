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
        <button className="p-2 rounded-lg bg-[#18181B] border border-[#27272A] text-white hover:bg-[#27272A] transition-colors focus:outline-none">
          <HamburgerMenuIcon className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#18181B] border-r border-[#27272A] text-white w-72 p-6">
        <SheetHeader>
          <SheetTitle className="text-xs font-mono text-[#34D399] tracking-wider uppercase text-left">
            Active Members ({users.length})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2.5">
          {users.length > 0 ? (
            users.map((item, index) => {
              const isOnline = onlineUsers.has(item.name);
              return (
                <div key={index} className="bg-[#030303] border border-[#27272A] rounded-lg p-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      title={isOnline ? "Online" : "Offline"}
                      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                        isOnline ? "bg-[#34D399] shadow-sm shadow-[#34D399]/50 animate-pulse" : "bg-[#27272A]"
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
            <p className="text-xs text-[#A1A1AA] italic">No members registered yet.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}