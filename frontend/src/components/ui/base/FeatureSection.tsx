import React from "react";
import FeatureCard from "./FeatureCard";

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-[#27272A]/50 bg-[#030303]"
    >
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-xs font-mono text-[#34D399] tracking-wider uppercase mb-3">
          Key Capabilities
        </h2>
        <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
          Engineered for Instant Communication
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon="🚀"
          title="Instant Setup"
          description="Generate a room link in seconds. No complex account setup required to get started."
        />
        <FeatureCard
          icon="🔒"
          title="Secure Rooms"
          description="Passcode protection for your private conversations with encrypted session states."
        />
        <FeatureCard
          icon="💻"
          title="Cross-Platform"
          description="Seamless experience across all mobile, tablet, and modern web browsers."
        />
      </div>
    </section>
  );
}