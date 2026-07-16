import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { appConfig } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "80th Bradby Viewing Party — Bradby Shield 2026 | Attendly";
const description =
  "Royal College vs Trinity College on a 28ft LED screen at the Royal College Sports Complex, Colombo 07. Book numbered grandstand seats (Rs 1,500), pay by bank transfer, and check in with a personal QR ticket.";

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.appUrl),
  title: {
    default: title,
    template: "%s · Attendly",
  },
  description,
  applicationName: "Attendly",
  keywords: [
    "Bradby Shield 2026",
    "Bradby viewing party",
    "Royal College vs Trinity College",
    "Bradby Colombo",
    "grandstand seats",
    "event tickets",
    "QR ticket",
    "Attendly",
  ],
  authors: [{ name: "ARC AI", url: "https://www.arcai.agency" }],
  creator: "ARC AI",
  publisher: "ARC AI",
  category: "events",
  openGraph: {
    type: "website",
    siteName: "Attendly",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // extend under notches/safe areas on modern phones
  themeColor: "#ea580c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
