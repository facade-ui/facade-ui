"use client"

/**
 * Controls the two independent axes of the docs theme: light/dark (the `dark`
 * class) and the Facade preset (`data-facade-theme`). Both are written straight
 * onto `<html>` and mirrored into localStorage.
 *
 * `custom` is a fourth preset, backed by a palette the reader edits in the
 * customiser panel rather than by a block in `themes.css`. It is offered only
 * once such a palette exists, and a stored `custom` with nothing behind it
 * falls back to `neutral` — otherwise the select would show a disabled option
 * as its value.
 *
 * a11y: two labelled radio groups rather than a single cycling button, so the
 * current value is always announced and reachable by keyboard.
 */

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useEffect, useSyncExternalStore } from "react"

import {
  CUSTOM_THEME_SELECTOR,
  CUSTOM_THEME_STORAGE_KEY,
  useCustomTheme,
} from "@/lib/custom-theme"
import { EDITABLE_TOKENS } from "@/lib/theme-tokens"
import { useStoredState } from "@/lib/use-stored-state"
import { cn } from "@registry/lib/utils"

export const THEME_STORAGE_KEY = "facade-docs-mode"
export const PRESET_STORAGE_KEY = "facade-docs-preset"

export type Mode = "light" | "dark" | "system"
export type Preset = "neutral" | "warm" | "vivid" | "custom"

const MODES: { value: Mode; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

/** The presets with a block in `themes.css`; `custom` is generated at runtime. */
export const SHIPPED_PRESETS = ["neutral", "warm", "vivid"] as const
export const PRESETS = [...SHIPPED_PRESETS, "custom"] as const
const MODE_VALUES = ["light", "dark", "system"] as const

export type ShippedPreset = (typeof SHIPPED_PRESETS)[number]

const darkMedia = (): MediaQueryList => window.matchMedia("(prefers-color-scheme: dark)")

export function applyMode(mode: Mode): void {
  const dark = mode === "dark" || (mode === "system" && darkMedia().matches)
  document.documentElement.classList.toggle("dark", dark)
}

export function applyPreset(preset: Preset): void {
  if (preset === "neutral") document.documentElement.removeAttribute("data-facade-theme")
  else document.documentElement.setAttribute("data-facade-theme", preset)
}

function subscribeToSystem(onChange: () => void): () => void {
  const media = darkMedia()
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/**
 * Which palette the site is actually showing, with `system` resolved.
 *
 * The customiser edits this one: you should never be dragging sliders for a
 * palette you cannot see.
 */
export function useResolvedMode(): "light" | "dark" {
  const [mode] = useStoredState<Mode>(THEME_STORAGE_KEY, MODE_VALUES, "system")
  const systemDark = useSyncExternalStore(
    subscribeToSystem,
    () => darkMedia().matches,
    () => false,
  )
  if (mode !== "system") return mode
  return systemDark ? "dark" : "light"
}

/** The stored preset, with `custom` ignored while no custom palette exists. */
export function useActivePreset(): [Preset, (next: Preset) => void, boolean] {
  const [stored, setPreset] = useStoredState<Preset>(
    PRESET_STORAGE_KEY,
    PRESETS,
    "neutral",
  )
  const [customTheme] = useCustomTheme()
  const hasCustom = customTheme !== null
  const preset = stored === "custom" && !hasCustom ? "neutral" : stored
  return [preset, setPreset, hasCustom]
}

export function ThemeSwitcher() {
  const [mode, setMode] = useStoredState<Mode>(THEME_STORAGE_KEY, MODE_VALUES, "system")
  const [preset, setPreset, hasCustom] = useActivePreset()

  // Keep the DOM in step with whichever value the store currently holds.
  useEffect(() => {
    applyMode(mode)
  }, [mode])

  useEffect(() => {
    applyPreset(preset)
  }, [preset])

  useEffect(() => {
    const media = darkMedia()
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
          // Custom cannot be chosen before there is a palette behind it.
          <option key={value} value={value} disabled={value === "custom" && !hasCustom}>
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
 *
 * For `custom` it is the stand-in for `applyCustomTheme`, writing the same
 * stylesheet from the same stored palette; the React side replaces the
 * element's text once it hydrates. Every value is checked against the shape
 * `parseCustomTheme` accepts, so nothing in storage can become arbitrary CSS,
 * and a palette that fails the check leaves the attribute unset rather than
 * theming the page with half of it.
 */
export const themeInitScript = `
(function () {
  try {
    var mode = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) || "system";
    var preset = localStorage.getItem(${JSON.stringify(PRESET_STORAGE_KEY)}) || "neutral";
    var dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    if (preset === "custom") {
      var tokens = ${JSON.stringify(EDITABLE_TOKENS)};
      var shape = /^oklch\\([^;{}]*\\)$/;
      var theme = JSON.parse(localStorage.getItem(${JSON.stringify(CUSTOM_THEME_STORAGE_KEY)}));
      var block = function (palette) {
        var out = "";
        for (var i = 0; i < tokens.length; i++) {
          var value = palette[tokens[i]];
          if (typeof value !== "string" || !shape.test(value)) return null;
          out += tokens[i] + ":" + value + ";";
        }
        return out;
      };
      var light = block(theme.light);
      var night = block(theme.dark);
      if (!light || !night) return;
      var sel = ${JSON.stringify(CUSTOM_THEME_SELECTOR)};
      var style = document.createElement("style");
      style.id = "facade-custom-theme";
      style.textContent =
        sel + "{" + light + "}" +
        ".dark" + sel + ",.dark " + sel + "," + sel + " .dark{" + night + "}";
      document.head.appendChild(style);
    }
    if (preset !== "neutral") document.documentElement.setAttribute("data-facade-theme", preset);
  } catch (e) {}
})();
`.trim()
