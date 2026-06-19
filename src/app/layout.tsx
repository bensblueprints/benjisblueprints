import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://benjisblueprints.com"),
  title: "Free Business Plans — Benji's Blueprints",
  description:
    "Drop your email and get the entire library of done-for-you business plans free — the exact breakdowns from my daily videos. New plans added every week.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
