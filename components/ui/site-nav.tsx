"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { NAV, SITE } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GithubLink } from "@/components/ui/github-link";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/85 backdrop-blur-md">
      <div className="wrap flex h-14 items-center justify-between gap-6">
        <Link
          href="/"
          className="ident text-[0.9375rem] font-medium tracking-tight text-ink no-underline"
        >
          {SITE.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-md px-2.5 py-1.5 text-[0.8125rem] no-underline transition-colors duration-150 ${
                isActive(item.href)
                  ? "text-ink"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <GithubLink />
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={15} aria-hidden="true" /> : <Menu size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-line bg-surface md:hidden"
        >
          <div className="wrap flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-md px-2 py-2.5 text-sm no-underline ${
                  isActive(item.href) ? "text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
