"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { CHAT_GROUP_USERS_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";

export default function ChatUserDialog({
  open,
  setOpen,
  group,
  setChatUser,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: GroupChatType;
  setChatUser:Dispatch<SetStateAction<GroupChatUserType | undefined>> ;
}) {
  const params = useParams();
  const router= useRouter();

  const [state, setState] = useState({
    name: "",
    passcode: "",
  });

  useEffect(() => {
    const data = localStorage.getItem(params["id"] as string);
    if (data) {
      const jsonData = JSON.parse(data);
      if (jsonData?.name && jsonData?.group_id) {
        setChatUser(jsonData);
        setOpen(false);
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (group.passcode !== state.passcode) {
      toast.error("Please enter correct passcode!");
      return;
    }

    let userObj: GroupChatUserType | null = null;
    const localData = localStorage.getItem(params["id"] as string);

    if (localData) {
      userObj = JSON.parse(localData);
    } else {
      try {
        const { data } = await axios.post(CHAT_GROUP_USERS_URL, {
          name: state.name,
          group_id: params["id"] as string,
        });
        userObj = data?.data;
        if (userObj) {
          localStorage.setItem(
            params["id"] as string,
            JSON.stringify(userObj)
          );
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again!");
        return;
      }
    }

    if (userObj) {
      setChatUser(userObj);
    }
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-[#18181B] border border-[#27272A] text-white sm:max-w-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight text-white">Join Chat Room</DialogTitle>
          <DialogDescription className="text-[#A1A1AA] text-sm leading-[1.6]">
            Enter your display name and room passcode to enter the conversation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Your Display Name
            </label>
            <Input
              placeholder="e.g. Alex"
              value={state.name}
              className="bg-[#030303] border-[#27272A] text-white placeholder:text-[#A1A1AA]/60 focus:ring-[#34D399] rounded-lg px-3 py-2 text-sm"
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Room Passcode
            </label>
            <Input
              placeholder="Enter passcode"
              value={state.passcode}
              className="bg-[#030303] border-[#27272A] text-white placeholder:text-[#A1A1AA]/60 focus:ring-[#34D399] rounded-lg px-3 py-2 text-sm font-mono"
              onChange={(e) => setState({ ...state, passcode: e.target.value })}
            />
          </div>
          <div className="pt-2">
            <Button className="w-full bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium py-2.5 rounded-lg transition-all shadow-sm shadow-[#34D399]/20">
              Enter Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}