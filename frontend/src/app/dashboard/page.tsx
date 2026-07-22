
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchChatGroups } from "@/fetch/groupFetch";
import GroupChatCard from "@/components/groupChat/GroupChatCard";
import CreateChat from "@/components/groupChat/CreateChat";
import DashNav from "@/components/groupChat/DashNav";

export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const groups: Array<GroupChatType> | [] = await fetchChatGroups(
    session?.user?.token!
  );
  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col">
      <DashNav
        name={session?.user?.name!}
        image={session?.user?.image ?? undefined}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-[#27272A]">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-white">Your Chat Rooms</h1>
            <p className="text-sm text-[#A1A1AA] mt-1">
              Create and manage secure rooms for team collaboration and instant discussions.
            </p>
          </div>
          <CreateChat user={session?.user!} />
        </div>

        {/* Empty state */}
        {groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-xl border border-dashed border-[#27272A] bg-[#18181B]/40">
            <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center text-xl mb-4">
              💬
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No Chat Rooms Yet</h3>
            <p className="text-sm text-[#A1A1AA] max-w-md mb-6">
              Create your first instant chat room to generate a passcode-protected shareable link.
            </p>
            <CreateChat user={session?.user!} />
          </div>
        )}

        {/* Grid of Groups */}
        {groups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((item, index) => (
              <GroupChatCard group={item} key={index} user={session?.user!} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}