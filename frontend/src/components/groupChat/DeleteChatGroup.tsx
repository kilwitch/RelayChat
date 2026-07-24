import React, { Dispatch, SetStateAction, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { CHAT_GROUP_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";
import { clearCache } from "@/actions/common";
import { useRouter } from "next/navigation";

export default function DeleteChatGroup({
  open,
  setOpen,
  groupId,
  token,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  groupId: string;
  token: string;
}) {
  const [loading, setLoading] = useState(false);
  const router=useRouter();

  const deleteChatGroup = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${CHAT_GROUP_URL}/${groupId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (data?.message) {
        await clearCache("dashboard");
        toast.success(data?.message);
        setOpen(false);
        router.refresh();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Somethign went wrong.please try again later.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-[#18181B] border border-[#27272A] text-white sm:max-w-md rounded-xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-medium tracking-tight text-white">
            Delete Chat Room?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#A1A1AA] text-sm leading-[1.6]">
            This action cannot be undone. This will permanently delete your chat room and all associated messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex gap-3">
          <AlertDialogCancel className="bg-[#030303] border-[#27272A] text-[#A1A1AA] hover:bg-[#27272A] hover:text-white rounded-lg">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={deleteChatGroup}
            className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4"
          >
            {loading ? "Deleting..." : "Delete Room"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}