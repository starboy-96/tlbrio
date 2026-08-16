import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

// Pool of unique Unsplash images for auto-assignment to posts with no explicit image.
// Add new IDs here when the pool runs low — never reuse an ID already in a post's frontmatter.
const IMAGE_POOL = [
  "photo-1556155092-490a1ba16284",
  "photo-1541746972996-4e0b0f43e02a",
  "photo-1512758017271-d7b84c2113f1",
  "photo-1568992687947-868a62a9f521",
  "photo-1462899006636-339e08d1844e",
  "photo-1491336477066-31156b5e4f35",
  "photo-1498758536662-35b82cd15e29",
  "photo-1521737852567-6949f3f9f2b5",
  "photo-1444653389962-8149286c578a",
  "photo-1517694712202-14dd9538aa97",
  "photo-1512314889357-e157c22f938d",
  "photo-1499750310107-5fef28a66643",
  "photo-1488229297570-58520851e868",
  "photo-1533750516457-a7f992034fec",
  "photo-1524758631624-e2822e304c36",
  "photo-1576091160399-112ba8d25d1d",
  "photo-1543269664-76bc3997d9ea",
  "photo-1509966756634-9c23dd6e6815",
  "photo-1560179707-f14e90ef3623",
  "photo-1561489413-985b06da5bee",
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
