/**
 * The Facade UI brand mark: two rotated panels, the lower one a three-pane
 * frame — a facade seen at an angle.
 *
 * The geometry fills its 960 viewBox almost edge to edge, so the component can
 * be sized as a plain square (`h-5 w-5`) and will sit optically level with
 * adjacent text without any nudging.
 *
 * The frame’s stroke is a uniform 72 units. Both panels stay 675.1 × 336.1, so
 * a heavier stroke narrows the three windows rather than growing the mark —
 * which is what keeps it legible down at favicon sizes.
 *
 * Painted in `currentColor` so it inherits the theme rather than carrying its
 * own palette — the same mark reads on the light and dark backgrounds, and on
 * the muted surfaces inside the drawer.
 *
 * a11y: decorative wherever it appears beside the wordmark, which already names
 * the site. Pass a `title` only when the mark stands alone as the link's whole
 * accessible name.
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
      viewBox="0 0 960 960"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {/* Top solid panel */}
      <g transform="translate(385.8 316.7) rotate(-30)">
        <rect
          x="-337.55"
          y="-168.05"
          width="675.1"
          height="336.1"
          rx="16"
          fill="currentColor"
        />
      </g>

      {/* Bottom three-panel frame */}
      <g transform="translate(573.8 642.4) rotate(-30)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="
            M -321.55 -168.05
            H 321.55
            Q 337.55 -168.05 337.55 -152.05
            V 152.05
            Q 337.55 168.05 321.55 168.05
            H -321.55
            Q -337.55 168.05 -337.55 152.05
            V -152.05
            Q -337.55 -168.05 -321.55 -168.05
            Z

            M -251.55 -96.05
            H -150.52
            Q -136.52 -96.05 -136.52 -82.05
            V 82.05
            Q -136.52 96.05 -150.52 96.05
            H -251.55
            Q -265.55 96.05 -265.55 82.05
            V -82.05
            Q -265.55 -96.05 -251.55 -96.05
            Z

            M -64.52 -96.05
            H 64.52
            V 96.05
            H -64.52
            Z

            M 150.52 -96.05
            H 251.55
            Q 265.55 -96.05 265.55 -82.05
            V 82.05
            Q 265.55 96.05 251.55 96.05
            H 150.52
            Q 136.52 96.05 136.52 82.05
            V -82.05
            Q 136.52 -96.05 150.52 -96.05
            Z
          "
        />
      </g>
    </svg>
  )
}
