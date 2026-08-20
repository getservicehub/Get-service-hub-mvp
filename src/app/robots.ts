import type { MetadataRoute } from "next";

const BASE_URL = "https://www.getservihub.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/account",
        "/messages",
        "/messages/",
        "/favorites",
        "/admin",
        "/api/",
        "/auth/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
