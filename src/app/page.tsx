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
import WhyTemplatesDontStick from "@/components/WhyTemplatesDontStick";
import Demo from "@/components/Demo";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "tlbr.io – The Bespoke PowerPoint Toolbar for Growing Firms",
  description:
    "A bespoke PowerPoint toolbar for firms of 100 to 1,500 people. Your templates, brand colours and approved assets built into the ribbon, so every deck goes out on brand.",
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
        alt: "tlbr.io – The Bespoke PowerPoint Toolbar for Growing Firms",
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
    "A bespoke PowerPoint toolbar for firms of 100 to 1,500 people. Templates, brand colours and approved assets built into the PowerPoint ribbon.",
  url: "https://tlbr.io",
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
        <WhyTemplatesDontStick />
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
