/**
 * BentoGrid — a mosaic of feature tiles at mixed sizes.
 *
 * Each item declares how much room it wants (`span`), and the grid resolves that
 * into column and row spans at `sm` and up. Below `sm` everything stacks: a
 * bento layout at phone width is just a list, and pretending otherwise produces
 * unreadable tiles.
 *
 * a11y: a `<ul>` whose visual order matches DOM order — no `grid-auto-flow:
 * dense`, and no manual `order`. Dense packing reorders tiles visually without
 * touching the DOM, which is exactly the mismatch between reading order and
 * visual order that WCAG 1.3.2 exists to prevent. Tiles are laid out in the
 * order they are given; to change the mosaic, change the array.
 *
 * Clickable tiles use the same stretched-link pattern as FeatureGrid, so the
 * accessible name stays the tile's title rather than its whole body.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/feature-icon, @registry/ui/heading,
 * @registry/ui/section, @registry/ui/section-header.
 */

import type { ElementType, ReactNode } from "react"

import type {
  HeadingLevel,
  IconComponent,
  LinkComponent,
  ListSlotProps,
  SectionBaseProps,
} from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { FeatureIcon } from "@registry/ui/feature-icon"
import { Heading } from "@registry/ui/heading"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

/** How much of the mosaic a tile occupies at `sm` and above. */
export type BentoSpan = "sm" | "md" | "lg" | "tall" | "wide"

export interface BentoItem {
  title: string
  description?: string
  icon?: IconComponent
  span?: BentoSpan
  /** Rendered inside the tile, under the copy. A screenshot, a chart, a list. */
  media?: ReactNode
  href?: string
  external?: boolean
  id?: string
}

export interface BentoGridProps extends SectionBaseProps, ListSlotProps {
  items: BentoItem[]
  title?: string
  eyebrow?: string
  description?: string
  link?: LinkComponent
  itemHeadingLevel?: HeadingLevel
  align?: "start" | "center"
}

/** The grid is six columns at `sm`; spans are expressed against that. */
const spans: Record<BentoSpan, string> = {
  sm: "sm:col-span-2",
  md: "sm:col-span-3",
  lg: "sm:col-span-4",
  wide: "sm:col-span-6",
  tall: "sm:col-span-2 sm:row-span-2",
}

export function BentoGrid({
  items,
  title,
  eyebrow,
  description,
  link,
  itemHeadingLevel,
  align = "start",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: BentoGridProps) {
  const List = (listAs ?? "ul") as ElementType
  const Item = (itemAs ?? "li") as ElementType
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

        <List className="grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 sm:grid-cols-6">
          {items.map((item) => (
            <Item
              key={item.id ?? item.title}
              className={cn(
                "bg-card text-card-foreground relative flex flex-col gap-3 overflow-hidden rounded-xl border p-6",
                spans[item.span ?? "md"],
                item.href &&
                  "duration-facade-fast ease-facade-out hover:border-ring has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-background transition-colors has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-offset-2",
              )}
            >
              {item.icon ? <FeatureIcon icon={item.icon} size="sm" /> : null}

              <Heading
                level={itemLevel}
                className="text-foreground text-balance font-semibold"
              >
                {item.href ? (
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
                ) : (
                  item.title
                )}
              </Heading>

              {item.description ? (
                <p className="text-muted-foreground text-pretty text-sm">
                  {item.description}
                </p>
              ) : null}

              {item.media ? (
                <div className="mt-auto min-w-0 pt-2">{item.media}</div>
              ) : null}
            </Item>
          ))}
        </List>
      </Container>
    </Section>
  )
}
