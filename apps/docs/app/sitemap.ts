import type { MetadataRoute } from "next"

import { getRegistryItems } from "@/lib/registry"
import { REGISTRY_URL } from "@/lib/registry-shared"

const GUIDES = ["installation", "theming", "customise", "accessibility", "agents"]

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${REGISTRY_URL}${path}`
  return [
    { url: url("/"), priority: 1 },
    { url: url("/components"), priority: 0.9 },
    { url: url("/templates"), priority: 0.9 },
    ...getRegistryItems()
      .filter((item) => item.categories?.includes("template"))
      .map((item) => ({ url: url(`/templates/${item.name}`), priority: 0.8 })),
    ...GUIDES.map((slug) => ({ url: url(`/docs/${slug}`), priority: 0.8 })),
    ...getRegistryItems().map((item) => ({
      url: url(`/components/${item.name}`),
      priority: 0.7,
    })),
  ]
}
