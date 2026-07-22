import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full bg-[#030303] border-t border-[#27272A] px-6 py-12 text-[#A1A1AA] text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#34D399] to-[#60A5FA] flex items-center justify-center text-black text-xs font-bold">
              R
            </div>
            RelayChat
          </div>
          <div className="text-xs text-[#A1A1AA]">© 2026 RelayChat Inc. All rights reserved.</div>
          <div className="flex gap-4 text-xs font-medium pt-1">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Enter your email"
            className="bg-[#18181B] border-[#27272A] text-white placeholder:text-[#A1A1AA] focus:ring-[#34D399] rounded-lg px-4 py-2 text-sm w-full sm:w-64"
          />
          <Button className="bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium px-5 py-2 rounded-lg text-sm transition-all shadow-sm shadow-[#34D399]/20 w-full sm:w-auto">
            Subscribe
          </Button>
        </div>
      </div>
    </footer>
  );
}