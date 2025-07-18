import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InterviewProvider } from "@/context/InterviewContext";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

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
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative w-full mx-auto p-[0.8rem]`}
      >
        <Toaster position="bottom-center" />
        <ThemeProvider attribute="class">
          <ThemeToggle />
          <AuthProvider>
            <InterviewProvider>{children}</InterviewProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
