import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlas AI",
  description: "Build your AI workforce.",

  metadataBase: new URL("https://atlas-ai.app"),

  alternates: {
    canonical: "/",
  },

  twitter: {
    card: "summary_large_image",
    title: "Atlas AI",
    description: "Build your AI workforce.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}