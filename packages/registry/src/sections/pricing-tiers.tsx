/**
 * PricingTiers — the plan comparison as a row of cards.
 *
 * Each tier is a `PricingTier`, which handles the details that make pricing
 * genuinely hard to read aloud: a spoken form for the price, "Not included"
 * said in words rather than implied by a grey cross, and the recommended flag
 * as text rather than as a coloured border.
 *
 * The optional billing toggle is deliberately *not* built in. A monthly/yearly
 * switch changes prices, which means the parent already owns that state — and a
 * section that owned it would have to own the pricing data model too. Pass the
 * control through `toggle` and swap the `items` you hand in.
 *
 * a11y: a `<ul>` of plans. The toggle slot sits between the header and the list
 * so it is reached before the prices it changes, in both reading and tab order.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/pricing-tier, @registry/ui/section,
 * @registry/ui/section-header.
 */

import type { ElementType, ReactNode } from "react"

import type {
  HeadingLevel,
  LinkComponent,
  ListSlotProps,
  SectionBaseProps,
} from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { PricingTier, type PricingTierItem } from "@registry/ui/pricing-tier"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface PricingTiersProps extends SectionBaseProps, ListSlotProps {
  items: PricingTierItem[]
  title?: string
  eyebrow?: string
  description?: string
  link?: LinkComponent
  /** A billing-period switch, rendered above the plans. */
  toggle?: ReactNode
  /** Small print under the plans. */
  note?: ReactNode
  tierHeadingLevel?: HeadingLevel
  align?: "start" | "center"
}

export function PricingTiers({
  items,
  title,
  eyebrow,
  description,
  link,
  toggle,
  note,
  tierHeadingLevel,
  align = "center",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: PricingTiersProps) {
  const List = (listAs ?? "ul") as ElementType
  const Item = (itemAs ?? "li") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const tierLevel = tierHeadingLevel ?? (Math.min(headingLevel + 1, 6) as HeadingLevel)

  const columns =
    items.length <= 2
      ? "sm:grid-cols-2"
      : items.length === 3
        ? "lg:grid-cols-3"
        : "sm:grid-cols-2 xl:grid-cols-4"

  return (
    <Section
      as={as ?? (title ? "section" : "div")}
      spacing={spacing}
      labelledBy={titleId}
      id={id}
      className={className}
    >
      <Container className="flex flex-col gap-12">
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

        {toggle ? (
          <div
            className={cn(
              "flex",
              align === "center" ? "justify-center" : "justify-start",
            )}
          >
            {toggle}
          </div>
        ) : null}

        <List className={cn("grid items-stretch gap-6", columns)}>
          {items.map((item) => (
            // The `li` stretches and the card fills it. Deliberately not
            // `display: contents` on the `li`, which has a history of dropping
            // list semantics in the accessibility tree.
            <Item key={item.name} className="flex">
              <PricingTier
                {...item}
                as="div"
                link={link}
                headingLevel={tierLevel}
                className="w-full"
              />
            </Item>
          ))}
        </List>

        {note ? (
          <p
            className={cn(
              "text-muted-foreground text-pretty text-sm",
              align === "center" && "text-center",
            )}
          >
            {note}
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
