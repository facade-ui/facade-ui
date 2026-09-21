/**
 * LogoMark — one customer or partner logo, optionally linked.
 *
 * Handles the two things logo walls always need: a consistent optical size
 * across wildly different aspect ratios (height-constrained, width-auto), and a
 * desaturated resting state that does not also wash out the dark theme.
 *
 * a11y: a logo in a "trusted by" wall is decorative *as an image* — the company
 * name is the information. So the image carries `alt=""` and the name is exposed
 * as visually hidden text, which keeps the wall readable without a screen reader
 * announcing "image, Acme logo" for every item. Set `showName` to make it
 * visible instead.
 *
 * Dependencies: react, @/lib/types, @/lib/utils.
 */

import type { ElementType } from "react"

import type { ImageComponent, LinkComponent } from "@registry/lib/types"
import { cn } from "@registry/lib/utils"

export interface LogoItem {
  /** Company name. Always exposed to assistive tech. */
  name: string
  src?: string
  width?: number
  height?: number
  /** Links the logo. Omit for a non-interactive wall. */
  href?: string
}

export interface LogoMarkProps extends LogoItem {
  /** Drop-in for `next/image`. Defaults to `"img"`. */
  image?: ImageComponent
  /** Drop-in for `next/link`. Defaults to `"a"`. */
  link?: LinkComponent
  /** Rendered height in px. Width follows the intrinsic ratio. */
  size?: "sm" | "md" | "lg"
  /** Desaturate until hover/focus. Default `true`. */
  muted?: boolean
  /** Show the name as text instead of hiding it. */
  showName?: boolean
  className?: string
}

const heights = { sm: "h-6", md: "h-8", lg: "h-10" } as const

export function LogoMark({
  name,
  src,
  href,
  width,
  height,
  image,
  link,
  size = "md",
  muted = true,
  showName = false,
  className,
}: LogoMarkProps) {
  const Image = (image ?? "img") as ElementType
  const Link = (link ?? "a") as ElementType

  const content = src ? (
    <>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={cn("w-auto object-contain", heights[size])}
      />
      <span
        className={showName ? "text-muted-foreground text-sm font-medium" : "sr-only"}
      >
        {name}
      </span>
    </>
  ) : (
    <span
      className={cn(
        "text-muted-foreground text-lg font-semibold tracking-tight",
        heights[size],
        "flex items-center",
      )}
    >
      {name}
    </span>
  )

  const shared = cn(
    "inline-flex items-center gap-2",
    muted &&
      "duration-facade-base ease-facade-out opacity-70 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0",
    className,
  )

  if (!href) {
    return <span className={shared}>{content}</span>
  }

  return (
    <Link
      href={href}
      className={cn(
        shared,
        "focus-visible:ring-ring focus-visible:ring-offset-background rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-4",
      )}
    >
      {content}
    </Link>
  )
}
