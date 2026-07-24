import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import GroupChatCardMenu from "./GroupChatCardMenu";

export default function GroupChatCard({
  group,
  user,
}: {
  group: GroupChatType;
  user: CustomUser;
}) {
  return (
    <Card className="relative group bg-[#18181B] border border-[#27272A] rounded-lg transition-all duration-200 hover:border-[#34D399]/40 hover:shadow-lg hover:shadow-[#34D399]/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pt-6 pb-2 px-6 space-y-0">
        <CardTitle className="text-xl font-medium tracking-tight text-white truncate pr-4">
          {group.title}
        </CardTitle>
        <GroupChatCardMenu user={user} group={group} />
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#A1A1AA]">Passcode</span>
          <span className="font-mono bg-[#34D399]/10 text-[#34D399] px-2 py-0.5 rounded border border-[#34D399]/20 font-semibold tracking-wider">
            {group.passcode}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#A1A1AA] pt-2 border-t border-[#27272A]">
          <span>Created</span>
          <span className="font-mono text-[#A1A1AA]">
            {new Date(group.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}