/**
 * HeroWithMedia — centred copy over a full-bleed background, or above a wide
 * framed screenshot.
 *
 * Two shapes, one component, because they differ only in where the media sits:
 * `overlay` puts it behind the copy, `below` puts it under.
 *
 * a11y: `overlay` is the easiest hero to get wrong. Text over an arbitrary image
 * has no predictable contrast ratio, so the overlay variant always paints a
 * scrim between the media and the copy, and the copy switches to a fixed
 * light-on-dark pair rather than inheriting theme colours that might be dark on
 * dark. The scrim is opinionated on purpose — `overlayClassName` can tune it,
 * but it cannot be removed by accident.
 *
 * Background media is decorative by definition here: it carries no information
 * the copy does not, so pass it with `alt=""`.
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

export interface HeroWithMediaProps extends StackSlotProps {
  title: string
  description?: string
  eyebrow?: ReactNode
  actions?: CtaItem[]
  link?: LinkComponent
  note?: ReactNode
  /** The media. Decorative in `overlay` mode, so give it `alt=""`. */
  media: ReactNode
  /** `overlay` puts media behind the copy; `below` puts it underneath. */
  placement?: "overlay" | "below"
  /** Tunes the scrim. Applied over the media, under the copy. */
  overlayClassName?: string
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

export function HeroWithMedia({
  title,
  description,
  eyebrow,
  actions,
  link,
  note,
  media,
  placement = "overlay",
  overlayClassName,
  stackAs,
  blockAs,
  headingLevel = 1,
  size = "lg",
  as = "div",
  spacing = "lg",
  className,
  id,
}: HeroWithMediaProps) {
  const Stack = (stackAs ?? "div") as ElementType
  const Block = (blockAs ?? "div") as ElementType
  const titleId = id ? `${id}-title` : slugId(title)
  const overlay = placement === "overlay"

  const copy = (
    <Stack
      className={cn(
        "flex max-w-3xl flex-col items-center gap-6 text-center",
        // Over media, contrast cannot be inherited from the theme — it has to be
        // guaranteed against the scrim.
        overlay && "text-white",
      )}
    >
      {eyebrow ? (
        <Block>
          <Eyebrow
            tone={overlay ? "foreground" : "primary"}
            className={overlay ? "text-white/85" : undefined}
          >
            {eyebrow}
          </Eyebrow>
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
          <p
            className={cn(
              "max-w-2xl text-pretty text-lg sm:text-xl",
              overlay ? "text-white/90" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        </Block>
      ) : null}

      {actions?.length ? (
        <Block className="w-full sm:w-auto">
          <CtaGroup items={actions} link={link} size="lg" align="center" stackOnMobile />
        </Block>
      ) : null}

      {note ? (
        <Block>
          <p
            className={cn(
              "text-pretty text-sm",
              overlay ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {note}
          </p>
        </Block>
      ) : null}
    </Stack>
  )

  if (!overlay) {
    return (
      <Section
        as={as}
        spacing={spacing}
        labelledBy={as === "section" ? titleId : undefined}
        id={id}
        className={className}
      >
        <Container className="flex flex-col items-center gap-14">
          {copy}
          <div className="w-full overflow-hidden rounded-2xl border shadow-sm">
            {media}
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section
      as={as}
      spacing={spacing}
      labelledBy={as === "section" ? titleId : undefined}
      id={id}
      className={cn("isolate overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-20 [&_img]:size-full [&_img]:object-cover [&_video]:size-full [&_video]:object-cover"
      >
        {media}
      </div>
      {/* Always present: text over arbitrary media has no guaranteed ratio. */}
      <div
        aria-hidden
        className={cn("absolute inset-0 -z-10 bg-black/65", overlayClassName)}
      />
      <Container className="flex flex-col items-center py-10">{copy}</Container>
    </Section>
  )
}
