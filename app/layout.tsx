import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KHPC Archives — Attack on Titan Portal",
  description:
    "A cinematic archive portal inspired by Attack on Titan. Explore the complete movie gallery, animation history, and expedition logs across all seasons.",
  keywords: [
    "KHPC Archives",
    "Attack on Titan",
    "Movie Gallery",
    "Animation",
    "Survey Corps",
    "Portal",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
