import type { Metadata } from "next";
import { Inter, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Paths — KHPC Archives",
  description:
    "A cinematic image gallery and mind map. Explore memories across the infinite canvas of The Paths.",
  keywords: ["KHPC Archives", "Gallery", "Mind Map", "The Paths"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
