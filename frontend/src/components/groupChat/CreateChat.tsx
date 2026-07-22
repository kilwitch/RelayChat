"use client"

import React, { useState } from 'react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { createChatSchema, createChatSchemaType } from '@/validations/groupChatValidation'
import { Input } from '../ui/input'
import { CustomUser } from '@/app/api/auth/[...nextauth]/options'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { CHAT_GROUP_URL } from '@/lib/apiEndPoints'
import { clearCache } from '@/actions/common'


export default function CreateChat({user}:{user:CustomUser}) {
    const [open, setOpen]= useState(false)
    const [loading, setLoading]=useState(false);
    const router = useRouter()

    const {
      register,
      handleSubmit,
      reset,
      formState:{errors },
    }= useForm<createChatSchemaType>({
      resolver:zodResolver(createChatSchema),
    })

    const onSubmit= async(payload:createChatSchemaType)=>{
      try {
        setLoading(true)
        const {data}= await axios.post(CHAT_GROUP_URL, payload, {
          headers: {
            Authorization: user.token
          }
        })

        if(data?.message){
          clearCache("dashboard");
          setLoading(false)
          setOpen(false)
          reset()
          toast.success(data?.message)
          router.refresh()
        }

      } catch (error) {
        setLoading(false)
        if(error instanceof AxiosError){
          // Show the actual backend error message, not the generic Axios one
          const backendMsg = error.response?.data?.message
          toast.error(backendMsg ?? error.message)
        }else{
          toast.error("Something went wrong. Please try again!")
        }
      }
      
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium px-4 py-2 rounded-lg transition-all shadow-sm shadow-[#34D399]/20 flex items-center gap-2">
          <span>+ Create Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#18181B] border border-[#27272A] text-white sm:max-w-md rounded-xl p-6" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight text-white">Create New Chat Room</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Room Title
            </label>
            <Input
              placeholder="e.g. Design Sync Room"
              className="bg-[#030303] border-[#27272A] text-white placeholder:text-[#A1A1AA]/60 focus:ring-[#34D399] rounded-lg px-3 py-2 text-sm"
              {...register("title")}
            />
            {errors?.title?.message && (
              <span className="text-xs text-red-400 mt-1 block font-mono">{errors.title.message}</span>
            )}
          </div>

          <div>
            <label className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Passcode
            </label>
            <Input
              placeholder="e.g. 123456"
              className="bg-[#030303] border-[#27272A] text-white placeholder:text-[#A1A1AA]/60 focus:ring-[#34D399] rounded-lg px-3 py-2 text-sm font-mono"
              {...register("passcode")}
            />
            {errors?.passcode?.message && (
              <span className="text-xs text-red-400 mt-1 block font-mono">{errors.passcode.message}</span>
            )}
          </div>

          <div className="pt-2">
            <Button
              className="w-full bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium py-2.5 rounded-lg transition-all shadow-sm shadow-[#34D399]/20"
              disabled={loading}
            >
              {loading ? "Creating Room..." : "Create Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
