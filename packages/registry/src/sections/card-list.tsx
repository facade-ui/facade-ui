/**
 * CardList — a grid of linked cards: blog posts, changelog entries, case studies.
 *
 * The generic "list of things with an image, a title and a date" section that
 * every marketing site needs and that does not warrant its own component per
 * content type.
 *
 * a11y: same stretched-link pattern as `FeatureGrid` — the anchor sits on the
 * title and its hit area covers the card, so the accessible name is the title
 * rather than the title plus the excerpt plus the date. Dates are `<time>` with
 * a machine-readable `dateTime`, and the human label is whatever you pass, so a
 * relative label like "3 days ago" stays unambiguous.
 *
 * Cover images are `alt=""` by default: on a card whose title is right there,
 * the image is decoration. Pass `imageAlt` when it genuinely carries meaning.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/badge, @registry/ui/container, @registry/ui/heading,
 * @registry/ui/section, @registry/ui/section-header.
 */

import type { ElementType } from "react"

import type {
  HeadingLevel,
  ImageComponent,
  LinkComponent,
  ListSlotProps,
  SectionBaseProps,
} from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Badge } from "@registry/ui/badge"
import { Container } from "@registry/ui/container"
import { Heading } from "@registry/ui/heading"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface CardItem {
  title: string
  href: string
  description?: string
  imageSrc?: string
  /** Only set this when the image carries meaning the title does not. */
  imageAlt?: string
  /** ISO 8601, for the `datetime` attribute. */
  dateTime?: string
  /** Human label for the date, e.g. "12 March 2026" or "3 days ago". */
  dateLabel?: string
  tag?: string
  external?: boolean
  id?: string
}

export interface CardListProps extends SectionBaseProps, ListSlotProps {
  items: CardItem[]
  title?: string
  eyebrow?: string
  description?: string
  image?: ImageComponent
  link?: LinkComponent
  columns?: 2 | 3
  /** `card` gives each entry a surface; `plain` is a bare list. */
  variant?: "card" | "plain"
  itemHeadingLevel?: HeadingLevel
  align?: "start" | "center"
}

export function CardList({
  items,
  title,
  eyebrow,
  description,
  image,
  link,
  columns = 3,
  variant = "card",
  itemHeadingLevel,
  align = "start",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: CardListProps) {
  const List = (listAs ?? "ul") as ElementType
  const Item = (itemAs ?? "li") as ElementType
  const Image = (image ?? "img") as ElementType
  const Link = (link ?? "a") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const itemLevel = itemHeadingLevel ?? (Math.min(headingLevel + 1, 6) as HeadingLevel)

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
            "grid gap-6",
            columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {items.map((item) => (
            <Item
              key={item.id ?? item.href}
              className={cn(
                "group relative flex flex-col gap-4 overflow-hidden",
                variant === "card" && "bg-card text-card-foreground rounded-xl border",
                "duration-facade-fast ease-facade-out transition-colors",
                variant === "card" && "hover:border-ring",
                "has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-background has-[a:focus-visible]:rounded-xl has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-offset-2",
              )}
            >
              {item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt ?? ""}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "bg-muted aspect-[16/9] w-full object-cover",
                    variant === "plain" && "rounded-xl",
                  )}
                />
              ) : null}

              <div
                className={cn(
                  "flex flex-1 flex-col gap-3",
                  variant === "card" && "p-6 pt-2",
                )}
              >
                {item.tag || item.dateLabel ? (
                  <p className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                    {item.tag ? (
                      <Badge variant="muted" size="sm">
                        {item.tag}
                      </Badge>
                    ) : null}
                    {item.dateLabel ? (
                      <time dateTime={item.dateTime}>{item.dateLabel}</time>
                    ) : null}
                  </p>
                ) : null}

                <Heading
                  level={itemLevel}
                  className="text-foreground text-balance font-semibold"
                >
                  <Link
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {item.title}
                    {item.external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </Link>
                </Heading>

                {item.description ? (
                  <p className="text-muted-foreground text-pretty text-sm">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </Item>
          ))}
        </List>
      </Container>
    </Section>
  )
}
