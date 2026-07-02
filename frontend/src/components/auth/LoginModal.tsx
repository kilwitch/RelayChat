"use-client"
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

export default function LoginModal() {
  return (
    <Dialog>
  <DialogTrigger asChild>
    Get Started
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className='text-2xl'>Welcome to Relay Chat</DialogTitle>
      <DialogDescription>
        RelayChat allows to make quick chats and secure private rooms.
      </DialogDescription>
    </DialogHeader>
    <Button variant="outline">
        <Image src="/images/google.png"
        className='mr-4'
        width={25}
        height={25}
        alt='google_logo'>
            Continue with google
        </Image>
    </Button>
  </DialogContent>
</Dialog>
  )
}
