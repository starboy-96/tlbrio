import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function PostMetaLine({ post, className = "" }: { post: PostMeta; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-xs ${className}`}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingTime}</span>
    </p>
  );
}

export default function PostCard({ post, delay = 0 }: { post: PostMeta; delay?: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass group flex flex-col rounded-2xl overflow-hidden opacity-0 animate-fade-up transition-transform duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy/5">
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        )}
        {post.tags[0] && (
          <span className="glass-dark absolute left-3 top-3 px-2.5 py-1 rounded-full text-[11px] text-white" style={{ fontWeight: 500 }}>
            {post.tags[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg leading-snug mb-2 text-navy">{post.title}</h3>
        <p className="text-sm text-navy/60 line-clamp-2 mb-5" style={{ fontWeight: 400 }}>{post.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-navy/[0.07]">
          <PostMetaLine post={post} className="text-navy/50" />
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-navy/40 border border-navy/10 transition-colors duration-300 group-hover:bg-navy group-hover:text-green group-hover:border-navy" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
