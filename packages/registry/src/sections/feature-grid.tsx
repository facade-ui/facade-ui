/**
 * FeatureGrid — a grid of feature cards, two to four across.
 *
 * Each item may carry an icon, a title, body copy, and an optional link. When an
 * item has an `href`, the whole card becomes clickable through a stretched
 * overlay rather than by wrapping the card in an anchor.
 *
 * a11y: the stretched-link pattern is used deliberately. Wrapping a card in an
 * `<a>` puts every word of body copy inside the link text, so the accessible
 * name becomes a paragraph; putting the anchor on the title and stretching its
 * hit area with a pseudo-element keeps the name short while making the whole
 * card clickable. The focus ring follows the card, not the title, via
 * `has-[a:focus-visible]`.
 *
 * Dependencies: lucide-react, react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/feature-icon, @registry/ui/heading,
 * @registry/ui/section, @registry/ui/section-header.
 */

import { ArrowRightIcon } from "lucide-react"
import type { ElementType } from "react"

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

export interface FeatureItem {
  title: string
  description: string
  icon?: IconComponent
  /** Makes the card clickable. The accessible name stays the title. */
  href?: string
  /** Label for the affordance under the copy. Defaults to "Learn more". */
  linkLabel?: string
  external?: boolean
}

export interface FeatureGridProps extends SectionBaseProps, ListSlotProps {
  items: FeatureItem[]
  title?: string
  eyebrow?: string
  description?: string
  link?: LinkComponent
  columns?: 2 | 3 | 4
  itemHeadingLevel?: HeadingLevel
  /** `card` draws a bordered surface; `plain` sits directly on the background. */
  variant?: "card" | "plain"
  iconVariant?: "soft" | "solid" | "outline" | "plain"
  align?: "start" | "center"
}

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const

export function FeatureGrid({
  items,
  title,
  eyebrow,
  description,
  link,
  columns = 3,
  itemHeadingLevel,
  variant = "card",
  iconVariant = "soft",
  align = "start",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: FeatureGridProps) {
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

        <List className={cn("grid gap-6", columnClasses[columns])}>
          {items.map((item) => (
            <Item
              key={item.title}
              className={cn(
                "relative flex flex-col gap-4",
                variant === "card" &&
                  "bg-card text-card-foreground rounded-xl border p-6",
                item.href &&
                  "duration-facade-fast ease-facade-out hover:border-ring has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-background transition-colors has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-offset-2",
              )}
            >
              {item.icon ? <FeatureIcon icon={item.icon} variant={iconVariant} /> : null}

              <Heading level={itemLevel} className="text-foreground font-semibold">
                {item.href ? (
                  <Link
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    // The overlay makes the card clickable while the accessible
                    // name stays just the title.
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

              <p className="text-muted-foreground flex-1 text-pretty text-sm">
                {item.description}
              </p>

              {item.href ? (
                <p
                  aria-hidden
                  className="text-foreground flex items-center gap-1.5 text-sm font-medium"
                >
                  {item.linkLabel ?? "Learn more"}
                  <ArrowRightIcon className="size-4" />
                </p>
              ) : null}
            </Item>
          ))}
        </List>
      </Container>
    </Section>
  )
}
