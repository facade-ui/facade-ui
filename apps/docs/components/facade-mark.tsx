/**
 * The Facade UI brand mark: an F made of three bars, each shorter than the one
 * above, inside a thin rounded frame.
 *
 * The bars are the letter and they are also the product — sections stacked down
 * a page, seen through the frame of a window. The middle one is the brand
 * colour; it is the only part of the mark that is.
 *
 * The geometry is drawn on a 40-unit grid and fills it edge to edge, so the
 * component can be sized as a plain square (`size-5`) and will sit optically
 * level with adjacent text without any nudging. At that size one unit is half
 * a pixel, and every edge below lands on a whole one: a 1px frame, 2px bars,
 * 3px gaps. A mark this light has no weight to spare on anti-aliasing.
 *
 * The F is as wide as it is tall — 24 units each way, with the same 8 between
 * it and the frame on every side. A letter that tapers to the bottom left
 * already pulls that way; giving it a narrower box than the frame's made it
 * look adrift in one corner.
 *
 * Painted in `currentColor` and `--primary`, so it inherits the theme rather
 * than carrying its own palette — the same mark reads on the light and dark
 * backgrounds and on the muted surfaces inside the drawer, and takes whatever
 * brand colour the customiser is showing. The favicon cannot inherit anything,
 * so `app/icon.svg` is a separate drawing: the frame filled in as an orange
 * tile, with heavier bars that still resolve at 16px.
 *
 * a11y: decorative wherever it appears beside the wordmark, which already names
 * the site. Pass a `title` only when the mark stands alone as the link's whole
 * accessible name. The brand-coloured bar is a shape, not text, so it is held
 * to 3:1 against the background — which every theme's `--primary` clears.
 */

export interface FacadeMarkProps {
  className?: string
  /** Names the mark for assistive tech. Omit when a wordmark sits beside it. */
  title?: string
}

export function FacadeMark({ className, title }: FacadeMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="8" y="8" width="24" height="4" rx="2" fill="currentColor" />
      <rect x="8" y="18" width="16" height="4" rx="2" className="fill-primary" />
      <rect x="8" y="28" width="10" height="4" rx="2" fill="currentColor" />
    </svg>
  )
}
