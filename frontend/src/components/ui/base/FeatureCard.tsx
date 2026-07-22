import React from "react";
import { Card } from "@/components/ui/card";

export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="group p-6 bg-[#18181B] border border-[#27272A] rounded-lg transition-all duration-300 hover:border-[#34D399]/40 hover:shadow-lg hover:shadow-[#34D399]/5">
      <div className="w-12 h-12 rounded-lg bg-[#27272A] flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-[#A1A1AA] leading-[1.6]">{description}</p>
    </Card>
  );
}