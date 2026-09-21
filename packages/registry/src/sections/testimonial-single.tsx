/**
 * TestimonialSingle — one quote, given the whole band.
 *
 * The featured counterpart to `TestimonialsGrid`: a single quote at display
 * size, optionally beside a portrait or over a tinted surface.
 *
 * a11y: as with every testimonial, the quote is a `<blockquote>` and the
 * attribution a `<figcaption>` outside it. The company logo, when given, is
 * `alt=""` — the company name is already in the attribution text, so announcing
 * both would be noise.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/section, @registry/ui/testimonial.
 */

import type { ElementType, ReactNode } from "react"

import type { ImageComponent, SectionBaseProps } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { Section } from "@registry/ui/section"
import { Testimonial, type TestimonialItem } from "@registry/ui/testimonial"

export interface TestimonialSingleProps extends Omit<SectionBaseProps, "headingLevel"> {
  item: TestimonialItem
  image?: ImageComponent
  /** Visually hidden section name, so the band can still be a landmark. */
  title?: string
  /** Company logo shown above the quote. Decorative. */
  logoSrc?: string
  logoAlt?: string
  /** Portrait or media beside the quote. */
  media?: ReactNode
  variant?: "plain" | "muted" | "card"
  align?: "start" | "center"
  children?: ReactNode
}

const surfaces = {
  plain: "",
  muted: "bg-muted rounded-2xl px-6 py-12 sm:px-12",
  card: "bg-card text-card-foreground rounded-2xl border px-6 py-12 sm:px-12",
} as const

export function TestimonialSingle({
  item,
  image,
  title,
  logoSrc,
  logoAlt = "",
  media,
  variant = "plain",
  align = "center",
  as,
  spacing = "md",
  className,
  id,
  children,
}: TestimonialSingleProps) {
  const Image = (image ?? "img") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined

  return (
    <Section
      as={as ?? (title ? "section" : "div")}
      spacing={spacing}
      labelledBy={titleId}
      id={id}
      className={className}
    >
      <Container size={media ? "lg" : "md"}>
        {title ? (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        ) : null}

        <div
          className={cn(
            surfaces[variant],
            media &&
              "grid items-center gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-8",
              align === "center" && !media && "items-center",
            )}
          >
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={logoAlt}
                loading="lazy"
                decoding="async"
                className="h-7 w-auto object-contain opacity-70"
              />
            ) : null}

            <Testimonial
              {...item}
              image={image}
              size="lg"
              variant="plain"
              className={cn(align === "center" && !media && "items-center text-center")}
            />

            {children}
          </div>

          {media ? <div className="min-w-0">{media}</div> : null}
        </div>
      </Container>
    </Section>
  )
}
