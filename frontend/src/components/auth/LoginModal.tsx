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
import {signIn} from "next-auth/react"

export default function LoginModal() {

  const handleLogin=() =>{
    signIn("google" , {
      callbackUrl:"/dashboard",
      redirect: true
    })
  }

  return (
    <Dialog>
  <DialogTrigger asChild>
    <Button>Get Started</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className='text-2xl'>Welcome to Relay Chat</DialogTitle>
      <DialogDescription>
        RelayChat allows to make quick chats and secure private rooms.
      </DialogDescription>
    </DialogHeader>
    <Button variant="outline" onClick={handleLogin} className="flex items-center gap-2">
        <Image src="/images/google.png"
        className='mr-4'
        width={25}
        height={25}
        alt='google_logo'
        />
        Continue with google
    </Button>
  </DialogContent>
</Dialog>
  )
}
