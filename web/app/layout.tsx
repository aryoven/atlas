import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas AI — Build Your AI Workforce",
  description:
    "Increase business revenue with AI Employees. Deploy AI Sales, Support, Receptionists, and Voice Agents that work 24/7.",
  keywords: [
    "AI employees",
    "AI sales",
    "AI customer support",
    "AI receptionist",
    "AI voice agents",
    "Atlas AI",
  ],
  openGraph: {
    title: "Atlas AI — Build Your AI Workforce",
    description:
      "Increase business revenue with AI Employees. Deploy AI Sales, Support, Receptionists, and Voice Agents that work 24/7.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
