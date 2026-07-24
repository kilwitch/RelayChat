"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../button";
import LoginModal from "@/components/auth/LoginModal";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";

export default function Navbar({ user }: { user: CustomUser | null }) {
  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center bg-[#030303]/80 backdrop-blur-md border-b border-[#27272A]">
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

      <div className="flex items-center space-x-4 md:space-x-8 text-sm font-medium text-[#A1A1AA]">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <Link href="#features" className="hover:text-white transition-colors">
          Features
        </Link>
        {!user ? (
          <LoginModal />
        ) : (
          <Link href="/dashboard">
            <Button className="bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium px-4 py-2 rounded-lg transition-all shadow-sm shadow-[#34D399]/20">
              Dashboard
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}