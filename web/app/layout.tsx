import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
