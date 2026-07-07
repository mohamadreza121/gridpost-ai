import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GridPost AI — Social Media Agent Dashboard",
  description: "A GridSpell Studio portfolio SaaS demo for AI social media scheduling, publishing, and analytics.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
