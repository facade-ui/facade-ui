"use client"

/**
 * Controls the two independent axes of the docs theme: light/dark (the `dark`
 * class) and the Facade preset (`data-facade-theme`). Both are written straight
 * onto `<html>` and mirrored into localStorage.
 *
 * a11y: two labelled radio groups rather than a single cycling button, so the
 * current value is always announced and reachable by keyboard.
 */

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useEffect } from "react"

import { useStoredState } from "@/lib/use-stored-state"
import { cn } from "@registry/lib/utils"

export const THEME_STORAGE_KEY = "facade-docs-mode"
export const PRESET_STORAGE_KEY = "facade-docs-preset"

export type Mode = "light" | "dark" | "system"
export type Preset = "neutral" | "warm" | "vivid"

const MODES: { value: Mode; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

const PRESETS = ["neutral", "warm", "vivid"] as const
const MODE_VALUES = ["light", "dark", "system"] as const

const prefersDark = (): boolean =>
  window.matchMedia("(prefers-color-scheme: dark)").matches

export function applyMode(mode: Mode): void {
  const dark = mode === "dark" || (mode === "system" && prefersDark())
  document.documentElement.classList.toggle("dark", dark)
}

export function applyPreset(preset: Preset): void {
  if (preset === "neutral") document.documentElement.removeAttribute("data-facade-theme")
  else document.documentElement.setAttribute("data-facade-theme", preset)
}

export function ThemeSwitcher() {
  const [mode, setMode] = useStoredState<Mode>(THEME_STORAGE_KEY, MODE_VALUES, "system")
  const [preset, setPreset] = useStoredState<Preset>(
    PRESET_STORAGE_KEY,
    PRESETS,
    "neutral",
  )

  // Keep the DOM in step with whichever value the store currently holds.
  useEffect(() => {
    applyMode(mode)
  }, [mode])

  useEffect(() => {
    applyPreset(preset)
  }, [preset])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => {
      if (mode === "system") applyMode("system")
    }
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [mode])

  return (
    <div className="flex items-center gap-2">
      <fieldset className="border-border flex items-center gap-0.5 rounded-lg border p-0.5">
        <legend className="sr-only">Colour mode</legend>
        {MODES.map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors",
              "has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-2",
              mode === value
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <input
              type="radio"
              name="facade-docs-mode"
              value={value}
              checked={mode === value}
              onChange={() => setMode(value)}
              aria-label={label}
              className="sr-only"
            />
            <Icon aria-hidden className="size-4" />
          </label>
        ))}
      </fieldset>

      <label className="sr-only" htmlFor="facade-docs-preset">
        Theme preset
      </label>
      <select
        id="facade-docs-preset"
        value={preset}
        onChange={(event) => setPreset(event.target.value as Preset)}
        className="border-border bg-background text-foreground focus-visible:ring-ring h-9 rounded-lg border px-2 text-sm capitalize focus-visible:outline-none focus-visible:ring-2"
      >
        {PRESETS.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * Runs before paint to stop the page flashing the wrong theme. Inlined as a
 * string in the root layout, which is the only way to beat first paint.
 */
export const themeInitScript = `
(function () {
  try {
    var mode = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) || "system";
    var preset = localStorage.getItem(${JSON.stringify(PRESET_STORAGE_KEY)}) || "neutral";
    var dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    if (preset !== "neutral") document.documentElement.setAttribute("data-facade-theme", preset);
  } catch (e) {}
})();
`.trim()
