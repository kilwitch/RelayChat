import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

import {cn} from "@/lib/utils"
import SessionProvider from "@/providers/SessionProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "chat app",
  description: "for quick chats with users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <SessionProvider>
        <body className={cn ("min-h-full flex flex-col antialiased",
      fontSans.variable)}
      >
        <Toaster richColors duration={10000}/>
        {children}
      
      </body>
      </SessionProvider>
      
    </html>
  );
}
