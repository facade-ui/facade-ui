"use client"

/**
 * The theme customiser as a panel pinned to the side of the viewport.
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
 * that must stay legible while you drag `--foreground` onto `--background`;
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
import { useResolvedMode } from "./theme-switcher"

const shipped = palettes as Record<string, Palette>

export function ThemeCustomiserPanel() {
  const [open, setOpen] = useState(false)
  const mode = useResolvedMode()

  const safePalette = useMemo(() => {
    const palette = shipped[`neutral-${mode}`]!
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
          // globals.css reserves room for the panel from `lg` while this is in
          // the DOM, so the page being themed is never hidden underneath it.
          data-facade-customiser=""
          style={safePalette}
          className={cn(
            "bg-background text-foreground duration-facade-base ease-facade-out fixed z-50 flex flex-col gap-4 overflow-y-auto border p-5 shadow-lg transition-[opacity,transform]",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            // A sheet from the bottom on small screens, a rail on the right
            // from lg — the same breakpoint the sidebar appears at.
            "inset-x-0 bottom-0 max-h-[75dvh] rounded-t-xl",
            "data-[ending-style]:translate-y-4 data-[starting-style]:translate-y-4",
            "lg:inset-x-auto lg:bottom-4 lg:right-4 lg:top-20 lg:max-h-none lg:w-80 lg:rounded-xl",
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
            Changes apply to the whole site as you drag, previews included.
          </Dialog.Description>
          <ThemeCustomiser />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
