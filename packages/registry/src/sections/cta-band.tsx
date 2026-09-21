/**
 * CtaBand — the closing call to action.
 *
 * a11y: `variant="primary"` inverts the band, so it pairs `--primary` with
 * `--primary-foreground` rather than reaching for an arbitrary tint. That is the
 * one colour pair the token layer guarantees at 4.5:1 in every preset and both
 * modes, and `scripts/check-contrast.ts` keeps it that way.
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

export interface CtaBandProps extends StackSlotProps {
  title: string
  description?: string
  eyebrow?: ReactNode
  actions?: CtaItem[]
  link?: LinkComponent
  note?: ReactNode
  /** `muted` and `card` sit inside the container; `primary` inverts the band. */
  variant?: "muted" | "card" | "primary" | "plain"
  /** `center` stacks everything; `split` puts the buttons beside the copy. */
  layout?: "center" | "split"
  headingLevel?: HeadingLevel
  as?: "section" | "div"
  spacing?: "sm" | "md" | "lg" | "none"
  className?: string
  id?: string
}

const surfaces = {
  muted: "bg-muted text-foreground",
  card: "bg-card text-card-foreground border",
  primary: "bg-primary text-primary-foreground",
  plain: "",
} as const

export function CtaBand({
  title,
  description,
  eyebrow,
  actions,
  link,
  note,
  variant = "muted",
  layout = "center",
  stackAs,
  blockAs,
  headingLevel = 2,
  as = "section",
  spacing = "md",
  className,
  id,
}: CtaBandProps) {
  const Stack = (stackAs ?? "div") as ElementType
  const Block = (blockAs ?? "div") as ElementType
  const titleId = id ? `${id}-title` : slugId(title)
  const inverted = variant === "primary"
  const centered = layout === "center"

  return (
    <Section
      as={as}
      spacing={spacing}
      labelledBy={as === "section" ? titleId : undefined}
      id={id}
      className={className}
    >
      <Container>
        <div
          className={cn(
            "rounded-2xl px-6 py-14 sm:px-12",
            surfaces[variant],
            variant === "plain" && "px-0 py-0",
          )}
        >
          <Stack
            className={cn(
              "flex flex-col gap-6",
              centered
                ? "items-center text-center"
                : "lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:text-left",
            )}
          >
            <Block
              className={cn(
                "flex flex-col gap-4",
                centered ? "items-center" : "max-w-2xl",
              )}
            >
              {eyebrow ? (
                <Eyebrow
                  tone={inverted ? "foreground" : "primary"}
                  className={inverted ? "text-primary-foreground/80" : undefined}
                >
                  {eyebrow}
                </Eyebrow>
              ) : null}

              <Heading
                level={headingLevel}
                id={titleId}
                className="text-display-sm text-balance font-semibold"
              >
                {title}
              </Heading>

              {description ? (
                <p
                  className={cn(
                    "text-pretty text-lg",
                    inverted ? "text-primary-foreground/85" : "text-muted-foreground",
                    centered && "max-w-2xl",
                  )}
                >
                  {description}
                </p>
              ) : null}
            </Block>

            {actions?.length ? (
              <Block
                className={cn(
                  "flex flex-col gap-3",
                  centered && "w-full items-center sm:w-auto",
                )}
              >
                <CtaGroup
                  items={
                    inverted
                      ? actions.map((action, index) => ({
                          ...action,
                          // On an inverted band the theme's primary button would
                          // disappear into the surface it sits on.
                          variant:
                            action.variant ?? (index === 0 ? "secondary" : "ghost"),
                        }))
                      : actions
                  }
                  link={link}
                  size="lg"
                  align={centered ? "center" : "start"}
                  stackOnMobile
                />
                {note ? (
                  <p
                    className={cn(
                      "text-pretty text-sm",
                      inverted ? "text-primary-foreground/75" : "text-muted-foreground",
                      centered && "text-center",
                    )}
                  >
                    {note}
                  </p>
                ) : null}
              </Block>
            ) : null}
          </Stack>
        </div>
      </Container>
    </Section>
  )
}
