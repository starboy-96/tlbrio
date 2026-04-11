import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How tlbr.io collects, uses, and protects your personal information.",
};

const lastUpdated = "11 April 2026";

export default function PrivacyPage() {
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
              Privacy Policy
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
            tlbr.io (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to it. It applies to our website at{" "}
            <a
              href="https://tlbr.io"
              className="text-green underline underline-offset-2 hover:text-navy transition-colors"
            >
              tlbr.io
            </a>{" "}
            and our PowerPoint add-in product.
          </p>

          {/* Content */}
          <div
            className="space-y-10 text-navy/65"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
          >
            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                1. Who we are
              </h2>
              <p className="leading-relaxed">
                tlbr.io is the data controller for personal data collected through this website. If you have any questions about this policy or how we handle your data, you can contact us at{" "}
                <a href="mailto:hello@tlbr.io" className="text-green underline underline-offset-2 hover:text-navy transition-colors">
                  hello@tlbr.io
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                2. What data we collect
              </h2>
              <p className="leading-relaxed mb-4">We may collect the following types of information:</p>
              <div className="space-y-3">
                {[
                  {
                    title: "Information you provide",
                    body: "When you submit the demo request form on our website, we collect your work email address. We use this solely to follow up on your request.",
                  },
                  {
                    title: "Usage data",
                    body: "We collect anonymised information about how visitors use our website — such as pages visited, time spent, and referring sources. This data cannot be used to identify you personally.",
                  },
                  {
                    title: "Cookie data",
                    body: "We use cookies as described in our Cookie Policy. You can accept or reject non-essential cookies when you first visit the site.",
                  },
                  {
                    title: "Product data",
                    body: "Our PowerPoint add-in runs entirely locally on your users' machines. No slide content, document data, or confidential information is ever sent to or processed by our servers.",
                  },
                ].map((item) => (
                  <div key={item.title} className="p-5 rounded-2xl bg-[#fafafa] border border-navy/6">
                    <p className="text-sm text-navy mb-1" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}>
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                3. How we use your data
              </h2>
              <p className="leading-relaxed mb-3">We use the data we collect to:</p>
              <ul className="space-y-2 pl-1">
                {[
                  "Respond to demo requests and enquiries",
                  "Understand how our website is used and improve it",
                  "Comply with our legal obligations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                We will never sell your personal data to third parties or use it for purposes other than those described above.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                4. Legal basis for processing
              </h2>
              <p className="leading-relaxed">
                Where we process personal data, we do so on one of the following legal bases under the UK GDPR: your consent (e.g. submitting the demo form or accepting cookies), our legitimate interests in operating and improving our business, or compliance with a legal obligation.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                5. Data retention
              </h2>
              <p className="leading-relaxed">
                We retain your contact information only for as long as necessary to fulfil the purpose for which it was collected — typically until your enquiry has been resolved or you ask us to delete it. Anonymised analytics data may be retained indefinitely as it cannot identify you.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                6. Sharing your data
              </h2>
              <p className="leading-relaxed">
                We do not sell, rent, or trade your personal data. We may share data with trusted third-party service providers (such as analytics platforms) who process data on our behalf under strict data processing agreements. We may also disclose data where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                7. Your rights
              </h2>
              <p className="leading-relaxed mb-4">
                Under UK and EU data protection law, you have the right to:
              </p>
              <ul className="space-y-2 pl-1">
                {[
                  "Access the personal data we hold about you",
                  "Request correction of inaccurate data",
                  "Request deletion of your data",
                  "Object to or restrict processing of your data",
                  "Withdraw consent at any time (where processing is based on consent)",
                  "Lodge a complaint with the ICO (ico.org.uk) if you believe we have mishandled your data",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:hello@tlbr.io" className="text-green underline underline-offset-2 hover:text-navy transition-colors">
                  hello@tlbr.io
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                8. Security
              </h2>
              <p className="leading-relaxed">
                We take appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                9. Changes to this policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                10. Contact
              </h2>
              <p className="leading-relaxed">
                For any privacy-related questions or requests, please contact us at{" "}
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
              href="/cookie-policy"
              className="text-sm text-navy/50 hover:text-navy transition-colors underline underline-offset-2"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
            >
              Cookie Policy
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
