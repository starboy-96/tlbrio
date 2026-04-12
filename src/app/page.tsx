import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import WhoItsFor from "@/components/WhoItsFor";
import FAQ from "@/components/FAQ";
import Demo from "@/components/Demo";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "tlbr.io – Elevate Every Presentation",
  description:
    "A bespoke PowerPoint add-in helping designers and non-designers build high-impact, on-brand decks – 2× faster. Trusted by teams from 10 to 2,000+ users.",
  alternates: {
    canonical: "https://tlbr.io",
  },
  openGraph: {
    url: "https://tlbr.io",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "tlbr.io – Elevate Every Presentation",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "tlbr.io",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Windows",
  description:
    "A bespoke PowerPoint add-in helping designers and non-designers build high-impact, on-brand decks – 2× faster. A toolbar that lives inside PowerPoint giving teams instant access to brand-compliant formatting tools, templates, and assets.",
  url: "https://tlbr.io",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "GBP",
    lowPrice: "18",
    highPrice: "30",
    offerCount: "4",
  },
  featureList: [
    "Align & distribute objects in one click",
    "Brand colours and fonts built in",
    "Bespoke templates",
    "Brand asset library",
    "Edit graphs and tables",
    "Layout and spacing tools",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main id="main" className="flex flex-col flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Pricing />
        <About />
        <WhoItsFor />
        <FAQ />
        <Demo />
      </main>
      <Footer />
    </>
  );
}
