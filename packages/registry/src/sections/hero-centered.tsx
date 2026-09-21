/**
 * HeroCentered — the classic centred landing hero: eyebrow, headline, copy,
 * buttons, and optional media below.
 *
 * a11y: `headingLevel` defaults to `1`, because a hero usually *is* the page
 * title — but it stays a prop, so the same component can be an `<h2>` further
 * down a page without its appearance changing. `size` controls the visual scale
 * independently.
 *
 * The band is a `<div>`, not a `<section>`: a hero at the top of a page is the
 * start of `<main>`, and wrapping it in a second landmark only adds noise to the
 * landmark list.
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

export interface HeroCenteredProps extends StackSlotProps {
  title: string
  description?: string
  eyebrow?: ReactNode
  actions?: CtaItem[]
  link?: LinkComponent
  /** Small print under the buttons — "No card required", and so on. */
  note?: ReactNode
  /** Rendered above the eyebrow. A Badge, an announcement pill, a rating. */
  banner?: ReactNode
  /** Rendered below the buttons. A screenshot, a video, a logo strip. */
  media?: ReactNode
  headingLevel?: HeadingLevel
  size?: "md" | "lg" | "xl"
  as?: "section" | "div"
  spacing?: "sm" | "md" | "lg" | "none"
  className?: string
  id?: string
}

const titleSizes = {
  md: "text-display-md",
  lg: "text-display-lg",
  xl: "text-display-xl",
} as const

export function HeroCentered({
  title,
  description,
  eyebrow,
  actions,
  link,
  note,
  banner,
  media,
  stackAs,
  blockAs,
  headingLevel = 1,
  size = "lg",
  as = "div",
  spacing = "lg",
  className,
  id,
}: HeroCenteredProps) {
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
      <Container className="flex flex-col items-center gap-12">
        <Stack className="flex max-w-3xl flex-col items-center gap-6 text-center">
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
              <p className="text-muted-foreground max-w-2xl text-pretty text-lg sm:text-xl">
                {description}
              </p>
            </Block>
          ) : null}

          {actions?.length ? (
            <Block className="w-full sm:w-auto">
              <CtaGroup
                items={actions}
                link={link}
                size="lg"
                align="center"
                stackOnMobile
              />
            </Block>
          ) : null}

          {note ? (
            <Block>
              <p className="text-muted-foreground text-pretty text-sm">{note}</p>
            </Block>
          ) : null}
        </Stack>

        {media ? <div className="w-full">{media}</div> : null}
      </Container>
    </Section>
  )
}
