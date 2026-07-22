'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'

interface ProfileModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ProfileModal({ open, setOpen }: ProfileModalProps) {
  const { data: session } = useSession()
  const user = session?.user as {
    name?: string | null
    email?: string | null
    image?: string | null
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden border border-[#27272A] bg-[#18181B] text-white rounded-xl shadow-2xl shadow-black/80">
        {/* Decorative ambient background glows */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        >
          <div
            className="absolute -top-16 -right-16 w-52 h-52 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)',
              filter: 'blur(25px)',
            }}
          />
        </div>

        {/* Header banner */}
        <div className="relative h-24 w-full flex-shrink-0 bg-gradient-to-r from-[#34D399]/20 via-[#60A5FA]/20 to-[#18181B] border-b border-[#27272A]" />

        {/* Avatar — centered over the banner */}
        <div className="relative flex flex-col items-center px-6 pb-6 -mt-12">
          <div className="p-1 rounded-full bg-gradient-to-br from-[#34D399] to-[#60A5FA] shadow-md shadow-[#34D399]/20">
            <Avatar className="w-20 h-20 border-2 border-[#030303]">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-[#34D399] to-[#60A5FA] text-[#030303] text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Accessibility: hidden title / description for screen readers */}
          <DialogTitle className="sr-only">User Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Your account information
          </DialogDescription>

          {/* Name */}
          <h2 className="mt-3 text-center text-xl font-medium tracking-tight text-white">
            {user?.name ?? 'Unknown User'}
          </h2>

          {/* Email */}
          <p className="mt-1 text-center text-xs font-mono text-[#A1A1AA]">
            {user?.email ?? '—'}
          </p>

          {/* Divider */}
          <div className="my-4 w-full h-px bg-[#27272A]" />

          {/* Info card */}
          <div className="w-full rounded-lg bg-[#030303] border border-[#27272A] p-4 space-y-3.5">
            <ProfileField
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-[#34D399]"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
              label="Display Name"
              value={user?.name ?? '—'}
            />
            <ProfileField
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-[#60A5FA]"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              }
              label="Email Address"
              value={user?.email ?? '—'}
            />
          </div>

          {/* Close button */}
          <button
            id="profile-modal-close"
            onClick={() => setOpen(false)}
            className="mt-5 w-full py-2.5 rounded-lg text-sm font-medium bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 transition-all shadow-sm shadow-[#34D399]/20"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-shrink-0 p-1.5 rounded-md bg-[#18181B] border border-[#27272A]">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-white truncate">
          {value}
        </p>
      </div>
    </div>
  )
}
