import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";
import SessionProvider from "@/providers/SessionProvider";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "RelayChat — Next Gen Intelligence",
  description: "Instant, secure private rooms for quick conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <SessionProvider>
        <body
          className={cn(
            "min-h-screen bg-[#030303] text-white flex flex-col antialiased selection:bg-[#34D399]/30 selection:text-[#34D399]",
            fontSans.variable,
            fontMono.variable
          )}
        >
          <Toaster richColors duration={5000} theme="dark" />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
