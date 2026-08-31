"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";

const MODES: { value: Mode; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light theme" },
  { value: "dark", icon: Moon, label: "Dark theme" },
  { value: "system", icon: Monitor, label: "Match system theme" },
];

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
  try {
    localStorage.setItem("rd-theme", mode);
  } catch {
    /* storage can be unavailable; the page still renders correctly */
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("rd-theme");
    } catch {
      stored = null;
    }
    if (stored === "light" || stored === "dark" || stored === "system") setMode(stored);
    setReady(true);
  }, []);

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5"
      role="radiogroup"
      aria-label="Theme"
    >
      {MODES.map(({ value, icon: Icon, label }) => {
        const active = ready && mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => {
              setMode(value);
              apply(value);
            }}
            className={`grid h-6 w-6 place-items-center rounded-md transition-colors duration-150 ${
              active ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"
            }`}
          >
            <Icon size={13} strokeWidth={2} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
