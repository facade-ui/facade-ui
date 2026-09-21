/**
 * UspList — three or four short value propositions, each an icon and a line.
 *
 * The narrowest of the feature sections on purpose: a USP strip earns its place
 * by being scannable, so the copy is deliberately constrained to a title and a
 * sentence. Reach for `FeatureGrid` when items need more room than that.
 *
 * a11y: a real `<ul>`. Icons are decorative and hidden — the title beside each
 * one carries the meaning — which `FeatureIcon` enforces rather than trusting
 * each caller to remember.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/feature-icon, @registry/ui/heading,
 * @registry/ui/section, @registry/ui/section-header.
 */

import type { ElementType } from "react"

import type {
  HeadingLevel,
  IconComponent,
  ListSlotProps,
  SectionBaseProps,
} from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { FeatureIcon } from "@registry/ui/feature-icon"
import { Heading } from "@registry/ui/heading"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface UspItem {
  title: string
  description: string
  icon?: IconComponent
}

export interface UspListProps extends SectionBaseProps, ListSlotProps {
  items: UspItem[]
  title?: string
  eyebrow?: string
  description?: string
  /** Outline level of each item's title. Defaults to one below the section. */
  itemHeadingLevel?: HeadingLevel
  /** `stacked` puts the icon above the copy; `inline` puts it beside. */
  layout?: "inline" | "stacked"
  iconVariant?: "soft" | "solid" | "outline" | "plain"
  align?: "start" | "center"
}

export function UspList({
  items,
  title,
  eyebrow,
  description,
  itemHeadingLevel,
  layout = "inline",
  iconVariant = "soft",
  align = "start",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: UspListProps) {
  const List = (listAs ?? "ul") as ElementType
  const Item = (itemAs ?? "li") as ElementType
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
            "grid gap-10 sm:gap-8",
            items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3",
          )}
        >
          {items.map((item) => (
            <Item
              key={item.title}
              className={cn(
                "flex gap-4",
                layout === "stacked" ? "flex-col" : "flex-row",
                align === "center" && "items-center text-center",
                align === "center" && layout === "inline" && "flex-col",
              )}
            >
              {item.icon ? <FeatureIcon icon={item.icon} variant={iconVariant} /> : null}
              <div className="flex flex-col gap-1.5">
                <Heading level={itemLevel} className="text-foreground font-semibold">
                  {item.title}
                </Heading>
                <p className="text-muted-foreground text-pretty text-sm">
                  {item.description}
                </p>
              </div>
            </Item>
          ))}
        </List>
      </Container>
    </Section>
  )
}
