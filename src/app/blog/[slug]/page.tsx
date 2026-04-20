import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Simple markdown-to-HTML renderer (no external dependencies)
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-xl mt-8 mb-3" style="font-family:\'Cal Sans\',sans-serif">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl mt-10 mb-4" style="font-family:\'Cal Sans\',sans-serif">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl mt-12 mb-5" style="font-family:\'Cal Sans\',sans-serif">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-navy">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-green underline underline-offset-2 hover:text-navy transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="flex gap-2"><span class="text-green mt-0.5">•</span><span>$1</span></li>')
    // Wrap list items
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul class="space-y-2 my-4 text-navy/65">${m}</ul>`)
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-navy/4 rounded-xl p-4 overflow-x-auto my-6 text-sm font-mono"><code>$1</code></pre>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="bg-navy/6 px-1.5 py-0.5 rounded text-sm font-mono text-navy/80">$1</code>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-green pl-4 my-4 text-navy/60 italic">$1</blockquote>')
    // Paragraphs (lines not already wrapped)
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p class="mb-4 text-navy/65 leading-relaxed">$1</p>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-navy/10 my-8"/>');
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

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
      <main className="flex flex-col flex-1 pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-navy/45 hover:text-navy transition-colors mb-10 group"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
          >
            <span className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span>
            Back to blog
          </Link>

          {/* Meta */}
          <div className="mb-8">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-green-xlight text-navy/60 border border-navy/6"
                    style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1
              className="text-3xl md:text-4xl mb-4 leading-tight"
              style={{ fontFamily: '"Cal Sans", sans-serif' }}
            >
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-navy/40">
              <span style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}>
                {formatDate(post.date)}
              </span>
              <span>·</span>
              <span style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}>
                {post.readingTime}
              </span>
              <span>·</span>
              <span style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}>
                {post.author}
              </span>
            </div>
          </div>

          {/* Cover image */}
          {post.image && (
            <div className="rounded-2xl overflow-hidden mb-10 aspect-[2/1] bg-navy/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Divider */}
          {!post.image && <div className="h-px bg-navy/8 mb-10" />}

          {/* Content */}
          <article
            className="prose-tlbr"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Footer CTA */}
          <div className="mt-16 p-6 rounded-2xl bg-navy text-white text-center">
            <p
              className="text-lg mb-2"
              style={{ fontFamily: '"Cal Sans", sans-serif', color: "white" }}
            >
              See tlbr.io in action
            </p>
            <p
              className="text-sm mb-5"
              style={{
                fontFamily: '"General Sans", sans-serif',
                fontWeight: 300,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              30-minute demo. No hard sell – just the product.
            </p>
            <a
              href="/#demo"
              className="inline-flex px-6 py-2.5 rounded-full text-sm font-medium bg-green text-navy hover:bg-green-light transition-colors"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            >
              Book a Demo →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
