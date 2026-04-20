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
        <div className="max-w-5xl mx-auto w-full">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-navy/8 bg-[#fafafa] hover:border-navy/20 transition-all duration-200 hover:shadow-md"
                  aria-label={`Read: ${post.title}`}
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-[16/9] bg-navy/5 overflow-hidden flex-shrink-0">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy/8 to-green/10" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
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
                      className="text-lg text-navy leading-snug mb-2 group-hover:text-navy"
                      style={{ fontFamily: '"Cal Sans", sans-serif' }}
                    >
                      {post.title}
                    </h2>

                    <p
                      className="text-sm text-navy/50 line-clamp-2 mb-4 flex-1"
                      style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
                    >
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-navy/6">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs text-navy/40"
                          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
                        >
                          {formatDate(post.date)}
                        </span>
                        <span className="text-navy/20 text-xs">·</span>
                        <span
                          className="text-xs text-navy/35"
                          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300 }}
                        >
                          {post.readingTime}
                        </span>
                      </div>
                      <span className="text-navy/25 group-hover:text-green transition-colors duration-200 text-sm">
                        →
                      </span>
                    </div>
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
