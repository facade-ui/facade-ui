/**
 * TestimonialsGrid — a wall of customer quotes.
 *
 * `columns="masonry"` uses CSS multi-column, which keeps ragged quote lengths
 * from leaving a row of tall gaps. That is safe here in a way `grid-auto-flow:
 * dense` is not: multi-column flows items in document order down each column,
 * so reading order and visual order still agree.
 *
 * a11y: a `<ul>` of `<li>`s, each holding a `Testimonial` — which is a
 * `<figure>` with the quote in a `<blockquote>` and the attribution in a
 * `<figcaption>` outside it, because the person's name is not part of what they
 * said. Ratings are announced as "Rated 5 out of 5", not as five star icons.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/section, @registry/ui/section-header,
 * @registry/ui/testimonial.
 */

import type { ElementType } from "react"

import type { ImageComponent, ListSlotProps, SectionBaseProps } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"
import { Testimonial, type TestimonialItem } from "@registry/ui/testimonial"

export interface TestimonialsGridProps extends SectionBaseProps, ListSlotProps {
  items: TestimonialItem[]
  title?: string
  eyebrow?: string
  description?: string
  image?: ImageComponent
  /** `masonry` flows in columns, so uneven quote lengths do not leave gaps. */
  columns?: 2 | 3 | "masonry"
  variant?: "card" | "plain"
  align?: "start" | "center"
}

export function TestimonialsGrid({
  items,
  title,
  eyebrow,
  description,
  image,
  columns = 3,
  variant = "card",
  align = "center",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: TestimonialsGridProps) {
  const List = (listAs ?? "ul") as ElementType
  const Item = (itemAs ?? "li") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const masonry = columns === "masonry"

  return (
    <Section
      as={as ?? (title ? "section" : "div")}
      spacing={spacing}
      labelledBy={titleId}
      id={id}
      className={className}
    >
      <Container className="flex flex-col gap-14">
        {title ? (
          <SectionHeader
            align={align}
            eyebrow={eyebrow}
            title={title}
            description={description}
            headingLevel={headingLevel}
            titleId={titleId}
          />
        ) : null}

        <List
          className={cn(
            masonry
              ? "gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid"
              : "grid gap-6",
            !masonry && columns === 2 && "sm:grid-cols-2",
            !masonry && columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {items.map((item, index) => (
            <Item key={item.id ?? `${item.author.name}-${index}`}>
              <Testimonial {...item} image={image} variant={variant} />
            </Item>
          ))}
        </List>
      </Container>
    </Section>
  )
}
