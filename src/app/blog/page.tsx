import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Ambient from "@/components/Ambient";
import DarkBackdrop from "@/components/blog/DarkBackdrop";
import PostCard, { PostMetaLine } from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Blog – Presentation design, brand consistency & PowerPoint tips",
  description:
    "Insights on presentation design, brand consistency, and making the most of PowerPoint for your team – from the tlbr.io team.",
  alternates: { canonical: "https://tlbr.io/blog" },
  openGraph: {
    title: "Blog | tlbr.io",
    description:
      "Insights on presentation design, brand consistency, and making the most of PowerPoint for your team.",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main id="main" className="flex flex-col flex-1">
        {/* Header */}
        <section data-nav="dark" className="on-dark relative overflow-hidden bg-navy px-6 md:px-12 pt-36 md:pt-40 pb-32 md:pb-40">
          <DarkBackdrop />
          <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-16 items-end">
            <div>
              <p className="section-label mb-5 opacity-0 animate-fade-up">The tlbr.io blog</p>
              <h1
                className="text-white leading-[1.04] opacity-0 animate-fade-up"
                style={{ fontSize: "clamp(2.6rem, 5.6vw, 5rem)", letterSpacing: "-0.02em", animationDelay: "80ms" }}
              >
                Ideas for decks that{" "}
                <span className="gradient-text">stay on brand.</span>
              </h1>
            </div>
            <div className="opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
              <p className="text-lg leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400 }}>
                Presentation design, brand consistency and getting more from PowerPoint, straight from the tlbr.io team.
              </p>
              <p className="text-sm text-white/55">{posts.length} articles</p>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="relative bg-[#fafafa] px-6 md:px-12 pb-24 md:pb-32">
          <Ambient blobs={[
            { color: "rgba(148,229,97,0.4)", size: "46vw", top: "30%", right: "-14%" },
            { color: "rgba(90,150,255,0.24)", size: "40vw", top: "60%", left: "-14%", drift: "b" },
          ]} />

          <div className="relative max-w-6xl mx-auto">
            {!featured ? (
              <p className="glass rounded-2xl -mt-16 p-12 text-center text-navy/60">Posts are on the way. Check back soon.</p>
            ) : (
              <>
                {/* Featured */}
                <Link
                  href={`/blog/${featured.slug}`}
                  className="glass group relative -mt-20 md:-mt-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-0 rounded-3xl overflow-hidden opacity-0 animate-fade-up"
                  style={{ animationDelay: "240ms", background: "rgba(255,255,255,0.9)" }}
                >
                  <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-navy/5">
                    {featured.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                    )}
                  </div>
                  <div className="flex flex-col p-7 md:p-10 lg:p-12">
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy text-green text-[11px]" style={{ fontWeight: 600 }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green" aria-hidden="true" />
                        Latest
                      </span>
                      {featured.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] text-navy/65 border border-navy/10" style={{ fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                    <h2 className="text-3xl md:text-4xl leading-[1.1] mb-4 text-navy">{featured.title}</h2>
                    <p className="text-base text-navy/65 leading-relaxed mb-8 line-clamp-3" style={{ fontWeight: 400 }}>{featured.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <PostMetaLine post={featured} className="text-navy/55" />
                      <span className="inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full bg-navy text-white text-sm" style={{ fontWeight: 600 }}>
                        Read article
                        <span className="w-8 h-8 rounded-full bg-green text-navy flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>

                {rest.length > 0 && (
                  <>
                    <div className="flex items-end justify-between mt-20 md:mt-24 mb-8 pb-5 border-b border-navy/10">
                      <h2 className="text-2xl md:text-3xl text-navy">More articles</h2>
                      <p className="text-sm text-navy/50">{rest.length} posts</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rest.map((post, i) => (
                        <PostCard key={post.slug} post={post} delay={300 + Math.min(i, 5) * 60} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
