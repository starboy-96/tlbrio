import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

// Hand-vetted Unsplash images for posts with no explicit image: business context, no non-English text.
// Keep in sync with SAFE_FALLBACKS in scripts/pick-image.py.
const IMAGE_POOL = [
  "photo-1556155092-490a1ba16284",
  "photo-1499750310107-5fef28a66643",
  "photo-1533750516457-a7f992034fec",
  "photo-1512758017271-d7b84c2113f1",
  "photo-1561489413-985b06da5bee",
  "photo-1454165804606-c3d57bc86b40",
  "photo-1521737852567-6949f3f9f2b5",
  "photo-1568992687947-868a62a9f521",
  "photo-1541746972996-4e0b0f43e02a",
  "photo-1444653389962-8149286c578a",
].map((id) => `https://images.unsplash.com/${id}?w=1200&auto=format&q=80`);

function slugToImageIndex(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = Math.imul(31, hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % IMAGE_POOL.length;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  readingTime: string;
  image?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function estimateReadingTime(text: string): string {
  const wpm = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wpm);
  return `${minutes} min read`;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: data.title ?? "Untitled",
        description: data.description ?? "",
        date: data.date ?? new Date().toISOString().split("T")[0],
        tags: data.tags ?? [],
        author: data.author ?? "tlbr.io",
        readingTime: estimateReadingTime(content),
        image: data.image ?? IMAGE_POOL[slugToImageIndex(slug)],
      } satisfies PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "Untitled",
    description: data.description ?? "",
    date: data.date ?? new Date().toISOString().split("T")[0],
    tags: data.tags ?? [],
    author: data.author ?? "tlbr.io",
    readingTime: estimateReadingTime(content),
    image: data.image ?? IMAGE_POOL[slugToImageIndex(slug)],
    content,
  };
}
