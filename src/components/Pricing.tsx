"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const tiers = [
  { range: "Up to 100 users",  price: "£30", period: "/user/month" },
  { range: "101–500 users",    price: "£26", period: "/user/month" },
  { range: "501–2,000 users",  price: "£22", period: "/user/month" },
  { range: "2,001+ users",     price: "£18", period: "/user/month" },
];

const features = [
  "All toolbar features",
  "Brand asset library",
  "Team admin dashboard",
  "Email support",
  "Priority onboarding",
  "Dedicated account manager",
];

export default function Pricing() {
  const mounted = useMounted();
  return (
    <section id="pricing" className="py-28 px-6" aria-label="Pricing">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <motion.p
            initial={mounted ? { opacity: 0, y: 10 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            className="section-label mb-3"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={mounted ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl mb-4 leading-[1.05]"
            style={{ fontFamily: '"Cal Sans", sans-serif' }}
          >
            Simple pricing that{" "}
            <span className="gradient-text">scales with you</span>
          </motion.h2>
          <motion.p
            initial={mounted ? { opacity: 0, y: 12 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="text-lg text-navy/75"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
          >
            Monthly per-user licensing. The larger your team, the lower the rate. No hidden costs.
          </motion.p>
        </div>

        {/* Setup fee callout */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 p-6 rounded-2xl bg-green-xlight border border-green/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <span className="section-label block mb-1" style={{ color: "#0a1a2f", opacity: 0.5 }}>
              One-off setup fee
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl text-green" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                £8,000
              </span>
              <span className="text-sm text-navy/50" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}>
                fixed, one time
              </span>
            </div>
          </div>
          <p className="text-sm text-navy/75 max-w-xs" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}>
            Covers configuration, integration, onboarding, and training – everything to get your team live.
          </p>
        </motion.div>

        {/* Pricing tiers — price only, no feature lists */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={mounted ? { opacity: 0, y: 14 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
              className="relative rounded-2xl p-6 flex flex-col bg-white border border-navy/6 hover:border-green/25 hover:shadow-[0_4px_24px_rgba(10,26,47,0.07)] transition-all duration-300"
            >
              <p
                className="text-sm text-navy/50 mb-4"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
              >
                {tier.range}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl text-navy" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                  {tier.price}
                </span>
                <span className="text-xs text-navy/40" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}>
                  {tier.period}
                </span>
              </div>
              <a
                href="#demo"
                className="mt-auto block text-center py-2.5 rounded-full text-sm font-medium border border-navy/10 text-navy/70 hover:border-navy/20 hover:text-navy transition-all duration-200 cursor-pointer"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get started
              </a>
            </motion.div>
          ))}
        </div>

        {/* Shared features — all plans include */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-navy/6 bg-white px-8 py-6"
        >
          <p
            className="text-xs text-navy/40 uppercase tracking-widest mb-5"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
          >
            Everything included in every plan
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-xlight flex items-center justify-center flex-shrink-0">
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="text-green">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span
                  className="text-sm text-navy/65"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={mounted ? { opacity: 0, y: 12 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-sm text-navy/45 text-center mt-10"
          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
        >
          Customers report a{" "}
          <span className="text-green font-medium">10-40× return on investment</span>.{" "}
          <a
            href="#demo"
            className="underline underline-offset-2 hover:text-navy transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Book a demo to see the numbers for your team →
          </a>
        </motion.p>

      </div>
    </section>
  );
}
