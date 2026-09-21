/**
 * Shared contracts for every Facade UI section.
 *
 * Framework neutrality: nothing here imports from `next/*`. Sections that render
 * images or links inside data-driven lists take a *component type* rather than a
 * render callback, so `next/image` and `next/link` can be handed over directly
 * and still work inside React Server Components:
 *
 *   import Image from "next/image"
 *   <LogoCloud items={logos} image={Image} />
 *
 * One-off media uses a `media` ReactNode slot instead — no indirection needed.
 *
 * a11y: `HeadingLevel` exists so a section never hard-codes `<h2>`. Whoever
 * places the section knows the surrounding outline; the section does not.
 *
 * Dependencies: react (types only).
 */

import type { ElementType, ReactNode } from "react"

/** `<h1>` is reserved for the page; sections start at `<h2>`. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/** Maps a heading level to its tag. Use the `Heading` atom to render one. */
export type HeadingTag = `h${HeadingLevel}`

/**
 * The subset of image props Facade sections pass through. Intentionally all
 * valid DOM attributes so the default `"img"` element works unchanged, while
 * remaining a structural match for `next/image`.
 */
export interface FacadeImageProps {
  src: string
  /** Required. Pass `""` only for images that are genuinely decorative. */
  alt: string
  width?: number
  height?: number
  className?: string
  sizes?: string
  loading?: "eager" | "lazy"
  decoding?: "async" | "auto" | "sync"
  fetchPriority?: "high" | "low" | "auto"
}

/** Drop-in for `next/image`, or the default `"img"`. */
export type ImageComponent = ElementType<FacadeImageProps>

/** The subset of anchor props Facade sections pass through. */
export interface FacadeLinkProps {
  href: string
  children?: ReactNode
  className?: string
  target?: string
  rel?: string
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false"
  "aria-label"?: string
}

/** Drop-in for `next/link`, or the default `"a"`. */
export type LinkComponent = ElementType<FacadeLinkProps>

/**
 * Any icon component. Structural rather than nominal, so `lucide-react`,
 * `@heroicons/react`, a local SVG component, or anything else that accepts
 * SVG props can be passed without the registry depending on that library.
 */
export type IconComponent = ElementType<{
  className?: string
  "aria-hidden"?: boolean | "true" | "false"
  strokeWidth?: number | string
  focusable?: boolean | "true" | "false"
}>

/** A call to action rendered by `CtaGroup` and by most sections' `actions` slot. */
export interface CtaItem {
  label: string
  href: string
  /** Defaults to `primary` for the first action and `outline` for the rest. */
  variant?: "primary" | "secondary" | "outline" | "ghost"
  /** Set for links that leave the site; adds `rel="noopener noreferrer"`. */
  external?: boolean
  "aria-label"?: string
}

/** Props shared by every section: outline control plus a styling hook. */
export interface SectionBaseProps {
  /** Heading level for the section's own title. Defaults to `2`. */
  headingLevel?: HeadingLevel
  /** Root element. Defaults to `"section"`. Use `"div"` when already inside one. */
  as?: "section" | "div" | "article" | "aside"
  className?: string
  /** Vertical rhythm. Maps to the `--facade-section-y*` tokens. */
  spacing?: "sm" | "md" | "lg" | "none"
  id?: string
}
