export const SITE = {
  name: "rd-skills",
  tagline: "Engineering control plane for AI coding agents.",
  description:
    "rd-skills gives AI coding agents explicit task boundaries, professional engineering skills, independent review, targeted validation, and evidence-driven completion.",
  url: "https://rd-skills.dev",
  repo: "https://github.com/machenjie/rd-skills",
} as const;

export const NAV = [
  { href: "/", label: "Product" },
  { href: "/architecture", label: "Architecture" },
  { href: "/skills", label: "Skills" },
  { href: "/quickstart", label: "Get started" },
  { href: "/docs", label: "Docs" },
] as const;
