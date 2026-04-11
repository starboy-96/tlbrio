import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions that govern your use of tlbr.io and its products.",
};

const lastUpdated = "11 April 2026";

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p
              className="text-sm text-navy/40"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
            >
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="h-px bg-navy/8 mb-10" />

          {/* Intro */}
          <p
            className="text-base text-navy/65 leading-relaxed mb-10"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
          >
            Please read these Terms of Service carefully before using the tlbr.io website or product. By accessing or using our services, you agree to be bound by these terms. If you do not agree, you must not use our services.
          </p>

          {/* Content */}
          <div
            className="space-y-10 text-navy/65"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
          >
            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                1. About us
              </h2>
              <p className="leading-relaxed">
                tlbr.io is a bespoke PowerPoint add-in developed and operated by tlbr.io Ltd. References to &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo; refer to tlbr.io Ltd. For enquiries, contact us at{" "}
                <a href="mailto:hello@tlbr.io" className="text-green underline underline-offset-2 hover:text-navy transition-colors">
                  hello@tlbr.io
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                2. Our services
              </h2>
              <p className="leading-relaxed">
                tlbr.io provides a bespoke PowerPoint add-in that is configured specifically to a client&apos;s brand guidelines. Our service includes initial setup and configuration, onboarding, and ongoing support as described in the client agreement. The specific features and scope of the service are agreed between tlbr.io and the client prior to onboarding.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                3. Client agreements
              </h2>
              <p className="leading-relaxed">
                Use of the tlbr.io product is governed by a separate client agreement entered into between tlbr.io Ltd and the client organisation. These Terms of Service apply to use of the tlbr.io website and any pre-sale interactions. In the event of a conflict between these terms and a signed client agreement, the client agreement takes precedence.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                4. Acceptable use
              </h2>
              <p className="leading-relaxed mb-3">When using our website or services, you agree not to:</p>
              <ul className="space-y-2 pl-1">
                {[
                  "Use the site or product for any unlawful purpose",
                  "Attempt to gain unauthorised access to any part of our systems",
                  "Reverse engineer, decompile, or disassemble the add-in software",
                  "Reproduce, redistribute, or resell any part of the tlbr.io product without our written consent",
                  "Use the service in a way that could damage, disable, or impair it",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                5. Intellectual property
              </h2>
              <p className="leading-relaxed">
                All intellectual property rights in the tlbr.io software, website, and associated materials are owned by tlbr.io Ltd or its licensors. Nothing in these terms grants you any ownership of or licence to that intellectual property beyond what is strictly necessary to use the service as intended. Client brand assets configured into the toolbar remain the property of the client.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                6. Pricing and payment
              </h2>
              <p className="leading-relaxed">
                Pricing, billing terms, and payment schedules are set out in the client agreement. A one-off setup fee applies to all new clients. Monthly per-user licensing is billed based on active users in that month. All prices are exclusive of VAT unless stated otherwise. We reserve the right to update pricing with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                7. Data and privacy
              </h2>
              <p className="leading-relaxed">
                The tlbr.io add-in runs locally on users&apos; machines. No slide content or document data is transmitted to our servers. Our collection and use of personal data through this website is described in our{" "}
                <Link href="/privacy" className="text-green underline underline-offset-2 hover:text-navy transition-colors">
                  Privacy Policy
                </Link>
                . Use of cookies is described in our{" "}
                <Link href="/cookie-policy" className="text-green underline underline-offset-2 hover:text-navy transition-colors">
                  Cookie Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                8. Disclaimers and limitation of liability
              </h2>
              <p className="leading-relaxed mb-4">
                The tlbr.io website and product are provided &ldquo;as is&rdquo;. We make no warranties, express or implied, regarding the availability, accuracy, or fitness for a particular purpose of our services.
              </p>
              <p className="leading-relaxed">
                To the fullest extent permitted by law, tlbr.io Ltd shall not be liable for any indirect, incidental, or consequential loss or damage arising from your use of the website or product. Our total liability to you in connection with these terms shall not exceed the amount paid by you to us in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                9. Termination
              </h2>
              <p className="leading-relaxed">
                We reserve the right to suspend or terminate access to our website or services if you breach these terms. Termination of a client agreement is governed by the terms of that agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                10. Governing law
              </h2>
              <p className="leading-relaxed">
                These Terms of Service are governed by the laws of England and Wales. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                11. Changes to these terms
              </h2>
              <p className="leading-relaxed">
                We may update these Terms of Service from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes are posted constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                12. Contact
              </h2>
              <p className="leading-relaxed">
                For any questions regarding these terms, contact us at{" "}
                <a href="mailto:hello@tlbr.io" className="text-green underline underline-offset-2 hover:text-navy transition-colors">
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
              href="/cookie-policy"
              className="text-sm text-navy/50 hover:text-navy transition-colors underline underline-offset-2"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
            >
              Cookie Policy
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
