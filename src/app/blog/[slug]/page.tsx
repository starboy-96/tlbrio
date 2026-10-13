import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import Ambient from "@/components/Ambient";
import DarkBackdrop from "@/components/blog/DarkBackdrop";
import PostCard, { formatDate } from "@/components/blog/PostCard";
import { renderMarkdown } from "@/lib/markdown";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `https://tlbr.io/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://tlbr.io/blog/${slug}`,
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image ?? "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image ?? "/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const others = getAllPosts().filter((p) => p.slug !== slug);
  const related = [
    ...others.filter((p) => p.tags.some((t) => post.tags.includes(t))),
    ...others.filter((p) => !p.tags.some((t) => post.tags.includes(t))),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: post.author },
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "tlbr.io",
      url: "https://tlbr.io",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://tlbr.io/blog/${post.slug}` },
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main id="main" className="flex flex-col flex-1">
        {/* Header */}
        <header data-nav="dark" className="on-dark relative overflow-hidden bg-navy px-6 md:px-12 pt-32 md:pt-36 pb-44 md:pb-56">
          <DarkBackdrop />
          <div className="relative max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="glass-dark inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full text-sm text-white/80 hover:text-white transition-colors mb-10 group opacity-0 animate-fade-up"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true">←</span>
              All articles
            </Link>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs text-green border border-green/30 bg-green/10" style={{ fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1
              className="text-white leading-[1.06] mb-6 opacity-0 animate-fade-up"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.02em", animationDelay: "120ms" }}
            >
              {post.title}
            </h1>
            {post.description && (
              <p className="text-lg md:text-xl leading-relaxed max-w-3xl mb-8 opacity-0 animate-fade-up" style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400, animationDelay: "180ms" }}>
                {post.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/65 opacity-0 animate-fade-up" style={{ animationDelay: "240ms" }}>
              <span className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-green text-navy flex items-center justify-center text-sm" style={{ fontFamily: '"Cal Sans", sans-serif' }} aria-hidden="true">t</span>
                {post.author}
              </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="relative bg-[#fafafa] px-6 md:px-12 pb-24 md:pb-32">
          <Ambient blobs={[
            { color: "rgba(148,229,97,0.36)", size: "44vw", top: "18%", right: "-16%" },
            { color: "rgba(90,150,255,0.2)", size: "40vw", top: "55%", left: "-18%", drift: "b" },
          ]} />

          {/* Cover */}
          {post.image && (
            <div className="relative max-w-5xl mx-auto -mt-32 md:-mt-44 mb-16 md:mb-20 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="glass rounded-[1.75rem] p-2 md:p-3">
                <div className="rounded-[1.25rem] overflow-hidden aspect-[2/1] bg-navy/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}

          {/* Article + aside */}
          <div className={`relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-12 lg:gap-16 ${post.image ? "" : "pt-16"}`}>
            <article
              className="prose-tlbr min-w-0 max-w-[680px]"
              style={{ fontWeight: 400 }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content, post.title) }}
            />

            <aside className="hidden lg:block">
              <div className="glass sticky top-28 rounded-2xl p-6">
                <p className="section-label mb-3">tlbr.io</p>
                <p className="text-xl leading-snug text-navy mb-3" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                  Every deck, on brand. In one click.
                </p>
                <p className="text-sm text-navy/60 leading-relaxed mb-5" style={{ fontWeight: 400 }}>
                  A bespoke PowerPoint toolbar for firms of 100–1,500 people.
                </p>
                <a href="/#demo" className="group flex items-center justify-between pl-5 pr-1.5 py-1.5 rounded-full bg-navy text-white text-sm hover:bg-[#13294a] transition-colors" style={{ fontWeight: 600 }}>
                  Book a demo
                  <span className="w-8 h-8 rounded-full bg-green text-navy flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </a>
              </div>
            </aside>
          </div>

          {/* Demo panel */}
          <section data-nav="dark" className="on-dark relative max-w-5xl mx-auto mt-20 md:mt-24 rounded-3xl overflow-hidden bg-navy px-7 py-12 md:px-14 md:py-16">
            <Ambient blobs={[
              { color: "rgba(148,229,97,0.3)", size: "60%", top: "-40%", right: "-10%" },
              { color: "rgba(70,130,255,0.22)", size: "55%", bottom: "-50%", left: "-10%", drift: "b" },
            ]} />
            <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="max-w-xl">
                <p className="section-label mb-4">See it in action</p>
                <h2 className="text-white leading-[1.08] mb-4" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)" }}>
                  See tlbr.io in <span className="gradient-text">your firm&apos;s brand</span>
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
                  A 30-minute walkthrough of the toolbar. No hard sell, just the product.
                </p>
              </div>
              <a href="/#demo" className="group flex-shrink-0 inline-flex items-center gap-3 pl-7 pr-2 py-2 rounded-full bg-green text-navy text-[15px] hover:bg-green-light transition-colors shadow-[0_10px_40px_-8px_rgba(148,229,97,0.6)]" style={{ fontWeight: 600 }}>
                Book a Demo
                <span className="w-10 h-10 rounded-full bg-navy text-green flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </a>
            </div>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className="relative max-w-5xl mx-auto mt-20 md:mt-24" aria-label="More articles">
              <div className="flex items-end justify-between mb-8 pb-5 border-b border-navy/10">
                <h2 className="text-2xl md:text-3xl text-navy">Keep reading</h2>
                <Link href="/blog" className="text-sm text-navy/60 hover:text-navy transition-colors">All articles →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
