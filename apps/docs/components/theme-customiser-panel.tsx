"use client"

/**
 * The theme customiser as a panel floating over the side of the viewport.
 *
 * It floats: the page underneath keeps exactly the layout it had. An earlier
 * version reserved a gutter for the panel so nothing sat beneath it, which
 * meant opening the tool reflowed the very page you had opened it to look at —
 * every line re-wrapped, every preview iframe changed width. A palette is
 * judged on a layout you recognise, and the panel covers a column of it at
 * most; the rest, and everything you scroll to, is untouched.
 *
 * It is a dialog, but deliberately not a modal one: the whole point is to keep
 * reading, scrolling and clicking through the docs while the palette changes
 * under you. `modal={false}` drops the scroll lock, the backdrop and the
 * `inert` on everything behind it, and leaves Escape working.
 *
 * `disablePointerDismissal` reads like it is only about outside clicks. It is
 * not: Base UI wires the same flag to `closeOnFocusOut`, so without it, tabbing
 * out of the panel — into the very page you are theming — would close it.
 *
 * The popup pins its own colours to the shipped palette with inline custom
 * properties. The site is the preview now, so the controls are the one surface
 * that must stay legible while you set `--foreground` to `--background`;
 * editing a broken theme must not break the tool you are using to fix it.
 *
 * a11y: a named dialog with a described purpose, a labelled trigger, and only
 * opacity and transform animated on the way in and out.
 */

import { Dialog } from "@base-ui-components/react/dialog"
import { PaletteIcon, XIcon } from "lucide-react"
import { useMemo, useState, type CSSProperties } from "react"

import palettes from "@/.generated/palettes.json"
import { EDITABLE_TOKENS, type Palette } from "@/lib/theme-tokens"
import { buttonVariants } from "@registry/ui/button"
import { cn } from "@registry/lib/utils"
import { ThemeCustomiser } from "./theme-customiser"
import { DEFAULT_PRESET, useResolvedMode } from "./theme-switcher"

const shipped = palettes as Record<string, Palette>

export function ThemeCustomiserPanel() {
  const [open, setOpen] = useState(false)
  const mode = useResolvedMode()

  const safePalette = useMemo(() => {
    const palette = shipped[`${DEFAULT_PRESET}-${mode}`]!
    return Object.fromEntries(
      EDITABLE_TOKENS.map((token) => [token, palette[token]]),
    ) as CSSProperties
  }, [mode])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false} disablePointerDismissal>
      {/* buttonVariants, not render={<Button />}: Base UI inspects the element
          handed to `render` to decide whether it is a native button, and cannot
          see through a wrapper component — so it warns on every mount even
          though the DOM ends up correct. Base UI renders a real <button> here.

          Hidden below `sm`, where the header's own controls already fill the
          row and a side panel is the wrong shape for the screen anyway. */}
      <Dialog.Trigger
        aria-label="Customise theme"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "hidden sm:inline-flex",
        )}
      >
        <PaletteIcon aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup
          style={safePalette}
          className={cn(
            "bg-background text-foreground duration-facade-base ease-facade-out fixed z-50 flex flex-col gap-4 overflow-y-auto border p-5 shadow-xl transition-[opacity,transform]",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            // A sheet from the bottom on small screens, a card in the top right
            // corner from lg — the same breakpoint the sidebar appears at. The
            // card is only as tall as its controls, so with Advanced closed it
            // covers a corner of the page rather than a whole column.
            "inset-x-0 bottom-0 max-h-[75dvh] rounded-t-xl",
            "data-[ending-style]:translate-y-4 data-[starting-style]:translate-y-4",
            "lg:inset-x-auto lg:bottom-auto lg:right-4 lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:w-80 lg:rounded-xl",
            "lg:data-[ending-style]:translate-x-4 lg:data-[ending-style]:translate-y-0 lg:data-[starting-style]:translate-x-4 lg:data-[starting-style]:translate-y-0",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <Dialog.Title className="text-base font-semibold">
              Customise theme
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close customiser"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <XIcon aria-hidden />
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-muted-foreground text-pretty text-sm">
            Changes apply to the whole site as you make them, previews included.
          </Dialog.Description>
          <ThemeCustomiser />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
