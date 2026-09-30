/**
 * The Facade UI brand mark: an F of three bars on a rounded tile.
 *
 * Painted in `--primary` and `--primary-foreground`, so it follows the theme.
 * It is the same drawing as the favicon (`app/icon.svg`), on a 40-unit grid so
 * every edge lands on a whole pixel at `size-5`.
 *
 * a11y: decorative beside the wordmark. Pass a `title` only when the mark
 * stands alone as the link's accessible name.
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
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <rect width="40" height="40" rx="8" className="fill-primary" />
      <g className="fill-primary-foreground">
        <rect x="8" y="8" width="24" height="4" rx="1.5" />
        <rect x="8" y="18" width="16" height="4" rx="1.5" />
        <rect x="8" y="28" width="10" height="4" rx="1.5" />
      </g>
    </svg>
  )
}
