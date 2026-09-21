/**
 * Steps — a numbered sequence: how it works, onboarding, a process.
 *
 * a11y: an ordered list, because the order is the information. That also means
 * the step numbers do not need to be announced separately — a screen reader
 * already says "1 of 4" for an `<ol>` item — so the large numeral shown beside
 * each step is `aria-hidden`. Announcing it as well would read "one, one,
 * connect your repository".
 *
 * `orientation="horizontal"` draws a connector between steps. It is a
 * background decoration on the list, never an element of its own, so it adds
 * nothing to the accessibility tree.
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

export interface StepItem {
  title: string
  description: string
  /** Replaces the numeral with an icon. */
  icon?: IconComponent
}

export interface StepsProps extends SectionBaseProps, ListSlotProps {
  items: StepItem[]
  title?: string
  eyebrow?: string
  description?: string
  itemHeadingLevel?: HeadingLevel
  orientation?: "horizontal" | "vertical"
  align?: "start" | "center"
}

export function Steps({
  items,
  title,
  eyebrow,
  description,
  itemHeadingLevel,
  orientation = "horizontal",
  align = "center",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: StepsProps) {
  // Ordered, because the order is the content.
  const List = (listAs ?? "ol") as ElementType
  const Item = (itemAs ?? "li") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const itemLevel = itemHeadingLevel ?? (Math.min(headingLevel + 1, 6) as HeadingLevel)
  const horizontal = orientation === "horizontal"

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
            horizontal
              ? cn(
                  "grid gap-10 sm:gap-8",
                  items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3",
                )
              : "flex flex-col gap-10",
          )}
        >
          {items.map((item, index) => (
            <Item
              key={item.title}
              className={cn(
                "relative flex gap-5",
                horizontal ? "flex-col" : "flex-row",
                horizontal && align === "center" && "items-center text-center",
              )}
            >
              <span className="relative flex shrink-0 items-center">
                {item.icon ? (
                  <FeatureIcon icon={item.icon} shape="circle" />
                ) : (
                  <span
                    aria-hidden
                    className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-full text-base font-semibold"
                  >
                    {index + 1}
                  </span>
                )}
                {/* Decoration only: the sequence is carried by the <ol>. */}
                {index < items.length - 1 ? (
                  <span
                    aria-hidden
                    className={cn(
                      "bg-border absolute",
                      horizontal
                        ? "left-full ml-3 hidden h-px w-[calc(100%+1rem)] sm:block"
                        : "left-1/2 top-full mt-3 h-[calc(100%+0.5rem)] w-px -translate-x-1/2",
                    )}
                  />
                ) : null}
              </span>

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
