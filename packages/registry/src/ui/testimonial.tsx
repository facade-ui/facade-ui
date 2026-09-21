/**
 * Testimonial — a quotation with its attribution.
 *
 * a11y: the quote is a `<blockquote>` and the attribution sits in a `<figcaption>`
 * outside it, because the person's name is not part of what they said. The
 * avatar is `alt=""` — the name is already text beside it, so a second
 * announcement would be noise. A star rating renders as visually hidden text
 * ("Rated 5 out of 5") rather than as five icons a screen reader would read one
 * at a time.
 *
 * Dependencies: lucide-react, react, @/lib/types, @/lib/utils.
 */

import { StarIcon } from "lucide-react"
import type { ElementType, ReactNode } from "react"

import type { ImageComponent } from "@/lib/types"
import { cn } from "@/lib/utils"

export interface TestimonialAuthor {
  name: string
  /** Job title, company, or both — rendered as one line. */
  title?: string
  avatarSrc?: string
}

export interface TestimonialItem {
  /** The quotation, without surrounding quote marks. */
  quote: string
  author: TestimonialAuthor
  /** Whole stars out of 5. Omit to hide the rating. */
  rating?: 1 | 2 | 3 | 4 | 5
  /** Stable key when rendering a list. */
  id?: string
}

export interface TestimonialProps extends TestimonialItem {
  image?: ImageComponent
  size?: "sm" | "md" | "lg"
  /** `card` adds a bordered surface; `plain` is bare, for a single featured quote. */
  variant?: "card" | "plain"
  className?: string
  children?: ReactNode
}

const quoteSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl sm:text-2xl",
} as const

export function Testimonial({
  quote,
  author,
  rating,
  image,
  size = "md",
  variant = "card",
  className,
  children,
}: TestimonialProps) {
  const Image = (image ?? "img") as ElementType

  return (
    <figure
      className={cn(
        "flex h-full flex-col gap-6",
        variant === "card" && "bg-card text-card-foreground rounded-xl border p-6 sm:p-8",
        className,
      )}
    >
      {rating ? (
        <p className="flex items-center gap-0.5">
          <span className="sr-only">Rated {rating} out of 5</span>
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              aria-hidden
              focusable="false"
              className={cn(
                "size-4",
                index < rating ? "fill-current text-foreground" : "text-muted-foreground/40",
              )}
            />
          ))}
        </p>
      ) : null}

      <blockquote className={cn("text-foreground flex-1 text-pretty", quoteSizes[size])}>
        <p>{quote}</p>
      </blockquote>

      {children}

      <figcaption className="flex items-center gap-3">
        {author.avatarSrc ? (
          <Image
            src={author.avatarSrc}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : null}
        <span className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">{author.name}</span>
          {author.title ? (
            <span className="text-muted-foreground text-sm">{author.title}</span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  )
}
