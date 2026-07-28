import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aryoven.com"),

  title: {
    default: "Atlas AI — Build Your AI Workforce",
    template: "%s | Atlas AI",
  },

  description:
    "Build AI Employees for Sales, Support, Reception, and Operations. Deploy your AI workforce in minutes with Atlas AI.",

  applicationName: "Atlas AI",

  keywords: [
    "AI Employees",
    "AI Workforce",
    "AI Sales Agent",
    "AI Support Agent",
    "AI Receptionist",
    "Knowledge Base AI",
    "Business AI",
    "Atlas AI",
  ],

  authors: [
    {
      name: "Atlas AI",
    },
  ],

  creator: "Atlas AI",

  publisher: "Atlas AI",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",

    url: "https://aryoven.com",

    siteName: "Atlas AI",

    title: "Atlas AI — Build Your AI Workforce",

    description:
      "Create AI Employees powered by your business knowledge. Sales, Support, Reception and Operations available 24/7.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Atlas AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Atlas AI — Build Your AI Workforce",

    description:
      "Deploy AI Employees for your business in minutes.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
      className="h-full dark"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}