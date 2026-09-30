import type { MetadataRoute } from "next"

import { REGISTRY_URL } from "@/lib/registry-shared"

// Previews are iframe content for the component pages, not pages of their own.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/preview/" },
    sitemap: `${REGISTRY_URL}/sitemap.xml`,
  }
}
