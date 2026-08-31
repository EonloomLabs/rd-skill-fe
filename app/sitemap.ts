import type { MetadataRoute } from "next";

import { getDataset, getDocPages } from "@/lib/skills";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const { skills, generatedAt } = getDataset();
  const lastModified = new Date(generatedAt);

  const pages = ["", "/architecture", "/skills", "/quickstart", "/docs"].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    priority: route === "" ? 1 : 0.8,
  }));

  const skillPages = skills.map((skill) => ({
    url: `${SITE.url}/skills/${skill.slug}`,
    lastModified,
    priority: skill.runtimeTopLevel ? 0.7 : 0.5,
  }));

  const docPages = getDocPages().map((doc) => ({
    url: `${SITE.url}/docs/${doc.slug}`,
    lastModified,
    priority: 0.6,
  }));

  return [...pages, ...docPages, ...skillPages];
}
