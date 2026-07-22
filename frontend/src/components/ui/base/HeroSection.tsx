import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 overflow-hidden bg-[#030303]">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#34D399]/15 to-[#60A5FA]/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Pill badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-[#18181B] border border-[#27272A] text-xs font-mono text-[#34D399] tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
        NOVA NEXT GEN INTELLIGENCE
      </div>

      {/* Main Headline */}
      <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-[64px] font-medium tracking-tight leading-[1.04] text-white mb-6">
        Wisdom That Drives Us Onward.{" "}
        <span className="bg-gradient-to-r from-[#34D399] via-[#60A5FA] to-white bg-clip-text text-transparent">
          Next-Gen Chat System.
        </span>
      </h1>

      <p className="max-w-2xl text-base sm:text-lg text-[#A1A1AA] leading-[1.6] mb-10">
        Engineered for tomorrow. QuickChat makes it effortless to create secure, instant private rooms and start seamless conversations in seconds.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <Link href="/dashboard">
          <Button size="lg" className="bg-[#34D399] text-[#030303] hover:bg-[#34D399]/90 font-medium px-8 py-3 rounded-full text-base transition-all shadow-lg shadow-[#34D399]/20 hover:scale-[1.02]">
            Start Chatting Instant
          </Button>
        </Link>
      </div>

      {/* Visual illustration frame */}
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#27272A] bg-[#18181B]/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-black/80">
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs font-mono text-[#A1A1AA]">relay-chat // live room preview</span>
        </div>
        <img
          src="/images/conversation.svg"
          alt="Illustration"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
    </section>
  );
}