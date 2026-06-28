import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AppShell } from "../components/shell/AppShell";
import { AppProviders } from "../providers/AppProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://synapse.jaasim.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PROJECT SYNAPSE — Mohamed Jaasim",
    template: "%s · PROJECT SYNAPSE",
  },
  description:
    "An award-level interactive portfolio — cinematic storytelling, engineering craft, and Digital Jaasim.",
  keywords: ["Mohamed Jaasim", "portfolio", "Three.js", "React", "software engineer", "SYNAPSE"],
  authors: [{ name: "Mohamed Jaasim" }],
  creator: "Mohamed Jaasim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "PROJECT SYNAPSE",
    title: "PROJECT SYNAPSE — Mohamed Jaasim",
    description:
      "An award-level interactive portfolio — cinematic storytelling, engineering craft, and Digital Jaasim.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PROJECT SYNAPSE — Mohamed Jaasim",
    description:
      "An award-level interactive portfolio — cinematic storytelling, engineering craft, and Digital Jaasim.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02030a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
