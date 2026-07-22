import React from "react";
import { Card } from "@/components/ui/card";

export default function UserReviews() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-[#27272A]/50 bg-[#030303]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-xs font-mono text-[#60A5FA] tracking-wider uppercase mb-3">
          Community Feedback
        </h2>
        <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
          Trusted by Teams & Creators
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="p-8 bg-[#18181B] border border-[#27272A] rounded-lg">
          <p className="text-base text-[#A1A1AA] leading-[1.6] italic mb-6">
            “RelayChat is a game-changer! It's by far the fastest and cleanest way to start instant encrypted room chats.”
          </p>
          <div className="flex items-center gap-4">
            <img
              src="/images/user1.png"
              alt="John Doe"
              className="w-12 h-12 rounded-full border border-[#27272A] object-cover"
            />
            <div>
              <div className="text-sm font-medium text-white">John Doe</div>
              <div className="text-xs text-[#A1A1AA]">Lead Developer</div>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-[#18181B] border border-[#27272A] rounded-lg">
          <p className="text-base text-[#A1A1AA] leading-[1.6] italic mb-6">
            “The passcode security and file attachment flows are top-notch. Simple, fast, and remarkably reliable.”
          </p>
          <div className="flex items-center gap-4">
            <img
              src="/images/user2.png"
              alt="Jane Smith"
              className="w-12 h-12 rounded-full border border-[#27272A] object-cover"
            />
            <div>
              <div className="text-sm font-medium text-white">Jane Smith</div>
              <div className="text-xs text-[#A1A1AA]">Product Designer</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}