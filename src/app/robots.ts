import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/019826d5-72e3-74d5-a7d5-8d52f2c3d7c9/"],
    },
    sitemap: "https://tlbr.io/sitemap.xml",
  };
}
