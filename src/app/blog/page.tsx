import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog – Presentation design, brand consistency & PowerPoint tips",
  description:
    "Insights on presentation design, brand consistency, and making the most of PowerPoint for your team – from the tlbr.io team.",
  openGraph: {
    title: "Blog | tlbr.io",
    description:
      "Insights on presentation design, brand consistency, and making the most of PowerPoint for your team.",
    type: "website",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="mb-16">
            <p className="section-label mb-3">Blog</p>
            <h1
              className="text-4xl md:text-5xl mb-4"
              style={{ fontFamily: '"Cal Sans", sans-serif' }}
            >
              Insights & ideas
            </h1>
            <p
              className="text-lg text-navy/55 max-w-xl"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
            >
              Presentation design, brand consistency, and getting more from
              PowerPoint – straight from the tlbr.io team.
            </p>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p
                className="text-navy/40 text-lg"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
              >
                Posts are on the way. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-px bg-navy/5 rounded-2xl overflow-hidden border border-navy/5">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#fafafa] hover:bg-green-xlight transition-colors duration-200"
                  aria-label={`Read: ${post.title}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] bg-green-xlight text-navy/50 border border-navy/6"
                          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2
                      className="text-lg text-navy group-hover:text-navy truncate mb-1"
                      style={{ fontFamily: '"Cal Sans", sans-serif' }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="text-sm text-navy/50 line-clamp-1"
                      style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
                    >
                      {post.description}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-4">
                    <div className="text-right">
                      <p
                        className="text-xs text-navy/40"
                        style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
                      >
                        {formatDate(post.date)}
                      </p>
                      <p
                        className="text-xs text-navy/35"
                        style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
                      >
                        {post.readingTime}
                      </p>
                    </div>
                    <span className="text-navy/25 group-hover:text-green transition-colors duration-200 text-lg">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
