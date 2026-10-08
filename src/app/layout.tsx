import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://tlbr.io"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/favicon.svg", type: "image/svg+xml" },
  },
  title: {
    default: "tlbr.io – The Bespoke PowerPoint Toolbar for Growing Firms",
    template: "%s | tlbr.io",
  },
  description:
    "A bespoke PowerPoint toolbar for firms of 100 to 1,500 people. Your templates, brand colours and approved assets built into the ribbon, so every deck goes out on brand.",
  keywords: [
    "PowerPoint toolbar",
    "PowerPoint add-in",
    "branded PowerPoint templates",
    "brand consistency",
    "company PowerPoint toolbar",
    "accountancy firm presentation",
    "law firm PowerPoint",
    "on-brand presentations",
    "PowerPoint branding",
  ],
  authors: [{ name: "tlbr.io" }],
  creator: "tlbr.io",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://tlbr.io",
    siteName: "tlbr.io",
    title: "tlbr.io – The Bespoke PowerPoint Toolbar for Growing Firms",
    description:
      "A bespoke PowerPoint toolbar for firms of 100 to 1,500 people. Every pitch, proposal and report, on brand in one click.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "tlbr.io – The Bespoke PowerPoint Toolbar for Growing Firms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "tlbr.io – The Bespoke PowerPoint Toolbar for Growing Firms",
    description:
      "A bespoke PowerPoint toolbar for firms of 100 to 1,500 people. Every pitch, proposal and report, on brand in one click.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500&display=swap"
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-navy antialiased">
        <Analytics />
        <CookieBanner>{children}</CookieBanner>
      </body>
    </html>
  );
}
