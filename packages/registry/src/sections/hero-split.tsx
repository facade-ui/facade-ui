/**
 * HeroSplit — copy on one side, media on the other.
 *
 * `media` is a plain `ReactNode` slot rather than an image prop, because a split
 * hero's media is a one-off: a screenshot, a video, an illustration, a live
 * demo. Passing `<Image … />` straight in is simpler than any indirection this
 * file could offer, and it keeps the section free of framework imports.
 *
 * a11y: on narrow screens the copy comes first in both DOM and visual order, so
 * reading order and tab order agree. `reverse` swaps the columns on large
 * screens only, with `lg:order-*`, which keeps that guarantee intact — reversing
 * the DOM instead would put the media ahead of the headline for screen readers.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/cta-group, @registry/ui/eyebrow,
 * @registry/ui/heading, @registry/ui/section.
 */

import type { ElementType, ReactNode } from "react"

import type {
  CtaItem,
  HeadingLevel,
  LinkComponent,
  StackSlotProps,
} from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { CtaGroup } from "@registry/ui/cta-group"
import { Eyebrow } from "@registry/ui/eyebrow"
import { Heading } from "@registry/ui/heading"
import { Section } from "@registry/ui/section"

export interface HeroSplitProps extends StackSlotProps {
  title: string
  description?: string
  eyebrow?: ReactNode
  actions?: CtaItem[]
  link?: LinkComponent
  note?: ReactNode
  banner?: ReactNode
  /** The right-hand column. Pass `<Image />`, a video, or anything else. */
  media?: ReactNode
  /** Extra content under the buttons — a logo strip, a stat row. */
  children?: ReactNode
  /** Puts the media on the left at `lg` and up. Does not change DOM order. */
  reverse?: boolean
  headingLevel?: HeadingLevel
  size?: "md" | "lg"
  as?: "section" | "div"
  spacing?: "sm" | "md" | "lg" | "none"
  className?: string
  id?: string
}

const titleSizes = { md: "text-display-sm", lg: "text-display-md" } as const

export function HeroSplit({
  title,
  description,
  eyebrow,
  actions,
  link,
  note,
  banner,
  media,
  children,
  reverse = false,
  stackAs,
  blockAs,
  headingLevel = 1,
  size = "lg",
  as = "div",
  spacing = "lg",
  className,
  id,
}: HeroSplitProps) {
  const Stack = (stackAs ?? "div") as ElementType
  const Block = (blockAs ?? "div") as ElementType
  const titleId = id ? `${id}-title` : slugId(title)

  return (
    <Section
      as={as}
      spacing={spacing}
      labelledBy={as === "section" ? titleId : undefined}
      id={id}
      className={className}
    >
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Stack className={cn("flex flex-col gap-6", reverse && "lg:order-2")}>
          {banner ? <Block>{banner}</Block> : null}
          {eyebrow ? (
            <Block>
              <Eyebrow tone="primary">{eyebrow}</Eyebrow>
            </Block>
          ) : null}

          <Block>
            <Heading
              level={headingLevel}
              id={titleId}
              className={cn("text-balance font-semibold", titleSizes[size])}
            >
              {title}
            </Heading>
          </Block>

          {description ? (
            <Block>
              <p className="text-muted-foreground text-pretty text-lg">{description}</p>
            </Block>
          ) : null}

          {actions?.length ? (
            <Block>
              <CtaGroup items={actions} link={link} size="lg" stackOnMobile />
            </Block>
          ) : null}

          {note ? (
            <Block>
              <p className="text-muted-foreground text-pretty text-sm">{note}</p>
            </Block>
          ) : null}

          {children ? <Block>{children}</Block> : null}
        </Stack>

        {media ? (
          <div className={cn("min-w-0", reverse && "lg:order-1")}>{media}</div>
        ) : null}
      </Container>
    </Section>
  )
}
