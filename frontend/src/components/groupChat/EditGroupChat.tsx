"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChatSchema,
  createChatSchemaType,
} from "@/validations/groupChatValidation";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import axios, { AxiosError } from "axios";
import { CHAT_GROUP_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";
import { clearCache } from "@/actions/common";

export default function EditGroupChat({
  user,
  group,
  open,
  setOpen,
}: {
  user: CustomUser;
  group: GroupChatType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<createChatSchemaType>({
    resolver: zodResolver(createChatSchema),
  });

  useEffect(() => {
    setValue("title", group.title);
    setValue("passcode", group.passcode);
  }, [group]);

  const onSubmit = async (payload: createChatSchemaType) => {
    // console.log("The payload is", payload);
    try {
      setLoading(true);
      const { data } = await axios.put(`${CHAT_GROUP_URL}/${group.id}`, payload, {
        headers: {
          Authorization: user.token,
        },
      });

      if (data?.message) {
        setOpen(false);
        toast.success(data?.message);
        clearCache("dashboard");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.please try again!");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#18181B] border border-[#27272A] text-white sm:max-w-md rounded-xl p-6" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight text-white">Update Group Chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Room Title
            </label>
            <Input
              placeholder="Enter chat title"
              className="bg-[#030303] border-[#27272A] text-white placeholder:text-[#A1A1AA]/60 focus:ring-[#34D399] rounded-lg px-3 py-2 text-sm"
              {...register("title")}
            />
            {errors.title?.message && (
              <span className="text-xs text-red-400 mt-1 block font-mono">{errors.title.message}</span>
            )}
          </div>
          <div>
            <label className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Passcode
            </label>
            <Input
              placeholder="Enter passcode"
              className="bg-[#030303] border-[#27272A] text-white placeholder:text-[#A1A1AA]/60 focus:ring-[#34D399] rounded-lg px-3 py-2 text-sm font-mono"
              {...register("passcode")}
            />
            {errors.passcode?.message && (
              <span className="text-xs text-red-400 mt-1 block font-mono">{errors.passcode.message}</span>
            )}
          </div>
          <div className="pt-2">
            <Button
              className="w-full bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium py-2.5 rounded-lg transition-all shadow-sm shadow-[#34D399]/20"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}