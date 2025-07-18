import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InterviewProvider } from "@/context/InterviewContext";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "prep-ai",
  description: "Mock interviews powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative w-full mx-auto p-[0.8rem]`}
      >
        <ThemeProvider attribute="class">
          <ThemeToggle />
          <InterviewProvider>{children}</InterviewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
