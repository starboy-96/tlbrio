import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

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
    default: "tlbr.io – Elevate Every Presentation",
    template: "%s | tlbr.io",
  },
  description:
    "A bespoke PowerPoint add-in helping designers and non-designers build high-impact, on-brand decks – 2× faster. Trusted by teams from 10 to 2,000+ users.",
  keywords: [
    "PowerPoint add-in",
    "presentation tool",
    "brand consistency",
    "slide design",
    "PowerPoint toolbar",
    "presentation software",
    "on-brand presentations",
    "PowerPoint automation",
  ],
  authors: [{ name: "tlbr.io" }],
  creator: "tlbr.io",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://tlbr.io",
    siteName: "tlbr.io",
    title: "tlbr.io – Elevate Every Presentation",
    description:
      "A bespoke PowerPoint add-in helping designers and non-designers build high-impact, on-brand decks – 2× faster.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "tlbr.io – Elevate Every Presentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "tlbr.io – Elevate Every Presentation",
    description:
      "A bespoke PowerPoint add-in helping designers and non-designers build high-impact, on-brand decks – 2× faster.",
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
        <CookieBanner>{children}</CookieBanner>
      </body>
    </html>
  );
}
