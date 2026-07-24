"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import ProfileMenu from "../auth/ProfileMenu";

export default function DashNav({
  image,
  name,
}: {
  image?: string;
  name: string;
}) {
  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[#030303]/80 backdrop-blur-md border-b border-[#27272A]">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="RelayChat Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="text-xl md:text-2xl font-semibold tracking-tight text-white">
            Relay<span className="text-[#34D399]">Chat</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <ProfileMenu name={name} image={image} />
      </div>
    </nav>
  );
}