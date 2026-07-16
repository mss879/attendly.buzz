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

const title = "Attendly — Host & Book Event Tickets Seamlessly";
const description =
  "Create, host, and book tickets for premium events. Attendly offers interactive seating maps, secure payment validation, and instant digital QR entry tickets for event organizers and attendees.";

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.appUrl),
  title: {
    default: title,
    template: "%s · Attendly",
  },
  description,
  applicationName: "Attendly",
  keywords: [
    "event ticketing platform",
    "ticket booking portal",
    "seating map reservation",
    "secure ticket validation",
    "QR gate entry check-in",
    "event seating planner",
    "Attendly events",
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
    images: [
      {
        url: "/opengraph-image.png",
        width: 1024,
        height: 1024,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image.png"],
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
