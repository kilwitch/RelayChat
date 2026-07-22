import React from 'react'
import Link from 'next/link'
import ProfileMenu from '../auth/ProfileMenu'

export default function DashNav({ name, image }: { name: string, image?: string }) {
  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[#030303]/80 backdrop-blur-md border-b border-[#27272A]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#34D399] to-[#60A5FA] flex items-center justify-center font-bold text-black text-sm shadow-sm shadow-[#34D399]/20">
          R
        </div>
        <Link href="/" className="text-xl md:text-2xl font-semibold tracking-tight text-white hover:opacity-90 transition-opacity">
          Relay<span className="text-[#34D399]">Chat</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <ProfileMenu name={name} image={image} />
      </div>
    </nav>
  )
}
