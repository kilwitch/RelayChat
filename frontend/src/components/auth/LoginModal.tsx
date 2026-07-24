"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import Image from 'next/image'
import { signIn } from "next-auth/react"

export default function LoginModal({
  text = "Get Started",
  btnClassName = "bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium px-4 py-2 rounded-lg transition-all shadow-sm shadow-[#34D399]/20",
}: {
  text?: string;
  btnClassName?: string;
}) {

  const handleLogin = () => {
    signIn("google", {
      callbackUrl: "/dashboard",
      redirect: true
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={btnClassName}>
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#18181B] border border-[#27272A] text-white sm:max-w-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium tracking-tight text-white">
            Welcome to RelayChat
          </DialogTitle>
          <DialogDescription className="text-[#A1A1AA] text-sm leading-[1.6]">
            RelayChat allows you to create instant, secure private room links and start chatting immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleLogin}
            className="w-full bg-[#030303] border border-[#27272A] hover:bg-[#27272A] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-3 transition-colors"
          >
            <Image
              src="/images/google.png"
              width={20}
              height={20}
              alt="google_logo"
            />
            <span>Continue with Google</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
