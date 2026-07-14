'use client'
import React, { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserAvatar from '../common/UserAvatar'
import dynamic from 'next/dynamic'

const LogoutModal = dynamic(() => import('../auth/LogoutModal'))
const ProfileModal = dynamic(() => import('../auth/ProfileModal'))

export default function ProfileMenu({
  name,
  image,
}: {
  name: string
  image?: string
}) {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <>
      {logoutOpen && (
        <Suspense fallback={<p>Loading...</p>}>
          <LogoutModal open={logoutOpen} setOpen={setLogoutOpen} />
        </Suspense>
      )}

      {profileOpen && (
        <Suspense fallback={null}>
          <ProfileModal open={profileOpen} setOpen={setProfileOpen} />
        </Suspense>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id="profile-menu-trigger"
            variant="outline"
            className="rounded-full p-0 w-10 h-10 overflow-hidden border-2 border-violet-400/60 hover:border-violet-500 transition-all duration-200 shadow-sm hover:shadow-violet-200"
          >
            <UserAvatar name={name} image={image} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 shadow-xl border border-border/60"
        >
          <DropdownMenuLabel className="font-semibold text-foreground/80">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              id="profile-menu-item-profile"
              className="cursor-pointer gap-2"
              onClick={() => setProfileOpen(true)}
            >
              {/* Person icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-violet-500"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              id="profile-menu-item-logout"
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              onClick={() => setLogoutOpen(true)}
            >
              {/* Logout icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
