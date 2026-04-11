import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How tlbr.io uses cookies to understand site usage and improve your experience.",
};

const lastUpdated = "11 April 2026";

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-2xl mx-auto w-full">

          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-navy/45 hover:text-navy transition-colors mb-10 group"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
          >
            <span className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span>
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-10">
            <p
              className="text-xs uppercase tracking-widest text-navy/40 mb-3"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            >
              Legal
            </p>
            <h1
              className="text-4xl md:text-5xl mb-4 leading-tight"
              style={{ fontFamily: '"Cal Sans", sans-serif' }}
            >
              Cookie Policy
            </h1>
            <p
              className="text-sm text-navy/40"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
            >
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="h-px bg-navy/8 mb-10" />

          {/* Content */}
          <div
            className="space-y-10 text-navy/65"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
          >
            <section>
              <h2
                className="text-xl text-navy mb-3"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
              >
                What are cookies?
              </h2>
              <p className="leading-relaxed">
                Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work, to work more efficiently, and to provide information to the owners of the site.
              </p>
            </section>

            <section>
              <h2
                className="text-xl text-navy mb-3"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
              >
                How we use cookies
              </h2>
              <p className="leading-relaxed mb-4">
                tlbr.io uses cookies solely to understand how visitors use our website — for example, which pages are visited most and where visitors come from. This helps us improve the site and your experience on it.
              </p>
              <p className="leading-relaxed">
                We do not use cookies to serve advertising, track you across other websites, or build profiles about you.
              </p>
            </section>

            <section>
              <h2
                className="text-xl text-navy mb-3"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
              >
                Types of cookies we use
              </h2>
              <div className="space-y-5">
                {[
                  {
                    name: "Strictly necessary cookies",
                    desc: "These cookies are required for the website to function. They include cookies that remember your cookie consent choice. You cannot opt out of these cookies.",
                  },
                  {
                    name: "Analytics cookies",
                    desc: "These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously. We use this data only to improve the site — never to identify individuals.",
                  },
                ].map((item) => (
                  <div key={item.name} className="p-5 rounded-2xl bg-[#fafafa] border border-navy/6">
                    <p
                      className="text-sm text-navy mb-1"
                      style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
                    >
                      {item.name}
                    </p>
                    <p className="text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2
                className="text-xl text-navy mb-3"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
              >
                Your choices
              </h2>
              <p className="leading-relaxed mb-4">
                When you first visit tlbr.io, you will be asked to accept or reject non-essential cookies. You can change your preference at any time by clearing your browser cookies and revisiting the site.
              </p>
              <p className="leading-relaxed">
                Most browsers also allow you to control cookies through their settings. To learn more, visit your browser's help pages or{" "}
                <a
                  href="https://www.allaboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green underline underline-offset-2 hover:text-navy transition-colors"
                >
                  allaboutcookies.org
                </a>
                .
              </p>
            </section>

            <section>
              <h2
                className="text-xl text-navy mb-3"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
              >
                Third-party cookies
              </h2>
              <p className="leading-relaxed">
                We may use third-party analytics services (such as Google Analytics) that set their own cookies to help us measure site traffic and usage. These third parties are not permitted to use the data collected on our behalf for their own commercial purposes.
              </p>
            </section>

            <section>
              <h2
                className="text-xl text-navy mb-3"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
              >
                Changes to this policy
              </h2>
              <p className="leading-relaxed">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.
              </p>
            </section>

            <section>
              <h2
                className="text-xl text-navy mb-3"
                style={{ fontFamily: '"Cal Sans", sans-serif' }}
              >
                Contact us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about our use of cookies, please contact us at{" "}
                <a
                  href="mailto:hello@tlbr.io"
                  className="text-green underline underline-offset-2 hover:text-navy transition-colors"
                >
                  hello@tlbr.io
                </a>
                .
              </p>
            </section>
          </div>

          {/* Related links */}
          <div className="mt-16 pt-8 border-t border-navy/8 flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="text-sm text-navy/50 hover:text-navy transition-colors underline underline-offset-2"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-navy/50 hover:text-navy transition-colors underline underline-offset-2"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
            >
              Terms of Service
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
